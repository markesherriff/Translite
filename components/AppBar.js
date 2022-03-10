import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    StatusBar
} from "react-native";

import theme from './Theme';

export default function AppBar({ buttonColor, lang, setLang }) {

    return (
        <View style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={theme.colors.a3}
                hidden={false} 
                />
            <Text style={styles.title}>
                Translator Pro
            </Text>
            <TouchableOpacity style={styles.actionButton}>
                <Image style={styles.actionIcon} source={require('../assets/icons/undo.png')}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: theme.colors.a3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,
    },
    title: {
        flex: 9,
        color: theme.colors.a2,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "left"
    },
    actionButton: {
        flex: 1
    },
    actionIcon: {
        flex: 1,
        resizeMode: 'contain',
        aspectRatio: 0.4,
        tintColor: theme.colors.a2
    },
});