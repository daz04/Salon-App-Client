import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Component, Image, TextInput, FlatList, Button, ScrollView, ImageBackground, TouchableOpacity,
Modal, Dimensions} from 'react-native'

const CardModel = () => {
    return (
        <Modal
        animationType={'slide'}
        transparent={false}
        visible={true}
        presentationStyle={'pageSheet'} style={styles.container}>
        

        </Modal>

    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height/2
    }

})

export default CardModel

