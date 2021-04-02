const userIDReducer = (state = '', action) => {
    if (action.type === 'SET_USER_ID') {
        return action.payload;
    } else {
        return state;
    }
}

export default userIDReducer;