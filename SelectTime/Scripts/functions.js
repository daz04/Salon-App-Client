import moment from 'moment'
import {getDistance} from 'geolib'

export const filterServicesByCategory = (selectedCategories, servicesList) => {

    var finalList = []
    for (var service in servicesList){
        for (var category in selectedCategories){
            if (servicesList[service].Category == selectedCategories[category]){
                finalList.push(servicesList[service])
            }
        }
    }
    console.log("IN FILTER SERVICES BY CATEGORY")
    console.log(finalList)
    return finalList
}

export const computeTravelDurationBetweenStylistandClient = (stylistCoordinates, clientCoordinates) => {
    console.log("IN COMPUTE TRAVEL DURATION BETWEEN STYLIST AND CLIENT")
    console.log(clientCoordinates)
    var travelDistance = getDistance(
        {latitude: stylistCoordinates['Latitude'], longitude: stylistCoordinates['Longitude']},
        {latitude: clientCoordinates['Latitude'], longitude: clientCoordinates['Longitude']}
    )
    var travelDistanceMiles = 0.000621371 * travelDistance
    var travelDurationMin = travelDistanceMiles*1
    return travelDurationMin



}

const generateDate = (dateInt) => {
    let newDate = new Date();
    const futureDate = new Date(newDate)
    futureDate.setDate(futureDate.getDate() + dateInt)
    //console.log("IN GENERATING FUTURE DATE")
    //console.log(futureDate)
  
    let month = null 
    let day = null
    if (futureDate.getDate()<10){
        day = "0"+String(futureDate.getDate())
    } else {
        day = String(futureDate.getDate())
    }
    if (futureDate.getMonth()+1<10){
        month="0"+String(futureDate.getMonth()+1)
    } else {
        month = String(futureDate.getMonth()+1)
    }
    let finalDate = String(futureDate.getFullYear()) + "-"+month+"-"+day
    //console.log(finalDate)
    console.log("THE FINAL DATE FROM GENERATE DATE")
    console.log(finalDate)
 
    return finalDate
}

export const generateUpcomingWeek = () =>{
    //console.log("IN GENERATE UPCOMING WEEK")
    var weekDates = []
    for (var i=0; i<7; i++){
        let date = generateDate(i)
        console.log("THE WEEKDATE AS GENERATED")
        console.log(date)
        weekDates.push(date)
    }
    return weekDates
}

const computeTravelDurationBetweenClients = (clientCoords1, clientCoords2) => {
    var travelDistance = getDistance(
        {latitude: clientCoords1['Latitude'], longitude: clientCoords1['Longitude']},
        {latitude: clientCoords2['Latitude'], longitude: clientCoords2['Longitude']}
    )
    var travelDistanceMiles = 0.000621371 * travelDistance
    var travelDurationMin = travelDistanceMiles*1
    return travelDurationMin

}

