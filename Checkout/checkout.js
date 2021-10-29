import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Alert} from 'react-native';
import {NavigationEvents} from 'react-navigation'
import CartItem from '../components/CheckoutComps/cartItem'
import Location from './Components/location'
import CreditCard from '../components/CheckoutComps/creditCard'
import AddCreditCard from '../components/CheckoutComps/addcreditCard'
import {getClientAddressList} from '../Auth/clientInfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {validSession} from '../Auth/clientInfo';
import {retrievePaymentMethod, issueTransaction, createCharge} from '../Stripe/functions'
import {useFonts} from 'expo-font';
import {Ionicons} from 'react-native-vector-icons'
import CardRow from '../components/CheckoutComps/cardRow'
import axios from 'axios';
import {useParams} from "react-router-dom"
import CheckoutHeader from '../Headers/checkout'
import {fetchSubscription, createAppointment, createTransaction, createBooking, getClient, getPaymentMethod, getStylistwithCallback, computeTravelDuration, addresstoCoords, saveAddressAsync} from '../Database/functions'
import {fetchAptSuiteBldgInput, storeAptSuiteBldgInput, fetchCurrentAddress} from '../LocalStorage/functions'
import {fetchAptSuiteBldgNumber, computeStylistAbilityToGoToClientAddress, storeCurrentLoation} from './Scripts/functions'
import moment from 'moment'


