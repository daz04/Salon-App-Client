import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, Alert} from 'react-native';
import AppointmentHeader from '../Headers/appointments'
import AppointmentNavigator from '../components/Appointment/navigator'
import UpcomingBody from '../components/Appointment/upcomingBody'
import PendingBody from '../components/Appointment/pendingBody'
import HistoryBody from '../components/Appointment/historyBody'
import CancelledBody from '../components/Appointment/cancelledBody'
import MenuBar from '../components/MenuBar'
import { call } from 'react-native-reanimated';
import { Menu } from 'react-native-paper';
import {getAppointment, getAppointmentList, getBookingsForClient} from '../Database/functions'
import {getClientId} from '../LocalStorage/functions'


const AppointmentOverview = (props) => {
    
    const [clientId, setclientId] = useState(null)
    const [body,setBody] = useState(null)
    const [bodySet, setBodySet] = useState(false)
    const [type, setType] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [bookings, setBookings] = useState([])
    const [appointmentsFetched, setappointmentsFetched] = useState(false)
    const [bookingsFetched, setbookingsFetched] = useState(false)


    console.log("IN APPOINTMENT OVERVIEW RELOAD")
    console.log(type)

    if (clientId==null){
        getClientId((result)=> {
            setclientId(result)
        })
    }

    if (type==null){
        if (props.navigation.state.params!=null &&  props.navigation.state.params.category!=null){
            setType(props.navigation.state.params.category)
        }else {
            setType('Upcoming')
        }
    }
    if (appointmentsFetched==false){
        setappointmentsFetched(true)
        getAppointmentList((result)=> {
            if (result!=null){
                setAppointments(result.data)
                
            } else {
                Alert.alert("Network Error", "Network error occured")
            }
            
        })

    }
    if (bookingsFetched==false && clientId!=null){
        setbookingsFetched(true)
        getBookingsForClient(clientId, (result)=> {
            if (result!=null){
                setBookings(result.data)
            } else {
                Alert.alert("Network Error", "Network error occured")

            }
        })

    }

    const refresh = () => {
        setappointmentsFetched(false)
        setbookingsFetched(false)
    }

    if (appointments.length>0 && bookings.length>0 && bodySet==false){
        console.log("ABOUT TO SET BODY")
        setBodySet(true)
        setBody(<UpcomingBody appointments={appointments} bookings={bookings} refreshPage={refresh}/>)
    }



    
    const callback = (screen_) => {
        console.log("IN THE CALLBACK SCREEN 456")
        console.log(screen_)
        
        if (screen_=="history"){
            setBody(body=> <HistoryBody appointments={appointments} bookings={bookings}/>)
            setType(type=>"History")
        } 
        else if (screen_=="upcoming"){
            console.log("IN THE MOTEHRFUCKING UPCOMING FUCK")
            setBody(null)
            setBody(body=><UpcomingBody appointments={appointments} bookings={bookings} refreshPage={refresh}/>)
            setType(type=>"Upcoming")
        } 
        else if (screen_=="pending"){
            console.log("ABOUT TO GO TO PENDING SCREEN")
            setBody(body=><PendingBody appointments={appointments} bookings={bookings} refreshPage={refresh}/>)
            setType(type=>"Pending")

        } 
        else if (screen_=="cancelled"){
            setBody(body=><CancelledBody appointments={appointments} bookings={bookings} refreshPage={refresh}/>)
            setType(type=>"Cancelled")

        }

        

    }
    const forward = (screen) => {
        const {navigate} = props.navigation 
        if (screen=="PROFILE"){
            
            navigate("Profile")
        } else if (screen=="SEARCH"){
            navigate("Select Service", {
                inApp: true
            })

        } else if (screen=="HOME"){
       
            navigate("Landing")
           
        }

    }
    return (
        <View style={styles.container}>
            <AppointmentHeader/>
            <AppointmentNavigator callback={callback} selected={type}/>
            <View style={styles.body}>

           
            {body}
            </View>
            <MenuBar style={styles.bottom} screen={'BOOKINGS'} callback={forward}/>
            {/* <View style={styles.bottom}>
            
            </View> */}




        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: "column",
        backgroundColor: '#f2f2f2'
    },
    body: {
        height:Dimensions.get('window').height*0.85
    },
    bottom: {
        // flex:1,
        // justifyContent: 'flex-end',
    //    flexDirection: 'column',
    //    justifyContent: "flex-end",
    //    alignItems: 'flex-end',
      
    },
   
})
export default AppointmentOverview