import React, { useState } from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { Systrace } from 'react-native';
import * as Font from 'expo-font';
import axios from 'axios'
import {getStylist} from '../Database/functions'
import StylistServiceCard from '../components/stylistServiceCard'

// const Images = [
//     {"gender":"Female","category":"Natural Hair","link":require("../assets/Female/Natural Hair/main.jpeg")},
//     {"gender":"Female","category":"Braiding","link":require("../assets/Female/Braiding/main.jpg")},
//     {"gender":"Female","category":"Hair Cut","link":require("../assets/Female/Hair Cut/main.jpeg")},
//     {"gender":"Female","category":"Hair Installation","link":require("../assets/Female/Hair Installation/main.jpg")},
//     {"gender":"Female","category":"Hair Removal","link":require("../assets/Female/Hair Removal/main.jpg")},
//     {"gender":"Female","category":"Makeup","link":require("../assets/Female/Makeup/main.jpg")},
//     {"gender":"Female","category":"Nails","link":require("../assets/Female/Nails/main.jpg")},
//     {"gender":"Female","category":"Lashes","link":require("../assets/Female/Lashes/main.jpg")},
//     {"gender":"Female","category":"Brows","link":require("../assets/Female/Brows/main.jpg")}

// ]
// const customFonts = {
//     LatoRegular: require('../assets/fonts/Lato-Regular.ttf'),
//     LatoSemiBold: require('../assets/fonts/Lato-Semibold.ttf'),
//     LatoBold: require('../assets/fonts/Lato-Heavy.ttf')
// }
const BodyScroll = (props) => {
    console.log("IN BODY SCROLL")
   
    var services = props.services
    console.log("THE SERVICE LIST")
    console.log(services)

    const [serviceImages, setImages] = useState({})
    const [serviceStylists, setStylists] = useState({})
    const [stylistsprofile, setStylistsProfile] = useState({})
    const [cards, setCards] = useState([])
    const [servicesFetched, setFetched] = useState([])
   
   
    const fetchServiceImages = (serviceId, imgName, callback) => {
        console.log("IN FETCH SERVICE IMAGES")
        console.log(serviceId)
        console.log(imgName)
        axios.get(`http://nodes3-env.eba-cmt4ijfe.us-east-1.elasticbeanstalk.com/serviceUrl?serviceId=${serviceId}&imgName=${imgName}`).then(response=> {
            console.log("IN FETCHED SERVIVE IMAGES")
            console.log(response)
            if (response!=null){
                console.log("FETCH SERVICE IMAGES IS NOT NULL")
                serviceImages[serviceId] = response.data.url 
                //setImages(serviceImages)
                callback(response.data.url)
              


            }else {
                callback(null)

            }
           
            

        })



    }
    const fetchStylistObject = (serviceId, stylistId,callback) => {
        console.log("IN FETCH STYLIST OBJECT")
        console.log(stylistId)
        getStylist(stylistId, (result)=> {
            console.log(result)
            if (result!=null){
                serviceStylists[serviceId] = result.data[0]
                //setStylists(serviceStylists)
                callback(result.data[0])
               
            }
            callback(null)
        })


    }
    const fetchStylistProfilePic = (stylistId,callback)=> {
        axios.get(`http://nodes3-env.eba-cmt4ijfe.us-east-1.elasticbeanstalk.com/profilePicUrl?stylistId=${stylistId}`).then(response=> {
            if (response!=null){
                stylistsprofile[stylistId] = response.data.url 
                //setStylistsProfile(stylistsprofile)
                callback(response.data.url)
               


            }
            callback(null)

        })

    }
    const stylistCardHandler = (selectedService, selectedTime) => {
        props.setSelect(selectedService, selectedTime)
    }

    const iterator = (count) => {
        console.log("in body scroll iterator")
        if (count==services.length){
            var newList = servicesFetched
            for (var service in services){
                newList.push(services[service])

            }
            
            setFetched(newList)
        } else {
            console.log("not in end case")
            var service = services[count]
            var mainImage = service.MainImage
            var stylistId = service.StylistId 
            console.log("STYLIST ID")
            console.log(stylistId)
            var id = service.id
            fetchServiceImages(id, mainImage, (result)=> {
                if (result!=null){
                    console.log("IN SUCCESSFULLY FETCHED SERVICE IMAGES")
                    var serviceImageUrl = result
                    console.log(serviceImageUrl)
                    fetchStylistObject(id, stylistId, (result)=> {
                       
                        if (result!=null){
                            console.log("IN SUCCESSFULLY FETCHED STYLIST OBJECT")
                            var stylistObject = result
                            fetchStylistProfilePic(stylistId, (result)=> {
                                if (result!=null){
                                    console.log("ABOUT TO SET A NEW CARD")
                                    // setCards(cards=> ([...cards, <View style={styles.card}>
                                    //     <ImageBackground style={styles.cardImg} source={{uri:serviceImageUrl}} >
                                    //     <LinearGradient
                                    //     colors={['transparent','#1A2232']}
                                    //     style={styles.LinearGradient}>
                                    //         <View style={styles.linearView}>
                                    //         <Text style={styles.title}>{service.Name}</Text></View>
                                    //     </LinearGradient>
                                
                                        
                                    //     </ImageBackground>
                                        
                                    //     <Text style={styles.cardText}>{category}</Text>
                                
                                    // </View>]))
                                    setCards(cards=> ([...cards, 
                                        <StylistServiceCard serviceObj={services[count]} stylistObj={stylistObject} setSelection={stylistCardHandler} />]))
                                }
                            })

                        }
                    })

                }
            })
            
            
            var newCount = count +1
            iterator(newCount)
        }
    }

    for (var service in services){
        if (!servicesFetched.includes(services[service])){
            iterator(0)
        }
    }
    // if (servicesFetched==false){
    //     console.log("services fetched is false")
    //     iterator(0)

    // }
    // iterator(0)

    var serviceCards = null 

    serviceCards = services.map((service)=> {

        return (
            <View style={styles.card}>
                <ImageBackground style={styles.cardImg} source={{uri:serviceImages[id]}} >
                <LinearGradient
                colors={['transparent','#1A2232']}
                style={styles.LinearGradient}>
                    <View style={styles.linearView}>
                    <Text style={styles.title}>{service.Name}</Text></View>
                </LinearGradient>
        
                
                </ImageBackground>
{/*                 
                <Text style={styles.cardText}>{category}</Text>
         */}
            </View>
        )
        // console.log("IN SERVICE CARDS AGAIN")
        // var id = service.id 
        // var stylistId = service.StylistId
        // var mainImage = service.MainImage 
        // if (serviceImages[id]==null){
        //     console.log("BEFORE FETCH SERVICE IMAGES")
        //     fetchServiceImages(id,mainImage, (result)=> {
        //         if (result==true && serviceStylists[id]==null){
        //             fetchStylistObject(id,stylistId, (result)=> {
        //                 if (result==true && stylistsprofile[stylistId]==null){
        //                     fetchStylistProfilePic(stylistId, (result)=> {
        //                         if (result==true){
        //                             setCards(cards=> ([...cards, ]))
                                   

        //                         }
        //                     })

        //                 }
        //             })

        //         }
        //     })

        // }
        // if (serviceStylists[id]==null){
        //     console.log("BEFORE FETCH STYLISTS")
           

        // }
        // if (stylistsprofile[stylistId]==null){
        //     console.log("BEFORE FETCH STYLIST PROFILE PIC")
        //     fetchStylistProfilePic (stylistId)

        // }

        // console.log("THE SERVICE IMAGE URL")
        // console.log(serviceImages[id])
        // console.log("THE SERVICE NAME")
        // console.log(service.Name)
       
        
       
       

        //so we have images loaded
        //need to have stylist image loaded 




    })





    

    
    // categoryCards = categories.map((category)=>{
    //     var img_require = null
    //     //get service
    //    for (var image in Images){
    //        if (Images[image].gender == gender && Images[image].category==category){
    //            img_require = Images[image].link

    //        }
    //    }
       
    // return (
    
    // <View style={styles.card}>
       
        
    //     <ImageBackground style={styles.cardImg} source={img_require} >
    //     <LinearGradient
    //     colors={['transparent','#1A2232']}
    //     style={styles.LinearGradient}>
    //         <View style={styles.linearView}>
    //         <Text style={styles.title}>{category}</Text></View>
    //     </LinearGradient>

        
    //     </ImageBackground>
        
    //     {/* <Text style={styles.cardText}>{category}</Text> */}

    // </View>)}

    // )} else {
    //     console.log("coming back")
    // }
    return(
    <View style={styles.container}>
        <ScrollView>
        
            {cards}

        </ScrollView>
        

    </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: Dimensions.get("window").height*0.925,
        
    },
    card: {
        width: '100%',
      
        height:200,
        
    },
    cardText: {},
    cardImg: {
        // flex: 1,
        resizeMode: 'contain',
        justifyContent: 'center',
        width: '100%',
        height: 200,
       
        
        
    },
    linearGradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        
        flex:1,
       
      
      
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    title: {
        color: "white",
        fontWeight: "600",
        margin: 20,
        // fontFamily: "LatoSemiBold" 
        

    },
    linearView: {
        width: '100%',
        height: 200,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    }

})

export default BodyScroll;