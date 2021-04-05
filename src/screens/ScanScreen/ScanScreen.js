import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
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
            const {status} = await BarCodeScanner.requestPermissionsAsync();
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

    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        // console.log(Statuses.status);
        // entities.map( (entity, i ) => console.log())
        let courierPackages = entities.map(i => i.packages.map((j, key) => {
            // console.log("j.id", j.id);
            // console.log("j", j);
            // console.log("key", key);
            // console.log("data", data);
            // console.log("i", i);
            //Jeigu sutampa pakuotės ID su skanuoto barkodo ID, pazymima pakuotė kaip nuskanuota
            if (j.id == data) {
                alert(`Bar code with type ${type} and data ${data} has been scanned!`);
                j.isScanned = true;
                 entityRef.doc(i.id).update({
                     packages: i.packages });
                // return;
            } else <Text>Pakuotė nerasta!</Text>;

            // Patikrinimas ar visos pakuotės nuskanuotos, jeigu taip, keiciamas statusas
           if(i.packages.every(packageItem => packageItem.isScanned)) {
               entityRef.doc(i.id).update({
                   status: i.status + 1 });
               //Nuresetinami pakuotems statusai, jog jos vel nenuskanuotos, po statuso pasikeitimo
               i.packages.map(packageItem => packageItem.isScanned = false);
               //Atnaujinamos pakuotės į DB
               entityRef.doc(i.id).update({
                   packages: i.packages });
               // return;
           }
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
            {scanned && <Button title={'Skanuoti dar kartą'} onPress={() => setScanned(false)}/>}
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