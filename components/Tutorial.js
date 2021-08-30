import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import colors from '../assets/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

Tutorial = (props) => {
    const [step, setStep] = useState(1)

    finish = () => {
        setStep(1)
        props.finishTutorial()
    }

    switch  (step) {
        case 1:
            return (
                <Modal isVisible={props.visible} animationIn='slideInRight' animationOut='slideOutRight'>
                    <View style={styles.container}>
                        <View style={styles.topIcons}>
                            <TouchableOpacity onPress={finish}>
                                <MaterialIcons
                                    name='keyboard-return'
                                    style={styles.logoutIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>tutorial1</Text>
                        <TouchableOpacity 
                            onPress={() => setStep(2)} 
                            style={styles.alrightButton}>
                            <Text style={styles.alrightButtonText}>Next</Text>
                        </TouchableOpacity>                    
                    </View>   
                </Modal>
            )
        case 2:
            return (
                <Modal isVisible={props.visible} animationIn='zoomIn' animationOut='slideOutRight'>
                    <View style={styles.container}>
                        <View style={styles.topIcons}>
                            <TouchableOpacity onPress={finish}>
                                <MaterialIcons
                                    name='keyboard-return'
                                    style={styles.logoutIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>tutorial2</Text>
                        <TouchableOpacity 
                            onPress={() => setStep(3)} 
                            style={styles.alrightButton}>
                        </TouchableOpacity>                    
                    </View>   
                </Modal>
            )
        case 3:
            return (
                <Modal isVisible={props.visible} animationIn='zoomIn' animationOut='slideOutRight'>
                    <View style={styles.container}>
                        <View style={styles.topIcons}>
                            <TouchableOpacity onPress={finish}>
                                <MaterialIcons
                                    name='keyboard-return'
                                    style={styles.logoutIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>tutorial3</Text>
                        <TouchableOpacity 
                            onPress={() => setStep(4)} 
                            style={styles.alrightButton}>
                        </TouchableOpacity>                    
                    </View>   
                </Modal>
            )
        case 4:
            return (
                <Modal isVisible={props.visible} animationIn='zoomIn' animationOut='slideOutRight'>
                    <View style={styles.container}>
                        <View style={styles.topIcons}>
                            <TouchableOpacity onPress={finish}>
                                <MaterialIcons
                                    name='keyboard-return'
                                    style={styles.logoutIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>tutorial4</Text>
                        <TouchableOpacity 
                            onPress={() => setStep(5)} 
                            style={styles.alrightButton}>
                        </TouchableOpacity>                    
                    </View>   
                </Modal>
            )
        case 5: 
            return (
                <Modal isVisible={props.visible} animationIn='zoomIn' animationOut='slideOutRight'>
                    <View style={styles.container}>
                        <View style={styles.topIcons}>
                            <TouchableOpacity onPress={finish}>
                                <MaterialIcons
                                    name='keyboard-return'
                                    style={styles.logoutIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>tutorial5</Text>
                        <TouchableOpacity 
                            onPress={finish} 
                            style={styles.alrightButton}>
                        </TouchableOpacity>                    
                    </View>   
                </Modal>
            )
    }
    
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

const styles = StyleSheet.create({
    container: {
        flex:1, 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginLeft:'5%', 
        marginRight:'5%', 
        marginTop:'30%', 
        marginBottom:'30%', 
        backgroundColor:colors.cream, 
        borderWidth: 0, 
        borderColor:'black', 
        borderRadius:10, 
        paddingLeft:'4%', 
        paddingRight: '4%',
        paddingBottom: '16%'
    },
    title: {
        fontSize: 36, 
        textAlign: 'center',
        fontFamily: 'Rubik-Regular'
    },
    alrightButton: { 
        width: '75%',
        height: 40,
        borderWidth: 0,
        borderColor: colors.red,
        borderRadius: 10,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        marginTop: '15%'
    },
    alrightButtonText: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Rubik-Regular'
    },
    topIcons: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: '4%'
    },
    logoutIcon: {
        color: 'black', 
        fontSize: 44
    },
})

export default connect(mapReduxStateToProps)(Tutorial);