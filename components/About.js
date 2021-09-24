import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';

import colors from '../assets/colors';
import { connect } from 'react-redux';

AntDesign.loadFont()

About = props => {

    return (
        <Modal isVisible={props.visible} animationIn='slideInUp' animationOut='slideOutDown'>
            <View style={styles.container}>
                <Image source={require('../assets/Vibecheque_logo2.png')} style={styles.logo}/>
                <Text style={styles.text}>
                    Vibecheque spreads good vibes to those who need them most. 
                    All ad revenue is donated to the Metro Denver Housing Initiative.
                </Text>
                <Text style={styles.text2}>
                    Follow us on Instagram for updates
                </Text>
                <TouchableOpacity 
                    style={styles.instagramButton}
                    onPress={() => Linking.openURL('instagram://user?username=vibecheque_app')
                                .catch(() => {
                                    Linking.openURL('https://www.instagram.com/vibecheque_app');
                                })}>
                    <AntDesign
                        name='instagram'
                        style={styles.instagramIcon}
                    />
                </TouchableOpacity>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity 
                        onPress={() => props.setIsAbout(false)} 
                        style={styles.cancelButton}>
                        <Text
                            style={styles.cancelButtonText}>
                            Back
                        </Text>
                    </TouchableOpacity>   
                </View>           
            </View>   
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1, 
        alignItems: 'center', 
        justifyContent: 'flex-end', 
        marginLeft: '5%', 
        marginRight: '5%', 
        marginTop: '30%', 
        marginBottom: '30%', 
        backgroundColor: colors.cream, 
        borderRadius: 10, 
        // paddingLeft: '5%', 
        // paddingRight: '5%',
        paddingTop: '16%',
        paddingBottom: '16%'
    },
    settingRow: {
        width: '100%',
        //height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        //borderWidth: 2,
        paddingLeft: 0,
        paddingBottom: 6
    },
    buttonsRow: {
        width: '100%',
        //height: 40,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        //borderWidth: 2,
        // paddingLeft: 0,
        paddingBottom: 16,
        marginTop: 0
    },
    text: {
        display: 'flex',
        fontSize: 20,
        textAlign: 'left',
        fontFamily: 'Rubik-Regular',
        marginBottom: '10%',
        marginLeft: '10%',
        marginRight: '10%',
        textAlign: 'center'
    },
    text2: {
        display: 'flex',
        fontSize: 20,
        textAlign: 'left',
        fontFamily: 'Rubik-Regular',
        marginBottom: '5%',
        marginLeft: '10%',
        marginRight: '10%',
        textAlign: 'center'
    },
    cancelButton: { 
        width: '75%',
        height: 40,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        marginTop: 20,
        // marginBottom: '20%',
        alignItems: 'center'
    },
    cancelButtonText: {
        fontSize: 26,
        fontFamily: 'Rubik-Regular'
    },
    logo: {
        // resizeMode: Platform.OS === 'ios' ? 'contain' : 'cover', 
        position: 'absolute',
        top: '15%',
        width: '100%',
        height: '23%', // 17% cuts off the q on android and 19% makes the logo wider on android
        marginBottom: '5%',
        padding: 0
    },
    instagramButton: {
        marginBottom: '5%'
    },
    instagramIcon: {
        fontSize: 34,
    }
})

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(About);