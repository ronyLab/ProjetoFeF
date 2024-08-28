const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();
const { connectDatabase, getUser } = require("./database.js");

const db = new sqlite3.Database(__dirname + '/BD/bd_fair.db');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/site.html");
});

app.get("/login.html", function(req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.post("/login", function(req, res) {
    const { nome, senha } = req.body;

    getUser(nome, senha, function(err, user) {
        if (err) {
            res.status(500).send("Erro ao verificar as credenciais do usuário.");
        } else if (user) {
            res.redirect("/logado.html?nome=" + encodeURIComponent(user.Nome));
        } else {
            res.send(`
                <h1>Nome e/ou senha incorretos.</h1>
                <h1>Por favor, volte e tente novamente.</h1>
            `);
        }
    });
});

app.post("/cadastro", function(req, res) {
    const { firstname, lastname, email, number, password } = req.body;

    db.run('INSERT INTO Usuarios (Nome, Sobrenome, Email, Celular, Senha) VALUES (?, ?, ?, ?, ?)', [firstname, lastname, email, number, password], function(err) {
        if (err) {
            console.error('Erro ao inserir usuário:', err.message);
            res.status(500).send("Erro ao cadastrar usuário.");
        } else {
            console.log('Usuário cadastrado com sucesso:', this.lastID);
            res.redirect("/login.html");
        }
    });
});

app.get("/logado.html", function(req, res) {
    res.sendFile(__dirname + "/logado.html");
});

app.get("/perfil/:nome", function(req, res) {
    const nome = req.params.nome;
    const query = `SELECT * FROM Usuarios WHERE Nome = ?`;
    db.get(query, [nome], (err, row) => {
        if (err) {
            console.error('Erro ao buscar perfil do usuário:', err.message);
            res.status(500).send("Erro ao buscar perfil do usuário.");
        } else {
            console.log('Perfil do usuário encontrado:', row);
            res.json(row);
        }
    });
});

app.put("/atualizar-perfil/:nome", function(req, res) {
    const nome = req.params.nome;
    const novosDados = req.body;

    db.run('UPDATE Usuarios SET Nome = ?, Sobrenome = ?, Email = ?, Celular = ? WHERE Nome = ?', 
            [novosDados.Nome, novosDados.Sobrenome, novosDados.Email, novosDados.Celular, nome], 
            function(err) {
        if (err) {
            console.error('Erro ao atualizar perfil do usuário:', err.message);
            res.status(500).send("Erro ao atualizar perfil do usuário.");
        } else {
            console.log('Perfil do usuário atualizado com sucesso:', nome);
            res.json(novosDados);
        }
    });
});

app.get("/produtos/:nomeUsuario", function(req, res) {
    const nomeUsuario = req.params.nomeUsuario;
    const query = `SELECT * FROM Produtos WHERE NomeUsuario = ?`; 
    db.all(query, [nomeUsuario], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar produtos do usuário:', err.message);
            res.status(500).send("Erro ao buscar produtos do usuário.");
        } else {
            console.log('Produtos do usuário encontrados:', rows);
            res.json(rows);
        }
    });
});

app.post("/adicionar-produto", function(req, res) {
    const { nome, quantidade, preco, nomeUsuario } = req.body;
    const query = `INSERT INTO Produtos (Nome, Quantidade, Preco, NomeUsuario) VALUES (?, ?, ?, ?)`;
    db.run(query, [nome, quantidade, preco, nomeUsuario], function(err) {
        if (err) {
            console.error('Erro ao adicionar produto:', err.message);
            res.status(500).send("Erro ao adicionar produto.");
        } else {
            console.log('Produto adicionado com sucesso:', this.lastID);
            res.json({ id: this.lastID });
        }
    });
});

// Rota para excluir produto específico do usuário pelo nome de usuário
app.delete("/excluir-produto/:nomeUsuario/:produtoId", function(req, res) {
    const nomeUsuario = req.params.nomeUsuario;
    const produtoID = req.params.produtoId;

    // Exclui o produto específico pelo nome de usuário e ID do produto
    const queryExcluirProduto = `
        DELETE FROM Produtos
        WHERE NomeUsuario = ? AND ID = ?
    `;
    db.run(queryExcluirProduto, [nomeUsuario, produtoID], function(err) {
        if (err) {
            console.error('Erro ao excluir produto do usuário:', err.message);
            res.status(500).json({ success: false, error: err.message });
        } else {
            console.log(`Produto ${produtoID} do usuário ${nomeUsuario} excluído com sucesso.`);
            res.json({ success: true });
        }
    });
});



app.listen(3000, function() {
    console.log("Servidor rodando em http://localhost:3000/");
});
