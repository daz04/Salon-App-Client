import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Modal from 'react-native-modal'
import {Slider} from 'react-native-elements'
import {Ionicons} from 'react-native-vector-icons'
import { useFonts } from 'expo-font';

const Filter = (props) => {
    let [fontsLoaded] = useFonts({
        'Lato-Heavy': require('../../assets/fonts/Lato-Heavy.ttf'),
        'Lato-Regular': require('../../assets/fonts/Lato-Regular.ttf'),
        'Lato-Semibold': require('../../assets/fonts/Lato-Semibold.ttf')

    })
    //pass visibility here
    var visible = props.isVisible
    //exit function once we want to exit 
    
    var minPrice = props.minPrice
    var maxPrice = props.maxPrice
    var priceOptions = ['Low to High','High to Low']
    var timeOptions = ['Earliest to Latest', 'Latest to Earliest']
    const [priceSelected, setSelected] = useState(-1)
    const [timeSelected, setTime] = useState(-1)

    const updatePriceSelect = (price) => {
        console.log("UPDATE PRICE SELECT")
        var newprice = priceOptions.indexOf(price)
        console.log(newprice)
        setSelected(newprice)

    }
    const updateTimeSelect = (time) => {
        var newtime = timeOptions.indexOf(time)
        setTime(newtime)
    }
    const reset = () => {
        setSelected(-1)
        setTime(-1)
    }

    const exit = () => {
        props.exit(priceSelected, timeSelected)
    }

    const submit = () => {
        var priceFilterOption = null
        var timeFilterOption = null
        var filterPayload = {

        }
        if (priceSelected!=-1){
            priceFilterOption = priceOptions[priceSelected]
            filterPayload['priceFilter'] = priceFilterOption

        }
        if (timeFilterOption!=-1){
            timeFilterOption = timeOptions[timeSelected]
            filterPayload['timeFilter'] = timeFilterOption
        }
        props.setOption(filterPayload)
        props.exit(priceSelected, timeSelected)
    }
    

    return (
        <View>
            <Modal
            isVisible={visible}
            style={styles.modal}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            >
                <View style={styles.container}>
                    <View style={styles.body}>
                    <View style={styles.top}>
                        <TouchableOpacity onPress={()=>exit()}>
                            <Text>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.sortText}>SORT BY</Text>
                        <TouchableOpacity onPress={()=>reset()}>
                        <Text style={styles.resetText}>RESET</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.priceSlider}>
                        <Text style={styles.sortByPrice}>Sort By Price</Text>
                        {priceOptions.map((price)=> {
                            console.log("RENDERED")
                            console.log(priceSelected)
                                return (
                                    <View style={styles.priceOption}>
                           
                                    <TouchableOpacity style={styles.checkbox} onPress={()=>updatePriceSelect(price)}>
                                    <View style={{backgroundColor: priceOptions.indexOf(price)==priceSelected?'#1A2232':'transparent', display:priceOptions.indexOf(price)==priceSelected?'block':'none', width: 30,height:30,borderRadius: 20,}}> 
                                        <Ionicons name='checkmark-outline' size={25} style={styles.check}></Ionicons>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.option}>{price}</Text>
                                    </View>
                                    
                                )
                            })}

                    </View>
                    <View style={styles.timeSlider}>
                        <Text style={styles.sortByTime}>Sort by Time</Text>
                        {timeOptions.map((time)=> {
                            return (
                            <View style={styles.timeOption}>
                                 <TouchableOpacity style={styles.checkbox} onPress={()=>updateTimeSelect(time)}>
                                    <View style={{backgroundColor: timeOptions.indexOf(time)==timeSelected?'#1A2232':'transparent', display:timeOptions.indexOf(time)==timeSelected?'block':'none', width: 30,height:30,borderRadius: 20,}}> 
                                        <Ionicons name='checkmark-outline' size={25} style={styles.check}></Ionicons>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.option}>{time}</Text>
                                
                            </View>
                            )
                        })}
                    </View>
                    

                </View>
   
        
      
        <TouchableOpacity style={{flexDirection: "row",
       
        // flex: 1,
        justifyContent: 'center',
        bottom:-Dimensions.get('window').height*0.05,
        display: priceSelected!=-1 || timeSelected!=-1? 'flex':'none',
        padding:'2%',
        alignSelf: 'center',
        backgroundColor: "#1A2232",
       //height: 70,
        height: '25%',
        
        width: '100%'}} onPress={()=>submit()}>
                <Text style={styles.confirmText}>Submit</Text>
            </TouchableOpacity>
        
               
                </View>
                
            </Modal>
          
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        width:'75%',
        alignSelf: 'flex-end',
        marginLeft:10,
       
        flexDirection: 'column',
        backgroundColor: '#f3f7f9',
       
      
        
        


    },
    modal: {
        marginRight:0,
        paddingRight:0,
        marginTop:0,
        marginBottom:0,
        
       
       
    }, 
    confirmText: {
        color: 'white',
        fontWeight: '600',
        fontSize:16,
        alignSelf: 'center'
    },
    body: {
        marginRight:10,
        marginLeft:10

    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:'20%',
        marginBottom:10
    },
    sliderDescription: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom:10
    },
    resetText: {
        fontSize:10,
        alignSelf: 'flex-end',
        
    },
    range: {
        fontSize:11
    },
    priceOption: {
        flexDirection: 'row'
    },
    timeOption: {
        flexDirection: 'row'

    },
    checkbox: {
        width: 30,
        height:30,
        borderRadius: 20,
        borderWidth:0.5,
        borderColor: "#1A2232",
        marginRight:10,
        marginBottom:10,
    
    },
    check: {
        color: 'white',
        alignSelf: 'center'
    },
    option: {
        paddingTop:'2%',
        fontSize:13
       
    },
    sortByPrice: {
        marginBottom:10,
        marginTop:20,
        fontFamily: 'Lato-Regular'
    },
    sortByTime: {
        marginBottom:10,
        marginTop:30,
        fontFamily: 'Lato-Regular'
    },
    sortText: {
        fontFamily: 'Lato-Semibold'
    }
    
})
export default Filter