/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import { NativeRouter, Route, Switch } from 'react-router-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './store/reducers';
import rootSaga from './store/sagas';

import Login from './components/Login';
import CameraPage from './components/CameraPage';
import ViewFavorite from './components/ViewFavorite';
import ViewInbox from './components/ViewInbox';
import Notification from './components/Notification';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default App = () => {
  const [initializing, setInitializing] = useState(true);
  const [notification, setNotification] = useState(false);

  // handle user state changes
  function onAuthStateChanged(user) {
    if (user) {
      console.log('user was signed in')
    } else {
      console.log('user was signed out')
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // this line supposedly unsubscribes on unmount 
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received FCM ', remoteMessage)
      setNotification(true)
    });
    return unsubscribe;
  }, []);
  
  return (
    <>
      <Provider store={store}>
        <NativeRouter>
          <Notification isVisible={notification} setIsVisible={setNotification} />
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/camera" component={CameraPage} />
            <Route exact path="/favorite" component={ViewFavorite} />
            <Route exact path="/viewInbox" component={ViewInbox} />
          </Switch>
        </NativeRouter>
      </Provider>
    </>
  );
};
