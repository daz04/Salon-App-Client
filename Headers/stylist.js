import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCurrentEmail } from '../Enviornmental/functions';

const StylistHeader = (props) => {
    const [cart, setCart] = useState(null)
    const [count, setCount] = useState(0)
    const [selectedIds, setIds] = useState([])
    const fetchCart = async () => {
        var cart_= AsyncStorage.getItem('@cart')
        setCart(cart=>cart_)
        

    }
    const getCount = () => {
        if (cart!=null){
            var count_ = cart.length
            setCount(count=>count_)
        }
        
    }
    const getItems = () => {
        //need to make sure cart is always a list if it's not null
        if (cart!=null){
            for (var obj in cart){
                setIds(selectedIds.push(cart[obj].ServiceId))

            }
        }
    }
    
    
    fetchCart()
    getCount()
    getItems()



    return(
        <View></View>
    )

}
const styles = StyleSheet.create({

})