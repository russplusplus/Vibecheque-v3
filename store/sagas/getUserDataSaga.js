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
    
    try {
        setTimeout(async () => {
            // the auth trigger function takes a couple seconds to populate the new user data in the db, so we wait a couple seconds before querying it
            // 4 seconds works so far, may be able to go lower
            const snapshot = await database()
                .ref(ref)
                .once('value')
            const user = snapshot.val()
            console.log('in getUserData. snapshot.val():', user)
            put({
                type: 'SET_USER_DATA',
                payload: user.data
            })
            put({
                type: 'SET_NEW_SETTINGS',
                payload: user.data.settings
            })
        }, 4000);
        
    } catch(err) {
        console.log(err)
    }
    
}

function* getUserDataSaga() {
    yield takeEvery('GET_USER_DATA', getUserData)
}

export default getUserDataSaga;