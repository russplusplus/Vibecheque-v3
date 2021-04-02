const loginMessageReducer = (state = '', action) => {
    if (action.type === 'SET_LOGIN_MESSAGE') {
        console.log('in SET_LOGIN_MESSAGE')
        return action.payload;
    } else {
        return state;
    }
}

export default loginMessageReducer;