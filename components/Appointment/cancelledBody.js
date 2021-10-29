import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button ,ScrollView, TouchableOpacity, Alert } from 'react-native';
import BookingRow from '../Bookings/bookingRow'
import {getCurrentEmail} from '../../Enviornmental/functions'
import {getService, getStylist, getBookingsForClient} from '../../Database/functions'
import {getAppointment, getAppointmentList, getBookingList} from '../../Database/functions'
import moment from 'moment';
import EmptyBody from './emptyBody'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CancelledBody = (props) => {
    var appointments = props.appointments
    var bookings = props.bookings
    console.log("IN THE CANCELLED BODY")
    console.log(appointments)
    console.log(bookings)
    const [id, setId] = useState(null)
    const [dates, setDates] = useState({})
    const [dateList, setDateList] = useState([])
    const [filteredBookings, setfilteredBookings] = useState([])
    const [bookingsFiltered, setbookingsFiltered] = useState(false)
    const [noBookingsAvailable, setnoBookingsAvailable] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [datesFetched, setdatesFetched] = useState(false)
    // const [appointments, setAppointments] = useState([])
    // const [bookings, setBookings] = useState([])
    // const [appointmentsFetched, setappointmentsFetched] = useState(false)
    // const [bookingsFetched, setbookingsFetched] = useState(false)
    const filterBookingsByStatus = () => {
        var tempList = []
        for (var booking in bookings){
            console.log("IN FILTER BOOKINGS FOR LOOP")
            console.log(bookings[booking])
            if (bookings[booking].Status=="Cancelled"){
                tempList.push(bookings[booking])
            }
        }
        console.log("ABOUT TO RETURN TEP LIST")
        console.log(tempList.length)
        return tempList


    }
    if (bookings.length>0 && bookingsFiltered==false){
        console.log("IN GETTING BOOKINGS FILTERED")
        setbookingsFiltered(true)
        var filteredList = filterBookingsByStatus()
        if (filteredList.length==0){
            setnoBookingsAvailable(true)

        } else {
            console.log("IN ABOUT TO SET FILTERED BOOKINGS")
            setfilteredBookings(filteredList)
        }

    }
   

    const parseBookings = () => {
        
        var dateList_ = []
           
        var dateDict = {}
        
        var clientBookings = []
        console.log("IN PARSE BOOKINGS")
        console.log(filteredBookings)
        for (var booking in filteredBookings){
            if (bookings[booking].ClientId == id){
                clientBookings.push(bookings[booking])

            }
        }
        for (var booking in clientBookings){
           
            for (var appointment in appointments){
                if (clientBookings[booking].AppointmentId == appointments[appointment].id){
                    var apptDate = appointments[appointment].Date 
                    
                    var currentTime = moment().format("YYYY-MM-DD")
                    var apptStartTime = moment().format("h:mm A")
                    console.log("IN APPOINTMENT LOOP IN UPCPOMING CUR TIME 2")
                    console.log(currentTime)
                    if (moment(apptDate, "YYYY-MM-DD").isAfter(currentTime, 'YYYY-MM-DD')){
                        console.log("WE HAVE A DATE AFTER THE CURRENT DATE")
                        if (dateDict[apptDate]!=null){
                            dateDict[apptDate].push({
                                'Appointment':appointments[appointment],
                                'Booking':clientBookings[booking]
                            })
                            

                        } else {
                            dateDict[apptDate] = [
                                {

                                'Appointment':appointments[appointment],
                                'Booking':clientBookings[booking]
                            }]
                           
                        }
                        if (!(dateList_.includes(apptDate))){
                            dateList_.push(apptDate)
                        }

                    } else if (currentTime==apptDate && moment(appointments[appointment].StartTime, "h:mm A").isAfter(moment(apptStartTime, "h:mm A"))){
                        console.log("DATE IS THE SAME BUT TIME IS AFTER 123")
                        if (dateDict[apptDate]!=null){
                            dateDict[apptDate].push({
                                'Appointment':appointments[appointment],
                                'Booking':clientBookings[booking]})
                            

                        } else {
                            console.log("BEFORE THE PUSH")
                            console.log(dateDict[apptDate])
                            dateDict[apptDate] = [
                                {
                                    'Appointment':appointments[appointment],
                                    'Booking':clientBookings[booking]
                                }

                            ]
                          
                            
                        }
                        if (!(dateList_.includes(apptDate))){
                            dateList_.push(apptDate)
                        }
                    }
                }
            }
            
        }
        dateList_.sort((a,b)=> moment(a, "YYYY-MM-DD").isAfter(moment(b, "YYYY-MM-DD")))
        console.log("THE FINAL DATE LIST")
        console.log(dateList_)
        console.log("THE FINAL DATE DICT")
        console.log(dateDict)
        setDates(dateDict)
        setDateList(dateList_)

    }
    if (filteredBookings.length>0 && appointments.length>0 && id!=null && datesFetched==false){
        setdatesFetched(true)
        parseBookings()
        
        


    }
    const fetchId = async () => {
        console.log("IN FETCH ID")

        var clientId = await AsyncStorage.getItem("clientId")
        console.log(clientId)
        setId(clientId)


    }

    if (id==null){
        fetchId()

    }

    const appointmentIterator = (count, bookingList, callback) => {
        if (bookingList.length==count){
            callback("done")
        } else {
            console.log("APPOINTMENT ITERATOR 2")
            var booking = bookingList[count]
            var appointment = bookingList[count].appointment
            var stylistId = appointment.StylistId 
            var serviceId = appointment.ServiceId
            var address = appointment.ClientAddress
            getStylist(stylistId, (result)=> {
                console.log("UPCOMING BODY GET STYLIST RESPONSE")
                console.log(result)
                if (result!=null){
                    var stylist = result.data[0]
                    var stylistName = stylist.FirstName + stylist.LastName
                    getService(serviceId, (result)=> {
                        if (result!=null){
                            var service = result.data[0]
                            var duration = service.Duration
                            var serviceName = service.Name
                            var price = String(Number(service.Price) + 0.06 * Number(service.Price))
                            if (price.split(".")[1]==null){
                                price = price +".00"

                            } else if (price.split(".")[1].length==1){
                                price = price+"0"
                            } else if (price.split(".")[1].length>2){
                                price = price.split(".")[0]+"."+price.split(".")[1].substring(0,2)
                            }

                            
                            //need to add taxes to price above
                            var date = appointment.Date 
                            var rowObj = {
                                bookingId: booking.Id,
                                date: date, 
                                startTime: appointment.StartTime, 
                                stylistName: stylistName,
                                servicePrice: price,
                                serviceName: serviceName,
                                serviceDuration: duration, 
                                address: address,
                                status: booking.status
                            }
                            console.log("BEFORE ROW OBJECTTTTTTTT")
                            console.log(rowObj)

                            if (dates[date]==null){
                                console.log("DATE NOT IN DATES ARRAY")
                                dates[date] = [rowObj]
                                console.log(dates[date])
                                setDates(dates)
                                
                            } else {
                                console.log("DATA IS IN DATES ARRAY")
                                dates[date].push(rowObj)
                                dates[date] = dates[date].sort((a,b)=> moment(a.startTime, "h:mma").isBefore(moment(b.startTime, "h:mma")))
                                console.log(dates)
                                setDates(dates)
                            }


                        } else {
                            Alert.alert("Network Error", "Unable to load appointments")

                        }
                    })

                } else {
                    Alert.alert("Network Error", "Unable to load appointments")
                }
            })
            
            appointmentIterator(count+1, bookingList, callback)


                

           
        }
        

    }

    const bookingIterator = (count, bookingList, appointmentList, callback) => {
        if (bookingList.length == count){
            console.log("booking list iterator is done")
            console.log(appointmentList)
            callback(appointmentList)
        } else {
            console.log("IN BOOKING ITERATOR")
            var booking = bookingList[count]
            var appointmentId = booking.AppointmentId 
            console.log(appointmentId)
            getAppointment(appointmentId, (result)=> {
                console.log("GET APPOINTMENT UPCOMING BODY RESPONSE 2")
                console.log(result)

                if (result!=null){
                    var appointment = result.data[0]
                    console.log("CURRENT DATE FOR APPT 123")
                    console.log(moment().format("YYYY-MM-DD"))
                    if (moment(appointment.Date, "YYYY-MM-DD").isAfter(moment().format("YYYY-MM-DD"))){
                        var appointmentObj = {
                            appointment: appointment, 
                            status: booking.Status
                        }
                        appointmentList.push(appointmentObj)
                    } else if (appointment.Date==moment().format("YYYY-MM-DD")){
                        console.log("APPOINTMENT IS ON SAME DAY")
                        var currentTime = moment().format("h:mm a")
                        var startTime = appointment.StartTime 
                        if (moment(startTime, "h:mm a").isAfter(moment(currentTime, "h:mm a"))){
                            var appointmentObj = {
                                appointment: appointment, 
                                status: booking.Status
                            }
                            appointmentList.push(appointmentObj)
                        }
                    }
                    bookingIterator(count+1, bookingList, appointmentList,callback)

                } else {
                    Alert.alert("Network Error", "Unable to load appointments")

                }
            })

        }
    }

    const refreshPage_ = () => {
        console.log("THE REFRESH IN UPCOMING BOOKING")
        props.refreshPage()

    }




    // if (upcomingFetched==false){
    //     var currentDate = moment().format('YYYY-MM-DD')
    //     var currentTime = moment().format("h:mm A")
    //     getBookingsForClient(id, (result)=> {
    //         console.log("GET BOOKINGS FOR CLIENT RESPONSE 3")
    //         console.log(result)
    //         if (result!=null){
    //             var bookings = result.data 
    //             console.log("THE BOOKINGS 4")
    //             console.log(bookings)
    //             if (bookings.length>0){
    //                 bookingIterator(0, bookings, [], (result)=> {
    //                     console.log("BOOKING ITERATOR RESPONSE 3")
    //                     console.log(result)
    //                     appointmentIterator(0, result, (response)=> {
    //                         console.log("APPOINTMENT ITERATOR RESPONSE")
    //                         console.log(response)


    //                     })
    //                 }) 

    //             }

                
    //         } else {
    //             Alert.alert("Network Error", "Unable to load appointments")
    //         }
    //         setFetched(true)
    // })

    // }

    

    return (
        <View style={styles.container}>
            <ScrollView style={{
               
                height:'90%'
            }}>
            {dateList.map((date) => {
                return(
                    <View style={styles.dateView}>
                        <Text>{moment(date).format('ll')}</Text>
                        {dates[date].map((row)=> {
                            return (
                                <BookingRow rowObj={row} refresh={refreshPage_} cancelOption={false}/>

                            )
                        })}
                    </View>
                )
            })}
            </ScrollView>

        
          
        </View>
    )
    

}
const styles = StyleSheet.create({
    container: {
        marginLeft:20,
        marginRight:20,
        
        marginTop:20

    },
    date: {
        marginBottom:20,
        fontWeight: '500',
        fontSize:12
    },
    obj: {
        
    },
    dateView: {
        marginBottom: Dimensions.get('window').height*0.05
    }
})

export default CancelledBody