const http = require('http');
const fs = require('fs');
const path = require('path');

let conceptos = [];
let nextId = 1;
const PORT = 3000;

const server = http.createServer((req, res) => {    
    console.log(`Petición recibida: ${req.method} ${req.url}`);
    
    if (req.url === '/' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor al leer el HTML');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Error 404: Ruta no encontrada');
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`);
});