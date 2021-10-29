import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button ,ScrollView, TouchableOpacity } from 'react-native';

const EmptyBody = (props) => {
    var type = props.tyoe
    var bookAgain = null 
    if (type=="upcoming"){
        bookAgain = <TouchableOpacity>
            <View>
            <Text>BOOK NOW</Text>
            </View>
        </TouchableOpacity>

    }
    return (
        <View style={styles.container}>
            
            <Text style={styles.text}>No Bookings Yet</Text>
            {bookAgain}
        
        
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        
     
       

    },
    text: {
        alignSelf: 'center',
        

    }
    
})
export default EmptyBody