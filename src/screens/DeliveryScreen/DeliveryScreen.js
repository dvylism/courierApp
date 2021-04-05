import React, { useEffect, useState } from 'react'
import {FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View, VirtualizedList} from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config';

export default function DeliveryScreen(props) {
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
            .where("deliveryDriver", "==", userID)
            .where("status", ">=", 102)
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
    }, [])

    // const onAddButtonPress = () => {
    //     if (entityText && entityText.length > 0) {
    //         const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    //         const data = {
    //             text: entityText,
    //             authorID: userID,
    //             createdAt: timestamp,
    //         };
    //         entityRef
    //             .add(data)
    //             .then(_doc => {
    //                 setEntityText('')
    //                 Keyboard.dismiss()
    //             })
    //             .catch((error) => {
    //                 alert(error)
    //             });
    //     }
    // }
    //
    const renderEntity = ({item, index}) => {
        return (
            <View style={styles.entityContainer}>
                <Text style={styles.entityText}>
                    {item.number}  {item.receiverAddress}
                </Text>
            </View>
        )
    }

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
