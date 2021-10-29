import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator} from 'react-native';
import {getStylist} from '../../Database/functions'
import axios from 'axios'
const StylistProfile = (props) => {
    //pass stylist id as props to stylist profile
    console.log("AT STYLIST PROFILE 2")
    var id = props.stylistId
  
    
    const [image, setImage] = useState(null)
    const [fetchImage, setfetchImage] = useState(false)
    const [loading, setLoading] = useState(true)
    const [stylist, setStylist] = useState(null)
    const [stylistFetched, setFetched] = useState(false)


    if (stylistFetched==false){
        getStylist(id, (result)=> {
            if (result!=null && result.data.length>0){
                setStylist(result.data[0])
            }
            setFetched(true)
        })
    }
    const fetchProfilePic = () => {
        //console.log("WE ARE IN THE FETCH PROFILE PIC")
        // try {
            //console.log("IN TRY STATEMENT")
        console.log("Fetch profile pic 2", id);
       
        axios.get(`http://s3serve-env.eba-tnn9thma.us-east-1.elasticbeanstalk.com/fetchprofilePic?stylistId=${id}`, {
        //axios.get(`https://nodes3-env.eba-cmt4ijfe.us-east-1.elasticbeanstalk.com/fetchprofilePic?stylistId=${id}`, {
        // axios.get(`http://localhost:6000/fetchprofilePic?stylistId=${id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response=> {
            console.log("FETCH PROFILE PIC RESPONSE 3")
            console.log(response)
            setImage(response.data.url)
            setLoading(false)
            setfetchImage(true)
        }).catch(err=> {
            console.log("FETCH PROFILE PIC ERROR 2")
            console.log(err)
            setfetchImage(true)
        })
       
        
        
    }

    if (fetchImage==false){
        fetchProfilePic()

    }
    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
            {loading ?
            <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#1A2232"/>
            </View>
            :
            <View style={styles.imageBox}>
               
                <Image source={{uri: image}} style={styles.image}></Image>
          
            </View>
            }
                


            </View>
            {stylist!=null &&
             <View style={styles.stylistBox}>
             <Text style={styles.name}>{stylist.FirstName} {stylist.LastName}</Text>
             {stylist.Titles.map((title)=> {
                 return (
                    <Text style={styles.title}>{title}</Text>

                 )
             })}
             

            </View>
            }
           



        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '20%',
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:20,
        flexDirection: 'row',
        paddingTop:60,
        backgroundColor: 'white'

    },
    imgContainer: {
        height:'100%',
        width:'25%',
        marginRight:20
        

    },
    image: {
        height: 100,
        width: 100,
        borderRadius:100
    },
    name: {
        fontWeight:'600',
        
        fontSize:20
    },
    title: {
        fontWeight:'300',
        fontSize:14,
        color: '#1A2232',
        marginTop:5
    },
    stylistBox: {
       flexDirection: 'column',
 
       paddingTop:'7.5%',
       width: '100%'
   
       
        
    }

})
export default StylistProfile