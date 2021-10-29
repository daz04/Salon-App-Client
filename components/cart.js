import React from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button } from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default class Cart extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            numberofItems:0,
            listofItems: []
        }
    }
    render(){
        var numberofItems = null;
        if (this.state.numberofItems != 0){
            numberofItems = <View style={styles.cartView}><Text>{this.state.numberofItems}</Text></View>
        }
        return (
            <View style={styles.cartView}>      
                {numberofItems}
                <Image style={styles.icon} source={require('../assets/shopping-cart.png')} width={25} height={25}/>
                {/* <Ionicons name="cart-outline" size={25} color="black"/> */}

            </View>

        )
    }
}

const styles = StyleSheet.create({
    cartView: {
        width:20,
        height:30,
        flexDirection: "column"


    },
    cartAmount: {

    },
    icon: {
        width: 25,
        height:30
    }

})
