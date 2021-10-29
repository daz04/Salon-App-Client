import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button , TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView, Alert} from 'react-native';
import {SearchBar} from 'react-native-elements';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import Service from './serviceObj'
import { Touchable } from 'react-native';
import { createAppContainer,  createBottomTabNavigator } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
import MenuBar from '../components/MenuBar'
import {getAvailabileLocations,getTravelDuration, getSubcategories, getAvailabilityList, getServicesList, getStylistsList, coordstoAddress, saveMainAddressRecord, saveAddressAsync, saveLocationTypeAsync, getClient, getAddress, storeClientMainAddressId} from '../Database/functions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {setClientLocationAvailable, setListOfAvailableServicesForClient} from '../LocalStorage/functions'
import { set } from 'react-native-reanimated';
import * as Location from 'expo-location'
import {NetworkInfo} from 'react-native-network-info'
import {getDistance} from 'geolib'
import Spinner from 'react-native-loading-spinner-overlay'
import analytics from '@react-native-firebase/analytics'




const ServiceSelection = (props) => {
    let [fontsLoaded] = useFonts({
        'Poppins-Regular': require("../assets/fonts/Poppins-Regular.ttf"),
        'Poppins-Bold': require("../assets/fonts/Poppins-Bold.ttf"),
        'Poppins-Black': require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf")
     });
    console.log("IM IN THE SERVICE SELECTION")
   
    const [services, setServices] = useState({})
    const [spinner, setSpinner] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedServices, setSelected] = useState([])
    const [visibility, setVisibility] = useState(false)
    const [femalespecific, setFemale] = useState({})
    const [malespecific, setMale] = useState({})
    const [searchResultData, setResultData] = useState([])
    const [locationFetch, setlocationFetched] = useState(false)
    const [locationCoords, setCoords] = useState(null)
    const [locationAddress, setAddress] = useState(false)
    const [clientId, setId] = useState(null)
    const [clientFetched, setClientFetched] = useState(false)
    const [clientMainAddress, setMainAddress] = useState(null)
    const [addressFetched, setAddressFetched] = useState(false)
    const [menuHeight, setmenuHeight] = useState(0)
    const [locationAvailable, setlocationAvailable] = useState(null)
    const [locationAvailableFetched, setlocationAvailableFetched] = useState(false)
    const [travelDuration, settravelDuration] = useState(null)
    const [travelDurationFetched, settravelDurationFetched] = useState(false)
    const [availableInRegion, setavailableInRegion] = useState(null)
    const [refresh, setRefresh] = useState(false)
    
    console.log("THE COORDS")
    console.log(locationCoords)

    useEffect(()=> {
        console.log("IN USE EFFECT")
        analytics().logScreenView({
            screen_name: 'Select Service',
            screen_class: 'Select Service'
        })
       
       

    },[])
   
  
    const fetchAvailableSubCategories = (locationAvailable) => {
        console.log('IN THE FETCH AVAILABLE SUBCATEGORIES FUNCTION AGAIN')
        console.log("LOCATION AVAILABLE IN FUNCTION")
        console.log(locationAvailable)
        console.log(locationCoords)
        getSubcategories((result)=> {
            if (result.data!=null){
                if (result.data.length>0){
                    var tempList = {}
                    var tempFemale = {}
                    var tempMale = {}
                    for (var elem in result.data){
                        var categoryName = result.data[elem]['name']
                        console.log("CATEGORY NAME")
                        console.log(categoryName)
                        var locationAvailableRecord = null 
                        for (var record in locationAvailable){
                            if (locationAvailable[record].category==categoryName){
                                locationAvailableRecord = locationAvailable[record]
                                break
                                
                            }
                        }
                        console.log("THE LOCATION AVAILABLE RECORD 2")
                        console.log(locationAvailable)
                        console.log(categoryName)
                        console.log(locationAvailableRecord)
                        
                        if (locationAvailableRecord['MaxLatCoords']==null
                        || locationAvailableRecord['MinLatCoords']==null
                        || locationAvailableRecord['MaxLongCoords']==null
                        || locationAvailableRecord['MinLongCoords']==null){
                            if (result.data[elem]['SpecialtyName']=="Barber"){
                                tempMale[categoryName] = false
                            }else {
                                tempFemale[categoryName] = false
                            }

                        } else {
                            var available = computeifUserLocationAvailable(
                                locationAvailableRecord['MaxLong'],
                                locationAvailableRecord['MinLong'],
                                locationAvailableRecord['MaxLat'],
                                locationAvailableRecord['MinLat'],
                                JSON.parse(locationCoords)['Latitude'],
                                JSON.parse(locationCoords)['Longitude'],
                                locationAvailableRecord['MinLatCoords'],
                                locationAvailableRecord['MaxLatCoords'],
                                locationAvailableRecord['MinLongCoords'],
                                locationAvailableRecord['MaxLongCoords']
                            )
                            if (available==true){
                                tempList[categoryName] = true
                                if (result.data[elem]['SpecialtyName']=="Barber"){
                                    tempMale[categoryName] = true
                                }else {
                                    tempFemale[categoryName] = true
                                }
                                

                            } else {
                                tempList[categoryName] = false
                                if (result.data[elem]['SpecialtyName']=="Barber"){
                                    tempMale[categoryName] = false
                                }else {
                                    tempFemale[categoryName] = false
                                }
                            }
                            console.log("THE CATEGORY - LOCATION AVAILABILITY")
                            console.log(categoryName)
                            console.log(available)

                        }

                        
                    }

                    var availableList = []
                    for (var element in tempList){
                        if (tempList[element]==true){
                            availableList.push(element)
                        }
                    }
                    console.log("AVAILABILITY LIST IN REGION FROM SERVICE SELECTION SCREEN HERE")
                    console.log(tempFemale)
               
                    setFemale(tempFemale)
                    setMale(tempMale)
                    console.log(availableList)
                    setSpinner(false)
                    setServices(availableList)
                    setListOfAvailableServicesForClient(availableList)
                    


                }

            } else {
                alert("Network Error: Unable to load list of services")
                return
            }
        })

    }
   

   
    const computeifUserLocationAvailable = (maxLong, minLong, maxLat, minLat,userLat, userLong,minLatCoords, maxLatCoords, minLongCoords, maxLongCoords ) => {
        var availableRegion = false
        if (userLat<=minLat){
            console.log("THE USER LAT IS LESS THAN MIN LAT 124")
          
            var travelDistance = getDistance(
                {latitude: userLat, longitude: userLong},
                {latitude: minLat, longitude: minLatCoords[1]})
            var travelDistanceInMiles =  0.000621371 * travelDistance
            var averageTimePerMileTravelTime = 1 
            var estimatedTravelTime = averageTimePerMileTravelTime * travelDistanceInMiles
            console.log("THE ESTIMATED TRAVEL TIME")
            console.log(estimatedTravelTime)
            if (estimatedTravelTime<=travelDuration){
                availableRegion = true

            }

        } else if (userLat>maxLat){
           
            console.log("THE USER LAT IS GREATER THAN MAX LAT 1")
            console.log(userLat)
            console.log(maxLat)
            
           
            var travelDistance = getDistance(
                {latitude: userLat, longitude: userLong},
                {latitude: maxLat, longitude: maxLatCoords[1]})
            var travelDistanceInMiles =  0.000621371 * travelDistance
            var averageTimePerMileTravelTime = 1 
            var estimatedTravelTime = averageTimePerMileTravelTime * travelDistanceInMiles
            console.log("ESTIMATED TRAVEL TIME")
            console.log(estimatedTravelTime)
            console.log("THE TRAVEL DURATION")
            console.log(travelDuration)
            if (estimatedTravelTime<=travelDuration){
                availableRegion = true

            }

        } else if (userLong<0 && userLong>maxLong){
            console.log("THE USER LONG IS LESS THAN MAX LONG AND LESS THAN 0")
            
            
            var travelDistance = getDistance(
                {latitude: userLat, longitude: userLong},
                {latitude: maxLongCoords[0], longitude: maxLongCoords})
            var travelDistanceInMiles =  0.000621371 * travelDistance
            var averageTimePerMileTravelTime = 1 
            var estimatedTravelTime = averageTimePerMileTravelTime * travelDistanceInMiles
            if (estimatedTravelTime<=travelDuration){
                availableRegion = true

            }

        } else if (userLong<0 && userLong<minLong){
            console.log("THE USER LONG IS LESS THAN MAX LONG AND LESS THAN 0")
            
         
            var travelDistance = getDistance(
                {latitude: userLat, longitude: userLong},
                {latitude: minLongCoords[0], longitude: minLong})
            var travelDistanceInMiles =  0.000621371 * travelDistance
            var averageTimePerMileTravelTime = 1 
            var estimatedTravelTime = averageTimePerMileTravelTime * travelDistanceInMiles
            if (estimatedTravelTime<=travelDuration){
                availableRegion = true

            }

        } else if (minLat<=userLat<=maxLat && minLong<=userLong && userLong<=maxLong){
            console.log("ABOUT TO SET AVAILABLE REGION TO TRUE 2")
            availableRegion=true
        }
        console.log("IN COMPUTE REGION AVAILABILITY FUNCTION 6")
        console.log(minLong<=userLong)
  
        console.log(userLong<=maxLong)
        console.log(minLong)
        console.log(userLong)
        console.log(maxLong)
        console.log(availableRegion)
        return availableRegion

    }
    

    if (travelDurationFetched==false){
        settravelDurationFetched(true)
        getTravelDuration((result)=> {
            if (result!=null){
                console.log("IN GET TRAVEL DURATION RESPONSE")
                console.log(result.data)
                settravelDuration(result.data[0].duration)

            } else {
                Alert.alert("Network Error", "Network error occured")

            }
        })


    }

    const computeAvailability = () => {
        getAvailabileLocations((result)=> {
            if (result!=null){
                console.log("GET AVAILABLE LOCATIONS RESPONSE IS NOT NULL 123")
                console.log(result.data)
                var totalRecord = null 
                for (var record in result.data){
                    if (result.data[record].category=="Total"){
                        totalRecord = result.data[record]
                        break
                    }
                }
                console.log("BEFORE SETTING LOCATION AVAILABLE 1")
                console.log(result.data)
                // setlocationAvailable(result.data)
                console.log("THIS IS THE TOTAL RECORD")
                console.log(totalRecord)
                var maxLong = totalRecord['MaxLong']
                var minLong = totalRecord['MinLong']
                var maxLat = totalRecord['MaxLat']
                var minLat = totalRecord['MinLat']
                var userLat = JSON.parse(locationCoords)['Latitude']
                var userLong = JSON.parse(locationCoords)['Longitude']
                console.log("USER LOCATION COORDS RES HERE")
                console.log(JSON.parse(locationCoords)['Latitude'])
                console.log(JSON.parse(locationCoords)['Longitude'])
                var availableRegion = computeifUserLocationAvailable(maxLong, minLong, maxLat, minLat, userLat, userLong,
                    totalRecord['MinLatCoords'], totalRecord['MaxLatCoords'], totalRecord['MinLongCoords'], totalRecord['MaxLongCoords'])
                console.log("IN AVAILABLE REGION 1")
                console.log(locationCoords)
                if (availableRegion==false){
                    setavailableInRegion(false)
                    setSpinner(false)
                    setClientLocationAvailable(false)
                } else {
                    setavailableInRegion(true)
                    setSpinner(false)
                    setClientLocationAvailable(true)
                    fetchAvailableSubCategories(result.data)
                }
            } else {
                Alert.alert("Network Error", "Network error occured")

            }

        })
        
    }

    // if (locationAvailableFetched==false && locationCoords!=null && travelDuration!=null){
    //     setlocationAvailableFetched(true)
    //     computeAvailability()
        
    // }

    const locationfromIP = () => {
        fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            console.log("LOCATION FROM IP RES")
            console.log(data)
            var latitude = data.latitude
            var longitude = data.longitude
            var coords = {
                'Latitude': latitude, 
                "Longitude": longitude
            }
            setCoords(coords)
            setlocationFetched(true)
        saveLocationTypeAsync('Current')
        AsyncStorage.setItem('locationCoords', JSON.stringify(coords))
        if (locationAddress==false){
            coordstoAddress(JSON.stringify(coords), (result)=> {
                if (result==null){
                    console.log("FAILED TO CONVERT CURRENT LOCATION TO ADDRESS")
                } else {
                    try {
                        var result_ = result.data
                        console.log("COORDS TO ADDRESS RESULT 2_1")
                        console.log(result)
                        saveAddressAsync(result_, (result)=> {
                            console.log("THE SAVE ADDRESS WE WANT CALLBACK")
                            console.log(result)
                            if (result==true){

                                setAddress(result_)

                            }
                        })
                       
                    // AsyncStorage.setItem('locationCoords', JSON.stringify(coords))

                } catch{
                    console.log("ASYNC STORAGE SET LOCATION ADDRESS IN SERVICE SELECTION DID NOT WORK")
                }

                }
            })

        }


        }
           
        )
        .catch(
            console.log("LOCATION FROM IP ERROR")
        );
    }
      





    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("LOCATION NOT GRANTED")
            locationfromIP()
            return
        }
        
  
        let location = await Location.getCurrentPositionAsync({});
        console.log("THE FETCHED LOCATION 123")
        console.log(location)
        var coords = {
            'Latitude': location.coords.latitude, 
            "Longitude": location.coords.longitude
        }
        setCoords(JSON.stringify(coords))
        
       
        setlocationFetched(true)
        saveLocationTypeAsync('Current')
        AsyncStorage.setItem('locationCoords', JSON.stringify(coords))
        if (locationAddress==false){
            coordstoAddress(JSON.stringify(coords), (result)=> {
                if (result==null){
                    console.log("FAILED TO CONVERT CURRENT LOCATION TO ADDRESS")
                } else {
                    try {
                        var result_ = result.data
                        console.log("COORDS TO ADDRESS RESULT 2")
                        console.log(result)
                        saveAddressAsync(result_, (result)=> {
                            if (result==true){
                                setAddress(result_)

                            } else {
                                Alert.alert("Network Error", "Error storing current location")
                            }
                           

                        })
                      
                    // AsyncStorage.setItem('locationCoords', JSON.stringify(coords))

                } catch{
                    console.log("ASYNC STORAGE SET LOCATION ADDRESS IN SERVICE SELECTION DID NOT WORK")
                }

                }
            })

        }

    }

 
    const fetchMainAddressAsync = async () => {
        console.log("I AM IN FETCH MAIN ADDRESS")
        //step 2 for address 
        AsyncStorage.getItem('locationCoords').then(response=> {
            console.log("RESPONSE FROM GET LOCATION COORDS HERE")
            console.log(response)
            if (response==null){
                getCurrentLocation()
    
            } else {
                console.log('FETCH MAIN ADDRESS IS NOT NULL')
                setCoords(response)
                // setlocationFetched(true)
                
                
    
            }


        })
        


    }
    if (locationCoords==null){
        fetchMainAddressAsync()
    }
 

    const updateSearch = (search_) => {
        console.log("at update search")
        console.log(search_)
        setSearch(search_)
        
    }
    const appendSelectedService = (service_) => {
        console.log("in appending selected service")
        
       
        setResultData([])
        setSelected(selectedServices => [...selectedServices, service_])
        setSearch(service_)
        setVisibility(true)

    
    }
    const removeFromSelectedService = (service_) => {
        var newSelectedList = selectedServices.filter(service=> service!= service_)
        setSelected(newSelectedList)
    }
    const searchFilterFunction = (text) =>{

    }
   
 
    const moveToNextScreen = () => {
        console.log("IN MOVE TO NEXT SCREEN")
        props.navigation.navigate('Select Time', { services: selectedServices, availableServices:services, travelDuration: travelDuration})

    }

    if (locationCoords!=null && locationAvailableFetched==false && travelDuration!=null){
        setlocationAvailableFetched(true)
        console.log("LOCATION COORDS ARE SET GOING INTO COMPUTE AVAILABILITY")
        console.log(locationCoords)
        computeAvailability()
    }

    const redirect = (screen) => {
        const {navigate} = props.navigation
        if (screen=="HOME"){
            navigate("Landing")

        } else if(screen=="BOOKINGS"){
            navigate("Appointments")
        } else if (screen=="PROFILE"){
            navigate("Profile")
        }
    }


   
   
   
        var menuItem = null
        var bodyHeight = '100%'
        console.log("PROPS PRINT")
        console.log(props.navigation.state)
        if (props.navigation.state.params !=null){
            if (props.navigation.state.params.inApp !=null && menuHeight==0){
                console.log("ABOUT TO SET MENU BAR ON SEARCH SCREEN")
                menuItem = <MenuBar screen="SEARCH" callback={redirect}/>
                bodyHeight='90%'
                setmenuHeight(Dimensions.get('window').height*0.075)
                

            }
            

        }
      
        var selectedServiceElem = null;
        var selectedServiceTitle = null;
    
       
      
        if (search!="" && !selectedServices.includes(search)){
            for (const service in services){
                console.log("THE SERVICES SERVICE")
                console.log(services[service])
                let lowerSearch = search.toLowerCase()
                if (services[service].toLowerCase().includes(lowerSearch)){
                    if (!searchResultData.includes(services[service])){
                        setResultData(searchResultData=>[...searchResultData,services[service]])
                        // searchResultData.push(services[service])

                    }


                }
      
                
            }
           
        }
        var count = 0

        const femaleElems = Object.keys(femalespecific).map((service)=> 
       

        {
         
         
                return (
                    <View style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        alignContent: "center",
                        backgroundColor: femalespecific[service]==false?"lightgrey":selectedServices.includes(service)?"#1A2232": "white",
                        borderRadius: 40,
                        borderColor: "lightgray",
                        borderWidth: 1,
                        
                        // position: "absolute",
                        
                        height:45,
                        padding:10,
                        margin:10
                    }}>
            
                    <TouchableOpacity onPress={ () => {
                        if (selectedServices.includes(service)) {
                            removeFromSelectedService(service)
                        } else {
                            appendSelectedService(service)

                        }
                        }} disabled={!femalespecific[service]}>
                        <Text style={{
                            textAlignVertical: "center",
                            color: selectedServices.includes(service)?'white':'black',
                            fontSize: 14,
                            fontFamily: 'Poppins-Regular'
                        }}>{service}</Text>
                        </TouchableOpacity>
                    </View>

                )
                
            
            
        }
       
        )
        const maleElems = Object.keys(malespecific).map((service)=>{
          
            

            return (
            <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                alignContent: "center",
                backgroundColor: malespecific[service]==false?"lightgrey":selectedServices.includes(service)?"#1A2232": "white",
                borderRadius: 40,
                borderColor: "lightgray",
                borderWidth: 1,
                
                
                // position: "absolute",
                
                height:45,
                padding:10,
                margin:10
            }}>
            <TouchableOpacity onPress={ () => {appendSelectedService(service)}} disabled={!malespecific[service]}>
            <Text style={{
                textAlignVertical: "center",
                color:selectedServices.includes(service)?'white':'black',
                fontSize: 14,
                fontFamily: 'Poppins-Regular'
            }}>{service}</Text>
            </TouchableOpacity>
            </View> )

        }
         
        
           
        )
        var submitButton = null;
        if (visibility==true){
            console.log("at submit button")
            submitButton = <TouchableOpacity style={{
                flexDirection: "row",
                alignItems: "center",
                textAlign: "center",
                position: 'absolute',
                height:Dimensions.get('window').height*0.08,
                bottom:Dimensions.get('window').height*0,
                justifyContent: 'center',
                backgroundColor: "#1A2232",
                width: "100%",
            }} onPress={()=> moveToNextScreen()}><Text style={{color: "white", textAlign: "center",alignSelf: "center", fontFamily: 'Poppins-SemiBold'}}>FIND</Text></TouchableOpacity>
        }

    const changeLocation = () => {
        const {navigate} = props.navigation
        navigate("Location", {
            nextScreen: "Select Service",
            refresh: !refresh
        })

    }
        
    
        

    
    return (
       

        <View style={styles.container}>
            <Spinner 
            visible={spinner}
            />
             {availableInRegion==true && fontsLoaded==true && 
            <View style={{height: '90%',backgroundColor: "#f9fafc",flex:1, marginBottom: menuHeight, marginTop:40}}>
           {/* <View>
            <View style={styles.searchBarWrapper}>
           
                <Image style={styles.tinyLogo} source={require("../assets/logoicon.png")}/>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <TextInput
                value={search}
                onChangeText={updateSearch}
                style={styles.searchBar}
                clearButtonMode="always"
                placeholder="What are you looking for?"
                placeholderTextColor = "black"
                />
                </TouchableWithoutFeedback>
              


            </View>
        
               {searchResultData.map((data)=>
               <View style={styles.searchResultView}><TouchableOpacity onPress={ () => {appendSelectedService(data)}}><Text style={styles.searchResultText}>{data}</Text></TouchableOpacity></View>)}
            
            </View> */}
          
            <ScrollView>
            <View style={styles.trendingServices}>
                <Text style={{
                     fontWeight: "600",
                     color: 'black',
                     marginTop: "7%",
                     marginLeft: 30,
                     fontFamily: 'Poppins-SemiBold'
                }}>SERVICES</Text>
                <Text style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize:14,
                    marginLeft:30,
                    marginTop:'1%'
                }}>Select one or more of the available services in your region</Text>
              
                <Text style={styles.genderHeaders}>FOR WOMEN</Text>
                <View style={styles.rowWrapper}>
                {femaleElems}
                </View>
                <Text style={styles.genderHeaders}>FOR MEN</Text>
                <View style={styles.rowWrapper}>
                {maleElems}
               
                </View>
                {selectedServiceTitle}
                {selectedServiceElem}
                
                
                
            </View>
            </ScrollView>
            {submitButton}
            
           
           
            </View>
            }
            {
            availableInRegion==false && fontsLoaded && 
            <View style={{
                height:'90%',
                flexDirection: 'column',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flex:1,
                marginBottom: menuHeight
            }}>

                {/* <Image source={require('../assets/logoicon.png')}/> */}
                <Text style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize:18,
                    marginBottom:'10%',
                    fontWeight:'600'
                }}>Sorry!</Text>
                <Text style={{
                    alignSelf: 'center',
                    fontFamily: 'Poppins-Regular',
                    fontSize:14,
                    paddingLeft:'5%',
                    paddingRight:'5%'
                }}>Glamo stylists are not yet available in your region. Our team will notify you as soon as we come to your area! </Text>
                <TouchableOpacity style={{
               flexDirection: "row",
               alignItems: "center",
               textAlign: "center",
               position: 'absolute',
               height:Dimensions.get('window').height*0.08,
               bottom:Dimensions.get('window').height*0,
               justifyContent: 'center',
               backgroundColor: "#1A2232",
               width: "100%",
            }} onPress={()=> changeLocation() }><Text style={{color: "white", textAlign: "center",alignSelf: "center", fontFamily: 'Poppins-Regular'}}>CHANGE LOCATION</Text></TouchableOpacity>
            </View>

            }
           
            { menuHeight!=0 && <MenuBar screen="SEARCH" callback={redirect}/>}
        </View>
        

    )};



