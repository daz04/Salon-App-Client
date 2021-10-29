// import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View , Image, StatusBar, Alert, Linking ,Platform, Modal, Button, Dimensions} from 'react-native';
import Task from './components/Task'
// import ServiceSelection from './Onboarding/serviceSelection'
import ServiceSelection from "./Onboarding/serviceSelection"
import TopBar from './components/TopBar'
import HomeScreen from './LandingPage/HomeScreen'
import SelectTime from './SelectTime/index'
import SignUp from './Auth/UI/SignUp'
import SignUpEmail from './Auth/UI/SignUpEmail'
import EmailVerification from './Auth/UI/SignUpVerification'
import SignIn from './Auth/UI/SignIn'
import PhoneNumberForm from './Auth/UI/PhoneNumber'
import LandingHeader from './Headers/landing'
import Checkout from './Checkout/checkout'
import AddCreditCard from './components/CheckoutComps/addcreditCard'
import { createAppContainer } from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack'
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import Cart from './assets/Icons/cart.svg';
import {isAuthorized} from './Auth/checkAuthorization'
import {validSession} from './Auth/clientInfo'
import * as Application from 'expo-application'
import AppointmentOverview from './Appointments/overview'
import ProfileOverview from './Profile/overview'
import StylistOverview from './Stylist/overview'
import PhoneVeification from './Auth/UI/PhoneVerification'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PhoneVerification from './Auth/UI/PhoneVerification';
import Location from './Address/index'
import AccountVerification from './Verification/verification'
import CreditCardList from './components/CheckoutComps/creditCardList'
import HomeLocation from './components/homeLocation'
import {version} from './package.json'
import axios from 'axios'
import firebase from '@react-native-firebase/app'
import analytics from '@react-native-firebase/analytics'
import { TouchableOpacity } from 'react-native-gesture-handler';

const firebaseCredentials = Platform.select({

})


const _getLocationAsync = async () => {
  const { status } = await Location.requestPermissionsAsync();
  if (status === 'granted') {
    var theLocation = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
     console.log("THE ACTUAL LOCATION")
     console.log(theLocation)
     
  }
}

_getLocationAsync()



const LOCATION_TASK_NAME = 'background-location-task'
const requestPermissions = async () => {
  const { status } = await Location.requestPermissionsAsync();
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    });
  }
};

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     // Error occurred - check `error.message` for more details.
//     return;
//   }
//   if (data) {
//     const { locations } = data;
//     console.log("LOCATIONS IN TASK MANAGER")
//     console.log(locations)
//     // do something with the locations captured in the background
//   }
// });

var mainScreen = null 

if (validSession()==true){
  mainScreen = ServiceSelection
  

} else {
  mainScreen = PhoneNumberForm

}

const checkUpdates = (callback) => {

  axios.get('http://testenviornment-env.eba-jgnzpph2.us-east-1.elasticbeanstalk.com/api/version/getVersionClient', {
    headers: {
        'x-api-key': 'jaehgouieyr8943y23tryuwefg6723ryuhdfgv6y7we3r'

    }}).then(response=>{
      var latestVersion = response.data[0]['current']
      if (latestVersion!=version){
        callback(false)
        // if (Platform.OS==='ios'){
        //   Alert.alert(
        //     "Expired version",
        //     'Update to latest version to continue using the app', 
        //     [
        //       {'UPDATE': Linking.openURL("https://apps.apple.com/us/app/glamo/id1446779455")}
    
        //     ]
        //     )

        // } else if (Platform.OS==="android"){
        //   Alert.alert(
        //     "Expired version",
        //     'Update to latest version to continue using the app', 
        //     [
        //       {'Update': Linking.openURL("https://play.google.com/store/apps/details?id=com.glamoapp.glamo")},
        //       {'Update': Linking.openURL("https://play.google.com/store/apps/details?id=com.glamoapp.glamo")}
    
        //     ]
        //     )
        // }
      } else {
        callback(true)
      }
    }).catch(error=> {
      console.log("ERROR IN GETTING VERSION")
      console.log(error)
    })

}
// checkUpdates()



console.log("APPLICATION ID")
console.log(Application.applicationId)

// const Stack = createStackNavigator()


const computeMainScreen = async (callback) => {
  console.log('IN COMPUTE MAIN SCREEN')
    var clientId = await AsyncStorage.getItem("clientId")
    console.log("THE CLIENT ID")
    console.log(clientId)
    if (clientId!=null){
      callback("Landing")
    } else {
      callback("Phone Number")
    }
  
}

