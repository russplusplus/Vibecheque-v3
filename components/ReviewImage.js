import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import colors from '../assets/colors';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const RNFS = require('react-native-fs');
const moment = require('moment')

const dirHome = Platform.select({
    ios: `${RNFS.DocumentDirectoryPath}/Vibecheque`,
    android: `${RNFS.ExternalStorageDirectoryPath}/Vibecheque`
});
  

ReviewImage = props => {

    saveImage = () => {
        console.log('save image')
        const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
        console.log('newImageName:', newImageName)
        console.log('dirHome:', dirHome)
        RNFS.mkdir(dirHome)
        .then(() => {
            console.log('mkdir complete')
            RNFS.moveFile(props.capturedImageUri, `${dirHome}/${newImageName}`)
            .then(() => console.log('saved!'))
            .catch(error => console.log(error));
        }).catch(err => console.log(err));
    }

    return (
        <Modal isVisible={props.visible} animationInTiming={0.1} animationOutTiming={0.1} style={styles.modal}>
            <ImageBackground
                style={{ flex: 1 }}
                source={{ uri: props.capturedImageUri }}>
            {/* <View style={{ flex: 1, backgroundColor: 'black'}}> */}
                <View style={styles.iconContainer}>
                    <View style={styles.saveIconContainer}>
                        <TouchableOpacity onPress={saveImage}>
                            <MaterialIcons
                                name='save-alt'
                                style={styles.saveIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomIcons}>
                        <TouchableOpacity onPress={props.toggleReviewMode} style={styles.cancel}>
                            <Ionicons
                                name='md-close'
                                style={styles.cancelIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={props.sendImage} style={styles.sendImage}>
                            {props.isSending ? 
                                <ActivityIndicator
                                    color='black'
                                    size={40} 
                                    style={styles.wheel}   
                                />
                            :
                                <Ionicons
                                    name='md-send'
                                    style={styles.sendImageIcon}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            {/* </View> */}
            </ImageBackground> 
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        margin: 0
    },
    container: {
        flex: 6,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    iconContainer: {
        display: 'flex',
        flex: 6, 
        flexDirection: 'column', 
        justifyContent: 'flex-end',
        margin: '3%',
        marginTop: Platform.OS === 'ios' ? '8%' : '3%',
        marginBottom: Platform.OS === 'ios' ? '5%' : '3%'
    },
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cancel: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 0,
        backgroundColor: colors.red,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        paddingTop: 2,
        marginBottom: 6,
        marginLeft: 6
    },
    sendImage: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 0,
        backgroundColor: colors.blue,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        paddingTop: 2,
        marginBottom: 6,
        marginRight: 6
    },
    wheel: {
        alignSelf: 'center',
        transform: Platform.OS === 'ios' ? [{ scale: 1.7 }] : [{ scale: 1 }],
        marginBottom: 1
    },
    cancelIcon: {
        color: 'black',
        fontSize: 44,
    },
    sendImageIcon: {
        color: 'black',
        fontSize: 34
    },
    saveIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: '5%',
        marginRight: '2%'
    },
    saveIcon: {
        color: 'white',
        fontSize: 44
    }
})

export default ReviewImage