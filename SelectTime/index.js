import React, {useEffect, useState} from 'react';
import TopBar2 from '../components/TopBar2';
import {GenerateApptSlots} from '../handlers/handlers';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Alert, BackHandler} from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import sampleApptSlots from '../json/sampleApptSlots.json'
const sampleApptSlots = require('../json/sampleApptSlots.json')
import HomeScreen from '../LandingPage/HomeScreen'
import {Ionicons} from '@expo/vector-icons';
import TimeSlotHeader from '../Headers/timeSlot'
import moment, { weekdays } from 'moment';
import TimeSlot from '../components/timeSlot'
import {getServicesByCategory, getAvailabilityList, getServicesList, getServiceList, getStylistsList, getAppointmentList, getServiceAppointmentbyDate, getStylistScheduale, getStylistAppointmentByDate, getStylistAppointment, addresstoCoords,coordstoAddress, saveLocationCoordinates, saveAddressAsync, saveLocationTypeAsync, saveLocation, getStylist, getAddress, computeTravelDistance, getStylistwithCallback, getStylistSchedualewithCallback, getService, computeTravelDuration, getClient, getStylistAvailability} from '../Database/functions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getDistance} from 'geolib'
import Spinner from 'react-native-loading-spinner-overlay'
import AppointmentSlot from '../Models/appointmentSlot';
import {generateSlots} from '../test'
import {filterServicesByCategory, generateUpcomingWeek, populatetheUpcomingWeekAvailability} from './Scripts/functions'
const SelectTime = ({navigation}) => {
    //console.log("IN SELECT TIME")
    var services = navigation.state.params.services
    var availableServiceCategories = navigation.state.params.availableServices
    var travelDuration = navigation.state.params.travelDuration

    const [selectedTimeSlot, setSlot] = useState(null)
    const [selectedTime, setTime] = useState(null);
    const [latitude,setLat] = useState(null)
    const [longitude, setLong] = useState(null)
    const [servicesByCategory, setServices] = useState({})
    const [tempFetched, setFetched] = useState(false)
    const [stylistDistanceEligble, setStylists] = useState({})
    const [clientId, setclientId] = useState(null)
    const [fetchedClient, setClientFetched] = useState(false)
    const [slots, setSlots] = useState({})
    const [slotsFetched, setSlotsFetched] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [currentDate, setCurrent] = useState(null)
    const [clientLocation, setLocation] = useState(null)
    const [ClientCoords, setCoords] = useState(null)
    const [clientCoordsFetched, setclientCoordsFetched] = useState(false)
    const [locationCoords, setlocationCoords] = useState(null)
    const [locationCoordsFetched, setCoordsFetched] = useState(false)
    const [spinner, setSpinner] = useState(true)
    const [stylistAvailability, setAvailability] = useState({})
    const [stylistAlert, setAlert] = useState(false)
    const [weekDates, setDates] = useState([])
    const [stylistsFetched, setstylistsFetched] = useState(false)
    const [servicesFetched, setservicesFetched] = useState(false)
    const [availabilityFetched, setavailabilityFetched] = useState(false)
    const [availabilityList, setavailabilityList] = useState([])
    const [servicesList, setservicesList] = useState([])
    const [stylistsList, setstylistsList] = useState([])
    const [appointmentList, setappointmentList] = useState([])
    const [appointmentsFetched, setappointmentsFetched] = useState(false)
    const [alertRaised, setalertRaised] = useState(false)

    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    var months = ["JANUARY", "FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"]
    var timeFrames = ["Early","Morning","Noon","Afternoon","Evening","Night"]
    var timeIntervals = {'Early':'6:00 AM-9:00 AM', 'Morning':'9:00 AM-12:00 PM', 'Noon':'12:00 PM-2:00 PM', 'Afternoon':'2:00 PM-5:00 PM','Evening':'5:00 PM-8:00 PM','Night':'8:00 PM-11:00 PM'}
    
    console.log("AT RELOAD 3")
    // console.log(availabilityList.length)
    console.log(slotsFetched)


    useEffect(()=> {
       
        getClientCoords()
        if (appointmentsFetched==false && stylistsList.length>0){
            getAppointmentList((result)=> {
                if (result!=null){
                    var appointmentList = result.data
                    var relevantAppointments = []
                    console.log("THE STYLISTS LSIT")
                    console.log(stylistsList)
                    for (var record in stylistsList){
                        console.log('THE STYLISTS LIST IN APPOINTMENT LOOP')
                        console.log(stylistsList[record])
                        var appointments = appointmentList.filter(appt=>appt.StylistId==stylistsList[record].id)
                        for (var res in appointments){
                            relevantAppointments.push(appointments[res])

                        }
                        
                    }
                    console.log("after appointment list loop is done")
                    setappointmentList(relevantAppointments)
                    setappointmentsFetched(true)
                }
        })
        }
        if (servicesFetched==false){
            console.log("IN FETCH SERVICES CLAUSE")
            
           
            setservicesFetched(true) 
            getServicesList((result)=> {
                
                if (result!=null && result.data.length>0){
                 
                  var filteredServices = filterServicesByCategory(services, result.data)
               
                  filteredServices.map((record)=> {
                      console.log(record.Category)
                      console.log(record.StylistId)
                  })
                  setservicesList(filteredServices)
                } else {
                  Alert.alert("Network Error", "Unable to fetch available slots")
      
                }
                
            })
        }
        if (availabilityFetched==false && stylistsList.length>0){
            console.log('IN FETCH AVAILABILITY CLAUSE')
            setavailabilityFetched(true)
              getAvailabilityList((result)=> {     
                  if (result!=null && result.data!=null && result.data.length>0){
                    var availabilityRecords = result.data
                    var relevantAvailabilityList = []
                    for (var record in stylistsList){
                        console.log("THE STYLIST LIST LOOP IN AVAILABILITY")
                        console.log(stylistsList[record])
                        var availabilityRecord = availabilityRecords.filter(availability=> availability.stylistid==stylistsList[record].id)
                        if (availabilityRecord.length>0){
                            relevantAvailabilityList.push(availabilityRecord[0])

                        }
                        

                    }
                    console.log("AFTER FOR LOOP IN GET AVAILABILITY LIST")
                    relevantAvailabilityList.map((record)=> {
                        console.log(record.id)
                        
                    })

                    setavailabilityList(relevantAvailabilityList)    
                      
                  } else {
                      Alert.alert("Network Error", "Unable to fetch available slots")
                  }
              })
        }
        
        if (stylistsFetched==false && servicesList.length>0){
            console.log("IN FETCH STYLIST CLAUSE")
          
            //services list only includes list of services that match the category(ies) previously selected by user
            setstylistsFetched(true)
            
            getStylistsList((result)=> {
          
                if (result!=null){
                    var stylistRecords = result.data
                    
                    var relevantStylists = []
                    for (var service in servicesList){
                        console.log("THE STYLIST ID IN LOOP 1")
                        console.log(servicesList[service].StylistId)
                      
                        var stylist = stylistRecords.filter(stylist_=>stylist_.id==servicesList[service].StylistId)
                        console.log("THE RETRIEVED STYLIST OBJECT 1")
                        console.log(stylist)
                        if (!relevantStylists.includes(stylist[0]) && stylist.length>0){
                            relevantStylists.push(stylist[0])

                        }
     
                    }
                  
                    stylistRecords.map((record)=> {
                        console.log("STYLIST RECORD MAP")
                        console.log(record)
                    })
                    setstylistsList(relevantStylists)
                } else {
                Alert.alert("Network Error", "Unable to fetch available slots")
                }
      
            })
        }
        if (appointmentsFetched==true && availabilityList.length>0 && ClientCoords!=null){
            console.log("ABOUT TO POPULLATE THE UPCOMING WEEK")
            var weekDates = generateUpcomingWeek()
            populatetheUpcomingWeekAvailability(weekDates, availabilityList, stylistsList, servicesList, appointmentList, ClientCoords)
        }
        const backAction = () => {
            //console.log("IN BACK ACTION")
            props.navigation.pop(1)
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress", 
            backAction
        )
        return () => backHandler.remove()
    }, [servicesList, stylistsList, appointmentsFetched, availabilityList, ClientCoords]);

    const getClientCoords = async() => {
        console.log("IN GET CLIENT COORDS AT INDEX")
        //console.log("IN GET CLIENT COORDS 6")
        var coords_ = await AsyncStorage.getItem("locationCoords")
        console.log("AT GET CLIENT COORDS RESPONSE")
        coords_ = JSON.parse(coords_)
        console.log(coords_)
        setCoords(coords_)
        setCoordsFetched(true)

    }
    


if (slotsFetched==false && servicesList.length>0 && stylistsList.length>0 && availabilityList.length>0 && appointmentsFetched==true&& ClientCoords!=null && weekDates.length>0){

  console.log("THE AVAILABILITY LIST PRINTED 10")
  console.log(servicesList.length)
  console.log(stylistsList)
  console.log(availabilityList)

    console.log("THE WEEK DATES LIST")
    console.log(weekDates)
  

generateSlots(servicesList, stylistsList, availabilityList, ClientCoords, weekDates, days, travelDuration, availableServiceCategories, (result)=> {
    console.log("SLOTS IN AGAIN")
    console.log(result)
    setSlots(result)
    setSpinner(false)
    

})

  setSlotsFetched(true)
    
    
    }


  


    if (slotsFetched==true && Object.keys(slots).length==0 && alertRaised==false){
        console.log("THE SLOTS FETCHED BUT EMPTY 1234")
        setalertRaised(true)
        Alert.alert("Error",`No stylists available to provide ${serviceName} services for the week`, 
        [
            {
              text: "Go Back",
              onPress: () => {
               
                //props.navigation.goBack()
                props.navigation.pop(1)},
        
            }
           
          ])
      
    }
        
        
    



    const getLocationCoords = async () => {
        var coords_ = await AsyncStorage.getItem("locationCoords")
        setlocationCoords(coords_)

    }
    if (locationCoordsFetched==false){


    }



    const getClientLocation = async () => {
        var location = await AsyncStorage.getItem("")
    }

  

    if (ClientCoords==null && clientCoordsFetched==false){
        getClientCoords()
    }

    const updateClientId = async () => {
        var clientId_ = await AsyncStorage.getItem("clientId")
        //if clientId_ is false
        setclientId(clientId_)
        setClientFetched(true)
        if (clientId_==null){
            alert("Data error: Cannot access customer location.")
            //try to see how to handle this 
            return 

        }

    }
    if (clientId==null && fetchedClient==false){
        updateClientId()
        
        
        

    }


   
    
    const translateStylistAddress = (stylistId, callback_, callback) => {
        //console.log("IN TRANSLATE STYLIST ADDRESS")
        //console.log(stylistId)
        getStylist(stylistId, (response)=> {
            //console.log("GET STYLIST RESPONSE")
            //console.log("id first")
            //console.log(stylistId)
            //console.log(response.data[0])
            if (response.data!=null && response.data.length>0){
                //console.log("IN GET STYLIST RESULT")
                //console.log(response.data)
                var mainAddress = response.data[0].ActiveAddress 
                var stylist = response.data[0]
                //console.log("MAIN ADDRESS")
                //console.log(mainAddress)
                getAddress(mainAddress, callback, (result)=> {
                    //console.log("IN THE GET ADDRESS")
                    //console.log(result)
                    if (result!=null && result.length>0){
                        //console.log("IN GET ADDRESS RESULT")
                       
                        var streetName = result[0].StreetName 
                        var city = result[0].City
                        var state = result[0].State 
                        var addressPayload = {
                            streetName: streetName,
                            cityName: city,
                            stateName: state
                        }
                        //console.log("RIGHT BEFORE ADDRESS TO COORDS")
                        //console.log(addressPayload)
                        addresstoCoords(addressPayload, (georesponse)=> {
                            //console.log("AT GEORESPONSE")
                            //console.log(georesponse)
                            if (georesponse!=null){
                                //console.log(georesponse.data)
                                callback({
                                    distance: georesponse.data, 
                                    stylist: stylist
                                })
                                // callback(georesponse.data)

                            } else {
                                callback(null)
                            }
                            

                        })


                    }
                })

            } else {
                //console.log("GET STYLIST FAILED HERE")
            }
        })
        //console.log("OUTSIDE OF TRANSLATE STYLIST ADDRESS")


    }

    const translateClientAddress = (callback) => {



    }


    const computeTotalDuration = (serviceDuration, travelDuration) => {
        //console.log("IN COMPUTE TOTAL DURATION")
        //console.log("SERVIVE DURATION IN MINUTES")
        //console.log(serviceDuration)
        //console.log("TRAVEL DURATION IN MINUTES")
        //console.log(travelDuration/60)
        //service duration is in minutes im assuming travel duration is in seconds (double check)
        var duration = 2 * parseInt(travelDuration)

        var total = duration + parseInt(serviceDuration)*60
        //returns total duration in minutes
        return total/60
    }


    const checkAppointments = (currentSlot, callback) => {
        //console.log("IN CHECK APPOINTMENTS FUNCTION")
        //console.log(currentSlot)

        
        var travelDuration_ = 20 
        
        var totalServiceDuration = 2*travelDuration_ + currentSlot.service.Duration
        //console.log(currentSlot)
        var availability = currentSlot.availability 
        
        if (availability.includes(selectedTime)){
            var timeRange = timeIntervals[selectedTime]
            var stylistId = currentSlot.stylistId 
            var serviceId = currentSlot.service.id
            var date = selectedTimeSlot 
            var startTime = timeRange.split('-')[0]
            var endTime = timeRange.split('-')[1]
            
            getServiceAppointmentbyDate(serviceId, date, (result)=> {
                var slotStart = startTime 
                var slotEnd = endTime
                //console.log("IN SELECT TIME GET STYLIST APPOINTMENT BY DATE 2")
                //console.log(result)
                if (result!=null && result.data.length>0){
                    //console.log("WE HAVE AN APPOINTMENT")
                    //we have an appointment
                    var overlap = false
                    for (var appt in result.data){
                        var appointment = result.data[appt]
                        var startTime = appointment.StartTime
                        var endTime = appointment.EndTime
                        var selectedStart = timeIntervals[selectedTime].split("-")[0]
                        var selectedEnd = timeIntervals[selectedTime].split("-")[1]
                        //console.log("APPOINTMENT TIMES")
                        //console.log(startTime)
                        //console.log(endTime)
                        //console.log(selectedStart)
                        //console.log(selectedEnd)
                        //console.log("BOOL CHECK")
                        //console.log(moment(startTime, 'h:mma').isBefore(moment(selectedEnd, 'h:mma')))
                        //console.log(moment(selectedEnd, 'h:mma').isBefore(moment(endTime, 'h:mma')))
                        if (moment(startTime, 'h:mma').isBefore(moment(selectedEnd, 'h:mma')) && moment(selectedEnd, 'h:mma').isBefore(moment(endTime, 'h:mma'))){
                            overlap = true 
                            break

                        } else {
                            if (moment(startTime,'h:mma').isBefore(moment(selectedStart,'h:mma')) && moment(endTime,'h:mma').isBetween(moment(startTime,'h:mma'), moment(endTime,'h:mma'))){
                                //so apppointment start time is before the slot start time and end time is between the start and end time of the slot
                                var duration_ = moment.duration(selectedEnd.diff(endTime))
                                
                                if (duration_< totalServiceDuration){
                                    overlap=true 
                                    break
                                }
                            }
                           


                        }


                    }
                    if (overlap==true){
                        //console.log("OVERLAP IS TRUE")
                        //console.log("BEFORE FILTER")
                        //console.log(selectedSlot)
                        selectedSlot = selectedSlot.filter(slot_ => slot_!= currentSlot)
                        //console.log("AFTER FILTER")
                        //console.log(selectedSlot)

                    }
        
                   

                }
                var timeSlots = [] 
                while (moment(startTime, 'h:mma').isBefore(moment(endTime,'h:mma'))){
                    timeSlots[currentSlot.service.id].push(indexTime)
                    var newTime = moment(indexTime, "h:mma").add(duration,'minutes')
                    indexTime = newTime.format("h:mma")

                }
                callback(timeSlots)
                
            })

        }
    }
    
   
    const iteratorFunc = (stylistId, serviceId, service, count, slotDict, callback)=> {
            if (stylistAvailability[stylistId]==null){
 
            checkForAvailability(stylistId, (response=> {
                stylistAvailability[stylistId] = response.availability
                setAvailability(stylistAvailability)
                distanceEligible(stylistId, (response=> {
                    if (response!=false){
                        var travelDuration = response.travelDuration 

                        //then distance eligible
                    } 
                    
                }))
                //after getting availability then get appointments
                
                //console.log("IN ITERATOR FUNC RESPONSE SECTION")
                //console.log(response)
                if (response!=false){
                    var availabilityRes = response
                    checkAppointments(service, (result)=> {
                        //console.log("CHECK APPOINTMENTS RESULT")
                        //console.log(result)
                    })
                     

              
                        //in this case service can't be null cause we have service Id 
                    // //console.log("SLOTS IN CHECK FOR AVAILABILITY")
                    // //console.log(slotDict[day])
                    // for (var day_ in weekDates){
                    //     //console.log("WEEK DATES LOOP 3")
                    //     //console.log(day_)
                    //     var day = weekDates[day_]
                    //     //console.log(day)
                    //     var date = moment(day)
                    //     var index = date.day()
                      
                    //     var weekDay = days[index]
                    //     //console.log(weekDay)
                    //     var availability_ = response.availability[weekDay]
                    //     //console.log(availability_)
                    //     if (slotDict[day_]!=null){
                    //         if (availability_.length>0){
                    //             slotDict[day].push(
                    //                 {
                    //                     stylistId: stylistId,
                    //                     serviceId: serviceId,
                    //                     availability: availability_,
                    //                     travelDuration: response.travelDuration,
                    //                     service: service
        
                    //                 }
                    //             )

                    //         }
                    //     } else {
                    //         if (availability_.length>0){
                    //             slotDict[day] = [{
                    //                 stylistId: stylistId,
                    //                 serviceId: serviceId,
                    //                 availability: availability_,
                    //                 travelDuration: response.travelDuration,
                    //                 service: service
    
                    //             }]

                    //         }
                            

                    //    }
                    // }
                    // setSlots(slotDict)
                    // callback('done')
                    
                   
                    // if (slotDict[day]==null){
                    //     //console.log("SLOTS DAY IS NULL 2")
                    //     //console.log(response.availability)
                    //     slotDict[day] = [{
                    //         stylistId:stylistId,
                    //         serviceId: serviceId,
                    //         availability: response.availability,
                    //         travelDuration: response.travelDuration,
                    //         service: service


                    //     }]
                        //console.log(slots)
                        //console.log("BEFORE SET SLOTSSSSS")
                        // setSlots(slots)
                        // slotList.push(slots)
                        // setRefresh(!refresh)
                        // setSlots(slots=> ({...slots, day: [
                        //     {
                        //         stylistId: result.data[elem].StylistId,
                        //         serviceId: result.data[elem].id,
                        //         availability: response.availability

                        //     }
                        // ]}))
                        // var newCount = count +=1
            
                        // iteratorFunc(stylistId, serviceId, newCount, slotDict, callback)
                    // } else {
                    //     var present = false
                    //     for (var elem_ in slotDict[day]){
                    //         if (slotDict[day][elem_].stylistId==result.data[elem].StylistId)
                    //         present = true
                    //         break
                    //     }
                    //     if (present==false){
                           
                           
                            // //console.log(slots)
                            // //console.log("BEFORE SET SLOTSSSSS")
                            // setSlots(slots)
                            // setRefresh(!refresh)

                        //}
                        // var newCount = count +=1
            
                        // iteratorFunc(stylistId, serviceId, newCount, slotDict, callback)
                      
                    
                } else {
                    callback(null)
                }
            })
            )}
        
                    //so here we know that this service offered by this particular stylist is available
                    //will we have a type error on runtime or is type determined on runtime
                // } else {
                    // //console.log("IN NEW ITERATOR")
                    // var newCount = count +=1
            
                    // iteratorFunc(stylistId, serviceId, newCount, slotDict, callback)
               // }
                //need to store result here for each day once we get it

                // var newCount = count +=1
            
                // iteratorFunc(stylistId, newCount, callback)
            //}) )

        //}
   }
    

    const distanceEligible = (stylistId, callback) => {
        
        //console.log("ABOUT TO ENTER TRANSLATE STYLIST ADDRESS 2")
        translateStylistAddress(stylistId, callback, (result)=> {
            //console.log("TRANSLATE STYLIST ADDRESS RESPONSE 2")
            // //console.log("A TRANSLATE STYLIST ADDRESS RESULTTTT")
            // //console.log(result)
            // //console.log("WITH WEEKDAY NEXT TO IT")
            // //console.log(weekDates[day])
            if (result!=false){
                var distance = result['distance']
                var stylist = result['stylist']
                //console.log("IN TRANSLATE STYLIST ADDRESS 2")
                //console.log(result)
                //console.log("RIGHT BEFORE CLIENT COORDS")
                //var clientCoords = await AsyncStorage.getItem("locationCoords")
                var clientCoords = ClientCoords
                //console.log("IN CLIENT COORDS")
                //console.log(clientCoords)
                if (clientCoords==null){
                    alert("Data error: Cannot access client coords")

                } else {
                    //console.log("ORIGINAL CLIENT COORDS TYPE")
                    //console.log(typeof(clientCoords))
                    var clientCoordsJSON = clientCoords
                    //console.log("NEW CLIENT COORDS 3")
                    //console.log(clientCoords)
                    //console.log(typeof(clientCoordsJSON))
                    //console.log("DISTANCE")
                    //console.log(distance)
                    //console.log("STYLIST")
                    //console.log(stylist.id)
                    //console.log(clientCoords)
                    var travelDistance = getDistance(
                        {latitude: clientCoordsJSON['Latitude'], longitude: clientCoordsJSON['Longitude']},
                        {latitude: distance['lat'], longitude: distance['lng']})
                    //console.log('TRAVEL DISTANCE')
                    //console.log(travelDistance)

                    //console.log("THE COORDS")
                    //console.log(clientCoordsJSON['Latitude'])
                    //console.log(clientCoordsJSON['Longitude'])
                    //console.log(distance['lat'])
                    //console.log(distance['lng'])
                    // computeTravelDistance(clientCoords['latitude'], clientCoords['longitude'], distance['lat'],distance['lng'], callback, (response)=> {
                    //     if (response!=null){
                    //         //console.log("COMPUTE TRAVEL DISTANCE RESPONSE")
                    //         //console.log(response)
                    //         var travelDistance = response.data
                    computeTravelDuration(clientCoordsJSON['Latitude'], clientCoordsJSON['Longitude'], distance['lat'],distance['lng'], callback, (response)=> {
                        if (response!=null){
                            var travelDuration = response.data
                        }
                        var travelRadius = stylist.WorkingRadius
                        if (travelDistance<=travelRadius){
                            callback({
                                
                                travelDuration: travelDuration,
                               

                            })
                        } else {
                            callback(false)
                        }  
                        })

                    //     } else {
                    //         callback(false)
                    //     }
                        

                    // })



                }
                //then we have (lat,long) now get the (lat,long of the client)
                

            } else {
                //console.log("RESULT FOR TRANSLATE STYLIST ADDRESS IS NULLL")
                callback(false)
            }
        })

        


    }
    const checkForAvailability = (stylistId, callback) => {
        //console.log("IN CHECK FOR AVAILABILITY FUNCTION")
        //console.log(stylistId)
        //check for availability and then check for exceptions
        getStylistAvailability(stylistId, (result)=> {
            //console.log("STYLIST GET AVAILABILITY RESULT")
            //console.log(result)
            if (result!=null && result.data.length>0){
                var availability = result.data[0]
                var availabileIntervals = {
                    'Monday': availability.Monday,
                    'Tuesday': availability.Tuesday,
                    'Wednesday': availability.Wednesday,
                    'Thursday': availability.Thursday,
                    'Friday': availability.Friday,
                    'Saturday': availability.Saturday,
                    'Sunday': availability.Sunday
                }

                if (stylistDistanceEligble[stylistId]==null){
                    //console.log("ABOUT TO ENTER TRANSLATE STYLIST ADDRESS")
                    translateStylistAddress(stylistId, callback, (result)=> {
                        //console.log("TRANSLATE STYLIST ADDRESS RESPONSE")
                        // //console.log("A TRANSLATE STYLIST ADDRESS RESULTTTT")
                        // //console.log(result)
                        // //console.log("WITH WEEKDAY NEXT TO IT")
                        // //console.log(weekDates[day])
                        if (result!=false){
                            var distance = result['distance']
                            var stylist = result['stylist']
                            //console.log("IN TRANSLATE STYLIST ADDRESS")
                            //console.log(result)
                            //console.log("RIGHT BEFORE CLIENT COORDS")
                            //var clientCoords = await AsyncStorage.getItem("locationCoords")
                            var clientCoords = ClientCoords
                            //console.log("IN CLIENT COORDS")
                            //console.log(clientCoords)
                            if (clientCoords==null){
                                alert("Data error: Cannot access client coords")

                            } else {
                                //console.log("ORIGINAL CLIENT COORDS TYPE")
                                //console.log(typeof(clientCoords))
                                var clientCoordsJSON = (clientCoords)
                                //console.log("NEW CLIENT COORDS 2")
                                //console.log(clientCoords)
                                //console.log(typeof(clientCoordsJSON))
                                //console.log("DISTANCE")
                                //console.log(distance)
                                //console.log("STYLIST")
                                //console.log(stylist.id)
                                //console.log(clientCoords)
                                var travelDistance = getDistance(
                                    {latitude: clientCoordsJSON['Latitude'], longitude: clientCoordsJSON['Longitude']},
                                    {latitude: distance['lat'], longitude: distance['lng']})
                                //console.log('TRAVEL DISTANCE')
                                //console.log(travelDistance)

                                //console.log("THE COORDS")
                                //console.log(clientCoordsJSON['Latitude'])
                                //console.log(clientCoordsJSON['Longitude'])
                                //console.log(distance['lat'])
                                //console.log(distance['lng'])
                                // computeTravelDistance(clientCoords['latitude'], clientCoords['longitude'], distance['lat'],distance['lng'], callback, (response)=> {
                                //     if (response!=null){
                                //         //console.log("COMPUTE TRAVEL DISTANCE RESPONSE")
                                //         //console.log(response)
                                //         var travelDistance = response.data
                                computeTravelDuration(clientCoordsJSON['Latitude'], clientCoordsJSON['Longitude'], distance['lat'],distance['lng'], callback, (response)=> {
                                    if (response!=null){
                                        var travelDuration = response.data
                                    }
                                    var travelRadius = stylist.WorkingRadius
                                    if (travelDistance<=travelRadius){
                                        callback({
                                            availability: availabileIntervals,
                                            travelDuration: travelDuration,
                                            stylist: stylist

                                        })
                                    } else {
                                        callback(false)
                                    }  
                                    })

                                //     } else {
                                //         callback(false)
                                //     }
                                    

                                // })



                            }
                            //then we have (lat,long) now get the (lat,long of the client)
                            

                        } else {
                            //console.log("RESULT FOR TRANSLATE STYLIST ADDRESS IS NULLL")
                            callback(false)
                        }
                    })

                } else {
                    callback(false)
                }

            } else {
                callback(false)
            }
        })
    }

    // const checkForScheduale = (stylistId, count, callback) => {
    //     //console.log("IN CHECK FOR SCHEDUALE")
    //     // for (var day in weekDates){
    //         var day = count
    //         //console.log("THE CURRENT DAY")
    //         //console.log(weekDates[day])
    //         getStylistSchedualewithCallback(stylistId,weekDates[day], callback, (result)=> {
               
    //             if (result.data!=null && result.data.length>0){
    //                 //we have a result, need to see how to handle the error cases
    //                 for (var date in result.data){
    //                     var availabileIntervals = result.data[date].AvailableIntervals
    //                     //console.log("RIGHT AT AVAILABLE INTERVALS")
    //                     //console.log(availabileIntervals)
    //                     if (result.data[date].AvailableIntervals.length>0){
    //                         //here we know they have availability for that day but we need to take travel time into consideration
    //                         //console.log("AVAILABLE INTERVALS IS NOT EMPTY")
    //                         if (stylistDistanceEligble[stylistId]==null){
    //                             //console.log("ABOUT TO ENTER TRANSLATE STYLIST ADDRESS")
    //                             translateStylistAddress(stylistId, callback, (result)=> {
    //                                 //console.log("A TRANSLATE STYLIST ADDRESS RESULTTTT")
    //                                 //console.log(result)
    //                                 //console.log("WITH WEEKDAY NEXT TO IT")
    //                                 //console.log(weekDates[day])
    //                                 if (result!=null){
    //                                     //console.log("IN TRANSLATE STYLIST ADDRESS")
    //                                     //console.log(result)
    //                                     //console.log("RIGHT BEFORE CLIENT COORDS")
    //                                     // var clientCoords = await AsyncStorage.getItem("locationCoords")
    //                                     var clientCoords = ClientCoords
    //                                     //console.log("IN CLIENT COORDS")
    //                                     //console.log(clientCoords)
    //                                     if (clientCoords==null){
    //                                         alert("Data error: Cannot access client coords")

    //                                     } else {
    //                                         // computeTravelDuration(clientCoords['lat'], clientCoords['lng'], result['lat'],result['lng'], (response)=> {
    //                                         //     if (response!=null){


    //                                         //     } else {
    //                                         //         callback(false)
    //                                         //     }


                                               

    //                                         // })
    //                                         //compute the distance between stylist and client and 
    //                                         clientCoords = JSON.parse(clientCoords)
    //                                         computeTravelDistance(clientCoords['latitude'], clientCoords['longitude'], result['lat'],result['lng'], callback, (response)=> {
    //                                             if (response!=null){
    //                                                 //console.log("COMPUTE TRAVEL DISTANCE RESPONSE")
    //                                                 //console.log(response)
    //                                                 var travelDistance = response.data
    //                                                 computeTravelDuration(clientCoords['lat'], clientCoords['lng'], result['lat'],result['lng'], callback, (response)=> {
    //                                                     if (response!=null){
    //                                                         var travelDuration = response.data
    //                                                     }
                                                    
    //                                                 getStylistwithCallback(stylistId, callback,(response)=>{
    //                                                     if (response!=null){
    //                                                         //console.log("GET STYLIST FINAL RESPONSE")
    //                                                         //console.log(response.data)
    //                                                         var travelRadius = response.data[0].WorkingRadius
    //                                                         //console.log("THE TRAVEL RADIUS")
    //                                                         //console.log(travelRadius)
    //                                                         //console.log("the travel distance response")
    //                                                         //console.log(travelDistance)
    //                                                         if (travelRadius!=null){
    //                                                             if (travelDistance<=travelRadius){
    //                                                                 //console.log("CAN TRAVEL")

    //                                                                 //need a return 
    //                                                                 //we need to include the week day as well as the availability
    //                                                                 callback({
    //                                                                     day: weekDates[day],
    //                                                                     availability: availableIntervals_,
    //                                                                     travelDuration: travelDuration

    //                                                                 })
    //                                                             }else{
    //                                                                 callback(false)
    //                                                             }
    //                                                         }
    //                                                     }
                                                        

    //                                                 })
    //                                             })

    //                                             } else {
    //                                                 callback(false)
    //                                             }
                                                

    //                                         })



    //                                     }
    //                                     //then we have (lat,long) now get the (lat,long of the client)
                                        

    //                                 } else {
    //                                     //console.log("RESULT FOR TRANSLATE STYLIST ADDRESS IS NULLL")
    //                                     callback(false)
    //                                 }
    //                             })

    //                         }
                           
    //                         //available for this day

    //                     } else {
    //                         callback(false)
    //                     }
    //                 }
    //             } else {
    //                 //console.log("DATA WAS NULLLL")
    //                 callback(false)
    //             }

    //         })

    //     // }

    // }

    const iteratorStylist = (stylist, callback) => {
        checkForAvailability(stylist, (result)=> {
            //console.log("CHECK AVAILABILITY RESULT")
            //console.log(result)
            callback(result)

        })

    }

    const iteratorStylists = (stylistList, count, eligibleStylists, callback)=> {
        if (count==stylistList.length){
            callback(eligibleStylists)

        } else {
            //console.log("iN ITERATOR STYLIST RECURSIVE CALL")
            //console.log(stylistList[count])
            iteratorStylist(stylistList[count], (result)=> {
                if (result!=false){
                    var stylistObj = {
                        stylistId: stylistList[count], 
                        travelDuration: result.travelDuration,
                        availability: result.availability
                    }
                    eligibleStylists.push(stylistObj)
                    

                }
                iteratorStylists(stylistList, count+1, eligibleStylists, callback)

            })
        }
    }

    const iteratorCategories = (categoryList, count) => {
        if (count==categoryList.length){
            //console.log("ITERATOR CATEGORIES IS DONE")
            setSpinner(false)
        } else {
            var serviceRow = categoryList[count]
            //console.log("SERVICE ROW")
            //console.log(serviceRow)
            iteratorFunc(serviceRow.StylistId, serviceRow.id, serviceRow, 0, {}, response=> {
                iteratorCategories(categoryList,count+1)

            })
        }

    }


    const iteratorServices = (servicesList, count, services, callback) => {
        if (servicesList.length==count){
            callback(services)
        } else {
            var serviceObj = servicesList[count]
            //service obj has service id, stylist id and travel duration

            
        }
        

    }


    //console.log("THE AVAILABILITY LIST PRINTED")
    ////console.log(availabilityList)


    const servicesIter = (count, callback) => {
        if (count == servicesList.count){
            callback("done")
        } else {
            var serviceObj = servicesList[count]
            console.log("THE SERVICE OBJ 11")
            console.log(serviceObj)
            servicesIter(count+1,callback)
        }
        
    }

    const computeAvailability = (stylistId) => {
        console.log("IN COMPUTE AVAILABILIT 3")
        var thesize = new Blob(availabilityList).size
        console.log(thesize)
        var count = availabilityList.length/2
        var availabilityObj = null
        for (var i=0;i<count;i++){
            console.log("the count loop")
            console.log(i)
            // if (availabilityList[i].stylistid==stylistId){
            //     availabilityObj = availabilityList[i]
            //     break
            // }
        }
        console.log("THE OBJ RETURN")
        console.log(availabilityObj)
        //   for (var availability in availabilityList){
        //       console.log("AVAILABILITY")
        //       console.log(availability)
        //         if (availabilityList[availability].stylistid == stylistId){
        //             availabilityObj = availabilityList[availability]
        //             break
        //         }
        //     }
    }

  
  
    var jsonData = sampleApptSlots
    // navigator.geolocation.getCurrentPosition(function(position){
    //     setLat(latitude=>position.coords.latitude)
    //     setLong(longitude=>position.coords.longitude)
        
    // })
    
    // const [weekDates,setDates] = useState([]);
    //weekDates is a list of strings in format: yyyy-mm-dd
   
  
    const generateWeekDay = (dateString) =>{
        let date = new Date(dateString)
        let weekDay = days[date.getDay()]
    
        return weekDay.substring(0,2)


    }
    const generateMonthDay = (dateString) =>{
        let date = new Date(dateString)
        let monthDay = date.getDate()
        return monthDay
    }
    const getData = () => {
        
        fetch('sampleApptSlots.json',{
            headers: {
                'Content-Type': 'application/json',
                "Accept": 'application/json'
            }
        }). then(function(response){
          
            return response.json()
        }). then(function(myJson){
           
            setData(myJson)
        })
    }
    const formatTime = (time) => {
        var timeSplit = time.split(":")
        var timeSplitHour = time.split(":")[0]
        // //console.log("time split hour")
        // //console.log(timeSplitHour)
        var timeHourInt = Number(timeSplitHour)
        // //console.log(timeHourInt)
        var fixedHourInt = null
        var pm = false
        var finalTimeString = null
        if (timeHourInt>12){
            fixedHourInt = timeHourInt-12
            pm = true

        } else {
            fixedHourInt = timeHourInt
        }

        finalTimeString = String(fixedHourInt)+":"+timeSplit[1]
        if (pm==true){
            finalTimeString += " PM"
        }
        else {
            finalTimeString += " AM"
        }
        return finalTimeString



    }
    const isDayAvailable = (date) => {
        //console.log("IN DAY AVAILABLE 3")
        //console.log(slots[date])
       
        if (slots[date]!=null && slots[date].length>0){
            return "."
        } else {
            return ""
        }
      
        // var startTimeList = getStartTime(date)
        // if (startTimeList.length==0){
        //     //there are no times that day
        //     return ""
        // } else {
        //     return "."
        // }
    }

    // const appointmentIterator = (selectedSlot, count, timeSlots, callback) => {
    //     if (count==selectedSlot.length){
    //         callback({
    //             'selectedSlot':selectedSlot,
    //             'timeSlots':timeSlots
    //         })
    //     } else {

    //         //console.log("APPOINTMENT ITERATOR")

            
            
    //         var currentSlot = selectedSlot[count]
    //         var travelDuration_ = 20 
            
    //         var totalServiceDuration = 2*travelDuration_ + currentSlot.service.Duration
    //         //console.log(currentSlot)
    //         var availability = currentSlot.availability 
            
    //         if (availability.includes(selectedTime)){
    //             var timeRange = timeIntervals[selectedTime]
    //             var stylistId = currentSlot.stylistId 
    //             var serviceId = currentSlot.service.id
    //             var date = selectedTimeSlot 
    //             var startTime = timeRange.split('-')[0]
    //             var endTime = timeRange.split('-')[1]
                
    //             getServiceAppointmentbyDate(serviceId, date, (result)=> {
    //                 var slotStart = startTime 
    //                 var slotEnd = endTime
    //                 //console.log("IN SELECT TIME GET STYLIST APPOINTMENT BY DATE 2")
    //                 //console.log(result)
    //                 if (result!=null && result.data.length>0){
    //                     //console.log("WE HAVE AN APPOINTMENT")
    //                     //we have an appointment
    //                     var overlap = false
    //                     for (var appt in result.data){
    //                         var appointment = result.data[appt]
    //                         var startTime = appointment.StartTime
    //                         var endTime = appointment.EndTime
    //                         var selectedStart = timeIntervals[selectedTime].split("-")[0]
    //                         var selectedEnd = timeIntervals[selectedTime].split("-")[1]
    //                         //console.log("APPOINTMENT TIMES")
    //                         //console.log(startTime)
    //                         //console.log(endTime)
    //                         //console.log(selectedStart)
    //                         //console.log(selectedEnd)
    //                         //console.log("BOOL CHECK")
    //                         //console.log(moment(startTime, 'h:mma').isBefore(moment(selectedEnd, 'h:mma')))
    //                         //console.log(moment(selectedEnd, 'h:mma').isBefore(moment(endTime, 'h:mma')))
    //                         if (moment(startTime, 'h:mma').isBefore(moment(selectedEnd, 'h:mma')) && moment(selectedEnd, 'h:mma').isBefore(moment(endTime, 'h:mma'))){
    //                             overlap = true 
    //                             break

    //                         } else {
    //                             if (moment(startTime,'h:mma').isBefore(moment(selectedStart,'h:mma')) && moment(endTime,'h:mma').isBetween(moment(startTime,'h:mma'), moment(endTime,'h:mma'))){
    //                                 //so apppointment start time is before the slot start time and end time is between the start and end time of the slot
    //                                 var duration_ = moment.duration(selectedEnd.diff(endTime))
                                    
    //                                 if (duration_< totalServiceDuration){
    //                                     overlap=true 
    //                                     break
    //                                 }
    //                             }
                               


    //                         }


    //                     }
    //                     if (overlap==true){
    //                         //console.log("OVERLAP IS TRUE")
    //                         //console.log("BEFORE FILTER")
    //                         //console.log(selectedSlot)
    //                         selectedSlot = selectedSlot.filter(slot_ => slot_!= currentSlot)
    //                         //console.log("AFTER FILTER")
    //                         //console.log(selectedSlot)

    //                     }
    //                     // timeSlots[currentSlot.service.id] = [] 
    //                     // while (moment(startTime, 'h:mma').isBefore(moment(endTime,'h:mma'))){
    //                     //     timeSlots[currentSlot.service.id].push(indexTime)
    //                     //     var newTime = moment(indexTime, "h:mma").add(duration,'minutes')
    //                     //     indexTime = newTime.format("h:mma")
        
    //                     // }
                       

    //                 }
    //                 appointmentIterator(selectedSlot, count+1, timeSlots, callback)
                    
    //             })

    //         }
    //     }

    // }

    // const serviceIterator = (services, count, servicesObj, callback) => {
    //     //console.log("IN SERVICE ITERATOR")
      
    //     if (services.length==count){
    //         callback(servicesObj)
    //     } else {
    //         var service = services[count]
    //         //console.log(service)
    //         getService(service,(result)=> {
    //             //console.log("IN SERVICE ITERATOR GET SERVICE")
    //             //console.log(result)
    //             servicesObj.push(result.data[0])
    //             serviceIterator(services, count+1, servicesObj, callback)
    //         })
    //     }
    // }

    const appointmentIterator = (selectedSlot, count, callback) => {
        if (count==selectedSlot.length){
            

            callback(selectedSlot)
        } else {
            //console.log("APPOINTMENT ITERATOR RECURSIVE FUNCTION CALL")
            var stylistId = selectedSlot[count].stylistId
            var services = selectedSlot[count].services
            //console.log(stylistId)
            appointmentFetch(stylistId, selectedSlot[count], (result)=> {
                //var timeDict = timeSlots
                //console.log("APPOINTMENT FETCH RESPONSE")
                //console.log(result)
                var newCount = null
                if (result['timeSlots']!=null){
                    selectedSlot[count]['timeSlots'] = result.timeSlots
                    newCount = count+1
                    // var timeSlots_ = result.timeSlots
                    // var service= result.service
                    // for (var service in services){
                    //     timeDict[services[service]] = {
                    //         'timeSlots':timeSlots_,
                    //         'service':service
                    //     }
                    // }
                    

                }  else {
                    console.log("THIS SLOT DOES NOT HAVE ANY TIME SLOTS")
                    var currentSlot = selectedSlot[count]
                    console.log(currentSlot)
                    
                    console.log("SELECTED SLOT LENGTH BEFORE FILTER 3")
                    console.log(selectedSlot.length)
                    console.log(selectedSlot)
                    selectedSlot = selectedSlot.filter(slot_ => slot_!=currentSlot)
                   
                    console.log("SELECTED SLOT AFTER FILTER 3")
                    console.log(selectedSlot.length)
                    console.log(selectedSlot)
                    newCount = count

                }
                // //console.log("BEFORE APPT ITERATOR 2")
                // //console.log(timeDict)
                appointmentIterator(selectedSlot, newCount,callback)

            })
        }

    }

    const appointmentFetch = (stylistId, currentSlot, callback) => {
        //console.log("CURRENT SLOTTT 2")
        //console.log(currentSlot)
        //console.log(stylistId)
        //console.log("NEW SELECTED TIME SLOT AZ")
        //console.log(selectedTimeSlot)
        var returnVal = false
        var stylistAppointments = []
        var selectedStart = timeIntervals[selectedTime].split("-")[0]
        var selectedEnd = timeIntervals[selectedTime].split("-")[1]
        var overlap = false
        var indexEnd = selectedEnd
        for (var appt in appointmentList){
            if (appointmentList[appt].StylistId==stylistId && appointmentList[appt].Date==selectedTimeSlot){
                stylistAppointments.push(appointmentList[appt])
                var startTime = appointmentList[appt].StartTime
                var endTime = appointmentList[appt].EndTime
                if (moment(startTime, 'h:mma').isBefore(moment(selectedEnd, 'h:mma')) && moment(selectedEnd, 'h:mma').isBefore(moment(endTime, 'h:mma'))){
                    overlap = true 
                    break

                } else if (moment(startTime,'h:mma').isBefore(moment(selectedStart,'h:mma')) && moment(endTime,'h:mma').isBetween(moment(startTime,'h:mma'), moment(endTime,'h:mma'))){
                
                    //so apppointment start time is before the slot start time and end time is between the start and end time of the slot
                    var duration_ = moment.duration(selectedEnd.diff(endTime))
                    
                    if (duration_< totalServiceDuration){
                        overlap=true 
                        break
                    } else {
                        indexEnd = endTime 

                    }
                } else if (moment(startTime,'h:mma').isBetween(moment(selectedStart, 'h:mma'), moment(selectedEnd, 'h:mma')) && moment(endTime,'h:mma').isAfter(selectedEnd, 'h:mma')){
                    var duration_ = moment.duration(selectedEnd.diff(startTime))
                    if (duration_ > totalServiceDuration){
                        overlap=true
                        break
                    } else {
                        indexStart = startTime
                    }
                } else if (moment(startTime, 'h:mma').isBetween(moment(selectedStart, 'h:mma'), moment(selectedEnd, 'h:mma')) && moment(endTime, 'h:mma').isBetween(moment(selectedStart, 'h:mma'), moment(selectedEnd, 'h:mma'))){
                    overlap=true
                    break
                }

            


            }

            }
            if (overlap==true){
             
                callback(currentSlot)

            } else {
                console.log("IN NO OVERLAP 12")
                
                //var timeSlots = []
                // var testService = currentSlot.services[0]
                // var duration = testService.Duration
                var theTimeSlots = {}
                for (var service in currentSlot.services){
                    var indexTime = selectedStart
                    var theService = currentSlot.services[service]
                   



                    var id_ = theService.id
                    var serviceDuration = theService.Duration 
                    console.log(indexTime)

                    console.log(indexEnd)
                    
                    while (moment(indexTime, 'h:mma').isBefore(moment(indexEnd,'h:mma'))){
                        console.log("THE INDEX TIME HERE EYE 2")
                        console.log(moment(indexTime, "h:mm a").isAfter(moment("12:01 AM", "h:mm a")))
                        console.log(indexTime)
                        console.log('SEE DIFFERENCE 1')
                        var firstdigit = indexTime.split(":")[0]
                       
                        if (indexEnd=="11:00 PM" && (firstdigit=="12" || firstdigit=="1")){
                            console.log("BEFORE BREAK")
                            break

                            
                            //we are in the night time slot
                            
                        } else {
                            if (theTimeSlots[id_]==null){
                                theTimeSlots[id_] = [indexTime]
                            } else {
                                theTimeSlots[id_].push(indexTime)
                            }
                            // tempList[id_].push(indexTime)
                            var newTime = moment(indexTime, "h:mma").add(serviceDuration,'minutes')
                            console.log("THE NEW TIME")
                            console.log(newTime)
                            indexTime = newTime.format("h:mm A")

                        }
                       
                     
    
                    }
                    console.log("AT NIGHT TIME")
                    console.log(theTimeSlots)




                }
                //console.log(currentSlot)
                //console.log(duration)
                //console.log(moment(indexTime, "h:mma").add(duration,'minutes').format("h:mma"))
                // while (moment(indexTime, 'h:mma').isBefore(moment(indexEnd,'h:mma'))){
                //     timeSlots.push(indexTime)
                //     var newTime = moment(indexTime, "h:mma").add(duration,'minutes')
                //     indexTime = newTime.format("h:mma")

                // }
                currentSlot['timeSlots'] = theTimeSlots
                callback(currentSlot)
          
            }
        }
       

    const filterSlotTimes = (selectedSlot) => {
        //console.log("IN FILTER SLOT TIMES")
        var finalSlots = []
        for (var slot in selectedSlot){
            if (selectedSlot[slot].availability.includes(selectedTime)){
                finalSlots.push(selectedSlot[slot])
            }

        }
        //console.log(finalSlots)
        return finalSlots
    }


    const fetchServicesforSlot = (selectedSlot, count, servicesList, callback) => {
        if (selectedSlot.services.length==count){
            //console.log("IN FETCH SERVICES FOR SLOT BASE CASE")
            
            callback(servicesList)
        } else {
            //console.log("IN FETCH SERVICES FOR SLOT")
            //console.log(selectedSlot)
            var serviceId = selectedSlot.services[count]
            
            //console.log("FETCH SERVICES FOR SLOT 4")
            //console.log(serviceId)
            //console.log(selectedSlot)
            //fetchServicesforSlot(selectedSlot, count+1, servicesList, callback)

            getService(serviceId, (result)=> {
                //console.log("FETCH SERVICES FOR SLOT GET SERVICE RESPONSE 2")
                //console.log(result.data[0])
                servicesList.push(result.data[0])
                fetchServicesforSlot(selectedSlot, count+1, servicesList, callback)
            })
        }

    }

    const serviceSlotIterator = (selectedSlot, count, callback) => {
        if (selectedSlot.length==count){
            //console.log("SERVICE SLOT ITERATOR BASE CASE")
            callback(selectedSlot)
        } else {
            var selectSlot = selectedSlot[count]
            for (var elem in selectSlot){
                console.log(selectSlot[elem])
                console.log("\n")
            }
            console.log("THE SELECTED SLOTT 2")
            console.log(selectSlot)
            //console.log(selectSlot)
            fetchServicesforSlot(selectSlot, 0, [], (result)=> {
                //console.log("FETCH SERVICES FOR SLOT RESPONSE 4")
                //console.log(result)
                selectSlot['servicesObj'] = result
                selectedSlot[count] = selectSlot
                //console.log(selectedSlot)
                serviceSlotIterator(selectedSlot, count+1, callback)

            })
        }

    }

    
    const generateServicePayload = (callback) => {
        
        //console.log("THE SELECTED TIME SLOT")
        //console.log(selectedTimeSlot)
        var timeSlots = {}
        var eligibleServices = []
        var selectedSlot = slots[selectedTimeSlot]
        var filteredSlots = filterSlotTimes(selectedSlot)
        console.log("FILTERED SLOTS 3")
        console.log(filteredSlots)
        appointmentIterator(filteredSlots, 0,(result)=> {
            //console.log("APPOINTMENT ITERATOR RESULT")
            //console.log(result)
            callback(result)

        })

     
        // serviceSlotIterator(filteredSlots, 0, (result)=> {
          
        // })
      
        
        // appointmentIterator(selectedSlot, 0, {}, (result)=> {
        //     //console.log("APPOINTMENT ITERATOR RESPONSE")
        //     //console.log(resullt)
        // })

        // for (var slot in selectedSlot){
        //     var availability = selectedSlot[slot].availability
        //     //console.log("THE SELECTED TIME IN GENERATE SERVICE PAYLOAD")
        //     //console.log(selectedTime)
        //     if (availability.includes(selectedTime)){
        //         var stylistId = selectedSlot[slot].stylistId 
        //         var date = selectedTimeSlot
        //         //console.log("BEFORE GET STYLIST APPOINTMENT DATE IN GENERATE SERVICE PAYLOAD")
        //         var timeRange = timeIntervals[availability]
        //         var startTime = timeRange.split("-")[0]
        //         var endTime = timeRange.split("-")[1]
                

        //     }
        // }
        
     
       
      
       
    }
    

    const redirect = () => {
        console.log("IN REDIRECT 2")
        generateServicePayload((result)=> {
            //console.log("THE SERVICES PAYLOADDDD 6")
            //console.log(result)
            //with redirect to go to home screen with 
            const {navigate} = props.navigation
            console.log("THE SERVICE PAYLOAD RESULT 4")
            // console.log(result)
            for (var elem in result){
                console.log(result[elem].timeSlots)
            }
           
            navigate('HomeScreen',{
                servicesPayload: result,
                

                category:serviceName,
                //clientCoords:[26.2712,80.2706],
                arrivalDate:selectedTimeSlot,
                arrivalTime:selectedTime
            })

        })

        const {navigate} = props.navigation

    //     navigate('HomeScreen',{
    //       servicesPayload: slots,
          

    //       category:serviceName,
    //       //clientCoords:[26.2712,80.2706],
    //       arrivalDate:selectedTimeSlot,
    //       arrivalTime:selectedTime
    //   })
       


    }
    const getStartTime = (date) => {
        
        
        var startTimes = []
        
        //generate json based on date later in backend implementation, for now just use dummy data file from json directory
        //use jsonData 
        // //console.log("start times")
        // //console.log(sampleApptSlots)
        var appointments = GenerateApptSlots(sampleApptSlots)
        // //console.log("after generate appointment slots")
        //return a list of appointmentSlot s 
        for (var appt in appointments){
            // //console.log("appt")
            // //console.log(appointments[appt])
            // //console.log(date)
            if (appointments[appt].date == date){
                // //console.log("worked")
                for (var time in appointments[appt].timeList){
                    // //console.log("time")
                    // //console.log(appointments[appt].timeList[time])
                    var fixedTime = formatTime(appointments[appt].timeList[time])
                    startTimes.push(fixedTime)
                }
                
                

            }


        }
        return startTimes



    }
    const goBack = () => {
        props.navigation.goBack()
    }
   
  
    let dateObj = new Date(selectedTimeSlot)
    let monthDay = dateObj.getDate()
    if (monthDay<10){
        monthDay = "0"+String(monthDay)
    } else {
        monthDay = String(monthDay)
    }
    let monthName = months[dateObj.getMonth()]
    let year = String(dateObj.getFullYear())
    var timeView = null 
    var timesInterval = ["No Preference"]
    // //console.log("SELECTED TIME SLOTTTTTTT")
    // //console.log(selectedTimeSlot)
    for (var time in selectedTimeSlot){
        if (moment(time, 'h:mma').isBefore(moment("9:00 AM", 'h:mma')) && !("Early" in timesInterval) ){
            timesInterval.push('Early')
        } else if (moment("9:00 AM",'h:mma').isBefore(moment(time, 'h:mma')) && moment(time, 'h:mma').isBefore(moment("12:00 PM", 'h:mma')) && !("Morning" in timesInterval) ){
            timesInterval.push("Morning")
        
        }  else if (moment(time, 'h:mma').isAfter(moment("12:00 PM", 'h:mma')) && moment(time, 'h:mma').isBefore(moment("2:00 PM", 'h:mma')) && !("Noon" in timesInterval) ){ 
            timesInterval.push("Noon")
        } else if (moment(time, 'h:mma').isAfter(moment("2:00 PM",'h:mma')) && moment(time, 'h:mma').isBefore(moment("5:00 PM", 'h:mma')) && !("Afternoon" in timesInterval) ){
            timesInterval.push("Afternoon")
        } else if (moment(time, 'h:mma').isAfter(moment("5:00 PM", 'h:mma'))  && !("Evening" in timesInterval) ){
            timesInterval.push('Evening')
        }
    }
    // //console.log("THE TIMMES INTERVAL")
    // //console.log(timesInterval)
    if (selectedTimeSlot!=null){
    timeView = <View style={styles.timeSection}>
        <Text style={styles.fullDateString}>{monthDay} {monthName} {year}</Text>
        <View style={styles.timeTable}>
        
            {getStartTime(selectedTimeSlot).map((time)=>{
               
            // //console.log("YAY")
            // //console.log(time)
            return(
            <TouchableOpacity  style={styles.timeElement} onPress={()=>{setTime(selectedTime=>time)}}>
                <View style={{backgroundColor:selectedTime==time?"#1A2232":"white",padding:20, borderRadius:40}} >
            
                <Text style={{fontSize:14, color:selectedTime==time?"white":"black"}}>
                    {time}
                </Text>
                
                </View>
                
                </TouchableOpacity>
             ) } )}
        </View>

    </View>
  }
    // var submit = <View style={styles.bottom}>
    //     <Text style={styles.locationText}>3470 Coral Spring, FL</Text></View>
    var submit = null
    if (selectedTime!=null){
    submit = <View style={styles.bottom}>
        {/* <Text style={styles.locationText}>3470 Coral Spring, FL</Text> */}
           
    
    
    <TouchableOpacity style={styles.submitButtonDesign} onPress={()=> redirect() }><Text style={{color: "white", textAlign: "center",alignSelf: "center"}}>FIND</Text></TouchableOpacity>

</View>
    }
    var intervalsView = null 
    if (selectedTimeSlot!=null){
    intervalsView = <View style={styles.timeFrame}>
        
    <TouchableOpacity style={styles.intervalBox} onPress={()=>{setTime(selectedTime=>time)}}>
        <Image source={require('../assets/Intervals/early.png')} style={styles.intervalPic}>

        </Image>
    </TouchableOpacity>
    <TouchableOpacity style={styles.intervalBox} onPress={()=>{setTime(selectedTime=>time)}}>
        <Image source={require('../assets/Intervals/morning.png')} style={styles.intervalPic}>

        </Image>
    </TouchableOpacity>
    <TouchableOpacity style={styles.intervalBox} onPress={()=>{setTime(selectedTime=>time)}}>
        <Image source={require('../assets/Intervals/noon.png')} style={styles.intervalPic}>

        </Image>
    </TouchableOpacity>
    <TouchableOpacity style={styles.intervalBox} onPress={()=>{setTime(selectedTime=>time)}}>
        <Image source={require('../assets/Intervals/afternoon.png')} style={styles.intervalPic}>

        </Image>
    </TouchableOpacity>
    <TouchableOpacity style={styles.intervalBox} onPress={()=>{setTime(selectedTime=>time)}}>
        <Image source={require('../assets/Intervals/evening.png')} style={styles.intervalPic}>

        </Image>
    </TouchableOpacity>
    <TouchableOpacity style={styles.intervalBox} onPress={()=>{setTime(selectedTime=>time)}}>
        <Image source={require('../assets/Intervals/nopreference.png')} style={styles.intervalPic}>

        </Image>
    </TouchableOpacity>
</View>
    }
   
    return (
        <View style={styles.container} >
            <Spinner 
            visible={spinner}
            />
        {/* <TopBar2/> */}
        <TimeSlotHeader back={goBack}/>
        <View style={styles.selectTimeBar}>
            <Text style={styles.title}>SELECT YOUR PREFERRED TIME</Text>
            <View
            style={styles.scroll}>
               
                {weekDates.map((date)=>
                <TouchableOpacity style={styles.dateSlot} disabled={(slots[date]!=null && slots[date].length>0)?false:true} onPress={ () => {setSlot(selectedTimeSlot=>date)}} >
                    <View style={{backgroundColor: selectedTimeSlot==date?"#1A2232":"transparent",borderRadius:20,width:'100%',flexDirection:'column',justifyContent:'center',alignContent:'center'}}>
                    <View style={styles.weekText}>
                        <Text style={{color:selectedTimeSlot==date?"white":"grey"}}>
                        {generateWeekDay(date)}
                        </Text>

                    </View>
                    <View style={styles.monthText}>
                        <Text style={{color:selectedTimeSlot==date?"white":"black",fontWeight:'600'}}>
                        {generateMonthDay(date)}
                        </Text>
                    </View>
                    <View style={styles.dotText}>
                        <Text style={{color:selectedTimeSlot==date?"white":"#C2936D",fontWeight:'600',fontSize:40,marginTop:0,paddingTop:0}}>
                        {isDayAvailable(date)}
                        </Text>
                    </View>
                    
                    </View>

                </TouchableOpacity>
                
                
                )}

            </View>
            
            


        </View>
        <View style={styles.timeFrame}>
        {timeFrames.map((time=> {
            //console.log("IN SELECTED TIME SLOT 2")
            //console.log(selectedTimeSlot)
            //console.log(slots)
            var slot = slots[selectedTimeSlot]
            //console.log("IN TIME FRAMES 2")
            //console.log(slot)
            var select = false
            var enabled = false
            var disable = true
            for (var element in slot){
                for (var available in slot[element].availability){
                    //console.log("IN EARLY LOOP")
                    //console.log(slot[element])
                 
                    if (slot[element].availability[available].includes(time)){
                        enabled = true
                        disable = false
                        break

                    } 

                }
                
            }

           
            var select = false
            if (time==selectedTime){
                select = true

            }
            return (
                <TouchableOpacity disabled={!enabled} style={{width:100,
                    height:100,
                    marginTop:10,
                    backgroundColor: disable?"lightgrey":"transpaprent"}} onPress={()=>{setTime(selectedTime=>time)}}>
                <TimeSlot selected={select} time={time} loading={selectedTimeSlot==null || disable} />
                </TouchableOpacity>
            )
        }))}
        </View> 
       

       
        {submit}
        
        
        </View>


    )

};
const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: "#f9fafc",
        flexDirection: "column"

    },
    selectTimeBar: {
        height: 150,
        width: '100%',
        paddingTop: 30,
        marginLeft: 10
    },
    title: {
        fontWeight:"600",
        marginLeft: 10
        
    },
    dateSlot: {
        width: Dimensions.get('window').width/7.5,
        // height: 150,
        borderRadius:20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        alignContent: "center",
        paddingTop:10,
        marginBottom:0,
        paddingBottom:0,
      
        // backgroundColor: "#1A2232"


    },
    dotText: {
        padding:5,
        // marginTop:10,
        color: 'black',
        fontWeight: "600",
        fontSize:24,
        alignSelf: "center"

    },
    monthText: {
        padding:5,
        marginTop:10,
        color: 'black',
        fontWeight: "600",
        alignSelf: "center"

    },
    weekText: {
        padding:5,
        marginTop:10,
        color: 'grey',
        alignSelf:"center"

    },
    dateText: {
        padding:5,
        marginTop:10
    },
    scroll: {
        flexDirection: 'row',
        width: '100%'
    
   
    },
    timeSection: {
        marginTop: 60,
        marginLeft:20,
        marginRight:20
    },
    fullDateString: {
        color: "grey",
        fontWeight: "600",
        fontSize:12
    },
    timeTable: {
        flexDirection: "row",
        flexWrap:"wrap",
        marginRight: 20,
        justifyContent:"space-between",
        marginTop:20
        
    },
    timeElement: {
        backgroundColor: "white",
        borderRadius:40,
        // padding:20,
        // width:110,
        // height: 45,
        borderColor: "lightgrey",
        borderWidth:1,
        // textAlign: "center",
        flexDirection: "row",
        justifyContent: "center"

    },
    bottom: {
        position:"absolute",
        
        bottom:0,
        
        flexDirection:'column',
        width:'100%'
        
       
    },
    submitButtonDesign: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        bottom:0,
        
        backgroundColor: "#1A2232",
        height: Dimensions.get('window').height*0.08,
        width: "100%",
       
        

    },
    locationText: {
        marginBottom:70,
        alignSelf: "center",
        textDecorationLine: "underline",
        color: "grey",
        fontSize:16
    },
    timeFrame: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingRight:20,
        paddingLeft:20,
        marginTop:'25%',
        justifyContent: 'space-between',
        
    },
    intervalBox: {
        width:100,
        height:100,
        marginTop:10
     
        
    },
    intervalPic: {
        width:100,
        height:100,
        borderWidth:1,
        borderColor: 'lightgray'
    }




})

export default SelectTime