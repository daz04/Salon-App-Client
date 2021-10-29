import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import {Ionicons} from 'react-native-vector-icons';
import {FontAwesome} from 'react-native-vector-icons'
import {useFonts} from 'expo-font';


const CardRow = (props) => {
    console.log(props)
    var lastDigits = props.card.lastDigits 
    var cardName = props.card.cardName
    var imageSource = props.card.imageSource
    var token = props.card.token 
    var exp_month = props.card.exp_month
    var exp_year = props.card.exp_year
    var cardList = {
        "MasterCard": require("../../assets/Icons/CreditCards/masterCardIcon.png"),
        "Visa": require("../../assets/Icons/CreditCards/visaCardIcon.png"),
        "American-Express": require("../../assets/Icons/CreditCards/americanexpressCardIcon.png"),
        "Discovery": require("../../assets/Icons/CreditCards/discoverCardIcon.png")

    }
    let [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf')

     });
    return (
        <View style={styles.container}>
            <View style={styles.cardInfo}>
            {/* <Image style={styles.cardImg} source={imageSource}/> */}
            <Ionicons name="ios-card-outline" size={20}/>
            {fontsLoaded &&
            <View style={styles.cardText}>
                <Text style={{
                    fontWeight:'500',
                    fontFamily: 'Poppins-Regular'
                }}>{cardName.charAt(0).toUpperCase()+cardName.slice(1)}</Text>
                <Text style={{
                    fontWeight:'300',
                    fontFamily: 'Poppins-Regular'

                }}>**** {lastDigits}</Text>

            </View>
            }
            
            </View>
            {fontsLoaded &&
            <Text style={{
                alignSelf: 'center',
                fontFamily: 'Poppins-Regular'

            }}>Expires {exp_month}/{exp_year}</Text>
            }
            {/* <Text>{exp_month}</Text>
            <Text>{exp_year}</Text>
            <Ionicons name="arrow-forward-outline" size={25}></Ionicons> */}


        </View>
    )



}
const styles = StyleSheet.create({
    container:{
        height:50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    cardInfo: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    cardText: {
        flexDirection: 'column',
        paddingLeft:10
    },
    cardImg: {
        width:50,
        height:35

    },
    cardNameText: {
        fontWeight:'500'
    },
    cardDigits: {
        fontWeight:'300'
    },
    expiry: {
        alignSelf: 'center'

    }

})

export default CardRow