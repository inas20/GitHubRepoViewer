import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerText}>Welcome to GitHub Repositories</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#C678',
    bordeEndRadius: 30,
    height: '25%',
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});
