import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import Cart from '../components/cart'
import {SimpleLineIcons} from 'react-native-vector-icons'
const ProfileHeader = () => {
    return (
    <View style={styles.container}>
    <View style={styles.body}>
    <Image style={styles.logo} source={require('../assets/logotext.png')}/>
    {/* <View style={styles.iconBox}>
        <SimpleLineIcons  style={styles.mapPin} name={"location-pin"} size={20}/>


        <Cart/>
 
    </View> */}


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
        justifyContent: 'space-between'

    },
    logo: {
        width:120,
        height:35,
        marginTop:2,
        alignSelf: 'center'
    },
    iconBox: {
        flexDirection: 'row',
        alignSelf: 'center'
        
    },
    icon: {
        
    },
    mapPin: {
        paddingTop:2,
        marginRight:15
    }

})

export default ProfileHeader