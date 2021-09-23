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
        // the auth trigger function takes a couple seconds to populate the new user data in the db, so we wait a couple seconds before querying it
        // 4 seconds works so far, may be able to go lower
        // UPDATE: this is not actually a problem. Not having the user data for a new user has no 
        // apparent consequences, since their inbox will be empty anyway
        // setTimeout function was eliminated
        const snapshot = yield database()
            .ref(ref)
            .once('value')
        const user = snapshot.val()
        console.log('in getUserData. snapshot.val():', user)
        if (!user.data) {
            console.log('user data not found')
        } else {
            console.log('phoneNumber found, so setting user data')
            yield put({                     // "await put" does not work, but "yield put" does
                type: 'SET_USER_DATA',      // so wrapping in async timeout function won't work
                payload: user.data
            })
            yield put({
                type: 'SET_NEW_SETTINGS',
                payload: user.data.settings
            })    
        }
            
    } catch(err) {
        console.log(err)
    }
    
}

function* getUserDataSaga() {
    yield takeEvery('GET_USER_DATA', getUserData)
}

export default getUserDataSaga;