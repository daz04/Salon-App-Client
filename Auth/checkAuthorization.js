import React, {useState} from 'react';
import {CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoUserSession, CognitoIdToken, CognitoAccessToken, CognitoRefreshToken} from 'amazon-cognito-identity-js';
// import {CognitoIdentityCredentials} from 'aws-sdk'

export const isAuthorized = () => {
    const poolData = {
        UserPoolId: "us-east-1_gJesn4jYM",
        ClientId: "3shb1v7bq3psol04dq6jh7600i"  
    }
    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser()
    // var cognitoIdentity = new CognitoIdentityCredentials({
    //     IdentityPoolId: 'us-east-1_UUYnG1z8w',
    //     UserPoolId: "us-east-1_gJesn4jYM",
    //     ClientId: "3shb1v7bq3psol04dq6jh7600i"

    // })
    // console.log(cognitoIdentity)
    // console.log("COGNITO")
    console.log("AT CHECK AUTH")
    console.log(cognitoUser)
    if (cognitoUser!=null){
        return cognitoUser
    } else {
        return null
    }


}
