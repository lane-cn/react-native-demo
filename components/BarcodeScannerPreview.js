import * as React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import ScanButton from './ScanButton';

const BarcodeScannerPreview = () => {
    const [code, setCode] = React.useState("");
    const [title, setTitle] = React.useState("scan barcode");
    const [action, setAction] = React.useState("init");

    const update = e => {
        console.log(e.nativeEvent);
        setCode(e.nativeEvent.code + " (" + e.nativeEvent.type + ")");
        setAction('init')
    };

    const doScan = e => {
        setAction('scan');
    }
    
    return (
        <>
            <Text>Barcode scanner with preview demonstration</Text>
            <Button title="Scan in React Native" onPress={doScan} />
            <View style={styles.container}>
                <TextInput value={code} style={styles.wrapper} placeholder="Here's barcode value" multiline={true} />
                <ScanButton onScanSuccess={e => update(e)} title={title} action={action} style={styles.button} />
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1, alignItems: "stretch"
    },
    wrapper: {
      flex: 1, alignItems: "stretch", fontSize: 16, color: "red"
    },
    border: {
      borderColor: "#eee", borderBottomWidth: 1
    },
    button: {
        flex: 1, alignItems: "stretch", 
    }
});

export default BarcodeScannerPreview;