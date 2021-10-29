import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
export const storeServicesFromDatabase = (servicesList) => {
    var servicesDict = {
        services: servicesList,
        dateStored: moment().format("YYYY-MM-SS HH:mm:ss")
    }
    try {
        await AsyncStorage.setItem(
            'servicesFromDatabase',
            JSON.stringify(servicesList)
        )
    } catch (error) {
        console.log("STORE SERVICES FROM DATABASE ERROR")
        console.log(error)
    }
}

