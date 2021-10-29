import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons'
import {Ionicons} from 'react-native-vector-icons'
import { SvgXml } from "react-native-svg"
import { useFonts } from 'expo-font';
import Cart from '../../assets/Icons/cart.svg'
import moment from 'moment'
// import Icon from 'react-native-vector-icons/Ionicons'

const CartItem = (props) => {
    
    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require('../../assets/fonts/Lato-Heavy.ttf'),
        'Lato-Regular': require('../../assets/fonts/Lato-Regular.ttf'),
        'Lato-Semibold': require('../../assets/fonts/Lato-Semibold.ttf'),
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf')

    })
    const taxes = (price) => {
        var taxes = 0.06*price
        return taxes
    }
    var service = props.service
    var stylist = props.stylist
    var totalCost = props.totalCost

  
  
    var arrivalDate = props.arrivalDate
    var arrivalTime = props.arrivalTime
    const [qty, setQty] = useState(1)
    var modifiedarrivalDate = moment(arrivalDate).format('LLL').replace(' 12:00 AM','').toUpperCase()

    const removeItem = () => {
        props.removeItem()
    }

    return (
        <View style={styles.container}>
            <View style={styles.row1}>
                {fontsLoaded &&
                <Text style={{
                    fontWeight: '600',
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16

                }}>{service.Name}</Text>
                }
                <View style={styles.duration}>
                <View style={styles.durationBox}>
                    <Text style={styles.durationText}>{service.Duration} min</Text>
                    <Ionicons style={styles.iconClock} name="time-outline" size={14.5}></Ionicons>
                </View>
                {/* <Cart 
                width={20}
                height={10}/> */}
              
                </View>
 
            </View>
            {fontsLoaded && 
            <View style={styles.row2}>
                <Text style={{
                    maxWidth:'70%',
                    fontFamily: "Poppins-Light",
                    fontSize:12
                }}>{service.Description}</Text>
            
                <Text style={{
                     fontFamily: 'Poppins-Medium',
                     fontSize: 18,
                     fontWeight: '600'
                }}>${totalCost}</Text>
            </View>
            }
            <View style={styles.row3}>
                <Text style={{
                    color: 'grey',
                    fontWeight: '400', 
                    fontFamily: "Poppins-Regular"
                }}>{modifiedarrivalDate} AT {arrivalTime}</Text>
            </View>
            <View style={styles.row4}>
                <TouchableOpacity style={styles.removeBox} onPress={()=>removeItem()}>
                    {fontsLoaded &&
                    <View style={{
                        borderBottomColor: 'gray',
                        borderBottomWidth: 1,
                        fontFamily: 'Poppins-Light'
                    }}>
                    <Text style={styles.remove}>REMOVE</Text>
                    </View>
                }
                </TouchableOpacity>
    
            </View>


        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height:'auto',
        flexDirection: 'column'
       
    },
    row1: {
        flexDirection: 'row',

    },
    qtySelect: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'

    },
    row4: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom:5
    },
    row3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom:Dimensions.get('window').height*0.02
    },
    row2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom:5,
       
    },
    descriptionText: {
        maxWidth:'70%'

    },

    row1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom:5
    },
    name: {
        fontWeight: '600',
        
    },
    durationText: {
        fontSize: 12,
        color: "black",
        fontWeight:'300',
        flexWrap: 'wrap'
        
    },
    remove: {
      
        // textDecorationLine: 'underline',
        color: 'gray',
        fontSize:12,
        
    },
    buttons: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius:50,
        width:25,
        height:25,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
      
    },
    btnText: {
        alignSelf: 'center'
    },
    qtyText: {
        fontSize:18,
        marginLeft: 10,
        marginRight:10
    },
    duration: {
        flexDirection:'row'
    },
    priceText: {
        fontFamily: 'Lato-Heavy',
        fontSize: 18,
        fontWeight: '600'
    },
    date: {
        color: 'grey',
        fontWeight: '400'
    },
    removebox: {
        borderBottomWidth:1,
        borderBottomColor: 'gray',
        alignSelf: "flex-start"
    },
    removeFrame: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    durationBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',

       
    },
    iconClock: {
        marginLeft:10,
        
    }
    
})

export default CartItem