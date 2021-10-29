import React, {useState} from 'react'
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import {AntDesign} from 'react-native-vector-icons'



const SchedualeHeader = (props) => {
    const callback = () => {
        props.backwards()
    }
    return (
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.row} onPress={()=> callback()}>
            <AntDesign name={'left'} size={25} style={styles.icon}/>

            </TouchableOpacity>
            
            
            <Image style={styles.logo} source={require("../assets/logotext.png")} style={styles.logo}></Image>
         

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop:0.05*Dimensions.get('window').height,
        height:0.06*Dimensions.get('window').height,
        width:'100%',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray',
        paddingLeft:10,
        paddingRight:10
    },
    logo: {
        width:120,
        height:35,
       
        
    },
    row: {
        flexDirection: 'row'
    },
    icon: {
       paddingTop:'1%',
      
    }
})
export default SchedualeHeader
