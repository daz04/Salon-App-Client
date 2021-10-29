import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import {MaterialIcons} from 'react-native-vector-icons'

const CheckoutHeader = (props) => {
    const goBack = () => {
        props.callback()

    }
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <TouchableOpacity onPress={()=>goBack()}>
                <MaterialIcons name={"arrow-back-ios"} size={25}/>
                </TouchableOpacity>
            <Image style={styles.logo} source={require('../assets/logotext.png')}/>
            


            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 50,
        marginTop:40,
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray',

      

    },
    body: {
        paddingLeft:20,
        paddingRight:20,
        
        flexDirection: 'row',
        

    },
    logo: {
        width:120,
        height:35,
        top:-5,
        
        paddingTop:0,
        
        
       
    },
    iconBox: {
        
        flexDirection: 'row'
        
    },
    icon: {
        alignSelf: 'center',
        marginLeft:5,
        marginRight:5
        
    }

})
export default CheckoutHeader