const computeStylistAvailabilityAfterAppointments = (weekDay, stylistId,services,availabilityIntervals, appointmentsList, travelDuration, clientCoords) => {
    //compute stylist availability for a specific day after cross checking their availability for the day with their appoinmtnets for the day
    for (var appt in appointmentsList){
        if (appointmentsList[appt].StylistId == stylistId && appointmentsList[appt].Date==weekDay){
            //stylist has appointment on specific day out of the week
            var startInterval = null 
            for (var element in availabilityIntervals){
                //get initial start and end times for availability interval 
                //availability intervals will initially be 3 hours block that correspond to the time slots: [Early, Morning, Noon, Afternoon, Evening, Night] according to availability scheduale this specific stylist pre-schedualed
                var startTime = availabilityIntervals[element].split("-")[0]
                var endTime = availabilityIntervals[element].split("-")[1]
                
                if (appointmentsList[appt].StartTime==startTime || 
                    (moment(appointmentsList[appt].StartTime, "h:mm A").isAfter(moment(startTime,"h:mm A")) &&
                    moment(appointmentsList[appt].StartTime.isBefore(moment(endTime, "h:mm A"))))){
                        //this if statement checks if appointment starts at the beggining of or during the current interval
                        if (moment(appointmentsList[appt].EndTime,"h:mm A").isBefore(moment(endTime, "h:mm A"))){
                            //case 1: the existing appointment starts and ends during the specific time interval
                            console.log("IN CASE 1: THE EXISTING APPOINTMENT STARTS AND ENDS DURING TIME INTERVAL")
                            var travelDurationBetweenClients = computeTravelDurationBetweenClients(clientCoords, appointmentsList[appt].ClientCoords)
                            //the above function computes the travel duration estimate in minutes between the client's location the stylist has an appointment with and the user's location
                            console.log("TRAVEL DURATION BETWEEN CLIENTS PRINTED")
                            console.log(travelDurationBetweenClients)
                            var durationBetweenStartTimes = moment.duration(moment(appointmentsList[appt].StartTime, "h:mm A").diff(moment(startTime,"h:mm A")))
                            //durationBetweenStartTimes ctores the time difference between when the appointment starts (which is either after or at the same time of the interval start time)
                            var durationBetweenEndTimes = moment.duration(moment(endTime, "h:mm A").diff(moment(appointmentsList[appt].EndTime, "h:mm A")))

                            var minutesStartTime = durationBetweenStartTimes.asMinutes()
                            //convert travelDurationBetweenClients into minutes
                            console.log("MINUTES START TIME PRINTED")
                            console.log(minutesStartTime)
                            var minutesEndTime = durationBetweenEndTimes.asMinutes()
                            console.log("MINUTES END TIME PRINTED")
                            console.log(minutesEndTime)
                            var totalDuration = Number(services.Duration) + Number(travelDurationBetweenClients)
                            console.log("THE TOTAL DURATION FIRST OCCURANCE PRINTED")
                            console.log(totalDuration)
                            if (totalDuration<=minutesStartTime){
                                //case: the total duration it takes to travel to/from the house of the client the stylist has an appointment with to the user 
                                //is less than or equal to duration between interval start time and appointment start time then
                                //edit interval
                                console.log("THE TOTAL DURATION TO GET FROM ONE CLIENT TO ANOTHER AND CONDUCT SERVICE IS LESS THAN OR EQUAL TO TIME DIFFERENCE BETWEEN INTERVAL AND APPOINTMENT START TIMES")
                                availabilityIntervals[element] = startTime+ " - "+appointmentsList[appt].StartTime
                                if (totalDuration<=minutesEndTime) {
                                    var newInterval = appointmentsList[appt].EndTime + " - " + endTime
                                    availabilityIntervals.push(newInterval)
                                    

                                
                                }


                            } else {
                                if (totalDuration<=minutesEndTime) {
                                    var newInterval = appointmentsList[appt].EndTime + " - " + endTime
                                    availabilityIntervals[element] = newInterval
                                } else {
                                    //have to remove the whole time slot because there isnt enough time before appointment or after appointment for stylist to go to client and perform service
                                    availabilityIntervals = availabilityIntervals.filter(obj => obj== availabilityIntervals[element])
                        
                                }


                            }
                            
                           



                        } else if (moment(appointmentsList[appt].EndTime,"h:mm A").isAfter(moment(endTime, "h:mm A"))){
                            //Case 2: appointment ends after current interval but starts during the current interval
                            console.log("IN CASE 2: THE EXISTING APPOINTMENT STARTS DURING TIME INTERVAL AND ENDS AFTERWARDS")
                            var travelDurationBetweenClients = computeTravelDurationBetweenClients(clientCoords, appointmentsList[appt].ClientCoords)
                            var durationBetweenStartTimes = moment.duration(moment(appointmentsList[appt].StartTime, "h:mm A").diff(moment(startTime,"h:mm A")))
                            var minutesStartTime = durationBetweenStartTimes.asMinutes()
                            var totalDuration = Number(services.Duration) + Number(travelDurationBetweenClients)
                            if (totalDuration<=minutesStartTime){
                                //case: the total duration it takes to travel to/from the house of the client the stylist has an appointment with to the user 
                                //is less than or equal to duration between interval start time and appointment start time then
                                //edit interval
                                availabilityIntervals[element] = startTime+ " - "+appointmentsList[appt].StartTime
                                if (totalDuration<=minutesEndTime) {
                                    var newInterval = appointmentsList[appt].EndTime + " - " + endTime
                                    availabilityIntervals.push(newInterval)
                                    

                                
                                } else {
                                    availabilityIntervals = availabilityIntervals.filter(obj => obj== availabilityIntervals[element])

                                }


                            }



                        }
                    } else if ((moment(appointmentsList[appt].EndTime, "h:mm A").isAfter(moment(startTime,"h:mm A")) &&
                    moment(appointmentsList[appt].EndTime.isBefore(moment(endTime, "h:mm A"))) || appointmentsList[appt].EndTime==startTime)){
                        //Case 3: this case checks if an appointment ends during the selected time interval or at the beggining of the current time interval
                        //it is important to check if an appointment ends at the beggining of the time interval because you still have to account for travel time to go from that previous client to the current user
                        var travelDurationBetweenClients = computeTravelDurationBetweenClients(clientCoords, appointmentsList[appt].ClientCoords)
                        var durationBetweenEndTimes = moment.duration(moment(endTime, "h:mm A").diff(moment(appointmentsList[appt].EndTime,"h:mm A")))
                        var minutesEndTime = durationBetweenEndTimes.asMinutes()
                        var totalDuration = Number(services.Duration) + Number(travelDurationBetweenClients)
                        if (totalDuration<=minutesEndTime){
                            availabilityIntervals[element] = endTime+ " - "+appointmentsList[appt].EndTime

                        } else {
                            availabilityIntervals = availabilityIntervals.filter(obj => obj== availabilityIntervals[element])

                        }


                    }
            }

        }
    }
    console.log("THE RESULTING AVAILABILITY INTERVAL LIST")
    console.log(availabilityIntervals)

}

