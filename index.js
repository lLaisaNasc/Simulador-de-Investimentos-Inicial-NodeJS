const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const conn = require('./db/conn')

//routes
const simulacaoRoutes = require('./routes/simulacoesRoutes')

app.engine('handlebars',exphbs.engine())
app.set('view engine', 'handlebars')

//Middlewares para transformar formulario em JSON
app.use(
    express.urlencoded({
        extended : true
    })
)
app.use(express.json())

//definicao da pasta estatica
app.use(express.static('public'))

//Chama as rotas
app.use('/simulacao', simulacaoRoutes)

//roda o servidor se conseguir conectar ao bd
conn.sync()
    .then(()=> {
        app.listen(3000)
    }).catch((err) => console.log(err))

