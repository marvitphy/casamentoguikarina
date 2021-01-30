const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()
const mercadopago = require('mercadopago');
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
const pagamento = require('./models/pagamento')
    // Add headers
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.post('/api/add', async(req, res, next) => {
    let valor = req.body.valor
    if (valor.includes('.') != false) {
        valor = valor.replace('.', '')
    }
    let result = await pagamento.cadPag(valor);
    let dados = await pagamento.getTotal();
    let subTotal = Number(dados[0].valor) - Number(valor)
    console.log(subTotal)
    let total = pagamento.total(subTotal)
    res.json(result)
})

app.get('/api/getTotal', async(req, res, next) => {

    let dados = await pagamento.getTotal();
    console.log(dados)
    res.json(dados[0])

})


var port = Number(process.env.PORT || 3000);

app.get('/', function(req, res) {
    res.render('Dashboard')
})
app.get('/finalizar', function(req, res) {
    res.render('Finalizar')
})

app.get('/sos', function(req, res) {
    res.render('Sos')
})


mercadopago.configure({

    access_token: 'APP_USR-6305950079974131-013012-f9cd603181545867079d8d7bda1bbb01-81455634'

});

app.get('/pagar/:valor', function(req, res) {
    console.log(req.params.valor)


    mercadopago.preferences.create({
            items: [{
                title: 'Cota',
                unit_price: Number(req.params.valor),
                quantity: 1,
            }],
            "back_urls": {
                "success": "http://casamentokarinaeguilherme-com.umbler.net/finalizar?valor=" + Number(req.params.valor),
                "failure": "http://www.seu-site/failure",
                "pending": "http://www.seu-site/pending"
            },
            "auto_return": "approved"
        })
        .then(function(response) {
            // Este valor substituirá a string "<%= global.id %>" no seu HTML
            global.id = response.body.id;
        }).catch(function(error) {
            console.log(error);
        });

    res.render('Pagar')

    // Cria um objeto de preferência

})

app.listen(port, function(error) {
    if (error) throw error
    console.log("Server created Successfully")
})