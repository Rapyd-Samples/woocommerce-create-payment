# woocommerce-create-payment - INTERNAL HACKATHON WINNER

### This is an example project that shows how to use Rapyd's plugins service to create a seamless payment.

The project purpose is to show how to create a secure PCI compliant payment using a credit card, then save the tokens of the card and create a payment using this tokens.

Running the project:
-----------
1. npm i
2. set const my_base_url to your domain in index.js file (will not work localhost)
3. activate your woocommerce plugin and set your woocommerce access key and secret key in api.js file. (please see more details here: https://docs.rapyd.net/works-with/docs/plugins-for-rapyd-payments)
3. run node index.js
4. create a post request my_base_url/createCheckoutUrl
    url: http://localhost:3001/createCheckoutUrl
    example request body: 
    ```json
          {
                  "currency_code":"EUR",
                  "country_code":"AT",
                  "amount":10,
                  "order_id":"my_unique_order_id_124"
          }
    ```

    example response: https://sandboxcheckout.rapyd.net?token=checkout_20e546a5f1885643e81baebf118ff035
5. browse to the url that is returned. create a payment using credit card.
6. create a get request to get payment details from example db using the following route: http://localhost:3001/paymentDetailsByOrderId?order_id=my_unique_order_id_123
    example response:
      ```json
        {
             "payment_token": "payment_9a313b40defe1c4b0fb681e936ea4ec3",
             "payment_method": "card_08618e95292467d55a7d3d5a445944e9",
             "woo_status": "processing"
        }
     ```
7. create a post request to my_base_url/createSubscriptionPayment
    example request body:
     ```json
        {
             "payment_token": "payment_9a313b40defe1c4b0fb681e936ea4ec3",
             "payment_method": "card_08618e95292467d55a7d3d5a445944e9",
             "amount":12,
             "order_id":"my_unique_order_id_124",
             "currency_code":"EUR"
        }
   ```
    example response: 
    ```json
    {
    "statusCode": 200,
        "body": {
            "woo_status": "processing",
            "woo_order_note": "Rapyd payment success"
        },
        "headers": {
            "date": "Tue, 02 Nov 2021 14:46:02 GMT",
            "content-type": "application/json; charset=utf-8",
            "content-length": "68",
            "connection": "close",
            "etag": "W/\"44-tdNQMsSTZSeNxYpbcnrZ0Q\""
        }
    }
   ```
   
## Get Support 
- https://community.rapyd.net 
- https://support.rapyd.net 

 
