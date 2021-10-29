import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SchedualeHeader from '../../Headers/scheduale'
import {addClientStripeId, createPaymentMethodEntry,updatePaymentMethodEntry} from '../../Database/functions'
//import {Elements} from '@stripe/react-stripe-js';
//import {loadStripe} from '@stripe/stripe-js';
import {CreditCardInput, LiteCreditCardInput} from "react-native-vertical-credit-card-input"
// import {
//     CardElement,
//     useStripe,
//     useElements
//   } from "@stripe/react-stripe-js";
import axios from 'axios';
var stripe = require('stripe-client')('pk_live_51IPVjfDjfKG70QFNRDEnqEBhhJEiizfXty6pbZryCBDyykjdn65JNgWe9MpFhRqNIsct3RH9EMpyxFqxvIuPss1900acdnhhkl')
//var stripe = require('stripe-client')('pk_test_51IPVjfDjfKG70QFNN58V01Z1ktEIPjAT49Rzw88Eu12D03QSiH8aPPQ7ZFmLlUbEMlFf0cvWgbIh1RECJNFiGvay00zAug9QW0')


//import stripe from '@stripe/stripe-react-native'
import { Alert } from 'react-native';

//stripe.setOptions({publishingKey: 'pk_live_51IPVjfDjfKG70QFNRDEnqEBhhJEiizfXty6pbZryCBDyykjdn65JNgWe9MpFhRqNIsct3RH9EMpyxFqxvIuPss1900acdnhhkl'})

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)


// stripe.setOptions({
//     publishableKey: 'pk_test_51IPVjfDjfKG70QFNN58V01Z1ktEIPjAT49Rzw88Eu12D03QSiH8aPPQ7ZFmLlUbEMlFf0cvWgbIh1RECJNFiGvay00zAug9QW0'
// })


