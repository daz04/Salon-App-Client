import React, {useState} from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import TopBar from '../components/ServiceCardComps/TopBar';

import Svg, {SvgXml} from 'react-native-svg'
import {SvgUri} from 'react-native-svg'
import Clock from '../assets/Icons/Clock.svg'
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import Checkout from '../Checkout/checkout'
import {authenticated} from '../Middlewear/authenticated'
import {computeTravelDistance, getStylist, getStylistAppointmentbyDate} from '../Database/functions'
import moment from "moment"
import axios from 'axios'
import {useFonts} from 'expo-font'
import Spinner from 'react-native-loading-spinner-overlay'


// import { TouchableOpacity } from 'react-native-gesture-handler';



const StylistServiceCard = (props) => {
    console.log("BACK AT STYLIST SERVICE CARD")
    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require("../assets/fonts/Lato-Heavy.ttf"),
        'Lato-Medium': require("../assets/fonts/Lato-Medium.ttf"),
        'Lato-Regular': require("../assets/fonts/Lato-Regular.ttf"),
        'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
        'Lato-Semibold': require('../assets/fonts/Lato-Semibold.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf')
     });
    
    var selectedInterval = null

    console.log("STYLIST SERVICE CARD PROPS 456")
    console.log(props)
    var bookingFee = props.bookingFee
    var serviceObj = props.service 
    var serviceProps = props.service['service']
    var availability = props.service['availability']
    var stylistId = serviceProps['StylistId']
    var arrivalDate = props.arrivalDate
    var arrivalTime = props.arrivalTime
    const [totalServicePrice, setTotalServicePrice] = useState(null)
    const [travelCost, setTravelCost] = useState(null)
    const [taxesCost, setTaxesCost] = useState(null)
    const [interval, setinterval] = useState(null)
    const [stylistObj, setStylist] = useState(null)
    const [stylistFetched, setFetched] = useState(false)
    const [times, setTimes] = useState([])
    const [timesFetched, setTimeFetched] = useState(false)
    const [serviceImage, setImage] = useState(null)
    const [imageFetched, setimageFetched] = useState(false)
    const [service, setService] = useState(serviceProps)
    const [serviceImgSpinner, setServiceSpinner] = useState(true)


    const computeTravelCost = (travelDistance) => {
        setTravelCost((1*travelDistance.toFixed(2)))
        return 1*travelDistance
       
    }    
    const computeTotalServicePrice = () => {
        console.log("BOOKING FEE HERE")
        console.log(bookingFee)
        var originalPrice = service.Price 
        console.log("THE ORIGINAL PRICE PRINTED")
        console.log(originalPrice)
        var taxes = 0.06 * Number(originalPrice)
        setTaxesCost(taxes.toFixed(2))
        console.log("THE TAXES")
        console.log(taxes)
        console.log("THE SERVICE PROPS")
        console.log(serviceObj.travelDistance)
        var travelDistance = computeTravelCost(serviceObj.travelDistance)
        console.log("THE TRAVEL DISTANCE COST")
        console.log(travelDistance)
        var total = Number(originalPrice) + taxes + travelDistance + bookingFee
        total = total.toFixed(2)
        return total

    
        


    }
    if (service==null){
        setService(serviceProps)
    }
    if (service!=null && totalServicePrice==null){
        console.log("IN COMPUTE TOTAL PRICE")
        //compute total service price to render to client that takes into account:
        //the orignal price of the service
        //travel miles from client to customer and multiple with $ per mile as stored in database
        //computed taxes
        //add in $5 booking fee at the very end
        var theTotal = computeTotalServicePrice()
        setTotalServicePrice(theTotal)


    }
    if (service!=null && service!=serviceProps){
        console.log("THE SERVICE IS DIFFERENT THAN SERVICE PROPS")
        setImage(null)
        setimageFetched(false)
       
        setService(serviceProps)
        

    }

    var timeIntervals = {'Early':'6:00 AM-9:00 AM', 'Morning':'9:00 AM-12:00 PM', 'Noon':'12:00 PM-2:00 PM', 'Afternoon':'2:00 PM-5:00 PM','Evening':'5:00 PM-8:00 PM','Night':'8:00 PM-11:00 PM'}
    
    // let [fontsLoaded] = useFonts({
    //     'Lato-Heavy': require('../assets/fonts/Lato-Heavy.ttf'),
    //     'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    //     'Lato-Semibold': require('../assets/fonts/Lato-Semibold.ttf')
            
        
    // })

    console.log("THE TIME OUT HERE 123")
    console.log(times)
    console.log(stylistObj)
    console.log("IN STYLIST SERVICE CARD THE IMAGE FETCHED")
    console.log(imageFetched)



    

    if (times.length==0){
        console.log("TIMES LENGTH IS NULL 2")
        console.log(props.service.timeSlots)
        setTimes(props.service.timeSlots)
    }
   
  

  

    const taxes = (price) =>{
        var taxes = 0.06*price
        return taxes
    }


    const computeFinalPrice = () => {
        var subscription = stylistObj.Subscription
        var comission = 0
        if (subscription=="Free" || subscription==null){
            comission = 0.3

        } else if (subscription=="Plus"){
            comission = 0.25

        } else if (subscription=="Pro"){
            comisison = 0.2

        }
        var price = parseFloat(service.Price) + comission * parseFloat(service.Price)
        var taxes_ = taxes(price)
        price += taxes_
        var priceStr = String(price)
        if (priceStr.split(".")[1]==null){
            priceStr += ".00"
        } else if (priceStr.split(".")[1]!=null && priceStr.split(".")[1].length==1){
            priceStr +="0"
        }
        return priceStr
        
    }

    const computeAvailabilitySlots = (availability) => {
        console.log("IN COMPUTE AVAILABILITY SLOTS")
        var timeSlots = []
        var duration = service.Duration
        var timeRange = timeIntervals[availability]
        var startTime = timeRange.split("-")[0]
        var endTime = timeRange.split("-")[1]
        getStylistAppointmentbyDate(stylistId, arrivalDate, (result)=> {
            console.log("IN GET STYLIST APPOINTMENT BY DATE IN SLOTS 2")
            console.log(result)
            if (result!=null && result.data.length==0){
                var indexTime = startTime 
                console.log("THE RESULTTTT")
                while (moment(startTime, 'h:mm a').isBefore(moment(endTime,'h:mm a'))){
                    console.log("THE INDEX TIME IN THE TIME SLOTS")
                    timeSlots.push(indexTime)
                    var newTime = moment(indexTime, "h:mm a").add(duration,'minutes')
                    indexTime = newTime.format("HH:mm a")

                }
                setTimes(timeSlots)


            } else {
                setTimes([])
            }


        })
        




    }

    const computeTimes = () => {
        console.log("iN COMPUTE TIMES FUNCTION")
        computeAvailabilitySlots(arrivalTime)
        // for (var interval in availability){
        //     console.log("IN COMPUTE TIMES 2")
        //     console.log(availability)
            

        //     //go over availability 

            


            
        //     var newStr = availability[interval].slice(0,-2)
        //     var startTime = newStr.split("-")[0]
        //     var startHour = null 
        //     var startMin = null 
        //     if (startTime.includes(":")){
        //         startMin = startTime.split(":")[1]
        //         startHour = startTime.split(":")[0]
        //     } else {
        //         startHour = startTime
        //         startMin = "00"
        //     }
        //     var endTime = newStr.split("-")[1]
        //     var difference = moment(endTime, 'HH:mm').subtract({hours: parseInt(startHour), minutes: parseInt(startMin)}).format('HH:mm')
        //     console.log("THE DIFFRENCE")
        //     console.log(difference)
        //     var durHour = difference.split(":")[0]
        //     var durMin = difference.split(":")[1]
        //     var totalDur = parseInt(durHour)*60 + parseInt(durMin)
        //     var numofSlots = parseInt(totalDur/parseInt(service.Duration))
        //     // //num of appointments available
        //     console.log("NUMBER OF SLOTS")
        //     console.log(numofSlots)
        //     var tempTimes = []
        //     var i = 0
            
        //     while (i<numofSlots){
        //         var min = (i+1)*parseInt(service.Duration)
        //         console.log("THE MIN")
        //         console.log(min)
        //         var newTime = moment(startTime, "HH:mm").add({minutes: (i+1)*parseInt(service.Duration)}).format("HH:mm")
        //         tempTimes.push(newTime)
        //          i+=1
        //      }
        //     setTimes(tempTimes)
            
        // }
        setTimeFetched(true)
    }

    // if (timesFetched==false){
    //     computeTimes()
    // }

    console.log("IN STYLIST SERVICE CARD")
    console.log(service)
    if (stylistFetched == false){
        getStylist(stylistId, (result)=> {
            console.log("RESULT IN GET STYLIST")
            console.log(stylistId)
            console.log(result)
            if (result!=null){
                setStylist(result.data[0])

            }
            
        })
        setFetched(true)
        
        
    }
    console.log("STYLIST OBJ HERE")
    console.log(stylistObj)
    var theimages = []
    var price = null 
    console.log("SERVICE PRICE")
    console.log(service.Price)
    var finalPrice = Number(service.Price) + taxes(Number(service.Price))
    console.log("FINAL PRICE BEFORE SUBSTRING")
    console.log(finalPrice)
    if (finalPrice.length>5){
        finalPrice = String(finalPrice).substring(0,5)

    }
    if (String(finalPrice).includes(".")){
        if (String(finalPrice).split(".")[1].length==1){
        
            price = finalPrice+'0' 
        } else {
            price = finalPrice
        }

    }
   
    
    const Item = ({title}) => (
        


        <Image style={styles.media} source={{uri:title}}  >
            </Image>

    )
    const renderItem = ({item}) => (
       
        <Item style={styles.item} title={item.title}></Item>
    )
    const redirect = () => {
        
        //var isAuth = authenticated()
       
        console.log("SERVICE ID 3")
        console.log(service)
        console.log(interval)
        props.setSelection(service,stylistObj,interval, taxesCost, travelCost, totalServicePrice)
        
        // const {navigate} = props.navigation
        // navigate('Checkout',{
        //     category:"BRAIDING",
        //     gender:"F",
        //     clientCoords:[26.2712,80.2706],
        //     arrivalDate:"2021-04-04",
        //     arrivalTime:"12:00 PM"
        // })
        

    }

    const fetchPic = () => {
        console.log("WE ARE IN FETCH SERVICE PIC 12345")
        console.log(service)
        console.log(serviceProps.MainImage)
        if (serviceProps.id!=null && serviceProps.MainImage!=null){
        try {
            console.log("IN TRY STATEMENT 2")
            console.log(service.id)
            console.log(service.MainImage)
            axios.get(`http://nodes3-env.eba-cmt4ijfe.us-east-1.elasticbeanstalk.com/serviceImage?serviceId=${service.id}&photoName=${service.MainImage}`).then(response=> {
                //axios.get(`http://localhost:6000/serviceImage?serviceId=${service.id}&photoName=${service.MainImage}`).then(response=> {
                console.log("FETCH STYLIST PIC RESPONSE 2")
                console.log(response)
                setImage(response.data.url)
                setServiceSpinner(false)
            }).catch(err=> {
                console.log("FETCH STYLIST PIC ERROR")
                console.log(err)
            })
            // setLoading(true)

        } catch (e) {
            console.log(e)

        }
       
        
    }
    setimageFetched(true)
        
    }

    if (imageFetched==false){
        fetchPic()
    }

    const getServiceMedia = (serviceImg) =>{
        // var url = null
        // if (service.MainImage!=null){
        //     fetchPic()
        //     //url = `https://service-media.s3.amazonaws.com/${service.id}/${service.MainImage}.jpeg`
        // }
        var data = []
        var count = 0
        var images = []
              
            
        var newImg = 
        <View style={{
            height:350,
            width:'100%',
            marginTop:0,
            paddingTop:0,
           
        }}>
        <Image style={styles.media} source={{uri:serviceImg}}>
        {/* <LinearGradient
    colors={['transparent','#1A2232']}
    style={styles.LinearGradient}>
        <View style={styles.linearView}>
        <View style={{alignSelf:'flex-end', marginTop:'60%'}}>
        <View style={styles.priceText}>
            {stylistObj!=null && <Text style={styles.price}>${computeFinalPrice()}</Text>
            }
                
        </View>
        </View>
        
        </View>
    </LinearGradient> */}

        </Image>
        </View>
        // images.push(newImg)
        data.push(newImg)
                
         

        
        // console.log("IMAGES IMAGES")
        // console.log(images)
        var imageList = <FlatList  horizontal={true} style={styles.flatlist} data={data} renderItem={renderItem} keyExtractor={image => image.id} showsHorizontalScrollIndicator={true} />
        console.log("THE IMAGE LIST")
        console.log(imageList)
        return newImg

    
    }
    // var serviceImages = getServiceMedia()
    const clock = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<path d="M284.28,242.29c0.54-1.63,1.12-3.25,1.62-4.89c0.53-1.71,1.46-2.95,3.41-2.41c1.99,0.55,2.13,2.14,1.59,3.83
   c-1.33,4.21-2.69,8.41-4.06,12.61c-0.64,1.96-2.03,2.66-3.91,1.83c-4.19-1.85-8.33-3.8-12.48-5.75c-1.48-0.69-2.19-1.87-1.51-3.46
   c0.75-1.74,2.18-1.91,3.76-1.23c1.97,0.85,3.9,1.76,6.45,2.93c-0.51-1.49-0.76-2.41-1.13-3.28c-6.15-14.76-23.16-21.81-37.84-15.7
   c-14.82,6.17-21.87,22.99-15.84,37.79c6.04,14.83,22.87,21.99,37.7,16.05c0.08-0.03,0.15-0.06,0.23-0.09c2.97-1.21,4.56-1,5.09,0.8
   c0.76,2.61-1.27,3.28-3.06,4.02c-17.28,7.16-37.38-1.08-44.64-18.29c-7.39-17.51,0.76-37.58,18.28-45.03
   c17.24-7.33,37.28,0.71,44.74,17.95c0.33,0.76,0.66,1.51,1,2.26C283.88,242.25,284.08,242.27,284.28,242.29z"/>
