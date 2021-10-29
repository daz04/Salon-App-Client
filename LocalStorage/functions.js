import AsyncStorage from '@react-native-async-storage/async-storage'


export const setClientLocationAvailable = async (boolValue) => {
    var boolValString = String(boolValue)
    try {
        await AsyncStorage.setItem(
            'clientLocationAvailable',
            boolValString
        )
    } catch (error) {
        console.log("SET CLIENT LOCATION AVAILABLE ERROR")
        console.log(error)
    }

}

export const setListOfAvailableServicesForClient = async (list) => {
    var servicesObj = {
        'CategoriesInRegion': list
    }
    console.log("IN SET LIST OF AVAILABLE SERVICES FOR CLIENT")
    console.log(servicesObj)
    try {
        await AsyncStorage.setItem(
            'availableServicesForClient',
            JSON.stringify(servicesObj)
        )
    } catch (error) {
        console.log("SET LIST OF AVAILABLE SERVICES FOR CLIENT UNAVAILABLE")
        console.log(error)
    }

}

export const getClientId = async (callback) => {
    var clientId = await AsyncStorage.getItem("clientId")
    callback(clientId)

}

export const fetchAptSuiteBldgInput = async (callback) => {
    var aptSuiteBldg = await AsyncStorage.getItem("AptSuiteBldgNumber")
    callback(aptSuiteBldg)
}

export const storeAptSuiteBldgInput = (aptsuiteBldg, callback) => {
    try{
        AsyncStorage.setItem("AptSuiteBldgNumber", aptsuiteBldg).then((response=> {
            console.log("SET ITEM FOR APT SUITE BLDG NUMBER")
            console.log(response)
            callback(response)

        }))
    } catch (err) {
        console.log("STORE APPT SUITE BLDG ERROR")
        console.log(err)
        callback(null)
    }

    
}

export const fetchCurrentAddress = (callback) => {
    AsyncStorage.getItem("currentAddress").then(result=> {
        callback(result)
    })
}

export const fetchLocationCoords = (callback) => {
    AsyncStorage.getItem('locationCoords').then(response=> {
        callback(response)
    })
}

export const storeCurrentLoation = (address) => {
    AsyncStorage.setItem("currentLocation",address)
}



