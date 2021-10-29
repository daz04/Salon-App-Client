import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Alert, Picker, Modal, Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import SchedualeHeader from '../Headers/scheduale'
import {Ionicons} from 'react-native-vector-icons'
import {MaterialIcons} from 'react-native-vector-icons'
import {CognitoUserPool,CognitoUserAttribute, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import {SimpleLineIcons} from 'react-native-vector-icons'
import axios from 'axios';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {saveLocationTypeAsync, saveLocationCoordinates,saveAddressAsync, saveLocation, addresstoCoords} from '../Database/functions'
import {fetchCurrentAddress, fetchAptSuiteBldgInput, storeAptSuiteBldgInput} from '../LocalStorage/functions'
const GOOGLE_AUTHORIZATION_KEY = "AIzaSyBqS9FjLeM8fHeL-BYL2pdj9mJ1aUiOnTo";

const poolData = {
    UserPoolId: "us-east-1_t7jb40TQi",
    ClientId: "2jqchvesq7gscj0vqd2hu1m5po" 
   
    
 }
var userPool = new CognitoUserPool(poolData);
const Location = ({navigation}) => {
    console.log("IN THE RIGHT LLOCATION")
    let [fontsLoaded] = useFonts({
        'Poppins-Regular': require("../assets/fonts/Poppins-Regular.ttf"),
        'Poppins-Bold': require("../assets/fonts/Poppins-Bold.ttf"),
        'Poppins-Black': require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf")
    });
  
    const [city, setCity] = useState(null)
    const [state, setState] = useState(null)
    const [streetNum, setstreetNum] = useState("")
    const [streetName, setstreetName] = useState("")
    const [unitInput, setunitInput] = useState("")
    const [apartmentInput, setapartmentInput] = useState("")
    const [cityList,setCityList] = useState([])
    const [cityInput, setcityInput] = useState("")
    const [aptsuitebldgInput, setaptsuitebldgInput] = useState("")
    const [selected,setSelected] = useState(false)
    const [btnDisabeled, setDisabeled] = useState(true)
    const [authStatus, setauthStatus] = useState(null)
    const [coords, setCoords] = useState(null)
    const [user, setUser] = useState(null)
    const [clientRegistered, setClientRegistered] = useState(null)
    const [modalVisibile, setmodalVisibility] = useState(false)
    const [selectedNickname, setNickname] = useState(null)
    const [newNickname, setOtherNickname] = useState("")
    const [keyboardHeight, setkeyboardHeight] = useState(0)
    const [method, setMethod] = useState(null)
    const [originalCityAddress, setoriginalCityAddress] = useState(null)
    const [localStorageFetched, setlocalStorageFetched] = useState(false)
    


    useEffect(()=> {
        Keyboard.addListener("keyboardDidShow",_keyboardDidShow)
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide)
        console.log("IN USE EFFECT AGAIN")
        console.log(aptsuitebldgInput.length)
        console.log(cityInput.length)
        if (aptsuitebldgInput.length==0 || cityInput.length==0){
            setDisabeled(true)
        } else {
            if (btnDisabeled==true){
                setDisabeled(false)

            }
            
        }

        if (localStorageFetched==false){
            setlocalStorageFetched(true)
     
            fetchCurrentAddress((result)=> {
                var currentAddress = result
                //initialize the city input value to address stored in async storage
                setcityInput(result)
                //store the user's original address in variable to track any changes made to street/city address before going back to previous screen
                setoriginalCityAddress(result)
                fetchAptSuiteBldgInput((res)=> {
                    console.log("FETCH APT SUITE BUILDING RES")
                    console.log(res)
                    setaptsuitebldgInput(res)
                    if (result!=null && res!=null){
                        setDisabeled(false)

                    }

                })
            

            })
        }
    }, [aptsuitebldgInput, cityInput])

    const _keyboardDidHide = (e)=> {
        setkeyboardHeight(0)
    }
    const _keyboardDidShow = (e) => {
        setkeyboardHeight(e.endCoordinates.height)
    }
 
    const checkUserInAsync = async () => {
        var userElem = await AsyncStorage.getItem("tempUser")
        setUser(userElem)
        
    }
    const setAsyncUser = async (tempUser) => {
         try {
        await AsyncStorage.setItem(
            'tempUser',
            tempUser
        )
    } catch (error) {
        console.log("SET ASYNC USER ERROR")
        console.log(error)
    }
    }
    
    const autoComplete = (input) => {
        console.log("IN AUTO COMPLETE INPUT")
        console.log(input)
        setcityInput(input)
        setSelected(false)
        console.log("IN AUTO COMPLETE")
        axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&components=country:us&types=address&key=${GOOGLE_AUTHORIZATION_KEY}`).then(response=> {
           
            if (response!=null && response.status==200){
                
                var descriptions = []
               
                for (var elem in response.data.predictions){
                    console.log(response.data.predictions[elem])
                    descriptions.push(response.data.predictions[elem].description)

                }
                console.log("DESCRIPTIONS")
                console.log(descriptions)
                setCityList(cityList=>descriptions)
            }
            
        })

    }
    


    const goBack = () => {
        props.navigation.goBack()
    }
    // const signUp = () => {
       
    //     if (clientPayload['address']==null){
    //         clientPayload['address'] = {
    //             "name": null,
    //             "city": null,
    //             "state": null,
    //             "streetNum": null,
    //             "streetName": null,
    //             "unitNum": null,
    //             "appartmentNum":null


    //         }

    //     }
    //     const {navigate} = props.navigation
    //     var email = clientPayload.email 
    //     var phone = "+1"+clientPayload.phone
    //     console.log("THE PHONE NUMBER")
    //     console.log(phone)
    //     var firstName = clientPayload.firstName 
    //     var lastName = clientPayload.lastName
    //     var birthday = clientPayload.birthday 
    //     var phoneData = {
    //         Name: "phone_number",
    //         Value: phone

    //     }
    //     var emailData = {
    //         Name:"email",
    //         Value: email
    //     }
    //     var firstNameData = {
    //         Name: "name",
    //         Value:firstName
    //     }
    //     var lastNameData = {
    //         Name:"family_name",
    //         Value:lastName
    //     }
    //     var birthdayData = {
    //         Name: "birthdate",
    //         Value: birthday
    //     }
    //     const emailAttribute = new CognitoUserAttribute(emailData);
    //     const phoneAttribute = new CognitoUserAttribute(phoneData);
    //     const firstNameAttribute = new CognitoUserAttribute(firstNameData);
    //     const lastNameAttribute = new CognitoUserAttribute(lastNameData);
    //     const birthdayAttribute = new CognitoUserAttribute(birthdayData)
    //     var cognitoUser = userPool.getCurrentUser()
    //     userPool.signUp(email, password, [emailAttribute,phoneAttribute, firstNameData, lastNameData, birthdayData], null, (err,data)=> {
    //         if (err){
    //             console.log("user pool sign up error")
    //             console.log(err)
    //             if (err.code=="UsernameExistsException"){
    //                 // cognitoUser.updateAttributes([emailAttribute,phoneAttribute, firstNameData, lastNameData, birthdayData], (err,data)=> {
    //                 //     if (err){
    //                 //         console.log("ERROR DURING UPDATE")
    //                 //         console.log(err)
    //                 //         return
    //                 //     }
    //                 //     console.log("UPDATE RESULT"+data)
    //                 // })
    //                 // checkUserInAsync()
    //                 var userData = {
    //                     Username: email,
    //                     Pool: userPool
    //                 }
    //                 console.log("in error cognito USER")
    //                 var tempUser = new CognitoUser(userData)
    //                 console.log(tempUser)
    //                 setUser(tempUser)
    //                 console.log("ABOUT TO NAVIGATE")
    //                 navigate("Account Verification", {
    //                 user: tempUser,
    //                 "clientPayload":clientPayload,
    //                 "formattedNum": formattedNum,
    //                 "next": "Step 2"
    //             })
                

    //             }
                
    //         } else {

            
      
    //         var temp = null
    //         console.log(data)
    //         if (data==null){
    //             temp = userPool.getCurrentUser()
    //             console.log("DATA IS NULL")
    //             console.log(temp)
    //             console.log("STATE USER")
    //             console.log(user)
    //             navigate("Account Verification", {
    //             user: user,
    //             "clientPayload":clientPayload,
    //             "formattedNum": formattedNum,
                
    //             "next": "Step 2"
    //         })

    //         } else {
    //             setUser(data.user)
              
    //             navigate("Account Verification", {
    //             user: data.user,
    //             "clientPayload":clientPayload,
    //             "formattedNum": formattedNum,
                
    //             "next": "Step 2"
    //         })
    //         }
    //         }

            
          
    //     })
        


    // }

    const authorization = () => {
        console.log("IN AUTHORIZATION")
        var params = {
            'firstName': clientPayload.firstName,
            'lastName': clientPayload.lastName,
            'birthdate': clientPayload.birthdate,
            'city':cityInput.split(", ")[0],
            'state':cityInput.split(", ")[1]
        }
        console.log("AUTHORIZATION PARAMS")
        console.log(params)
        axios.post(`http://flask2-env.eba-mpqwucnu.us-east-1.elasticbeanstalk.com`,params)
        // axios.post('http://localhost:5000',params)
        .then(response=>{
            console.log("AUTHORIZATION BODY")
            console.log(response.data)
            setauthStatus(response.data.data)

        })
        .catch(error=> {
            console.log("AUTHORIZATION ERROR")
            console.log(error)

        })

    }
    const submit = () => {
        saveAddressAsync(cityInput, (result)=> {
            console.log("RESULT OF SAVE ADDRESS ASYNC 1234")
            console.log(result)
            if (result==true){
                addresstoCoords(cityInput, (result)=> {
                    console.log("RESULT OF ADDRESS TO COORDS")
                    if (result!=null){
                        var theCoords = {
                            'Latitude': result.data["lat"],
                            "Longitude": result.data["lng"]
                        }
                        AsyncStorage.setItem('locationCoords', JSON.stringify(theCoords)).then((res)=> {
                            storeAptSuiteBldgInput(aptsuitebldgInput, ((response)=> {
                              
                                console.log("STORE LOCATION COORDS RES")
                                console.log("IN SET ITEM CALLBACK 2")
                                console.log("IN ADDRESS COORDS BOOM 1234")
                                console.log(result.data)
                                console.log("THE PROPS 2")
                                console.log(navigation)
                                // const {navigate} = navigation.navigate
                                // console.log("THE NAVIGATE FUNCTION 1")
                                // console.log(navigate)
                                if (navigation.state.params.nextScreen=="Checkout" && originalCityAddress!=cityInput){
                                    console.log("THE CITY INPUT IS DIFFERENT 1")
                                    console.log(cityInput)
                                    Alert.alert("Changing street/city address", 
                                    "Changing your street address could make services in your cart inaccessible", [
                                        { 
                                            text: "Change",
                                            onPress: () => {navigation.navigate(navigation.state.params.nextScreen, {
                                                aptBuildingNumberIsSet: true,
                                                addressChanged: true,
                                                address: cityInput,
                                                locationCoords: theCoords

                                            })}
                                        },
                                        { 
                                            text: "Cancel",
                                            onPress: () => console.log("Cancelled")
                                        }
                                        
                                    ])

                                } else {
                                    navigation.navigate(navigation.state.params.nextScreen, {
                                        aptBuildingNumberIsSet: true
                                    })}

                                
                               
                                

                            }))
                            
                           
                        })
                       
                       
                        
        
                    } else {
                        Alert.alert("Network Error", "Unable to set address")
                    }
                })

            } else {
                Alert.alert("Network Error","Unable to update location due to network error")
            }
        })
       
     

        

        

        // saveLocationTypeAsync(method)
        // if (method=="Current"){
        //     saveLocationCoordinates(coords)
        // } else {
        //     console.log("IN METHOD IS CUSTOM")
        //     saveLocation({
        //         streetName: streetName,
        //         cityName: cityInput.split(", ")[0],
        //         stateName: cityInput.split(", ")[1]

        //     })
        //     addresstoCoords({
        //         streetName: streetName,
        //         cityName: cityInput.split(", ")[0],
        //         stateName: cityInput.split(", ")[1]
        //     }, (result)=> {
        //         console.log("RESULT FOR ADDRESS TO COORDS IN METHOD CUSTOM")
        //         console.log(result)
        //         if (result!=null){
        //             saveLocationCoordinates(result.data)
        //         }
        //     })
        // }
        // if (new_!=null && new_==true){
        //     signUp()

        // } else {
        //     console.log("CLIENT PAYLOADDDD")
        //     console.log(clientPayload)
        //     console.log(formattedNum)
        //     navigate("Account Verification", {
        //         clientPayload: clientPayload,
        //         formattedNum: formattedNum,
        //         phoneNum: phoneNum
        //     })
        //         //we are authorized, post this information and create a new stylist
        //         //create new address, get address id 
            

        // }
       
       
       
    
    }
    const selectedCity = (data) => {
        var splitInput = data.split(", ")
        var streetInput = splitInput[0]
        var cityInput = splitInput[1]
        var stateInput = splitInput[2]
        var streetNum = ""
        var streetName = ""
        for (var character in streetInput){
            var num = Number(streetInput[character])
            console.log("THE NUM")
            console.log(num)
            if (!isNaN(num) && streetInput[character]!=" "){
                console.log("NUM IS NOT NULL 2")
                streetNum+=streetInput[character]
            } else {
                streetName+=streetInput[character]
            }
        }
        if (streetNum!=""){
            setstreetNum(streetNum)
        }
        console.log("THE STREET NUMBER")
        console.log(num)
        var finalInput = cityInput + ", "+stateInput
        setstreetName(streetName)
        
        setDisabeled(false)
        setcityInput(data)
        setSelected(true)
    }

    const findCoordinates = () => {
        setMethod("Current")
        setDisabeled(false)

        //come back to fix coordinates later
        setCoords({
            'Latitude': 33.895,
            'Longitude':35.472
        })
        navigator.geolocation.getCurrentPosition(
            position=> {
                var location = JSON.stringify(position)
                location = {
                    'Latitude':location['coords']['latitude'],
                    'Longitude': location['coords']['longitude']
                }
                console.log("find coordinates location")
                console.log(location)
                setCoords(location)
                alert(`CURRENT COORDINATES ARE ${location}`)

            },
            error=> alert(error.message)
        )
    }

    const checkForClient = async () => {
        var clientId = await AsyncStorage.getItem("clientId")
        if (clientId==null){
            setClientRegistered(false)
        } else {
            setClientRegistered(true)
        }

    }
    const addAddress = () => {
        setmodalVisibility(true)

    }
    if (clientRegistered==null){
        checkForClient()
    }
    const homeClick = () => {
        if (selectedNickname!="Home"){
            setNickname(selectedNickname=>"Home")
        }
    }
    const otherClick = () => {
        if (selectedNickname!="Other"){
            setNickname(selectedNickname=>"Other")
        }
    }
    var extraOption=null

    if (selectedNickname=="Other"){
        extraOption = 
        <View>
            <Text style={styles.text}>Add Nickname *</Text>
            <TextInput style={styles.input} onChangeText={setOtherNickname}/>
        </View>

    }

   



    //let state be a dropdown
    return (
        <View style={styles.container}>
            <SchedualeHeader backwards={goBack}/>
        <View style={styles.body}>
        {fontsLoaded &&
        <Text style={{
            fontFamily: "Poppins-Regular",
            fontSize:18,
            fontWeight: '600',
        }}>Enter in your location</Text>
        
        }
        {fontsLoaded &&
            <Text style={{
                fontFamily: "Poppins-Regular",
                fontSize:12,
                marginBottom:10,
                fontWeight: '600',
                marginTop:10
            }}>
                Specify your street number *

            </Text>
        }
        {fontsLoaded &&
            <TextInput
            style={{
                width:Dimensions.get("window").width-40,
                alignSelf: 'center',
                height:50,
                backgroundColor: 'white',
                borderWidth:1,
                borderColor: 'lightgray',
                marginTop:10,
                fontSize:14,
                paddingLeft: 20,
                fontFamily: 'Poppins-Regular'
            }}
            value={cityInput}
            onChangeText={autoComplete}
        
            placeholder={"Enter city"}
            returnKeyType={'done'}
            
        ></TextInput>
        }
        <View style={{display:selected?"none":"flex"}}>
       
        {cityList.map((data)=>
            <View style={styles.searchResultView}><TouchableOpacity onPress={ () => selectedCity(data)}>
                {fontsLoaded &&
                <Text style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize:14
                    }}>{data}</Text>
        }</TouchableOpacity></View>)}
    </View>

    {fontsLoaded &&
    <Text style={{
        fontFamily: "Poppins-Regular",
        fontSize:12,
        marginBottom:10,
        fontWeight: '600',
        marginTop:10
        }}>Specify apt, suite, bldg *</Text>
}


    {fontsLoaded &&
            <TextInput
            style={{
                width:Dimensions.get("window").width-40,
                alignSelf: 'center',
                height:50,
                backgroundColor: 'white',
                borderWidth:1,
                borderColor: 'lightgray',
                marginTop:10,
                fontSize:14,
                paddingLeft: 20,
                fontFamily: 'Poppins-Regular'
            }}
            value={aptsuitebldgInput}
            onChangeText={setaptsuitebldgInput}
        
            placeholder={"Enter apt, suite, bldg #"}
            returnKeyType={'done'}
            
        ></TextInput>
        }
      

           </View>
           <View style={styles.confirmBox}>
            
            <TouchableOpacity style={{flexDirection: "row",alignItems: "center",textAlign: "center",justifyContent: 'center',alignSelf: 'center',backgroundColor: btnDisabeled==true?"gray":"#1A2232",flex:1,
        width: Dimensions.get('window').width,height:Dimensions.get('window').height*0.08}} disabled={btnDisabeled} onPress={()=>submit()}>
               <Text style={styles.confirmText}>Submit</Text>
           </TouchableOpacity>
           </View>


        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        height:'100%',
        width:'100%'
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
    inputBox: {
        width: '100%',
        height: 100,
        paddingTop:30
      

    },
    inputText: {
        color: "#1A2232",
        // fontFamily: "Lato-Semibold",
        fontSize:14,
        marginBottom:10,
        
        fontWeight: '600',
        
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
    inputCity: {
        width:Dimensions.get("window").width-40,
        alignSelf: 'center',
        height:50,
        backgroundColor: 'white',
        borderWidth:1,
        borderColor: 'lightgray',
        marginTop:10,
        
       
        fontSize:18,
        paddingLeft: 20

    },
    modalDropdown: {
        width:Dimensions.get("window").width-40,
        alignSelf: 'center',
        height:50,
        backgroundColor: 'white',
        borderWidth:1,
        borderColor: 'lightgray',
        marginTop:10,
        
        marginBottom:20,
        fontSize:22,
        

    },
    signup: {
        fontWeight: '600',
        

    },
    body: {
        paddingTop:40,
        marginLeft:20,
        marginRight:20,
        height:'90%'

    },
    confirm: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        justifyContent: 'center',
        
       
        // position: 'absolute',
        // bottom:0,
        height:Dimensions.get('window').height*0.08,
        
        alignSelf: 'center',
        backgroundColor: "#1A2232",
        
        flex:1,
        width: Dimensions.get('window').width,
       
        
        


    },
    confirmText: {
        color: 'white',
        fontWeight: '600',
        fontSize:16
    },
    confirmBox: {
      
        // marginTop:20,
       
        // height:Dimensions.get('window').height*0.08,
        bottom:0,
        position: 'absolute'
       
    },
    cityScroll: {
        width:'100%',
        height:200
        
        
    },
    searchResultView: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        padding:10,
        backgroundColor: 'white',
        zIndex:1,
       
    
    },
    addressRow: {
        width: '100%',
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        borderWidth:1,
        borderColor: 'lightgray',
        marginTop:30

    },
    addressText: {
        fontSize:16,
        alignSelf:'center'
    },
    icon: {
        alignSelf: 'center'
    },
    orText: {
        alignSelf: 'center',
        paddingTop:30
    },
    submit: {
        fontSize:18,
        color: 'white',
        fontWeight: '600'
    },
    nicknameRow: {
        flexDirection: 'row',
        width:'100%',
        marginBottom:20,
        
    },
    nicknameBox: {
        width:100,
        height:100,
        borderColor: '#1A2232',
        borderWidth:0.5,
        margin:10


    },
    addressIcon: {
        alignSelf: 'center',
        marginTop:25,
        color:'#1A2232'
    },
    nicknameText: {
        alignSelf: 'center',
        color: '#1A2232',
        
    },

})
export default Location