// import {Ionicons} from '@expo/vector-icons';
import { fonts } from 'react-native-elements/dist/config';
//checkout is only gonna have one object
const Checkout = (props) => {
    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require("../assets/fonts/Lato-Heavy.ttf"),
        'Lato-Medium': require("../assets/fonts/Lato-Medium.ttf"),
        'Lato-Regular': require("../assets/fonts/Lato-Regular.ttf"),
        'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
        'Lato-Thin': require('../assets/fonts/Lato-Thin.ttf'),
        'Lato-Semibold': require('../assets/fonts/Lato-Semibold.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf')

     });

    var cardList = {
        "mastercard": require("../assets/Cards/master-card.png"),
        "visa": require("../assets/Cards/visa-card.png"),
        "american-express": require("../assets/Cards/american-express-card.png"),
        "discovery": require("../assets/Cards/discover-card.png")
    }

    console.log("THE KEY OF PAST PAGE")
    console.log(props.navigation.state.params.go_back_key)
    var totalCost = props.navigation.state.params.totalCost
    var taxesCost = props.navigation.state.params.taxesCost
    var travelCost = props.navigation.state.params.travelCost
    var bookingFee = props.navigation.state.params.bookingFee
    var services = props.navigation.state.params.services
    var stylist = props.navigation.state.params.stylist
    var arrivalDate = props.navigation.state.params.arrivalDate
    var arrivalTime = props.navigation.state.params.arrivalTime
    var travelDuration = props.navigation.state.params.travelDuration
    var stateProps = props.navigation.state.params.state
    var addressProps = props.navigation.state.params.address
    var thelist = services
    var refreshState = props.navigation.state.params.refreshState
    var aptBuildingNumberIsSet = props.navigation.state.params.aptBuildingNumberIsSet
    var addressChanged = props.navigation.state.params.addressChanged
    var locationCoords = props.navigation.state.params.locationCoords
    console.log("ADDRESS CHANGED IN CHECKOUT")
    console.log(addressChanged)

    console.log("THE APT BUILDING NUMBER IS SET")
    console.log(aptBuildingNumberIsSet)
  
    console.log("SERVICES AT CHECKOUT")
    console.log(services)
    // var cardItem={
    //     lastDigits: '1234',
    //     cardName: "VISA", 
    //     imageSource:require('../assets/Cards/visa-card.png'),
    //     token:null
       
    //     }
    
    var customer = null
    const [createCard, setcreateCard] = useState(false)
    const [paymentOptions, setPayments] = useState(null)
    const [card, setCard] = useState(null)
    const [paymentInfo, fetchPaymentInfo] = useState(false)
    const [selectedServices, setServices] = useState(thelist)
    const [change,setChange] = useState(false)
    const [client, setClient] = useState(null)
    const [clientFetched, setFetched] = useState(false)
    const [state, setState] = useState(false)
    const [paymentId, setpaymentId] = useState(null)
    const [locationName, setlocationName] = useState(null)
    const [address, setAddress] = useState(null)
    const [clientCoords, setCoords] = useState(null) 
    const [refresh, setRefresh] = useState(refreshState)
    const [aptSuiteBldg, setaptSuiteBldg] = useState(null)
    const [comissionAmountForStylist, setcomissionAmount] = useState(null)

    console.log("PRINTED REFRESH STATE")
    console.log(refreshState)
    console.log("THE ADDRESS PROPS here")
    console.log(addressProps)

    useEffect(()=> {
        fetchSubscription(stylist.SubscriptionId, (result)=> {
            if (result!=null){
                var comission = result.data[0].Comission 
                setcomissionAmount(comission)

            } else {
                Alert.alert("Network Error", "Network error occured")
            }
        })
        if (addressChanged==true){
            console.log("ADDRESS CHANGED IS TRUE HERE")
            AsyncStorage.getItem('locationCoords').then((locationCoords)=> {
                console.log("LOCATION COORDS RES 1")
                console.log(locationCoords)
                computeStylistAbilityToGoToClientAddress(stylist, services[0], locationCoords, arrivalDate, arrivalTime, (result)=> {
                    console.log("IN COMPUTE STYLIST ABILITY FUNC RETURN 1")
                    console.log(result)
                    if (result==false){
                        Alert.alert("New address is unreachable by stylist", 
                                        `Stylist ${stylist.FirstName} ${stylist.LastName} cannot reach you at new address`, [
                                            { 
                                                text: "Revert back to previous location",
                                                onPress: () => console.log("STAY HERE")
                                            },
                                            { 
                                                text: "Remove service",
                                                onPress: () => {
                                                    saveAddressAsync(address, (result)=> {
                                                        AsyncStorage.setItem('locationCoords', JSON.stringify(clientCoords)).then((res)=> {
                                                            props.navigation.goBack()

                                                        })


                                                    })
                                                    
                                                    

                                                   
                                                }
                                            }
                                            
                                        ])
                    } 

                })
        })

        }
        fetchAptSuiteBldgNumber((result)=> {
            console.log('BACK AT FETCH APT SUITE NUMBER 5')
            console.log(result)
            setaptSuiteBldg(result)
            
        })
        setAddress(addressProps)
        if (locationCoords!=null){
            setCoords(locationCoords)
        }
        
        // fetchCurrentAddress((result)=> {
        //     setAddress(result)
           
        // })
    },[aptBuildingNumberIsSet, addressChanged, addressProps])

    if (refreshState!=null && refresh!=refreshState){
        console.log('IN DIFFERENT PAYMENT 12345')
        getClient(response=> {
            if (response!=null){
                var client_ = response.data[0]
                setClient(client_)
                getPaymentMethod(client_.StripeId, (response)=> {
                    console.log("CHECKOUT PAYMENT METHOD RESPONSE 123")
                    console.log(response)
                    if (response!=null && response.data.length>0){
                        var paymentId = response.data[0].MainPaymentMethod
                        setpaymentId(paymentId)
                        retrievePaymentMethod(paymentId, (result)=> {
                            if (result!=null){
                                console.log("IN RETRIEVE PAYMENT METHOD")
                                console.log(result)

                            }
                        })

                    } else {

                    }
                })
            }
        })
        setRefresh(!refresh)
    }
  


    const getCoords =  async () => {
        var locationCoords = await AsyncStorage.getItem('locationCoords')
        setCoords(locationCoords)
    }

    if (clientCoords==null){
        getCoords()
    }



    console.log("ADDRESS PROPS")
    console.log(addressProps)
    if (address==null){
        setAddress(addressProps)

    }
    
    
    // if (props.navigation.state.params.creditCard!=null && card!=null){
    //     var creditCard = props.navigation.state.params.creditCard
    //     setCard(card=>creditCard)
        
    // }

    const getCustomAddress = async () => {
        var addressCurrent_ = await AsyncStorage.getItem("currentAddress")
        var addressName = addressCurrent_.Name 
        setlocationName(addressName)
        setAddress(addressCurrent_)
    }

    // const getCurrentAddress = async () => {
    //     console.log("IN GET CURRENT ADDRESS IN CHECKOUT 1")
        
    //     var addressCurrent_ = await AsyncStorage.getItem("currentAddress")
    //     console.log(addressCurrent_)
    //     setAddress(addressCurrent_)

    // }

    // const getLocationName = async () => {
    //     var locationName_ = await AsyncStorage.getItem("locationType")
    //     if (locationName_=="Current"){
    //         setlocationName("Live Location")
    //         getCurrentAddress()
    //     } else if (locationName_=="Custom"){
    //         getCustomAddress()
    //     }

    // }


    // if (locationName==null){
    //     getLocationName()
    // }

  

    if (stateProps!=null && stateProps!=state){
        console.log("STATE PROPS LOOP 123")
        if (client.StripeId==null){
            //we added a new card
            //so we need to load client again
            getClient(response=> {
                if (response!=null){
                    var client_ = response.data[0]
                    setClient(client_)
                    getPaymentMethod(client_.StripeId, (response)=> {
                        console.log("CHECKOUT PAYMENT METHOD RESPONSE")
                        console.log(response)
                        if (response!=null && response.data.length>0){
                            var paymentId = response.data[0].MainPaymentMethod
                            setpaymentId(paymentId)
                            retrievePaymentMethod(paymentId, (result)=> {
                                if (result!=null){
                                    console.log("IN RETRIEVE PAYMENT METHOD")
                                    console.log(result)
                                    var card = result.data.card 
                                    var cardType = card.brand 
                                    var last4 = card.last4
                                    var exp_month = card.exp_month
                                    var exp_year = card.exp_year
                                    setCard(
                                        <CardRow card={
                                            {
                                                lastDigits:last4,
                                                cardName:cardType,
                                                exp_month:exp_month,
                                                exp_year:exp_year
                                            }
                                        }
                                        />
                                    )
                                    fetchPaymentInfo(true)
                                    
                                   
    
    
    
                                }
                            })

                        } else {

                        }
                    })
                }
            })

        }
        //Means we came back from inserting a new main card
        //client is not null, this screen is already in the navigation stack
        //refresh client
        

    }




    if (clientFetched==false){

        console.log("CLIENT IS NULL ABOUT TO FETCH 3")
        getClient(response=> {
            console.log("GET CLIENT RESPONSE CHECKOUT")
            console.log(response)
            
            if (response!=null){
                var client_ = response.data[0]
                console.log("INITIAL CLIENT RESPONSE")
                console.log(client_)
                setClient(client_)
            }
        })
        setFetched(true)
    }


    const checkForPaymentMethods = ()=> {

    }


        
    var priceTotal = 0
    var cardElem = null
    
 
   
    console.log(selectedServices)
    const comissionAmount = () => {
        var comission = 0
        if (stylist.Subscription == "Free" || stylist.Subscription==null){
            comission = 0.3
        } else if (stylist.Subscription=="Plus"){
            comission = 0.25
        } else {
            comission = 0.2
        }
        return comission * Number(services[0].Price)
    }
    const taxes = (priceGiven) => {
     
        var tax = 0.06*priceGiven
        // console.log("TAXES COMPUTATION")
        // console.log(tax)
        // if (String(tax).split(".")[1]!=null && String(tax).split(".")[1].length>2){
        //     var finalTaxes = String(tax).split(".")[0] + "."+String(tax).split(".")[1].substring(0,2)
        //     tax = Number(finalTaxes)
        //     console.log("TAXES")
        //     console.log(finalTaxes)
        // } 
        
        return tax
    }

    const stripeCheckout = () => {


    }

    const createAppointmentsIterator = (count, callback)=> {
        if (count==selectedServices.length){
            callback("done")
        } else {
            var service = selectedServices[count]
            
            var endTime = moment(arrivalTime, "h:mm a").add(travelDuration, "minutes").format("h:mm A")
            console.log("END TIME COMPUTED")
            console.log("TRAVEL TIME")
            console.log(travelDuration)
            console.log(endTime)
            createAppointment(service.id, stylist.id, arrivalDate, arrivalTime, endTime, clientCoords, address, (result)=> {
                if (result!=null){
                   console.log("APPOINTMENT CREATED")
                   var appointmentId = result.data.id
                   createBooking(client.id, stylist.id, appointmentId, (result)=> {
                       console.log("CREATE BOOKING RESULT 123")
                       console.log(result)
                       var transactionPayload = {
                        customerId: client.StripeId,
                        taxesPrice: Number(taxesCost),
                        travelPrice: Number(travelCost),
                        bookingPrice: Number(bookingFee),
                        totalPrice: Number(totalCost),
                        totalStripeAmount: Number(totalCost)*100,
                        cardId: paymentId,
                        servicePrice: Number(service.Price),
                        bookingId: result,
                        status: 'Pending',
                        comissionPercentage: comissionAmountForStylist

                       }
                       createTransaction(transactionPayload, (response)=> {
                           if (response==null){
                               Alert.alert("Network Error", "Network error occured")

                           } else {
                                createAppointmentsIterator(count+1, callback)
                           }
                       })

                       
                   })
                }
            })
        }
    }
    const pay = () => {
        const {navigate} = props.navigation
        console.log("AT PAY 12345")
        console.log(parseInt(services[0].Price)) 
        var totalAmount = (taxes(preTaxPrice()) + preTaxPrice())*100

        // var companyAmount = comissionAmount() * 100
        // var stylistAmount = parseFloat(services[0].Price) *100 + taxes(services[0].Price) * 100
        console.log("CLIENT STRIPE ID AT PAY")
        console.log(client.StripeId)
        createAppointmentsIterator(0, (result)=> {
            console.log("CREATE APPOINTMENTS ITERATOR ESULT")
            navigate('Appointments', {
                services: selectedServices,
                category: "pending",
                clientId: client.id,
                goBacktoHome: props.navigation.state.params.go_back_key
    
            })


        })
        // createCharge(totalAmount, paymentId, client.StripeId, (result)=> {
        //     console.log("THE CREATE CHARGE AMOUNT 123")
        //     console.log(result.data)
        //     if (result.data.code == "card_declined"){
        //         var reasoning = null
        //         if (result.data.decline_code=="insufficient_funds"){
        //             Alert.alert("Card Declined", "Card has insufficient funds")
                    
                    

        //         }
                
        //     } else {
        //         createAppointmentsIterator(0, (result)=> {
        //             console.log("CREATE APPOINTMENTS ITERATOR ESULT")
        //             navigate('Appointments', {
        //                 services: selectedServices,
        //                 goBacktoHome: props.navigation.state.params.go_back_key
            
        //             })


        //         })


        //     }

        // })

        // issueTransaction(companyAmount, stylistAmount, stylist.StripeId, (result)=> {
        //     console.log("THE ISSUE TRANSACTION RES")
        //     console.log(result)
        //     if (result==null){
        //         Alert.alert("Network Error", "Unable to proceed with transaction due to network issues")
        //     } else {
                
               
        //     }

        // })

       
        
        //come back to this 
       
    }
    const createCustomer = async (email) => {
        var test = 'danazahreddine@hotmail.com'
        axios({
            method: 'POST',
            url: `http://127.0.0.1:4000/api/customers/mobile/create?email=${test}`
        }).then(response=>{
            console.log("CUSTOMER SUCCESSFULLY CREATED")
            console.log(response)
        }).catch (error => console.log("Customer failed"))
    }

    
    const getCustomer = async () =>{
        // var id = "cus_JIC2EHqPQmagDO"
        // var answer = null
        // try {
        //     answer = await retrieveCustomer(id)

        // } catch (e){
        //     console.log("error")
        // }
        // console.log("RETURN OF GET CUSTOMER")
        // console.log(answer)
        // return answer
    }
    const getPayments = async () =>{
        var id = "cus_JIC2EHqPQmagDO"
        var answer = null
        try {
            answer = await listCustomerPaymentMethods(id)

        } catch (e){
            console.log("error")
        }
        console.log("RETURN OF GET CUSTOMER")
        console.log(answer)
        return answer

    }

    
    // var email = null
    // try {
    //     email = AsyncStorage.getItem("email")

    // } catch (e) {
    //     console.log(e)
    // }
    if (client!=null){
        console.log("IN CHECKOUT CLIENT IS DIFFERENT THAN NULL")
        console.log(client)
        // useEffect(()=> {
        //     (async () => {
        //     varCLIENT IS NULL ABOUT TO FETCH 2 id = "cus_JIC2EHqPQmagDO"

            if (client.StripeId==null && card==null){
                console.log("ABOUT TO SET THE CARD 2")
                console.log(refresh)
                //that means they don't have a card 
                setCard(
                    
                    <TouchableOpacity onPress={()=>{props.navigation.navigate('Add Credit Card', {
                    client:client,
                    state: !state,
                    arrivalDate: arrivalDate,
                    arrivalTime: arrivalTime,
                    next: "Checkout",
                    refreshState: !refreshState
                    
                    })}}>
                        <View style={styles.addCard}>
                        <Text style={styles.addPaymentText}>Add new card</Text>
                        <Ionicons name="arrow-forward-outline" size={25}></Ionicons>
                        </View>
                    </TouchableOpacity>

                )
            } else if (client.StripeId!=null && card==null){
                console.log("IN ELSE STATEMENT NOT A NEW CARD 123")
                console.log(client.StripeId)
                getPaymentMethod(client.StripeId, (response)=> {
                    console.log("GET PAYMENT METHOD RESPONSE 123")
                    console.log(response)
                    if (response!=null && response.data.length>0){
                        var paymentId = response.data[0].MainPaymentMethod
                        setpaymentId(paymentId)
                        retrievePaymentMethod(paymentId, (result)=> {
                            if (result!=null){
                                console.log("IN RETRIEVE PAYMENT METHOD 123")
                                console.log(result)
                                var card = result.data.card 
                                var cardType = card.brand 
                                var last4 = card.last4
                                var exp_month = card.exp_month
                                var exp_year = card.exp_year
                                setCard(
                                    <CardRow card={
                                        {
                                            lastDigits:last4,
                                            cardName:cardType,
                                            exp_month:exp_month,
                                            exp_year:exp_year
                                        }
                                    }
                                    />
                                )
                                fetchPaymentInfo(true)
                                
                               



                            }
                        })




                    } else {

                    }
                })

            }
            
    }

            // customer = await getCustomer()
            // if (customer!=null){
            //     var id = "cus_JIC2EHqPQmagDO"
            //     // console.log("customer not null")
            //     // console.log(customer)
            //     var paymentOptions = await getPayments()
            //     console.log("AFTER PAYMENT OPTIONS")
            //     if (paymentOptions==null){
            //         setPayments(paymentOptions => [])
            //         setcreateCard(createCard=>true)
            //         console.log("here")
            //         //client exists but has no cards so has to register one 
            //     }
            //     console.log(paymentOptions) 
            //     //means we retrieved it 
            //     //we need to look up their card informmation
            // }
           
            //var card = await AsyncStorage.getItem("@card")
        
            // console.log("AT TRY TO GET CARD")
            // console.log(card)
            // if (card !=null){
            //     console.log("pushing cards")
            //     setCard(JSON.parse(card))

            // }
                
          
           
        // })()
        // },[])
        

        // try {
        //     var done = getCustomer().then((res => res.data))
        //     console.log("DONE")
        //     console.log(done)
        //     // var done = (async ()=> {await getCustomer()})().then((data)=>setCustomer(customer=>data))
        //     // console.log("DONE")
        // } catch (e) {
        //     console.log(e)
    
        // }
        // var res = retrieveCustomer(id)
        // customer = res
        
       
        // console.log("CUSTOMER")
        // console.log(customer)
       
       
        
        

    

    const [addressList, editAddress] = useState([])
    // var clientList = getClientAddressList()
    // if (clientList.length!=0){
    //     for (var address in clientList){
    //         editAddress(addressList=>addressList.push(address))
    //     }

    // }
    //so now we got our addresses saved 
    //still got our stripe API's to cover 

    const computeTotalPrice = () => {
        var finalPrice = Number(priceTotal) + taxes(Number(priceTotal))
        if (String(finalPrice).split(".")[1]!=null && String(finalPrice).split(".")[1].length>=2){
            finalPrice = String(finalPrice).split(".")[0] +"."+ String(finalPrice).split(".")[1].substring(0,2)
    
        } else {
            finalPrice = String(finalPrice) + '0'
        }
        return finalPrice

    }
    const sumTotal = (price) => {
        console.log("IN SUM TOTAL FUNCTION")
        priceTotal += price
    }
    const formatPrice = (price) => {
        console.log("FORMAT PRICE FUNC")
        
        //original price not with taxes
        if (String(price).split(".")[1]!=null && String(price).split(".")[1].length==1 ){
            price = String(price)+'0'

        } else {
            price = String(price)

        }
        
        return price

    }
    for (var service in services){
        sumTotal(services[service].Price)
        
    }
   
   
   

    // if (createCard==true){
        console.log("AT CREDIT CARD")
        // cardElem = 
        // <TouchableOpacity onPress={()=>{props.navigation.navigate('Add Credit Card', {
        //     service:service,
        //     arrivalDate: arrivalDate,
        //     arrivalTime:arrivalTime
        // })}}>
        //     <View style={styles.addCard}>
        //     <Text style={styles.addPaymentText}>Add new card</Text>
        //     <Ionicons name="arrow-forward-outline" size={25}></Ionicons>
        //     </View>
        //     </TouchableOpacity>
    // }
    // console.log("FONTS LOADED")
    // console.log(fontsLoaded)

    
    // if (card!=null){
    //     console.log("cards not null")
    //     cardElem = <CardRow card={card}/>
    // if (creditCard!=null){
    //     cardElem = <CardRow card={creditCard}/>
    // }
        // var cardsList = []

        // for (var card in cards){
        //     console.log("FOR LOOP")
        //     console.log(card)
        //     var cardElem_ = <CardRow card={cards[card]}/>
        //     cardsList.push(cardElem_)


        // }
        // console.log("CARD ELEM HERE")
        // console.log(cardsList[0])
        // cardElem = cardsList[0]
    //}
    const addService = () => {
        console.log("ADD SERVICE")
        console.log(service)
        const {navigate} = props.navigation
        navigate("Stylist", {
            services: services,
            arrivalDate: arrivalDate,
            arrivalTime: arrivalTime
        })
    }
    const removeItem = (id) => {
        console.log("AT REMOVE ITEM")
        const {state, goBack} = props.navigation
        const params = state.params 
        console.log("THE PARAMS")
        console.log(state)
        console.log(params)

        var service = services.filter((service)=> service.Id == id)
        console.log("AFTER FILTER")
        console.log(service)
        var index = services.indexOf(service)
        services.splice(index,1)
        // setServices(selectedServices=> (selectedServices.splice(index,1)))
        console.log("THE SELECTED SERVICES AFTER REMOVE")
        
        // console.log(selectedServices)
        // console.log(selectedServices.length)
        
        if (services.length==0){
            goBack(params.go_back_key)
        } else {
            setChange(change=> !change)

        }
    }

    const StripeCheckout = () => {
        const params = useParams()
        const {id} = params 
        // useEffect(()=> {
        //     const asyncFunc = async () => {
        //         let sessionId = id || 
        //     }
        // })
    }

    const callback = () => {
        props.navigation.goBack()

    }

    const viewAllCards = () => {
        const {navigate} = props.navigation
        navigate("Card List", {
            refreshState: false
        })

    }

    const preTaxPrice = () => {
        var comission = 0
        if (stylist.Subscription == "Free" || stylist.Subscription ==null){
            comission = 0.3

        } else if (stylist.Subscription == 'Plus'){
            comission = 0.25
        } else {
            comission = 0.2
        }
        console.log("PRE TAX PRICE 2")
        console.log(services[0])
        console.log(service.Price)
        return Number(services[0].Price) + comission*Number(services[0].Price)
    }

    const navigateToAddressScreen = () => {
        const {navigate} = props.navigation
        navigate("Location", {
            nextScreen: "Checkout",
            props: props
        })
    }

    return (
        
        <View style={styles.container}>
            <View style={styles.body}>
                <ScrollView>
             {/* <ScrollView style={{height:'100%'}}> */}
            <CheckoutHeader callback={callback}/>
            <View style={styles.cartContainer}>
           
            
                <View style={styles.cartList}>
                {fontsLoaded &&
                <Text style={{
                     fontWeight: '600',
                     fontSize:20,
                     marginBottom:Dimensions.get('window').height*0.026,
                     marginTop:'5%',
                     fontFamily: 'Poppins-Medium'
                }}>Cart</Text>
            }
               
                {services.map((service) => {
                    return (
                        <CartItem service={service} stylist={stylist} totalCost={totalCost} arrivalDate={arrivalDate} arrivalTime={arrivalTime} removeItem={callback}/>
                    )
                })}
               
               
                </View>
                {/* <TouchableOpacity style={styles.addService} onPress={()=> addService()}>
                    <Text style={styles.addServiceText}>+ Add another service</Text>

                </TouchableOpacity> */}
                
                    <View style={{
                        marginBottom:'4%'
                    }}>
                    <View style={{marginBottom:'2.8%'}}>
                    {fontsLoaded &&
                    <Text style={{
                        fontWeight: '500',
                        fontSize:20,
                        marginTop:20,
                        fontFamily: 'Poppins-Medium'
                    }}>
                        Location</Text>
                    }
                    {/* {fontsLoaded && 
                    <Text style={{
                        fontFamily: 'Poppins-Regular',
                       


                    }}>{locationName}</Text>
                    
                    } */}
                    </View>
                    {/* <Location streetNum="3942" streetName="Kenwood Place" city="Orlando" state="Florida" zip="32801"/> */}
                    <TouchableOpacity onPress={()=> navigateToAddressScreen()}>
                        <Location address={address} aptSuiteBldg={aptSuiteBldg} navigateToAddress={navigateToAddressScreen}/>
                    </TouchableOpacity>
                    </View>
                    
            
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {fontsLoaded &&
                    <Text style={{
                        fontWeight: '500',
                        fontSize:20,
                        marginTop:20,
                        fontFamily: 'Poppins-Medium',
                        marginBottom: Dimensions.get('window').height*0.028
                    }}>Payment</Text>
                }
                {fontsLoaded &&
                    <TouchableOpacity onPress={()=> viewAllCards()}>
                        <Text style={{
                             fontWeight: '500',
                             fontSize:12,
                             marginTop:20,
                             fontFamily: 'Poppins-Regular',
                             textDecorationLine: 'underline'
                        }}>View All</Text>
                    </TouchableOpacity>
                    }
                    </View>
                   {/* {cardElem} */}
                   {card}
                   
                </View>

              

            </View>
           
            <View style={styles.bottomSection}>
         
            <View style={styles.orderSummary}>
                <View style={styles.orderSummaryBox}>
                    {fontsLoaded && 
                <Text style={{
                    fontFamily: 'Poppins-Medium',
                    marginBottom:35,
                    fontSize:18
                }}>Order Summary</Text>
                    }
                </View>
                <View style={styles.priceBox}>
                    {services.map((service)=> {
                        return (
                            
                            <View style={styles.subTotalBox}>
                            {fontsLoaded &&
                            <Text style={{ fontFamily: 'Poppins-Light'}}>Subtotal</Text>
                            }  
                            {fontsLoaded && 
                            <Text style={{ fontFamily: 'Poppins-Light'}}>${Number(service.Price).toFixed(2)}</Text>
                            }
                            </View>
                            

                        )
                    })}
               
                <View style={styles.taxesBox}>
                    {fontsLoaded && 
                    <Text style={{
                        fontFamily: 'Poppins-Light'

                    }}>Taxes (6%)</Text>
                    }
                    {fontsLoaded && 
                    <Text style={{
                        fontFamily: 'Poppins-Light'
                    }}>${taxesCost}</Text>
                    }
                </View>
                <View style={styles.travelDistanceBox}>
                {fontsLoaded && 
                    <Text style={{
                        fontFamily: 'Poppins-Light'

                    }}>Stylist Travel Fees</Text>
                    }
                    {fontsLoaded && 
                    <Text style={{
                        fontFamily: 'Poppins-Light'
                    }}>${travelCost}</Text>
                    }


                </View>
                <View style={styles.bookingFeeBox}>
                {fontsLoaded && 
                    <Text style={{
                        fontFamily: 'Poppins-Light'

                    }}>Booking Fee</Text>
                    }
                    {fontsLoaded && 
                    <Text style={{
                        fontFamily: 'Poppins-Light'
                    }}>${bookingFee}</Text>
                    }


                </View>
                   
                   
                </View>
                {fontsLoaded &&
                <View style={styles.total}>

                        
                        <Text style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize:16

                        }}>TOTAL</Text>
                        <Text style={{
                            fontFamily: 'Poppins-Medium',
                            fontSize:16
                        }}>${totalCost}</Text>
                </View>
                }
            </View>
            </View>
            </ScrollView>
            </View>
        
            <TouchableOpacity disabled={!paymentInfo} style={{
                flexDirection: "row",
                alignItems: "center",
                textAlign: "center",
                // flex: 1,
                justifyContent: 'center', 
                position: 'absolute',
                bottom:0,
                height: Dimensions.get('window').height*0.08,
                padding:20,
                alignSelf: 'center',
                backgroundColor: paymentInfo==false?"grey":"#1A2232",
                width:'100%'
            }} onPress={()=>pay()}>
                <Text style={styles.payText}>PAY</Text>
            </TouchableOpacity>
            {/* </ScrollView> */}
            
        </View>


    )

}

