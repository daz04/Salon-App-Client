import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button ,ScrollView, TouchableOpacity, Alert } from 'react-native';
import {getAppointment} from '../../Database/functions'
import {getService} from '../../Database/functions'
import {getStylist, setBookingStatus} from '../../Database/functions'
import {getAddressFromCoords} from '../../Google/functions'
import {Ionicons} from 'react-native-vector-icons'
import { useFonts } from 'expo-font';
import moment from 'moment'

const BookingRow = (props) => {
    var booking = props.rowObj['Booking']
    var cancelOption = props.cancelOption
   
    var appointment = props.rowObj['Appointment']
    var appointmentDate = appointment.Date
    let [fontsLoaded] = useFonts({
        'Poppins-Regular': require("../../assets/fonts/Poppins-Regular.ttf"),
        'Poppins-Bold': require("../../assets/fonts/Poppins-Bold.ttf"),
        'Poppins-Black': require("../../assets/fonts/Poppins-Black.ttf"),
        "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf")
    });
  
    const [stylist, setStylist] = useState(null)
    const [stylistFetched, setstylistFetched] = useState(false)
    const [service, setService] = useState(null)
    const [serviceFetched, setserviceFetched] = useState(false)

    if (serviceFetched==false){
        setserviceFetched(true)
        getService(appointment.ServiceId, (result)=> {
            if (result!=null){
                setService(result.data[0])
            } else {
                Alert.alert("Network Error", "Network error occured")
            }
        })
    }

    if (stylistFetched==false){
        setstylistFetched(true)
        getStylist(appointment.StylistId, (result)=> {
            if (result!=null){
                setStylist(result.data[0])
            } else {
                Alert.alert("Network Error", "Network error occured")
            }
        })
    }

    const cancelAppointment = () => {
        setBookingStatus(booking.id, "Cancelled", (result)=> {
            if (result==null){
                Alert.alert("Network Error", "Failed to cancel booking due to network error")
            } else {
                Alert.alert("Successfully Cancelled Appointment")
                props.refresh()
            }
        })



    }
    const cancelAppointmentAlert = () => {
        Alert.alert(
            `Cancel appointment with ${stylist.FirstName} ${stylist.LastName}`,
            `Are you sure you want to cancel your appointment for ${service.Name} on ${moment(appointmentDate).format('LL')}?`,
            [
              {
                text: "Yes",
                onPress: () => cancelAppointment(),
                style: "cancel"
              },
              { text: "No", onPress: () => console.log("OK Pressed") }
            ]
          );

    }

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                {fontsLoaded &&
                <View style={styles.time}>
                    <Text style={{
                          fontWeight: "600", 
                          fontFamily: 'Poppins-Medium'
                    }}>{appointment.StartTime}</Text>
                    {/* <Text style={styles.locationText}> AT {bookingRow.address}</Text> */}

                </View>
                }
                {/* <View style={styles.stylistBox}>
                    {stylist!=null &&
                    <Text style={styles.stylistText}>{stylist.Name}</Text>
 }
                </View> */}
                {fontsLoaded &&
                <View style={styles.serviceBox}>
                    {service!=null &&
                    <Text style={{
                        color: '#1A2232',
                        fontSize:16,
                        fontWeight:'600',
                        fontFamily: 'Poppins-Regular'
                    }}>{service.Name}</Text>
                    }
                </View>
            }
           
            </View>
            <View style={styles.status}>
                {/* {fontsLoaded && 
                <View style={styles.statusBox}>
                    <Text style={{
                         color: "white",
                         fontWeight: '600',
                         fontSize:12,
                         padding:2,
                         alignSelf:'center',
                         fontsFamily: 'Poppins-Regular'
                    }}>{booking.Status}</Text> 

                </View>
                } */}
                {fontsLoaded &&
                <View style={styles.priceBox}>
                    {service!=null &&
                    <Text style={{
                        alignSelf: 'flex-end',
                        fontWeight: '400',
                        fontFamily: 'Poppins-Regular'
                    }}>${service.Price}</Text>
                    }
                </View>
                }
                {fontsLoaded && 
                <View style={styles.durationBox}>
                    {service!=null &&
                    <Text style={{
                        color: 'grey',
                        fontSize:12,
                        fontFamily: 'Poppins-Regular'
                    }}>{service.Duration} min</Text>
                    }
                    <Ionicons style={styles.icon} name={"time-outline"} size={12.5}/>

                </View>
                
            }
             {fontsLoaded && service!=null && cancelOption && 
                    <TouchableOpacity style={styles.cancelBox} onPress={() => cancelAppointmentAlert()}>
                           <Text style={{
                                color: "white",
                                fontWeight: '600',
                                fontSize:12,
                                padding:2,
                                alignSelf:'center',
                                fontFamily: 'Poppins-Regular'
       
                           }}>Cancel</Text> 
       
                   </TouchableOpacity>
               }

            </View>
           
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        
        width: '100%',
        height: Dimensions.get('window').height*0.06,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Dimensions.get('window').height*0.01,
        marginBottom: Dimensions.get('window').height*0.02
        
       
    },
    info: {
        
        flexDirection: 'column',
        marginBottom:10
    },
    status: {
        
        flexDirection: 'column'
    },
    time: {
       
        flexDirection: 'row',
        marginBottom:2.5
    },
    statusBox: {
        backgroundColor: 'limegreen',
        borderRadius:20,
        marginBottom:2.5

    },
    cancelBox: {
        backgroundColor: 'black',
        borderRadius:20,
        marginBottom:2.5,
        width:60,
        height:25,
        marginTop:2.5

    },
    statusText: {
        color: "white",
        fontWeight: '600',
        fontSize:12,
        padding:2,
        alignSelf:'flex-start'
    },
    timeText: {
        fontWeight: "600"
    },
    locationText: {
        fontWeight: '300'
    },
    stylistText: {
        fontWeight: '600',
        fontSize:18
    },
    serviceBox: {
        marginBottom: 2.5
    },
    stylistBox: {
        
        marginBottom:Dimensions.get('window').height*0.005
    },
    serviceText: {
        color: '#1A2232',
        fontSize:16,
        fontWeight:'600'
    },
    priceText: {
        alignSelf: 'flex-end',
        fontWeight: '400'
    },
    durationText: {
        color: 'grey',
        fontSize:12
      
    },
    durationBox: {
        
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    icon: {
       
        alignSelf: 'center',
        marginLeft: 5,
        color: 'grey'
    },
    priceBox: {
       
        marginBottom: 2.5
    }
    
})
export default BookingRow