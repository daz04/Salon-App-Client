import AsyncStorage from '@react-native-async-storage/async-storage'
import {CognitoUserPool,CognitoUserAttribute, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';


export const authenticated = () => {
    var isauthenticated = true
    try{
        const value = AsyncStorage.getItem('@session')
        if (value==null){
            isauthenticated = false
            
        } else {
            const poolData = {
                UserPoolId: "us-east-1_42wpNHMku",
                ClientId: "4pjs6bipus6a374offvrgcrr7j" 
               
                
            }
            var userPool = new CognitoUserPool(poolData);
            var cognitoUser = userPool.getCurrentUser()
            var email = null
            try {
                email = AsyncStorage.getItem('@email')

            } catch (e){
                console.log(e)
                return
            }
            var client = getClientInfo(email)
            if (client !=null){
                var addresses = client.Addresses

            } else {
                console.log("Abnormal error: client email cant be found in database")
                return
            }


            
            console.log("COGNITO USER")
            console.log(cognitoUser)
            if (cognitoUser==null){
                isauthenticated=false
            } else {
                cognitoUser.getSession((err,session)=>{
                    if (err){
                        isauthenticated=false
                    }
                })
            }

        }
    } catch (e){

    }
    return isauthenticated

}