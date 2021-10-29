import { useLinkProps } from '@react-navigation/native';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button ,ScrollView, TouchableOpacity } from 'react-native';


const AppointmentNavigator = (props) => {
    var options = ["Upcoming","Pending", "History", "Cancelled"]
    var selected = props.selected

    var elems = []
    const pressUpcoming = () => {
        props.callback('upcoming')
    }
    const pressHistory = () => {
        props.callback('history')
    }
    const pressPending = () => {
        props.callback('pending')
    }
    const pressCancelled = () => {
        props.callback("cancelled")
    }
    return (
        <View style={styles.container}>
            <ScrollView
            horizontal={true} style={styles.scroll}>
                {options.map((option)=>{
                    var style = null
                    if (option==selected){
                        style = styles.selectedBox
                        
                        
                       
                        
                    } else {
                        style = styles.upcomingBox
                    
                    }
                    return (
                    <View style={style}>
                    <TouchableOpacity onPress={()=> {if (option=='Upcoming'){
                        pressUpcoming()

                    } else if (option=="History"){
                        pressHistory()
                    } else if (option=="Cancelled"){
                        console.log("THE FUCKING OPTION IS CANCELLED")
                        pressCancelled()


                    } else {
                        pressPending()
                    }
                    }}>
                    <Text>{option}</Text>
                    </TouchableOpacity>
                    </View>
                    )


                })}
                
            </ScrollView>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 40,
        width: '100%',
        borderBottomColor: 'grey',
        borderBottomWidth: 1
        
    },
    selectedBox: {
        padding:10,
        borderBottomColor: '#C2936D',
        borderBottomWidth:1
    },
    upcomingBox:{
        padding:10
    },
    historyBox: {
        padding:10
    },
    scroll: {
        marginLeft:20,
        marginRight:20,
        

    }
})

export default AppointmentNavigator