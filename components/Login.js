import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ActivityIndicator, Button, ImageBackground, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { Image, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import colors from '../assets/colors';

const Login = props => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');

    const phoneInput = useRef(null);

    setMessage = (message) => {
        props.dispatch({
            type: 'SET_LOGIN_MESSAGE',
            payload: message
        })
    }

    checkIfBanned = async (uid) => {
        console.log('in checkIfBanned. uid:', uid)
        return await database()
            .ref(`/users/${uid}/unbanTime`)
            .once('value')
            .then(snapshot => {
                const unbanTime = snapshot.val()
                const currentTime = new Date().getTime()
                console.log('unbanTime:', unbanTime)
                if (currentTime < unbanTime) {
                    console.log('user is banned')
                    return true
                } else {
                    console.log('user is not banned')
                    return false
                }
            })
    }

    sendCode = async () => {
        console.log('in sendCode function. phoneNumber:', phoneNumber);
        const fullPhoneNumber = '+' + phoneInput.current?.getCallingCode() + phoneNumber
        console.log('fullPhoneNumber:', fullPhoneNumber)
        if (!phoneNumber) {
            setMessage('Please enter a valid phone number to proceed.')
            return
        }
        setIsLoginLoading(true)
        try {   
            const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
            setConfirm(confirmation);
            setMessage('')
        } catch (error) {
            console.log('Error. Text not sent.', error)
            setMessage('Invalid phone number.')
        }
        setIsLoginLoading(false);
    }

    confirmCode = async () => {
        setIsLoginLoading(true)
        try {
            const user = await confirm.confirm(code);
            const uid = user.user.uid
            console.log('code is valid! user:', user)
            let isBanned = await checkIfBanned(uid)
            console.log('isBanned:', isBanned)
            console.log('typeof isBanned:', typeof(isBanned))
            if (!isBanned) {
                updateRegistrationToken(uid)
                setMessage('')
                await props.dispatch({
                    type: 'SET_USER_ID',
                    payload: uid
                })
                await props.dispatch({
                    type: 'GET_USER_DATA',
                    payload: uid
                })
                await AsyncStorage.setItem("user", JSON.stringify(user))
                props.history.push('/camera')
            } else {
                setIsLoginLoading(false)
                setMessage('You have been temporarily banned for spreading bad vibes. Try again later.')
            }
        } catch (error) {
            setIsLoginLoading(false)
            console.log('Invalid code.')
            console.log('error:', error)
            setMessage('Invalid code.')
        }
    }

    checkIfLoggedIn = async () => {
        console.log('in checkIfLoggedIn function')
        try {
            const user = JSON.parse(await AsyncStorage.getItem("user"))
            const uid = JSON.parse(await AsyncStorage.getItem("user")).user.uid
            console.log('in checkIfLoggedIn. user.user.uid:', uid)
            if (user) {
                console.log('user is true. Logging in')
                console.log('uid:', uid)
                await props.dispatch({
                    type: 'SET_USER_ID',
                    payload: uid
                })
                updateRegistrationToken(uid)
                props.history.push('/camera')
            }
        } catch (error) {
            console.log('no user item in async storage')
            //setTimeout(checkIfLoggedIn, 1000)
        }
    }

    updateRegistrationToken = async (uid) => {
        console.log('in login updateRegistrationToken. uid:', uid)
        let registrationToken = await messaging().getToken()
        await database()
            .ref(`/users/${uid}`)  // for some reason, this writes to /users/undefined
            .update({
                registrationToken: registrationToken
            })
    }

    back = () => {
        setMessage('')
        setIsLoginLoading(false)
        setConfirm(null)
    }

    // this needs work
    async function onAuthStateChanged(user) {
        console.log('in onAuthStateChanged. user:', user)
        const uid = user.user.uid

        if (user) {

        

        try {
            console.log('code is valid! user:', user)
            let isBanned = await checkIfBanned(uid)
            console.log('isBanned:', isBanned)
            console.log('typeof isBanned:', typeof(isBanned))
            if (!isBanned) {
                updateRegistrationToken(user)
                await AsyncStorage.setItem("user", JSON.stringify(user))
                setMessage('')
                props.history.push('/camera')
            } else {
                setIsLoginLoading(false)
                setMessage('You have been temporarily banned for spreading bad vibes. Try again later.')
            }
            
            
        } catch (error) {
            setIsLoginLoading(false)
            console.log('Invalid code.')
            console.log('error:', error)
            setMessage('Invalid code.')
        }

        }

        checkIfLoggedIn()
        console.log('user:', user);
    }
    
    //   useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged((user) => {
    //         if (user) {
    //             console.log('user has been signed in')
    //         } else {
    //             // User has been signed out, reset the state
    //             console.log('user has been signed out')
    //         }
    //       });
    //     return subscriber; // this line supposedly unsubscribes on unmount 
    //   }, []);



    useEffect(() =>  {
        checkIfLoggedIn()
    }, [])

    return (
        <View style={styles.container}>
            <Text 
                style={styles.message}>
                {props.reduxState.loginMessage}
            </Text>
            <Image source={require('../assets/Vibecheque_logo.png')} style={styles.logo}/>
            <View style={styles.menuContainer}>    
            {!confirm ?
            <>    
                <PhoneInput
                    ref={phoneInput}
                    onChangeText={text => setPhoneNumber(text)}
                    defaultCode={"US"}
                    placeholder={"1-800-your-mom"}
                    containerStyle={styles.phoneInput}
                    layout='second'
                    autoFocus
                >
                </PhoneInput>
                <TouchableOpacity
                    onPress={sendCode}
                    style={styles.regularButtonBlue}>
                    {isLoginLoading ? 
                        <ActivityIndicator
                            style={styles.wheel}
                            color='black'
                        /> 
                    :
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: 'Rubik-Regular'
                            }}>
                            Send Code
                        </Text>
                    }
                </TouchableOpacity>
            </>
            :
            <>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setCode(text)}
                    placeholder='code'
                    keyboardType='number-pad'
                    autoCapitalize='none'
                />
                <TouchableOpacity
                    onPress={confirmCode}
                    style={styles.regularButtonBlue}>
                    {isLoginLoading ?
                        <ActivityIndicator
                            style={styles.wheel}
                            color='black'
                        /> 
                    :
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: 'Rubik-Regular'
                            }}>
                            Login
                        </Text>
                    }
                </TouchableOpacity>
            </>
            }
            <TouchableOpacity
                onPress={() => back()}
                style={styles.backButton}>
                <Text
                    style={{
                        fontSize: 20,
                        fontFamily: 'Rubik-Regular'
                    }}>
                    Back
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

