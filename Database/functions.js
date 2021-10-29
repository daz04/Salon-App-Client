import moment from 'moment'
//make call to api 
import {generateAppointmentIndex} from '../Index/functions'
import axios from 'axios'
import uuid from 'react-native-uuid'
import AsyncStorage from '@react-native-async-storage/async-storage'


export const setBookingStatus = (bookingId, status, callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/bookings/setBookingStatus?bookingId=${bookingId}&status=${status}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)

    }).catch(error=> {
        console.log("ERROR IN SETTING BOOKING STATUS")
        console.log(error)
        callback(null)

    })

}
export const getBookingFee = (callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/bookingfee/getBookingFee`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)

    }).catch(error=> {
        console.log("ERROR IN GETTING BOOKING FEE FROM DATABASE")
        console.log(error)
        callback(null)

    })

}

export const createTransaction = (transactionPayload, callback) => {
    var transactionId = uuid.v4()
    transactionPayload['id'] = transactionId
    transactionPayload['withdrew'] = false
    console.log("TRANSACTION PAYLOAD HERE 1")
    console.log(transactionPayload)
    axios.post(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/transactions/createTransaction`, transactionPayload,  {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }})
    .then(response=> {
        callback(response)

    }).catch(error=> {
        console.log("ERROR IN CREATE TRANSACTION 1234")
        console.log(error)
        console.log(null)
        callback(null)

    })

}
export const getAvailabileLocations = (callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/availabilityLocations/getAvailabilityLocationList`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)

    }).catch(error=> {
        console.log("ERROR IN GET AVAILABLE LOCATIONS")
        console.log(error)
        console.log(null)

    })


} 

export const getTravelDuration = (callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/travelDuration/getAverageDuration`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)

    }).catch(error=> {
        console.log("ERROR IN GET TRAVEL DURATION")
        console.log(error)
        console.log(null)

    })

}

//Client


export const computeTravelDistance = (lat1, long1, lat2, long2, callback_, callback) => {
  
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/geocode/getDistance?clientLat=${lat1}&clientLong=${long1}&stylistLat=${lat2}&stylistLong=${long2}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)

    }).catch(error=> {
        console.log("ERROR IN COMPUTE TRAVEL DISTANCE")
        console.log(error)
        console.log(null)

    })



}

export const fetchSubscription = (subscriptionId, callback) => {
    
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/subscriptions/getSubscriptionById?subscriptionId=${subscriptionId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)

    }).catch(error=> {
        console.log("ERROR IN FETCH SUBSCRIPTION")
        console.log(error)
        console.log(null)

    })



}

export const computeTravelDuration = (lat1, long1, lat2, long2, callback_, callback) => {
    console.log("IN COMPUTE TRAVEL DISTANCE FUNC")
    console.log(lat1)
    console.log(long1)
    console.log(lat2)
    console.log(long2)

    //axios.get(`http://localhost:3000/geocode/getDuration?clientLat=${String(lat1)}&clientLong=${String(long1)}&stylistLat=${String(lat2)}&stylistLong=${String(long2)}`, {
  
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/geocode/getDuration?clientLat=${lat1}&clientLong=${long1}&stylistLat=${lat2}&stylistLong=${long2}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)

    }).catch(error=> {
        console.log("ERROR IN COMPUTE TRAVEL DURATION")
        console.log(error)
        console.log(null)

    })

    


}
export const saveLocationTypeAsync = async (type) => {
    try {
        await AsyncStorage.setItem(
            'locationType',
            type
        )
    } catch (error) {
        console.log("SAVE LOCATION TYPE ERROR")
        console.log(error)
    }


}
export const saveAddressAsync = (address, callback) => {
    //type is always going to be a string 
    console.log("IN SAVE ADDRESS ASYNC")
    AsyncStorage.setItem("currentAddress",address).then(result=> {
        console.log("IN CALLBACK FOR SET CURRENT ADDRESS")
        console.log(result)
        callback(true)

    }).catch(e=> {
        callback(false)
    })

}

