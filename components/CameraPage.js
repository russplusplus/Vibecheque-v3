import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, TouchableNativeFeedbackBase, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';

import Logout from './Logout';
import ReviewImage from './ReviewImage';
import NoFavorite from './NoFavorite';
import Settings from './Settings';

import colors from '../assets/colors';

FontAwesome.loadFont()
Ionicons.loadFont()


const CameraPage = props => {

    const [isLogoutMode, setIsLogoutMode] = useState(false)
    const [isReviewMode, setIsReviewMode] = useState(false)
    const [isNoFavoriteMode, setIsNoFavoriteMode] = useState(false)
    const [isSettingsMode, setIsSettingsMode] = useState(false)
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back)
    const [capturedImageUri, setCapturedImageUri] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isInboxLoading, setIsInboxLoading] = useState(false)
    const cameraRef = useRef(null)

    // state = {
    //     isLogoutMode: false,
    //     isReviewMode: false,
    //     isNoFavoriteMode: false,
    //     isSettingsMode: false,
    //     cameraType: RNCamera.Constants.Type.back,
    //     capturedImageUri: '',
    //     uid: '',
    //     isSending: false,
    //     isInboxLoading: false
    // }

    logout = () => {
        console.log('in logout function')
        props.dispatch({
            type: 'LOGOUT',
            history: props.history
        })
    }

    switchCamera = () => {
        setCameraType(
            // these might just be 1 or 0, look into that with a real device
            cameraType === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
        )
        console.log(cameraType)
    }

    toggleLogoutMode = () => {
        console.log('in toggleLogoutMode')
        setIsLogoutMode(isLogoutMode ? false : true)
    }

    toggleReviewMode = () => {
        setIsReviewMode(isReviewMode ? false : true)
    }

    toggleNoFavoriteMode = () => {
        setIsNoFavoriteMode(isNoFavoriteMode ? false : true)
    }

    takePicture = async () => {
        if (cameraRef) {
            const options = { quality: 1, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);   //current? this attribute is new, as described in tutorial
            console.log('uri:', data.uri);
            setCapturedImageUri(data.uri)
            console.log('after setState')
            toggleReviewMode()
        }
    }

    sendImage = async () => {
        console.log('in sendImage. didTheyFavorite:', props.reduxState.didTheyFavorite)
        if (props.reduxState.userID) {
            console.log('props.reduxState.userID found.', props.reduxState.userID)
            setIsSending(true)
            
            // generate filename from current time in milliseconds
            let filename = new Date().getTime();
            console.log('filename:', filename)
            const ref = storage().ref('images/' + String(filename));
            const metadata = {
                customMetadata: {
                    fromUid: props.reduxState.userID,
                    toUid: props.reduxState.respondingTo,
                    didTheyFavorite: props.reduxState.didTheyFavorite
                }
            }
            await ref.putFile(capturedImageUri, metadata);
            
            console.log('props.reduxState.respondingTo:', props.reduxState.respondingTo)
            props.dispatch({  // image is sent, therefore not responding anymore 
                type: 'SET_NOT_RESPONDING'
            })
            props.dispatch({  // if they favorite, this well be set back to false
                type: 'SET_DID_THEY_FAVORITE',
                payload: 'false'
            })
            toggleReviewMode()
            setIsSending(false)
        } else {
            console.log('userID not found')
        }
    }

    viewInbox = async () => {
        console.log('in viewInbox')
        if (props.reduxState.userData.inbox) {
            props.history.push('/ViewInbox')
        } else {
            console.log('inbox is empty')
            setIsInboxLoading(true)
            await props.dispatch({
                type: 'GET_USER_DATA'
            })
            setIsInboxLoading(false)
            console.log('already done')
        }
    }

    viewFavorite = () => {
        console.log('in viewFavorite. props.reduxState.userData.favorite:', props.reduxState.userData.favorite)
        if (props.reduxState.userData.favorite) {
            props.history.push('/favorite')
        } else {
            toggleNoFavoriteMode()
        }
    }

    toggleSettingsMode = async () => {
        console.log('in toggleSettingsMode. reduxState.newSettings:', props.reduxState.newSettings)
        setIsSettingsMode(isSettingsMode ? false : true)
    }

    requestUserPermission = async () => {
        const permissionSettings = await messaging().requestPermission();

        if (permissionSettings) {
            console.log('Messaging permission settings:', permissionSettings);
        }
    }

    getUserData = async () => {
        await props.dispatch({
            type: 'GET_USER_DATA'
        })
    }

    setUid = async () => {
        //let uid = JSON.parse(await AsyncStorage.getItem('user')).uid
        let uid = props.reduxState.userID
        console.log('uid:', uid)
        props.dispatch({
            type: 'SET_USER_ID',
            payload: uid
        })
    }

    useEffect(() => {
        console.log('props.reduxState.userData:', props.reduxState.userData)
        //setUid()
        getUserData()
        props.dispatch({  // updates user's divice registration token in database
            type: 'GET_REGISTRATION_TOKEN'
        })
    
        requestUserPermission()
    }, [])

    // componentDidMount = async () => {
    //     console.log('this.props.reduxState.userData:', this.props.reduxState.userData)
    //     let uid = JSON.parse(await AsyncStorage.getItem('user')).uid
    //     console.log('uid:', uid)
    //     this.props.dispatch({
    //         type: 'SET_USER_ID',
    //         payload: uid
    //     })
    //     await this.props.dispatch({
    //         type: 'GET_USER_DATA'
    //     })
    //     this.props.dispatch({  // updates user's divice registration token in database
    //         type: 'GET_REGISTRATION_TOKEN'
    //     })
    
    //     this.requestUserPermission()
    // }

    return (
        <>
            <View style={styles.container}>
                <Logout visible={isLogoutMode} toggleLogoutMode={toggleLogoutMode} logout={logout}/>
                <ReviewImage visible={isReviewMode} toggleReviewMode={toggleReviewMode} sendImage={sendImage} capturedImageUri={capturedImageUri} isSending={isSending}/>
                <NoFavorite visible={isNoFavoriteMode} toggleNoFavoriteMode={toggleNoFavoriteMode}/>
                <Settings visible={isSettingsMode} toggleSettingsMode={toggleSettingsMode}/>
                <RNCamera
                    ref={cameraRef}
                    style={styles.preview}
                    type={cameraType}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    captureAudio={false}
                >
                    <View style={styles.iconContainer}>
                        <View style={styles.topIcons}>
                            <TouchableOpacity onPress={toggleLogoutMode}>
                                <MaterialIcons
                                    name='keyboard-return'
                                    style={styles.logoutIcon}
                                />
                            </TouchableOpacity>
                            {props.reduxState.respondingTo ? 
                                <Text style={styles.respondingMessage}>
                                    Responding
                                </Text>
                            :
                                <Text style={styles.respondingMessage}>

                                </Text>
                            }
                            <TouchableOpacity onPress={toggleSettingsMode}>
                                <Ionicons
                                    name='settings-sharp'
                                    style={styles.favoriteIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        {props.reduxState.respondingTo ?
                            <View style={styles.respondingBottomIcons}>
                                <TouchableOpacity onPress={takePicture}>
                                    <FontAwesome
                                        name='circle-thin'
                                        style={styles.captureIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        :
                            <View style={styles.bottomIcons}>
                                <View style={{
                                    alignItems: props.reduxState.userData && props.reduxState.userData.settings.leftHandedMode ? 'flex-start' : 'flex-end',
                                    marginBottom: 2,
                                    paddingRight: 3,
                                    paddingLeft: 3
                                }}>
                                    <TouchableOpacity onPress={switchCamera}>
                                        <Ionicons
                                            name='camera-reverse-sharp'
                                            style={styles.switchCameraIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bottomBottomIcons}>
                                    <TouchableOpacity onPress={viewInbox} style={styles.viewInbox}>
                                        {isInboxLoading ? 
                                            <ActivityIndicator
                                                style={styles.wheel}
                                                color='black'
                                            /> 
                                        :
                                            <Text style={styles.inboxText}>{props.reduxState.userData.inbox ? Object.keys(props.reduxState.userData.inbox).length : 0}</Text>
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={takePicture}>
                                        <FontAwesome
                                            name='circle-thin'
                                            style={styles.captureIcon}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={viewFavorite} style={styles.viewFavorite}>
                                        <Ionicons
                                            name='md-star'
                                            style={styles.favoriteIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                </RNCamera>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 6,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 6,
    },
    iconContainer: {
        display: 'flex',
        flex: 6, 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        margin: '3%',
        marginTop: Platform.OS === 'ios' ? '8%' : '3%',
        marginBottom: Platform.OS === 'ios' ? '5%' : '3%',
        // borderWidth: 3,
        // borderColor: 'pink'
    },
    topIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomIcons: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        //alignItems: 'flex-end',
        // borderWidth: 2,
        // borderColor: 'blue'
    },
    bottomBottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        // borderWidth: 2,
        // borderColor: 'pink'
    },
    respondingBottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },  
    viewInbox: {
        justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
        alignItems: 'center',
        backgroundColor: colors.cream,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        paddingBottom: Platform.OS === 'ios' ? 0 : 0,
        marginBottom: 6,
        marginLeft: 6
    },
    viewFavorite: {
        justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
        alignItems: 'center',
        backgroundColor: colors.blue,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        marginBottom: 6,
        marginRight: 6
    },
    logoutIcon: {
        color: 'white', 
        fontSize: 44
    },
    respondingMessage: {
        fontSize: 32,
        fontFamily: 'Rubik-Regular',
        color: 'white'
    },
    switchCameraIcon: {
        color: 'white', 
        fontSize: 48
    },
    inboxText: {
        color: 'black',
        fontSize: 40,
        fontFamily: 'Rubik-Regular'
    },
    captureIcon: {
        color: 'white', 
        fontSize: 82,
        // borderWidth: 2,
        // borderColor: 'pink',
        textAlign: 'center'
    },
    favoriteIcon: {
        color: 'white',
        fontSize: 36
    },
    wheel: {
        alignSelf: 'center',
        transform: Platform.OS === 'ios' ? [{ scale: 2 }] : [{ scale: 1 }]
    }
});

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(CameraPage);