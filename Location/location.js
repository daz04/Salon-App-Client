import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import {Constants, Locaiton, Permissions} from 'expo'
export const locationAvailable = () => {
    var available = true
    try {
        const value = AsyncStorage.getItem("@location")
        if (value==null){
            available = false
            
        }
    } catch (e){
        available=false
    }
    return available
}

export const findCoordinates = async () => {
    // var long = null 
    // var lat = null
    
    let {status} = await Location.requestPermissionsAsync()
    console.log("status")
    console.log(status)
    if (status!=='granted'){
        var countryName = null 
        var regionName = null
        var url = 'https://freegeoip.net/json/'
        fetch (url)
        .then ((response)=>response.json())
        .then((responseJson)=> {
            countryName = responseJson.country_name;
            regionName = responseJson.region_name


        }).catch((error)=>{
            console.log("error occured")
        })

    }else {
        let location = await Location.getCurrentPositionAsync({})
        console.log(location)
    }

  
   
    // navigator.geolocation.getCurrentPosition(
    //     position => {

    //         long = position.coords.longitude
    //         lat = position.coords.latitude
    //     },
    //     error => console.log("error occured")
    // )
    // if (long==null || lat==null){
    //     var countryName = null 
    //     var regionName = null
    //     var url = 'https://freegeoip.net/json/'
    //     fetch (url)
    //     .then ((response)=>response.json())
    //     .then((responseJson)=> {
    //         countryName = responseJson.country_name;
    //         regionName = responseJson.region_name


    //     }).catch((error)=>{
    //         console.log("error occured")
    //     })
    //     //couldnt get user location from geolocation use alternative 
    // }
}

