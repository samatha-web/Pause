import React, { useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '899567865539-a3oi1j9eehdj13d0avuuolocsaaimf8i.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut(); // Ensure account picker is shown

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data.idToken;

      // Use 10.0.2.2 for Android Emulator to access localhost of the host machine
      const response = await fetch("http://10.0.2.2:3000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();
      console.log("BACKEND:", data);

      if (response.ok) {
        Alert.alert("Success", "You have logged in successfully!");
      } else {
        Alert.alert("Login Failed", data.message || "Something went wrong during authentication.");
      }

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log("User cancelled login");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        Alert.alert("In Progress", "Sign in is already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert("Error", "Google Play Services not available.");
      } else {
        // some other error happened
        console.error(error);
        Alert.alert("Error", "Login failed. Please try again.");
      }
    }
  };


  return (
    <View style={styles.container}>
      <Button title="Sign in with Google" onPress={signIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
