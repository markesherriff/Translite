//react core packages
import React, { Component, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Dimensions,
  StatusBar
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
import theme from './Theme';
import AppBar from './AppBar';


const windowHeight = Dimensions.get('window').height;

const loadingIndicator = <ActivityIndicator size="large" color={theme.colors.a2} />;

const interstitialId = Platform.OS === 'ios' ? FBADS_IOS_INTERSTITIAL : FBADS_ANDROID_INTERSTITIAL;
const runAdTimer = () => {
  setTimeout(() => {
    InterstitialAdManager.showAd(interstitialId)
      .then(didClose => { runAdTimer(); })
      .catch(error => { runAdTimer(); });
  }, 120000); //120,000 == 2 minutes
};
//runAdTimer();

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
    } catch (e) { }
  }
  useEffect(() => {
    getLangsFromStorage();
  }, []);
  useEffect(() => {
    saveLangsToStorage();
  }, [langA, langB]
  );

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

  return (
    <View style={styles.page}>
      <AppBar />
      <View style={styles.body}>
        <LanguageButton
          buttonColor={theme.colors.a1}
          lang={langA}
          setLang={setLangA}
        />
        {
          textB.isFocused ? <View style={{ marginBottom: 10 }}></View>
            :
            <View style={{ ...styles.box, borderColor: theme.colors.a1 }}>
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
          buttonColor={theme.colors.b1}
          lang={langB}
          setLang={setLangB}
        />
        {
          textA.isFocused ? <View style={{ marginBottom: 10 }}></View>
            :
            <View style={{ ...styles.box, borderColor: theme.colors.b1 }}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.colors.a2,
  },
  body: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
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
