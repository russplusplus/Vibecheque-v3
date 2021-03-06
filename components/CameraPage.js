import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import admob, { RewardedAd, RewardedAdEventType, TestIds, MaxAdContentRating } from '@react-native-firebase/admob';

import Logout from './Logout';
import ReviewImage from './ReviewImage';
import NoFavorite from './NoFavorite';
import Settings from './Settings';

import colors from '../assets/colors';

FontAwesome.loadFont()
Ionicons.loadFont()

const platformSpecificAdUnitId = Platform.OS === 'ios' ? 'ca-app-pub-9408101332805838~7599720393' : 'ca-app-pub-9408101332805838~8001662185'
const adUnitId = __DEV__ ? TestIds.REWARDED : platformSpecificAdUnitId;
const rewarded = RewardedAd.createForAdRequest(adUnitId);

admob()
  .setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,
})
  .then(() => {
    // Request config successfully set!
});

const CameraPage = props => {

    const [isLogoutMode, setIsLogoutMode] = useState(false)
    const [isReviewMode, setIsReviewMode] = useState(false)
    const [isNoFavoriteMode, setIsNoFavoriteMode] = useState(false)
    const [isSettingsMode, setIsSettingsMode] = useState(false)
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back)
    const [capturedImageUri, setCapturedImageUri] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isInboxLoading, setIsInboxLoading] = useState(false)
    const [isAdLoaded, setIsAdLoaded] = useState(false)
    const [isLeftHandedMode, setIsLeftHandedMode] = useState(false)
    const cameraRef = useRef(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

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
        if (isReviewMode) {
            setIsSaving(false)
            setIsSaved(false)
        }
        setIsReviewMode(isReviewMode ? false : true)
    }

    toggleNoFavoriteMode = () => {
        setIsNoFavoriteMode(isNoFavoriteMode ? false : true)
    }

    takePicture = async () => {
        if (cameraRef) {
            //load ad here
            rewarded.load();





            const options = { quality: 1, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);   //current? this attribute is new, as described in tutorial
            console.log('uri:', data.uri);
            setCapturedImageUri(data.uri)
            console.log('after setState')
            toggleReviewMode()
        }
    }

    handlePressSend = () => {
        console.log('in handlePressSend. didTheyFavorite:', props.reduxState.didTheyFavorite)
        console.log('isSending:', isSending)
        console.log('isAdLoaded:', isAdLoaded)

        // if (props.reduxState.userID && isAdLoaded) {
        if (props.reduxState.userID) {
            console.log('userID found; sending')
            setIsSending(true)
            sendImage()
        } else {
            if (!props.reduxState.userID) {
                console.log('userID not found')
            } else if (!isAdLoaded) {
                console.log('ad not loaded')
            } else {
                console.log('???????')
            }
        }
        // setIsSending(false)
    }

    checkIfBanned = async (uid) => {
        console.log('in checkIfBanned. uid:', uid)
        return await database()
            .ref(`/users/${uid}/data/unbanTime`)
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

    sendImage = async () => {
        console.log('props.reduxState.userID found.', props.reduxState.userID)
        if (await checkIfBanned(props.reduxState.userID)) {
            console.log('user is banned, so logging out')
            props.dispatch({
                type: 'SET_LOGIN_MESSAGE',
                payload: 'You have been temporarily banned for spreading bad vibes.'
            })
            logout()
        } else {
            console.log('user is not banned, so proceding with send')
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



            //show ad here
            if (isAdLoaded) {
                rewarded.show()
                toggleReviewMode()
                // setIsSending(false)
            } else {
                //do nothing. listener will show add once loaded
            }   
        }
    }

    viewInbox = async () => {
        console.log('in viewInbox. userData:', props.reduxState.userData)
        if (props.reduxState.userData.inbox) {
            props.history.push('/ViewInbox')
        } else {
            console.log('inbox is empty')
            setIsInboxLoading(true)
            await props.dispatch({
                type: 'GET_USER_DATA'
            })
            setIsInboxLoading(false)
            console.log('checked inbox')
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
        console.log('height:', Dimensions.get('window').height)
        setIsSettingsMode(isSettingsMode ? false : true)
    }

    requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
            // 0 = denied
            // 1 = authorized
            // 2 = provisional
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
        // console.log('props.reduxState.userData:', props.reduxState.userData)
        //setUid()
        getUserData()
        props.dispatch({  // updates user's device registration token in database and adds it to redux
            type: 'GET_REGISTRATION_TOKEN'
        })
    
        requestUserPermission()
    }, [])

    useEffect(() => {
        if (isReviewMode === false) {
            setIsSending(false)
        }
    }, [isReviewMode])

    useEffect(() => {
        console.log('isSending triggered.', isSending)
    }, [isSending])

    useEffect(() => {
        // once add is loaded, checkto see if the use has pressed send. If so, show the add
        
    }, [isAdLoaded])

    // useEffect(() => {
    //     console.log('Mounted')
    // }, [])

    useEffect(() => {
        console.log('userData triggered')
        console.log('props.reduxState.userData.settings:', props.reduxState.userData.settings)
        
        if (props.reduxState.userData) {
            if (props.reduxState.userData.settings) {
                setIsLeftHandedMode(props.reduxState.userData.settings.leftHandedMode)
            }
        } else {
            console.log('no user data found. waiting 4 seconds and re-querying')
            setTimeout(() => {
                getUserData()
            }, 4000)
        }
    }, [props.reduxState.userData])

    useEffect(() => {
        const eventListener = rewarded.onAdEvent((type, error, reward) => {
            if (type === RewardedAdEventType.LOADED) {
                console.log('ad is loaded')
                setIsAdLoaded(true);
                console.log('isSending:', isSending)
                if (isSending) {
                    rewarded.show()
                    toggleReviewMode()
                } else {
                    //do nothing. ad will show once image is sent
                }
            }
        
            if (type === RewardedAdEventType.EARNED_REWARD) {
                console.log('User earned reward of ', reward);
            }
        });
    
        // Start loading the rewarded ad straight away
        //rewarded.load();
    
        // Unsubscribe from events on unmount
        return () => {
            eventListener();
        };
    });

    return (
        <>
            <View style={styles.container}>
                <Logout 
                    visible={isLogoutMode} 
                    toggleLogoutMode={toggleLogoutMode} 
                    logout={logout}
                />
                <ReviewImage 
                    visible={isReviewMode} 
                    toggleReviewMode={toggleReviewMode} 
                    sendImage={handlePressSend} 
                    capturedImageUri={capturedImageUri} 
                    isSending={isSending} 
                    isSaving={isSaving} 
                    setIsSaving={setIsSaving}
                    isSaved={isSaved}
                    setIsSaved={setIsSaved}
                />
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
                            <View style={{
                                flexDirection: isLeftHandedMode ? 'row-reverse' : 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    alignItems: isLeftHandedMode ? 'flex-start' : 'flex-end',
                                    paddingRight: 3,
                                    paddingLeft: 3,
                                    opacity: 0
                                }}>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name='camera-reverse-sharp'
                                            style={styles.switchCameraIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={takePicture}>
                                    <FontAwesome
                                        name='circle-thin'
                                        style={styles.captureIcon}
                                    />
                                </TouchableOpacity>
                                <View style={{
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
                            </View>
                        :
                            <View style={styles.bottomIcons}>
                                <View style={{
                                    alignItems: isLeftHandedMode ? 'flex-start' : 'flex-end',
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
        justifyContent: 'space-between'
    },  
    viewInbox: {
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'flex-end',
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