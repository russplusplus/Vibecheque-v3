import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../assets/colors';

import { connect } from 'react-redux';

class Report extends React.Component {

    state = {
        accessToken: ''
    }

    getToken = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token")
            console.log('getToken token:', token);
            return token;
        } catch (error) {
            console.log('AsyncStorage retrieval error:', error.message);
        }
        return '(missing token)';
    }

    async componentDidMount() {
        console.log('in Report componentDidMount')
        await this.getToken()
            .then(response => {
                //console.log('in new .then. token:', response)
                this.setState({accessToken: response});
            }).catch(error => {
                console.log('in catch,', error)
            });
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
                            Bad Vibes?
                        </Text>
                        <Text style={{
                            fontSize:20, 
                            textAlign:'center', 
                            marginTop:'10%',
                            fontFamily: 'Rubik-Regular'
                        }}>
                                The sender will be temporarily banned.
                        </Text>
                        <TouchableOpacity 
                            onPress={() => this.props.report()} 
                            style={{ 
                                width: '75%',
                                height: 40,
                                borderWidth: 0,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: colors.red,
                                justifyContent: 'center',
                                aligntItems: 'center',
                                marginTop: '10%'
                            }}>
                            <Text
                                style={{
                                    fontSize: 26,
                                    textAlign: 'center',
                                    fontFamily: 'Rubik-Regular'
                                }}>
                                BAD VIBES
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.props.cancelReport()} 
                            style={{ 
                                width: '75%', 
                                height: 40,
                                borderWidth: 0,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: colors.blue,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 10
                            }}>
                            <Text
                                style={{
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

export default connect(mapReduxStateToProps)(Report);