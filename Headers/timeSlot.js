import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import {AntDesign} from 'react-native-vector-icons'

const TimeSlotHeader = (props) => {

    const back = () => {
        //to go back
        props.back()

    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>back()} style={{alignSelf: 'center'}}>
            <AntDesign name={"left"} size={25} />
            </TouchableOpacity>
            
            <Image style={styles.logo} source={require("../assets/logotext.png")}></Image>
            
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        
        marginTop:40,
        height:50,
        width:'100%',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray',
        paddingLeft:10,
        paddingRight:10

    },
    logo: {
        width:120,
        height:35,
        alignSelf: 'center'
    },
    icon: {
        alignSelf: 'center'
    }
})
export default TimeSlotHeader