import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import colors from '../assets/colors';

class NewFavorite extends React.Component {

    favorite = async () => {
        console.log('in favorite')
        this.props.indicateFavorite()
        this.props.closeNewFavoriteModal();
    }    

    async componentDidMount() {
        console.log('in NewFavorite componentDidMount')
    }

    render() {
        // this modal doesn't dim the background like others (logout, etc.) and idk why not
        return (
            <Modal visible={this.props.visible} animationType='slide' transparent={true}>
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
                            Favorite Vibe?
                    </Text>
                    <Text style={{
                        fontSize:20, 
                        textAlign:'center', 
                        marginTop:'10%', 
                        fontFamily: 'Rubik-Regular'
                    }}>
                            The image will be saved and will overwrite any currently saved image.
                    </Text>
                    <TouchableOpacity 
                        onPress={() => this.favorite()} 
                        style={{ 
                            width: '75%',
                            height: 40, 
                            borderWidth: 0,
                            borderColor: 'black',
                            borderRadius: 10,
                            backgroundColor: colors.blue,
                            justifyContent: 'center',
                            marginTop: '10%'
                        }}>
                        <Text style={{
                            fontSize: 26,
                            textAlign: 'center',
                            fontFamily: 'Rubik-Regular'
                        }}>
                            Save
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.props.closeNewFavoriteModal()} 
                        style={{ 
                            width: '75%',
                            height: 40,
                            borderWidth: 0,
                            borderColor: 'black',
                            borderRadius: 10,
                            backgroundColor: colors.red,
                            justifyContent: 'center',
                            marginTop: 10
                        }}>
                        <Text style={{
                            fontSize: 26,
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
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(NewFavorite);