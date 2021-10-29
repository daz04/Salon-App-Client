import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Alert} from 'react-native';
import ProfileHeader from '../Headers/profile'
import ProfileBody from '../components/Profile/body'
import {getClient} from '../Database/functions'
import MenuBar from '../components/MenuBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useFonts} from 'expo-font'
import {StackActions, NavigationActions} from 'react-navigation'
import {getPutClientProfilePicUrl, fetchClientProfilePicUrl} from '../Services/S3/functions'
const ProfileOverview = (props) => {
    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require("../assets/fonts/Lato-Heavy.ttf"),
        'Lato-Medium': require("../assets/fonts/Lato-Medium.ttf"),
        'Lato-Regular': require("../assets/fonts/Lato-Regular.ttf"),
        'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
        'Lato-Semibold': require('../assets/fonts/Lato-Semibold.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf')
     });

    const [client, setClient] = useState(null)
    const [imagePostUrl, setImageUrl] = useState(null)
    const [imageUrl, setImage] = useState(null)

    // const redirect = (screen) => {
    //     const {navigate} = props.navigation
    //     console.log("PROFILE BODY REDIRECT")
    //     console.log(screen)
    //     if (screen=="HOME"){
    //         navigate("")

    //         props.redirect("HOME")
    //     } else if (screen=="BOOKINGS"){
    //         props.redirect("BOOKINGS")
    //     } else if (screen=="SEARCH"){
    //         props.redirect("SEARCH")
    //     }
    // }
    

    if (client==null){
        getClient((result)=> {
            if (result!=null){
                setClient(result.data[0])
            } else {
                Alert.alert("Network Error", "Network error occured")
            }
        })
        
    }

    const changeScreen = (screen) =>{
        const {navigate} = props.navigation 
        console.log("PROFILE OVERVIEW PROPS")
        console.log(props)
        if (screen=="HOME"){
            navigate("Landing")
        } else if (screen=="BOOKINGS"){
            console.log("SCREEN BOOKINGS")
            navigate("Appointments")
        } else if (screen=="SEARCH"){
            navigate("Select Service")
        }

    }
    const signOut = () => {
        const {navigate} = props.navigation
        AsyncStorage.clear()
        navigate("Phone Number")
        const resetAction = StackActions.reset({
            index:0,
            actions: [NavigationActions.navigate({routeName: 'Phone Number'})]
        });
        props.navigation.dispatch(resetAction)

    }
    return (
        <View style={styles.container}>
            <ProfileHeader/>
            {client!=null && 
            <ProfileBody  redirect={changeScreen} client={client}/> }
            {fontsLoaded &&
             <TouchableOpacity style={styles.signOutTab} onPress={() => signOut()}>
                <Text style={{fontSize: 16, marginLeft:10, color: 'white', fontWeight: '600', alignSelf: 'center', fontFamily: 'Poppins-Regular'}}>Sign Out</Text>
            </TouchableOpacity>
            }
            <MenuBar screen={'PROFILE'} callback={changeScreen}/>
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        height:'100%'
    },
    signOutTab: {
        width: Dimensions.get('window').width,
        height: 65,
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center',
      
       
        backgroundColor: '#1A2232',
        position: 'absolute',
        bottom:Dimensions.get('window').height*0.07

    },
})
export default ProfileOverview