const capturedImageReducer = (state = {}, action) => {
    if (action.type === 'SET_CAPTURED_IMAGE') {
        console.log('in SET CAPTURED IMAGE')
        return action.payload;
    } else {
        return state;
    }
}

export default capturedImageReducer;