export const computeStylistAvailabilityForGivenDay = (stylistId, weekDay, day, availabilityForTheDay, services, appointmentsList, travelDurationBetweenClientandStylist, clientCoords) => {
    console.log("IN COMPUTE STYLIST AVAILABILITY FOR GICVEN DAY")
    console.log(weekDay)
    console.log(day)
    console.log(availabilityForTheDay)
    var timeSlotIntervals = {"Early": "6:00 AM-9:00 AM", "Morning": "9:00 AM-12:00 PM", "Noon": "12:00 PM-2:00 PM",
    "Afternoon":"2:00 PM-5:00 PM", "Evening":"5:00 PM-8:00 PM", "Night":"8:00 PM-11:00 PM"}
    var availableIntervalsForWeekDay = availabilityForTheDay[day]
    var availabilityTimeSlots = []
    for (var timeslot in availableIntervalsForWeekDay){
        var interval = timeSlotIntervals[availableIntervalsForWeekDay[timeslot]]
        availabilityTimeSlots.push(interval)

    }
    console.log("THE INTERVAL LIST IN COMPUTE STYLIST AVAILABILITY FOR GIVEN DAY")
    var availabilityAfterCheckingAppointments = computeStylistAvailabilityAfterAppointments(weekDay,stylistId, services,availabilityTimeSlots, appointmentsList, travelDurationBetweenClientandStylist, clientCoords )
    console.log(availabilityTimeSlots)
}
export const populatetheUpcomingWeekAvailability = (weekDates, availabilityList, stylistList, serviceList, appointmentList, clientCoords) => {
   
    //availability list is of stylists that offer at least one service that matches user entered category(ies)
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    var dailyAvailability = {"Sunday":[], "Monday":[],"Tuesday":[],"Wednesday":[],"Thursday":[],"Friday":[],"Saturday":[]}
    for (var day in weekDates){
        var dayOfTheWeek = moment(weekDates[day]).day()
        var dayTitle = days[dayOfTheWeek]

        var availabilityByDay = availabilityList.filter(record => record[dayTitle].length>0)
        console.log("AVAILABILITY BY DAY 1")
        console.log(dayTitle)
        console.log(availabilityByDay)
        for (var record in availabilityByDay){
            console.log("IN AVAILABILITY BY DAY LOOP 2")
            console.log(availabilityByDay[record])
            var stylist = stylistList.filter(stylist_ => stylist_.id == availabilityByDay[record].stylistid)[0]
            console.log("STYLIST OBJECT THAT CORRESPONDS WITH THIS AVAILABILITY RECORD")
            console.log(stylist)
            if (stylist!=null && stylist.Latitude!=null && stylist.Longitude!=null){
                console.log("STYLIST COORDINATES ARE AVAILABLE")
                var stylistCoords = {
                    'Latitude': stylist.Latitude,
                    'Longitude': stylist.Longitude
                }
                var travelDurationBetweenClientandStylist = computeTravelDurationBetweenStylistandClient(stylistCoords, clientCoords)
                console.log("THE TRAVEL DURATION BETWEEN CLIENT AND STYLIST 54")
                console.log(travelDurationBetweenClientandStylist)
                var stylistId = availabilityByDay[record].stylistid
                console.log("THE AVAILABILITY DAY HERE HERE")
                console.log(availabilityByDay[record])
               
                var services = []
                for (var record_ in serviceList){
                    if (serviceList[record_].StylistId == stylistId){
                        services.push(serviceList[record_])
                    }
                }
                console.log("BEFORE COMPUTE STYLIST AVAILABILITY 1")
                console.log(availabilityByDay[record])
                computeStylistAvailabilityForGivenDay(stylist.id,weekDates[day],dayTitle,availabilityByDay[record],services,appointmentList, travelDurationBetweenClientandStylist, clientCoords)
                // var stylistAvailabilityForTheDay = 

            }
            
        }


    }


}