import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, BackHandler} from 'react-native';
import StylistNavigator from '../components/Stylist/navigator'
import StylistProfile from '../components/Stylist/profile'
import StylistBody from '../components/Stylist/body'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getService} from '../Database/functions'

const StylistOverview = (props) => {


    console.log("STYLIST OVERVIEW 2")
    var services = props.navigation.state.params.services
    var arrivalDate = props.navigation.state.params.arrivalDate
    var arrivalTime = props.navigation.state.params.arrivalTime
    var clientCoords = props.navigation.state.params.clientCoords
    var stylistId = services[0].StylistId
    console.log(stylistId)
    var selectList = []
    for (var service in services){
        selectList.push(services[service].id)

    }
   
    const [cart, setCart] = useState(null)
    const [count, setCount] = useState(0)
    const [selectedIds, setIds] = useState(selectList)
    const [selectCategory, setCategory] = useState(services[0].Category)
    const backAction = () => {
        console.log("AT BACK ACTION")
        if (selectedIds.length==0){
            alert("Select service before returning to checkout")
            return false
        }
        return true

    }

    useEffect(()=> {
        console.log("USE EFFECT")
        BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        )

    },[backAction])
    const callback = (category) => {
        setCategory(selectCategory=>category)
    }
    const fetchCart = async () => {
        var cart_= await AsyncStorage.getItem('@cart')
        console.log("CART ON STYLIST END")
        console.log(cart_)
        var cartItem = []
        console.log("cart split")
        console.log(cart_.length)
        var testString = cart_+",{dana:hi}"
        console.log("TEST STRING")
        console.log(testString.split('},').length)
      
        console.log(cart_.split("},").length)
        var cartSplit = cart_.split('},')
        for (var item in cartSplit){
          
            console.log("cart item")
            console.log(cartSplit[item]+"}")
            cartItem.push(JSON.parse(cartSplit[item]))
        }
        console.log(cartItem)
        setCart(cart=>cartItem)
        
        console.log("at cart")
        console.log(cart)
        getCount(cartItem)
        // getItems(cartItem)
        

    }
    const getCount = (cartItem) => {
        console.log("at count")
     
        var count_ = cartItem.length
        setCount(count=>count_)
        
        
    }
    const getItems = (cartItem) => {
        //need to make sure cart is always a list if it's not null
        
        for (var obj in cartItem){
            setIds(selectedIds => ([selectedIds, cartItem[obj].ServiceId]))
            console.log("ids")
            console.log(cartItem[obj])

            
        }
    }

    if (cart==null){
        fetchCart()
        
        
    }
    console.log("Done")

   

    const modifySelection = (serviceObj) => {
       
        console.log("AT MODIFY SELECTION")
        console.log(serviceObj.Id)
        var id = serviceObj.Id
       
        console.log("TRYING TO DO THE FILTER")
        console.log(selectedIds)
        console.log(id)
        console.log(selectedIds.indexOf(id))
        var theindex = selectedIds.indexOf(id)
        if (theindex<0){
            console.log("THE LOOP")
            setIds(selectedIds => ([...selectedIds,id]))
        } else {
            console.log("SERVICE EXISTS")
            var index = selectedIds.indexOf(id)
            console.log("THE FILTER")
            console.log(selectedIds.filter(id_ => id_!==id))
            setIds(selectedIds.filter(id_ => id_!==id))
            console.log(selectedIds)
           
        }
    

    }
    const submit = () => {
        // console.log("AT SUBMIT")
        // console.log(selectedIds)
        // if (selectedIds.length==0){
        //     alert("Select service before continuing")
        // } else{
        //     const {navigate} = props.navigation
        //     var services = []
        //     for (var id in selectedIds){
        //         var service = getService(selectedIds[id])
        //         services.push(service)
        //     }
        //     navigate("Checkout",{
        //         services:services,
        //         arrivalTime: arrivalTime,
        //         arrivalDate
        //     })
        // }
    }
    
  
    
    
  


    return (
        <View style={styles.container}>
            <StylistProfile stylistId={stylistId}></StylistProfile>
            <StylistNavigator stylistId={stylistId} category={selectCategory} handleChange={callback}></StylistNavigator>
            <StylistBody stylistId={stylistId} category={selectCategory} services={services} arrivalTime={arrivalTime} arrivalDate={arrivalDate} clientCoords={clientCoords} modifySelection={modifySelection} submit={submit}></StylistBody>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height:'100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
   

    },
    topRow: {
        width:'100%',
        height:'100%'
        
      
        

    }

})
export default StylistOverview