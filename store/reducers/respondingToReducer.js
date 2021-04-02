const respondingToReducer = (state = null, action) => {
    if (action.type === 'SET_RESPONDING_TO') {
        return action.payload;
    } else if (action.type === 'SET_NOT_RESPONDING') {
        return null;
    } else {
        return state;
    }
}

export default respondingToReducer;