import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import colors from '../assets/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
                                <Ionicons
                                    name='md-close'
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>Step 1</Text>
                        <Text style={styles.step}>Witness a good vibe</Text>
                        <Image source={require('../assets/Tutorial1.png')} style={styles.image}/>
                        <TouchableOpacity 
                            onPress={() => setStep(2)} 
                            style={styles.nextButton}>
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Ionicons
                                name='arrow-forward-outline'
                                style={styles.arrowIcon}
                            />
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
                                <Ionicons
                                    name='md-close'
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>Step 2</Text>
                        <Text style={styles.step}>Capture the vibe</Text>
                        <Image source={require('../assets/Tutorial2.png')} style={styles.image}/>
                        <TouchableOpacity 
                            onPress={() => setStep(3)} 
                            style={styles.nextButton}>
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Ionicons
                                name='arrow-forward-outline'
                                style={styles.arrowIcon}
                            />
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
                                <Ionicons
                                    name='md-close'
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>Step 3</Text>
                        <Text style={styles.step}>Share the vibe with a random user</Text>
                        <Image source={require('../assets/Tutorial3.png')} style={styles.image}/>
                        <TouchableOpacity 
                            onPress={() => setStep(4)} 
                            style={styles.nextButton}>
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Ionicons
                                name='arrow-forward-outline'
                                style={styles.arrowIcon}
                            />
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
                                <Ionicons
                                    name='md-close'
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>Step 4</Text>
                        <Text style={styles.step}>Wait a bit</Text>
                        <Image source={require('../assets/Tutorial4.png')} style={styles.image}/>
                        <TouchableOpacity 
                            onPress={() => setStep(5)} 
                            style={styles.nextButton}>
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Ionicons
                                name='arrow-forward-outline'
                                style={styles.arrowIcon}
                            />
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
                                <Ionicons
                                    name='md-close'
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.title}>Step 5</Text>
                        <Text style={styles.step}>Receive an anonymous vibecheque!</Text>
                        <Image source={require('../assets/Tutorial5.png')} style={styles.image}/>
                        <TouchableOpacity 
                            onPress={finish} 
                            style={styles.nextButton}>
                            <Text style={styles.nextButtonText}>Next</Text>
                            <Ionicons
                                name='arrow-forward-outline'
                                style={styles.arrowIcon}
                            />
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
        // paddingTop: '4%',
        // paddingBottom: '16%'
    },
    topIcons: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: '4%',
        marginBottom: 0
    },
    title: {
        fontSize: 36, 
        textAlign: 'center',
        fontFamily: 'Rubik-Regular',
        marginBottom: 0,
        marginTop: 0
    },
    step: {
        fontSize: 20, 
        textAlign: 'center',
        fontFamily: 'Rubik-Regular',
        // marginBottom: '10%',
        marginTop: '6%'
    },
    nextButton: { 
        flexDirection: 'row',
        alignItems: 'center',
        width: '75%',
        height: 40,
        borderWidth: 0,
        borderColor: colors.red,
        borderRadius: 10,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        // marginTop: '15%',
        // borderWidth: 2,
        marginTop: '6%',
        marginBottom: '16%'
    },
    nextButtonText: {
        fontSize: 26,
        textAlign: 'center',
        fontFamily: 'Rubik-Regular',
        marginTop: 0,
    },
    logoutIcon: {
        color: 'black', 
        fontSize: 44
    },
    closeIcon: {
        color: 'black',
        fontSize: 44,
    },
    arrowIcon: {
        fontSize: 26,
        paddingLeft: 4
    },
    image: {
        resizeMode: Platform.OS === 'ios' ? 'contain' : 'cover', 
        // position: 'absolute',
        // top: '35%',
        width: '100%',
        height: '50%',
        padding: 0,
        // marginTop: 0,
        // marginBottom: 0,
        marginTop: '4%',
        // borderWidth: 2
        // height: '18%', // 17% cuts off the q on android and 19% makes the logo wider on android
        // marginBottom: '5%'
    },
})

export default connect(mapReduxStateToProps)(Tutorial);