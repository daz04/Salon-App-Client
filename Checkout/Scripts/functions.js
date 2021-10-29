import AsyncStorage from '@react-native-async-storage/async-storage'
import {getDistance} from 'geolib'
import {getStylistAppointmentByDate} from '../../Database/functions'
import {fetchLocationCoords} from '../../LocalStorage/functions'
import moment from 'moment'

export const fetchAptSuiteBldgNumber = (callback) => {
    AsyncStorage.getItem("AptSuiteBldgNumber").then((response)=> {
        callback(response)
    })

}

const computeTravelDistanceBetweenClients = (client1Coords, client2Coords) => {
    console.log("THE CLIENT 1 COORDS HERE 2")
    console.log(JSON.parse(client1Coords))
    console.log(client2Coords)
    var distanceBetweenClients = getDistance(
        {latitude: JSON.parse(client1Coords).Latitude, longitude: JSON.parse(client1Coords).Longitude},
        {latitude: JSON.parse(client2Coords).Latitude, longitude: JSON.parse(client2Coords).Longitude})
    var travelDistanceInMiles =  0.000621371 * distanceBetweenClients
    var averageTimePerMileTravelTime = 1 
    var estimatedTravelTime = averageTimePerMileTravelTime * travelDistanceInMiles
    return estimatedTravelTime



}

export const computeStylistAppointmentOverlapWithNewLocation = (stylist, service, locationCoords, travelDuration, arrivalDate, startTime, callback) => {
    getStylistAppointmentByDate(stylist.id, arrivalDate, (result)=> {
        
        if (result!=null){
            var appointments = result.data
            console.log("STYLISTS APPOINTMENT BY DATE")
            console.log(appointments)
            var serviceDuration = service.Duration 
            var totalDuration = Number(serviceDuration) + Number(travelDuration)
            var possibleOverlaps = []
            var overlap = false
            for (var appt in appointments){
                var travelDurationBetweenClients = computeTravelDistanceBetweenClients(appointments[appt].ClientCoords, locationCoords)
                console.log("TRAVEL DURATION BETWEEN CLIENTS")
                console.log(travelDurationBetweenClients)
                var appointmentStartTime = appointments[appt].StartTime
                var appointmentEndTime = appointments[appt].EndTime
                var adjustedServiceEndTime = moment(service.StartTime, "h:mm A").add(totalDuration + travelDurationBetweenClients,"minutes")
                console.log("THE ADJUSTED SERVICE END TIME")
                console.log(adjustedServiceEndTime)
            

                if (moment(adjustedServiceEndTime,"h:mm A").isAfter(moment(appointmentStartTime, "h:mm A"))){
                    overlap = true
                    break 
                }
                
              
            
            }
            callback(overlap)
        }

        //get list of stylist appointments that are available for 
    })

}
export const computeStylistDistanceFromAddress = (stylist, locationCoords) => {
    var stylistLatitude = stylist.Latitude 
    var stylistLongitude = stylist.Longitude 
    console.log("STYLIST COORDINATES")
    console.log(stylistLatitude)
    console.log(stylistLongitude)
    var travelDistance = getDistance(
        {latitude: stylistLatitude, longitude: stylistLongitude},
        {latitude: JSON.parse(locationCoords).Latitude, longitude: JSON.parse(locationCoords).Longitude})
    var travelDistanceInMiles =  0.000621371 * travelDistance
    console.log("TRAVEL DISTANCE IN MILES IS COMPUTED")
    console.log(travelDistanceInMiles)
    return travelDistanceInMiles
    
  
}

export const computeStylistAbilityToGoToClientAddress = (stylist, service, locationCoords, arrivalDate, startTime, callback) => {
    console.log("IN THE FUNCTION EHRE")
    var distanceFromStylistToAddress = computeStylistDistanceFromAddress(stylist, locationCoords)
        
    console.log("COMPUTE STYLIST DISTANCE RESPONSE here here 2")
    console.log(distanceFromStylistToAddress)
    var averageTimePerMileTravelTime = 1 
    var estimatedTravelTime = averageTimePerMileTravelTime * distanceFromStylistToAddress
    if (distanceFromStylistToAddress> stylist.TravelRadius){
        console.log("CASE 1")
        //stylist is available to travel to that region
        callback(false)
    } else if (estimatedTravelTime>45){
        console.log("CASE 2")
        //travel distance to new client is not 
        callback(false)
    } else {
        console.log("CASE 3")
        computeStylistAppointmentOverlapWithNewLocation(stylist, service, locationCoords, estimatedTravelTime, arrivalDate, startTime, (result)=> {
            callback(!result)
        })
    }
}

export const fetchCurrentAddress = (callback) => {
    AsyncStorage.getItem("currentAddress").then(res=> {
        callback(res)
    })
}