const styles = StyleSheet.create({
    container: {
        // flex:1,
        
        height: "100%"
    },
    body: {
        

    },
    errorContainer: {
        height:'100%',
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'

    },
    searchResultView: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        padding:10
    },
    searchResultText: {
        fontSize: 14

    },
    searchBarWrapper: {
        
        
        width: Dimensions.get('window').width,
        height:70,
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        marginTop:40,

        alignItems: 'center',
      
        padding:10,
       

    },
    text: {
        width: 24,
        height: 24,
    },
    tinyLogo: {
        width:50,
        height:50

    },
    searchBar: {
        fontSize: 14,
        margin: 10,
        width: '80%',
        height: 50,
        backgroundColor: 'white',
        color: 'black'
    },
    suggestedServices: {
        
        paddingTop: 60,
    },
    suggestServiceBox: {
       
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "white",
        borderRadius: 40,
        borderColor: "lightgray",
        borderWidth: 1,
        
        // position: "absolute",
        
        height:45,
        padding:10,
        margin:10

    },
   
    suggestServiceText: {
        textAlignVertical: "center",
        color: 'black',
        fontSize: 14,
        fontFamily: ''

    },
    trendingServices: {
        // height: '100%',
        // margin:"3%",
        backgroundColor: "#f9fafc",
        flex:1
    },
    trendingHeaders: {
        fontWeight: "600",
        color: 'black',
        marginTop: "7%",
        marginLeft: 30

    },
    rowWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom:10,
        backgroundColor: "#f9fafc",
        
      
    },
    genderHeaders: {
        fontWeight: "600",
        color: 'grey',
        marginTop: "7%",
        marginLeft: 30
        // fontFamily: 'Lato-Heavy'
    },
    bodyText: {
        color: 'grey'
    },
    bottomPage: {
        
    },
    submitButtonDesign: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        position: 'absolute',
        height:Dimensions.get('window').height*0.08,
        bottom:Dimensions.get('window').height*0,

        justifyContent: 'center',
        
        
        backgroundColor: "#1A2232",
      
        width: "100%",
       
        

    }
    
})

export default ServiceSelection

// export default ServiceSelection;
// const AppNavigator = createStackNavigator(  
//     {  
//       exp  SelectService: ServiceSelection,  
//         SelectTime: SelectTime  
//     },  
//     {  
//         initialRouteName: "SelectService"  
//     }  
// ); 
// const AppContainer = createAppContainer(AppNavigator);
// export default class Main extends React.Component {
//     render (){
//         return <AppContainer/>
//     }
// }