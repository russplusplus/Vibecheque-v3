import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import database from '@react-native-firebase/database';
//import { RewardedAd, TestIds } from '@react-native-firebase/admob';

import Report from './Report';
import NewFavorite from './NewFavorite';
import colors from '../assets/colors';

import { connect } from 'react-redux';

// const platformSpecificAdUnitId = Platform.OS === 'ios' ? 'ca-app-pub-9408101332805838~7599720393' : 'ca-app-pub-9408101332805838~8001662185'
// const adUnitId = __DEV__ ? TestIds.REWARDED : platformSpecificAdUnitId;
// const rewarded = RewardedAd.createForAdRequest(adUnitId);

function ViewInbox (props) {

    const [reportMode, setReportMode] = useState(false)
    const [newFavoriteMode, setNewFavoriteMode] = useState(false)
    const [starColor, setStarColor] = useState('white')
    const [starBorderColor, setStarBorderColor] = useState('black')
    const [dislikeBorderColor, setDislikeBorderColor] = useState('black')
    const [dislikeBackgroundColor, setDislikeBackgroundColor] = useState(colors.red)
    const [url, setUrl] = useState('')
    const [responseMessage, setResponseMessage] = useState('')
    const [isFavorited, setIsFavorited] = useState(false)
    const [isReported, setIsReported] = useState(false)

    handlePressAnywhere = () => {
        props.dispatch({    //dispatch is async- if it responds before the page is changed, there will be an error because the background of the page is deleted
            type: 'DELETE_IMAGE',
            payload: {
                isFavorited: isFavorited
            }
        }) // maybe we could shift the redux inbox here so it's updated right when history is pushed. It would redundantly reload but that might not be a problem
        if (!isFavorited) {
            props.dispatch({
                type: 'SET_DID_THEY_FAVORITE',
                payload: 'false'  //these are all strings because firebase storage metadata can't do booleans
            })
        }
        props.history.push('/camera')
    }

    handleFavoritePress = () => {
        console.log('in handleFavoritePress')
        if (!isFavorited) {
            setNewFavoriteMode(true)
        }  
    }

    handleReportPress = () => {
        console.log('in handleReportPress')
    
        if (isFavorited) {
            console.log('report rejected because already favorited')
        } else {
            setReportMode(true)
        }
    }

    cancelReport = () => {
        setReportMode(false)
    }

    closeNewFavoriteModal = () => {
        setNewFavoriteMode(false)
    }

    indicateFavorite = async () => {
        props.dispatch({
            type: 'INDICATE_FAVORITE'
        })
        setIsFavorited(true)
        setStarColor(colors.cream)
        setStarBorderColor(colors.cream)
        setDislikeBackgroundColor('transparent')
        setDislikeBorderColor('transparent')
    }

    report = async () => {
        console.log('in report function')
        
        //ban user && set unban time
        let banDays = Math.floor(Math.random() * 45) + 1
        console.log('banDays:', banDays)
        let banMilliSeconds = 86400000 * banDays
        console.log('banMilliSeconds:', banMilliSeconds)
        let time = new Date().getTime()
        console.log('time:', time)
        let unbanTime = time + banMilliSeconds
        console.log('unbanTime:', unbanTime)

        let unbanTimeRef = 'users/' + props.reduxState.userData.inbox[Object.keys(props.reduxState.userData.inbox)[0]].from + '/unbanTime';
        console.log('unbanTimeRef:', unbanTimeRef)
        await database() //this could maybe be done in one database call
            .ref(unbanTimeRef)
            .set(unbanTime)

        //delete photo from Redux
        props.dispatch({    //dispatch is async- if it responds before the page is changed, there will be an error because the background of the page is deleted
            type: 'DELETE_IMAGE',
            payload: {
                isFavorited: isFavorited
            }
        })
        props.dispatch({
            type: 'SET_NOT_RESPONDING'
        })

        props.history.push('/camera')
    }

    useEffect(() => {
        // Set response message
        if (props.reduxState.userData.inbox[Object.keys(props.reduxState.userData.inbox)[0]].isResponse) {
            if (props.reduxState.userData.inbox[Object.keys(props.reduxState.userData.inbox)[0]].didTheyFavorite === 'true') {
                setResponseMessage('They liked your vibe!')
            } else {
                setResponseMessage('Response')
            }
            props.dispatch({
                type: 'SET_NOT_RESPONDING'
            })
        } else {
            setResponseMessage('')
            // Set recipient if image is not response
            props.dispatch({
                type: 'SET_RESPONDING_TO',
                payload: props.reduxState.userData.inbox[Object.keys(props.reduxState.userData.inbox)[0]].from
            })
        }
        // this issue was solved long ago but I like remembering this nice note I left 
        //Russ,
        //
        //You need to figure out how to get isResponding from the image.
        //Right now, redux has an array of image names and the url of the
        //first image in the queue. However, since we're gonna need the 
        //isResponse boolean from each image too, it might be best to 
        //change the array of strings to an array of objects, with all
        //the data we'll need for each image. Maybe in the cameraPage 
        //componentDidMount we could load the url for the first image
        //in the queue. But maybe you'll think of a better way.
        //
        //Goodnight,
        //
        //Russ
    })
    
    return (
        <>
            <NewFavorite visible={newFavoriteMode} closeNewFavoriteModal={closeNewFavoriteModal} indicateFavorite={indicateFavorite}></NewFavorite>
            <Report visible={reportMode} cancelReport={cancelReport} report={report}></Report>
                <TouchableWithoutFeedback onPress={handlePressAnywhere}>
                    <View style={{ flex: 1 }}>
                        <ImageBackground
                        style={{ flex: 1 }}
                        source={{ uri: props.reduxState.userData.inbox[Object.keys(props.reduxState.userData.inbox)[0]].url }}>
                            <View style={styles.iconContainer}>
                                <View style={styles.topIcons}>
                                    <Text style={{fontFamily: 'Rubik-Regular', fontSize: 32, color: 'white', textAlign: 'center', marginTop: 10}}>{responseMessage}</Text>
                                </View>
                                <View style={styles.bottomIcons}>
                                    <TouchableOpacity
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderColor: dislikeBorderColor,
                                            borderWidth: 0,
                                            backgroundColor: dislikeBackgroundColor,
                                            width: '14%',
                                            aspectRatio: 1,
                                            borderRadius: 10
                                        }}
                                        onPress={() => handleReportPress()}>
                                        <FontAwesome
                                            name='thumbs-down'
                                            style={{
                                                color: dislikeBorderColor,
                                                fontSize: 40
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
                                            alignItems: 'center',
                                            borderColor: starBorderColor,
                                            borderWidth: 0,
                                            backgroundColor: colors.blue,
                                            width: '14%',
                                            aspectRatio: 1,
                                            borderRadius: 10,

                                        }}
                                        onPress={() => handleFavoritePress()}>
                                        <Ionicons
                                            name='md-star'
                                            style={{
                                                color: starColor,
                                                fontSize: 44,
                                                paddingBottom: 1

                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableWithoutFeedback>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 6,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    iconContainer: {
        display: 'flex',
        flex: 6, 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        margin: '3%',
        marginTop: Platform.OS === 'ios' ? '8%' : '3%',
        marginBottom: Platform.OS === 'ios' ? '5%' : '3%',
    },
    topIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    // badVibes: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderColor: this.state.dislikeBorderColor,
    //     borderWidth: 2,
    //     backgroundColor: this.state.dislikeBackgroundColor,
    //     width: '14%',
    //     aspectRatio: 1,
    //     borderRadius: 10
    // },
    // favorite: {
    //     justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
    //     alignItems: 'center',
    //     borderColor: this.state.starBorderColor,
    //     borderWidth: 2,
    //     backgroundColor: colors.red,
    //     width: '14%',
    //     aspectRatio: 1,
    //     borderRadius: 10
    // },
    // thumbsDownIcon: {
    //     color: this.state.dislikeBorderColor,
    //     fontSize: 40
    // },
    // favoriteIcon: {
    //     color: this.state.starColor,
    //     fontSize: 44
    // }
});
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(ViewInbox);