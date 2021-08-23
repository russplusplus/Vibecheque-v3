// const init = {
//     location: false,
//     distance: 0,
//     leftHandedMode: false
// }

const newSettingsReducer = (state = {
    location: false,
    distance: 0,
    leftHandedMode: false
}, action) => {
    if (action.type === 'SET_NEW_SETTINGS') {
        console.log('in SET_NEW_SETTINGS:', action.payload)
        return action.payload
    } else {
        return state;
    }
}

export default newSettingsReducer;