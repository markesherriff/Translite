import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import theme from './Theme';

export default function LanguageButton({buttonColor, lang, setLang}) {
    return (
      <TouchableOpacity
        style={{ ...styles.langButton, backgroundColor: buttonColor}}
        onPress={() => {
          setLang({...lang, isOpened: !lang.isOpened});
        }}
      >
        <Text style={styles.langButtonText}>
          {lang.value.title}
        </Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  langButton: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 40,
    justifyContent: "center",
  },
  langButtonText: {
    color: theme.colors.a2,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: "center",
  },
});
