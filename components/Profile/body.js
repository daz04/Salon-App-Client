import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button ,ScrollView, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
// import ImagePicker from 'react-native-image-picker'
import * as ImagePicker from 'expo-image-picker';
import Svg, {SvgXml} from 'react-native-svg';
import MenuBar from '../MenuBar'
import {useFonts} from 'expo-font'
import {getPutClientProfilePicUrl, fetchClientProfilePicUrl} from '../../Services/S3/functions'
import * as ImageManipulator from 'expo-image-manipulator'
import Spinner from 'react-native-loading-spinner-overlay'





const ProfileBody = (props) => {
    var client = props.client 
    //need to initialize these states to values in client table
    const [number, setNumber] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirst] = useState('')
    const [lastName, setLast] = useState('')
    const [birthday, setBirthday] = useState("")
    const [image, setImage] = useState(null)
    const [imagePostUrl, setImageUrl] = useState(null)
    // const [imageUrl, setImage] = useState(null)

    const generateClientImagePostUrl = () => {
        console.log("IN GENERATE CLIENT IMAGE POST URL 1")
        console.log(client.id)
        getPutClientProfilePicUrl(client.id, (result)=> {
            console.log("PUT CLIENT PROFILE PIC URL 13")
            console.log(result.data.url)
            setImageUrl(result.data.url)
           
        })
    }

    const generateGetProfileImage = () => {
        fetchClientProfilePicUrl(client.id, (result)=> {
            console.log("RETRIEVE CLIENT IMAGE 1")
            console.log(result.data)
            setImage(result.data.url)
        })
    }

    const postImage = async (imageUrl) => {

        var response = await fetch(imageUrl)
        var blob = await response.blob()
        try {
            fetch(imagePostUrl, {
                method: 'PUT',
                body: blob
            })
        } catch (e) {
            console.log("POST SERVICE IMAGE ERROR")
            console.log(e)
            Alert.alert("Network Error", "Error uploading image")
        }
    }


    useEffect(() => {
        if (client!=null){
            generateClientImagePostUrl()
            generateGetProfileImage()

        } 
    });

    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require("../../assets/fonts/Lato-Heavy.ttf"),
        'Lato-Medium': require("../../assets/fonts/Lato-Medium.ttf"),
        'Lato-Regular': require("../../assets/fonts/Lato-Regular.ttf"),
        'Lato-Light': require('../../assets/fonts/Lato-Light.ttf'),
        'Lato-Semibold': require('../../assets/fonts/Lato-Semibold.ttf'),
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
        "Poppins-Regular": require('../../assets/fonts/Poppins-Regular.ttf')
     });



    const redirect = (screen) => {
        console.log("PROFILE BODY REDIRECT")
        console.log(screen)
        if (screen=="HOME"){
            props.redirect("HOME")
        } else if (screen=="BOOKINGS"){
            props.redirect("BOOKINGS")
        } else if (screen=="SEARCH"){
            props.redirect("SEARCH")
        }
    }

    // useEffect(() => {
    //     (async () => {
    //       if (Platform.OS !== 'web') {
    //         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //         if (status !== 'granted') {
    //           alert('Sorry, we need camera roll permissions to make this work!');
    //         }
    //       }
    //     })();
    //   }, []);

    const _handleBirthday = (input) => {
        if (input.length>birthday.length){
            if (input.length==2 || input.length==5){
                setBirthday(birthday => input+"-")
            } else {
                setBirthday(birthday=>input)
            }
        }
        if (input.length<birthday.length){
            if (birthday.charAt(birthday.length-1)=="-"){
                setBirthday(birthday=>birthday.slice(0,-2))
            } else {
                setBirthday(birthday=>input)
            }
        }

    }
    const _handleNumberChange = (input) => {
        if (input.length>number.length){
            if ((input.replace(/[-]/g,'').length) % 3==0  && number.replace(/[-]/g,'').length>0 && number.replace(/[-]/g,'').length <7){
                setNumber(number => input + "-")
            } else {
                setNumber(number => input)
            }
        }
        if (input.length<number.length){
            console.log("IN DELETE")
            if (number.charAt(number.length-1)=="-"){
                setNumber(number=>number.slice(0,-2))
            } else {
                setNumber(number=>input)
            }
        }

    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality:1
        })
        if (!result.cancelled){
            var heightToWidth = result.height/result.width
            const manipResult = await ImageManipulator.manipulateAsync(
                result.uri, 
                [{resize: {width:300, height: 300*heightToWidth}}],
                {format: 'jpeg'}
            )
            console.log('THE MANIPULATE RESULT')
            console.log(manipResult)
            setImage(manipResult.uri)
            postImage(manipResult.uri)

        }

    }
    var imageElem = null 
    const xml =`<svg class="icon" height="512" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M480 352c-105.888 0-192 86.112-192 192s86.112 192 192 192 192-86.112 192-192-86.112-192-192-192z m0 320c-70.592 0-128-57.408-128-128s57.408-128 128-128 128 57.408 128 128-57.408 128-128 128z m96 160H160c-17.632 0-32-14.336-32-32V288c0-17.632 14.368-32 32-32h96c17.664 0 32-14.336 32-32s-14.336-32-32-32h-96c-52.928 0-96 43.072-96 96v512c0 52.928 43.072 96 96 96h416c17.696 0 32-14.304 32-32s-14.304-32-32-32z m-64-576h320c17.664 0 32 14.368 32 32v256c0 17.696 14.304 32 32 32s32-14.304 32-32V288c0-52.928-43.072-96-96-96H512c-17.664 0-32 14.336-32 32s14.336 32 32 32z m224 80a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0zM320 160h128c17.696 0 32-14.304 32-32s-14.304-32-32-32H320c-17.696 0-32 14.304-32 32s14.304 32 32 32z m640 608h-96v-96c0-17.696-14.304-32-32-32s-32 14.304-32 32v96h-96c-17.696 0-32 14.304-32 32s14.304 32 32 32h96v96c0 17.696 14.304 32 32 32s32-14.304 32-32v-96h96c17.696 0 32-14.304 32-32s-14.304-32-32-32z" fill="#333333" ></path></svg>`
    if (image==null){
        imageElem = <SvgXml  style={styles.camera} xml={xml} width={50} height={50}/>
    } else {
        imageElem = <Image source={{uri:image}} style={{width:120,height:120, borderRadius: 100}}/>
    }
  
    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
            <ScrollView scrollEnabled={true} >
            <View style={styles.imageBox}>
                <TouchableOpacity onPress={()=> pickImage()}>
                {imageElem}
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <View>
                    {fontsLoaded &&
                    <Text style={{
                          color: "#1A2232",
                          fontSize:16,
                          marginBottom:5,
                          fontWeight: '600',
                          fontFamily: 'Poppins-Medium'
                    }}>First Name</Text>
                }
                    {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <TextInput style={styles.input}
                    value={firstName}
                    onChangeText={setFirst}
                    ></TextInput>
                    </TouchableWithoutFeedback> */}
                    {fontsLoaded &&
                    <Text style={{
                         marginBottom:Dimensions.get("window").height*0.05,
                         fontFamily: 'Poppins-Regular'
                    }}>{client.FirstName}</Text>
                }
                </View>
                <View>
                    {fontsLoaded &&
                    <Text style={{
                          color: "#1A2232",
                          fontSize:16,
                          marginBottom:5,
                          fontWeight: '600',
                          fontFamily: 'Poppins-Medium'
                    }}>Last Name</Text>
                }
                    {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <TextInput style={styles.input}
                    value={lastName}
                    onChangeText={setLast}
                    ></TextInput>
                    </TouchableWithoutFeedback> */}
                    {fontsLoaded &&
                    <Text style={{
                        marginBottom:Dimensions.get("window").height*0.05,
                        fontFamily: 'Poppins-Regular'

                    }}>{client.LastName}</Text>
                }
                </View>
                <View>
                    {fontsLoaded && 
                    <Text style={{
                        color: "#1A2232",
                        // fontFamily: "Lato-Semibold",
                        fontSize:16,
                        marginBottom:5,
                        
                        fontWeight: '600',
                        fontFamily: 'Poppins-Medium'
                    }}>Email</Text>
                }
                 
                    {fontsLoaded &&
                    <Text style={{
                         marginBottom:Dimensions.get("window").height*0.05,
                         fontFamily: 'Poppins-Regular'
                    }}>{client.Email}</Text>
                }

            </View>
            <View>
                {fontsLoaded &&
                <Text style={{
                    color: "#1A2232",
                    fontSize:16,
                    marginBottom:5,
                    fontWeight: '600',
                    fontFamily: 'Poppins-Medium'
                }}>Phone</Text>
            }
                <View style={styles.phone}>
                    {fontsLoaded &&
                    <Text style={{
                         marginBottom:Dimensions.get("window").height*0.05,
                         fontFamily: 'Poppins-Regular'
                    }}>+1{client.Phone}</Text>
                }

            </View>
            </View>
            <View>
            {fontsLoaded &&
            <Text style={{
                color: "#1A2232",
                fontSize:16,
                marginBottom:5,
                fontWeight: '600',
                fontFamily: 'Poppins-Medium'
            }}>Birthday</Text>
        }
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <TextInput value={birthday}
               onChangeText={_handleBirthday}
               maxLength={10}
               placeholder="DD-MM-YYYY" style={styles.input}/>
               </TouchableWithoutFeedback> */}
               {fontsLoaded &&
               <Text style={{
                    marginBottom:Dimensions.get("window").height*0.05,
                    fontFamily: 'Poppins-Regular'
               }}>{client.Birthdate}</Text>
            }
                
            </View>
            {/* <View>
                <TouchableOpacity style={styles.updateBox}>
                    <Text style={styles.updateText}>UPDATE</Text>
                </TouchableOpacity>
            </View> */}
           

            </View>
            </ScrollView>
            </View>
           

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: "column",
        backgroundColor: '#f2f2f2'

    },
    wrapper: {
        height:Dimensions.get('window').height<800?Dimensions.get('window').height *0.7:Dimensions.get('window').height *0.9,




    },
    
    imageBox: {
        backgroundColor: '#dae0ee',
        borderRadius: 100,
        height: 120,
        width:120,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop:20

    },
    camera: {
        alignSelf: 'center'
    },
    body: {
        height: Dimensions.get('window').height *0.65,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight:20,
    
       
    },
    phone:{
        
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width:'100%',
        marginTop:10
       


    },
    ext: {
        width: 50,
        height:50,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth:1,
        borderBottomWidth:1,
        borderLeftWidth:1,

        borderColor: 'lightgray'
    },
    extText: {
        fontWeight:'400',
        fontSize:18

    },
    numberInput: {
        height:50,
        width:Dimensions.get('window').width-90,
        backgroundColor: 'white',
        borderWidth:1,
        borderColor: 'lightgray',
        
        marginBottom:20,
       
        fontSize: 18,
        paddingLeft:20
        
    },
    text: {
        color: '#1A2232',
        fontWeight: '500'
    },
    input: {
        height:50,
        backgroundColor: 'white',
        borderWidth:1,
        borderColor: 'lightgray',
        marginTop:10,
        marginBottom:20,
       
        fontSize: 18,
        paddingLeft: 20,
        

    },
    updateBox: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        // flex: 1,
        justifyContent: 'center',
       
        // position: 'absolute',
        // bottom:0,
        borderRadius:5,
        padding:20,
        alignSelf: 'center',
        backgroundColor: "#1A2232",
        // height: 50,
        width:'100%'
    },
    updateText: {
        color: 'white',
        fontWeight: '600',
        fontSize:16
    },
    inputText: {
        color: "#1A2232",
        // fontFamily: "Lato-Semibold",
        fontSize:16,
        marginBottom:5,
        
        fontWeight: '600'
    },
    value: {
        marginBottom:Dimensions.get("window").height*0.05
    }
})
export default ProfileBody