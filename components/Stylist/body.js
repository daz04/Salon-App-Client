import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import {CheckBox} from 'react-native-elements'
import { call } from 'react-native-reanimated';
import {getServiceList} from '../../Database/functions'
import {Ionicons} from 'react-native-vector-icons'
import { useFonts } from 'expo-font';
import {apptFinishTime} from '../../Cart/functions'
import {generateStylistCoords} from '../../functions/database'
import {availabile} from "../../handlers/handlers"
import {apptAvailability} from '../../handlers/handlers'
const StylistBody = (props) => {
    var id = props.stylistId 

    var idsList = []
    for (var elem in props.services){
        idsList.push(props.services[elem].id)
    }
    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require('../../assets/fonts/Lato-Heavy.ttf'),
        'Lato-Regular': require('../../assets/fonts/Lato-Regular.ttf'),
        'Lato-Semibold': require('../../assets/fonts/Lato-Semibold.ttf')
            
        
    })

    const [services, setServices] = useState([])
    const [servicesFetched, setFetched] = useState(false)
    const [select, setSelect] = useState([])

    console.log("IN STYLIST BODY")
    console.log(props.services)
    if (servicesFetched==false){
        getServiceList(id, (result)=> {
            if (result!=null){
                var tempSelected = []
                for (var elem in result){
                    var serviceObj = result[elem]
                    console.log("A SERVICE OBJ")
                    console.log(serviceObj)
                    console.log("PROPS SERVICES")
                    console.log(props.services)
                    if (idsList.includes(serviceObj.id)){
                        console.log("IN PROPSS")
                        tempSelected.push(serviceObj.id)
                    }
                }
                setServices(result)
                setSelect(tempSelected)
            }
            setFetched(true)
        })
    }
    var servicesSent = props.services
    var category = props.category 
    var arrivalTime = props.arrivalTime
    var arrivalDate = props.arrivalDate
    var clientCoords = props.clientCoords
    
    // const initialList = []
    // for (var service in servicesSent){
    //     initialList.push(JSON.stringify(servicesSent[service]))

    // }
    
    const [isSelected, setIsSelected] = useState({})
    // const [totalDuration, setDuration] = useState(service.Duration)

    
   

    const updateService = (serviceObj) => {
        props.modifySelection(serviceObj)
    }
   
    
    // const editService = (serviceObj) => {
    //     var stylistId = serviceObj.StylistId
       
    //     if (select.includes(JSON.stringify(serviceObj))){
    //         var index = select.indexOf(JSON.stringify(serviceObj))
    //         select.splice(index,1)
    //         // isSelected[serviceObj['Id']] = false
    //         var obj = serviceObj['Id']
    //         var newDuration = totalDuration - serviceObj.Duration
    //         //store this in seperate variable it takes time to update totalDuration - async function
    //         setDuration(totalDuration=>newDuration)
    //         setIsSelected(isSelected=> ({...isSelected, obj: false}))
    //     } else {
    //         var stylistCoords = generateStylistCoords(stylistId)
           
    //         //new element adding to services we want
    //         var newDuration = totalDuration + serviceObj.Duration
    //         //store this in seperate variable it takes time to update totalDuration - async function
    //         setDuration(totalDuration=>newDuration)
    //         var failed = null
    //         var isAvailable = availabile(arrivalDate,arrivalTime,clientCoords, stylistId, newDuration, stylistCoords)
    //         if (isAvailable==true){
    //             var availableAgain = apptAvailability(arrivalDate, arrivalTime, stylistId, clientCoords, stylistCoords, newDuration)
    //             if (availableAgain==true){
    //                 select.push(JSON.stringify(serviceObj))
    //                 // isSelected[serviceObj['Id']] = true
    //                 var obj = serviceObj['Id']
    //                 setIsSelected(isSelected=> ({...isSelected, obj: true}))

    //             } else {
    //                 console.log("APPT AVAILABILITY RETURNED FALSE")
    //                 failed = true
    //             }
    //         } else {
    //             console.log("SCHEDUALE AVAILABILITY RETURNED FALSE")
    //             failed = true
    //         }
    //         if (failed==true){
    //             alert(`Service ${serviceObj.Name} can not be added to cart due to time confliction`)
    //         }
            
            
        
           

    //     }
    //     console.log("AFTER EDIT SERVICE FUNCTION")
    //     console.log(select)
    //     console.log(isSelected)
    //     updateService(serviceObj)
       

    // }
    const computePrice = (price) => {
        var taxes = 0.06*price
        var finalPrice = price + taxes
        console.log("FINAL PRICE")
        console.log(String(finalPrice).split(".")[1].length)
        if (String(finalPrice).split(".")[1].length>=2){
            finalPrice = String(finalPrice).split(".")[0] +"."+ String(finalPrice).split(".")[1].substring(0,2)
    
        } else {
            finalPrice = String(finalPrice) + '0'
        }
        return finalPrice
    }
    const submit = () => {
        props.submit()
        
    }
    var bookButton = <View style={styles.bookBox}>
    <TouchableOpacity style={styles.bookButton} onPress={()=>submit()}>
        <Text style={styles.bookText}>Book Now</Text>
    </TouchableOpacity>
    </View>
    

    
    


