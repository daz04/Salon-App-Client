import AsyncStorage from '@react-native-async-storage/async-storage'
import {CognitoUserPool,CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoUserSession, CognitoRefreshToken} from 'amazon-cognito-identity-js';
const poolData = {
    UserPoolId: "us-east-1_42wpNHMku",
    ClientId: "4pjs6bipus6a374offvrgcrr7j" 
   
    
}
var userPool = new CognitoUserPool(poolData);


function getClientInfo(clientEmail) {
    //fix to suit api's later
    var finalClient = null
    var jsonInfo = require('../json/clients/clients.json')
    var clientList = jsonInfo[Object.keys(jsonInfo)[0]];
    for (var client in clientList){
        if (client.email==clientEmail){
            finalClient = client 
            return finalClient 
            

        }
    }
    return null
}

export const getClientAddressList = () => {
    var email = null
    try {
        email = AsyncStorage.getItem("@email")

    } catch (e){
        console.log("Async storage error")
        return
    }
    var clientObj = getClientInfo(email)
    if (clientObj==null){
        console.log("Abnormal error: Logged in client does not have matching email in client database")
        return
    }
    var addressList = clientObj.Addresses 
    return addressList

}
const checkTokenExpiration = (token) => {
    var cachedSession = new CognitoUserSession(token)
    if (cachedSession.isValid()){
        return false
    } else {
        return true
    }

}
const getTokens = (session) => {
    return {
        accessToken: session.getAccessToken().getJwtToken(),
        idToken: session.getIdToken().getJwtToken(),
        refreshToken: session.getRefreshToken().getToken()
    }
}


const refreshSession = (token,email) =>{
    var RefreshToken = new CognitoRefreshToken(token.RefreshToken)
    var userData = {
        Username: email,
        Pool: userPool

    }
    var cognitoUser = new CognitoUser(userData)
    cognitoUser.refreshSession(RefreshToken, (err, session)=>{
        if (err){
            console.log(err)
            return
        }
        var tokens = getTokens(session)
        var tokenData = JSON.stringify(tokens)
        try {
            AsyncStorage.setItem('@session',tokenData)

        } catch (e){
            console.log(e)
            console.log("Async storage error")
            return
            
        }
    })

}

export const validSession = () => {
    var valid = true
    var email = null
    try{
        const value = JSON.parse(AsyncStorage.getItem('@session'))
        if (value==null){
            console.log('Abnormal error: token is not present in async storage')
            valid = false
            return valid 
           
            
        } else {
            //get the tokens and check if valid 
            try {
                email = AsyncStorage.getItem('email')
                
            } catch (e){
                console.log("Async storage error")
                return false

            }
            if (email==null){
                console.log("Abnormal error: email is not present in async storage")
                return false

            }
            
            var sessionExpired = checkTokenExpiration(value)
            if (sessionExpired){
                refreshSession(value,email)
                valid = true
                return valid 

            }
            
        }
} catch (e){
    console.log('error accessing async storage')
    return false
}
return valid
}


export const signedIn = async () =>{
    var email = null
    try {
        email = await AsyncStorage.getItem("email")

    } catch (e) {
        console.log("error with async storage")
        return false
    }
    if (email!=null){
        return true
    }
    return false

}