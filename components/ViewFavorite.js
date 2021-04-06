import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import database from '@react-native-firebase/database';

import DeleteFavorite from './DeleteFavorite';
import colors from '../assets/colors';

import { connect } from 'react-redux';

AntDesign.loadFont()

class Favorite extends React.Component {

    state = {
        deleteFavoriteMode: false,
    }

    deleteFavorite = async () => {
        console.log('in deleteFavorite')
        this.setState({ deleteFavoriteMode: true} )
    }

    closeDeleteFavoriteModal = () => {
        this.setState({deleteFavoriteMode: false})
    }

    returnToCameraPage = () => {
        this.props.history.push('/camera')
    }

    componentDidMount() {
        
    }
    
    render() {
        
        // The below problem was solved. Firebase attached hidden metadata to database objects it returns. The actual data is nested two levels deeper in the object.
        // SOLUTION: just use the .val() method 
        //
        // This is an interesting problem that I do not understand at all, but accessing the '_ref' attribute of the object 
        // returns what should be returned from the 'url' attribute. If the object (this.props.reduxState.favoriteUrl) is 
        // logged, it appears normal with attributes as intended. However, the values of these attributes return undefined
        // when trying to access them with the intended keys. Looping through the object and exposing the true keys provided
        // a solution to the problem, but it is still shrouded in mystery...
        //

        return (
            <>
                <DeleteFavorite visible={this.state.deleteFavoriteMode} closeDeleteFavoriteModal={this.closeDeleteFavoriteModal} returnToCameraPage={this.returnToCameraPage}></DeleteFavorite>
                <View style={{ flex: 1 }}>
                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: this.props.reduxState.userData.favorite.url }}>
                        <View style={styles.iconContainer}>
                            <View style={styles.topIcons}>
                            </View>
                            <View style={styles.bottomIcons}>
                                <TouchableOpacity
                                    style={styles.return}
                                    onPress={this.returnToCameraPage}>
                                    <MaterialIcons
                                        name='keyboard-return'
                                        style={styles.returnIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteFavorite}
                                    onPress={this.deleteFavorite}>
                                    <AntDesign
                                        name='delete'
                                        style={styles.deleteFavoriteIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </>
        )
    }
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
    return: {
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'flex-end',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 0,
        backgroundColor: colors.blue,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        paddingBottom: Platform.OS === 'ios' ? 2 : 4,
        marginBottom: 6,
        marginLeft: 6
    },
    deleteFavorite: {
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'flex-end',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 0,
        backgroundColor: colors.red,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        paddingBottom: Platform.OS === 'ios' ? 1 : 6,
        marginBottom: 6,
        marginRight: 6
    },
    returnIcon: {
        color: 'black',
        fontSize: 40
    },
    deleteFavoriteIcon: {
        color: 'black',
        fontSize: 34,
        marginBottom: Platform.OS === 'ios' ? '9%' : '3%'
    }
});
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(Favorite);