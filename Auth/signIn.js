import React, {useState} from 'react';
import {AWSRegion, AWSConfig, CognitoIdentityCredentials} from './lib/awsSDK'
import {Auth} from 'aws-amplify'
import {CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';


export const SignIn = () => {
    const poolData = {
        UserPoolId: "us-east-1_TFTgVe0Ly",
        ClientId: "552s952rkdapksn8ur8v8qrvvc" 
        
      }
    var userPool = new CognitoUserPool(poolData);

}

