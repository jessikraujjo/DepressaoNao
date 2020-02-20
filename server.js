const express = require('express');

const server = express();

//congif para arquivos extras c/ css
server.use(express.static('public'));

//habilitar body do form
server.use(express.urlencoded({ extended: true}))

//configurar banco
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '2339',
    host:'localhost',
    port: 5432,
    database: 'ajude'
})


//config para usar template engine
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true
});


server.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados.")
        const donors = result.rows
        return res.render("index.html", {donors})
    })
    
});

server.post("/", function(req, res){
    //pegar dados do form
    const nome = req.body.nome
    const email = req.body.email
    const ocupacao = req.body.ocupacao

    if (nome == "" || email == "" || ocupacao == ""){
        return res.send("Todos oa campos são obrigatórios.")
    }

    const query =`INSERT INTO donors ("nome", "email", "ocupacao")
                     VALUES($1, $2, $3)`

    const values = [nome, email, ocupacao]
    db.query(query, values, function(err){
        //fluxo de erro
        if (err) return res.send(" erro no banc de dados.")

        //fluxo ideal
        return res.redirect("/")
    })

    //coloca valores no array
    /*donors.push({
        nome: nome,
        ocupacao: ocupacao
    })
    return res.redirect("/")*/
})

server.listen(3000);