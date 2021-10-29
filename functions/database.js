export const convertTime = (time) =>{
    console.log("IN CONVERT TIME FUNCTION")
    console.log(time)
    var newTime = null
    if (time.includes('AM')){
        var timeSplit = time.split(":")
        if (timeSplit[0]!="12"){
            var fixedTime = time.replace(' AM','')
            newTime = fixedTime+":00"

        } else {
            var fixedTime = "00:"+timeSplit[1].replace(' AM','')
            newTime = fixedTime+":00"
            
        }
        
        
    } else {
        var timeSplit = time.replace(" PM",'').split(":")
        if (timeSplit[0]!="12"){
            var timeHour = timeSplit[0]
            timeHour = Number(timeHour)
            timeHour += 12 
            var fixedTime = String(timeHour) + ":"+timeSplit[1] +":00"
            newTime = fixedTime

        } else {
            var timeHour = timeSplit[0]
            var fixedTime = String(timeHour) + ":"+timeSplit[1] +":00"
            newTime = fixedTime

        }
       
    }
    return newTime
}

function computeCoords(streetNumber, city, state){
    //add api here later, for now just return a default number
    return [26.22,80.19]
}
export const generateStylistCoords = (stylistId) =>{
    var stylistJson = require("../json/stylists/stylists.json")
    var stylistsList = stylistJson[Object.keys(stylistJson)[0]];
    var coords = null
    for (var stylist in stylistsList){
        if (stylistsList[stylist].Id == stylistId){
            var streetNumber = stylistsList[stylist].StreetNumber 
            var city = stylistsList[stylist].City 
            var state = stylistsList[stylist].State  
            coords = computeCoords(streetNumber, city, state)
        }
    }
    return coords

}