// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import LoginScreen from './loginScreen';
import RegisterScreen from './registerScreen';
import HomeScreen from './homeScreen';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyAdquXyrdIHgpswKeLdclK_00scTp8RalA",
  authDomain: "kitap-takip-67654.firebaseapp.com",
  projectId: "kitap-takip-67654",
  storageBucket: "kitap-takip-67654.firebasestorage.app",
  messagingSenderId: "661267396178",
  appId: "1:661267396178:web:75573d981ed82d52f7118b",
  measurementId: "G-74J6DW9YKN"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return null; // Yükleme ekranı eklenebilir
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Kitap Koleksiyonum' }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Giriş Yap' }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Kayıt Ol' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