export default function App() {
  const routeNameRef = React.useRef()
  const navigationRef = React.useRef()


  const [mainScreen_, setMainScreen] = useState(null)
  const [correctVersion,setcorrectVersion] = useState(null)

  if (correctVersion==null){
    checkUpdates((result)=> {
      setcorrectVersion(result)
    })
    
  }



  if (mainScreen_==null){
    console.log("MAIN SCREEN_ IS NULL")
    computeMainScreen((result)=> {
      console.log("IN COMPUTE MAIN SCREEN RESULT")
      console.log(result)
      
      setMainScreen(result)
      
  })
}

  const AppNavigator = createStackNavigator({  
    "Main Screen": {screen: mainScreen_!=null&&mainScreen_=="Landing"?HomeScreen:PhoneNumberForm, 
    navigationOptions: {
      headerShown: false
    }},

    "Phone Number": {screen: PhoneNumberForm, 
      navigationOptions: {
        headerBackTitleVisible: false,
        headerShown: false
    
      }},
  
  
    "Card List": {screen: CreditCardList, navigationOptions: {
      header:null
    }},
    "Home Location": {screen: HomeLocation, navigationOptions: {
      header: null
    }},
    
    
  
    "Sign In": {screen: SignIn, 
      navigationOptions: {
       header:null
      }},
      "Select Service": {screen: ServiceSelection, 
        navigationOptions: {
          
          // headerBackImage: <Ionicons name="arrow-back-outline" color="black"/>,
            // headerTitle: <ImageHeader/>,
            //   headerTitleAlign: "left",
            //   headerStyle: {
            //     height:100
            //   },
              headerBackTitleVisible: false,
              header: null
        }}, 
    "Landing": {screen: HomeScreen, 
      navigationOptions: {
        headerBackTitleVisible: false,
        headerShown: false
      }
    },
    "Location": {screen: Location,
      navigationOptions: {
        header: null
      }
  
  
    },
    
      "Account Verification": {screen: AccountVerification, 
      navigationOptions: {
        header:null
      }},
     
  
    "Profile":{screen: ProfileOverview,
      navigationOptions: {
        headerShown: false
  
      }},
    "Appointments":{screen: AppointmentOverview,
      navigationOptions: {
        headerShown: false
  
      }},
   
    "Sign Up": {screen: SignUpEmail, 
      navigationOptions: {
        headerBackTitleVisible: false,
        header: null,
      
      }
    },
  
        "Sign Up Email": {screen: SignUpEmail},
        "Email Verification": {screen: EmailVerification,
        navigationOptions: {
          header: null
        }},
        "Phone Verification": {screen: PhoneVerification,
        navigationOptions: {
          header: null
        }},
        
       
        "Select Time": {screen: SelectTime,
        navigationOptions: {
          // headerBackImage: <Ionicons name="arrow-back-outline" color="black"/>,
      
          header:null
  
        }},
        'Add Credit Card': {screen: AddCreditCard,
        navigationOptions: {
          header: null
        }},
        HomeScreen: {screen: HomeScreen, 
          navigationOptions: {
            // headerBackImage: <Ionicons name="arrow-back-outline" color="black"/>,
            header: null
            },
      
      
          },
        
        "Checkout": {screen: Checkout,
        navigationOptions: {
          header:null
        }},
        "Stylist": {screen: StylistOverview,
        navigationOptions: {
          header: null
        }},
        
  
        
        
    }
  ); 

  const redirectToStore = () => {
     if (Platform.OS==='ios'){
      Linking.openURL("https://apps.apple.com/us/app/glamo/id1446779455")
          // Alert.alert(
          //   "Expired version",
          //   'Update to latest version to continue using the app', 
          //   [
          //     {'UPDATE': Linking.openURL("https://apps.apple.com/us/app/glamo/id1446779455")}
    
          //   ]
          //   )

        } else if (Platform.OS==="android"){
          Linking.openURL("https://play.google.com/store/apps/details?id=com.glamoapp.glamo")
          // Alert.alert(
          //   "Expired version",
          //   'Update to latest version to continue using the app', 
          //   [
          //     {'Update': Linking.openURL("https://play.google.com/store/apps/details?id=com.glamoapp.glamo")},
          //     {'Update': Linking.openURL("https://play.google.com/store/apps/details?id=com.glamoapp.glamo")}
    
          //   ]
          //   )
        }

  }
  const AppContainer = createAppContainer(AppNavigator);
  return (
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen 
    //     name="Sign Up"
    //     component={SignUp}
    //     options={{
    //       headerShown: false
    //     }}/>

    //   </Stack.Navigator>
    // </NavigationContainer>
    
    
      // <StatusBar barStyle='dark-content'/>
      <View style={{height:'100%', width:'100%'}} >
        {correctVersion!=null && correctVersion==true &&  <AppContainer/>}
        {correctVersion!=null && correctVersion==false && <View style={styles.modalStyle}>
        
           <Text style={{fontSize:18, color: 'white'}}>Update App Version</Text>
           <TouchableOpacity  onPress={()=>redirectToStore()} style={{backgroundColor: '#C2936D', width:Dimensions.get('window').width*0.4, 
           height:Dimensions.get('window').width*0.1, borderRadius:20, flexDirection: 'column', alignSelf: 'center',justifyContent: 'center', marginTop:'10%'}}>
            <Text style={{color:'#1A2232', alignSelf: 'center', justifyContent: 'center', fontSize:18, fontWeight:'600'}}>UPDATE</Text>
           </TouchableOpacity>
           
          </View>}
      </View>
   

   
   
    // <View style={styles.container}>
    //   {/* <SelectTime service="braiding"/> */}
    //   {/* <HomeScreen category="BRAIDING" gender="F" clientCoords={[26.2712,80.2706]} arrivalDate={"2021-04-04"} arrivalTime={"12:00 PM"}/> */}
    //   <View style={styles.screenWrapper}>
    //     <Main/>
    //    {/* <ServiceSelection/> */}
     
    //   </View> 
     
    // </View>
  );
}

// const AppNavigator = createStackNavigator({
//   CategorySearch: {
//     screen: ServiceSelection
//   },
//   TimeSearch: {
//     screen: SelectTime
//   },
//   HomePage: {
//     screen: HomeScreen
//   }

// })
// const AppContainer = createAppContainer(AppNavigator)

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#E8EAED'
  
  },
  screenWrapper: {
    paddingTop: 0,
    paddingHorizontal: 0,

  },
  sectionTitle: {
    fontSize: 24, 
    fontWeight: 'bold'
  },
  items: {
    marginTop:30
  },
  headerImg: {
    width:100,
    height:50

  },
  modalStyle: {
    backgroundColor: "#1A2232",
   
    height: '100%',
    flexDirection: 'column',

    justifyContent: 'center',
    alignItems: 'center'
  },
  updateView: {
    width: '90%',
    alignSelf: 'center',
    height: '100%'
  }
});
