import React from 'react';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button } from '@ui-kitten/components';
import SplashScreen from './src/pages/SplashScreen';
import DisconnectScreen from './src/pages/DisconnectScreen'
import Service from './src/Service';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginHorizontal: 8,
  },
});

const App = () => {

  const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null
  const [counter, setCounter] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [connected, setConnected] = React.useState(false);

  const MainApp = () => {
    return (
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text category='h1'>HOME</Text>
        <Button onPress={() => setCounter(counter + 1)}>
          BUTTON
        </Button>
        <Text style={styles.text}>
          {`Pressed ${counter} times`}
        </Text>
      </Layout>
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