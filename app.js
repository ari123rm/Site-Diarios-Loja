const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para permitir o uso de req.body
app.use(express.json());

// Servir arquivos estáticos da pasta 'public/css' para CSS
app.use('/css', express.static(path.join(__dirname, './public/css')));

// Servir arquivos estáticos da pasta 'public/js' para JavaScript
app.use('/js', express.static(path.join(__dirname, './public/js')));

// Rota para enviar o arquivo HTML
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'loja.html');
    res.sendFile(filePath);
});

// Rota para adicionar um novo usuário
app.post('/diarios', (req, res) => {
    const newUser = req.body; // assume que os dados do usuário são enviados no corpo da solicitação

    // Lê o arquivo JSON atual
    fs.readFile('./axeBamba.json', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo dos diarios:', err);
            res.status(500).send('Erro ao ler o arquivo de diarios.');
            return;
        }
    
        let users = JSON.parse(data);
        
        // Adiciona o novo usuário aos dados existentes
        users.push(newUser);

        // Escreve os dados atualizados no arquivo JSON
        fs.writeFile('./axeBamba.json', JSON.stringify(users, null, 4), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo de diarios:', err);
                res.status(500).send('Erro ao escrever no arquivo de diarios.');
                return;
            }
            res.status(200).send('Diarios adicionado com sucesso.');
        });
    });
});
// No seu aplicativo Node.js
app.post('/api/updateDiario', (req, res) => {
    const userData = req.body;
    const result = escrever_json(userData);
    res.json({ message: result });
});

// Rota para obter todos os usuários
app.get('/diarios', (req, res) => {
    fs.readFile('./axeBamba.json', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo de diarios:', err);
            res.status(500).send('Erro ao ler o arquivo de diarios.');
            return;
        }

        let users = JSON.parse(data);
        res.status(200).json(users);
    });
});
// Rota para criar as pastas para um novo usuário
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Função para ler o arquivo JSON
function ler_json() {
    return new Promise((resolve, reject) => {
        fs.readFile('./login.json', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo de usuários:', err);
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// Função para escrever no arquivo JSON
function escrever_json(usuarioS) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./axeBamba.json', JSON.stringify(usuarioS, null, 4), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo de usuários:', err);
                reject(err);
            } else {
                resolve('Usuário adicionado com sucesso.');
                console.log(usuarioS);
            }
        });
    });
}