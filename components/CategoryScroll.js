import React, {useState} from 'react';
import { StyleSheet, Text, View, Component, Dimensions, Image, TextInput, FlatList, Button, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {getSubcategories, getServiceNames, getSpecialtyCategory} from '../Database/functions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useFonts} from 'expo-font'
const CategoryScroll = (props) =>{
    let [fontsLoaded] = useFonts({
       'Lato-Heavy': require("../assets/fonts/Lato-Heavy.ttf"),
       'Lato-Medium': require("../assets/fonts/Lato-Medium.ttf"),
       'Lato-Regular': require("../assets/fonts/Lato-Regular.ttf"),
       'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
       'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
       'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf')
    });
    var currentSelection = props.currentSelection;
    var categories = props.categories;
    console.log("THE CATEGORIES IN CATEGORY SCROLL")
    console.log(categories)

    const [currentCategory, setcurrentCategory] = useState(null)
    const [categoryList, setCategoryList] = useState([])
    const [categoryFetched, setFetched] = useState(false)
    // const [categoriesInClientRegion, setcategoriesInClientRegion] = useState(null)
    const [unselectedCategories, setunselectedCategories] = useState([])

    // const fetchCategoriesListfromLocalStorage = async () => {
    //     var availableCategories = await AsyncStorage.getItem("availableServicesForClient")
    //     console.log("IN THE FETCH CATEGORIES LIST IN CATEGORY SCROLL 4")
    //     console.log(JSON.parse(availableCategories)['CategoriesInRegion'])
    //     setcategoriesInClientRegion(JSON.parse(availableCategories)['CategoriesInRegion'])

    // }

    // const setUnselectedCategoriesList = (category_) => {
    //     var unselectedList = []
    //     for (var category in categoriesInClientRegion){
    //         if (categoriesInClientRegion[category]!=category_){
    //             unselectedList.push(categoriesInClientRegion[category])

    //         }
    //     }
    //     setunselectedCategories(unselectedList)

    // }

    // if (categoriesInClientRegion==null){
    //     fetchCategoriesListfromLocalStorage()


    // }
    // if (categoriesInClientRegion!=null && currentCategory!=null && unselectedCategories.length==0){
    //     setUnselectedCategoriesList(currentCategory)
    // }

    // if (categoryFetched==false && currentCategory==null){
    //     setcurrentCategory(currentSelection)
    // }


    if (categoryFetched==false){
        
        setFetched(true)
        if (categories.length==0){
            //fetch all categories
            getSubcategories((result)=> {
                if (result.data!=null){
                    if (result.data.length>0){
                        var tempList = []
                        for (var elem in result.data){
                            if (!(tempList.includes(result.data[elem].name))){
                                tempList.push(result.data[elem].name)

                            }
                            

                        }

                        console.log("THE SUB CATEGORY RESULT IN CAT SCROLL")
                        console.log(tempList)
                        
                        setCategoryList(tempList)
                      
    
    
                    }
    
                } else {
                    alert("Network Error: Unable to load list of services")
                    return
                }
            })


        } else {
            setCategoryList(categories)



        }

    }

    if (categoryFetched==true && currentSelection!=currentCategory){
        setcurrentCategory(currentSelection)
        if (currentSelection!="All"){
        if (!(categoryList.includes("All"))){
            var tempList = ['All']
            for (var cat in categoryList){
                if (categoryList[cat]!=currentSelection){
                    tempList.push(categoryList[cat])
                }
            }
            setCategoryList(tempList)
        }
    } else {
        if (categoryList.includes("All")){
            var index = categoryList.indexOf("All")
            console.log("CATEGORY LIST AFTER FIX 123")
            console.log(categoryList.splice(index,1))
            setCategoryList(categoryList => categoryList.filter(cat=> cat!="All"))
        }
    }

    }

    const changeCategory = (category) => {
        setUnselectedCategoriesList(category)
        props.changeCategory(category)

    }
    var body = null
   
    body = 
        <ScrollView
        style={styles.scrollViewStyle}

        horizontal={true}>
            <View style={{alignSelf:'center', flexDirection:'row'}}>
            <View style={styles.allServices}>
                {fontsLoaded &&
                <Text style={{
                  
                    marginRight:20,
                    marginBottom:10,
                    fontFamily: 'Poppins-Bold',
                    fontSize: 14,
                    color: '#1A2232',
                    marginTop:5
                }}>{currentSelection.toUpperCase()}</Text>
            }
            </View>
            </View>
        </ScrollView>

   

    
    const [selectedCategory, setselectedCategory] = useState(null)
    return (
        <View>
        {body}
        </View>
    )
}

const styles = StyleSheet.create({
    allServices: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center'
       
       
    
        


    }, 
    Text: {
        fontWeight: '600',
        color: '#1A2232'

    },
    scrollText: {
        fontWeight: 'bold',
        marginRight:20,
        marginBottom:10
        
    

    },
    scrollTextBorder: {
        borderBottomWidth: 2,
        borderBottomColor: '#C2936D',
        flexDirection: "row",
        flexWrap: "wrap",
        

    },

    scrollViewStyle: {
        flexDirection: "row",
        paddingLeft:Dimensions.get('window').width*0.05,
        paddingRight:10,
        marginTop:10,
        borderBottomColor: '#9d9fa2',
        borderBottomWidth:1,
        borderTopColor: 'lightgrey',
        borderTopWidth:0.5,
        height: Dimensions.get('window').height*0.05
        


    },
    touchableStyle: {
        marginRight:20,
        marginLeft:20,
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center'
        

    }
})

export default CategoryScroll