import { put, select, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';

function* signUp(action) {
    console.log('in signUp saga')
    try {
        let user = yield auth().createUserWithEmailAndPassword(action.payload.email, action.payload.password)
        console.log('user:', user)
        yield AsyncStorage.setItem("user", JSON.stringify(user.user))
        action.history.push('/camera');
        console.log('User signed up and in!');
        yield put({
            type: 'SET_LOGIN_MESSAGE',
            payload: ''
        })
    } 
    catch (err) {
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

function* signUpSaga() {
    yield takeEvery('SIGN_UP', signUp)
}

export default signUpSaga;