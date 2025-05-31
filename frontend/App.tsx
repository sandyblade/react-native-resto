import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import SplashScreen from './src/pages/SplashScreen';
import DisconnectScreen from './src/pages/DisconnectScreen'
import Service from './src/Service';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainLayout from './src/pages/MainLayout';
import Login from './src/pages/Login';
import ForgotPassword from './src/pages/ForgotPassword';
import ResetPassword from './src/pages/ResetPassword';
import ChangePassword from './src/pages/ChangePassword';
import { EvaIconsPack } from '@ui-kitten/eva-icons';;

const App = () => {

  const logged: boolean = Service.logged()
  const [loading, setLoading] = React.useState(true);
  const [connected, setConnected] = React.useState(false);
  const Stack = createNativeStackNavigator()
  const navigationRef = useNavigationContainerRef<any>()

  const changeScreen = (name: any, option: any) => {
    navigationRef.navigate(name, option)
  }

  const MainApp = () => {
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={logged ? 'Main' : 'Login'}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Main" component={() => <MainLayout changeScreen={changeScreen} />} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="ChangePassword" component={() => <ChangePassword />} />
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
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <App />
    </ApplicationProvider>
  </>
);