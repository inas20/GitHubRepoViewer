/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export const AppButton = ({label, disabled, onPress, style}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={disabled ? null : onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#C67889',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: 'grey',
  },
});