export const saveLocation = async (locationPayload) => {
    try {
        await AsyncStorage.setItem(
            'locationCoords',
            JSON.stringify(locationPayload)
        )
    } catch (error) {
        console.log("SAVE LOCATION ERROR")
        console.log(error)
    }

}



export const saveMainAddressRecord = async (address) => {
    try {
        await AsyncStorage.setItem(
            'mainAddress',
            JSON.stringify(address)
        )
    } catch (error) {
        console.log("SAVE LOCATION ERROR")
        console.log(error)
    }

}
export const saveLocationCoordinates = async (coords) => {
    try {
        await AsyncStorage.setItem(
            'locationCoords',
            JSON.stringify(coords)
        )
    } catch (error) {
        console.log("SAVE LOCATION COORDS ERROR")
        console.log(error)
    }


}



const storeClientMainAddressId = async(id) => {
    try {
        await AsyncStorage.setItem(
            'mainAddressId', id
        )
    } catch (error){
        console.log("SAVE MAIN ADDRESS ID FAILED")
        console.log(error)
    }
}



const saveClientAsync = async (id) => {
    try {
        await AsyncStorage.setItem(
            'clientId',
            id
        )
    } catch (error) {
        console.log("SAVE CLIENT ASYNC ERROR")
        console.log(error)
    }

}

export const postAddress = (payload, callback_, callback)=> {
    console.log("IN POST ADDRESS")
    console.log(payload)
    axios.put(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/address/postAddress/`,payload, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        console.log("POST ADDRESS WAS SUCCESSFUL")
        callback(response)
    }).catch(error=> {
        console.log("POST ADDRESS FAILED")
        console.log(error)
        callback(false)
    })

}

export const getAddress = (addressId,callback_,callback) => {
    console.log("IN GET ADDRESS FUNCTION")
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/address/getAddress?addressId=${addressId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response => {
        console.log("GET CLIENT BY EMAIL RESPONSE")
        console.log(response)
        if (response.data.length>0){
            callback(response.data)
        }
       
    }).catch(error => {
        console.log(error)
        callback(null)
        
    })

}

export const addAddressDetails = (addressDetails, callback_, callback)=> {
    axios.put(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/client/setAddressDetails`,addressDetails, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(true)

    }).catch(error=> {
        console.log("ERROR AT ADDING CLIENT ADDRESS")
        console.log(error)
        callback(false)

    })


}

export const getStylistAvailability = (stylistId, callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/availability/getAvailability?id=${stylistId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)
    }).catch(error=> {
        console.log("ERROR AT GET STYLIST AVAILABILITY")
        console.log(error)
        callback(error)
    })

}

