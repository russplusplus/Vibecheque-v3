import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';
import colors from '../assets/colors';
import { connect } from 'react-redux';

DeleteFavorite = props => {

    deleteFavorite = () => {
        console.log('in delete function');
        //actually delete image
        props.dispatch({
            type: 'DELETE_FAVORITE'
        })
        props.returnToCameraPage()
    }

    return (
        <Modal isVisible={props.visible} animationIn='slideInUp' animationOut='slideOutDown'>
            <View style={{
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
            }}>
                <Text style={{
                    fontSize:36, 
                    textAlign:'center',
                    fontFamily: 'Rubik-Regular'
                }}>
                    Delete image?
                </Text>
                <Text style={{
                    fontSize:20, 
                    textAlign:'center', 
                    marginTop:'10%',
                    fontFamily: 'Rubik-Regular'
                }}>
                    The image will be permanently deleted.
                </Text>
                <TouchableOpacity 
                    onPress={deleteFavorite} 
                    style={{ 
                        width: '75%',
                        height: 40,
                        borderWidth: 0,
                        borderColor: 'black',
                        borderRadius: 10,
                        backgroundColor: colors.red,
                        justifyContent: 'center',
                        marginTop: '12%'
                    }}>
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                            fontFamily: 'Rubik-Regular'
                        }}>
                        Delete
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={props.closeDeleteFavoriteModal} 
                    style={{ 
                        width: '75%',
                        height: 40,
                        borderWidth: 0,
                        borderColor: 'black',
                        borderRadius: 10,
                        backgroundColor: colors.blue,
                        justifyContent: 'center',
                        marginTop: 10
                    }}>
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                            fontFamily: 'Rubik-Regular'
                        }}>
                        Cancel
                    </Text>
                </TouchableOpacity>                    
            </View>  
        </Modal>
    )
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
        fontSize: 20,
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

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(DeleteFavorite);