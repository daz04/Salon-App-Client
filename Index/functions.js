export const generateAppointmentIndex = () => {
    //get appointments - replace with APIs
    var appointmentList = require("../json/appointments/appointments.json")['appointments']
    var arrayIndex = appointmentList.length -1 
    var apptIndex = appointmentList[arrayIndex].Id 
    var newInt = Number(apptIndex) +1 
    return String(newInt)
}