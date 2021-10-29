import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import { useFonts } from 'expo-font';
import {MaterialIcons} from 'react-native-vector-icons'



const PhoneVerification = (props) => {
   
    var phone = props.navigation.state.params.cognitoData.phone
    return (
        <View style={styles.container}>
            <View style={styles.imageBox}>
            <TouchableOpacity onPress={()=> pickImage()}>
                <MaterialIcons name={"sms"} size={35}/>
                </TouchableOpacity>

            </View>
            <Text style={styles.verificationText}>Verification Code sent to {phone}</Text>
            <View style={styles.inputBox}>
            <TextInput style={styles.inputText}
            onChangeText={setCode}
            value={code}
            placeholder="Enter in Verification Code"></TextInput>
            </View>

    

        </View>
    )
}
const styles = StyleSheet.create({
    container: {

    }

})
export default PhoneVerification