return (
    <View style={styles.container}>
      
        <ScrollView style={styles.scroll}> 
            {services.map((service)=> {
                console.log("RE-RENDERED 2")
                console.log(service)
                console.log(select)
                return (  
                <View style={styles.serviceRow}>
                    <View style={styles.row1}>
                    <TouchableOpacity style={styles.checkbox}>
                        <View style={{backgroundColor: select.includes(service.id)?'#1A2232':'transparent', display:select.includes(service.id)?'block':'none', width: 30,height:30,borderRadius: 20,}}> 
                        <Ionicons name='checkmark-outline' size={25} style={styles.check}></Ionicons>



                        </View>

                    </TouchableOpacity>
                    <View style={styles.innerRow}>
                        <Text style={styles.serviceName}>{service.Name}</Text>
                        <Text style={styles.descriptionText}>{service.Description}</Text>

                    </View>
                    </View>
                    <View style={styles.serviceTime}>
                        <View style={styles.time}>
                            <Text style={styles.duration}>{service.Duration} min</Text>
                            <Ionicons name="time-outline" style={styles.clock} size={15}/>

                        </View>
                        {/* <Text style={styles.price}>${computePrice(service.Price)}</Text> */}
                    </View>


                </View>
                )


            })
        }           

        </ScrollView>
        {bookButton}

    </View>
)
        }
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height:Dimensions.get('window').height,
       

    },
    scroll: {
        width: '100%',
        height:'100%'
    },
    serviceRow: {
        width:'100%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding:20,
        
    },
    checkbox: {
        width: 30,
        height:30,
        borderRadius: 20,
        borderWidth:0.5,
        borderColor: "#1A2232",
        marginRight:10,
    
    },
    check: {
        color: 'white',
        alignSelf: 'center'
    },
    serviceName: {
        color: "#1A2232",
        fontSize:18,
        
        fontFamily: 'Lato-Heavy'
    },
    descriptionText: {
        fontWeight:'300',
        fontSize:14,
        color: '#1A2232',
        marginTop:2.5

    },
    serviceTime: {
      
        
    },
    row1: {
        flexDirection: 'row'
    },
    time: {
        flexDirection: 'row',
       
    },
    price: {
        alignSelf: 'flex-end',
        color: "#1A2232",
        marginTop:2.5
    },
    duration: {
        marginRight:5,
        fontSize:11,
        fontWeight: '300',
        color: "#1A2232",
        alignSelf: 'center'
    },
    clock: {
        color: "#1A2232"
    },
    bookButton: {
        width: '100%',
        height:180,
        
    
        backgroundColor: "#1A2232",
        flexDirection: 'row',
        justifyContent: 'center',
        
    },
    bookText: {
        color: "white",
        paddingTop: 12,
        fontWeight: '600',
        fontFamily: 'Lato-Heavy'
    },
    bookBox: {
       
        position: 'absolute',
        bottom:120,
        flexDirection: 'row',
        
    }

})
export default StylistBody