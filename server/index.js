const path = require('path')
const express = require('express')
const stripe = require('stripe')('sk_test_51IPVjfDjfKG70QFN7Pf9Q8VLijSzPqeKHwkUsEkIwggqYNWCLEJJadc8o2bfQNw6VCsldNaLAqPR7FQX7puusSdH00KRjL80fd')
const cors = require('cors')

const app = express()
app.use(cors())

app.post('/api/customers/mobile/create', async (req,res)=>{
    const email = req.query.email 
    console.log("EMAIL IN REQUEST")
    console.log(email)

    stripe.customers.create({
        email: email
    }).then(customer=> {
        res.status(200).send(customer)

    }).catch(e=>console.log(e))
    //add this to client database 
  

})
app.post('/api/customers/mobile/retrieve', async(req,res)=> {
    console.log("at retrieve")
    const id = req.query.id 
    stripe.customers.retrieve(id)
    .then(customer =>{
        console.log("it worked")
        console.log(customer)
        res.status(200).send(customer)
    })
    .catch(e=>console.log(e))
})

app.post('/api/paymentmethods/mobile/list', async(req,res)=> {
    const id = req.query.id 
    stripe.paymentMethods.list({
        customer: id,
        type: 'card'
    }).then(payments=>{
        res.status(200).send(payments)
    })
    .catch(e=>console.log(e))

})


// export const retrieveCustomer = async(id) => {
//     const customer = await stripe.customers.retrieve(id)
//     return customer


// }
// export const listCustomers = async() => {
//     const customers = await stripe.customers.list();
//     return customers 
// }

// export const updateCustomer = async(id, metadata) => {
//     const customer = await stripe.customers.update(
//         id,
//         {metadata: metadata}
//     );
//     return customer

// }

// export const deleteCustomer = async(id) => {
//     const deleted = await stripe.customers.del(
//         id
//     );
//     return deleted
// }


// //payment methods

// export const createPaymentMethod = async (cardNum, exp_month, exp_year, cvc) => {
//     const paymentMethod = await stripe.paymentMethods.create({
//         type: 'card',
//         card: {
//             number: cardNum,
//             exp_month: exp_month,
//             exp_year: exp_year,
//             cvc: cvc,
        


//         }
//     })
//     return paymentMethod



// }

// //attach payment emthod to a customer

// export const attachPaymentMethodtoCustomer = async(paymentid, customerid) => {
//     const paymentMethod = await stripe.paymentMethods.attach(paymentid,
//         {customer: customerid})
//     return paymentMethod
// }

// //list customer payment methods 

// export const listCustomerPaymentMethods = async (customerid) => {
//     const paymentMethods = await stripe.paymentMethods.list({
//         customer: customerid,
//         type: 'card'
//     })
//     return paymentMethods
// }
// //retrieve payment memthod

// export const retrievePaymentMethod = async (paymentid) => {
//     const paymentMethod = await stripe.paymentMethods.retrieve(paymentid)
//     return paymentMethod
// }

// //update a payment method 
// export const updatePaymentMethod = async (paymentid, metadata) => {
//     const paymentMethod = await stripe.paymentMethods.update(paymentid,
//         {metadata: metadata})
//     return paymentMethod
// }

// //deattach payment memthod from customer

// export const detachPaymentMethod = async (paymentid) => {
//     const paymentMethod = await stripe.paymentMethods.detach(
//         paymentid
//     )
//     return paymentMethod
// }

app.listen(4000)

