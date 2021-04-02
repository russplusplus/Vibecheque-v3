import { put, select, takeEvery } from 'redux-saga/effects';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

function* getUserData() {
    //user ID should be retrieved once and stored in redux
    //let uid = JSON.parse(yield AsyncStorage.getItem('user')).uid
    let reduxState = yield select()
    let uid = reduxState.userID

    const ref = `users/${uid}`
    const snapshot = yield database()
        .ref(ref)
        .once('value')
    console.log('in getUserData. snapshot.val():', snapshot.val())
    yield put({
        type: 'SET_USER_DATA',
        payload: snapshot.val()
    })
    yield put({
        type: 'SET_NEW_SETTINGS',
        payload: snapshot.val().settings
    })
}

function* getUserDataSaga() {
    yield takeEvery('GET_USER_DATA', getUserData)
}

export default getUserDataSaga;