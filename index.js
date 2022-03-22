const express = require('express')
const api = require('./api');
const utilities = require('./utilities');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

const DB = {//example with const but can be saved in db
    
};

const my_base_url = `TODO:set my domain`;//''; //``https://3b49-213-57-112-162.ngrok.io - example with ngrok for localhost`;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/success', (req, res) => {
    res.send('Success page')
})

app.get('/failure', (req, res) => {
    res.send('failure page')
})

app.get('/cancel', (req, res) => {
    res.send('cancel page')
})

app.post('/webhook_payment', (req, res) => {
    if(!api.isSignatureValid(req)){
        res.send("Unauthenticated webhook");
    }
    else if(req.body["woo_status"] && req.body["woo_status"]=="processing"){
        DB[req.body["order_id"]] = {
            "payment_token":req.body["payment_token"],
            "payment_method":req.body["payment_method"],
            "woo_status":req.body["woo_status"]
        };
        res.send('payment details were saved successfully');//payment was successful and closed - save payment details to db.
    }else{
        res.send(`payment was not closed, payment status:${req.body["woo_status"]}`);
    }
})

app.post('/createCheckoutUrl', (req, res) => {
    let body={
        currency_code:req.body.currency_code,//supported currency - for example "EUR",
        country_code:req.body.country_code,//supported country code - for example "AT",
        amount:req.body.amount,//for example - 10,
        order_id:req.body.order_id,//unique order_id - for example - uuidv4(),
        webhook_url:`${my_base_url}/webhook_payment`,//server url to get payment response
        refund_url:`${my_base_url}/webhook_refund`,//server url to get refund response that is done using rapyd client portal
        complete_payment_url:`${my_base_url}/success`,//url for success payment page
        error_payment_url:`${my_base_url}/failure`,//url for failure payment page
        cancel_payment_url:`${my_base_url}/cancel`,//url for cancel payment page
        category:'card'
    };
    body = utilities.encodeBase64Object(body);
    api.makeRequest('POST','/v1/plugins/woocommerce/payments/checkout',body).then(function(response) {
        if(response && response.headers && response.headers.location){
            res.send(response.headers.location);
        }else{
            res.send(response.body);
        }

    }).catch(function(e) {
        console.error(e.message);
        res.send("an error occurred");
    })
})

app.post('/createSubscriptionPayment', (req, res) => {
    const orders=Object.keys(DB);
    
    let body={
        amount:req.body.amount,//for example12,
        order_id:req.body.order_id,//orders[0],//selected first order_id for the example
        payment_method:req.body.payment_method,//DB[orders[0]]["payment_method"],//get saved payment_method for order_id
        payment_token:req.body.payment_token,//DB[orders[0]]["payment_token"],//get save payment_token for order_id
        currency_code:req.body.currency_code,//"EUR",
        webhook_url:`${my_base_url}/webhook_payment`,//server url to get payment response
        refund_url:`${my_base_url}/webhook_refund`////server url to get refund response
    };
    body = utilities.encodeBase64Object(body);
    api.makeRequest('POST','/v1/plugins/woocommerce/payments/subscriptions',body).then(function(value) {
        console.log(value);
        res.send(value);
    }).catch(function(e) {
        console.error(e.message);
        res.send("an error occurred");
    })
})

app.get('/paymentDetailsByOrderId', (req, res) => {
    if(req.query["order_id"] && DB[req.query["order_id"]]){
        res.send(DB[req.query["order_id"]]);
    }else{
        res.send("didn't find order_id in db");
    }
})

app.listen(port, () => {
    console.log(`Example app listening at ${my_base_url}`)
})