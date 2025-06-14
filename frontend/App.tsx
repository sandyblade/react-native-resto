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
import CreateOrder from './src/pages/CreateOrder';
import CurrentOrder from './src/pages/CurrentOrder';
import CheckoutOrder from './src/pages/CheckoutOrder';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import Toast from 'react-native-toast-message';

const App = () => {

  const [loading, setLoading] = React.useState(true);
  const [connected, setConnected] = React.useState(false);
  const [tabName, setTabName] = React.useState('Home');


  const logged: boolean = Service.logged()
  const Stack = createNativeStackNavigator()
  const navigationRef = useNavigationContainerRef<any>()

  const changeScreen = (name: any, option: any) => {
    navigationRef.navigate(name, option)
  }

  const mainApp = (name: string) => {
    setTabName(name)
  }



  const MainApp = () => {
    return (
      <>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={logged ? 'Main' : 'Login'}>
            <Stack.Screen name="Login" component={(props: any) => (<Login {...props} />)} />
            <Stack.Screen name="Main" component={(props: any) => (<MainLayout tabName={tabName} changeScreen={changeScreen} {...props} />)} />
            <Stack.Screen name="ForgotPassword" component={(props: any) => (<ForgotPassword {...props} />)} />
            <Stack.Screen name="ResetPassword" component={(props: any) => (<ResetPassword {...props} />)} />
            <Stack.Screen name="ChangePassword" component={(props: any) => (<ChangePassword mainApp={mainApp} {...props} />)} />
            <Stack.Screen name="CreateOrder" component={(props: any) => (<CreateOrder mainApp={mainApp} changeScreen={changeScreen} {...props} />)} />
            <Stack.Screen name="CurrentOrder" component={(props: any) => (<CurrentOrder changeScreen={changeScreen} {...props} />)} />
            <Stack.Screen name="CheckoutOrder" component={(props: any) => (<CheckoutOrder changeScreen={changeScreen}{...props} />)} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </>
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