import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import {Ionicons} from 'react-native-vector-icons'
import {AntDesign} from 'react-native-vector-icons'


const LandingHeader = (props) => {
    var selectFilter = props.selectFilter
    const [location, setLocation] = useState(null)

    async function locationInAsync () {
        //should return bool
        var location = await AsyncStorage.getItem("@location")
        if (location!=null){
            return true
        } else {
            return false
        }
    }
    // const locationfromIP = async () => {
    //     console.log("at location from ip")
        
    //     var ip = await Network.getIPAddressAsync()
    //     console.log("IP")
    //     console.log(ip)
    //     var response = await fetch(`http://api.ipstack.com/${ip}?access_key=2529431f6346206cd1ead442fd1c1e3f`)
    //     console.log("RESPONSE")
    //     console.log(response)
    //     return response
    
    // }

    
    // const findCurrentLocationAsync = async () => {
    //     let {status} = await Permissions.askAsync(Permissions.LOCATION);
    //     if (status !== 'granted'){
    //         locationfromIP()
    //     } else {
    //         let location_ = await Location.getCurrentPositionAsync({});
    //         console.log("Current Location")
    //         var lat = location_.latitude 
    //         var long = location_.longitude 
    //         setLocation((lat,long))
    //         locationfromIP()

    //     }
    // }

    const openlocationModal = () => {
        props.selectLocation()
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.body}>
            <Image style={styles.logo} source={require('../assets/logotext.png')}/>
            <View style={styles.iconBox}>
                {/* <TouchableOpacity onPress={()=>selectFilter()} style={styles.icon}>
            <Ionicons style={styles.icon} name="filter-outline" size={30}/>
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.icon} onPress={()=>openlocationModal()}>
            <Ionicons name="location-outline" size={25}/>
            </TouchableOpacity> */}
            {/* <AntDesign style={styles.icon} name={"shoppingcart"} size={30}/> */}
            </View>


            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height:'auto',
        marginTop:20,
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray',
        paddingBottom: Dimensions.get('window').height*0.025,
        paddingTop: Dimensions.get('window').height*0.025

      

    },
    body: {
        paddingLeft:20,
        paddingRight:20,
        
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    logo: {
        width:Dimensions.get('window').width*0.35,
        height:Dimensions.get('window').height*0.04,
        alignSelf: 'center',
        marginTop:2
    },
    iconBox: {
        
        flexDirection: 'row'
        
    },
    icon: {
        alignSelf: 'center',
        marginLeft:5,
        marginRight:5
        
    }

})

export default LandingHeader
