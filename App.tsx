import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { registerBackgroundFetchAsync } from './utils';
export default function App() {
  
  React.useEffect(() => {

    registerBackgroundFetchAsync();

  }, []);

  return (
    <View style={styles.container}>
      <Text>This client has been connected successfully</Text>
      <Text>You can close this app now</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


