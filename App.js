/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from "react";
import { Text, Button, Image, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NativeMethod from './components/NativeMethod';
import BarcodeScanner from './components/BarcodeScanner';
import BarcodeScannerPreview from './components/BarcodeScannerPreview';
import NetInfoDemo from './components/NetInfoDemo';
import LocalNotification from './components/LocalNotification';
import RemoteNotification from './components/RemoteNotification';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();
const navigationRef = React.createRef();

const App = ({ isHeadless }) => {
  // isHeadless is 'true' when iOS start App on click notification
  console.log("isHeadless: ", isHeadless);
  if (isHeadless) {
    console.log("App is start on click notification");
    return null;
  }

  useEffect(() => {
    messaging().requestPermission().then(authStatus => {
      console.log("APN status: ", authStatus);
      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
        // get FCM token
        messaging().getToken().then(fcmToken => {
          if (fcmToken) {
            console.log("Get FCM token: ", fcmToken); //TODO: Send token to provider
          } else {
            console.log("Fail", "no token received");
          }
        });

        // refresh FCM token
        messaging().onTokenRefresh(fcmToken => {
          console.log("Refresh FCM token: ", fcmToken); //TODO: Send token to provider
        });
      
        // Subscribe dailyNews topic
        messaging().subscribeToTopic('dailyNews').then(() => {
          console.log('Subscribe topic: dailyNews');
        });

        // Receive notification message when app is down
        messaging().getInitialNotification().then(remoteMessage => {
          console.log("Init notification when app is down, ", remoteMessage);
        });

        // Open notification message
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log("Open message when app in background, ", remoteMessage);
          forwardRemoteNotification(remoteMessage);
        });
      }
    });
  
    // Receive notification message when app is on
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage), [{
        text: 'Cancel',
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      }, {
        text: 'OK',
        onPress: () => forwardRemoteNotification(remoteMessage)
      }]);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'React Native Demo' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="NativeMethod" component={NativeMethod} />
        <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
        <Stack.Screen name="BarcodeScannerPreview" component={BarcodeScannerPreview} />
        <Stack.Screen name="NetInfoDemo" component={NetInfoDemo} />
        <Stack.Screen name="LocalNotification" component={LocalNotification} />
        <Stack.Screen name="RemoteNotification" component={RemoteNotification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const forwardRemoteNotification = (remoteMessage) => {
  navigationRef.current.navigate({
    name: 'RemoteNotification',
    params: {
      message: JSON.stringify(remoteMessage)
    }
  });
};

const HomeScreen = ({ navigation }) => {
  return (
    <>
      <Button title="Go to profile" onPress={() => navigation.navigate('Profile', { name: 'Lane' })} />
      <Button title="Call native method" onPress={() => navigation.navigate('NativeMethod', {})} />
      <Button title="Scan barcode" onPress={() => navigation.navigate('BarcodeScanner', {})} />
      <Button title="Scan barcode (preview)" onPress={() => navigation.navigate('BarcodeScannerPreview', {})} />
      <Button title="Net info" onPress={() => navigation.navigate('NetInfoDemo', {})} />
      <Button title="Local notification" onPress={() => navigation.navigate('LocalNotification', {})} />
      <Button title="Remote notification" onPress={() => navigation.navigate('RemoteNotification', {message: "nil"})} />
    </>
  );
};

const ProfileScreen = ({ navigation, route }) => {
  return (
    <>
      <Text>This is {route.params.name}'s profile</Text>
      <Image source={{uri: 'https://clipground.com/images/desert-biome-outline-clipart-2.jpg'}}
        style={{width: 195, height: 136}} />
    </>
  );
};

export default App;