export const postClient = (clientPayload, callback)=> {
    var id = uuid.v4()
    // var addressId = uuid.v4()
    // var addressPayload= null
    
    // if (clientPayload.address.appartmentNum!=""){
    //     addressPayload = {
    //         id: addressId,
    //         addressName: clientPayload.address.name,
    //         appartmentNumber: clientPayload.address.appartmentNum,
    //         unitName: clientPayload.address.unitNum,
    //         streetNumber: clientPayload.address.streetNum, 
    //         streetName: clientPayload.address.streetName,
    //         city: clientPayload.address.city,
    //         state: clientPayload.address.state
    
    //     }

    // } else {
    //     addressPayload = {
    //         id: addressId,
    //         addressName: clientPayload.address.name,
    //         unitName: clientPayload.address.unitNum,
    //         streetNumber: clientPayload.address.streetNum, 
    //         streetName: clientPayload.address.streetName,
    //         city: clientPayload.address.city,
    //         state: clientPayload.address.state
    
    //     }

    // }
    
    // console.log("THE ADDRESS PAYLOAD")
    // console.log(addressPayload)
    var clientRevisedPayload = {
        id: id,
        email: clientPayload.email,
        phone: clientPayload.phone,
        firstName: clientPayload.firstName,
        lastName: clientPayload.lastName,
        birthday: clientPayload.birthday
    }
    axios.post(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/client/postClient`,clientRevisedPayload, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(respnse=> {
        console.log("POST CLIENT WAS SUCCESSFUL 1234") 
        saveClientAsync(id)
        callback(true)
        //we inserted client succesfully without creating an address
        //now proceed to create an address
        // postAddress(addressPayload, callback, (result)=> {
        //     if (result==true){
        //         //posted address succesfully 
        //         //link address to client
        //         var addressDetails = {
        //             id: clientRevisedPayload.id, 
        //             mainAddress:addressId,
        //             addressList: [addressId]
        //         }
        //         addAddressDetails(addressDetails, callback, (result)=> {
        //             console.log("IN RETUR OF ADD ADDRESS DETAILS")
        //             if (result==true){
        //                 callback(true)
        //             }else {
        //                 callback(false)
        //             }

        //         })
               

        //     } else {
        //         callback(false)
        //     }
        // })

    }).catch(error=>{
        console.log("POST CLIENT FAILED")
        //if post client failed then we have to remove the address we just posted and return to the user there was a network error
        console.log(error)
        callback(false)
    })
}

export const getClientByPhone = (phone, callback)=> {
    console.log("IN GET CLIENT BY PHONE")
    console.log("THE PHONE")
    console.log(phone)
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/client/getbyPhone?phone=${phone}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response => {
        console.log("GET CLIENT BY PHONE RESPONSE")
        console.log(response)
        if (response.data.length>0){
            callback(response.data[0])
        } else {
            callback(null)
        }
    }).catch(error => {
        console.log(error)
        callback(null)
        
    })

}

export const getClientByEmail = (email, callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/client/getbyEmail?email=${email}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response => {
        console.log("GET CLIENT BY EMAIL RESPONSE")
        console.log(response)
        if (response.data.length>0){
            callback(false)
        } else {
            callback(true)
        }
    }).catch(error => {
        console.log(error)
        
    })
}

export const getBookingList = (clientId, callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/bookings/getBookingsforClient?clientId=${clientId}`, {
    //axios.get(`http://localhost:3000/api/paymentMethods/getById?stripeId=${stripeId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        console.log("GET BOOKING LIST RESPONSE")
        console.log(response)
        callback(response)
    }).catch(error=> {
        console.log("GET BOOKING LIST ERROR")
        console.log(error)
        callback(null)

    })

}
export const getClientPastBookings = (email) => {
    var returnList = []
    var todayDate = moment().format('YYYY-MM-DD')
    //implement fetch api call after 
    //for now just parse json
    const bookingsJson = require('../json/bookings/bookings.json')
    var bookingList = bookingsJson['bookings'];
    for (var booking in bookingList){
        if (bookingList[booking].ClientEmail == email){
            var appointment = getAppointment(bookingList[booking].AppointmentId)
            if (appointment!=null){
                var date = moment(appointment.Date).format('YYYY-MM-DD')
                if (date<todayDate){
                    returnList.push(bookingList[booking])
                }
                
                


            } else {
                //handle case where appointment is null 
            }
            
            //booking for client 
        }
    }
    return returnList

}

export const getPaymentMethod = (stripeId, callback) => {
    console.log("GET PAYMENT METHOD ENDPOINT")
    
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/paymentMethods/getById?stripeId=${stripeId}`, {
    //axios.get(`http://localhost:3000/api/paymentMethods/getById?stripeId=${stripeId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        console.log("RESPONSE")
        console.log(response)
        callback(response)
    }).catch(error=> {
        console.log("GET PAYMENT METHOD ERROR")
        console.log(error)
        callback(null)

    })

}

