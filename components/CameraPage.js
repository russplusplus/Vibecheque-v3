import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, TouchableNativeFeedbackBase, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
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


class CameraPage extends React.Component {

    state = {
        isLogoutMode: false,
        isReviewMode: false,
        isNoFavoriteMode: false,
        isSettingsMode: false,
        cameraType: RNCamera.Constants.Type.back,
        capturedImageUri: '',
        uid: '',
        isSending: false,
        isInboxLoading: false
    }

    logout = () => {
        console.log('in logout function')
        this.props.dispatch({
            type: 'LOGOUT',
            history: this.props.history
        })
    }

    switchCamera = () => {
        this.setState({
            // these might just be 1 or 0, look into that with a real device
            cameraType: this.state.cameraType === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
        })
        console.log(this.state.cameraType)
    }

    toggleLogoutMode = () => {
        console.log('in toggleLogoutMode')
        this.setState({
            isLogoutMode: (this.state.isLogoutMode ? false : true)
        })
    }

    toggleReviewMode = () => {
        this.setState({
            isReviewMode: (this.state.isReviewMode ? false : true)
        })
    }

    toggleNoFavoriteMode = () => {
        this.setState({
            isNoFavoriteMode: (this.state.isNoFavoriteMode ? false : true)
        })
    }

    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 1, base64: true };
            const data = await this.camera.takePictureAsync(options);
            console.log('uri:', data.uri);
            this.setState({
                capturedImageUri: data.uri
            })
            console.log('after setState')
            this.toggleReviewMode()
        }
    }

    sendImage = async () => {
        console.log('in sendImage. didTheyFavorite:', this.props.reduxState.didTheyFavorite)
        if (this.props.reduxState.userID) {
            this.setState({
                isSending: true
            })
            
            // generate filename from current time in milliseconds
            let filename = new Date().getTime();
            console.log('filename:', filename)
            const ref = storage().ref('images/' + String(filename));
            const metadata = {
                customMetadata: {
                    fromUid: this.props.reduxState.userID,
                    toUid: this.props.reduxState.respondingTo,
                    didTheyFavorite: this.props.reduxState.didTheyFavorite
                }
            }
            await ref.putFile(this.state.capturedImageUri, metadata);
            
            console.log('this.props.reduxState.respondingTo:', this.props.reduxState.respondingTo)
            this.props.dispatch({  // image is sent, therefore not responding anymore 
                type: 'SET_NOT_RESPONDING'
            })
            this.props.dispatch({  // if they favorite, this well be set back to false
                type: 'SET_DID_THEY_FAVORITE',
                payload: 'false'
            })
            this.toggleReviewMode()
            this.setState({
                isSending: false
            })
        } else {
            console.log('userID not found')
        }
    }

    viewInbox = async () => {
        console.log('in viewInbox')
        if (this.props.reduxState.userData.inbox) {
            this.props.history.push('/ViewInbox')
        } else {
            console.log('inbox is empty')
            this.setState({
                isInboxLoading: true
            })
            await this.props.dispatch({
                type: 'GET_USER_DATA'
            })
            this.setState({
                isInboxLoading: false
            })
            console.log('already done')
        }
    }

    viewFavorite = () => {
        console.log('in viewFavorite')
        if (this.props.reduxState.userData.favorite) {
            this.props.history.push('/favorite')
        } else {
            this.toggleNoFavoriteMode()
        }
    }

    toggleSettingsMode = async () => {
        
        console.log('in toggleSettingsMode. reduxState.newSettings:', this.props.reduxState.newSettings)
        this.setState({
            isSettingsMode: this.state.isSettingsMode ? false : true
        })
    }

    requestUserPermission = async () => {
        const permissionSettings = await messaging().requestPermission();

        if (permissionSettings) {
            console.log('Permission settings:', permissionSettings);
        }
    }

    componentDidMount = async () => {
        //console.log('auth().currentUser:', auth().currentUser)

        console.log('this.props.reduxState.userData:', this.props.reduxState.userData)

        //get user ID
        let uid = JSON.parse(await AsyncStorage.getItem('user')).uid
        console.log('uid:', uid)
        this.props.dispatch({
            type: 'SET_USER_ID',
            payload: uid
        })

        await this.props.dispatch({
            type: 'GET_USER_DATA'
        })

        this.props.dispatch({  // updates user's divice registration token in database
            type: 'GET_REGISTRATION_TOKEN'
        })
        
        this.requestUserPermission()
    }

    render() {
        //console.log('leftHandedMode:', this.props.reduxState.userData.settings.leftHandedMode)
        return (
            <>
                <View style={styles.container}>
                    <Logout visible={this.state.isLogoutMode} toggleLogoutMode={this.toggleLogoutMode} logout={this.logout}/>
                    <ReviewImage visible={this.state.isReviewMode} toggleReviewMode={this.toggleReviewMode} sendImage={this.sendImage} capturedImageUri={this.state.capturedImageUri} isSending={this.state.isSending}/>
                    <NoFavorite visible={this.state.isNoFavoriteMode} toggleNoFavoriteMode={this.toggleNoFavoriteMode}/>
                    <Settings visible={this.state.isSettingsMode} toggleSettingsMode={this.toggleSettingsMode}/>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={this.state.cameraType}
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
                                <TouchableOpacity onPress={this.toggleLogoutMode}>
                                    <Ionicons
                                        name='md-return-left'
                                        style={styles.logoutIcon}
                                    />
                                </TouchableOpacity>
                                {this.props.reduxState.respondingTo ? 
                                    <Text style={styles.respondingMessage}>
                                        Responding
                                    </Text>
                                :
                                    <Text style={styles.respondingMessage}>

                                    </Text>
                                }
                                <TouchableOpacity onPress={this.toggleSettingsMode}>
                                    <Ionicons
                                        name='ios-settings'
                                        style={styles.favoriteIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                            {this.props.reduxState.respondingTo ?
                                <View style={styles.respondingBottomIcons}>
                                    <TouchableOpacity onPress={this.takePicture.bind(this)}>
                                        <FontAwesome
                                            name='circle-thin'
                                            style={styles.captureIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            :
                                <View style={styles.bottomIcons}>
                                    <View style={{
                                        alignItems: this.props.reduxState.userData.settings.leftHandedMode ? 'flex-start' : 'flex-end',
                                        marginBottom: 2,
                                    }}>
                                        <TouchableOpacity onPress={this.switchCamera}>
                                            <Ionicons
                                                name='md-reverse-camera'
                                                style={styles.switchCameraIcon}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.bottomBottomIcons}>
                                        <TouchableOpacity onPress={this.viewInbox} style={styles.viewInbox}>
                                            {this.state.isInboxLoading ? 
                                                <ActivityIndicator
                                                    style={styles.wheel}
                                                    color='black'
                                                /> 
                                            :
                                                <Text style={styles.inboxText}>{this.props.reduxState.userData.inbox ? Object.keys(this.props.reduxState.userData.inbox).length : 0}</Text>
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.takePicture.bind(this)}>
                                            <FontAwesome
                                                name='circle-thin'
                                                style={styles.captureIcon}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.viewFavorite} style={styles.viewFavorite}>
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
    switchCameraContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        marginBottom: 2
        //paddingRight: 3
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
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'flex-end',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 0,
        backgroundColor: colors.cream,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        paddingBottom: Platform.OS === 'ios' ? 2 : 1
    },
    viewFavorite: {
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'flex-end',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 0,
        backgroundColor: colors.blue,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        paddingBottom: Platform.OS === 'ios' ? 1 : 4
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
        fontSize: 82
    },
    favoriteIcon: {
        color: 'white',
        fontSize: 44
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