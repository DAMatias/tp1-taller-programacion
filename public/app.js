document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('conceptoForm');
    const lista = document.getElementById('listaConceptos');
    const btnEliminarTodos = document.getElementById('btnEliminarTodos');

    function cargarConceptos() {
        //Petición GET
        fetch('/api/conceptos')
            .then(response => response.json())
            .then(conceptos => {
                lista.innerHTML = '';
            
                if (conceptos.length === 0) {
                    lista.innerHTML = '<li>No hay conceptos guardados aún.</li>';
                    return;
                }

                conceptos.forEach(concepto => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div>
                            <strong>${concepto.nombre}</strong>
                            <p>${concepto.descripcion}</p>
                        </div>
                        <button class="btn-eliminar" data-id="${concepto.id}">Eliminar</button>
                    `;
                    lista.appendChild(li);
                });

                document.querySelectorAll('.btn-eliminar').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        eliminarConcepto(id);
                    });
                });
            })
            .catch(error => console.error('Error al cargar:', error));
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const data = { nombre, descripcion };

        fetch('/api/conceptos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(() => {
            form.reset();
            cargarConceptos();
        })
        .catch(error => console.error('Error:', error));
    });

    //(DELETE /id)
    function eliminarConcepto(id) {
        fetch(`/api/conceptos/${id}`, {
            method: 'DELETE'
        })
        .then(() => cargarConceptos())
        .catch(error => console.error('Error:', error));
    }

    //(DELETE)
    btnEliminarTodos.addEventListener('click', () => {
        if(confirm('¿Estás seguro de eliminar todos los conceptos?')) {
            fetch('/api/conceptos', {
                method: 'DELETE'
            })
            .then(() => cargarConceptos())
            .catch(error => console.error('Error:', error));
        }
    });

    cargarConceptos();
});