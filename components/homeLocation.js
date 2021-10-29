import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Modal, Keyboard, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from 'react-native-vector-icons'
import { add } from 'react-native-reanimated';
import {getClient, postAddress, saveLocationTypeAsync, saveAddressAsync} from '../Database/functions'
import {SimpleLineIcons} from 'react-native-vector-icons'
import SchedualeHeader from '../Headers/scheduale'
import {MaterialIcons} from 'react-native-vector-icons'
import axios from 'axios'
import uuid from 'react-native-uuid'

const HomeLocation = (props) => {

    const [locationType, setType] = useState(null)
    const [typeFetched, settypeFetched] = useState(false)
    const [address, setAddress] = useState(null)
    const [client, setClient] = useState(null)
    const [mainAddress, setmainAddress] = useState(null)
    const [modalVisibile, setmodalVisibility] = useState(false)
    const [keyboardHeight, setkeyboardHeight] = useState(0)
    const [selectedNickname, setNickname] = useState(null)
    const [cityInput, setcityInput] = useState(null)
    const [cityList,setCityList] = useState([])
    const [unitInput, setunitInput] = useState("")
    const [apartmentInput, setapartmentInput] = useState("")
    const [streetNum, setstreetNum] = useState("")
    const [streetName, setstreetName] = useState("")
    const [selected,setSelected] = useState(false)
    const [newNickname, setOtherNickname] = useState("")
    const [btnDisabeled, setDisabeled] = useState(true)
    const [state, setState] = useState(false)
    const GOOGLE_AUTHORIZATION_KEY = "AIzaSyBqS9FjLeM8fHeL-BYL2pdj9mJ1aUiOnTo";
    useEffect(()=> {
        Keyboard.addListener("keyboardDidShow",_keyboardDidShow)
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide)
    })

    const _keyboardDidHide = (e)=> {
        setkeyboardHeight(0)
    }
    const selectedCity = (data) => {
        setDisabeled(false)
        
        setcityInput(data)
        setSelected(true)
    }

    const _keyboardDidShow = (e) => {
        setkeyboardHeight(e.endCoordinates.height)
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

   
    const insertAddress = () => {
        if (selectedNickname==null){
            alert("Choose a value for address name")
            return
        }
        if (cityInput==null){
            alert("Input a value for city")
            return
        }
        if (streetNum.length==0){
            alert("Input a value for street number")
            return
        }
        if (streetName.length==0){
            alert("Input a value for street name")
            return
        }
        if (unitInput.length==0){
            alert("Input a value for unit/house number")
            return
        }
        //so now we have insert address 
        //change address in async
        //create new address
        //add new address 
        var id = uuid.v4()
        var addressPayload = null 
        if (apartmentInput.length==0){
            addressPayload = {
                id:id,
                addressName: selectedNickname,
                unitName: unitInput,
                streetNumber: streetNum,
                streetName: streetName,
                city: cityInput.split(", ")[0],
                state: cityInput.split(", ")[1],
    
    
            }

        } else {
            addressPayload = {
                id:id,
                addressName: selectedNickname,
                appartmentNumber: apartmentInput,
                unitName: unitInput,
                streetNumber: streetNum,
                streetName: streetName,
                city: cityInput.split(", ")[0],
                state: cityInput.split(", ")[1],
    
    
            }
        }
        
        postAddress(addressPayload, null, (result)=> {
            if (result!=null && result!=false){
                console.log("POST ADDRESS IN HOME LOCATION RESULT")
                console.log(result)
                saveAddressAsync(result.data[0])
                setmodalVisibility(false)
                saveLocationTypeAsync("Custom")
                setDisabeled(false)
                setState(true)
                //now I need to attach address to client 



            } else {
                Alert.alert("Network Error", "Error uploading address")
            }
        })

        

    }
    const autoComplete = (input) => {
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

    if (client==null || state==true){
        getClient((result)=> {
            console.log("HOME LOCATION GET CLIENT")
            console.log(result)
            setClient(result.data[0])
            if (result.data[0].MainAddress!=null){
                getAddress(result.data[0].MainAddress, null, (result)=> {
                    setAddress(result[0])
                })
            }

        })
        if (state==true){
            setState(false)
        }

    }

    const getLocationDetails = async () => {
        console.log("IN GET LOCATION DETAILS 123")
        var locationType_ = await AsyncStorage.getItem('locationType')
        console.log(locationType_)
        setType(locationType_)
        var locationAddress = await AsyncStorage.getItem("currentAddress")
        console.log(locationAddress)
        setAddress(locationAddress)
        settypeFetched(true)

    }

    if (typeFetched==false){
        getLocationDetails()
       
    }
    const addAddress = () => {
        setmodalVisibility(true)

    }
    var addressRow = null
    if ( client!=null && client.MainAddress!=null){
        addressRow = <View>
        <View style={{
            width: '100%',
            height: 50,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: locationType=="Custom"?"#1A2232":'white',
            borderWidth:1,
            borderColor: 'lightgray',
            marginTop:30
            
        }}>
            <SimpleLineIcons name={'home'} size={25} style={{alignSelf: 'center', color:locationType=="Custom"?"white":"#1A2232"}} />
           
            <TouchableOpacity onPress={()=>{if (locationType!="Custom"){setMethod('Custom')}}}>
                <Text style={{ color: locationType=="Custom"?"white":'#1A2232',fontWeight: '600',fontSize:16}}>{mainAddress.Name}</Text>
                <View style={{display:'flex',flexDirection:'row'}}>
                    {mainAddress!=null && mainAddress.AppartmentNumber !=null && <Text style={{color: locationType=="Custom"?"white":'#1A2232'}}>{mainAddress.AppartmentNumber}, </Text>}
                    {mainAddress!=null && mainAddress.UnitName!=null && <Text  style={{color: locationType=="Custom"?"white":'#1A2232'}}>{mainAddress.UnitName}, </Text>}
                    {mainAddress!=null && mainAddress.StreetName && <Text  style={{color: locationType=="Custom"?"white":'#1A2232'}}>{mainAddress.StreetName}, </Text>}
                    {mainAddress!=null && mainAddress.StreetNumber && <Text  style={{color: locationType=="Custom"?"white":'#1A2232'}}>{mainAddress.StreetNumber}, </Text>}
                    {mainAddress!=null && mainAddress.City && <Text  style={{color: locationType=="Custom"?"white":'#1A2232'}}>{mainAddress.City}, </Text>}
                    {mainAddress!=null && mainAddress.State && <Text  style={{color: locationType=="Custom"?"white":'#1A2232'}}>{mainAddress.State} </Text>}

                </View>


            </TouchableOpacity>
           

            </View>
            {/* <View style={{display:'flex',flexDirection:'row',justifyContent: 'flex-end' ,marginTop:'2%',marginRight:'1%'}}>
                <TouchableOpacity onPress={()=> addAddress()}>
                    <Text style={{color: '#1A2232', fontWeight:'500'}}>EDIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:'2%'}} onPress={()=> {clientPayload['address']=null; setMethod('Current')}}>
                    <Text style={{color: '#1A2232', fontWeight:'500'}}>REMOVE</Text>
                </TouchableOpacity>
            </View> */}

        </View>
    } else {
        addressRow= <View style={{
            width: '100%',
            height: 50,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: locationType=="Custom"?"#1A2232":'white',
            borderWidth:1,
            borderColor: 'lightgray',
            marginTop:30
        }}>
            <TouchableOpacity onPress={()=>addAddress()} style={{flexDirection:'row'}}>
            <Ionicons style={styles.icon} name={"add"} size={25} style={{color: 'white', alignSelf: 'center'}}/>
            <Text style={{
                        color: locationType=="Custom"?'white':"#1A2232",
                        fontWeight: '600',
                        fontSize:16,
                        alignSelf: 'center'

                    }}>Click to add custom address</Text>
            </TouchableOpacity>
        </View>
    }
    const goBack = () => {
        props.navigation.goBack()
    }
    var extraOption=null

    if (selectedNickname=="Other"){
        extraOption = 
        <View>
            <Text style={styles.text}>Add Nickname *</Text>
            <TextInput style={styles.input} onChangeText={setOtherNickname}/>
        </View>

    }
    return (
        <View style={styles.container}>
            <SchedualeHeader backwards={goBack}/>
            <Modal 
            style={{
                height:Dimensions.get('window').height*0.8
            }}
            animationType="slide"
            transparent={false}
            visible={modalVisibile}
            onRequestClose={()=> {
                setmodalVisibility(false)}}>
                     <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}} >

                    <View style={{paddingTop:40, marginLeft:20, marginRight:20,height:'100%'}}>
      
                        
                        <View style={{display:'flex',justifyContent:'flex-end',width:'100%',flexDirection:'row'}}>
                            <TouchableOpacity style={{width:25, height:25}}onPress={()=> setmodalVisibility(false)}>
                                <MaterialIcons name={'cancel'} size={25} />

                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{height:'100%', flex:1,height: Dimensions.get('window').height*0.65-keyboardHeight}}>

                        <Text style={{ color: "#1A2232",
                        fontSize:14,
                        marginBottom:10,
                     
                        fontWeight: '600',}}>Choose a Nickname *</Text>
                        <View style={styles.nicknameRow}>
                            
                            <TouchableOpacity onPress={()=>homeClick()}>
                                <View style={{width:100,height:100,borderColor: '#1A2232',borderWidth:0.5,margin:10, backgroundColor: selectedNickname=="Home"?'#1A2232':"white"}}>
                                <SimpleLineIcons name={'home'} size={25} style={{alignSelf: 'center',marginTop:25, color:selectedNickname=="Home"?'white':"#1A2232"}} />
                                <Text style={{alignSelf: 'center',color: selectedNickname=="Home"?'white':"#1A2232"}}>Home</Text>

                                </View>
                                </TouchableOpacity>
                            
                                <TouchableOpacity onPress={()=>otherClick()}>
                                <View style={{width:100,height:100,borderColor: '#1A2232',borderWidth:0.5,margin:10, backgroundColor: selectedNickname=="Other"?'#1A2232':"white"}}>
                                    <Ionicons name={"add"} size={25} style={{alignSelf: 'center',marginTop:25, color:selectedNickname=="Other"?'white':"#1A2232"}}/>
                                    <Text style={{alignSelf: 'center',color: selectedNickname=="Other"?'white':"#1A2232"}}>Other</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {extraOption}
                        <View style={{width: '100%',
                        height: 100,
                        paddingTop:30,zIndex:1}}>
                            <Text style={styles.inputText}>Address *</Text>
                            <TextInput
                                style={styles.inputCity}
                                value={cityInput}
                                onChangeText={autoComplete}
                            
                                placeholder={"Enter city"}
                                returnKeyType={'done'}
                                
                            ></TextInput>
                            
                    {/* <ScrollView style={styles.cityScroll} scrollEnabled={true}> */}
                    <View style={{display:selected?"none":"flex"}}>
                    {cityList.map((data)=>
                <View style={styles.searchResultView}><TouchableOpacity onPress={ () => selectedCity(data)}><Text style={styles.searchResultText}>{data}</Text></TouchableOpacity></View>)}
               </View>
               </View>
               <View style={styles.inputBox}>
                    <Text style={styles.inputText}>Street Number</Text>
                    <TextInput
                        style={styles.inputCity}
                        value={streetNum}
                        onChangeText={setstreetNum}
                        placeholder={"Enter street number"}
                        keyboardType={"numeric"}
                    ></TextInput>
               </View>
               {/* <View style={styles.inputBox}>
                    <Text style={styles.inputText}>Street Name *</Text>
                    <TextInput
                    style={styles.inputCity}
                    value={streetName}
                    onChangeText={setstreetName}
                    placeholder={"Enter street name"}
                
                    ></TextInput>
                </View> */}
                <View style={styles.inputBox}>
                    <Text style={styles.inputText}>Unit or Home Number *</Text>
                    <TextInput
                        style={styles.inputCity}
                        value={unitInput}
                        onChangeText={setunitInput}
                        placeholder={"Enter unit number"}

                    
                    ></TextInput>
                </View>
                <View style={styles.inputBox}>
                    <Text style={styles.inputText}>Apartment Number (Optional)</Text>
                    <TextInput
                        style={styles.inputCity}
                        value={apartmentInput}
                        onChangeText={setapartmentInput}
                        placeholder={"Enter apartment number"}
                    
                    ></TextInput>
                </View>
                </ScrollView>
                    </View>
                   
                    <View style={styles.confirmBox}>
                        <TouchableOpacity style={{flexDirection: "row",
                        alignItems: "center",
                        textAlign: "center",
                        flex: 1,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        backgroundColor: "#1A2232",
                        // bottom:Dimensions.get('window').height*0.05,
                        height:Dimensions.get('window').height*0.08,
                        // position: 'absolute',
                        width: Dimensions.get('window').width,}}  onPress={()=>insertAddress()}>
                        <Text style={styles.confirmText}>Submit</Text>
                        </TouchableOpacity>
                        

                    </View>
                    </KeyboardAvoidingView>
                </Modal>
            <View style={styles.body}>
            <View style={{ paddingTop:'25%'}}>
                <TouchableOpacity  style={{flexDirection: "row",
                alignItems: "center",
                textAlign: "center",
                justifyContent: 'center',
                height:50,
                alignSelf: 'center',
                backgroundColor: locationType=="Current"?"#1A2232":"white",
                width: '100%',
            
                // position:'absolute',
            }}>
                    <Text style={{
                        color: locationType=="Current"?'white':"#1A2232",
                        fontWeight: '600',
                        fontSize:16
                    }}>Use Live Location</Text>

                </TouchableOpacity>
                <View style={{flexDirection:'row', marginTop: Dimensions.get('window').height*0.01, alignSelf: 'center'}}>
                        <Ionicons name="location-outline" size={20} style={{color: '#1A2232'}}/>
                        <Text style={{alignSelf: 'center'}}>{address}</Text>
                    </View>
            </View>

            <Text style={styles.orText}>or</Text>
     
                {addressRow}
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
    body: {
        paddingTop:100,
        marginLeft:20,
        marginRight:20,
        

    },
    signup: {
        fontWeight: '600',
        

    },
    orText: {
        alignSelf: 'center',
        paddingTop:30
    },
    icon: {
        alignSelf: 'center'
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
    inputText: {
        color: "#1A2232",
        // fontFamily: "Lato-Semibold",
        fontSize:14,
        marginBottom:10,
        
        fontWeight: '600',
        
    },
    inputBox: {
        width: '100%',
        height: 100,
        paddingTop:30
      

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
    searchResultView: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        padding:10,
        backgroundColor: 'white',
        zIndex:1,
       
    
    },


})
export default HomeLocation