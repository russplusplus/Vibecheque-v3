import { select, takeEvery } from 'redux-saga/effects';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

function* deleteFavorite() {
    let reduxState = yield select()
    console.log('in deleteFavorite. userID:', reduxState.userID)

    // delete from database
    yield database().ref(`users/${reduxState.userID}/data/favorite`).remove();

    // delete from storage
    yield storage().ref(`images/${reduxState.userData.favorite.name}`).delete();
}

function* deleteFavoriteSaga() {
    yield takeEvery('DELETE_FAVORITE', deleteFavorite)
}

export default deleteFavoriteSaga;