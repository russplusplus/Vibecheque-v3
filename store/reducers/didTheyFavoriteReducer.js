const didTheyFavoriteReducer = (state = 'false', action) => {
    if (action.type === 'SET_DID_THEY_FAVORITE') {
        //console.log('in SET_DID_THEY_FAVORITE')
        return action.payload;
    } else {
        return state;
    }
}

export default didTheyFavoriteReducer;