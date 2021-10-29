import React from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button } from 'react-native';


const TopBar2 = () =>{
    return (
        <View style={styles.searchBarWrapper}>
            <View>
            <Image style={styles.logoText} source={require("../assets/logotext.png")}/>
            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    searchBarWrapper: {
        
        paddingTop: 40,
        width: Dimensions.get('window').width,
        height:100,
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        padding:10,
        
        
       

    },
    logoText: {
        width: 150,
        height:35

    },
    icons: {
        flexDirection: "row"
    }
});

export default TopBar2;