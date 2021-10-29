import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {Constants, FileSystem, Linking} from 'expo';
import {CognitoUserPool,CognitoUserAttribute, CognitoUser} from 'amazon-cognito-identity-js';
import {getClientByPhone} from '../../Database/functions'
import analytics from '@react-native-firebase/analytics'


// import {AWS} from 'aws-sdk'
// AWS.config.update({region: 'us-east-1'})
// const poolData = {
//     UserPoolId: "us-east-1_t7jb40TQi",
//     ClientId: "2jqchvesq7gscj0vqd2hu1m5po" 
   
    
// }
// Amplify.configure({
//     Analytics: {
//         AWSPinpoint: {
//             region: "us-east-1",
//             appId: "05f45e0d947544c5a5c288c1717442c4",
//             mandatorySignIn: false
//         }
//     }
// });

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)
const PhoneNumberForm = (props) => {



    useEffect(()=> {
        analytics().logScreenView({
            screen_name: 'Enter Phone Number Screen',
            screen_class: 'Enter Phone Number Screen'
        })
       

    }, [])



    const [number, setNumber] = useState('')

    console.log("AT PHONE FORM")
    console.log(Dimensions.get('window').height)

    const _handleNumberChange = (input) => {
        if (input.length>number.length){
            if ((input.replace(/[-]/g,'').length) % 3==0  && number.replace(/[-]/g,'').length>0 && number.replace(/[-]/g,'').length <7){
                setNumber(number => input + "-")
            } else {
                setNumber(number => input)
            }
        }
        if (input.length<number.length){
            console.log("IN DELETE")
            if (number.charAt(number.length-1)=="-"){
                setNumber(number=>number.slice(0,-2))
            } else {
                setNumber(number=>input)
            }
        }

    }
    var height = Dimensions.get('window').height
    var width = Dimensions.get('window').width
    const submit = () =>{
        if (number.replace(/[-]/g,'').length <10 || isNaN(Number(number.replace(/[-]/g,'')))){
            alert("Enter a valid phone number")
            return
        }
        getClientByPhone(number.replace(/[-]/g,''), (response)=> {
            if (response!=null){
                props.navigation.navigate("Sign In", {
                    client: response
                })

            } else {
                props.navigation.navigate("Sign Up",{
                    phone: number.replace(/[-]/g,''),
                    formattedPhone: number
                })

            }

        })
       
        // props.navigation.navigate("Phone Verification", {
        //     phone: number
        // })
        
       //props.navigation.navigate("Select Service")


    }

    return (
        <DismissKeyboard style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height}}>

       
        <View style={styles.container}>
            <View style={{ width:'100%',
            height:Dimensions.get('window').height*0.7}}>
       
            <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require("../../assets/logotext.png")}/>
           
            </View>
            <Image source={require("../../assets/withgradient.png")} style={styles.backgroundImg}/>
            
               
            <View style={styles.promptPhone}>
            
        
            
                <View style={styles.phone}>
                    <View style={styles.ext}>
                        <Text style={styles.extText}>+1</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <TextInput style={styles.numberInput}
                    keyboardType='numeric'
                    value={number}
                    onChangeText={_handleNumberChange}
                    placeholder="Enter phone number"
                    maxLength={12}
                    returnKeyType={'done'}></TextInput>
                    </TouchableWithoutFeedback>

            </View>
            </View>
           
            
           
           

        </View>
        {height<1000 && 
        <TouchableOpacity style={{flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        justifyContent: 'center',
        // bottom:-Dimensions.get('window').height*0.05,
        bottom:Dimensions.get('window').height*0.07,
        padding:'2%',
        alignSelf: 'center',
        backgroundColor: "#1A2232",
       //height: 70,
        height: Dimensions.get('window').height*0.09,
        
        width: Dimensions.get('window').width}} onPress={()=>submit()}>
                <Text style={styles.confirmText}>Continue</Text>
            </TouchableOpacity>
        }
        {height>=1000 && height <2000 &&
        <TouchableOpacity style={{flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        justifyContent: 'center',
        // bottom:-Dimensions.get('window').height*0.05,
        bottom:Dimensions.get('window').height*0.15,
        padding:'2%',
        alignSelf: 'center',
        backgroundColor: "#1A2232",
       //height: 70,
        height: Dimensions.get('window').height*0.08,
        width: Dimensions.get('window').width}} onPress={()=>submit()}>
                <Text style={styles.confirmText}>Continue</Text>
            </TouchableOpacity>
        }
        {height>=2000 && 
        <TouchableOpacity style={{flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        justifyContent: 'center',
        // bottom:-Dimensions.get('window').height*0.05,
        bottom:Dimensions.get('window').height*0.15,
        padding:'2%',
        alignSelf: 'center',
        backgroundColor: "#1A2232",
       //height: 70,
        height: Dimensions.get('window').height*0.08,
        
        width: Dimensions.get('window').width}} onPress={()=>submit()}>
                <Text style={styles.confirmText}>Continue</Text>
            </TouchableOpacity>
        }

        </View>
        </DismissKeyboard>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height:'100%',
        flexDirection: 'column',
        marginTop:'50%',
        alignItems: 'center'
    },
    body:{
        width:'100%',
        height:Dimensions.get('window').height*0.7

    },
    logoContainer: {
        width: 225,
        height:52,
        alignSelf: 'center'
    },
    logo: {
        width: '100%',
        height:'100%'
    },
    phone:{
        
        flexDirection: 'row',
        justifyContent: 'flex-start',
       


    },
    promptPhone: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:'20%',
        marginLeft:20,
        marginRight:20,
        
    },
    promtText: {
        fontWeight: '500',
        fontSize: 16,
        paddingBottom:20,
        color: "#1A2232"

    },
    ext: {
        width: 50,
        height:70,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderLeftWidth:1,

        borderColor: 'lightgray'
    },
    extText: {
        fontWeight:'400',
        fontSize:18

    },
    numberInput: {
        backgroundColor: 'white',
        borderWidth:1,
        borderColor: 'lightgray',
        width: '80%',
        fontSize: 18,
        paddingLeft: 20
    },
    confirm: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        justifyContent: 'center',
        // bottom:-Dimensions.get('window').height*0.05,
        bottom:Dimensions.get('window').height*0.15,
        padding:'2%',
        alignSelf: 'center',
        backgroundColor: "#1A2232",
       //height: 70,
        height: Dimensions.get('window').height*0.08,
        
        width: Dimensions.get('window').width
        


    },
    confirmText: {
        color: 'white',
        fontWeight: '600',
        fontSize:16
    },
    proText: {
        alignSelf: 'flex-end',
        marginRight:12,
       
        color: "#C2936D",
        fontWeight:'600',
        fontSize:16
    },
    backgroundImg: {
        width:'100%',
        height:400,
        top:'17.5%',
        zIndex:0,
        
        
     
      
        alignSelf: 'center',
        opacity:0.4,
        position:'absolute'
        // backgroundColor: 'rgba(0,0,0,0)',
    
    }
 

})
export default PhoneNumberForm