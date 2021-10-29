import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Alert, Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import { useFonts } from 'expo-font';

import moment from 'moment'
import {postClient, getClientByEmail, getStylistByPhone} from '../../Database/functions'
import SchedualeHeader from '../../Headers/scheduale';
import { CognitoUserAttribute, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { validate } from 'uuid';
import {ProgressBar, Colors} from 'react-native-paper'
import DatePicker from 'react-native-datepicker'
import AsyncStorage from '@react-native-async-storage/async-storage'


// AWS.config.update({region: 'us-east-1'})

//MVP Client pool
const poolData = {
    UserPoolId: "us-east-1_t7jb40TQi",
    ClientId: "2jqchvesq7gscj0vqd2hu1m5po" 
   
    
 }
const userPool = new CognitoUserPool(poolData);

const Step1 = (props) => {
    console.log("NAV")
    console.log(props.navigation)

    const [keyboardHeight, setkeyboardHeight] = useState(0)
    const [inputHeight, setInputHeight] = useState(100)
    const [clientPayload,setPayload] = useState(null)
    const [formattedNum, setformattedNum] = useState(props.navigation.state.params.formattedPhone)
    


    useEffect(()=> {
        Keyboard.addListener("keyboardDidShow",_keyboardDidShow)
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide)
    })

    const _keyboardDidHide = (e)=> {
        setkeyboardHeight(0)
    }
    const _keyboardDidShow = (e) => {
        setkeyboardHeight(e.endCoordinates.height)
    }
    
    // let {status} = await Location.requestPermissionsAsync()
    // console.log("status")
    // console.log(status)
    // let [fontsLoaded] = useFonts({
    //     'Lato-Heavy': require('../../assets/fonts/Lato-Heavy.ttf'),
    //     'Lato-Regular': require('../../assets/fonts/Lato-Regular.ttf'),
    //     'Lato-Semibold': require('../../assets/fonts/Lato-Semibold.ttf')
            
        
    //     })
    
    
    var phone = props.navigation.state.params.phone
    

    const [email,setEmail] = useState("")
    const [firstName, setfirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const [birthdate, setBirthdate] = useState("")
    const [password, setPassword] = useState("")
    const [error,seterror] = useState(null)
    const [uniqueEmail, setUniqueEmail] = useState(null)
    const [submitClicked, clickSubmit] = useState(false)
    const [submitStop, stopSubmit] = useState(null)
    const [date,setDate] = useState(new Date())
    const [disable, setDisable] = useState(true)
    
 
    var errorElem = null
    var errorText = null 


    if (password.length>0 && email.length>0 && firstName.length>0 && lastName.length>0){
        if (disable==true){
            setDisable(false)

        }
        
    }else {
        if (disable==false){
            setDisable(true)
        }
    }
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
    const _handleBirthday = (input) => {
        if (input.length>birthdate.length){
            if (input.length==2 || input.length==5){
                setBirthdate(birthdate => input+"-")
            } else {
                setBirthdate(birthdate=>input)
            }
        }
        if (input.length<birthdate.length){
            if (birthdate.charAt(birthdate.length-1)=="-"){
                setBirthdate(birthdate=>birthdate.slice(0,-2))
            } else {
                setBirthdate(birthdate=>input)
            }
        }

    }
    const validateEmail = () => {
        if (email.length==0){
            alert("Enter in a value for email")
            return false
        }
        console.log("at check email")
        let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        
        if (reg.test(email) === false){
            alert("Incorrect Email Format")
            // errorText = 'Incorrect Email Format'
           
            return false
        }

        return true
        
    }
    const validateBirthdate = () => {
        console.log("AT VALIDATE BIRTHDATE")
        //make sure input is of valid date
        // if (birthdate.length<10){
        //     console.log("BIRTHDATE LENGTH UNDER 10")
        //     console.log(birthdate)
        //     Alert.alert("Enter in full date length")
            
        // }



        //make sure all input is numeric
        var birthdateArray = birthdate.split("-")
        var day = birthdateArray[1]
        var month = birthdateArray[0]
        var year = birthdateArray[2]
        
        if (isNaN(parseInt(day)) || isNaN(parseInt(month)) || isNaN(parseInt(year))){
            Alert.alert("Enter in your birthday")
            console.log("AT PARSING FALSE")
            
        }
        //valiate a valid date
        if (parseInt(month)<1 || parseInt(month)>12){
            Alert.alert("Enter in a valid month number")

        }
        var currentYear = moment().format("YYYY")
        if (parseInt(year)>currentYear){
            Alert.alert("Enter in a valid birthdate year ")
        }
        var daysInMonth= new Date(parseInt(year),parseInt(month),0).getDate()
        if (day<=0 || day>daysInMonth){
            Alert.alert("Enter in a valid birthdate day")
        }
        return true


    }
    const validatePassword = () => {
        if (password.length==0){
            alert("Enter in a value for password")
            return false
        }
        var strongRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        // if (strongRegex.test(password)===false){
        if (password.length<8){
            alert('Password must contain at least 8 characters')
            // errorText = "Password must contain at least 8 characters, at least one uppercase letter, at least one lower case, at least one number and at least one special character."
            // seterror(error => errorText)
            return false
        }
        else {
            // seterror(error=> null)
            return true
        }
    }

    const userSignUp = (clientPayload) => {
        const {navigate} = props.navigation
        var phoneNum = "+1" +phone 
        var phoneData = {
            Name: "phone_number",
            Value: phoneNum

        }
        var emailData = {
            Name:"email",
            Value: email
        }
        var firstNameData = {
            Name: "name",
            Value:firstName
        }
        var lastNameData = {
            Name:"family_name",
            Value:lastName
        }
        var birthdayData = {
            Name: "birthdate",
            Value: moment(date).format("YYYY-MM-DD")
        }
        const emailAttribute = new CognitoUserAttribute(emailData);
        const phoneAttribute = new CognitoUserAttribute(phoneData);
        const firstNameAttribute = new CognitoUserAttribute(firstNameData);
        const lastNameAttribute = new CognitoUserAttribute(lastNameData);
        const birthdayAttribute = new CognitoUserAttribute(birthdayData)
        userPool.signUp(email, password, [emailAttribute,phoneAttribute, firstNameData, lastNameData, birthdayData], null, (err,data)=> {
            if (err){
                console.log("USER POOL SIGN UP ERROR")
                console.log(err)
                if (err.code=="UsernameExistsException"){
                    alert("An account with this email address or phone number already exists")
                }
                return
            }
            console.log("COGNITO SIGN UP DATA")
            console.log(data)
            var userData = {
                Username: email,
                Pool: userPool
            }
            console.log("in error cognito USER")
            var tempUser = new CognitoUser(userData)
            navigate("Account Verification", {
                user: tempUser,
                "clientPayload":clientPayload,
                "formattedNum": formattedNum,
                "next": "Step 2"
            })
            // navigate("Location", {
            //     "stylistPayload":stylistPayload,
            //     "formattedNum": formattedphone,
            //     "phoneNum":phone
            // })
        })

    }
    const uniqueEmailCallback = (val) => {
        console.log("IN UNIQUE EMAIL CALLBACK")
        console.log(val)
        if (val==false){
            setUniqueEmail(false)
            clickSubmit(true)
            
        } else {
            setUniqueEmail(true)
            clickSubmit(true)
          
        }
    }
  
    const validateUser = () => {
        getClientByEmail(email, uniqueEmailCallback)
        
       


    }


    const submit = () => {
        if (firstName.length==0){
            alert("Enter in a value for your first name")
            return
        }
        if (lastName.length==0){
            alert("Enter in a value for your last name")
            return
        }
        
        const {navigate} = props.navigation
        var validEmail = validateEmail()
        console.log("BIRTHDAY DATA")
        console.log(date)
        var validBirthdate = true
        var validPassword = validatePassword()
        if (validEmail==true && validBirthdate==true && validPassword==true){
            var clientPayload_ = {
                "birthday":moment(date).format("YYYY-MM-DD"),
                "email": email,
                "firstName":firstName,
                "lastName":lastName,
                "phone":phone,
                "password": password
            }

            setPayload(clientPayload_)
            

            validateUser()
            // if (uniqueEmail==null){
            //     validateUser()

            // }

            if (uniqueEmail==false){
                alert("Provided email address is already registered")
                // errorText = "Provided email address is already registered"
                // seterror(errorText)
                

            } 
           
            else if (uniqueEmail==true){
                console.log("IN UNIQUE EMAIL IS TRUEEEEEEE")
                stopSubmit(true)
                //userSignUp(stylistPayload)
                // postStylist(stylistPayload)
                // userSignUp(stylistPayload)
                userSignUp(clientPayload_)
                // var userData = {
                //     Username: email,
                //     Pool: userPool
                // }
                // console.log("in error cognito USER")
                // var tempUser = new CognitoUser(userData)
                // navigate("Account Verification", {
                //     user: tempUser,
                //     "clientPayload":clientPayload,
                //     "formattedNum": formattedNum,
                //     "next": "Step 2"
                // })
               
                // navigate("Location", {
                //     "clientPayload":clientPayload,
                //     "formattedNum": formattedNum,
                //     "new":true

                    
                // })
                
                
               

            }
            
            

        }
    }
    const goBack = () => {
        props.navigation.goBack()
    }
    if (error!=null){
        console.log("AT ERROR NOT EMPTY")
        console.log(error)
        errorElem= <Text>{error}</Text>
    }
    if (submitClicked==true && uniqueEmail==true && submitStop!=true) {
        submit()
    }

    console.log("THE KEYBOARD HEIGHT")
    console.log(keyboardHeight)
   


    return (
        <View style={{ width: '100%',height: '100%',flexDirection: "column"}}>
           <View style={{height:Dimensions.get('window').height-80}}>

            <SchedualeHeader backwards={goBack}/>
            <View style={styles.stepHeader}>
                <Text style={styles.stepText}>
                    Step 1 
                </Text>
                <ProgressBar progress={0.33} color={"#1A2232"} style={styles.progressBar}/>
            </View>
           
            
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}} >
            
            <View style={{ paddingTop:40,
        marginLeft:20,
        marginRight:20,
        display: 'flex',
        justifyContent: 'flex-end',
        flex:1,
        height: Dimensions.get('window').height*0.65-keyboardHeight}}>
            <ScrollView style={{ 
        flex:1,
        height: Dimensions.get('window').height*0.65-keyboardHeight}}>
           
            {/* <ScrollView style={{height:Dimensions.get('window').height*0.65,display:'flex',justifyContent:'flex-end'}} scrollEnabled={true}> */}

               
            <Text style={styles.signup}>SIGN UP</Text>
            <View style={styles.signupOptions}>
            <View style={styles.inputBox}>
            <Text style={styles.inputText}>First Name</Text>
                <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setfirstName}
                
               
                placeholder={"Enter in first name"}
                returnKeyType={'done'}
               
                ></TextInput>

           </View>
           <View style={styles.inputBox}>
            <Text style={styles.inputText}>Last Name</Text>
                <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setlastName}
                placeholder={"Enter in last name"}
                returnKeyType={'done'}
               
                ></TextInput>

           </View>
           <View style={styles.inputBox}>
            <Text style={styles.inputText}>Email</Text>
                <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
               
                placeholder={"Enter in email"}
                returnKeyType={'done'}
                
                ></TextInput>

           </View>
           <View style={styles.inputBox}>
            <Text style={styles.inputText}>Birthday</Text>
            <DatePicker date={date} onDateChange={setDate}
          
            mode="date"
            placeholder="Select Date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            style={{
                borderWidth:0,
                display: 'flex',
                justifyContent: 'flex-end'
                
            }}
            maxDate={new Date()}
            customStyles={{
                dateIcon: {
                    display:'none'
                },
                cancelBtnText: {
                    color: "#1A2232"
                },
                confirmBtnText: {
                    color: "#1A2232"
                },
                dateTouchBody: {
                    backgroundColor: "white",
                    borderColor:'transparent',
                    borderWidth:0,
                    width:Dimensions.get("window").width-40,
                },
                dateInput: {
                    borderWidth:1,
                    borderColor: 'lightgray',
                    alignItems: 'flex-start',
                    height:50,
                    backgroundColor: "white",
                    width:Dimensions.get("window").width-40,
                    
                    
        
                   
                  
                    paddingLeft: 20

                },
                btnTextConfirm: {
                    color:"#1A2232"
                },
                dateText: {
                    fontSize:16
                }
                
            }}/>
                {/* <TextInput
                style={styles.input}
                value={birthdate}
                onChangeText={_handleBirthday}
                placeholder={"Enter in birthday"}
                maxLength={10}
              
                ></TextInput> */}

           </View>
           
           <View style={styles.inputBox}>
            <Text style={styles.inputText}>Password</Text>
            <Text>Password must be at least 8 characters long </Text>
                <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder={"Enter in password"}
                secureTextEntry={true}
                returnKeyType={'done'}
                
              
                ></TextInput>

           </View>
          

          
           
            </View>
            </ScrollView>
            {errorElem}
            {/* </ScrollView> */}
            
            </View>
            </KeyboardAvoidingView>
           
            
           
           
           
           
            {/* <View style={styles.footer}>
                <Text style={styles.haveaccountText}>Already have an account?</Text>
                <TouchableOpacity onPress={()=>login()}>
                <Text style={styles.loginText}>Login instead</Text>
                </TouchableOpacity>


            </View> */}
            </View>
            <View style={styles.confirmBox}>
            
            <TouchableOpacity style={{
                flexDirection: "row",
                alignItems: "center",
                textAlign: "center",
                justifyContent: 'center',
                // bottom:Dimensions.get('window').height*0.05,
                height:Dimensions.get('window').height*0.08,
                alignSelf: 'center',
                backgroundColor: disable?"grey":"#1A2232",
                // position:'absolute',
                width: Dimensions.get('window').width,
            }} disabled={disable} onPress={()=>submit()}>
               <Text style={styles.confirmText}>Submit</Text>
           </TouchableOpacity>
           </View>
           
        </View>

    )
}
const styles = StyleSheet.create({
    body: {
        paddingTop:40,
        marginLeft:20,
        marginRight:20,
        display: 'flex',
        justifyContent: 'flex-end',
        flex:1
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
        flexDirection: "column",
        flex:1

    },
    signupOptions: {
        paddingTop:30

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
        // fontFamily: "Lato-SemiBold",
        alignSelf: "center",
        fontWeight: '600'


    },
    googleText: {
        alignSelf: "center",
        color: "#1A2232",
        // fontFamily: "Lato-SemiBold",
        fontWeight: '600',
        paddingLeft:50

    },
    footer: {
        // position:"absolute",
        
        // bottom:0,
        
        flexDirection:'column',
        width:'100%',
        marginBottom:40,
        justifyContent: "center",
        alignItems: "center",
        
        
    },
    haveaccountText: {
        padding:20,
        // fontFamily: "Lato-SemiBold",
        fontSize: 16,
        color: "grey",
        fontWeight: "600"
    },
    loginText: {
        // fontFamily: "Lato-SemiBold",
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
     
        // fontFamily: "Lato-SemiBold",
        fontSize: 12,
        color: "grey",
        fontWeight: "600"

    },
    inputBox: {
        width: '100%',
        height: 100,
      

    },
    inputText: {
        color: "#1A2232",
        // fontFamily: "Lato-Semibold",
        fontSize:14,
        marginBottom:10,
        
        fontWeight: '600'
    },
    input: {
        width:Dimensions.get("window").width-40,
        alignSelf: 'center',
        height:50,
        backgroundColor: 'white',
        borderWidth:1,
        borderColor: 'lightgray',
        marginTop:10,
        
        marginBottom:20,
        fontSize:18,
        paddingLeft: 20
    },
    confirm: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        justifyContent: 'center',
       
        
       
        // bottom:0,
        // height:50,
       
      
        alignSelf: 'center',
        backgroundColor: "#1A2232",
        
        // flex:1,
        width: Dimensions.get('window').width,
        // marginBottom:20,
       
        
        


    },
    confirmText: {
        color: 'white',
        fontWeight: '600',
        fontSize:16
    },
    confirmBox: {
        bottom:Dimensions.get('window').height*0.00,
        // height:Dimensions.get('window').height*0.08,
      
        //marginTop:20,
        // marginBottom:20,
        // height:60,
        // bottom:0,
        position: 'absolute'
        
       
    },
    stepHeader: {
        marginTop:20,
        alignSelf: 'center',
        width: 200
        
        

    },
    stepText: {
        fontSize:18,
        fontWeight:'600',
        alignSelf: 'center',
        marginBottom:10
    },
    progressBar: {
        width: '100%'
    }

})

export default Step1