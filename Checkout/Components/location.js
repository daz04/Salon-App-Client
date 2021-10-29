import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Alert} from 'react-native'
import {Ionicons, MaterialIcons} from 'react-native-vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useFonts} from 'expo-font';



const Location = ({address, aptSuiteBldg, navigateToAddress}) =>{
    console.log("IN THE LOCATION TAB")
    console.log(aptSuiteBldg)

    // const [addressType, setType] = useState(null)
    // const [addressContents, setContents] = useState(false)
    // const [address, setAddress] = useState(null)

    let [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf')

     });

    //I need to get address type to fill different values and when to add extra information before proceedin

    // const fetchAddressType = async () => {
    //     var type = await AsyncStorage.getItem("locationType")
    //     console.log("FETCH ADDRESS TYPE")
    //     console.log(type)
    //     setType(type)
       

    // }
    // if (addressType==null){
    //     fetchAddressType()

    // }

    // const generateAddressContents = async () => {
    //     console.log("IN GENERATE ADDRESS CONTENTS 2")
    //     console.log(addressType)
    //     if (addressType == "Current"){
    //         console.log("IN CURRENT")
    //         var address = props.address
    //         console.log("THE ADDRESS IN GENERATE ADDRESS CONTENTS")
    //         console.log(address)
    //         setAddress(address)



    //     }
    //     setContents(true)

    // }
    // if (addressContents==false && addressType!=null){
    //     generateAddressContents()

    // }





    // var address = props.address
    // // var streetNum = props.streetNum 
    // // var streetName = props.streetName 
    // // var city = props.city 
    // // var state = props.state 
    // // var zip = props.zip 
    // var city = address.City 
    // var state = address.State 
    // var streetName = null 
    // var streetNum = null 
    // var unitName = null 
    // var appartmentNum = null
    // if (address.StreetName!=null){
    //     streetName = address.StreetName
    // } 
    // if (address.StreetNumber!=null){
    //     streetNum = address.StreetNumber
    // } 
    // if (address.StreetName!=null){
    //     streetName = address.StreetName
    // } 
    
    
    // if (address.UnitName!=null){
    //     unitName= address.UnitName
    // }
    // if (address.AppartmentNumber !=null){
    //     appartmentNum = address.AppartmentNumber
    // }
    return (
        <View style={styles.container}>
            <View style={styles.locationBox}>
            <View style={{
                flexDirection: 'row'
            }}>
           
                <View style={styles.iconBox}>
                    {/* <Image style={styles.icon} source={require("../../assets/pin.png")} resizeMethod="resize"/> */}
                    <Image style={styles.icon} source={require('../../assets/mappin.png')}/>

                </View>
                <View style={styles.textBox}>
                    {fontsLoaded && 
                    <Text style={{
                        fontFamily: "Poppins-Regular"
                    }}>{address}</Text>
                    }
                    {/* {appartmentNum && <Text>{appartmentNum}</Text>}
                    {unitName!=null && <Text>{unitName}</Text>}
                    {streetNum!=null && <Text>{streetNum}</Text>}
                    {streetName!=null && <Text>{streetName}</Text>}

                    
                    <Text style={styles.stateLine}>{city}, {state}</Text> */}

                </View>
            </View>
            <View>
                {aptSuiteBldg==null && 
                fontsLoaded && 
                <View style={{flexDirection: 'row'}}>
                    <View style={{
                        height:30,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop:'2%',
                        borderColor: 'black',
                        borderRadius:5,
                        borderWidth:0.5,
                        padding:5
                
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize:10


                        }}>Add apt/bldg info</Text>
                    </View>
                    <TouchableOpacity onPress={()=>navigateToAddress()}>
                        <MaterialIcons name={"keyboard-arrow-right"} size={30}/>
                    </TouchableOpacity>
                </View>}
                {aptSuiteBldg!=null && fontsLoaded &&
                    <View style={{
                        height:30,
                        maxWidth:50
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize:10
                        }}>
                            Apt/Bldg 

                        </Text>
                        <Text style={{
                            fontFamily: 'Poppins-Regular'
                        }}>
                            {aptSuiteBldg}

                        </Text>
                    </View>

                }

            </View>
            </View>
            {/* <Ionicons name="arrow-forward-outline" size={25}></Ionicons> */}

        </View>

    )
}
const styles = StyleSheet.create ({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        width: '100%',
        marginTop:20

    },
    locationBox: {
        flexDirection:'row',
        width:'100%',
        justifyContent: 'space-between'
       

    },
   
    icon: {
        width:20,
        height:30
        // width:100,
        // height:200,
        // alignSelf: "center"
    },
    iconBox:{
        width:20,
        height:20
    },
    textBox: {
        marginLeft:10,
        flexDirection: 'column',
        maxWidth: Dimensions.get('window').width*0.5,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    streetNumLine: {
        fontWeight: '500',
        fontSize: 16
    },
    stateLine: {
        fontWeight:'300'
    }

})
export default Location