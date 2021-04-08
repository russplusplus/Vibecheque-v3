import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import DeleteFavorite from './DeleteFavorite';
import colors from '../assets/colors';

import { connect } from 'react-redux';

AntDesign.loadFont()

const Favorite = props => {

    const [deleteFavoriteMode, setDeleteFavoriteMode] = useState(false)

    deleteFavorite = async () => {
        console.log('in deleteFavorite')
        setDeleteFavoriteMode(true)
    }

    closeDeleteFavoriteModal = () => {
        setDeleteFavoriteMode(false)
    }

    returnToCameraPage = () => {
        props.history.push('/camera')
    }
    
    return (
        <>
            <DeleteFavorite visible={deleteFavoriteMode} closeDeleteFavoriteModal={closeDeleteFavoriteModal} returnToCameraPage={returnToCameraPage}></DeleteFavorite>
            <View style={{ flex: 1 }}>
                <ImageBackground
                style={{ flex: 1 }}
                source={{ uri: props.reduxState.userData.favorite.url }}>
                    <View style={styles.iconContainer}>
                        <View style={styles.topIcons}>
                        </View>
                        <View style={styles.bottomIcons}>
                            <TouchableOpacity
                                style={styles.return}
                                onPress={returnToCameraPage}>
                                <MaterialIcons
                                    name='keyboard-return'
                                    style={styles.returnIcon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteFavorite}
                                onPress={deleteFavorite}>
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
        justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 0,
        backgroundColor: colors.blue,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        paddingTop: Platform.OS === 'ios' ? 2 : 1,
        marginBottom: 6,
        marginLeft: 6
    },
    deleteFavorite: {
        justifyContent: Platform.OS === 'ios' ? 'center' : 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 0,
        backgroundColor: colors.red,
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10,
        paddingTop: Platform.OS === 'ios' ? 2 : 1,
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