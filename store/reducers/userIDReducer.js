const userIDReducer = (state = '', action) => {
    if (action.type === 'SET_USER_ID') {
        console.log('in SET_USER_ID. action.payload:', action.payload)
        return action.payload;
    } else {
        return state;
    }
}

export default userIDReducer;