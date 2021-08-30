import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import { RewardedAd, RewardedAdEventType, TestIds } from '@react-native-firebase/admob';

import Report from './Report';
import NewFavorite from './NewFavorite';
import colors from '../assets/colors';

import { connect } from 'react-redux';

const platformSpecificAdUnitId = Platform.OS === 'ios' ? 'ca-app-pub-9408101332805838~7599720393' : 'ca-app-pub-9408101332805838~8001662185'
const adUnitId = __DEV__ ? TestIds.REWARDED : platformSpecificAdUnitId;
const rewarded = RewardedAd.createForAdRequest(adUnitId);

function ViewInbox (props) {

    const [reportMode, setReportMode] = useState(false)
    const [newFavoriteMode, setNewFavoriteMode] = useState(false)
    const [starColor, setStarColor] = useState('white')
    const [starBorderColor, setStarBorderColor] = useState('black')
    const [dislikeIconColor, setDislikeIconColor] = useState('black')
    const [dislikeBackgroundColor, setDislikeBackgroundColor] = useState(colors.red)
    const [responseMessage, setResponseMessage] = useState('')
    const [isFavorited, setIsFavorited] = useState(false)
    // const [isAdloaded, setIsAdLoaded] = useState(false)
    // const [hasPressedAnywhere, setHasPressedAnywhere] = useState(false)

    handlePressAnywhere = async () => {
        // setHasPressedAnywhere(true)
        // if (isAdloaded) {
        //     rewarded.show()
            props.dispatch({    //dispatch is async- if it responds before the page is changed, there will be an error because the background of the page is deleted
                type: 'DELETE_IMAGE',
                payload: {
                    isFavorited: isFavorited,
                    isReported: false
                }
            }) // maybe we could shift the redux inbox here so it's updated right when history is pushed. It would redundantly reload but that might not be a problem
            if (!isFavorited) {
                props.dispatch({
                    type: 'SET_DID_THEY_FAVORITE',
                    payload: 'false'  //these are all strings because firebase storage metadata can't do booleans
                })
            }

            // not reported, so update vibe record to indicate this
            await database()
                .ref('users/' + props.reduxState.userData.inbox[Object.keys(props.reduxState.userData.inbox)[0]].from + '/data/vibeRecord')
                .update({
                    firstVibe: 0,
                    lastVibeReported: 0
                })

            props.history.push('/camera')
        // } else {
        //     console.log('ad is not loaded yet')
        // }
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
        setDislikeIconColor('transparent')
    }

    report = async () => {
        // do this either here or the deleteImageSaga, but not both. probably here
        console.log('in report function')

        //record report && determine if sender should be banned
        const vibeRecordRef = 'users/' + props.reduxState.userData.inbox[Object.keys(props.reduxState.userData.inbox)[0]].from + 'data/vibeRecord'
        const snapshot = await database()
            .ref(vibeRecordRef)
            .once('value')
        console.log('snapshot:', snapshot)
        let vibeRecord = await snapshot.val()
        console.log('vibeRecord:', vibeRecord)

        console.log('firstVibe check:', vibeRecord.firstVibe === 1)
        console.log('lastVibeReported check:', vibeRecord.lastVibeReported === 1)
        console.log('strikes check:', (vibeRecord.strikes + 1) % 3 === 0)
        console.log('strikes plus one:', vibeRecord.strikes + 1)
        console.log('strikes plus one remainder:', (vibeRecord.strikes + 1) % 3)
        console.log('3 % 3:', 3 % 3)

        // if firstVibe, ban
        // if lastVibeReported, ban
        // if third strike, ban
        // if none of the above, add a strike
        if (vibeRecord.firstVibe === 1 || vibeRecord.lastVibeReported === 1 || (vibeRecord.strikes + 1) % 3 === 0) {
            //ban user && set unban time
            //randomly decide ban time between 1 and 45 days


            //this block is not being triggered properly
            let banDays
            if (vibeRecord.numberOfTimesBanned === 0) {
                banDays = Math.floor(Math.random() * 45) + 1
            } else if (vibeRecord.numberOfTimesBanned === 1) {
                banDays = 2 * (Math.floor(Math.random() * 45) + 1)
            } else if (vibeRecord.numberOfTimesBanned === 2) {
                banDays = 3 * (Math.floor(Math.random() * 45) + 1)
            } else if (vibeRecord.numberOfTimesBanned === 2) {
                banDays = 1000000
            }
            console.log('banDays:', banDays)
            let banMilliSeconds = 86400000 * banDays
            console.log('banMilliSeconds:', banMilliSeconds)
            let time = new Date().getTime()
            console.log('time:', time)
            let unbanTime = time + banMilliSeconds
            console.log('unbanTime:', unbanTime)

            let unbanTimeRef = 'users/' + props.reduxState.userData.inbox[Object.keys(props.reduxState.userData.inbox)[0]].from + '/data/unbanTime';
            console.log('unbanTimeRef:', unbanTimeRef)
            await database() //this could maybe be done in one database call
                .ref(unbanTimeRef)
                .set(unbanTime)
            await database()
                .ref(vibeRecordRef)
                .update({
                    numberOfTimesBanned: vibeRecord.numberOfTimesBanned + 1,
                    lastVibeReported: 1,
                    // isBanned: 1
                })
            
        } else {

        }
        // add a strike whether banned or not
        await database()
            .ref(vibeRecordRef)
            .update({
                strikes: vibeRecord.strikes + 1,
                // isBanned: 0
            })

        
        

        //delete photo from Redux
        props.dispatch({    //dispatch is async- if it responds before the page is changed, there will be an error because the background of the page is deleted
            type: 'DELETE_IMAGE',
            payload: {
                isFavorited: isFavorited,
                isReported: true
            }
        })
        props.dispatch({
            type: 'SET_NOT_RESPONDING'
        })

        props.history.push('/camera')
    }

    // useEffect(() => {
    //     if (hasPressedAnywhere) {
    //         handlePressAnywhere()
    //     }
    // }, [isAdloaded])

    // useEffect(() => {
    //     const eventListener = rewarded.onAdEvent((type, error, reward) => {
    //         if (type === RewardedAdEventType.LOADED) {
    //             console.log('ad is loaded')
    //             setIsAdLoaded(true);
    //         }
        
    //         if (type === RewardedAdEventType.EARNED_REWARD) {
    //             console.log('User earned reward of ', reward);
    //         }
    //     });
    
    //     // Start loading the rewarded ad straight away
    //     rewarded.load();
    
    //     // Unsubscribe from events on unmount
    //     return () => {
    //         eventListener();
    //     };
    // }, []);

    useEffect(() => {
        // Set response message
        // console.log('inbox:', props.reduxState.userData.inbox)
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
    }, [])
    
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
                                            backgroundColor: dislikeBackgroundColor,
                                            width: '14%',
                                            aspectRatio: 1,
                                            borderRadius: 10,
                                            marginBottom: 6,
                                            marginLeft: 6
                                        }}
                                        onPress={() => handleReportPress()}>
                                        <FontAwesome
                                            name='thumbs-down'
                                            style={{
                                                color: dislikeIconColor,
                                                fontSize: 40
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                        
                                            justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
                                            alignItems: 'center',
                                            borderColor: starBorderColor,
                                            borderWidth: 0,
                                            backgroundColor: colors.blue,
                                            width: '14%',
                                            aspectRatio: 1,
                                            borderRadius: 10,
                                            marginBottom: 6,
                                            marginRight: 6
                                        }}
                                        onPress={() => handleFavoritePress()}>
                                        <Ionicons
                                            name='md-star'
                                            style={{
                                                color: starColor,
                                                fontSize: 36,
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