import React, {forwardRef, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Svg, {SvgXml} from 'react-native-svg'
import {SimpleLineIcons} from 'react-native-vector-icons'
import {AntDesign} from 'react-native-vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler';

const MenuBar = (props) => {
    
    const selectedScreen = props.screen
    const [selectedItem, setselectedItem] = useState(0);
    const [items,setitems] = useState(['HOME','SEARCH','BOOKINGS','PROFILE'])

    const forward = (item) => {
        console.log("IN THE FORWARD FUNCTION")
        console.log(item)
        if (item=="PROFILE"){
            props.callback('PROFILE')
        }
        if (item=="SEARCH"){
            props.callback("SEARCH")
        }
        if (item=="HOME"){
            props.callback("HOME")
        }
        if (item=="BOOKINGS"){
            props.callback("BOOKINGS")
        }
    }
    
    return (
        <View style={styles.container}>
            {items.map((item)=>{
                var iconElem = null 
                var name = null;
                var size = null;
                if (item=='HOME'){
                    
                    name = 'home'
                    size = 32
                    iconElem = <SimpleLineIcons name={"home"} size={30} color={selectedScreen==item? "#C2936D":"black"}/>
                }
                else if (item=='SEARCH'){
                    name = "search"
                    size = 32
                    iconElem = <AntDesign name={"search1"} size={size} color={selectedScreen==item? "#C2936D":"black"}/>
                }
                else if (item=='BOOKINGS'){
                    //const xml =`<svg class="icon" height="512" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M480 352c-105.888 0-192 86.112-192 192s86.112 192 192 192 192-86.112 192-192-86.112-192-192-192z m0 320c-70.592 0-128-57.408-128-128s57.408-128 128-128 128 57.408 128 128-57.408 128-128 128z m96 160H160c-17.632 0-32-14.336-32-32V288c0-17.632 14.368-32 32-32h96c17.664 0 32-14.336 32-32s-14.336-32-32-32h-96c-52.928 0-96 43.072-96 96v512c0 52.928 43.072 96 96 96h416c17.696 0 32-14.304 32-32s-14.304-32-32-32z m-64-576h320c17.664 0 32 14.368 32 32v256c0 17.696 14.304 32 32 32s32-14.304 32-32V288c0-52.928-43.072-96-96-96H512c-17.664 0-32 14.336-32 32s14.336 32 32 32z m224 80a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0zM320 160h128c17.696 0 32-14.304 32-32s-14.304-32-32-32H320c-17.696 0-32 14.304-32 32s14.304 32 32 32z m640 608h-96v-96c0-17.696-14.304-32-32-32s-32 14.304-32 32v96h-96c-17.696 0-32 14.304-32 32s14.304 32 32 32h96v96c0 17.696 14.304 32 32 32s32-14.304 32-32v-96h96c17.696 0 32-14.304 32-32s-14.304-32-32-32z" fill="#333333" ></path></svg>`
                    //const xml =`<svg width="30" height="30" style=""><rect id="backgroundrect" width="50%" height="50%" x="50" y="50" fill="none" stroke="none"/><g class="currentLayer" style=""><title>Layer 1</title><g fill="#1a2232" id="svg_1" class="" fill-opacity="1"><path d="m12.9 51.4c0-7.2 0-14.3 0-21.5 0-3.9 1.5-7.2 4.6-9.5 2.1-1.6 4.5-2.2 7.2-2.2h2.3c.5 0 .7-.2.7-.7 0-.7 0-1.4 0-2 .1-1.1.5-2 1.5-2.5 1.7-.9 3.8.1 4.1 2 .2.8.2 1.6.2 2.4 0 .6.2.8.8.8h11.1c.6 0 .8-.2.8-.8 0-.8 0-1.5.1-2.2.2-2 2.2-3.1 4-2.2.8.4 1.3 1.1 1.5 2 .1.8.1 1.7.1 2.5 0 .5.2.8.8.7h11.4c.5 0 .8-.2.8-.7 0-.6 0-1.2 0-1.8.1-1.8 1.2-3 2.8-3s2.8 1.3 2.8 3v1.9c0 .5.2.7.7.7 1.3 0 2.6 0 3.9.2 4.1.4 7 2.4 8.9 5.9.9 1.7 1.3 3.5 1.3 5.3v15.6c0 2.1-1.6 3.5-3.5 3-1.4-.3-2.2-1.5-2.2-3.3 0-3.5 0-7 0-10.5 0-1.8.1-3.7-.1-5.5-.2-2.7-2.7-5-5.4-5.1-1.1 0-2.1 0-3.2 0-.5 0-.7.2-.7.7 0 1-.1 2-.2 2.9-.2 1.2-1.5 2-2.7 1.9-1.3-.1-2.5-.8-2.6-2.1-.2-.9-.2-1.8-.2-2.8 0-.5-.2-.7-.7-.7-3.8 0-7.6 0-11.5 0-.5 0-.8.2-.8.7 0 .8 0 1.7-.1 2.5-.2 1.4-1.2 2.3-2.7 2.4-1.3.1-2.6-1-2.8-2.3-.1-.8-.1-1.7-.1-2.5 0-.5-.2-.8-.7-.8-3.8 0-7.5 0-11.2 0-.5 0-.7.2-.7.7 0 .8 0 1.8-.2 2.6-.2 1.2-1.3 2.2-2.6 2.2-1.2.1-2.4-.7-2.7-1.9-.2-.9-.2-1.9-.2-2.9 0-.5-.2-.7-.7-.7-.8 0-1.7.1-2.5 0-3-.2-5.9 2.5-5.9 5.6v.7 42.4c0 1.2.1 2.4.7 3.5 1 1.6 2.3 2.6 4.2 2.8.8.2 1.3.2 1.8.2h19.9c1 0 1.9.1 2.7.8.9.8 1.2 1.9.7 3.1-.5 1.1-1.4 1.5-2.5 1.7-.2 0-.5 0-.7 0-6.9 0-13.8 0-20.6 0-3.8 0-6.9-1.4-9.3-4.4-1.7-2.2-2.4-4.6-2.4-7.3 0-7.2 0-14.4 0-21.5z" id="svg_2" fill="#1a2232" fill-opacity="1"/><path d="m33.3 66.4c0 1.5-1.2 2.8-2.8 2.8-1.5 0-2.8-1.2-2.8-2.8 0-1.5 1.2-2.8 2.8-2.9 1.5.2 2.8 1.4 2.8 2.9z" id="svg_3" fill="#1a2232" fill-opacity="1"/><path d="m42.8 63.7c1.5 0 2.8 1.3 2.8 2.8s-1.2 2.8-2.8 2.8c-1.5 0-2.8-1.2-2.8-2.8-.1-1.5 1.2-2.8 2.8-2.8z" id="svg_4" fill="#1a2232" fill-opacity="1"/><path d="m27.7 42c0-1.5 1.3-2.8 2.8-2.8s2.8 1.3 2.8 2.8-1.3 2.8-2.8 2.8c-1.5.1-2.8-1.2-2.8-2.8z" id="svg_5" fill="#1a2232" fill-opacity="1"/><path d="m27.7 54.3c0-1.5 1.2-2.8 2.8-2.8 1.5 0 2.8 1.3 2.8 2.8s-1.2 2.8-2.8 2.8c-1.5 0-2.8-1.3-2.8-2.8z" id="svg_6" fill="#1a2232" fill-opacity="1"/><path d="m64.5 42c0-1.5 1.3-2.8 2.8-2.8s2.8 1.4 2.8 2.8-1.3 2.8-2.8 2.8c-1.4.1-2.8-1.3-2.8-2.8z" id="svg_7" fill="#1a2232" fill-opacity="1"/><path d="m40 54.2c0-1.5 1.4-2.8 2.9-2.8 1.5.1 2.8 1.4 2.8 2.8 0 1.5-1.4 2.8-2.8 2.8-1.8.1-3-1.3-2.9-2.8z" id="svg_8" fill="#1a2232" fill-opacity="1"/><path d="m52.2 42c0-1.5 1.3-2.8 2.8-2.8s2.8 1.3 2.8 2.8-1.3 2.8-2.8 2.8c-1.5.1-2.8-1.3-2.8-2.8z" id="svg_9" fill="#1a2232" fill-opacity="1"/><path d="m40 42c0-1.5 1.3-2.8 2.8-2.8s2.8 1.3 2.8 2.8-1.3 2.8-2.8 2.8c-1.6.1-2.8-1.2-2.8-2.8z" id="svg_10" fill="#1a2232" fill-opacity="1"/><path d="m65.2 64.6c0-.8 0-1.7 0-2.5v2.5 2.5c0-.8 0-1.7 0-2.5z" id="svg_11" fill="#1a2232" fill-opacity="1"/><path d="m74.7 68.5c-.4 1.1-1.3 1.6-2.3 1.7-1.5.2-3.1.2-4.6 0-1.8-.2-2.6-1.4-2.6-3.2 0-.8 0-1.7 0-2.5s0-1.7 0-2.5c.1-1.8 1.2-3 2.8-3 2-.1 2.7 1.5 2.8 2.9.1.6.1 1.3 0 1.9 0 .6.2.8.8.8.9 0 1.8.2 2.5.8.8 1 1 2 .6 3.1z" id="svg_12" fill="#1a2232" fill-opacity="1"/><path d="m68 50.5c-9.4 0-17 7.6-17 16.9 0 9.4 7.6 17.1 17 17.1s17.1-7.6 17.1-17-7.6-17-17.1-17zm0 28.3c-6.5 0-11.5-5.5-11.3-11.3-.2-6.2 5.2-11.4 11.3-11.4 5.8 0 11.4 4.9 11.5 11.3-.1 6.3-5.2 11.4-11.5 11.4z" id="svg_13" fill="#1a2232" fill-opacity="1"/><path d="m71.6 64.7c-.6 0-.8-.2-.8-.8.1-.6.1-1.3 0-1.9-.2-1.5-.8-3-2.8-2.9-1.6.1-2.8 1.3-2.8 3v2.5 2.5c.1 1.8.9 2.9 2.6 3.2 1.5.2 3.1.2 4.6 0 1.1-.1 2-.6 2.3-1.7.4-1.1.2-2.2-.7-3-.6-.8-1.5-.9-2.4-.9z" id="svg_14" fill="#1a2232" fill-opacity="1"/></g></g></svg>`
                    iconElem = null
                    if (selectedScreen==item){
                        iconElem = <Image style={{
                            width:30,
                            height:30
                        }} source={require("../assets/Icons/Menu/appointmentSelected.png")} width={30} height={30}/>

                    } else {
                        iconElem = <Image style={{
                            width:30,
                            height:30
                        }} source={require("../assets/Icons/Menu/appointments.png")} width={30} height={30}/>
                    }
                  
                }
                else {
                    name='person-outline'
                    size = 32
                    iconElem = <Ionicons name={name} size={size} color={selectedScreen==item? "#C2936D":"black"} />

                }
                


            return (
                <TouchableOpacity style={styles.menuItem} onPress={()=>forward(item)}>
            {/* <Ionicons name={name} size={size} color={selectedScreen==item? "#C2936D":"black"} /> */}
            {iconElem}
           
            </TouchableOpacity>

            )
            })}
   
        </View>
    )
}
const styles= StyleSheet.create({
    container: {
        position: 'absolute',
        bottom:0,
        height: Dimensions.get('window').height*0.075,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginTop:5,
        backgroundColor: 'white',
        paddingTop:5,
        borderTopColor: 'lightgray',
        borderTopWidth: 1
    },
    menuItem: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft:20,
        marginRight:20

    },
    title: {
        fontWeight: '600',
        marginTop:5,
        fontSize:12
    },
    selectedTitle: {
        fontWeight: '600',
        marginTop:5,
        fontSize:12,
        color: '#C2936D'

    }

})

export default MenuBar
