import React, {useState} from 'react'
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground} from 'react-native';
import AppointmentSlot from '../Models/appointmentSlot';
import Service from '../Models/Service'
import Stylist from '../Models/Stylist'
import {convertTime} from '../functions/database'
import {generateStylistCoords} from '../functions/database'
import moment from 'moment'
import StylistServiceCard from '../components/stylistServiceCard'
import {getService} from '../Database/functions'

// var services = [

// ]

var selectedService = null

export const GenerateApptSlots = (jsonfile)  => {
    // console.log("generate appt slots")
    var jsonObj = jsonfile
    // console.log(jsonObj)
    var appointmentList = jsonObj[Object.keys(jsonObj)[0]];
    console.log("appointment list")
    console.log(appointmentList)
    var appointmentSlots = [];
    for (var appointment in appointmentList){
        // console.log("appointment")
        // console.log(appointmentList[appointment].id)
        var appointmentSlot = new AppointmentSlot(appointmentList[appointment].id,
            appointmentList[appointment].serviceId,
            appointmentList[appointment].date,
            appointmentList[appointment].timeList)
        appointmentSlots.push(appointmentSlot)

    }
    // console.log("appointment slots")
    // console.log(appointmentSlots)
    return appointmentSlots

}

export const generateServiceObjList = (category, isSubCategory) => {
    console.log("in service obj function")
    var categoryJson = null
    if (isSubCategory==false){
        if (category=="BRAIDING"){
            categoryJson = require('../json/services/servicesByCategory/Female/braids.json')
            console.log("category json")
            console.log(categoryJson)
            
        }
        var serviceList = categoryJson[Object.keys(categoryJson)[0]];
        console.log("service list")
        console.log(serviceList)
        var services = []
        for (var service in serviceList){
            var serviceObj = new Service(serviceList[service].Id,
                serviceList[service].StylistId,
                serviceList[service].Name,
                serviceList[service].Price,
                serviceList[service].Duration,
                serviceList[service].Description,
                serviceList[service].Utilities,
                serviceList[service].Category,
                serviceList[service].SubCategory,
                serviceList[service].Gender,
                serviceList[service].Media
                )
            services.push(serviceObj)
        }
        return services


    } else {
        console.log("AT SUBCATEGORY IS TRUE")
        //stick to braiding for now cause it's the only example and then come back to it
        categoryJson = require('../json/services/servicesByCategory/Female/braids.json')
        var serviceList = categoryJson[Object.keys(categoryJson)[0]];
        var services = []
        for (var service in serviceList){
            console.log("CATEGORY COMPARE")
            console.log(category)
            console.log(serviceList[service].Name)
            if (serviceList[service].Name.toLowerCase()==category.toLowerCase()){
                console.log("SUB CATEGORY THE SAME AS CATEGORY")
                var serviceObj = new Service(serviceList[service].Id,
                    serviceList[service].StylistId,
                    serviceList[service].Name,
                    serviceList[service].Price,
                    serviceList[service].Duration,
                    serviceList[service].Description,
                    serviceList[service].Utilities,
                    serviceList[service].Category,
                    serviceList[service].SubCategory,
                    serviceList[service].Gender,
                    serviceList[service].Media
                    )
                services.push(serviceObj)
            }
        }
        return services
        
    }
    //we got categoryJson
    
    


}

