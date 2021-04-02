import { put, select, takeEvery } from 'redux-saga/effects';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

function* deleteImage(action) {
    console.log('in deleteImage. action.payload: ', action.payload)
    // delete from redux
    let reduxState = yield select()
    let inbox = reduxState.userData.inbox
    let toBeDeleted = Object.keys(inbox)[0]
    console.log('toBeDeleted:', toBeDeleted)
    console.log('imageName:', toBeDeleted)

    // deleting from Redux is not necessary since redux inbox will get refreshed upon cameraPage load
   
    // delete from database
    yield database().ref(`users/${reduxState.userID}/inbox/${toBeDeleted}`).remove()

    // delete from storage if image isn't favorited
    if (action.payload.isFavorited) {
        console.log('image was favorited, so not deleted from storage')
    } else {
        yield storage().ref(`images/${toBeDeleted}`).delete()
    }
}

function* deleteImageSaga() {
    yield takeEvery('DELETE_IMAGE', deleteImage)
}

export default deleteImageSaga;