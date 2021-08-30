import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import colors from '../assets/colors';

Tutorial1 = (props) => {

    return (
        <Modal isVisible={props.visible} animationIn='slideInRight' animationOut='slideOutLeft'>
            <View style={styles.container}>
                <Text style={styles.title}>tutorial1</Text>
                <TouchableOpacity 
                    onPress={() => props.next()} 
                    style={styles.alrightButton}>
                    <Text style={styles.alrightButtonText}>Next</Text>
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
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Rubik-Regular'
    }
})

export default connect(mapReduxStateToProps)(Tutorial1);