export const updatePaymentMethodEntry = (stripeId, mainPayment, paymentlist, callback) => {
    var params = {
        stripeId: stripeId,
        mainpaymentMethod: mainPayment,
        paymentMethodList: paymentlist
    }
   axios.post(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/paymentMethods/updatePaymentMethod`,params, {
    //axios.post(`http://localhost:3000/api/paymentMethods/updatePaymentMethod`,params, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)
    }).catch(error=> {
        console.log("UPDATE PAYMENT METHOD ERROR")
        console.log(error)
        callback(null)
    })
    
}

export const createPaymentMethodEntry = (stripeId, mainPayment, paymentlist, callback) => {
    var params = {
        stripeId: stripeId,
        mainpaymentMethod: mainPayment,
        paymentMethodList: paymentlist
    }
    console.log("CREATE PAYMENT METHOD PARAMS")
    console.log(params)
    
    axios.post(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/paymentMethods/createPaymentMethod`,params, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response => {
        console.log("CREATE PAYMENT METHOD ENTRY WAS SUCCESSFUL")
        callback(response)

    }).catch(error=> {
        console.log("CREATE PAYMENT METHOD ENTRY FAILED")
        console.log(error)
        callback(null)
    })


}
export const getStylistsList = (callback) => {
   
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/stylists/getStylists`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        console.log("GET STYLISTS WAS SUCCESSFUL")
        console.log(response)
        callback(response)

    }).catch(error=> {
        console.log("GET STYLISTS FAILED")
        console.log(error)
        callback(null)
    })

}
export const getAppointmentList =  (callback) => {
    
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/appointments/getAppointmentList`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        console.log("GET APPPOINTMENTS WAS SUCCESSFUL")
        console.log(response)
        callback(response)

    }).catch(error=> {
        console.log("GET APPOINTMENTS FAILED")
        console.log(error)
        callback(null)
    })
    

}

export const addClientStripeId = (id, stripeId, callback) => {
     axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/client/addStripeId?id=${id}&stripeId=${stripeId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        console.log("ADD CLIENT STRIPE ID WAS SUCCESSFUL")
        console.log(response)
        callback(response)

    }).catch(error=> {
        console.log("ADD CLIENT STRIPE ID FAILED")
        console.log(error)
        callback(null)
    })

}

export const getClient = async (callback) => {
    console.log("IN DATABASE GET CLIENT 3")
    var clientId = await AsyncStorage.getItem('clientId')
    console.log("THE CLIENT ID 3")
    console.log(clientId)
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/client/getClient?id=${clientId}`, {
    //axios.get(`http://localhost:3000/api/client/getClient?id=${clientId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=>{
        console.log("THE GET CLIENT RESPONSE")
        console.log(response)
        callback(response)
    }).catch(error=> {
        console.log("GET CLIENT ERROR")
        console.log(error)
        callback(null)
    })

    //check if we have a client

}
export const getClientUpcomingBookings = (email) => {
    var returnList = []
    var todayDate = moment().format('YYYY-MM-DD')
    //implement fetch api call after 
    //for now just parse json
    const bookingsJson = require('../json/bookings/bookings.json')
    var bookingList = bookingsJson['bookings'];
    for (var booking in bookingList){
        if (bookingList[booking].ClientEmail == email){
            var appointment = getAppointment(bookingList[booking].AppointmentId)
            if (appointment!=null){
                var date = moment(appointment.Date).format('YYYY-MM-DD')
                if (date>todayDate){
                    returnList.push(bookingList[booking])
                }
                
                


            } else {
                //handle case where appointment is null 
            }
            
            //booking for client 
        }
    }
    return returnList

}
export const getUpcomingConfirmed = (email) => {
    var returnList = []
    var todayDate = moment().format('YYYY-MM-DD')
    //implement fetch api call after 
    //for now just parse json
    const bookingsJson = require('../json/bookings/bookings.json')
    var bookingList = bookingsJson['bookings'];
    console.log('booking list')
    console.log(bookingList)
    console.log(email)
    for (var booking in bookingList){
        if (bookingList[booking].ClientEmail.toLowerCase() == email.toLowerCase() && bookingList[booking].Status=="confirmed"){
            console.log("worked")
            var appointment = getAppointment(bookingList[booking].AppointmentId)
            if (appointment!=null){
                var date = moment(appointment.Date).format('YYYY-MM-DD')
                if (date>todayDate){
                    returnList.push(bookingList[booking])
                }
                
                


            } else {
                //handle case where appointment is null 
            }
            
            //booking for client 
        }
    }
    return returnList

}

