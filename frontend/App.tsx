import React from 'react';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button } from '@ui-kitten/components';



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

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <App />
  </ApplicationProvider>
);