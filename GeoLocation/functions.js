// import React from 'react';
// import {NetworkInfo} from 'react-native-network-info'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { Alert } from 'react-native';

// async function locationInAsync () {
//     //should return bool
//     var location = await AsyncStorage.getItem("@location")
//     if (location!=null){
//         return true
//     } else {
//         return false
//     }
// }
// const findCoordinates = () => {
//     console.log("IN FIND CORRDINATES")
//     var lat = null
//     var long = null
    
//     navigator.geolocation.getCurrentPosition(
//         position => {
//             const location = JSON.stringify(position)
//             console.log("location")
//             console.log(location)
//             // lat = position.coords.latitude
//             // long = position.coords.longitude
            
            
//         }, 
//         error => Alert.alert(error.message)
//     )
//     console.log(lat)
//     console.log(long)
//     return (lat,long)
// }
// const locationfromIP = async () => {
//     var ip = await NetworkInfo.getIPAddress()
//     var response = await fetch(`http://api.ipstack.com/${ip}?access_key=2529431f6346206cd1ead442fd1c1e3f`)
//     return response

// }
// export const getLocation = ()=> {
//     console.log("IN GET LOCATION FUNCTION")
//     var location = null
//     if (locationInAsync()){
//         //used save location

//     } else {
//         console.log("IN ELSE CLAUSE")
//         var location = findCoordinates()
//         if (location==null){
//             var response = locationfromIP()
//             console.log(response)

//         }
        

//     }
    


// }