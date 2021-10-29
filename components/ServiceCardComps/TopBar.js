import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground} from 'react-native';
import { useFonts } from 'expo-font';
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay'


const TopBar = (props) =>{
    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require("../../assets/fonts/Lato-Heavy.ttf"),
        'Lato-Medium': require("../../assets/fonts/Lato-Medium.ttf"),
        'Lato-Regular': require("../../assets/fonts/Lato-Regular.ttf"),
        'Lato-Light': require('../../assets/fonts/Lato-Light.ttf')
     });




    const [profilePic, setPic] = useState(null)
    const [imageFetched, setfetchImage] = useState(false)
    const [serviceImgSpinner, setServiceSpinner] = useState(true)
   
    var stylistName = props.stylistName
   
    var stylist = props.stylist
    console.log("STYLIST PROFILE PIC")
   
    var rating = props.rating 

    const fetchProfilePic = () => {
        console.log("WE ARE IN THE FETCH PROFILE PIC")
        try {
            console.log("IN TRY STATEMENT")
            axios.get(`http://nodes3-env.eba-cmt4ijfe.us-east-1.elasticbeanstalk.com/fetchprofilePic?stylistId=${stylist.id}`).then(response=> {
                console.log("FETCH PROFILE PIC RESPONSE 2")
                console.log(response)
                setPic(response.data.url)
                setServiceSpinner(false)
            }).catch(err=> {
                console.log("FETCH PROFILE PIC ERROR")
                console.log(err)
            })
            // setLoading(true)

        } catch (e) {
            console.log(e)

        }
        setfetchImage(true)
        
    }

    if (imageFetched==false){
        fetchProfilePic()
    }


    return (
        <View style={styles.container}>
            <View style={styles.leftHand}>
            <Spinner 
                visible={serviceImgSpinner}
                />
                <Image style={styles.profilepic} source={{uri:profilePic}} resizeMode={'cover'}></Image>
                <Text style={{
                    alignSelf: "center",
                    marginLeft: 10,
                    fontFamily: "Lato-Heavy",
                    fontSize:18
                }}>{stylistName}</Text>
                </View>
                <View style={styles.rightHand}></View>

        </View>

    )
} 
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        width: '100%',
        paddingBottom:10,
        marginTop:10,
        paddingTop: Dimensions.get('window').height*0.02,
        marginBottom: Dimensions.get('window').height*0.01,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#f9fafc',
 

    },
    leftHand: {
        flexDirection: "row"

    },
    rightHand: {

    },
    profilepic: {
        height: 50,
        width: 50,
        borderRadius: 50

    },
    stylistName: {
        alignSelf: "center",
        marginLeft: 10,
        fontFamily: "Lato-Heavy",
        fontSize:20
    }

})

export default TopBar;