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

app.get('/api/customers', (req, res) => {
  chargebee.customer.list().request(function(error,result) {

    if(error){
      //handle error
      res.json(error)
    } else {
      res.json(result.list)
    }  

  })

})

app.listen(port, () => {
  console.log(`Chargebee Custom Checkout API listening on port ${port}`)
})