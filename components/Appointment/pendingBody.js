import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button ,ScrollView, TouchableOpacity } from 'react-native';
import BookingRow from '../Bookings/bookingRow'
import {getCurrentEmail} from '../../Enviornmental/functions'
import {getUpcomingPending} from '../../Database/functions'
import {getAppointment} from '../../Database/functions'
import moment from 'moment';
const PendingBody = (props) => {
    const [email, setEmail] = useState(null)

    const getEmail = async () => {
        console.log("get email")
        var email_ = await getCurrentEmail()
        console.log("first")
        console.log(email_)
        setEmail(email=>email_)

    }
    getEmail()
    
    var upcomingPending = []
    var bookingsElem = {}
    var dateElems = []
    console.log("the email")
    console.log(email)
    if (email!=null){
        console.log("email")
        upcomingPending = getUpcomingPending(email)
    
        //returns list of future and confirmed booking objects
        if (upcomingPending.length>0){
            //means there are elements here
            for (var booking in upcomingPending){
                var appointmentId = upcomingPending[booking].AppointmentId
                var appointment = getAppointment(appointmentId)
                console.log("appointment")
                console.log(appointment)
                if (appointment.Date in bookingsElem){
                    var dateList = bookingsElem[appointment.Date]
                    var bookingElem = <BookingRow booking={upcomingPending[booking]} cancelOption={true}/>
                    dateList.push(bookingElem)
                    bookingElem[appointment.Date] = dateList

                } else {
                    var dateList = []
                    var bookingElem = <BookingRow booking={upcomingPending[booking]} cancelOption={true}/>
                    dateList.push(bookingElem)
                    bookingsElem[appointment.Date] = dateList

                }
                console.log("BOOKINGS ELEM")
                console.log(bookingsElem[appointment.Date])
                var date = appointment.Date 
                if (date == moment().format("YYYY-MM-DD")) {
                    date = "TODAY"
                } else {
                    date = moment(date).format('LL').toUpperCase()
                }
                var dateElem = <View style={styles.obj}>
                    <Text style={styles.date}>{date}</Text>
                    {bookingsElem[appointment.Date]}
                </View>
                dateElems.push(dateElem)

            }
        }


        //user is signed in

    }
    return (
        <View style={styles.container}>
        
            {dateElems}
        </View>
    )
    

}
const styles = StyleSheet.create({
    container: {
        marginLeft:20,
        marginRight:20,
        backgroundColor: '#f9fafc',
        marginTop:20

    },
    date: {
        marginBottom:20,
        fontWeight: '500',
        fontSize:12
    },
    obj: {
        backgroundColor: '#f9fafc'
    }
})

export default PendingBody