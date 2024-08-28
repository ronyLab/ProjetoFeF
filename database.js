const sqlite3 = require('sqlite3').verbose();

// Função para conectar ao banco de dados SQLite
function connectDatabase() {
    console.log('Tentando conectar ao banco de dados:', __dirname + '/BD/bd_fair.db');
    const db = new sqlite3.Database(__dirname + '/BD/bd_fair.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Erro ao abrir o banco de dados:', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite.');
        }
    });
    db.on('error', (err) => {
        console.error('Erro de banco de dados:', err.message);
    });
    return db;
}

// Função para buscar um usuário pelo nome de usuário e senha
function getUser(nome, senha, callback) {
    const db = connectDatabase();
    db.get('SELECT * FROM Usuarios WHERE Nome = ? AND Senha = ?', [nome, senha], (err, row) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err.message);
            callback(err, null);
        } else {
            console.log('Consulta executada com sucesso:', row);
            callback(null, row);
        }
        db.close(); // Fechar conexão após a execução da consulta
    });
}

module.exports = {
    connectDatabase,
    getUser
};
