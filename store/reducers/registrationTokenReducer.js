const registrationTokenReducer = (state = '', action) => {
    if (action.type === 'SET_REGISTRATION_TOKEN') {
        //console.log('in SET_REGISTRATION_TOKEN')
        return action.payload;
    } else {
        return state;
    }
}

export default registrationTokenReducer;