const AddCreditCard = (props) => {
    var client = props.navigation.state.params.client 
    var state = props.navigation.state.params.state


    console.log("THE REFRESH PARMA PASSED")
    console.log(props.navigation.state.params.refreshState)
  

    const ComputePriceCents = () => {
        var price = parseFloat(props.navigation.state.params.params.Price) *100
        return price
        
    }
    const cardList = ['Master','Visa','Apple Pay','PayPal','Discovery']
   
  
    const [cardholderName, setName] = useState(null)
    const [cardNum, setNum] = useState('')
    const [cardType,setType] = useState(1)
    const [exprMonth, setMonth] = useState(null)
    const [exprYear, setYear] = useState(null)
    const [expr,setExpr] = useState('')
    const [cvv, setCvv] = useState(null)
    const [cardsVisible, setVisible] = useState(false)
    const [cards,setCards] = useState(null)
    const [token, setToken] = useState('1235ABC')
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const [fetchedSecret, setFetchedSecret] = useState(false);
    const [secretDatabase, setSecretDatabase] = useState(false);
    const [stripeCard, setStripeCard] =useState(null)
    const [stripeClient, setStripeClient] = useState(null)
    const [priceId, setPriceId] = useState(null)
    const [cardForm, setCardForm] = useState(null)
    const [disable,setDisable] = useState(true)
  
    // const stripe = useStripe();
    // const elements = useElements();

    const createCharge = async () => {
        var options = {
            amount: params.Price,
            currency: 'usd',
            source: stripeCard,
            description: `Payment for ${params.Option} subscription`
        }



    }
    // const createClient = async () => {
    //     console.log("IN CREATE CLIENT")
    //     axios.get(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/customer/createCustomer`)
    //     .then(response => {
    //         console.log("CREATE CLIENT RESPONSE")
    //         console.log(response)
    //         if (response!=null){
    //             setStylistStripeId(id,response)
    //             setClientSecret(response)
    //             setFetchedSecret(true)
    //         }
            
    //     })
    //     .catch(error=> {
    //         console.log(error)
    //     })

    // }

    // if (fetchedSecret==false){
    //     createClient()
    // }
    if (setSecretDatabase==false){
        //comme back to this 
    }


    const addStripeId = (stripeId, card) => {
        console.log("IN ADD STRIPE ID")
        console.log(stripeId)
        addClientStripeId(client.id, stripeId, (response)=> {
            if (response==null){
                console.log("IN ADD STRIPE ID FAILED")
                Alert.alert("Network Error", "Failed to upload card information. Please try again")
            } else {
                createPaymentMethod(card,stripeId)
            }
        })

    }



    const goBack = () => {
        props.navigation.goBack()
    }
    //test out with a random token for now 
    var data = []
    var count = 0
    for (var card in cardList){
        var Id = String(count)
        var image = null
        // if (card==0){
        //     image = require('../assets/Cards/master-card.png')

        // } else if (card==1){
        //     image = require('../assets/Cards/visa-card.png')
        // } else if (card==2){
        //     image = require('../assets/Cards/apple-pay.png')
        // } else if (card==3){
        //     image = require('../assets/Cards/paypal-card.png')
        // } else {
        //     image = require('../assets/Cards/discover-card.png')
        // }
       
        var name = cardList[card]
        var obj = {'name':name,'image':image}
        var dataObj = {id:Id,card:obj}
        data.push(dataObj)
        count+=1
    }

    const setCard = async(cardObj) => {
        try {
            var cardString = JSON.stringify(cardObj)
            await AsyncStorage.setItem("@card",cardString)
        } catch (e){
            console.log(e)
        }
    }
    const getStripeCard = async (token) => {
        console.log("IN STRIPPE CARD")
        const params = {
            id: clientSecret,
            token: token
        }
        console.log(params)
        axios.post(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/card/createCard`,params)
        //axios.post("http://localhost:3000/card,createCard",params)
        .then(response=> {
            console.log("GET STRIPE CARD")
            setStripeCard(response)
        })
        .catch(error=> {
            console.log("ERROR IN GET STRIPE CARD")
            console.log(error)
        })

    }
    if (stripeCard!=null){
        //means we already sent submit

    }
    const createStripeClient = (card) => {

        var email = props.navigation.state.params.client.Email
        console.log(email)
        console.log("IN CREATE STRIPE CLIENT")
        axios.get(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/customer/createCustomer?email=${email}`).then(response=> {
        //axios.get(`http://localhost:5000/customer/createCustomer?email=${email}`).then(response=> {
            console.log("CREATE CLIENT RESPONSE")
            console.log(response)
            if (response!=null){
                console.log("CREATE STRIPE CLIENT RESULT")
                console.log(response.data)
                addStripeId(response.data,card)
                // setStripeClient(response.data)
                
                

            }
        }).catch(error=> {
            console.log("CREATE STRIPE CLIENT FAILED")
            console.log(error)
            Alert.alert("Network Error", "Failed to upload card information. Please try again")
        })
    }
    const createPaymentMethod = (token,clientId)=> {
        console.log("IN CREATE PAYMENT METHOD")
        console.log(token)
        console.log(clientId)
        var params = {
            token: token,
            id: clientId
            
        }
        axios.post(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/card/createCard`,params).then(response=> {
        //axios.post(`http://localhost:5000/card/createCard`,params).then(response=> {
            if (response!=null){
                console.log("RESULT IN CREATE PAYMENT METHOD 4")
                console.log(response)
                console.log(response.data.id)
                
                attachCardtoCustomer(response.data.id,clientId)
                // setStripeCard(response.data)
                // createPrice()
            }
        }).catch(error=> {
            console.log(error)
            console.log("IN CREATE PAYMENT METHOD ERROR")
            Alert.alert("Network Error", "Failed to upload card information. Please try again")
            
        })

    }
    // const createPrice = (clientId,paymentMethodId) => {
    //     console.log("IN CREATE PRICE")
    //     var priceCents = ComputePriceCents()
    //     console.log("PRICE CENTS")
    //     console.log(priceCents)
    //     var productName = props.navigation.state.params.params.Option
    //     console.log("THE PRODUCT NAME")
    //     console.log(productName)

    //     axios.get(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/price/createPrice?priceCent=${priceCents}&productName=${productName}`).then(response=> {
    //         console.log("PRICE")
    //         console.log(response)
    //         if (response!=null){
    //             console.log("THE PRICE RESPONSE")
    //             console.log(response)
    //             // setPriceId(response.data)
    //             createSubscription(response.data,clientId,paymentMethodId)
    //         }
    //     }).catch(error=> {
    //         console.log(error)
    //     })

    // }

    const attachCardtoCustomer = (cardId,clientId) => {
        console.log("IN ATTACHING CARD TO CUSTOMER")
        console.log(cardId)
        console.log(clientId)
        //axios.get(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/customer/attachCard?id=${cardId}&customerId=${clientId}`).then(response=> {
        //axios.get(`http://localhost:5000/customer/attachCard?id=${cardId}&customerId=${clientId}`).then(response=> {
        console.log("ATTACH CARD TO CUSTOMER RESPONSE")

        var cardList = []
        var newPayment = true
        if (props.navigation.state.params.paymentMethods!=null){
            console.log("WE HAVE PAYMENT METHODS")
            console.log(props.navigation.state.params.paymentMethods)
            cardList = props.navigation.state.params.paymentMethods
            cardList.push(cardId)
            newPayment = false
        } else {
            cardList = [cardId]
        }
        if (newPayment==true){

        
            createPaymentMethodEntry(clientId, cardId, cardList, (result)=> {
                if (result!=null){
                    const {navigate} = props.navigation
                    if (props.navigation.state.params.next=="Checkout"){
                        navigate("Checkout", {
                            client: props.navigation.state.params.client,
                            state: props.navigation.state.params.state,
                            arrivalDate: props.navigation.state.params.arrivalDate,
                            arrivalTime: props.navigation.state.params.arrivalTime,
                            refreshState: props.navigation.state.params.refreshState
                        })

                    } else if (props.navigation.state.params.next=="Card List"){
                        navigate("Card List", {
                            refreshState: props.navigation.state.params.refreshState
                        })
                    }
                    

                } else {
                    console.log("FAILED IN ATTACH CARD TO CUSTOMER RESPONSE")
                    Alert.alert("Network Error", "Failed to upload card information. Please try again")
                }
            })
        } else {
            updatePaymentMethodEntry(clientId, props.navigation.state.params.mainMethod, cardList, (result)=> {
                if (result!=null){
                    const {navigate} = props.navigation
                    if (props.navigation.state.params.next=="Checkout"){
                        navigate("Checkout", {
                            client: props.navigation.state.params.client,
                            state: props.navigation.state.params.thestate,
                            arrivalDate: props.navigation.state.params.arrivalDate,
                            arrivalTime: props.navigation.state.params.arrivalTime
                        })

                    } else if (props.navigation.state.params.next=="Card List"){
                        navigate("Card List", {
                            state: props.navigation.state.params.state,
                            refreshState: props.navigation.state.params.refreshState
                        })
                    }
                    

                } else {
                    console.log("FAILED IN ATTACH CARD TO CUSTOMER RESPONSE")
                    Alert.alert("Network Error", "Failed to upload card information. Please try again")
                }

            })

        }
            
        // }).catch(error=> {
        //     console.log("ATTACH CARD TO CUSTOMER ERROR")
        //     console.log(error)
        //     Alert.alert("Network Error", "Failed to upload card information. Please try again")
        // })

       

    }
    // const createSubscription = (price,clientId,paymentMethodId) => {
    //     console.log("IN CREATE SUBSCRIPTION")
    //     console.log(price)
    //     console.log(paymentMethodId)
    //     axios.get(`http://anothertest-env.eba-pueedx5b.us-east-1.elasticbeanstalk.com/subscription/createSubscription?priceId=${price}&customerId=${clientId}&paymentId=${paymentMethodId}`).then(response=> {
    //         if (response!=null){
    //             console.log("CREATE SUBSCRIPTION WAS SUCCESSFUL")
    //             console.log(response.data)
    //         }
    //     }).catch(error=> {
    //         console.log(error)
    //     })

    // }
    const validateCard = () => {
        var cardNum = cardForm.values.number
        var expiry = cardForm.values.expiry
        var cvc = cardForm.values.cvc 
        if (cardNum==""){
            alert("Enter in a card number")
            return false
        }
        
        if (cardForm.status.number!="valid"){
            alert("Card number is invalid")
            return false
        }
        if (cardForm.status.expiry!="valid"){
            alert("Expiry is invalid")
            return false
        }
        if (cardForm.values.expiry==""){
            alert("Expiry is empty")
            return false
        }
        if (cardForm.status.cvc!="valid"){
            alert("CVC is invalid")
            return false
        }
        if (cardForm.values.cvc==""){
            alert("CVC is empty")
            return false
        }
        return true




    }
    const submit = async () => {
        setDisabled(true)
        const {navigate} = props.navigation
        var service = props.navigation.state.params.service 
        var arrivalDate = props.navigation.state.params.arrivalDate
        var arrivalTime = props.navigation.state.params.arrivalTime
        var lastfourdigits = cardNum.slice(-4)
        var cardName = cardList[cardType]
        //var cardImageSource = SrcString[cardType]
        console.log(expr)
        var validCard = validateCard()
        if (validCard==true){
            console.log("CARD FORM")
            console.log(cardForm)
            console.log(cardForm.values.number.replace(" ",""))
            console.log(parseInt(cardForm.values.expiry.split("/")[0]))
            console.log(parseInt(cardForm.values.expiry.split("/")[0]))
            console.log(cardForm.values.cvc)
            const information = {
                card: {
                    number: cardForm.values.number.replace(" ","").replace(" ","").replace(" ",""),
                    exp_month: parseInt(cardForm.values.expiry.split("/")[0]),
                    exp_year: parseInt(cardForm.values.expiry.split("/")[1]),
                    cvc: cardForm.values.cvc,
                
                }
                
            }
            
            var card = await stripe.createToken(information)
            console.log("GENERATEDDDDD CARDDDDDDD")
            console.log(card)
            if (client.StripeId == null){
                createStripeClient(card.id)

            } else {
                createPaymentMethod(card.id,client.StripeId)

            }
            
            

            console.log("THE CARD TOKEN")
            console.log(card.id)
            // const token =  await Stripe.createTokenWithCardAsync(params)
            // console.log("THE TOKEN")
            // console.log(token)
            // getStripeCard(card.id)


            //we have a token - send token to backend

            // var cardObj = {
            //     lastDigits: lastfourdigits,
            //     cardName: cardName, 
            //     imageSource:cardImageSource,
            //     token:token
            // }
            // setCard(cardObj)
            navigate("Step 2", {
                stylistPayload: props.navigation.state.params.stylistPayload,
                formattedNum: props.navigation.state.params.formattedNum
            })
        
     
    }
      
    
    }

    const _handleUpdateCard = (image) => {
        // var index = cardSrc.indexOf(image)
        // setType(cardType=>index)
        // setCards(cards=>null)

    }
    // const Item = ({image}) => (
        
    //     <TouchableOpacity style={styles.item} onPress={()=>_handleUpdateCard(image)}>
           
    //         <Image source={image}></Image>

    //     </TouchableOpacity>


    // )
    // const renderItem = ({item}) => (
    //     <Item name={item.card.name} image={item.card.image}/>
    // )
    

    const _handlingExpiration = (text) => {
        if (text.length>expr.length){
           
            if (text.replace(/[/]/g,'').length==2){
                setExpr(expr=>text +"/")


            } else {
                setExpr(expr=>text)
            }
            //this means we are adding text

        }
        if (text.length<expr.length){
            console.log("AT DELETING EXPIRATION TEXT")
            if (expr.charAt(expr.length-1)=="/"){
                setExpr(expr=>expr.slice(0,-2))

            } else {
                setExpr(expr => text)
            }
        }
    }


    const _handlingCardNumber = (number) =>{
        console.log("CARD NUMBER")
        console.log(cardNum.replace(/\s/g,'').length)
        var edited = cardNum.replace(/\s/g,'')
        console.log(edited)
       
        if (number.length>cardNum.length){
            if ((number.replace(/\s/g,'').length) % 4==0  && cardNum.replace(/\s/g,'').length<15 &&cardNum.replace(/\s/g,'').length>0 ){
                setNum(cardNum => number + " ")
            } else {
                setNum(cardNum => number)
            }
        }
        if (number.length<cardNum.length){
            console.log("IN DELETE")
            if (cardNum.charAt(cardNum.length-1)==" "){
                setNum(cardNum=>cardNum.slice(0,-2))
            } else {
                setNum(cardNum=>number)
            }
        }
       
       
    }

    const _handleChangeCard = () => {
        //setCards(cards=><FlatList style={styles.flatlist} data={data} renderItem={renderItem} keyExtractor={card => card.id}/>)

            
    }
    const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
      };
      
    const _onChange = (form) => {
        setCardForm(cardForm=>form)
        if (form.values.number!="" && form.values.cvc!="" && form.values.expiry!=""){
            setDisable(false)
        }
    }

    var saveElem = null
    return (
        <DismissKeyboard style={{width:'100%',height:'100%'}}>
        <View style={styles.container}>
           <SchedualeHeader backwards={goBack}/>
           <View style={styles.body}>
            <CreditCardInput onChange={_onChange}
            additionalInputsProps={
            {
                name: {
                    returnKeyType: 'done'
                },
                expiry: {
                    returnKeyType: 'done'
                },
                name: {
                    returnKeyType: 'done'
                },
               

            }
        }
            inputContainerStyle={{
                backgroundColor:"white",
                
            }}/>
            
            </View>
            <View style={styles.confirmBox}>
            
            <TouchableOpacity style={{
                flexDirection: "row",
                alignItems: "center",
                textAlign: "center",
                justifyContent: 'center',
                height:50,
                alignSelf: 'center',
                backgroundColor: disable?"grey":"#1A2232",
                flex:1,
                width: Dimensions.get('window').width,
            }} disabled={disable} onPress={()=>submit()}>
               <Text style={styles.confirmText}>Submit</Text>
           </TouchableOpacity>
           </View>
        </View>
        </DismissKeyboard>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        

    },
    body: {
        paddingLeft:20,
        paddingRight:20,
        paddingTop:25

    },
    title:{
        fontSize:12,
        color:"grey",
        marginBottom:5
    },
    nameInput: {
        fontSize:20,
        color:'black',
        fontWeight:'600',
        borderBottomColor: 'lightgray',
        borderBottomWidth:1,
        width:'80%'

    },
    cardInput: {
        fontSize:20,
        color:'black',
        fontWeight:'600',
        borderBottomColor: 'lightgray',
        borderBottomWidth:1,
        width:'100%',
        marginRight:'25%'

    },
    shortInput: {
        fontSize:20,
        color:'black',
        fontWeight:'600',
        borderBottomColor: 'lightgray',
        borderBottomWidth:1,
        

    },
    datecvv: {
        flexDirection: 'row',
        
    },
    title: {
        fontSize:14,
        fontWeight: '500',
        color: 'gray',
        marginBottom:10
    },
    cardholder: {
        marginBottom:20
    },
    cardnum: {
        marginBottom:20
    },
    expireDate: {
        flexDirection: 'column',
        marginRight:'50%'
    },
    confirm: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        justifyContent: 'center',
        
       
        // position: 'absolute',
        // bottom:0,
        height:50,
        
        alignSelf: 'center',
        backgroundColor: "#1A2232",
        
        flex:1,
        width: Dimensions.get('window').width,
       
        
        


    },
    confirmText: {
        color: 'white',
        fontWeight: '600',
        fontSize:16
    },
    confirmBox: {
      
        marginTop:20,
        marginBottom:20,
        height:60,
        bottom:0,
        position: 'absolute'
       
    },
    cardNumType: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    item: {
        flexDirection: 'row',
        
    },
    selectedCard: {
        width:50,
        
        flexDirection: 'column',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    
})

export default AddCreditCard