import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import colors from '../assets/colors';

Notification = props => {
    closeNotification = async () => {
        props.dispatch({
            type: 'GET_USER_DATA'
        })
        props.setIsVisible(false)
    }

    return (
        <Modal isVisible={props.isVisible} animationIn='zoomIn' animationOut='zoomOut'>
            <View style={styles.container}>
                <Text style={styles.title}>You've received</Text>
                <Text style={styles.title}>a vibe!</Text>
                <TouchableOpacity 
                    onPress={() => closeNotification()} 
                    style={styles.alrightButton}>
                    <Text
                        style={styles.alrightButtonText}>
                        Alright!
                    </Text>
                </TouchableOpacity>                    
            </View>   
        </Modal>
    )
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

const styles = StyleSheet.create({
    container: {
        flex:1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginLeft:'5%', 
        marginRight:'5%', 
        marginTop:'40%', 
        marginBottom:'40%', 
        backgroundColor:colors.cream, 
        borderWidth:0, 
        borderColor:'black', 
        borderRadius:10, 
        paddingLeft:'5%', 
        paddingRight:'5%'
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
        fontSize: 26,
        textAlign: 'center',
        fontFamily: 'Rubik-Regular'
    }
})

export default connect(mapReduxStateToProps)(Notification);