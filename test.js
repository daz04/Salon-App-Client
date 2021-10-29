import {getDistance} from 'geolib'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
export const getStylistObj = (stylistId, stylistsList) => {
    var stylistobj = null
    for (var stylist in stylistsList){
        console.log("STYLIST COUNT")
        console.log(stylist)
        if (stylistsList[stylist].id == stylistId){
            stylistobj = stylistsList[stylist]
            break
        }
    }
    return stylistobj
}

const serviceIterator = (count, slotDict, ClientCoords, servicesList, stylistsList, availabilityList, weekDates, days,travelDuration, availableServiceTypesInRegion, callback) => {
    if (count == servicesList.length){
       console.log("SLOT DICT RES 12345")
       console.log(slotDict)
       callback(slotDict)
    } else {
        
        var serviceObj = servicesList[count]
        console.log("IN SERVICE ITERATOR LOOP")
        console.log(availableServiceTypesInRegion)
        console.log(serviceObj)
        if (availableServiceTypesInRegion[serviceObj.Category]==true){
        console.log("THE SERVICE OBJJJ 3")
        var stylistObj = stylistsList.filter(stylist => stylist.id == serviceObj.StylistId)
        console.log(stylistObj)
        var availabilityObj = availabilityList.filter(availability => availability.stylistid ==serviceObj.StylistId )
        console.log("AVAILABILITY OBJ RESULT")
        console.log(availabilityObj)
        if (availabilityObj.length>0){

        
        var availabileIntervals = {
            'Monday': availabilityObj[0].Monday,
            'Tuesday': availabilityObj[0].Tuesday,
            'Wednesday': availabilityObj[0].Wednesday,
            'Thursday': availabilityObj[0].Thursday,
            'Friday': availabilityObj[0].Friday,
            'Saturday': availabilityObj[0].Saturday,
            'Sunday': availabilityObj[0].Sunday
        }
    }
        console.log("THE AVAILABLE INTERVALS")
        console.log(availabileIntervals)
        var travelDistance = null 

        if (stylistObj.length>0 && stylistObj[0].Titles!=null && stylistObj[0].Titles.length>0){
            stylistObj = stylistObj[0]
            var stylistId = stylistObj.id
            console.log("OBJ IS HERE 123 789")
            if (stylistObj.Latitude!=null && stylistObj.Longitude!=null){
                console.log("COORDS ARE HERE 789")
                var travelDistance = getDistance(
                {latitude: ClientCoords['Latitude'], longitude: ClientCoords['Longitude']},
                {latitude: stylistObj.Latitude, longitude: stylistObj.Longitude})
                var travelDistanceMiles = 0.000621371 * travelDistance
                var travelDurationMin = travelDistanceMiles*1
                if (travelDurationMin<=travelDuration){
                    console.log("SERVICE IS UNDER TRAVEL TIME")
                    console.log(serviceObj)
                    var obj =  
                    {
                        availability: availabileIntervals,
                        travelDuration: travelDurationMin,
                        travelDistance: travelDistanceMiles,
                        stylist: stylistObj
                    }
                    
                    console.log("OBJECT OBJ")
                    console.log(obj)
                    
                    for (var day_ in weekDates){
                        var day = weekDates[day_]
                        console.log("THE DAY LEVEL")
                        console.log(day)
                        if (day!=null){
                        
                        var date = moment(day)
                        console.log("IN WEsEKDATES LOOP")
                        console.log(day_)
                        var index = date.day()
                        console.log("DAY INDEX 2")
                        console.log(typeof(index))
                        console.log(index)
                        console.log("DAYS ARRAY")
                        console.log(days)
                        
                        var weekDay = days[index]  
                        console.log("WEEK DAY PRINTED")
                        console.log(weekDay)

                        console.log("OBJ OBJECT 2")
                        console.log(obj)

                        var availability_ = obj.availability[weekDay]
                        
                        console.log("AVAILABILITY_ PRINT 5")
                        console.log(weekDay)
                        console.log(availability_)

                        if (availability_!=null){

                        if (slotDict[day]==null){
                            console.log("IN SLOT DICT DAY IS NULL 123")
                            console.log(day)
                            if (availability_.length>0){
                                console.log("ABOUT TO INSERT A SLOT")
                                slotDict[day] = [
                                {stylistId: stylistObj.id,
                                services: [servicesList[count]],
                                availability: availability_,
                                travelDuration: travelDurationMin,
                                travelDistance: travelDistanceMiles
                            }
                            ]
                            }
                        } else {
                            var stylistSlot = null 
                            for (var slot in slotDict[day]){
                                if (slotDict[day][slot].stylistId == stylistId){
                                    stylistSlot = slotDict[day][slot]
                                    break
                                }
                            }
                            console.log("IN SLOT DICT ELSE STATEMENT 2")
                            console.log(slotDict[day])

                            if (availability_.length>0 && stylistSlot!=null){
                                console.log("STYLIST SLOT IS NOT NULL 2")
                                console.log(stylistId)
                                console.log(stylistSlot)
                                var tempServices = stylistSlot.services 
                                tempServices.push(servicesList[count])
                                stylistSlot.services = tempServices
                                var theindex = slotDict[day].indexOf(stylistSlot)
                                slotDict[day].splice(theindex,1)
                                slotDict[day].push(stylistSlot)
                            } else if (availability_.length>0){
                                slotDict[day].push({
                                    
                                    stylistId: stylistObj.id,
                                    services: [servicesList[count]],
                                    availability: availability_,
                                    travelDuration: travelDurationMin,
                                    travelDistance: travelDistanceMiles

                                    

                                })

                            }
                            
                        }
                                                    
                        }
                    }
                    }
                }
            }
        


        console.log("RETURN STYLIST OBJ 4")
        console.log(stylistObj)
        //serviceIterator(count+1, servicesList, stylistsList, callback)
        
    }
}
console.log("THE SLOT DICT BEFORE SERVICE ITERATOR")
console.log(slotDict)
    serviceIterator (count+1, slotDict, ClientCoords, servicesList, stylistsList, availabilityList, weekDates, days, travelDuration, availableServiceTypesInRegion, callback) 
}
}
export const generateSlots = (servicesList, stylistsList, availabilityList, ClientCoords, weekDates, days,  travelDuration, availableServiceTypesInRegion,callback) => {
    console.log("IN GENERATE SLOTS 8")
    var slotsDict = {}
  
    console.log("ON OTHER SIDE 14")
    console.log(servicesList)
    serviceIterator(0,{}, ClientCoords, servicesList, stylistsList, availabilityList, weekDates, days, travelDuration, availableServiceTypesInRegion, (result)=> {
        console.log("SERVICE ITERATOR RESULT")
        console.log(result)
        callback(result)

    })
    // console.log("THE SERVICE ITERATOR RETURN")
    // console.log(slotDict1)
    // return slotDict1
}