import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import { useFonts } from 'expo-font';
import SignUpEmail from "./SignUpEmail"
import {findCoordinates} from '../../Location/location'


const SignUp = (props) => {
    console.log("NAV")
    console.log(props.navigation)
    findCoordinates()
    // let {status} = await Location.requestPermissionsAsync()
    // console.log("status")
    // console.log(status)
    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require('../../assets/fonts/Lato-Heavy.ttf'),
        'Lato-Regular': require('../../assets/fonts/Lato-Regular.ttf'),
        'Lato-Semibold': require('../../assets/fonts/Lato-Semibold.ttf')
            
        
        })
    const emailPress = () => {
        const {navigate} = props.navigation
        navigate('Sign Up Email', {
            phone: props.navigation.state.params.phone
        })
    }
    const login = () => {
        const {navigate} = props.navigation
        navigate('Sign In')
    }

    return (
        <View style={styles.container}>
            <View style={styles.body}>
            <Text style={styles.signup}>SIGN UP</Text>
            <View style={styles.signupOptions}>
                <View style={styles.signupBlock}>
                    <TouchableOpacity style={styles.email} onPress={()=>{emailPress()}}>
                        <Text style={styles.emailText}>Sign up with email</Text>
                    </TouchableOpacity>
                   
                    <TouchableOpacity style={styles.google}>
                        <View style={styles.googleLogoFrame}>
                     <Image style={styles.googleLogo} source={require("../../assets/Logos/google.png")}/> 
                     </View>
                        <Text style={styles.googleText}>Continue with Google</Text>

                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.facebook}>
                    <View style={styles.googleLogoFrame}>
                     <Image style={styles.googleLogo} source={require("../../assets/Logos/facebook.png")}/> 
                     </View>
                        <Text style={styles.googleText}>Continue with Facebook</Text>


                    </TouchableOpacity>
                    {/* <View style={styles.stylistOption}>
                    <Text style={styles.or}>OR</Text>
                    <Text style={styles.stylistText}>SIGN UP AS STYLIST</Text>
                    </View> */}

                </View>

            </View>
          

            </View>
            {/* <View style={styles.footer}>
                <Text style={styles.haveaccountText}>Already have an account?</Text>
                <TouchableOpacity onPress={()=>login()}>
                <Text style={styles.loginText}>Login instead</Text>
                </TouchableOpacity>


            </View> */}
        </View>

    )
}
const styles = StyleSheet.create({
    body: {
        paddingTop:40,
        marginLeft:20,
        marginRight:10

    },
    google: {
        marginTop: 40,
        height:60,
        
        flexDirection: "row",
        justifyContent: "flex-start",
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: "white",
        borderWidth:2,
        borderColor: "lightgray",
        shadowColor: "black",
        shadowRadius:10,
        shadowOffset: {
            height:10,
            width:10
        },
        

    },
    facebook: {
        marginTop: 40,
        height:60,
        
        flexDirection: "row",
        justifyContent: "flex-start",
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: "white",
        borderWidth:2,
        borderColor: "lightgray",
        shadowColor: "black",
        shadowRadius:10,
        shadowOffset: {
            height:10,
            width:10
        },

    },
    signup: {
        fontWeight: '600'

    },
    googleLogo: {
        height:40,
        width:40,
        alignSelf: "center",
      

    },
    googleLogoFrame:{
        alignSelf: "center",
        borderColor: "lightgray",
        height:"100%",
        borderRightWidth:2,
        padding:10,
        backgroundColor: "white",
        

    },
    container: {
        width: '100%',
        height: '100%',
        flexDirection: "column"

    },
    signupOptions: {
        paddingTop:40

    },
    signupBlock: {
        width: '100%',
        height: 100,
      

    },
    email: {
        backgroundColor: '#1A2232',
        height:60,
        flexDirection: "row",
        justifyContent: "center",
        
        marginRight: 10,
        borderRadius: 5
    },
    emailText: {
        color: "white",
        fontFamily: "Lato-SemiBold",
        alignSelf: "center",
        fontWeight: '600'


    },
    googleText: {
        alignSelf: "center",
        color: "#1A2232",
        fontFamily: "Lato-SemiBold",
        fontWeight: '600',
        paddingLeft:50

    },
    footer: {
        position:"absolute",
        
        bottom:0,
        
        flexDirection:'column',
        width:'100%',
        marginBottom:40,
        justifyContent: "center",
        alignItems: "center",
        
        
    },
    haveaccountText: {
        padding:20,
        fontFamily: "Lato-SemiBold",
        fontSize: 16,
        color: "grey",
        fontWeight: "600"
    },
    loginText: {
        fontFamily: "Lato-SemiBold",
        fontSize:16,
        textDecorationLine: "underline"

    },
    stylistText: {
        padding:20,
        // fontFamily: "Lato-SemiBold",
        // fontSize: 16,
        // color: "grey",
        fontWeight: "600",
        alignSelf: "center"

    },
    stylistOption: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    or: {
     
        fontFamily: "Lato-SemiBold",
        fontSize: 12,
        color: "grey",
        fontWeight: "600"

    }

})

export default SignUp