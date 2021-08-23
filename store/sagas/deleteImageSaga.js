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
    yield database().ref(`users/${reduxState.userID}/data/inbox/${toBeDeleted}`).remove()

    // get metadata for updating sender vibe record before the image is deleted from storage
    let metadata = yield storage().ref(`images/${toBeDeleted}`).getMetadata()
    console.log('metadata:', metadata)

    // delete from storage if image isn't favorited
    if (action.payload.isFavorited) {
        console.log('image was favorited, so not deleted from storage')
    } else {
        console.log('image was not favorited, so deleted from storage')
        yield storage().ref(`images/${toBeDeleted}`).delete()
    }

    // update sender record in database
    // if (action.payload.isReported) {
    //     // this should probably be moved to the report function in ViewInbox  

    //     // add logic to determine vibe record
    //     // if firstVibe, ban
    //     // if lastVibeReported, ban
    //     // if third strike, ban
    //     // if none of the above, add a strike
    //     let snapshot = yield database().ref(`users/${metadata.fromUid}/vibeRecord`).once('value')
    //     let vibeRecord = snapshot.val()
    //     console.log('vibeRecord:', vibeRecord)
        
    // } else {
    //     yield database().ref(`users/${metadata.fromUid}/vibeRecord`).update({
    //         firstVibe: 0,
    //         lastVibeReported: 0
    //     })
    // }
}

function* deleteImageSaga() {
    yield takeEvery('DELETE_IMAGE', deleteImage)
}

export default deleteImageSaga;