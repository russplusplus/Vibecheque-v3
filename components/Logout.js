import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';
import colors from '../assets/colors';

class Logout extends React.Component {

    render() {
        return (
            <Modal isVisible={this.props.visible} animationIn='slideInDown' animationOut='slideOutUp'>
                <View style={styles.container}>
                    <Text style={styles.text}>Log out?</Text>
                    <TouchableOpacity 
                        onPress={() => this.props.logout()} 
                        style={styles.yesButton}>
                        <Text
                            style={styles.yesButtonText}>
                            Yes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.props.toggleLogoutMode()} 
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
        justifyContent: 'center', 
        marginLeft: '5%', 
        marginRight: '5%', 
        marginTop: '40%', 
        marginBottom: '40%', 
        backgroundColor: colors.cream, 
        borderWidth: 0, 
        borderColor: 'black', 
        borderRadius: 10, 
        paddingLeft: '5%', 
        paddingRight: '5%'
    },
    text: {
        fontSize: 36, 
        textAlign: 'center', 
        fontFamily: 'Rubik-Regular'
    },
    yesButton: {
        width: '75%',
        height: 40,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        marginTop: '20%',
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
        marginTop: 10,
        alignItems: 'center'
    },
    cancelButtonText: {
        fontSize: 26,
        fontFamily: 'Rubik-Regular'
    }
})

export default Logout;