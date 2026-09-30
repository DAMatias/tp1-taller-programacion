const http = require('http');
const fs = require('fs');
const url = require('url');
const mysql = require('mysql2');

//let conceptos = [];
let nextId = 1;
const PORT = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gallina132.',
    database: 'tp_taller'
});

connection.connect((err) => {
    if(err) {
        console.error('Error conectando a la base de datos: ', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});

connection.end();

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'GET' && pathname === '/') {
        fs.readFile('public/index.html', (err, data) => {
            if (err) { res.writeHead(500); res.end('Error'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } 
    else if (req.method === 'GET' && pathname === '/styles.css') {
        fs.readFile('public/styles.css', (err, data) => {
            if (err) { res.writeHead(500); res.end('Error'); return; }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });
    } 
    else if (req.method === 'GET' && pathname === '/app.js') {
        fs.readFile('public/app.js', (err, data) => {
            if (err) { res.writeHead(500); res.end('Error'); return; }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    }


    // GET
    else if (req.method === 'GET' && pathname === '/api/conceptos') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(conceptos));
    }
    
    // GET/id
    else if (req.method === 'GET' && pathname.startsWith('/api/conceptos/')) {
        const id = parseInt(pathname.split('/').pop());
        const concepto = conceptos.find(c => c.id === id);
        
        if (concepto) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(concepto));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Concepto no encontrado' }));
        }
    }
    
    // POST
    else if (req.method === 'POST' && pathname === '/api/conceptos') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        
        req.on('end', () => {
            try {
                const nuevoConcepto = JSON.parse(body);
                nuevoConcepto.id = nextId++;
                conceptos.push(nuevoConcepto);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Creado', data: nuevoConcepto }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'JSON inválido' }));
            }
        });
    }
    
    // DELETE
    else if (req.method === 'DELETE' && pathname === '/api/conceptos') {
        conceptos = [];
        nextId = 1;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Todos eliminados' }));
    }
    
    // DELETE/id
    else if (req.method === 'DELETE' && pathname.startsWith('/api/conceptos/')) {
        const id = parseInt(pathname.split('/').pop());
        const index = conceptos.findIndex(c => c.id === id);
        
        if (index !== -1) {
            conceptos.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Eliminado' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'No encontrado' }));
        }
    }
    
    // Ruta no encontrada
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Ruta no encontrada');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});