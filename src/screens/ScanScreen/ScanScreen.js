import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {firebase} from '../../firebase/config';
import Statuses from '../../Statuses';
export default function BarcodeScanner(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('shipments')
    const userID = props.additionalProps.extraData.displayName;



    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        entityRef
            .where("pickupDriver", "==", userID)
            // .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newEntities = []
                    querySnapshot.forEach(doc => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity)
                    });
                    setEntities(newEntities)


                },
                error => {
                    console.log(error)
                }
            )
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // console.log(Statuses.status);
      // entities.map( (entity, i ) => console.log())
        let courierPackages = entities.map(i => i.packages.map(j => {
            console.log("j.id", j.id);
            console.log("data", data);
            console.log("i", i);
        // }
            if (j.id === data){
            alert(`Bar code with type ${type} and data ${data} has been scanned!`);

            console.log(entityRef.doc(i.id));
                entityRef.doc(i.id).update({
                    status: i.status + 1 })
            } else alert(`Pakuotė nerasta!`);
        }));
    };

    if (hasPermission === null) {
        return <Text>Reikalaujama kameros priegos</Text>;
    }
    if (hasPermission === false) {
        return <Text>Kameros prieiga nerasta</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button title={'Skanuoti dar kartą'} onPress={() => setScanned(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});