export const getBookingsForClient = (id, callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/bookings/getBookingsforClient?clientId=${id}`, {

        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)
    }).catch(error=> {
        console.log("GET UPCOMING ERROR")
        console.log(error)
        callback(null)
    })

}

// export const getUpcoming = (id, date, time, callback)=> {
//     axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/bookings/getBookingsForClient?id=${id}`, {

//         headers: {
//             'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

//         }
//     }).then(response=> {
//         callback(response)
//     }).catch(error=> {
//         console.log("GET UPCOMING ERROR")
//         console.log(error)
//         callback(null)
//     })

// }

export const getUpcomingPending = (email) => {
    var returnList = []
    var todayDate = moment().format('YYYY-MM-DD')
    //implement fetch api call after 
    //for now just parse json
    const bookingsJson = require('../json/bookings/bookings.json')
    var bookingList = bookingsJson['bookings'];
    for (var booking in bookingList){
        if (bookingList[booking].ClientEmail.toLowerCase() == email.toLowerCase() && bookingList[booking].Status=="pending"){
            var appointment = getAppointment(bookingList[booking].AppointmentId)
            if (appointment!=null){
                var date = moment(appointment.Date).format('YYYY-MM-DD')
                if (date>todayDate){
                    returnList.push(bookingList[booking])
                }
                
                


            } else {
                //handle case where appointment is null 
            }
            
            //booking for client 
        }
    }
    return returnList
}

//Appointment

export const getAppointment = (appointmentId, callback) => {

    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/appointments/getAppointment?appointmentId=${appointmentId}`, {

        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)
        
    }).catch(error=> {
        console.log("GET APPOINTMENT ERROR 2")
        console.log(error)
        callback(null)
    })

}

// export const getAppointment = (appointmentid) => {
//     //implement fetch api after: get appointment by appointment id 
//     //use json for now
//     const appointmentJson = require('../json/appointments/appointments.json')
//     var apptList = appointmentJson['appointments']
//     for (var appt in apptList){
//         if (apptList[appt].Id==appointmentid){
//             return apptList[appt]
//         }
//     }
//     return null
// }

export const coordstoAddress = (coords, callback)=> {
    console.log("IN COORDS TO ADDRESS FUNC 10")
    coords = JSON.parse(coords)
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/geocode/getUserAddressFromCoordinates?lat=${coords.Latitude}&long=${coords.Longitude}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    })
    .then(response=>{
        console.log("AT SUCCESSFULY GET COORDS TO ADDRESS RESPONSE 2")
        console.log(response.data)
        callback(response)
    }).catch(error=>{
        console.log("ERROR IN COORDS TO ADDRESS 2")
        console.log(error)
        callback(null)
    })


}
export const addresstoCoords = (addressPayload, callback) => {
    console.log("IN ADDRESS TO COORDS 12")
    console.log(addressPayload)
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/geocode/getUserCoordinatesFromAddress?address=${addressPayload}`,{
   //axios.get(`http:/localhost:3000/geocode/getUserCoordinatesFromAddress?address=${addressPayload}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=>{
        console.log("AT SUCCESSFULY GET STYLIST SCHEDUALE RESPONSE")
        console.log(response)
        callback(response)
    }).catch(error=>{
        console.log("ERROR IN ADDRESS TO COORDS")
        console.log(error)
        callback(null)
    })
    
}



export const getStylistScheduale = (stylistId, date, callback)=> {
    console.log("AT GET STYLIST SCHEDUALE")
    console.log(stylistId)
    console.log(date)
    
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/scheduale/getScheduale?stylistId=${stylistId}&date=${date}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=>{
        console.log("AT SUCCESSFULY GET STYLIST SCHEDUALE RESPONSE")
        console.log(response)
        callback(response)
    }).catch(error=>{
        console.log("ERROR IN GET SERVICE NAMES")
        console.log(error)
        callback(null)
    })


}


