import React, { Component } from 'react';
import {
    Alert,
} from 'react-native';

const simpleAlert = (title, message, hasCancel, buttonOne = null, buttonTwo = null) => {
    Alert.alert(
        title,
        message,
        [
            buttonOne,
            buttonTwo,
            hasCancel ? { style: "cancel", text: "dismiss", onPress: () => { } } : {},
        ],
        { cancelable: hasCancel },
    );
}

class SimpleAlerts{
    noNetworkConnected = () => {
        simpleAlert(
            'Error',
            'Please connect to a network.',
            true
        );
    }
    noLanguageSelected = () => {
        simpleAlert(
            'No Language',
            'Please select an output language.',
            true
        );
    }
    errorOnInput = () => {
        simpleAlert(
            'Error',
            'Are you sure that this request is valid?',
            true,

        );
    }
    errorWhileGettingImage = () => {
        simpleAlert(
            'Error',
            'Failed to receive your image.',
            true,
        );
    }
    appInformation = () => {
        simpleAlert(
            'Translite 1.0',
            'Enter text into either box, then submit. The translation will show inside the opposite box.',
            true,
        );
    }
}

const alerts = new SimpleAlerts();
export default alerts;