<path d="M248.35,244.58c0-2.83,0.01-5.65,0-8.48c-0.01-1.93,0.79-3.35,2.82-3.39c2.19-0.05,3.01,1.43,3.01,3.46
   c0,4.74-0.08,9.48,0.07,14.22c0.03,1.09,0.65,2.35,1.39,3.19c1.48,1.67,3.23,3.11,4.88,4.63c1.49,1.38,2.04,2.97,0.51,4.55
   c-1.52,1.56-3.14,1.06-4.6-0.32c-2.18-2.06-4.48-3.98-6.52-6.17c-0.81-0.87-1.39-2.26-1.49-3.46
   C248.21,250.08,248.35,247.33,248.35,244.58z"/>
</svg>
`
   
    // console.log("servive images")
    // console.log(serviceImages)
    // theimages = getServiceMedia()
    var continueButton = null
    const setTimeInterval = (time) => {
        selectedInterval = time
        console.log("TIME INTERVAL")
        
        setinterval(interval=>time)
        

    }
    if (interval!=null && fontsLoaded){
        continueButton = <View style={styles.checkoutFrame}><TouchableOpacity style={styles.checkoutBox} onPress={()=>redirect()}><Text style={{
            color: 'white',
            padding:10,
            alignSelf: 'flex-start',
            fontFamily: 'Poppins-Regular'
        }}>Checkout</Text></TouchableOpacity></View>
    }
    var stylistFullName = "" 
    var profilePicUrl = ""
    if (stylistObj!=null){
        stylistFullName = stylistObj.FirstName + " "+stylistObj.LastName 
        profilePicUrl = stylistObj.ProfilePicURL
    }

    console.log("THE SERVICE IMAGE")
    console.log(serviceImage)
    
    
    
   

    return (
        <View style={styles.container}>
            {stylistObj!=null &&  <TopBar stylistName={stylistFullName} stylist={stylistObj}/>}
           
            {/* <View style={styles.imageContainer}> */}
                {/* <Spinner 
                visible={serviceImgSpinner}
                /> */}
                {/* {getServiceMedia()} */}
                
                {serviceImage!=null && getServiceMedia(serviceImage)}
                {/* {serviceImage!=null && <Image style={{height:'100%', width:'100%'}} source={{uri:serviceImage}}/>} */}
            {/* </View>  */}
           
         
            <View style={styles.description}>
                <View style={styles.serviceTitle}>
                    {fontsLoaded &&
                    <Text style={{
                        fontFamily: 'Poppins-Medium',
                        fontSize: 22,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        maxWidth: '70%',
                        color: '#1A2232'
                    }}>{service.Name}</Text>
                  }
                    {totalServicePrice!=null && fontsLoaded && <Text style={{
                         fontSize:20,
                         flexDirection: 'column',
                         color: "#1A2232",
                         fontFamily: "Poppins-Medium",
                         alignSelf: 'flex-end',
                         color: '#1A2232'
                    }}>${totalServicePrice}</Text>}
                   
                </View>
                <View style={styles.serviceDuration}>

                    {fontsLoaded &&
                        <Text style={{
                             color: '#1A2232',
                             fontFamily: 'Poppins-Regular',
                             fontSize:12,
                             
                        }}>{service.Duration} min</Text>
                    }     
                        <Ionicons name='time-outline' style={styles.icon}/>
                </View>
                {fontsLoaded && 
                <Text style={{
                    paddingTop: Dimensions.get('window').height*0.01,
                    paddingBottom: Dimensions.get('window').height*0.005,
                    fontFamily: 'Poppins-Regular'
                }}>
                    {service.Description}
                </Text>
                }
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: 'auto',
                    flexWrap: 'wrap',
                    marginTop:10,
                    marginBottom:20,
                }}>
                {times.map((time) => {
                    return (
                        <View style={{marginRight:'2%'}}>
                        <TouchableOpacity onPress={()=>setTimeInterval(time)}>
                            <View style={{borderWidth: 1,padding:5,marginRight:Dimensions.get('window').width*0.0,borderColor: '#1A2232',borderRadius:20, backgroundColor: time==interval?"#1A2232":"transparent", width:'100%'}}>
                                <Text style={{fontSize:13, color: time==interval?"white": "#1A2232", fontFamily:  'Poppins-Regular'}}>{time}</Text>
                            </View>
                        </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
                {continueButton}
            </View>
            
            {/* <SliderBox images={theimages}/> */}
            
            

        </View>

    )


}

const styles = StyleSheet.create({
    container: {
        // width: '100%',
        // height: 500,
        // height: Dimensions.get('window').height/3,
        flexDirection: "column",
        marginBottom: '10%'
    },
    media: {
        width:'100%',
        height:'100%',
        
        alignSelf: "center",
        maxWidth: '100%'

    },
    flatlist: {
        margin:0,
        padding:0,
        height:300,
        width:Dimensions.get('window').width
    },
    imgView:{
        height:350,
        width:'100%',
        marginTop:0,
        paddingTop:0,
        marginBottom:10

    },
    imageContainer: {
        width:'100%',
        height:'auto'
       

    },
    // serviceNameText: {
    //     fontFamily: 'Poppins-Medium',
    //     fontSize: 22,
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //     maxWidth: '70%'

    // },
    linearView: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    serviceTitle: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginRight:Dimensions.get('window').width*0.02,
      
    },
    serviceDescription: {
        paddingTop: Dimensions.get('window').height*0.01,
        paddingBottom: Dimensions.get('window').height*0.005
    },
    description: {
        marginTop: Dimensions.get('window').height<800?10:10,
        marginLeft: Dimensions.get('window').height*0.02
    },
    serviceDuration: {
        flexDirection: 'row',
        justifyContent: "flex-start",
        paddingTop: Dimensions.get('window').height*0.01
       
       
    },
    // durationtext: {
    //     color: '#1A2232',
    //     fontFamily: 'Lato-Regular',
    //     fontSize:12
    // },
    priceText:{
        flexDirection: "column",
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight:30
        // display: 'flex',
        // flexDirection: "column",
        // justifyContent: 'flex-end',
        // alignItems: 'flex-end',
       
       
        // // flexDirection: 'row',
        // width: '100%',
        // marginRight:30,
        // fontFamily: 'Lato-Regular',
        // paddingTop:20,
        // fontSize:22
    },
    // price: {
    //     fontSize:22,
    //     flexDirection: 'column',
    //     color: "#1A2232",
    //     fontFamily: "Lato-Heavy",
    //     alignSelf: 'flex-end',
        
        
    // },
    icon: {
    //    width:30,
    //    height:30,
       marginLeft:5,
       paddingTop:2
    //    alignSelf:"center"
    },
    linearGradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        flex:1,
    },
    LinearGradient: {
        width:'100%',
        height:'100%'
    },
    title: {
        color: "white",
        fontWeight: "600",
        margin: 20,
        // fontFamily: "LatoSemiBold" 
        

    },
    timeRow: {
        flexDirection: 'row',
        width: '100%',
        height: 30,
        flexWrap: 'wrap',
        marginTop:10,
        marginBottom:20,
        
        
    },
    timeText: {
        fontSize:13
       
    },
    timeBox: {
        borderWidth: 1,
        padding:5,
        borderColor: '#1A2232',
        borderRadius:20,
        flexDirection: 'row'
    },
    checkoutBox: {
        backgroundColor: '#1A2232',
        borderRadius: 10

    },
    checkoutText: {
        color: 'white',
        padding:10,
        alignSelf: 'flex-start'
    },
    checkoutFrame: {
       
        width:'100%',
        height: 40,
        paddingRight:20,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }

})

export default StylistServiceCard