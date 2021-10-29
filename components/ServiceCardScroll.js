import React from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground} from 'react-native';
import {generateServiceObjList} from '../handlers/handlers'
import GeneratestylistServiceCard from '../handlers/handlers'
const ServiceCardScroll = (props)=>{

    var services = props.services
    console.log("PASSED SERVICES TO SERVICE CARD SCROLL 1235")
    console.log(services)

    // var isCategory = props.category
    // var currentSelection = props.currentSelection
    // var expectedArrivalDate = props.arrivalDate 
    // var expectedArrivalTime = props.arrivalTime 
    // var clientCoords = props.clientCoords

    // console.log("current selection")
    // console.log(currentSelection)
    // var services = null 
    // if (props.isSub==false){
    //     services = generateServiceObjList(currentSelection,false)

    // } else {
    //     services = generateServiceObjList(currentSelection,true)
    // }
    
    console.log("SERVICES LIST")
    console.log(services[0])
    var stylistSlots = null
    // for (var service in services){
    //     //return single slot 
    //     var slot = generatestylistServiceCard(services[service],expectedArrivalDate,expectedArrivalTime,clientCoords)
    // }
    const setSelected = (selected, stylist, time) => {
        console.log("IN SET SELECTED 123")
        console.log(selected)
        props.setSelected(selected,stylist, time)
    }
    stylistSlots = <GeneratestylistServiceCard services={services} setSelect={setSelected} arrivalDate={props.arrivalDate} arrivalTime={props.arrivalTime}/>
    // generatestylistServiceCard(services,expectedArrivalDate,expectedArrivalTime,clientCoords)
    console.log("stylist slots")
    console.log(stylistSlots)
    



   
    return (
        
        <View style={styles.container}>
            <ScrollView style={styles.scroll}>

            
            {stylistSlots}
            </ScrollView>

        </View>
       
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '80%'
    },
    scroll: {
        height:'100%'
    }
})

export default ServiceCardScroll;