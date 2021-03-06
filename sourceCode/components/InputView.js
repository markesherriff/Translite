//react core packages
import React, { Component, useState, useEffect } from 'react';
import {
  Keyboard,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
} from "react-native";

//community installed packages
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import NetInfo from "@react-native-community/netinfo";

//homemade components and classes
import alerts from './SimpleAlerts';
import theme from './Theme';

export default function InputView({ initialPlaceHolder, text, setText, translateInput }) {

  const [image, setImage] = useState();

  const imageToText = async () => {
    setText({ ...text, isLoading: true });
    var recognitionResult = await TextRecognition.recognize(image.assets[0].uri);
    setText({ ...text, value: recognitionResult[0] });
  };

  useEffect(() => {
    if (image != null && image.didCancel != true) imageToText();
  }, [image]);

  return (
    <View style={styles.container}>
      {!text.isFocused && text.value != "" ? <View></View> :
        <View style={{ ...styles.actionView, flex: !text.isFocused ? 5 : 1.5 }}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Keyboard.dismiss();
              setText({ ...text, isFocused : false});
            }}
          >
            <Image
              style={styles.actionIcon}
              source={require('../assets/icons/dropdown.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              Alert.alert(
                'Camera or Library',
                'Select Photos from Library or Take Photo with Camera?',
                [
                  { style: "cancel", text: "cancel", onPress: () => { { } } },
                  { text:  "library", onPress: () => { launchImageLibrary({}, setImage); } },
                  { text: "camera", onPress: () => { launchCamera({}, setImage); } },
                ],
                { cancelable: true },
              );
            }}
          >
            <Image
              style={styles.actionIcon}
              source={require('../assets/icons/camera.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setText({ ...text, value : '' });
            }}
          >
            <Image
              style={{...styles.actionIcon, aspectRatio: 0.8}}
              source={require('../assets/icons/delete.png')}
            />
          </TouchableOpacity>
        </View>
      }
      <TextInput
        style={styles.textBox}
        value={text.value}
        onChangeText={(newValue) => setText({ ...text, value: newValue })}
        placeholder={initialPlaceHolder}
        multiline={true}
        returnKeyType="go"
        blurOnSubmit={true}
        onFocus={() => { setText({ ...text, isFocused: true }); }}
        onBlur={() => { setText({ ...text, isFocused: false }); }}
        onSubmitEditing={() => { 
          NetInfo.fetch().then(state => {
            if(state.isConnected){
              translateInput();
            }else{
              alerts.noNetworkConnected();
            }
          }); 
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionView: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 30,
    marginRight: 20,
  },
  actionIcon: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    aspectRatio: 1,
    opacity: 0.3,
  },
  textBox: {
    textAlignVertical: 'top',
    flex: 12,
    fontSize: 20,
    color: theme.colors.a1
  },
});