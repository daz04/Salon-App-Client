import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Alert} from 'react-native';
import {getServiceList} from '../../Database/functions'
import { useFonts } from 'expo-font';

const StylistNavigator = (props) => {
    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require('../../assets/fonts/Lato-Heavy.ttf'),
        'Lato-Regular': require('../../assets/fonts/Lato-Regular.ttf'),
        'Lato-Semibold': require('../../assets/fonts/Lato-Semibold.ttf')
            
        
    })
    var category = props.category
    var stylistId = props.stylistId
    const [categories, setCategories] = useState([])
    const [services, setServices] = useState(null)

    const getServices = () => {
        console.log(stylistId)
        getServiceList(stylistId, (result)=> {
            if (result!=null){
                console.log("GET SERVICE LIST RESULTS")
                console.log(result)
                setServices(services=>result)
                getCategories(result)
            } else {
                Alert.alert("Network Error", "Unable to fetch stylist information")
            }
        })
        
      
        //assume for now servivces is never empty -> find a way to gaurentee this 
    }

    const getCategories = (services) =>{
        var categories_ = []
        for (var service in services){
            var cat = services[service].Category
            if (!(categories_.includes(cat))){
                
                categories_.push(cat)
               

            } 
        }
        console.log("CATEGORIES")
        console.log(categories_)
        setCategories(categories=>categories_)
        
        
    }
    console.log("at nav")
    console.log(categories)
    if (services==null){
        getServices()
        

    }
    const callback = (category)=> {
        props.handleChange(category)
    }
   

    return (
        <View style={styles.container}>
            <ScrollView 
            horizontal={true}
            style={styles.scroll}>
               
                
                {categories.map((cat)=>{
                    return (
                        <TouchableOpacity onPress={()=>callback(cat)}>
                        <View style={{borderBottomColor: cat==category?"#C2936D":'transparent', borderBottomWidth:1}}>
                        <Text style={styles.category}>{cat}</Text>
                        </View>
                        </TouchableOpacity>

                    )
                    
                })}
            </ScrollView>
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height:'7%',
        paddingLeft:20,
        backgroundColor: 'white'

    },
    scroll: {
        width: '100%',
        flexDirection: 'row',
       
        height:200


    },
    category: {
        padding: 20,
        fontFamily: 'Lato-Regular',
        color: "#1A2232",
        fontWeight:'600'
    }
})

export default StylistNavigator
