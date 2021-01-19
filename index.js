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

// Configura credenciais
mercadopago.configure({
    access_token: 'TEST-2403643030781235-011820-a0f533b2bc57528a1363a9a9790797a1-412855985'

});

var port = Number(process.env.PORT || 3000);


app.get('/', function(req, res) {
    res.render('Dashboard')
})

app.get('/sos', function(req, res) {
    res.render('Sos')
})

app.get('/pagar', function(req, res) {

    // Cria um objeto de preferência
    let preference = {
        items: [{
            title: 'Meu produto',
            unit_price: 100,
            quantity: 1,
        }]
    };

    mercadopago.preferences.create(preference)
        .then(function(response) {
            // Este valor substituirá a string "<%= global.id %>" no seu HTML
            global.id = response.body.id;
        }).catch(function(error) {
            console.log(error);
        });

    res.render('Pagar')

})

app.listen(port, function(error) {
    if (error) throw error
    console.log("Server created Successfully")
})