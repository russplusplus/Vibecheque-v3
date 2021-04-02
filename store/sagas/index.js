import { all } from 'redux-saga/effects';

import login from './loginSaga';
import signUp from './signUpSaga';
import logout from './logoutSaga';
import getRegistrationToken from './getRegistrationTokenSaga';
import deleteImage from './deleteImageSaga';
import deleteFavorite from './deleteFavoriteSaga';
import getUserData from './getUserDataSaga';
import indicateFavorite from './indicateFavoriteSaga';

function* rootSaga() {
    yield all([
        login(),
        signUp(),
        logout(),
        getRegistrationToken(),
        deleteImage(),
        deleteFavorite(),
        getUserData(),
        indicateFavorite(),
    ]);
  }

export default rootSaga