export const getStylistSchedualewithCallback = (stylistId, date, callback_, callback)=> {
    console.log("AT GET STYLIST SCHEDUALE")
    console.log(stylistId)
    console.log(date)
    
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/scheduale/getScheduale?stylistId=${stylistId}&date=${date}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=>{
        console.log("AT SUCCESSFULY GET STYLIST SCHEDUALE RESPONSE")
        console.log(response)
        callback(response)
    }).catch(error=>{
        console.log("ERROR IN GET SERVICE NAMES")
        console.log(error)
        callback(null)
    })


}

//Services

export const getAvailabilityList = async (callback) => {
    // let response = await fetch(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/availability/getAvailabilityList`, {
    //     method: 'GET', 
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json'
    //     }
    // })
    // console.log("GET AVAILABILITY LIST RES WITH FETCH")
  
    // console.log(response)
    // callback(response)
    // axios.get(`http://localhost:3000/api/availability/getAvailabilityList`, {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/availability/getAvailabilityList`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        try {
            if (response!=null){
                console.log("GET AVAILABILITY RESPONSE")
                console.log(response.data)
                callback(response)
    
            }

        } 
        catch (e) {
            console.log("IN CATCH")
            console.log(e)
            callback(null)
        }
        
       
    }).catch(err=> {
        console.log("ERROR IN GET AVAILABILITY BOOKINGS")
        console.log(err)
        callback(null)
    })


}

export const getServiceList = (stylistId, callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/services/getServicesforStylist?stylistId=${stylistId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        console.log("GET SERVICE LIST RESPONSE")
        callback(response)
        
       
    }).catch(err=> {
        console.log("ERROR IN GETTING SERVICES")
        console.log(err)
        callback(null)
    })

}

export const getServicesList = (callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/services/getServices`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=>{
        console.log("GET SERVICES LIST RESPONSE")
        callback(response)
    }).catch(error=>{
        console.log("ERROR IN GET SERVICES LIST")
        console.log(error)
        callback(null)
    })

}
export const getServicesByCategory = (subcategory, callback) => {
    console.log("AT GET SERVICES BY CATEGORY")
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/services/getServiceByCategory?category=${subcategory}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        console.log("ERROR IN GET SERVICE NAMES")
        console.log(error)
        callback(null)
    })

}

export const getStylistAppointmentByDate = (stylistId, date, callback)=> {
    console.log("GET STYLIST APPOINTMENT BY DATE API CALL")

    console.log(date)
    //axios.get(`http://localhost:3000/api/appointments/getServiceAppointmentsOnDay?serviceId=${stylistId}&date=${date}`,{
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/appointments/getStylistAppointmentsOnDay?stylistId=${stylistId}&date=${date}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

    }}).then(response=> {
        console.log("API RESPONSE FROM GET STYLIST APPOINTMENT BY DATE 2")
        console.log(stylistId)
        console.log(response)
        callback(response)

    }).catch(err=> {
        console.log("GET STYLIST APPOINTMENT BY DATE ERROR")
        console.log(err)
        callback(null)
    })

}

export const getStylistAppointment = (stylistId, callback) => {
    console.log("IN GET STYLIST APPOINTMENT")
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/appointments/getStylistAppointments?stylistId=${stylistId}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

    }}).then(response=> {
        console.log("THE GET STYLIST APPOINTMENT")
        console.log(response)
        callback(response)
    }).catch(err=> {
        console.log("GET STYLIST APPOINTMENT ERROR")
        console.log(err)
        callback(null)
    })

}

