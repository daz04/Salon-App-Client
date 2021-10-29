import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, Animated, Alert } from 'react-native';
import TopBar from "../components/TopBar";
import CategoryScroll from "../components/CategoryScroll"
import BodyScroll from '../components/HomePageBodyScroll'
import ServiceCardScroll from '../components/ServiceCardScroll'
import MenuBar from '../components/MenuBar'
import {Ionicons} from '@expo/vector-icons';
import Checkout from '../Checkout/checkout';
import {signedIn, validSession} from '../Auth/clientInfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PhoneNumberForm from '../Auth/UI/PhoneNumber';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Modal from 'react-native-modal'
import Filter from '../components/LandingPage/filter'
import LandingHeader from '../Headers/landing'
import {useFonts} from 'expo-font'
import StylistServiceCard from '../components/stylistServiceCard'
// import {generateServiceObjList} from '../handlers/handlers'
import {getLocation} from '../GeoLocation/functions'
import { StackActions, NavigationActions } from 'react-navigation'
import moment, { duration } from 'moment'
import {getStylistsList, getBookingFee, getAvailabilityList, getAppointmentList, getServicesList, getService} from '../Database/functions'
import { getCoordinateKeys } from 'geolib';
import * as Location from 'expo-location'


const HomeScreen = (props) =>{
    console.log("HOME SCREEN PROPS")
    console.log(props.navigation)
    var services = null 
    var category = 'All' 
    var arrivalTime = null 
    var arrivalDate = moment().format("YYYY-MM-DD")
    //var clientCoords = props.navigation.state.params.clientCoords
    if (props.navigation.state.params!=null){
        services = props.navigation.state.params.servicesPayload 
        category = props.navigation.state.params.category 
        arrivalDate = props.navigation.state.params.arrivalDate 
        arrivalTime = props.navigation.state.params.arrivalTime 
    }
    const [data, setData] = useState([])
    const [dataIndex, setDataIndex] = useState(0)
    const [serviceObjects, setObjects] = useState([])
    const [serviceObjectsFetched, setObjectsFetched] = useState(false)
    const [filteredObjects, setfilteredObjects] = useState([])
    const [serviceNames, setNames] = useState([])
    const [fetchedObjects, setFetched] = useState(false)
    const [selectedService, setSelectedService] = useState(null)
    const [selectecdTime, setSelectedTime] = useState(null)
    const [locationType, setType] = useState(null)
    const [typeFetched, settypeFetched] = useState(false)
    const [address, setAddress] = useState(null)
    const [servicesList, setServicesList] = useState(null)
    const [currentCategory, setCategory] = useState(null)
    const [clientCoords, setClientCoords] = useState({})
    const [scrollList, setscrollList] = useState([])
    const [bookingFee, setBookingFee] = useState(null)
    const [bookingFeeFetched, setBookingFeeFetched] = useState(false)
    const [onEndReachedCalledDuringMomentum, setOnEndReached] = useState(null)
    const [animation] = useState(()=> new Animated.Value(0))
    const [filterVisible, setVisible] = useState(false)
    const [locationModalVisible, setlocationVisible] = useState(false)
    const {navigate, state} = props.navigation
  

    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require("../assets/fonts/Lato-Heavy.ttf"),
        'Lato-Medium': require("../assets/fonts/Lato-Medium.ttf"),
        'Lato-Regular': require("../assets/fonts/Lato-Regular.ttf"),
        'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
        'Lato-Thin': require('../assets/fonts/Lato-Thin.ttf'),
        'Lato-Semibold': require('../assets/fonts/Lato-Semibold.ttf'),
        'Poppins-Regular': require("../assets/fonts/Poppins-Regular.ttf")
    });

    if (currentCategory==null){
        setCategory(category)
    }


    useEffect(()=> {
        
        getLocationDetails()
        
    },[])


    console.log("SET THE SCROLL LIST RESULTS 456")
    console.log(scrollList)

    // AsyncStorage.getItem("currentAddress").then(res=> {
    //     console.log("GET CURRENT ADDRESS RES")
    //     console.log(res)
    //     if (res!=address){
    //         setAddress(res)
    //     }
    // })

    //createServiceCardObjects function used to populate service card information including: service record from database and available time slots for booking

    if (bookingFeeFetched==false){
        setBookingFeeFetched(true)
        getBookingFee((result)=> {
            if (result!=null){
                console.log("BOOKING FEE RESPONSE 1")
                console.log(result.data)
                setBookingFee(result.data[0]['amount'])
            } 
        })

    }



    const setDataForFlatList = (category) => {
        var dataList = []
        if (category!="All"){
        var dataList = []
        for (var obj in serviceObjects){
            if (serviceObjects[obj].service.Category==category) {
       
                dataList.push({
                    id: serviceObjects[obj].id,
                    obj: serviceObjects[obj]

                })
            }


        }
    } else {
        var dataList = []
        for (var obj in serviceObjects){
            
            dataList.push({
                id: serviceObjects[obj].id,
                obj: serviceObjects[obj]

            })
        }

    }
    console.log("THE DATALIST IN UPDATE")
    console.log(dataList)
        setData(dataList)
        if (dataList.length>0){
             setscrollList([0])
        } else {
            setscrollList([])
        }
        // setscrollList([0,1])

    }

   
    const fetchMore = () => {
        setData(prevState => [
            ...prevState,
            ...Array.from({length:3}).map((_,i)=> i+1+prevState.length)
        ])
    }
 

    var timeIntervals = {'Early':'6:00 AM-9:00 AM', 'Morning':'9:00 AM-12:00 PM', 'Noon':'12:00 PM-2:00 PM', 'Afternoon':'2:00 PM-5:00 PM','Evening':'5:00 PM-8:00 PM','Night':'8:00 PM-11:00 PM'}
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    
    console.log("THE MOMENT TEST 55634")
    console.log(moment('1:00 PM', 'h:mm A').isAfter(moment("12:00 PM", "h:mm A")))
 

    console.log("THE NETWORK RESULT")



  

    const computeInterval = () => {
        console.log("IN COMPUTE INTERVAL 123")
        // var currentSlot = moment().add(1,'hour').format("h:mm A")
        var currentSlot = "9:00 AM"
        console.log("THE TIME INTERVALS")
        console.log(timeIntervals)
     
        console.log("THE CURRENT SLOT 123456")
        console.log(currentSlot)
        for (var slot in timeIntervals){
            console.log("IN TIME INTERVAL LOOP") 
            var theInterval = timeIntervals[slot]
            console.log(theInterval)
            var selectedStart = theInterval.split("-")[0]
            var selectedEnd = theInterval.split("-")[1]
            console.log("SELECT again")
            console.log(selectedStart)
            console.log("END AGAIN again")
            console.log(selectedEnd)
            console.log(moment(selectedStart, 'h:mm A').isBefore(moment(currentSlot, "h:mm A")))
            console.log(moment(currentSlot,'h:mm A').isBefore(moment(selectedEnd, "h:mm A")))
            if ((moment(selectedStart, 'h:mm A').isBefore(moment(currentSlot, "h:mm A")) && moment(selectedEnd,'h:mm A').isAfter(moment(currentSlot, "h:mm A")))|| currentSlot==selectedStart){
                console.log("IT IS IN BETWEEN AGAIN AGAIN")
                return slot

            }
           
           


         }
         return 'Early'
        //return 'Early'
    }

    const computeTimeSlots = (thearrivalTime, serviceDuration) => {
        console.log("IN COMPUTE TIME SLOTS")
        console.log(thearrivalTime)
        console.log(serviceDuration)
        var startTime = timeIntervals[thearrivalTime].split("-")[0]
        var endTime = timeIntervals[thearrivalTime].split("-")[1]
        console.log("IN COMPUTE TIME SLOT IN START TIME")
        console.log(startTime)
        console.log(endTime)
        if (serviceDuration<30){
            serviceDuration=30
        }
        var indexTime = startTime 
        console.log("THE INDEX TIME 5")
        console.log(endTime)
        console.log(indexTime)
        var timeSlots = []

        if (thearrivalTime!="Night"){
       
            while (moment(indexTime, 'h:mm A').isBefore(moment(endTime, "h:mm A"))){
                console.log("IN WHILE MOMENT 123556")
                timeSlots.push(indexTime)
                indexTime = moment(indexTime, "h:mm A").add(serviceDuration, 'minutes').format("h:mm A")
                console.log("NEW INDEX TIME")
                console.log(indexTime)
                console.log("SERVICE DURATION NUM")
                console.log(serviceDuration)
            }
        } else {
            while (moment(indexTime, 'h:mm A').isBefore(moment(endTime, "h:mm A")) && indexTime.split(" ")[1]!="AM"){
                console.log("IN WHILE MOMENT 123556")
                timeSlots.push(indexTime)
                indexTime = moment(indexTime, "h:mm A").add(serviceDuration, 'minutes').format("h:mm A")
                console.log("NEW INDEX TIME")
                console.log(indexTime)
                console.log("SERVICE DURATION NUM")
                console.log(serviceDuration)

            }
        }
        console.log("COMPUTE TIME SLOTS RES")
        console.log(timeSlots)
        return timeSlots
    }

 
    console.log("HOME SCREEN REVISED")
    console.log(services)
    //console.log(timeSlots)

    // if (currentCategory==null){
    //     console.log("CURRENT CATEGORY IS NULL 1")
    //     console.log(category)
    //     setCategory(category)
    // }



   const fetchAllServiceObjects = () => {
        // setObjectsFetched(true)
        var thearrivalTime = null 
        if (arrivalTime!=null){
            thearrivalTime = arrivalTime
        } else {
            var thearrivalTime = computeInterval()
            

            
        }
        console.log("IN FETCHING OBJECTS")
        console.log(currentCategory)

        getStylistsList((result)=> {
            if (result!=null){
                var stylistsRes = result.data
                console.log("STYLIST RES 123456")
                console.log(stylistsRes.length)
                getAvailabilityList((result)=> {
                    if (result!=null){
                        var availabilityRes = result.data 
                        console.log("AVAILABILITY RES 123456")
                        console.log(availabilityRes.length)
                        getAppointmentList((result)=> {
                            if (result!=null){
                                var appointmentRes = result.data 
                                console.log("APPOINTMENT RES 1234")
                                console.log(appointmentRes.length)
                                getServicesList((result)=> {
                                    if (result!=null){
                                        var servicesRes = []
                                        // for (var elem in result.data){
                                        //     if (result.data[elem].Category==currentCategory){
                                        //         servicesRes.push(result.data[elem])
                                        //     }
                                        // }
                                        for (var service in result.data){
                                            console.log("SERVICE IN THE LOOP")
                                            console.log(result.data[service])
                                            console.log("SERIVE IN THE LOOP MAIN IMAGE")
                                            console.log(result.data[service].MainImage)
                                            if (result.data[service].MainImage==null){
                                                servicesRes = servicesRes.filter(service_ => service_!= result.data[service])

                                            }
                                        }
                                        console.log("SERVICES RES 123456")
                                        console.log(servicesRes)
                                        var newObjects = []
                                        for (var stylist in stylistsRes){
                                            var availabilityObj = null 
                                            var id = stylistsRes[stylist].id
                                            for (var elem in availabilityRes){
                                                if (availabilityRes[elem].stylistid==id){
                                                    availabilityObj = availabilityRes[elem]
                                                    break

                                                }
                                            }
                                            console.log("THE STYLIST ID")
                                            console.log(id)
                                            console.log("AVAILABILITY OBJ")
                                            console.log(availabilityObj)
                                            if (availabilityObj!=null){
                                                var index = moment(arrivalDate).day()
                                                console.log("THE ARRIVAL DATE INDEX 1234567")
                                                var weekDay = days[index]
                                                var dayAvailability = availabilityObj[weekDay]
                                                console.log("THE DAY AVAILABILITY OBJECT 1234")
                                                console.log(dayAvailability)
                                                console.log("THE ARRIVAL TIME SLOT 1234")
                                                console.log(thearrivalTime)

                                                if (dayAvailability.length>0 && dayAvailability.includes(thearrivalTime)){
                                                    //means available for that day and that time slot 
                                                    //now go service by service that the stylist can offer
                                                    for (var service in servicesRes){
                                                        if (servicesRes[service].StylistId == id){
                                                            console.log("THE SERVICE MATCHES THE STYLIST ID HERE AGAIN")
                                                            var serviceDuration = servicesRes[service].Duration
                                                            var overlap = false
                                                            for (var appt in appointmentRes){
                                                                if (appointmentRes[appt].stylistid == id && appointmentRes[appt].Date==arrivalDate){
                                                                    var apptStartTime = appointmentRes[appt].StartTime 
                                                                    var apptEndTime = appointmentRes[appt].EndTime
                                                                    console.log("BEFORE THE APPOINTMENT OVERLAP FUNCTION")
                                                                    console.log(appointmentRes[appt])
                                                                    overlap = appointmentOverlap(thearrivalTime, apptStartTime, apptEndTime, serviceDuration)
                                                                    if (overlap==true){
                                                                        break
                                                                    }


                                                                }
                                                            }
                                                            if (overlap==false){
                                                                console.log("OVERLAP OVER HERE IS FALSE")

                                                                var timeSlots = computeTimeSlots(thearrivalTime, serviceDuration)
                                                              
                                                                var newObj = {
                                                                    service: servicesRes[service],
                                                                    timeSlots: timeSlots
                    
                                                                }
                                                                console.log("A NEW OBJ OVER HERE 1234")
                                                                console.log(newObj)
                                                                newObjects.push(newObj)
                                                                console.log("NEW OBJECTS AFTER THE PUSH")
                                                                console.log(newObjects)

                                                            }
                                                            
                                                            //service is stylist id 
                                                            //overlap case 1: overlap 
                                                        }
                                                    }
                                                    //var overlap = false
                                                    // for (var appt in appointmentRes){
                                                    //     if (appointmentRes[appt].id==id && appointmentRes[appt].Date==arrivalDate){
                                                    //         //styist has appointment on date
                                                    //         var apptStartTime = appointmentRes[appt].StartTime 
                                                    //         var apptEndTime = appointmentRes[appt].EndTime 
                                                    //         overlap = appointmentOverlap(thearrivalTime, apptStartTime, apptEndTime)
                                                    //         if (overlap==true){
                                                    //             break
                                                    //         }

                                                          

                                                    //     }
                                                    // }
                                                    // if (overlap==false){
                                                    //     //stylist is available for that day: they have availability and no overlapping appointments
                                                    //     //now get a list of their services and add to 
                                                    // }
                                                }


                                                console.log(index)

                                            }
                                        }

                                        console.log('PRINTING THE NEW OBJECTS')
                                        
                                        console.log(newObjects)
                                        if (newObjects.length>0){
                                            console.log("IN THE SCOPE 123457")
                                            var dataItems = []
                                            for (var elem in newObjects){
                                                if (currentCategory!="All"){
                                                    if (newObjects[elem].service.Category==currentCategory){
                                                        var dataElem = {
                                                            id: newObjects[elem].service.id,
                                                            obj: newObjects[elem]
                                                        }
                                                        dataItems.push(dataElem)

                                                    }

                                                } else {
                                                    var dataElem = {
                                                        id: newObjects[elem].service.id,
                                                        obj: newObjects[elem]
                                                    }
                                                    dataItems.push(dataElem)
                                                }
                                                

                                            }
                                            console.log("BEFORE SETTING DATA 123")
                                            console.log(dataItems[0].obj.service)
                                            
                                            
                                            
        
                                            setData(dataItems)
                                            setscrollList([0,1])
                                            setObjects(newObjects)
                                            // setfilteredObjects(newObjects)
                              
                                            // setDataIndex(3)
                                            // setData(data => [...data, ...newObjects[3]])

                                        }
                                        
                                    }
                                   
                                })
                                

                            }
                        })
                   

                    }
                })

            }
        })

    } 
    


    console.log("AT RELOAD AGAIN 4")
    console.log(fetchedObjects)
    console.log(serviceObjects)
    console.log(services)

    const appointmentOverlap = (timeSlot, startTime, endTime, serviceDuration) => {
        console.log("IN THE APPOINTMENT OVERLAP 123")
        var selectedStart = timeSlot.split("-")[0]
        var selectedEnd = timeSlot.split("-")[1]

        if (moment(startTime, 'h:mma').isBefore(moment(selectedEnd, 'h:mma')) && moment(selectedEnd, 'h:mma').isBefore(moment(endTime, 'h:mma'))){
            return true
            

        } else {
            if (moment(startTime,'h:mma').isBefore(moment(selectedStart,'h:mma')) && moment(endTime,'h:mma').isBetween(moment(startTime,'h:mma'), moment(endTime,'h:mma'))){
                //so apppointment start time is before the slot start time and end time is between the start and end time of the slot
                var duration_ = moment.duration(selectedEnd.diff(endTime))
                console.log("THE DURATION IN OVERLAP")
                console.log(duration_)
                if (duration_< serviceDuration){
                    return true
                    
                }
            }
           


        }
        return false

    }

    


    

    const getCoords = async () => {
        var coords = await AsyncStorage.getItem('locationCoords')
        coords = JSON.parse(coords)
        setClientCoords(coords)

    }

    if (Object.keys(clientCoords)==0){
        getCoords()
    }


    if (fetchedObjects==false && services!=null){
        console.log("IN FETCHING OBJECTS HERE")
        console.log(services.length)
        setFetched(true)
        console.log("iN FETCHED OBJECTS FALSE 2")
        console.log(services)
        var newObjects = []
        for (var entry in services){
            console.log("ENTRY IN SERVICES")
            console.log(services[entry])
            for (var service in services[entry].services){
                console.log("ENTRY LOOP 2")
                
                console.log("NUMBER OF SERVICES")
                console.log(services[entry].services.length)
                console.log(services[entry].services[service])

                var theId = services[entry].services[service].id
                console.log("THE ID FOR THE SERVICE")
                console.log(theId)
                console.log("THE TIME SLOTS 1")
                console.log(services[entry])
                var times_ = services[entry].timeSlots[theId]
                var newObj = {
                    service: services[entry].services[service],
                    timeSlots: services[entry]['timeSlots'][theId],
                    travelDistance: services[entry].travelDistance
                }
                console.log("THE NEW OBJ 2")
                console.log(newObj)
                newObjects.push(newObj)
            }
        }
        console.log("NEW OBJECTS ARRAY")
        console.log(newObjects)
        var dataItems = []
        for (var elem in newObjects){
            var dataElem = {
                id: newObjects[elem].service.id,
                obj: newObjects[elem],
              
            }
            dataItems.push(dataElem)

        }
        console.log("BEFORE SETTING DATA")
        console.log(dataItems)
        setData(dataItems)
        setfilteredObjects(newObjects)
        
        console.log("REARRANGED OBJECTS")
        console.log(newObjects)
    }
        
    else if (fetchedObjects==false && services==null){
        console.log("IN FETCH OBJECTS LOOP 456")
        setFetched(true)
        console.log("IN ALTERNATIVE SECTION 123")
        var thearrivalTime = computeInterval()
        console.log("COMPUTED ARRIVAL TIME")
        console.log(thearrivalTime)
        var newObjects = []
        if (thearrivalTime!=null){
            console.log("WE ARE DONE WITH OBJECTS LIST 1235")
            console.log(newObjects)
    } else {
        console.log("BEFORE NO SERVICES ALERT STATEMENT")
        Alert.alert("Error",`No services available at this time, please select another time`, 
        [
            {
              text: "Continue",
              onPress: () => {
               
                //props.navigation.goBack()
                const {navigate} = props.navigation
                navigate("Select Service")
                const resetAction = StackActions.reset({
                    index:0,
                    actions: [NavigationActions.navigate({routeName: 'Select Service'})]
                });
                props.navigation.dispatch(resetAction)

                // props.navigation.pop(1)},
        
            }
            }
           
        ])

    }
       



    }
   

    

    const getLocationDetails = () => {
        // console.log("IN GET LOCATION DETAILS")
        // var locationType_ = await AsyncStorage.getItem('locationType')
        // console.log(locationType_)
        // setType(locationType_)
        AsyncStorage.getItem("currentAddress").then((response)=> {
            console.log('RESPONSE FROM CURRENT ADDRESS AGAIN 4')
            console.log(response)
            console.log(address) 
            console.log("IF THEY ARE EQUAL 2")
            console.log(response==address)
            if (response!=address){
                console.log("IN RESET ADDRESS")
                setAddress(response)

            }
        })
    }

    // if (typeFetched==false){
    //     settypeFetched(true)
    //     getLocationDetails()
       
    // }

    const fetchServices = (count) => {
        console.log("IN FETCH SERVICESSSS")
        console.log(services)
        if (count==services.length){
            console.log("finished")
            setFetched(true)
        } else {
            console.log("COUNT NOT EQUAL TO LENGTH")
            console.log(services[count])
            console.log(services[count].serviceId)
            getService(services[count].serviceId, (result)=> {
                console.log("IN GET SERVICE FOR FETCH SERVICES")
                if (result!=null){
                    setObjects(serviceObjects=> ([...serviceObjects, result.data[0]]))
                    var name = result.data[0].Name 
                    console.log("SERVICE AND SERVICE NAME")
                    console.log(result)
                    console.log(name)
                    if (!serviceNames.includes(name)){
                        console.log("about to ADD service name")
                        setNames(serviceNames=> ([...serviceNames, name]))
                    } 

                }
                
            })
            var newCount = count +=1
            fetchServices(newCount)
            
            
        }


    }

    // if (fetchedObjects==false){
    //     console.log("IN FETCHING OBJECTS")
    //     fetchServices(0)
        
    // } 

    //so we have our service objects

    

    
    // const FemalehomePageSubs = ["Braiding","Natural Hair","Hair Cut", "Hair Removal","Hair Installation","Nails","Makeup","Brows","Lashes"]
    // const FemaleBraidingPageSubs = ['French Braids','Dutch Braids','Fishtail Braids']
    // const FemaleNaturalHairSubs = ["Hair Styling", "Hair Coloring","Blowout"]
    // const MalehomePageSubs = ['Hair Cut','Beard','Facial Care','Pedicure','Cornrows','Dreads','Hair Treatment','Hair Color']
    const setMaxPrice = () => {
        var max = 0 
        for (var service in services){
            if (services[service].Price>max){
                max = services[service].Price
            }

        }
        return max


    }
    const setMinPrice = () => {
        var min = 10000
        for (var service in services){
            if (services[service].Price<min){
                min = services[service].Price
            }
        }
        return min
    }
    const [maxPrice, setMax] = useState(setMaxPrice())
    const [minPrice, setMin] = useState(setMinPrice())
  
    // const [category, setCategory] = useState(props.navigation.state.params.category)
    const [isSub, setSub] = useState(false)

    

   
    var categoryScroll = null;
    var bodyScroll = null;
    console.log("AFTERWARDS")
  
    // if (isSub==false){
    //     services = generateServiceObjList(category,false)

    // } else {
    //     console.log("SUB SERVICESSS IS TRUEEEEEEE")
    //     services = generateServiceObjList(category,true)
    //     console.log(services)
    // }
    
    
    

    
    var selected = null

    const updateCategory = (cat) => {
        console.log("AT UPDATE CATEGORY AT MAIN 1")
        
        console.log("THE FILTERED OBJECTS 123")
        console.log(cat)
        // setfilteredObjects([])
        // setscrollList([0])
        setDataForFlatList(cat)
        
        
        setCategory(cat)
    }
    const getEmail = async() => {
        var variable = null
        try {
            variable = await AsyncStorage.getItem("email")
            console.log("VARIABLE")
            console.log(variable)

        } catch(e) {
            return null

        }
        return variable
    }
    const updateCart = async (selectedService,time) => {
       
        //selected service supossed to be a json object 
        try {
            console.log("BEFORE GETTING CART ITEM")
            var cartItem = await AsyncStorage.getItem("@cart")
            console.log("CART ITEM")
            console.log(cartItem)
            if (cartItem==null){
                var item = {service: selectedService, time: time}
               
                var cartString = JSON.stringify(item)
                
               
                try {
                    await AsyncStorage.setItem("@cart",cartString)
                } catch (e){
                    console.log("setting item causing errors")
                }
            } else {
                console.log("IN ELSE STATEMENT")
                var items = []
                var cartSplit = cartItem.split("},")
                for (var item in cartSplit){
                    items.push(JSON.parse(cartSplit[item]))
                }
                console.log("ITEM LIST")
                console.log(items)
                console.log("SELECTED SERVICE")
                console.log(JSON.stringify(selectedService))
                var newcartItem = cartItem
                
                
                if (!(JSON.stringify(selectedService) in items)){
                    newcartItem = cartItem +"," + selectedService

                }
                console.log("NEW CART ITEM")
                console.log(newcartItem)
                await AsyncStorage.setItem("@cart",newcartItem)
            }

        } catch (e){
            console.log("ERROR RETRIEVING CART OBJECT ")
        }

    }
    function setSelected(selectService,time) {
        updateCart(selectService,time)

      
        selected = selectService
      
        var email = getEmail()
     
        console.log("EMAIL HERE")
        console.log(email)
        
        if (signedIn()){
            console.log("GOING TO CHECKOUT FROM HOME PAGEEEEEEEEE")
            console.log("THE ADDDRESS BEFORE CHECKOUT")
            console.log(address)
            console.log(state.key)
        //    navigate('Checkout', {
        //         services: [selectService],
        //         arrivalDate: arrivalDate,
        //         arrivalTime: time,
        //         go_back_key: state.key,
        //         address: address

        //     })

        } else {
            console.log("HOME NOT SIGNED INNNNNNNNNNNN")
            props.navigation.navigate('Sign In', {
                service: selected,
                arrivalDate: arrivalDate,
                arrivalTime: arrivalTime,
                clientCoords: clientCoords,
                next: "Checkout"
    
    
            })

        }
        
        
    }
   
    const exit = (priceSelected, timeSelected) => {
        console.log("exit function")
        setVisible(false)
    }
    const findCoordinates = () => {
		navigator.geolocation.getCurrentPosition(
			position => {
				const location = JSON.stringify(position);

                console.log("location")
                console.log(location)
				
			},
			error => Alert.alert(error.message)
		);
	};
    const redirect = (screen) => {
        const {navigate} = props.navigation
        if (screen == "SEARCH"){
            navigate("Select Service", {
                inApp: true
            })

        } else if (screen == "PROFILE"){
            navigate("Profile")
        } else if (screen=="BOOKINGS"){
            navigate("Appointments")
        }
    }


    const setSelected_ = (selected, stylist, time,taxesCost, travelCost, totalCost) => {
        //selected service
        //selected time
        //these variables will passed in navigation to the checkout screen
        setSelectedService(selected)
        setSelectedTime(time)
        console.log("IN SET SELECTEDDD 123")
        const {navigate} = props.navigation
        navigate('Checkout', {
            services: [selected],
            travelDuration: selected.Duration, 
            stylist: stylist, 
            arrivalDate: arrivalDate,
            arrivalTime: time,
            go_back_key: state.key,
            address:address,
            refreshState: false,
            taxesCost: taxesCost, 
            travelCost: travelCost,
            bookingFee: Number(bookingFee).toFixed(2),
            totalCost: totalCost

        })

    }


    console.log("SERVICE OBJECTS PRINTED 2")
    console.log(services)

    const showLocationModal = () => {
        const {navigate} = props.navigation
        navigate("Home Location")
        // setlocationVisible(true)

    }
    const selectedCity = (data) => {
        setDisabeled(false)
        
        setcityInput(data)
        setSelected(true)
    }

    const filterByPrice = (filterType) => {
        console.log("IN FILTER BY PRICE")
        var tempServices = []
        var minPrice = 10000
        var maxPrice = 0

        if (filterType=="Low to High"){
            serviceObjects.sort((first, second)=> {
                return first.service.Price < second.service.Price
            })
            
        } else {
            serviceObjects.sort((first, second)=> {
                return first.service.Price >= second.service.Price
            })

        }

        

      
        setfilteredObjects(serviceObjects)

    }

    const filterByTime = (filterType) => {
        var tempServices = []
        var times = []
        var minTime = "12:00 AM"
        var maxTime = "5:00 AM"

        if (filterTyppe=="Earliest to Latest"){
            serviceObjects.sort((first, second)=> {
                return first.timeSlots[0].isBefore(second.timeSlots[0])
            })
        } else {
            serviceObjects.sort((first, second)=> {
                return first.timeSlots[0].isAfter(second.timeSlots[0])
            })

        }

        setfilteredObjects(serviceObjects)
    


    }
    const setFilterOption = (filterPayload) => {
        var priceFilter = filterPayload['priceFilter']
        var timeFilter = filterPayload['timeFilter']
        if (priceFilter!=null){
            filterByPrice(priceFilter)
        }
        if (timeFilter!=null){
            filterByTime(timeFilter)
        }


    }


    console.log("THE SERVICE OBJECTS")
    console.log(serviceObjects)

    const alterTimeDate = () => {
        console.log("IN ALTER TIME DATE FUNC")
        console.log(props.navigation)
        const {navigate} = props.navigation
        // navigate("Select Service")
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Select Service' })],
          });
          props.navigation.dispatch(resetAction);
        

    }

   
    const renderItem = ({item}) => (
       
        <StylistServiceCard service={data[item].obj} bookingFee={bookingFee} arrivalDate={arrivalDate} arrivalTime={arrivalTime} setSelection={setSelected_}/>

    )
    const handleLoadMore = () => {
        console.log("IN HANDLE LOAD MORE 4")
        console.log(scrollList.length)
        console.log(data.length)
        if (scrollList.length<data.length-1){
            setscrollList(prevState=>[
                ...prevState,
                ...Array.from({length:1}).map((_,i)=> i+1 + prevState.length)
            ])
         

        }

       
        // var endIndex = scrollList.length 
        // console.log("THE SPLICE")
        // console.log(data.splice(0,endIndex+1))
        // setscrollList(data.splice(endIndex+1,endIndex+3))

    }
    const createServiceCardObjects = () => {
        console.log("IN CREATE SERVICE CARDS OBJECTS HERE")
        var objectList = []
     
        if (services!=null){
            console.log("THE PASSED SERVICES")
            console.log(services)
            for (var element in services){
                for (var service in services[element].services){
                   
                    var serviceObj = services[element].services[service]
                    if (serviceObj.MainImage!=null && serviceObj.Status=="Active"){
                        var timeSlot = services[element]["timeSlots"][serviceObj.id]
                        var item = {
                            service: serviceObj,
                            timeSlots: timeSlot,
                            travelDistance:services[element].travelDistance
        
                        }
                        console.log("THE OBJECT'S ITEM")
                        console.log(item)
                        objectList.push(item)
                }


                }
              
            }
            var dataItems = []
            for (var elem in objectList){
                var dataElem = {
                    id: objectList[elem].service.id, 
                    obj: objectList[elem]
                }
                dataItems.push(dataElem)

            }
            setData(dataItems)
            setscrollList([0])
            setObjects(objectList)
            
        } else {
            console.log("BEFROE FETCH ALL SERVICE OBJECTS")
            fetchAllServiceObjects()

        }
    }
    if (serviceObjectsFetched==false && currentCategory!=null){
        setObjectsFetched(true)
        createServiceCardObjects()


    }

    const changeAddress = () => {
        const {navigate} = props.navigation
        navigate("Location", {
            nextScreen: "Landing"


        })


    }

    return (
        <View style={styles.container}>
            <View style={styles.body}>
            <LandingHeader selectFilter={()=> setVisible(true)} selectLocation={showLocationModal}/>
            
            {/* <TouchableOpacity style={{flexDirection:'row', marginLeft:10, marginTop:10}} onPress={()=> props.navigation.navigate("Home Location")}> */}
            <View style={{flexDirection:'row',marginLeft:10, marginTop:10}}>
            <Ionicons name="location-outline" size={20} style={{color: '#1A2232'}}/>
            {fontsLoaded && 
            <TouchableOpacity onPress={()=> changeAddress()} style={{
                maxWidth: '90%',

            }}>
            <Text style={{
                color: '#1A2232',
                fontWeight: '500',
                fontSize:14,
                alignSelf: 'center',
                fontFamily: 'Lato-Heavy',
                flexWrap: 'wrap',
                width:'100%',
                marginLeft:'1%'
            }}>{address}</Text>
            </TouchableOpacity>
            }
            </View>
            <TouchableOpacity style={{flexDirection:'row',marginLeft:35, marginTop:5, marginBottom:10}} onPress={() => alterTimeDate() }>
                {fontsLoaded && 
                <Text style={{
                color: '#1A2232',
                fontWeight: '500',
                fontSize:12,
                alignSelf: 'center',
                fontFamily: 'Poppins-Regular',
                fontWeight: '500'
                }}>
                    {moment(arrivalDate).format('ll')}

                </Text>
                }
                {fontsLoaded &&
                <Text style={{
                color: '#1A2232',
                fontWeight: '500',
                fontSize:12,
                alignSelf: 'center',
                marginLeft:10,
                fontFamily: 'Poppins-Regular'
                }}>
                    {arrivalTime==null?computeInterval():arrivalTime}

                </Text>
        }


            </TouchableOpacity>
            {/* </TouchableOpacity> */}
           <Filter isVisible={filterVisible} exit={exit} minPrice={minPrice} maxPrice={maxPrice} setOption={setFilterOption}/>
        
            <Modal
            animationType="slide"
            visible={locationModalVisible}>
                <View>
                    <TouchableOpacity onPress={()=>setlocationVisible(false)}>
                        <Text>Close here</Text>
                    </TouchableOpacity>
                </View>

            </Modal>
            <CategoryScroll currentSelection={currentCategory} categories={serviceNames} changeCategory={updateCategory}/>
   
           
            <View style={styles.scroll}>
                {filteredObjects.length>0 && bookingFee!=null && data!=null && scrollList.length>0 && 
                <FlatList data={scrollList} 
                renderItem = {renderItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={1}
                />
            }
                {/* {filteredObjects.length>0 &&
            <ServiceCardScroll arrivalTime={arrivalTime} arrivalDate={arrivalDate} style={styles.bodyScroll} services={filteredObjects} setSelected={setSelected_}/>
                } */}
                {filteredObjects.length==0 && serviceObjectsFetched!=false && fontsLoaded && 
                <View style={{flexDirection:'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', height: '90%'}}>
                <Text style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize:18,
                    alignSelf: 'center',
                    color:'#1A2232'
                }}>No services available at this time</Text>
                <TouchableOpacity style={{
                    backgroundColor: '#1A2232',
                    width:200,
                    height:50,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginTop:20,
                    borderRadius:5
                }} onPress={() => props.navigation.navigate("Select Service")}>
                    {fontsLoaded && 
                    <Text style={{
                        color: 'white',
                        alignSelf: 'center',
                        fontFamily: 'Poppins-Regular'
                    }}>Search for a service</Text>
                }
                </TouchableOpacity>
                </View>}
            </View>
            </View>
            <MenuBar screen='HOME' callback={redirect}/>
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f9fafc",
        height: "100%",
        flexDirection: "column"
    },
  
    bodyScroll:{
        
        
    },
    modal: {
        marginRight:0,
        paddingRight:0,
        marginTop:0,
        marginBottom:0
       
       
    },
    scroll: {
        height:Dimensions.get('window').height*0.8,
        paddingBottom:100
        

    }
})

export default HomeScreen