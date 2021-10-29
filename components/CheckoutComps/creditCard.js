import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native'
import {isAuthorized} from '../../Auth/checkAuthorization'

const CreditCard = (props) =>{
    var cognitoUser = isAuthorized()
    var cardElem = null
    if (cognitoUser!=null){
        console.log("cognito user exists")
    }
    return (
        <View style={styles.container}>
            
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height:100,
        width: '100%',
        flexDirection: 'row',

    }
})
export default CreditCard