export const getServiceAppointmentbyDate = (serviceId, date, callback) => {
    console.log("GET STYLIST APPOINTMENT BY DATE API CALL")

    console.log(date)
    //axios.get(`http://localhost:3000/api/appointments/getServiceAppointmentsOnDay?serviceId=${stylistId}&date=${date}`,{
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/appointments/getServiceAppointmentsOnDay?serviceId=${serviceId}&date=${date}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

    }}).then(response=> {
        console.log("API RESPONSE FROM GET STYLIST APPOINTMENT BY DATE")
        console.log(response)
        callback(response)

    }).catch(err=> {
        console.log("GET STYLIST APPOINTMENT BY DATE ERROR")
        console.log(err)
        callback(null)
    })

}
export const getService = (serviceId, callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/services/getService?serviceId=${serviceId}`,{
    //axios.get(`http://localhost:3000/api/services/getService?serviceId=${serviceId}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }}).then(response=> {
            console.log("GET SERVICE API RESPONSE")
            console.log(response)
            callback(response)
        }).catch(error=> {
            console.log("GET SERVICE ERROR")
            console.log(error)
        })
    
    //implement fetch api after: get service by service id

    // const serviceJson = require('../json/services.json')
    // var serviceList = serviceJson['services']
    // for (var service in serviceList) {
    //     if (serviceList[service].Id == serviceId){
    //         return serviceList[service]
    //     }
    // }
    // return null
}


export const getSubcategories = (callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/subcategory/get`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        console.log("ERROR IN GET SERVICE NAMES")
        console.log(error)
        callback(null)
    })


}

//Stylist

export const getSpecialtyCategory = (specialty, callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/subcategory/getBySpecialty?specialty=${specialty}`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        console.log("ERROR IN GET SERVICE NAMES")
        console.log(error)
        callback(null)
    })

}

export const getServiceNames = (callback) => {
    
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/serviceselection/get`,{
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=>{
        callback(response)
    }).catch(error=>{
        console.log("ERROR IN GET SERVICE NAMES")
        console.log(error)
        callback(null)
    })
}

export const getStylist = async (stylistId, callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/stylists/stylist?stylistId=${stylistId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
       
        callback(response)
    }).catch(err=> {
        console.log("ERROR IN GETTING BOOKINGS")
        console.log(err)
        callback(null)
    })
}

export const getStylistwithCallback = async (stylistId, callback_,callback) => {
    axios.get(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/stylists/stylist?stylistId=${stylistId}`, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
       
        callback(response)
    }).catch(err=> {
        console.log("ERROR IN GETTING BOOKINGS")
        console.log(err)
        callback(null)
    })
}




//POST

export const createBooking = (clientId, stylistId, appointmentId, callback) => {
    var id = uuid.v4()
    var payload = {
        id: id,
        clientId: clientId,
        stylistId: stylistId,
        appointmentId: appointmentId

    }
    axios.post(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/booking/createBooking`, payload, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        console.log("SUCCESSFUL CREATE BOOKING RESULT 2")
        callback(response.data.id)
    }).catch(error=> {
        console.log("ERROR IN CREATE BOOKING")
        console.log(error)
        callback(null)
    })

}


export const createAppointment = (serviceId, stylistId, date, startTime, endTime, clientCoords, address, callback ) => {
    var id = uuid.v4() 
    var payload = {
        id: id, 
        serviceId: serviceId,
        stylistId: stylistId,
        date: date,
        startTime: startTime,
        endTime: endTime,
        clientCoords: clientCoords,
        clientAddress: address

    }
    console.log("CREATE APPOINTMENT PAYLOAD")
    console.log(payload)
    axios.post(`http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/appointment/createAppointment`, payload, {
        headers: {
            'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

        }
    }).then(response=> {
        callback(response)
    }).catch(error=> {
        console.log("CREATE APPOINTMENT ERROR")
        console.log(error)
        callback(null)
    })

}

