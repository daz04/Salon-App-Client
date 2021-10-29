import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from 'react-native-vector-icons'
import {AntDesign} from 'react-native-vector-icons'
const AppointmentHeader = () => {
    return (
        <View style={styles.container}>
            <View style={styles.body}>
            <Image style={styles.logo} source={require('../assets/logotext.png')}/>
            {/* <View style={styles.iconBox}>
            <AntDesign name={"shoppingcart"} size={30}/>
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
        alignSelf: 'center',
        marginTop:2
    },
    iconBox: {
        alignSelf: 'center'
        
    },
    icon: {
        
    }

})

export default AppointmentHeader