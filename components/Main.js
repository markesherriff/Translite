//react core packages
import React, { Component, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';

//community installed packages
import translate from 'translate-google-api';
import { InterstitialAdManager } from 'react-native-fbads';
import AsyncStorage from '@react-native-async-storage/async-storage';

//homemade components and classes
import { FBADS_IOS_INTERSTITIAL, FBADS_ANDROID_INTERSTITIAL } from "@env";
import LanguagePicker from './LanguagePicker';
import LanguageButton from './LanguageButton';
import InputView from './InputView';
import alerts from './SimpleAlerts';


const windowHeight = Dimensions.get('window').height;

const colorTheme = {
  "primary": "#323233",
  "p2": '#e6e8eb',
  "p3": "#747575",
  "secondary": "#516c9e",
  "s2": "#6b7c9c"
};

const loadingIndicator = <ActivityIndicator size="large" color={colorTheme.p3} />;

const interstitialId = Platform.OS === 'ios' ? FBADS_IOS_INTERSTITIAL : FBADS_ANDROID_INTERSTITIAL;
const runAdTimer = () => {
  setTimeout(() => {
    InterstitialAdManager.showAd(interstitialId)
      .then(didClose => { runAdTimer(); })
      .catch(error => { runAdTimer(); });
  }, 120000); //120,000 == 2 minutes
};
runAdTimer();

export default function Main() {

  const [textA, setTextA] = useState({
    isLoading: false,
    isFocused: false,
    value: ""
  });
  const [langA, setLangA] = useState({
    isOpened: false,
    value: { title: "Detect Language", code: "" }
  });

  const [textB, setTextB] = useState({
    isLoading: false,
    isFocused: false,
    value: ""
  });
  const [langB, setLangB] = useState({
    isOpened: false,
    value: { title: "French - Canada", code: "fr" }
  });

  const transA = () => translateInput(textA, langA, langB, setTextB);
  const transB = () => translateInput(textB, langB, langA, setTextA);
  const translateInput = async (inputText, inputLang, outputLang, setOutputText) => {
    if (outputLang.value.code == "") {
      alerts.noLanguageSelected();
      return;
    }

    setOutputText({
      isLoading: true,
      isFocused: false,
      value: ""
    });

    await translate(inputText.value, {
      tld: inputLang.value.code,
      to: outputLang.value.code,
    })
      .then((translationValue) => {
        setOutputText({
          isLoading: false,
          isFocused: false,
          value: translationValue[0]
        });
      })
      .catch((e) => {
        alerts.errorOnInput();
        setOutputText({
          isLoading: false,
          isFocused: false,
          value: ''
        });
      });
  };

  const saveLangsToStorage = async () => {
    try {
      await AsyncStorage.setItem('@langA', JSON.stringify(langA));
      await AsyncStorage.setItem('@langB', JSON.stringify(langB));
    } catch (e) { }
  };

  const getLangsFromStorage = async () => {
    try {
      const langAStorage = await AsyncStorage.getItem('@langA');
      const langBStorage = await AsyncStorage.getItem('@langB');
      if (langAStorage != null && langBStorage != null) {
        setLangA(JSON.parse(langAStorage));
        setLangB(JSON.parse(langBStorage));
      }
    } catch (e) {}
  }

  useEffect(()=>{
    getLangsFromStorage();
  },[]);

  useEffect(()=>{
    saveLangsToStorage();
    },[langA, langB]
  );

  return (
    <SafeAreaView style={styles.container}>
      <LanguageButton
        buttonColor={colorTheme.primary}
        lang={langA}
        setLang={setLangA}
      />
      {
        textB.isFocused ? <View style={{ marginBottom: 10 }}></View>
          :
          <View style={{ ...styles.box, borderColor: colorTheme.primary }}>
            {
              langA.isOpened ? <LanguagePicker setLang={setLangA} />
                :
                textA.isLoading ? loadingIndicator :
                  <InputView
                    initialPlaceHolder='type here...'
                    text={textA}
                    setText={setTextA}
                    translateInput={transA}
                  />
            }
          </View>
      }
      <LanguageButton
        buttonColor={colorTheme.secondary}
        lang={langB}
        setLang={setLangB}
      />
      {
        textA.isFocused ? <View style={{ marginBottom: 10 }}></View>
          :
          <View style={{ ...styles.box, borderColor: colorTheme.secondary }}>
            {
              langB.isOpened ? <LanguagePicker setLang={setLangB} />
                :
                textB.isLoading ? loadingIndicator :
                  <InputView
                    initialPlaceHolder={'or type here...'} 
                    text={textB} 
                    setText={setTextB}
                    translateInput={transB}
                    />
            }
          </View>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: colorTheme.p2,
  },
  box: {
    flex: 2,
    borderWidth: 3,
    borderTopWidth: 0,
    marginBottom: 20,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  }
});
