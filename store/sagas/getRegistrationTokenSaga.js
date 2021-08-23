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
    // Saga user retrieval. 
    console.log('getRegistrationToken user:', user)
    //console.log('getRegistrationTokenSaga token:', registrationToken)
    if (user.uid) {
        yield database()
        .ref(`/users/${user.uid}`)
        .update({
            registrationToken: registrationToken
        })
        console.log('registration token successfully updated in database')
    } else {
        console.log('uid is undefined, so did not update registration token')
    }
}

function* getRegistrationTokenSaga() {
    yield takeEvery('GET_REGISTRATION_TOKEN', getRegistrationToken)
}

export default getRegistrationTokenSaga;