import { combineReducers } from 'redux';

import respondingToReducer from './respondingToReducer';
import capturedImageReducer from './capturedImageReducer';
import loginMessageReducer from './loginMessageReducer';
import registrationTokenReducer from './registrationTokenReducer';
import userIDReducer from './userIDReducer';
import userDataReducer from './userDataReducer';
import newSettingsReducer from './newSettingsReducer';
import didTheyFavoriteReducer from './didTheyFavoriteReducer';

const rootReducer = combineReducers({
    respondingTo: respondingToReducer,
    capturedImage: capturedImageReducer,
    loginMessage: loginMessageReducer,
    registrationToken: registrationTokenReducer,
    userID: userIDReducer,
    userData: userDataReducer,
    newSettings: newSettingsReducer,
    didTheyFavorite: didTheyFavoriteReducer
})

export default rootReducer;