function appointmentsOverlapping(expectedArrivalDate, expectedArrivalTime, clientCoords, stylistId){

    var appointmentsJson = require("../json/appointments/appointments.json")
    var appointments = appointmentsJson[Object.keys(appointmentsJson)[0]]
    for (var appt in appointments){
        if (appointments[appt].StylistId == stylistId){

        }
    }

}
function travelTimetoClient(clientCoords,stylistCoords, expectedArrivalDateTime, serviceDuration){
    //implement google maps api here that i had already developed with node later
    //for now just return default value
    return 20
}
function apptOverlap(startDateTime, endDateTime, expectedArrivalDateTime,clientCoords,stylistCoords,serviceDuration){
    console.log("start date time")
    console.log(startDateTime)
    console.log(expectedArrivalDateTime)
    var fails = false
    var travelTime = travelTimetoClient(clientCoords,stylistCoords,expectedArrivalDateTime,serviceDuration)
    var expectedDateString = expectedArrivalDateTime.toString()
    var expectedStartofStylistTravel = new Date(expectedDateString)
    var expectedEndofStylistTravel = new Date(expectedDateString)
    
    
    expectedStartofStylistTravel.setMinutes(expectedStartofStylistTravel.getMinutes()-travelTime)
    expectedEndofStylistTravel.setMinutes(expectedEndofStylistTravel.getMinutes()+serviceDuration+travelTime)
    console.log(expectedArrivalDateTime)
    console.log("expected start time of stylist travel")
    console.log(expectedStartofStylistTravel)
    console.log(expectedStartofStylistTravel.getMinutes()+travelTime)
    console.log(expectedEndofStylistTravel)

    if ( startDateTime<expectedStartofStylistTravel && endDateTime>expectedEndofStylistTravel ){
        //appointment starts afer slot but finishes before slot ends 
        fails = true
    } 
    if (startDateTime>expectedStartofStylistTravel && endDateTime<expectedEndofStylistTravel && endDateTime>expectedStartofStylistTravel){
        //appointment starts before slot starts
        //appointment ends before end of slot but after start of new slot 
        fails=true

    }
    if (startDateTime>expectedArrivalDateTime && startDateTime<expectedEndofStylistTravel && endDateTime>expectedEndofStylistTravel){
        //appointment starts after slot starts but before slot ends
        //appointment ends after slot ends
        fails=true
    }
    if (startDateTime<expectedStartofStylistTravel && endDateTime<expectedEndofStylistTravel){
        //appointment starts before slot starts but ends after slot ends
        fails = true
    }

    console.log("fails")
    console.log(fails)
    return fails

}
function schedualeOverlap(startDateTime, endDateTime, expectedArrivalDateTime,clientCoords,stylistCoords,serviceDuration){
    console.log("start date time")
    console.log(startDateTime)
    console.log(expectedArrivalDateTime)
    var fails = false
    var travelTime = travelTimetoClient(clientCoords,stylistCoords,expectedArrivalDateTime,serviceDuration)
    var expectedDateString = expectedArrivalDateTime.toString()
    var expectedStartofStylistTravel = new Date(expectedDateString)
    var expectedEndofStylistTravel = new Date(expectedDateString)
    
    console.log("SCHEDUALE OVERLAP")
    console.log(expectedDateString)
    
    expectedStartofStylistTravel.setMinutes(expectedStartofStylistTravel.getMinutes()-travelTime)
    expectedEndofStylistTravel.setMinutes(expectedEndofStylistTravel.getMinutes()+serviceDuration+travelTime)
    console.log(expectedArrivalDateTime)
    console.log("expected start time of stylist travel")
    console.log(expectedStartofStylistTravel)
    console.log(expectedStartofStylistTravel.getMinutes()+travelTime)
    console.log(expectedEndofStylistTravel)

    if (expectedStartofStylistTravel<startDateTime){
        fails = true
    }
    if (expectedEndofStylistTravel>endDateTime){
        fails=true
    }
    console.log("fails")
    console.log(fails)
    return fails
}
export const availabile = (expectedArrivalDate, expectedArrivalTime, clientCoords, stylistId, serviceDuration, stylistCoords) =>{
   
    var schedualesJson = require('../json/scheduales/scheduales.json');
    var scheduales = schedualesJson[Object.keys(schedualesJson)[0]]
  
    var isAvailable = false
    for (var scheduale in scheduales){
        if (scheduales[scheduale].StylistId==stylistId && scheduales[scheduale].Date==expectedArrivalDate){
            console.log("EXPECTED ARRIVAL DATE")
            console.log(expectedArrivalDate)
            var startTime = convertTime(scheduales[scheduale].StartTime)
            if (startTime.split(":")[0].length ==1){
                startTime = "0"+startTime
            }
            console.log("HERE FIRST")
            console.log(scheduales[scheduale].StartTime)
            console.log(startTime)
            var endTime = convertTime(scheduales[scheduale].EndTime)
            var startTimeStr = moment(scheduales[scheduale].Date +" "+startTime).format('LLL')
            var endTimeStr = moment(scheduales[scheduale].Date +" "+endTime).format('LLL')
            var startDateTime = new Date(startTimeStr)
            var endDateTime = new Date(endTimeStr)
            console.log("START DATE TIME")
            console.log(startTimeStr)
            console.log(startDateTime)
            console.log(endDateTime)
            var expectedArrivalTimeConverted = convertTime(expectedArrivalTime)
            console.log("EXPECTED ARRIVAL TIME ")
            console.log(expectedArrivalTimeConverted)
            var expectedTimeStr = moment(expectedArrivalDate+" "+expectedArrivalTimeConverted).format('LLL')
            var expectedArrivalDateTime = new Date(expectedTimeStr)
            console.log("END TIMEEEEEE")
            console.log(endTimeStr)
            var schedualeoverlap = schedualeOverlap(startDateTime,endDateTime,expectedArrivalDateTime,clientCoords,stylistCoords, serviceDuration)
            if (schedualeoverlap==false){
                isAvailable=true
                break
            }

        }
    }
    return isAvailable
}
export const apptAvailability = (expectedArrivalDate, expectedArrivalTime, stylistId, clientCoords, stylistCoords, serviceDuration) => {
    var appointmentsJson = require('../json/appointments/appointments.json');
    var appointments = appointmentsJson[Object.keys(appointmentsJson)[0]]
    console.log("APPOINTMENTS IN APPT AVAILABILITY")
    console.log(appointments)
    var count = 0
    var isAvailable = false
    for (var appt in appointments){
        console.log("APPOINTMENT IN APPOINTMENTS")
        console.log(appointments[appt])
        var service = getService(appointments[appt].ServiceId)
        var StylistId = service.StylistId
        if (appointments[appt].Date==expectedArrivalDate && StylistId==stylistId){
            count +=1
            console.log("IN APPT AVAILABLE FUNCTION")
            console.log(appointments[appt])
            console.log(appointments[appt].StartTime)
            console.log(appointments[appt].EndTime)
            var startTime = convertTime(appointments[appt].StartTime)
            var endTime = convertTime(appointments[appt].EndTime)
            console.log("appointment start time")
            console.log(startTime)
            console.log("appoitment end time")
            console.log(endTime)
            var startTimeStr = moment(appointments[appt].Date +" "+startTime).format('LLL')
            var endTimeStr = moment(appointments[appt].Date +" "+endTime).format('LLL')
            var startDateTime = new Date(startTimeStr)
            var endDateTime = new Date(endTimeStr)
            var expectedArrivalTimeConverted = convertTime(expectedArrivalTime)
            console.log("expected arrival TIME")
            console.log(expectedArrivalTimeConverted)
            var expectedTimeStr = moment(expectedArrivalDate+" "+expectedArrivalTimeConverted).format('LLL')
            var expectedArrivalDateTime = new Date(expectedTimeStr)
            var schedualeoverlap = apptOverlap(startDateTime,endDateTime,expectedArrivalDateTime,clientCoords,stylistCoords, serviceDuration)
            if (schedualeoverlap==false){
                isAvailable=true
                break
            }





        }
    }
    console.log(appointments[appt])
    if (count==0){
        isAvailable=true
    }
    console.log("blah")
    console.log("is available")
    console.log(isAvailable)
    return isAvailable



}
function getStylistProfilePic(stylistId){
    var stylistProfilePic = null
    var stylistJson = require('../json/stylists/stylists.json')
    var stylists = stylistJson[Object.keys(stylistJson)[0]]
    for (var stylist in stylists){
        if (stylists[stylist].Id == stylistId){
            stylistProfilePic = stylists[stylist].ProfilePictureURL
        }

    }
    if (stylistProfilePic == null){
        console.log("NEED TO RAISE ERROR")
        return
    } 
    return stylistProfilePic

}
function getStylistName(stylistId){
    var stylistFirstName = null
    var stylistJson = require('../json/stylists/stylists.json')
    var stylists = stylistJson[Object.keys(stylistJson)[0]]
    for (var stylist in stylists){
        if (stylists[stylist].Id == stylistId){
            stylistFirstName = stylists[stylist].FirstName

            
        }

    }
    if (stylistFirstName==null){
        console.log("NEED TO RAISE ERROR")
        return
    }
    return stylistFirstName


}
function generateCard(service, stylistId){
    var stylistName = getStylistName(stylistId)
    var stylistprofilePicURL = getStylistProfilePic(stylistId)

    //come back to stylist rating later





}
function loadStylist(stylistId){
    var stylistObj = null
    var stylistJson = require('../json/stylists/stylists.json')
    var stylists = stylistJson[Object.keys(stylistJson)[0]]
    for (var stylist in stylists){
        if (stylists[stylist].Id == stylistId){
            console.log("stylist")
            console.log(stylists[stylist])
            
            var stylistStruct = stylists[stylist]
            console.log(stylistStruct.Id)
            stylistObj = new Stylist(stylistStruct.Id,
                stylistStruct.FirstName,
                stylistStruct.LastName,
                stylistStruct.Email,
                stylistStruct.Phone,
                stylistStruct.StreetNumber,
                stylistStruct.City,
                stylistStruct.State,
                stylistStruct.WorkingRadius,
                stylistStruct.TravelCost,
                stylistStruct.ProfilePictureURL)

            
        }

    }
    if (stylistObj==null){
        console.log("NEED TO RAISE ERROR")
        return
    }
    return stylistObj


}
function stylistCardHandler (selectedService){
    console.log("STYLIST CARD HANDLER")
    selectedService = selectedService
    //stylist card handler 



}
function apptTimeHandler (timeSelected){

}
const GeneratestylistServiceCard = (props) =>{
    // const [selectedService, setService] = useState(null)
    var serviceList = props.services
   
    // var expectedArrivalDate = props.expectedArrivalDate
    // var expectedArrivalTime = props.expectedArrivalTime
    // var clientCoords = props.clientCoords
    // var stylistServiceCards = []

    const stylistCardHandler = (selectedService, selectedStylist, selectedTime) => {
        console.log("STYLIST CARD HANDLER")
        console.log(selectedService)
        
        props.setSelect(selectedService, selectedStylist, selectedTime)
    }
    var stylistServiceCards = []
    console.log("in generate stylist service card 3")
    console.log(serviceList)
    for (var service in serviceList){
        console.log("in service list for loop")
        console.log(serviceList[service])
        //service object
        var available = false
        
        var stylistId = serviceList[service].StylistId;
        if (serviceList[service]!=null){
            var serviceCard = <StylistServiceCard service={serviceList[service]} stylistId={serviceList[service]['stylistId']} setSelection={stylistCardHandler} arrivalTime={props.arrivalTime} arrivalDate={props.arrivalDate}/>
            stylistServiceCards.push(serviceCard)

        }
        
        // var stylistCoords = generateStylistCoords(stylistId)
        // console.log("stylist coords")
        // console.log(stylistCoords)
        // var schedualeAvailability = availabile(expectedArrivalDate,expectedArrivalTime,clientCoords,stylistId,serviceList[service].Duration,stylistCoords)
        // console.log("scheduale availability")
        // console.log(schedualeAvailability)
        // if (schedualeAvailability==true){
        //     var appointmentAvailability = apptAvailability(expectedArrivalDate, expectedArrivalTime,stylistId,clientCoords,stylistCoords,serviceList[service].Duration)
        //     if (appointmentAvailability==true){
        //         console.log("stylist id")
        //         console.log(stylistId)
        //         var stylistObj = loadStylist(stylistId)
        //         console.log("after load stylist")
        //         var serviceCard = <StylistServiceCard serviceObj={serviceList[service]} stylistObj={stylistObj} setSelection={stylistCardHandler} />
        //         stylistServiceCards.push(serviceCard)

        //     }
        // }
        


    }

    return (
        <View>
            {/* {serviceCard} */}
        {stylistServiceCards}
        </View>
    )


}

export default GeneratestylistServiceCard;