import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

import ToggleSwitch from 'toggle-switch-react-native';
import Slider from '@react-native-community/slider';

import colors from '../assets/colors';
import { connect } from 'react-redux';
import database from '@react-native-firebase/database';

class Settings extends React.Component {

    state = {
        isSaving: false
    }

    toggleLeftHandedMode = (val) => {
        console.log('in toggleLeftHandedMode. val:', val)
        console.log('typeof val:', typeof(val))
        this.props.dispatch({
            type: 'SET_NEW_SETTINGS',
            payload: {
                ...this.props.reduxState.newSettings,
                leftHandedMode: val
            }
        })
    }

    toggleLocation = (val) => {
        console.log('in toggleLocation. val:', val)
        this.props.dispatch({
            type: 'SET_NEW_SETTINGS',
            payload: {
                ...this.props.reduxState.newSettings,
                location: val
            }
        })
    }

    changeDistance = (val) => {
        //console.log('in changeDistance. Math.round(val):', Math.round(val))
        this.props.dispatch({
            type: 'SET_NEW_SETTINGS',
            payload: {
                ...this.props.reduxState.newSettings,
                distance: val
            }
        })
    }

    saveSettings = async () => {
        console.log('in saveSettings')
        this.setState({
            isSaving: true
        })

        // update database
        await database()
            .ref(`users/${this.props.reduxState.userID}/settings`)
            .set(this.props.reduxState.newSettings)

        // update redux userData, rather than doing another GET_USER_DATA
        await this.props.dispatch({
            type: 'SET_USER_DATA',
            payload: {
                ...this.props.reduxState.userData,
                settings: this.props.reduxState.newSettings
            }
        })
        this.props.toggleSettingsMode()
        this.setState({
            isSaving: false
        })
    }

    cancel = async () => {
        await this.props.dispatch({
            type: 'SET_NEW_SETTINGS',
            payload: this.props.reduxState.userData.settings
        })
        this.props.toggleSettingsMode()
    }

    componentDidMount() {
       
    }

    render() {
        return (
            <Modal isVisible={this.props.visible} animationIn='slideInDown' animationOut='slideOutUp'>
                <View style={styles.container}>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.settingRow}>
                        <Text style={styles.setting}> </Text>
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={styles.setting}>Left-handed mode:</Text>
                        <ToggleSwitch
                            isOn={this.props.reduxState.newSettings.leftHandedMode}
                            onColor={colors.green}
                            offColor="grey"
                            size="medium"
                            onToggle={(isOn) => this.toggleLeftHandedMode(isOn)}
                        />
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={styles.setting}>Location:</Text>
                        <ToggleSwitch
                            isOn={this.props.reduxState.newSettings.location}
                            onColor={colors.green}
                            offColor="grey"
                            size="medium"
                            onToggle={(isOn) => this.toggleLocation(isOn)}
                        />
                    </View>
                    {this.props.reduxState.newSettings.location ?
                    <View style={styles.settingDistanceRow}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={styles.setting}>Max distance:</Text>
                            <Text style={styles.setting}>{this.props.reduxState.newSettings.distance} miles</Text>
                        </View>
                        <View style={styles.sliderContainer}>
                            <Slider
                                value={this.props.reduxState.newSettings.distance}
                                onValueChange={(val) => this.changeDistance(Math.round(val))}
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
                    }
                    <TouchableOpacity 
                        onPress={() => this.saveSettings()} 
                        style={styles.yesButton}>
                        {this.state.isSaving ?
                        <ActivityIndicator
                            style={styles.wheel}
                            color='black'
                        />
                        :
                        <Text
                            style={styles.yesButtonText}>
                            Save
                        </Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.cancel()} 
                        style={styles.cancelButton}>
                        <Text
                            style={styles.cancelButtonText}>
                            Cancel
                        </Text>
                    </TouchableOpacity>                    
                </View>   
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1, 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        marginLeft: '5%', 
        marginRight: '5%', 
        marginTop: '30%', 
        marginBottom: '30%', 
        backgroundColor: colors.cream, 
        borderRadius: 10, 
        paddingLeft: '5%', 
        paddingRight: '5%'
    },
    title: {
        marginTop: '20%',
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
        paddingBottom: 16
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
    outerCircle: {
        paddingRight: 0,
        margin: 0,
        //borderWidth: 2,
    }, 
    yesButton: {
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
    yesButtonText: {
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
        marginBottom: '20%',
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