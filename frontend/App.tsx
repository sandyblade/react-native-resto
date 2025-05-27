import React from 'react';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button } from '@ui-kitten/components';
import SplashScreen from './src/pages/SplashScreen';
import DisconnectScreen from './src/pages/DisconnectScreen'
import Service from './src/Service';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainLayout from './src/pages/MainLayout';
import Login from './src/pages/Login';
import ForgotPassword from './src/pages/ForgotPassword';
import ResetPassword from './src/pages/ResetPassword';

const App = () => {

  const logged: boolean = Service.logged()
  const [loading, setLoading] = React.useState(true);
  const [connected, setConnected] = React.useState(false);
  const Stack = createNativeStackNavigator()

  const MainApp = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Main" component={MainLayout} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  const loadContent = React.useCallback(async () => {
    await Service.ping()
      .then(() => {
        setTimeout(() => {
          setLoading(false)
          setConnected(true)
        }, 1500)
      })
      .catch(() => {
        setLoading(false)
        setConnected(false)
      })

  }, [loading, connected])

  const auth = async () => {
    if (logged) {
      await Service.profile.detail()
        .catch((error) => {
          if (error.status === 401) {
            if (localStorage.getItem('auth_token')) {
              localStorage.removeItem('auth_token')
            }
            if (localStorage.getItem('auth_user')) {
              localStorage.removeItem('auth_user')
            }
          }
        })
    }
  }

  React.useEffect(() => {
    auth()
    loadContent()
  }, [])

  return (
    <>
      {loading ? <SplashScreen /> : <>
        {connected ? <MainApp /> : <>
          <DisconnectScreen />
        </>}
      </>}
    </>
  )
}

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <App />
  </ApplicationProvider>
);