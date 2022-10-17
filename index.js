const express = require('express')
const cors = require('cors')
const chargebee = require("chargebee")
const app = express()
const port = 3000
require('dotenv').config()

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json());

chargebee.configure(
  {
    site : process.env.CHARGEBEE_PUBLISHABLE_SITE,
    api_key : process.env.CHARGEBEE_KEY
  }
)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// create payment intent
app.post('/api/generate_payment_intent', (req, res) => {
  chargebee.payment_intent.create(req.body).request(function(error,result) {
    if(error){
      //handle error
      res.json(error)
    }else{
      res.json(result.payment_intent)
    }
  })
})

// Customer CRUD operations
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

app.delete('/api/customer', (req, res) => {
  chargebee.customer.delete(req.body.customer_id).request(function(error,result) {
    if(error){
      //handle error
      res.json(error)
    }else{
      res.json(result)
    }
  })
})

app.get('/api/customer', (req, res) => {
  chargebee.customer.retrieve(req.body.customer_id).request(function(error,result) {
    if(error){
      //handle error
      res.json(error)
    }else{
      res.json(result)
    }
  })
})

// Create invoice
app.post('/api/create_invoice', (req, res) => {
  chargebee.invoice.create_for_charge_items_and_charges(req.body).request(function(error,result) {
    if(error){
      //handle error
      res.json(error)
    }else{
      res.json(result)
    }
  })
})

// get item price list
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

// create new item price
app.post('/api/item_price/create', (req, res) => {
  chargebee.item_price.create({
    id : "hundred-credits",
    item_id : "gold-credits",
    name : "hundred credits",
    pricing_model : "flat_fee",
    price : 100,
    external_name : "100 credits",
    currency_code: "USD",
    item_type: "charge"
  }).request(function(error,result) {
    if(error){
      //handle error
      res.json(error);
    }else{
      res.json(result);
    }
  })
})

// create new item
app.post('/api/item/create', (req, res) => {
  chargebee.item.create({
    id : "gold-credits",
    name : "Gold Credits",
    status: "active",
    item_family_id: "direct-purchase",
    type: "charge",
  }).request(function(error,result) {
    if(error){
      //handle error
      res.json(error);
    }else{
      res.json(result);
    }
  })
})

//get item familiy list
app.get('/api/item_family/list', (req, res) => {
  chargebee.item_family.list().request(function(error,result) {
    if(error){
      //handle error
      res.json(error);
    }else{
      res.json(result);
      }
    });
})

// get item list
app.get('/api/item/list', (req, res) => {
  chargebee.item.list().request(function(error,result) {
    if(error){
      //handle error
      res,json(error);
    }else{
      res.json(result);
      }
    });
})

app.listen(port, () => {
  console.log(`Chargebee Custom Checkout API listening on port ${port}`)
})