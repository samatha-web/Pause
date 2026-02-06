import React, { useEffect } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';  //SDK

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
    await GoogleSignin.hasPlayServices()

    await GoogleSignin.signOut()  // To Show Acc Picker Every Time

    const userInfo = await GoogleSignin.signIn()

    const idToken = userInfo.data.idToken

    const response = await fetch("http://localhost:3000/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken })
    })

    const data = await response.json()  // JWT + user data
    console.log("BACKEND:", data)

    Alert.alert("Logged In!", "JWT received")

  } catch (error) {
    console.log(error)
    Alert.alert("Error", JSON.stringify(error))
  }
}


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
