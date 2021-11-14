import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

import ToggleSwitch from 'toggle-switch-react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';

import colors from '../assets/colors';
import { connect } from 'react-redux';
import database from '@react-native-firebase/database';

import Tutorial from './Tutorial';
import About from './About';

const { width, height } = Dimensions.get('window');
const vMargin = 0.476*height-291.76

Settings = props => {

    const [isSaving, setIsSaving] = useState(false)
    const [isTutorial1, setIsTutorial1] = useState(false)
    const [isAbout, setIsAbout] = useState(false)

    finishTutorial = () => {
        setIsTutorial1(false)
    }

    toggleLeftHandedMode = (val) => {
        console.log('in toggleLeftHandedMode. val:', val)
        console.log('typeof val:', typeof(val))
        props.dispatch({
            type: 'SET_NEW_SETTINGS',
            payload: {
                ...props.reduxState.newSettings,
                leftHandedMode: val
            }
        })
    }

    // toggleLocation = (val) => {
    //     console.log('in toggleLocation. val:', val)
    //     props.dispatch({
    //         type: 'SET_NEW_SETTINGS',
    //         payload: {
    //             ...props.reduxState.newSettings,
    //             location: val
    //         }
    //     })
    // }

    // changeDistance = (val) => {
    //     //console.log('in changeDistance. Math.round(val):', Math.round(val))
    //     props.dispatch({
    //         type: 'SET_NEW_SETTINGS',
    //         payload: {
    //             ...props.reduxState.newSettings,
    //             distance: val
    //         }
    //     })
    // }

    saveSettings = async () => {
        console.log('in saveSettings')
        setIsSaving(true)

        // update database
        await database()
            .ref(`users/${props.reduxState.userID}/data/settings`)
            .set(props.reduxState.newSettings)

        // update redux userData, rather than doing another GET_USER_DATA
        await props.dispatch({
            type: 'SET_USER_DATA',
            payload: {
                ...props.reduxState.userData,
                settings: props.reduxState.newSettings
            }
        })
        props.toggleSettingsMode()
        setIsSaving(false)
    }

    cancel = async () => {
        await props.dispatch({
            type: 'SET_NEW_SETTINGS',
            payload: props.reduxState.userData.settings
        })
        props.toggleSettingsMode()
    }

    useEffect(() => {
        console.log('width: ', width)
        console.log('height:', height)
    }, [])

    return (
        <Modal isVisible={props.visible} animationIn='slideInDown' animationOut='slideOutUp'>
            <Tutorial visible={isTutorial1} finishTutorial={finishTutorial}/>
            <About visible={isAbout} setIsAbout={setIsAbout}/>
            <View style={styles.container}>
                <Text style={styles.title}>Settings</Text>
                <View style={styles.settingRow}>
                    <Text style={styles.setting}> </Text>
                </View>
                <View style={styles.settingRow}>
                    <Text style={styles.setting}>Left-handed mode:</Text>
                    <ToggleSwitch
                        isOn={props.reduxState.newSettings.leftHandedMode}
                        onColor={colors.green}
                        offColor="grey"
                        size="medium"
                        onToggle={(isOn) => toggleLeftHandedMode(isOn)}
                    />
                </View>
                <View style={styles.settingRow}>
                    <Text style={styles.setting}>Tutorial:</Text>
                    <TouchableOpacity style={styles.tutorialButton} onPress={() => setIsTutorial1(true)}>
                        <Text style={styles.setting}>View</Text>
                        <Ionicons
                            name='arrow-forward-outline'
                            style={styles.arrowIcon}
                        />
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.aboutButtonRow}>
                    <TouchableOpacity style={styles.aboutButton} onPress={() => setIsAbout(true)}>
                        <Text style={styles.aboutButtonText}>About</Text>
                    </TouchableOpacity>
                    
                </View>
                {/* <View style={styles.settingRow}>
                    <Text style={styles.setting}>Location:</Text>
                    <ToggleSwitch
                        isOn={props.reduxState.newSettings.location}
                        onColor={colors.green}
                        offColor="grey"
                        size="medium"
                        onToggle={(isOn) => toggleLocation(isOn)}
                    />
                </View> */}
                {/* {props.reduxState.newSettings.location ?
                <View style={styles.settingDistanceRow}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={styles.setting}>Max distance:</Text>
                        <Text style={styles.setting}>{props.reduxState.newSettings.distance} miles</Text>
                    </View>
                    <View style={styles.sliderContainer}>
                        <Slider
                            value={props.reduxState.newSettings.distance}
                            onValueChange={(val) => changeDistance(Math.round(val))}
                            style={{width: 280, height: 60}}
                            minimumValue={1}
                            maximumValue={100}
                            minimumTrackTintColor={colors.green}
                            maximumTrackTintColor="grey"
                            //thumbTintColor={colors.green}
                        />
                    </View>
                </View>
                :
                <View style={styles.settingDistanceRow}>
                    <Text style={styles.setting}> </Text>
                </View>
                } */}
                <View style={styles.buttonsRow}>
                    <TouchableOpacity 
                        onPress={saveSettings} 
                        style={styles.saveButton}>
                        {isSaving ?
                        <ActivityIndicator
                            style={styles.wheel}
                            color='black'
                        />
                        :
                        <Text
                            style={styles.saveButtonText}>
                            Save
                        </Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={cancel} 
                        style={styles.cancelButton}>
                        <Text
                            style={styles.cancelButtonText}>
                            Cancel
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
        justifyContent: 'space-around', 
        marginLeft: '5%', 
        marginRight: '5%', 
        marginTop: vMargin, 
        marginBottom: vMargin, 
        backgroundColor: colors.cream, 
        borderRadius: 10, 
        paddingLeft: '5%', 
        paddingRight: '5%',
        paddingTop: '16%',
        paddingBottom: '16%'
    },
    title: {
        // marginTop: '20%',
        fontSize: 36, 
        textAlign: 'center', 
        fontFamily: 'Rubik-Regular',
        //paddingBottom: '20%'
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
    aboutButtonRow: {
        width: '100%',
        //height: 40,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        //borderWidth: 2,
        // paddingLeft: 0,
        paddingBottom: 0,
        marginTop: 40
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
    settingDistanceRow: {
        width: '100%',
        height: 80,
        flexDirection: 'column',
        //alignItems: 'stretch',
        //paddingLeft: 0,
        //paddingBottom: 16,
    },
    sliderContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingLeft: 50,
        // paddingRight: 50    
    },
    setting: {
        display: 'flex',
        fontSize: 20,
        textAlign: 'left',
        fontFamily: 'Rubik-Regular'
    },
    tutorialButton: {
        flexDirection: 'row',
        width: '30%',
        height: 26,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center'
    },
    aboutButton: {
        flexDirection: 'row',
        width: '60%',
        height: 26,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.green,
        justifyContent: 'center',
        // marginTop: 30,
        alignItems: 'center'
    },
    aboutButtonText: {
        display: 'flex',
        fontSize: 20,
        textAlign: 'right',
        fontFamily: 'Rubik-Regular'
    },
    arrowIcon: {
        fontSize: 20,
        paddingLeft: 4
    },
    outerCircle: {
        paddingRight: 0,
        margin: 0,
        //borderWidth: 2,
    }, 
    saveButton: {
        width: '75%',
        height: 40,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        marginTop: 30,
        alignItems: 'center'
    },
    saveButtonText: {
        fontSize: 26,
        fontFamily: 'Rubik-Regular'
    },
    cancelButton: { 
        width: '75%',
        height: 40,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.red,
        justifyContent: 'center',
        marginTop: 20,
        // marginBottom: '20%',
        alignItems: 'center'
    },
    cancelButtonText: {
        fontSize: 26,
        fontFamily: 'Rubik-Regular'
    },
    wheel: {
        alignSelf: 'center',
        transform: Platform.OS === 'ios' ? [{ scale: 1 }] : [{ scale: 1 }]
    },
})

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(Settings);