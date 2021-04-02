import { put, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';


function* login(action) {
    console.log('in login saga')
    
    try {
        let _user = yield auth().signInWithEmailAndPassword(action.payload.email, action.payload.password)
        user = _user.user
        console.log('user:', user)
        let time = new Date().getTime()
        let unbanTime = yield database()
            .ref(`/users/${user.uid}/unbanTime`)
            .once('value')
            .then(snapshot => {
                let unbanTime = snapshot.val()
                return unbanTime
            })   
                
        console.log('time:', time)
        console.log('unbanTime:', unbanTime)
        console.log('typeof unbanTime:', typeof(unbanTime))
        if (unbanTime < time) {
            yield AsyncStorage.setItem("user", JSON.stringify(user))
            action.history.push('/camera');
            console.log('User signed in!');
            yield put({
                type: 'SET_LOGIN_MESSAGE',
                payload: ''
            })
        } else {
            yield put({
                type: 'SET_LOGIN_MESSAGE',
                payload: 'You have been temporarily banned for spreading bad vibes.'
            })
        }
        
    } 
    catch (err) {
        console.log('error code:', err.code, typeof(err.code))
        switch (err.code) {
            case 'auth/invalid-email':
                yield put({
                    type: 'SET_LOGIN_MESSAGE',
                    payload: 'Please enter a valid email address.'
                })
                break;
            case 'auth/user-not-found':
                yield put({
                    type: 'SET_LOGIN_MESSAGE',
                    payload: 'User not found.'
                })
                break;
            case 'auth/wrong-password':
                yield put({
                    type: 'SET_LOGIN_MESSAGE',
                    payload: 'Incorrect password.'
                })
                break;
            case 'auth/email-already-in-use':
                yield put({
                    type: 'SET_LOGIN_MESSAGE',
                    payload: 'Email address already in use.'
                })
                break;
        }
    }
}

function* loginSaga() {
    yield takeEvery('LOGIN', login)
}

export default loginSaga;