import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import { useFonts } from 'expo-font';
import {CognitoUserPool,CognitoUserAttribute, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import SchedualeHeader from '../../Headers/scheduale';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getAvailabileLocations} from '../../Database/functions'
import { StackActions } from '@react-navigation/native';
import { NavigationActions } from 'react-navigation';
import analytics from '@react-native-firebase/analytics'
const SignIn = (props)=> {
    
    const {navigate} = props.navigation
  
    
    var client = props.navigation.state.params.client
    console.log("SIGN IN PROPS")
    console.log(props)
    const storeTokens = async (tokens) => {
        console.log("AT STORE TOKENS")
        try {
            await AsyncStorage.setItem('Session',tokens)
        } catch (e){
            alert (e)
        }
    }
    const poolData = {
        UserPoolId: "us-east-1_t7jb40TQi",
        ClientId: "2jqchvesq7gscj0vqd2hu1m5po" 

    }
    var userPool = new CognitoUserPool(poolData);
    // let [fontsLoaded] = useFonts({
    //     'Lato-Heavy': require('../../assets/fonts/Lato-Heavy.ttf'),
    //     'Lato-Regular': require('../../assets/fonts/Lato-Regular.ttf'),
    //     'Lato-Semibold': require('../../assets/fonts/Lato-Semibold.ttf')
            
        
    //     })
    const [email, changeEmail] = useState(null)
    const [password, changePassword] = useState(null)
    const [verification, setVerification] = useState(null)
    const [code,setCode] = useState(null)
    const [submitDisabled, setDisabled] = useState(false)

    useEffect(()=> {
        analytics().logScreenView({
            screen_name: 'Enter Password Screen',
            screen_class: 'Enter Password Screen'
        })

    },[])


    if (email==null){
        console.log("SIGN IN EMAIL")
        console.log(client.Email)
        changeEmail(client.Email)
    }
    // if (fontsLoaded){
    //     console.log("THE FONTS LOADED")
        
    // }
    const resendVerification = () => {
        var user = new CognitoUser({
            Username: email, 
            Pool: userPool
        })
        user.resendConfirmationCode((err,res)=>{
            if (err){
                console.log(err)
            }
            console.log("worked")
        })

    }
    const submit = () => {
        setDisabled(true)
       
        console.log("AT SUBMIT")
        console.log("EMAIL AT SUBMIT")
        console.log(email)
        var user = new CognitoUser({
            Username: email, 
            Pool: userPool
        })
        var authDetails = new AuthenticationDetails({
            Username: email,
            Password: password

        })
        if (verification!=null && code!=null){
            user.confirmRegistration(code, true, ((err,result)=>{
                if (err){
                    console.log(err)
                    return
                }

            }))
            
        }
        user.authenticateUser(authDetails, {
            
            onSuccess: session => {
                console.log("AT SUCCESS")
                analytics().logEvent('signed_in', {
                    id: client.id,
                   
                })
                analytics().setUserId(client.id)
                analytics().setUserProperty('Name', client.FirstName + " "+client.LastName)
                //successfully logged user in 
                var tokens = {
                    accessToken: session.getAccessToken().getJwtToken(),
                    idToken: session.getIdToken().getJwtToken(),
                    refreshToken: session.getRefreshToken().getToken()
                   
                }
                // localStorage.setItem("Session",{'tokens':tokens})
                // console.log(props)
                // storeTokens(tokens)
                var tokenData = JSON.stringify(tokens)
                
            
                    //come back to fix coordinates later
                
                // var coords = null
              
                // coords = {
                //     'Latitude': 26.7993013,
                //     'Longitude':-80.22668039999999
                // }
                // navigator.geolocation.getCurrentPosition(
                //     position=> {
                //         var location = JSON.stringify(position)
                //         location = {
                //             'Latitude':location['coords']['latitude'],
                //             'Longitude': location['coords']['longitude']
                //         }
                //         console.log("find coordinates location")
                //         console.log(location)
                //         coords = location
                        
                     
        
                //     },
                //     error=> alert(error.message)
                // )
                
                try {
                    AsyncStorage.setItem('@session', tokenData)
                    AsyncStorage.setItem('clientId',client.id)
                    //AsyncStorage.setItem('locationCoords', JSON.stringify(coords))
                  } catch (e) {
                      console.log("EMAIL NOT SAVED IN ASYNC")
                    // saving error
                  }
                if (props.navigation.state.next!=null){
                    if (props.navigation.state.next=="Checkout"){
                        navigate("Checkout")
                    }
                   
                } else {
                   
                    navigate("Select Service")
                    // const resetAction = StackActions.reset({
                    //     index:0,
                    //     actions: [NavigationActions.navigate({routeName: 'Select Service'})]
                    // });
                    // props.navigation.dispatch(resetAction)

                }
               
            },
            onFailure: ((err)=>{
                if (err.code=="UserNotConfirmedException"){
                    console.log("not confirmed")
                    setVerification(verification => 
                    <View style={styles.verification}><TouchableOpacity onPress={()=>resendVerification()}><Text style={styles.verificationText}>Resend Verification Code</Text></TouchableOpacity>
                    <TextInput value={code}
                    onChangeText={setCode}
                    placeholder="Enter verification code"/>
                    </View>
                    )

                }
                console.log("error at faliure")
                console.log(err)
                //alert("There was an issue verifying your user credentials. Please try again.")
            })
        })


    }
    const signUp = () =>{
        navigate('Phone Number')
    }

    const goBack = () => {
        props.navigation.goBack()
    }
    return (
        <View style={styles.container}>
            <SchedualeHeader backwards={goBack}/> 
            <View style={styles.body}>
            <Text style={styles.signup}>LOGIN</Text>
            {/* <View style={styles.emailBlock}> 
            <Text style={styles.emailText}>Email</Text>
            <TextInput style={styles.email}
            placeholder="Enter your email"
            value={email}
            onChangeText={changeEmail}></TextInput>

            </View> */}
            <View style={styles.passwordBlock}>
                <Text style={styles.passwordText}>Password</Text>
                <TextInput style={styles.password}
                value={password}
                onChangeText={changePassword}
                placeholder="Enter your password"
                secureTextEntry={true}>
                    
                </TextInput>

            </View>
            {verification}
            <TouchableOpacity disabled={submitDisabled} style={styles.login} onPress={()=> {submit()}}>
                <Text style={styles.loginText}>LOGIN</Text>

            </TouchableOpacity>

            </View>
            <View style={styles.footer}>
                <Text style={styles.haveaccountText}>Don't have an account?</Text>
                <TouchableOpacity onPress={()=>{signUp()}}>
                <Text style={styles.signupText}>Sign up instead</Text>
                </TouchableOpacity>
           

        </View>
        </View>
       
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: "column"

    },
    login: {
        marginTop:60,
        height:60,
        
        flexDirection: "row",
        justifyContent: "center",
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: "#1A2232",
        borderWidth:2,
        borderColor: "lightgray",
        shadowColor: "black",
       

    },
    loginText: {
        color: "white",
        // fontFamily: "Lato-Heavy",
        alignSelf: "center",
        fontWeight: '600'

    },
    body: {
        paddingTop:40,
        marginLeft:20,
        marginRight:10

    },
    signup: {
        fontWeight: '600'

    },
    emailText: {
        paddingBottom:20,
        color: "#1A2232",
        // fontFamily: "Lato-Semibold"

    },
    verificationText: {
        paddingBottom:20,
        color: "#1A2232",
        // fontFamily: "Lato-Semibold",
        marginTop:20

    },
    passwordText: {
        paddingBottom:20

    },
    emailBlock: {
        marginTop:40

    },
    passwordBlock: {
        marginTop:40

    },
    password: {
        
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
        
        backgroundColor: 'white',
        height:60,
        flexDirection: "row",
        justifyContent: "center",
        
        marginRight: 10,
        borderRadius: 5,
        fontSize: 20,
        padding:10

    },
    email: {
        
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
        
        backgroundColor: 'white',
        height:60,
        flexDirection: "row",
        justifyContent: "center",
        
        marginRight: 10,
        borderRadius: 5,
        fontSize: 20,
        padding:10
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
    signupText: {
        // fontFamily: "Lato-SemiBold",
        fontSize:16,
        textDecorationLine: "underline"
    },
    haveaccountText: {
        padding:20,
        // fontFamily: "Lato-SemiBold",
        fontSize: 16,
        color: "grey",
        fontWeight: "600"
    },
    verification: {
        paddingTop:20,
        marginTop:20
    }
})
export default SignIn