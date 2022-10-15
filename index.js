const express = require('express')
const cors = require('cors')
const chargebee = require("chargebee")
const app = express()
const port = 3000

app.use(cors())
app.use(express.urlencoded({extended:false}))

chargebee.configure(
  {
    site : "poliigon-test",
    api_key : "test_hJdA7C4QBzAdoAjzCpw0ZI6lo7ONkCaA"
  }
)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/generate_payment_intent', (req, res) => {
  chargebee.payment_intent.create(req.body).request(function(error,result) {
    if(error){
      //handle error
      res.json(error)
    }else{
      const payment_intent = result.payment_intent
      res.json(payment_intent)
    }
  })

})

app.get('/api/customer/list', (req, res) => {
  chargebee.customer.list().request(function(error,result) {

    if(error){
      //handle error
      res.json(error)
    } else {
      res.json(result.list)
    }  

  })

})

app.post('/api/customer', (req, res) => {
  chargebee.customer.create(req.body).request(function(error,result) {
    if(error){
      //handle error
      res.json(error)
    }else{
      res.json(result)
    }
  });
})

app.put('/api/customer', (req, res) => {
  const customerData = Object.fromEntries(Object.entries(req.body).filter(([key]) => key !== 'customer_id'))
  chargebee.customer.update(req.body.customer_id, customerData).request(function(error,result) {
    if(error){
      //handle error
      res.json(error);
    }else{
      res.json(result);
    }
  })
})

app.post('/api/create_invoice', (req, res) => {
  chargebee.invoice.create_for_charge_items_and_charges(req.body).request(function(error,result) {
    if(error){
      //handle error
      res.json(error)
    }else{
      res.json(result.invoice)
    }
  })
})

app.get('/api/item_price/list', (req, res) => {
  chargebee.item_price.list().request(function(error,result) {
    if(error){
      //handle error
      res.json(error);
    }else{
      res.json(result.list)
      }
    })
})

app.listen(port, () => {
  console.log(`Chargebee Custom Checkout API listening on port ${port}`)
})