import axios from 'axios'

export const createCharge = (amount, cardId, customerId, callback) => {
   
    console.log("CREATE CHARGE AMOUNT")
    console.log(typeof(amount))
    console.log(amount)
    //axios.get(`http://localhost:5000/charge/createCharge?amount=${amount}&cardId=${cardId}&customerId=${customerId}`).then(response=> {
    axios.get(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/charge/createCharge?amount=${amount}&cardId=${cardId}&customerId=${customerId}`).then(response=> {
        //axios.get(`http://localhost:5000/paymentMethod/retrieve?paymentMethodId=${paymentId}`).then(response=> {
            callback(response)
        }).catch(error=> {
            console.log("RETRIEVE PAYMENT METHOD ERROR")
            console.log(error)
            callback(null)
        })
}


export const retrievePaymentMethod = (paymentId, callback)=> {
    console.log("IN RETRIEVE PAYMENT METHOD 123")
    console.log(paymentId)
    axios.get(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/paymentMethod/retrieve?paymentMethodId=${paymentId}`).then(response=> {
    //axios.get(`http://localhost:5000/paymentMethod/retrieve?paymentMethodId=${paymentId}`).then(response=> {
        callback(response)


    }).catch(error=> {
        console.log("RETRIEVE PAYMENT METHOD ERROR")
        console.log(error)
        callback(null)
    })

}

export const retrieveCard = (cardId, clientId, callback)=> {
    
    axios.get(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/card/retrieve?cardId=${cardId}&clientId=${clientId}`).then(response=> {
    //axios.get(`http://localhost:5000/card/retrieve?cardId=${cardId}&clientId=${clientId}`).then(response=> {
            callback(response)
    
    
        }).catch(error=> {
            console.log("RETRIEVE CARD ERROR")
            console.log(error)
            callback(null)
        })

}

export const issueTransaction = (amount, transferAmount, transferStripeId, callback) => {
   
    axios.get(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/transfer/createTransfer?amount=${amount}&stripeId=${transferStripeId}`).then(response=> {
    //axios.get(`http://localhost:5000/transfer/createTransfer?amount=${amount}&stripeId=${transferStripeId}`).then(response=> {
            callback(response)
    
    
        }).catch(error=> {
            console.log("RETRIEVE CARD ERROR")
            console.log(error)
            callback(null)
        })

}