import React from 'react';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button } from '@ui-kitten/components';
import SplashScreen from './pages/SplashScreen';
import DisconnectScreen from './pages/DisconnectScreen';
import { APP_BACKEND_URL } from '@env';

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

  React.useEffect(() => {

    // auth()
    // loadContent()
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