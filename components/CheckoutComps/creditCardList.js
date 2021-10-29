import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Alert} from 'react-native';
import {getClient, getPaymentMethod} from '../../Database/functions'
import {retrievePaymentMethod, retrieveCard} from '../../Stripe/functions'
import {Ionicons} from 'react-native-vector-icons'
import CardRow from '../CheckoutComps/cardRow'
import CheckoutHeader from '../../Headers/checkout'
import {updatePaymentMethodEntry} from '../../Database/functions'
const CreditCardList = (props) => {
    console.log("CREDIT CARD LIST")
    console.log(props.navigation)

    var refreshState = props.navigation.state.params.refreshState

    const [creditCards, setcreditCards] = useState([])
    const [payments, setPayments] = useState([])
    const [creditCardsFetched, setcreditCardsFetched] = useState(false)
    const [stripeId, setstripeId] = useState(null)
    const [mainCard, setmainCard] = useState(null)
    const [selected, setSelected] = useState(null)
    const [client,setClient] = useState(null)
    const [state, setState] = useState(false)
    const [refresh, setRefresh] = useState(refreshState)

    if (refresh!=null && refresh!=refreshState){
        console.log('IN DIFFERENT PAYMENT CREDIT CARD LIST')
        setRefresh(refreshState)
        getPaymentMethod(stripeId, (result)=> {
            console.log("CARD LIST GET PAYMENT METHOD RESULT")
            if (result!=null){

                var cards = result.data[0]
                console.log("THE CARDS")
                console.log(cards)
                var mainCard = cards.MainPaymentMethod
                setmainCard(mainCard)
                setSelected(mainCard)
                var paymentMethods = []
                var totalMethods = []
                console.log("PAYMENTS BEFORE RE-ITERATION")
                console.log(payments)
                for (var elem in cards.PaymentMethodList){
                    if (!(payments.includes(cards.PaymentMethodList[elem]))){
                        console.log("PAYMENT LIST DOES NOT INCLUDE THIS")
                        console.log(cards.PaymentMethodList[elem])
                        paymentMethods.push(cards.PaymentMethodList[elem])

                    }
                    totalMethods.push(cards.PaymentMethodList[elem])
                   
                }
                console.log("THE PAYMENT METHODS LIST 123")
                console.log(paymentMethods)
                setPayments(totalMethods)
                paymentIterator(paymentMethods, stripeId, 0)
                //fetch card information for each payment method
                //set a card object to be consistent: exp_month, exp_year, card name, last 4 digits


            } else {
                Alert.alert("Network Error", "Unable to fetch payment methods")

            }
        })
        
    }

   
    const getStripeId = (callback) => {
        getClient(response=> {
            if (response!=null){
                setClient(response.data[0])

            }
            
            callback(response)
        })

    }

    const paymentIterator = (paymentList, stripe_id, count) => {
        console.log("IN PAYMENT ITERATOR")
        console.log(count)
        console.log(paymentList.length)
        if (count==paymentList.length) {
            console.log("payment iterator finished")
        } else {
            var paymentId = paymentList[count]
            console.log("PAYMENT ID IN PAYMENT ITERATOR")
            console.log(paymentId)
            retrieveCard(paymentId, stripe_id, (result)=> {
                if (result!=null){
                    var card = result.data 
                    var cardType = card.brand 
                    var last4 = card.last4
                    var exp_month = card.exp_month
                    var exp_year = card.exp_year
                    var cardObj= {
                        lastDigits:last4,
                        cardName:cardType,
                        exp_month:exp_month,
                        exp_year:exp_year,
                        paymentId: paymentId
                        }
                    setcreditCards(creditCards=> ([...creditCards, cardObj]))
                    var newCount = count+1
                    paymentIterator(paymentList, stripe_id,newCount)

                } else {
                    Alert.alert("Network Error", "Unable to fetch payment methods")
                    
                }

            })
            // retrievePaymentMethod(paymentId, (result)=> {
            //     if (result!=null){
            //         var card = result.data.card 
            //         var cardType = card.brand 
            //         var last4 = card.last4
            //         var exp_month = card.exp_month
            //         var exp_year = card.exp_year
            //         var cardObj= {
            //             lastDigits:last4,
            //             cardName:cardType,
            //             exp_month:exp_month,
            //             exp_year:exp_year,
            //             paymentId: paymentId
            //             }
            //         setcreditCards(creditCards=> ([...creditCards, cardObj]))
            //         paymentIterator(paymentList, count+1)

            //     } else {
            //         Alert.alert("Network Error", "Unable to fetch payment methods")
                    
            //     }
            // })

        }

    }

    if (props.navigation.state.params!=null && props.navigation.state.params.thestate!=null && props.navigation.state.params.thestate!=state){
        getPaymentMethod(stripeId, (result)=> {
            console.log("CARD LIST GET PAYMENT METHOD RESULT")
            if (result!=null){

                var cards = result.data[0]
                console.log("THE CARDS")
                console.log(cards)
                var mainCard = cards.MainPaymentMethod
                setmainCard(mainCard)
                setSelected(mainCard)
                var paymentMethods = []
                for (var elem in cards.PaymentMethodList){
                    paymentMethods.push(cards.PaymentMethodList[elem])
                }
                console.log("THE PAYMENT METHODS LIST")
                console.log(paymentMethods)
                setPayments(paymentMethods)
                paymentIterator(paymentMethods, stripeId, 0)
                //fetch card information for each payment method
                //set a card object to be consistent: exp_month, exp_year, card name, last 4 digits


            } else {
                Alert.alert("Network Error", "Unable to fetch payment methods")

            }
        })
        setState(props.navigation.state.params.thestate)

    }

  

    if (creditCardsFetched==false){
        getStripeId((result)=> {
            if (result!=null){
                
                var stripeId = result.data[0].StripeId 
                setstripeId(stripeId)
                console.log("THE STRIPE ID BEFORE PAYMENT METHOD IN CARD LIST")
                console.log(stripeId)
                getPaymentMethod(stripeId, (result)=> {
                    console.log("CARD LIST GET PAYMENT METHOD RESULT")
                    if (result!=null){

                        var cards = result.data[0]
                        console.log("THE CARDS")
                        console.log(cards)
                        var mainCard = cards.MainPaymentMethod
                        setmainCard(mainCard)
                        setSelected(mainCard)
                        var paymentMethods = []
                        for (var elem in cards.PaymentMethodList){
                            paymentMethods.push(cards.PaymentMethodList[elem])
                        }
                        console.log("THE PAYMENT METHODS LIST")
                        console.log(paymentMethods)
                        setPayments(paymentMethods)
                        paymentIterator(paymentMethods, stripeId, 0)
                        //fetch card information for each payment method
                        //set a card object to be consistent: exp_month, exp_year, card name, last 4 digits


                    } else {
                        Alert.alert("Network Error", "Unable to fetch payment methods")

                    }
                })


            } else {
                Alert.alert("Network Error", "Unable to fetch payment methods")
            }
        })

        setcreditCardsFetched(true)
    }

    const addPaymentMethod = () => {
        var paymentMethodsId = []
        for (var elem in creditCards){
            paymentMethodsId.push(creditCards[elem].paymentId)

        }
        props.navigation.navigate('Add Credit Card', {
            client:client,
            next: "Card List",
            mainMethod: mainCard,
            paymentMethods: paymentMethodsId,
            thestate: !state,
            refreshState: !refreshState
        
            
        })

    }

    const changeSelected = (card) => {
        //change the selected card
        //change on frontend
        console.log("IN CHANGE SELECTION")
        console.log(card)
        console.log("IN THE CHANGE SELECTED")
        console.log(payments)
        
        updatePaymentMethodEntry(stripeId, card.paymentId, payments, (result)=> {
            if (result!=null){
                console.log("UPDATE PAYMENT METHOD RESULT")
                console.log(result)
                setSelected(card.paymentId)

            } else {
                Alert.alert("Network Error", "Network error occured")
            }
        } )



    }
    const goBack = () => {
        props.navigation.goBack()
    }
    return (
        <View style={styles.container}>
            <CheckoutHeader back={goBack}/>
            <View style={styles.body}>
                <Text style={styles.title}>Your Saved Payment Methods</Text>
                <View style={styles.addAddressRow}>
                
                    
                <TouchableOpacity style={{flexDirection:'row', marginRight:10}} onPress={()=>addPaymentMethod()}>

                <Ionicons name={"add"} size={30} />
                <Text style={{alignSelf: 'center',fontSize:11}}>Add New Payment Method</Text>
                </TouchableOpacity>
                </View>
                <ScrollView style={{height:'100%'}}> 
                {creditCards.map((card)=> {
                

                return(
                
               <View style={styles.addressRow}>
                    <TouchableOpacity style={styles.checkbox} onPress={()=>changeSelected(card)}>
                            <View style={{backgroundColor: (card.paymentId==selected)?'#1A2232':'transparent', display:card.paymentId==selected?'flex':'none', width: 30,height:30,borderRadius: 20,}}> 
                            <Ionicons name='checkmark-outline' size={25} style={styles.check}></Ionicons>
                            </View>
    
                        </TouchableOpacity>
               
               
               <View style={styles.addressInfo}>
               <CardRow card={card}/>
               </View>
           </View>

                )})}

        </ScrollView>
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={()=>submit()}><Text style={styles.submitText}>SAVE</Text></TouchableOpacity>
            {/* {update} */}

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width:'100%',
        height: '100%'

    },
    body: {
       
        marginTop:20
    },
    addressRow: {
       
        width:'90%',
        marginRight:10,
       
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingRight:10,
        paddingLeft:10
        
    },
    addressIcon: {
        marginRight:5,
        marginTop:5
        
    },
    addressLabel: {
        color: '#1A2232',
        fontWeight: '600',
        fontSize:16

    },
    addressBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    addressModifiers: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    addressDescription: {
        flexDirection: 'row',
        width:200,
        
        
        
    },
    editModifier: {
       
        marginRight:5,
        fontWeight:'600'
    },
    deleteModifier: {
        fontWeight:'600'
        
    },
    checkbox: {
        width: 30,
        height:30,
        borderRadius: 20,
        borderWidth:0.5,
        borderColor: "#1A2232",
        marginRight:10,
        marginTop:20
    
    },
    check: {
        color: 'white',
        alignSelf: 'center'
    },
    title: {
        marginLeft:10,
        fontWeight: '600',
        fontSize:18,
        marginBottom:10,
        
    },
    addAddressRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    addressInfo: {
        width:'100%',
        marginTop:20
   
    },
    submitBtn: {
      
        backgroundColor: '#1A2232',
        width:'100%',
        height:60,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        bottom:0
    },
    submitText: {
        fontWeight:'600',
        color: 'white',
        alignSelf: 'center',
        fontSize:18
    },

})
export default CreditCardList