const styles = StyleSheet.create({
    container: {
        paddingTop:20,
        
        width: '100%',
        height:'100%',
        
       


    },
    body: {
        height: '90%'

    },

    cartContainer: {
        paddingLeft:30,
        paddingRight:20
        
        


    },
    bottomSection: {
        width: '100%',
        // position: 'absolute',
        bottom:0,
        paddingRight:20,
        paddingLeft:20,
        marginTop:50

    },
    cartText: {
        fontWeight: '600',
        fontSize:20,
        marginBottom:20,
        marginTop:'5%'
    },
    locationText: {
        fontWeight: '500',
        fontSize:20,
        marginTop:20
    },
    paymentText: {
        // fontWeight: '500',
        // fontSize:20,
        // marginTop:20,
        // fontFamily: 'Lato-Semibold',
        // marginBottom:20

    },
    viewAllText: {
        // fontWeight: '500',
        // fontSize:12,
        // marginTop:20,
        // fontFamily: 'Lato-Semibold',
        // textDecorationLine: 'underline'

    },
    addServiceText: {
        fontWeight: '300',
        fontSize:16,
        marginTop:30
    },
    addPaymentText: {
        fontWeight: '300',
        fontSize:16,

    },
    addCard: {
        marginTop:10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    orderSummaryText: {
        fontWeight:'bold',
        fontSize:18,
        color: '#1A2232',
        // fontFamily: 'Lato-Semibold'
        
       

    },
    orderSummaryBox: {
        // position: 'absolute',
        // bottom:100,
       
       
        flexDirection: 'column',
        justifyContent: 'flex-start',
      
      
     
        

    },
    total: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    totalText: {
        fontWeight: '600',
        color: '#1A2232',
        fontSize:18
    },
    priceText: {
        fontWeight: '600',
        color: '#1A2232',
        fontSize:18
    },
    taxesText: {
        fontWeight:'400',
        color: '#1A2232',
        fontSize:12
    },
    payBox: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        justifyContent: 'center',
       
        position: 'absolute',
        bottom:0,
        height: Dimensions.get('window').height*0.08,
     
        padding:20,
        alignSelf: 'center',
        backgroundColor: "#1A2232",
        // height: 50,
       
        width:'100%'
    },
    payText: {
        color: 'white',
        fontWeight: '600',
        fontSize:16
    },
    cartList: {
        borderBottomWidth:0.5,
        borderBottomColor: 'lightgray',
        paddingBottom:10
    },
    locationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    arrowIcon: {
        alignSelf: 'center'
    },
    taxesBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
  
    },
    travelDistanceBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    bookingFeeBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    subTotalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    priceBox: {
        paddingBottom: 27,
        borderBottomColor: 'lightgrey',
        borderBottomWidth:0.5,
        marginBottom:26
    }


})

export default Checkout