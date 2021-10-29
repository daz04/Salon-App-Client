import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
import { useFonts } from 'expo-font';
import {CognitoUserPool,CognitoUserAttribute, CognitoUser} from 'amazon-cognito-identity-js';
import Svg, {SvgXml} from 'react-native-svg';
import {MaterialIcons} from 'react-native-vector-icons'

import {ProgressBar, Colors} from 'react-native-paper'
import { postClient } from '../Database/functions';

// import {CognitoIdentityCredentials, CognitoIdentity, CognitoIdentityServiceProvider} from 'aws-sdk'


const config = {
    identityPool: 'us-east-1:41a3b7d5-ecd1-45fc-bb02-b8e7dd45fc54',

}
const poolData = {
    UserPoolId: "us-east-1_t7jb40TQi",
    ClientId: "2jqchvesq7gscj0vqd2hu1m5po" 
   
    
 }
var userPool = new CognitoUserPool(poolData);
const AccountVerification = (props) => {
    const xml =`<svg class="icon" height="512" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M480 352c-105.888 0-192 86.112-192 192s86.112 192 192 192 192-86.112 192-192-86.112-192-192-192z m0 320c-70.592 0-128-57.408-128-128s57.408-128 128-128 128 57.408 128 128-57.408 128-128 128z m96 160H160c-17.632 0-32-14.336-32-32V288c0-17.632 14.368-32 32-32h96c17.664 0 32-14.336 32-32s-14.336-32-32-32h-96c-52.928 0-96 43.072-96 96v512c0 52.928 43.072 96 96 96h416c17.696 0 32-14.304 32-32s-14.304-32-32-32z m-64-576h320c17.664 0 32 14.368 32 32v256c0 17.696 14.304 32 32 32s32-14.304 32-32V288c0-52.928-43.072-96-96-96H512c-17.664 0-32 14.336-32 32s14.336 32 32 32z m224 80a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0zM320 160h128c17.696 0 32-14.304 32-32s-14.304-32-32-32H320c-17.696 0-32 14.304-32 32s14.304 32 32 32z m640 608h-96v-96c0-17.696-14.304-32-32-32s-32 14.304-32 32v96h-96c-17.696 0-32 14.304-32 32s14.304 32 32 32h96v96c0 17.696 14.304 32 32 32s32-14.304 32-32v-96h96c17.696 0 32-14.304 32-32s-14.304-32-32-32z" fill="#333333" ></path></svg>`
    var clientPayload = props.navigation.state.params.clientPayload
    var formattedPhone = props.navigation.state.params.formattedNum
    var next = props.navigation.state.params.next
    var phoneNum = clientPayload.phone
    var user = props.navigation.state.params.user
    const [code, setCode] = useState(null)
    const [disable,setDisable] = useState(true)
    // const [user,setUser] = useState(null)
    const [userFetched, setuserFetched] = useState(false)
    console.log('USER OBJECT hi')
    console.log(props.navigation.state.params.user)




    // if (userFetched==false){

    //     setUser(props.navigation.state.params.user)
    //     setuserFetched(true)
    // }
    const resendCode = () => {
        user.resendConfirmationCode((err,res)=>{
            if (err){
                console.log("IN RESEND CONFIRMATION CODE ERROR")
                console.log(err)
            }
            console.log("at resend confirmation code")
            console.log(res)
            
        })

    }

    const setCodeText = (input) => {
        setCode(input)
        if (input.length>0){
            setDisable(false)
        }else {
            setDisable(true)
        }

    }
    const verify = () => {
       
    
       const {navigate} = props.navigation
       user.confirmRegistration(code, true, ((err,result)=>{
           console.log("IN ABOUT TO CONFIRM")
           if (err){
               if (err.code=="ExpiredCodeException"){
                    alert("Verification code is expired. Ask for new verification code")
                    return
               }
               if (err.code=="CodeMismatchException"){
                   alert("Incorrect code was entered")
                   return
               }
               if (err.code=="InvalidParameterException"){
                   alert("Enter in a valid verification code")
                   return 
               }
               
               console.log(err)
              
             
           } 
            postClient(clientPayload, (result)=> {
                if (result!=null){
                    navigate('Select Service', {
                        clientPayload: clientPayload
                    })

                } else {
                    //come back to
                    console.log("POST CLIENT DIDN'T WORK")

                }
            })
           
            console.log("BEFORE NEXT")
            console.log(next)
            // navigate("Get Approval",{
            //     stylistPayload: stylistPayload,
            //     next:next
            // })
            // navigate("Identification",{
            //     stylistPayload: stylistPayload,
            //     next:next
            // })
           
           
           

           
        //    try {
        //     AsyncStorage.setItem('email',email)
        //   } catch (e) {
        //       console.log("EMAIL NOT SAVED IN ASYNC")
        //       return
        //     // saving error
        //   }
         
        //    var customer = createCustomer(email, (result)=>{
        //        console.log("at create customer")
        //        if (result==null){
        //            console.log("Error creating stripe account")
        //            return
        //        } 
        //        console.log("Creating customer was successful")
        //    })
           //now sign in the user 
           


       }))
       navigate('Select Service', {
        clientPayload: clientPayload
    })
    //    console.log("RIGHT BEFORE POSTING STYLIST")
    //    console.log(stylistPayload)
    //    postStylist(stylistPayload)
    //         console.log("BEFORE NEXT")
    //         console.log(next)
    //         // navigate("Get Approval",{
    //         //     stylistPayload: stylistPayload,
    //         //     next:next
    //         // })
    //         navigate("Identification",{
    //             stylistPayload: stylistPayload,
    //             next:next
    //         })
        



    }
    return (
        <View style={styles.container}>
            <View style={styles.body}>
           
             <View style={styles.imageBox}>
                <TouchableOpacity>
                <MaterialIcons name={"sms"} size={25}/>
                </TouchableOpacity>
            </View>
            <Text style={styles.verificationText}>Verification Code sent to +1{formattedPhone}</Text>
            <View style={styles.inputBox}>
            <TextInput style={styles.inputText}
            onChangeText={setCodeText}
            value={code}
            placeholder="Enter in Verification Code"
            keyboardType={'numeric'}
            returnKeyType={'done'}
            ></TextInput>
            </View>
            <TouchableOpacity style={styles.resendBox} onPress={()=>resendCode()}>
                <Text style={styles.resendText}>Resend Verification Code</Text>

            </TouchableOpacity>
            </View>
            <View style={styles.confirmBox}>
            <TouchableOpacity style={{flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: disable?"grey":"#1A2232",
            // bottom:Dimensions.get('window').height*0.05,
            height:Dimensions.get('window').height*0.08,
            // position: 'absolute',
            width: Dimensions.get('window').width,}} disabled={disable} onPress={()=>verify()}>
            <Text style={styles.submit}>Submit</Text>
            </TouchableOpacity>
            </View>
           

        </View>
    )

}
const styles = StyleSheet.create({
    container:{
        width: '100%',
        height:'100%',
        // marginTop:'10%'
    },
    inputBox: {
        width: Dimensions.get('window').width*0.8 +25,
        height: 50,
        borderWidth:1,
        borderColor: 'grey',
        alignSelf: 'center',
        marginTop:'10%'
        
      

    },
    inputText: {
       
        // fontFamily: "Lato-Semibold",
        fontSize:16,
        fontWeight: '600',
        alignSelf: "center",
        paddingTop:10,
      
       
        paddingLeft:20,
        paddingRight:20
    },
    submit: {
        fontSize:18,
        color: 'white',
        fontWeight: '600'
    },
    imageBox: {
        backgroundColor: '#dae0ee',
        borderRadius: 100,
        height: 80,
        width:80,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: Dimensions.get('window').height*0.1 +20
        

    },
    verificationText: {
        fontWeight: '500',
        
        alignSelf: 'center',
        marginTop:'10%'
    },
    
    confirm: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        flex: 1,
        justifyContent: 'center',
        
        // height:Dimensions.get('window').height*0.08,
           
        
        alignSelf: 'center',
        backgroundColor: "#1A2232",
       
        
       
        width: Dimensions.get('window').width,
       
        
        


    },
    body: {
        paddingTop:40,
        marginLeft:20,
        marginRight:20

    },
    confirmText: {
        color: 'white',
        fontWeight: '600',
        fontSize:16
    },
    confirmBox: {
        bottom:0,
        //height:Dimensions.get('window').height*0.08 ,
        position: 'absolute',
        // height:Dimensions.get('window').height*0.08,
       
        // bottom:Dimensions.get('window').height*0.05,
        
       
    },
    resendText: {
       alignSelf: 'center',
       fontSize: 16, 
       textDecorationLine: 'underline',
       color: '#1A2232'

    },
    resendBox: {
        marginTop:20,
        
    },
    stepHeader: {
        marginTop:20,
        alignSelf: 'center',
        width: 200,
        marginBottom:'10%'
       
        
        

    },
    stepText: {
        fontSize:18,
        fontWeight:'600',
        alignSelf: 'center',
        marginBottom:10
    },
})

export default AccountVerification