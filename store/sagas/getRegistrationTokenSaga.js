import { put, takeEvery } from 'redux-saga/effects';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';

function* getRegistrationToken() {
    let registrationToken = yield messaging().getToken()
    yield put({
        type: 'SET_REGISTRATION_TOKEN',
        payload: registrationToken
    })  
    let user = JSON.parse(yield AsyncStorage.getItem("user"));
    //Saga user retrieval. user:', user)
    //console.log('getRegistrationTokenSaga token:', registrationToken)
    yield database()
        .ref(`/users/${user.uid}`)
        .update({
            registrationToken: registrationToken
        })
}

function* getRegistrationTokenSaga() {
    yield takeEvery('GET_REGISTRATION_TOKEN', getRegistrationToken)
}

export default getRegistrationTokenSaga;