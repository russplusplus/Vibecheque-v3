import { select, takeEvery, put } from 'redux-saga/effects';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

function* indicateFavorite(action) {
    console.log('in indicateFavorite saga')
    let reduxState = yield select()
    console.log('userID:', reduxState.userID)

    yield put({
        type: 'SET_DID_THEY_FAVORITE',
        payload: 'true'
    })

    // check if there is already a favorite, and delete it from the database if so
    if (reduxState.userData.favorite) {
        yield storage().ref(`images/${reduxState.userData.favorite.name}`).delete();
    }

    console.log('right before reduxState.userID')
    let favRef = 'users/' + reduxState.userID + '/favorite';
    console.log('in indicateFavorite. favRef:', favRef)
    let favObj = {
        name: Object.keys(reduxState.userData.inbox)[0],
        url: reduxState.userData.inbox[Object.keys(reduxState.userData.inbox)[0]].url
    }
    console.log('in indicateFavorite. favObj:', favObj)

    yield database() 
        .ref(favRef)
        .set(favObj)
}

function* loginSaga() {
    yield takeEvery('INDICATE_FAVORITE', indicateFavorite)
}

export default loginSaga;