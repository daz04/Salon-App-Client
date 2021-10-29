import AsyncStorage from '@react-native-async-storage/async-storage'
export const getCurrentEmail = () => {
    var email = AsyncStorage.getItem("email")
    return email
}