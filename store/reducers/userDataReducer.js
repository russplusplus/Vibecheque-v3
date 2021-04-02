const init = {
    settings: {
        leftHandedMode: false,
        location: false,
        distance: 0
    }
}

const userDataReducer = (state = init, action) => {
    if (action.type === 'SET_USER_DATA') {
        return action.payload;
    } else {
        return state;
    }
}

export default userDataReducer;