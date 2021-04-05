import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, VirtualizedList, StyleSheet, Text, StatusBar } from 'react-native';
import styles from './styles';
import { firebase } from '../../firebase/config';


export default function PickupScreen(props) {

    const getItem = (data, index) => ({
        id: Math.random().toString(12).substring(0),
        number: data[index].number,
        receiverAddress: data[index].receiverAddress,
        status: data[index].status,
    });

    const getItemCount = (data) => data.length;

    const Item = ({ number, receiverAddress, status }) => (
        <View style={styles.item}>
            <Text style={styles.title}>Siuntos numeris {number}</Text>
            <Text style={styles.title}>Siuntėjo adresas {receiverAddress}</Text>
            <Text style={styles.title}>Statusas {status}</Text>
        </View>
    );
    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('shipments')
    const userID = props.additionalProps.extraData.displayName;
    useEffect(() => {
        entityRef
            .where("pickupDriver", "==", userID)
            .where("status", "==", 101)
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
    }, [])


    return (
        <SafeAreaView style={styles.container}>
            <VirtualizedList
                data={entities}
                initialNumToRender={4}
                renderItem={({ item }) => <Item number={item.number} receiverAddress={item.receiverAddress} status={item.status} />}
                keyExtractor={item => item.key}
                getItemCount={getItemCount}
                getItem={getItem}
            />
        </SafeAreaView>
    )
}
