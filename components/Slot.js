// Slot.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Slot = ({ time }) => {
  return (
    <TouchableOpacity style={styles.slot}>
      <Text style={styles.slotText}>{time}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  slot: {
    backgroundColor: '#303f9f',
    borderRadius: 5,
    marginVertical: 5,
    padding: 10,
    alignItems: 'center',
  },
  slotText: {
    color: '#fcfcfc',
    fontSize: 16,
  }
});

export default Slot;
