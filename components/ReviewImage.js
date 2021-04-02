import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import colors from '../assets/colors';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default ReviewImage = (props) => {
        return (
            <Modal isVisible={props.visible} animationInTiming={0.1} animationOutTiming={0.1} style={styles.modal}>
                <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: props.capturedImageUri }}>
                    <View style={styles.iconContainer}>
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
        paddingTop: 2
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
        paddingTop: 2
    },
    wheel: {
        alignSelf: 'center',
        transform: Platform.OS === 'ios' ? [{ scale: 2 }] : [{ scale: 1 }],
        marginBottom: 1
    },
    cancelIcon: {
        height: Platform.OS === 'ios' ? '87%' : '91%',
        color: 'black',
        fontSize: 44,
        // borderWidth: 2,
    },
    sendImageIcon: {
        height: Platform.OS === 'ios' ? '87%' : '91%',
        color: 'black',
        fontSize: 44
    }
})