const styles = StyleSheet.create({
    container: { 
        flex: 1,  
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: colors.cream,
    },
    menuContainer: {
        flex: 1,  
        position: 'absolute',
        top: '55%',
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: 'transparent',
        width: '100%'
    },
    message: {
        position: 'absolute',
        top: '25%',
        color: colors.red, 
        fontSize: 20, 
        marginHorizontal: '15%', 
        textAlign: 'center',
        height: Platform.OS === 'ios' ? '10%' : '12%',
        fontFamily: 'Rubik-Regular'
    },
    logo: {
        resizeMode: Platform.OS === 'ios' ? 'contain' : 'cover', 
        position: 'absolute',
        top: '35%',
        width: '100%',
        height: '18%', // 17% cuts off the q on android and 19% makes the logo wider on android
        marginBottom: '5%'
    },
    input: { 
        fontSize: 20, 
        color: 'black',
        borderWidth: 0, 
        borderColor: 'black', 
        backgroundColor: 'white', 
        //padding: 12, 
        width: '75%',
        height: 50,
        fontFamily: 'Rubik-Regular',
        textAlign: 'center'
    },
    phoneInput: {
        width: '75%',
        height: 50,
    },
    regularButtonBlue: {
        width: '50%', 
        height: 40,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    regularButtonGreen: {
        width: '50%', 
        height: 40,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    backButton: {
        width: '35%', 
        height: 40,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%'
    },
    wideButtonBlue: {
        width: '80%',
        height: 40, 
        borderWidth: 0,
        borderColor: colors.red,
        borderRadius: 10,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    wideButtonGreen: {
        width: '80%',
        height: 40, 
        borderWidth: 0,
        borderColor: colors.red,
        borderRadius: 10,
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    wheel: {
        alignSelf: 'center',
        transform: Platform.OS === 'ios' ? [{ scale: 1 }] : [{ scale: 1 }]
    },
})

export default connect(mapReduxStateToProps)(Login);