import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import colors from '../assets/colors';

class NoFavorite extends React.Component {

    async componentDidMount() {
        console.log('in NoFavorite componentDidMount')
    }

    render() {
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
                        You haven't selected a favorite vibe yet.
                    </Text>
                    <TouchableOpacity 
                        onPress={() => this.props.toggleNoFavoriteMode()} 
                        style={{ 
                            marginTop: '15%',
                            width: '75%', 
                            borderWidth: 0,
                            borderColor: 'black',
                            borderRadius: 10,
                            backgroundColor: colors.green,
                            justifyContent: 'center',
                            height: 40
                        }}>
                        <Text
                            style={{
                                fontSize: 26,
                                textAlign: 'center',
                                fontFamily: 'Rubik-Regular'
                            }}>
                            Oh okay
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

export default connect(mapReduxStateToProps)(NoFavorite);