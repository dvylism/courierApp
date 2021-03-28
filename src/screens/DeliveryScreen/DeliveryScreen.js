import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config';

export default function DeliveryScreen(props) {

    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState([])

    const entityRef = firebase.firestore().collection('shipments')
    const userID = props.additionalProps.extraData.displayName;
    useEffect(() => {
        entityRef
            .where("deliveryDriver", "==", userID)
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

    <View style={styles.container}>
        { entities && (
            <View style={styles.listContainer}>
                <FlatList
                    data={entities}
                    renderItem={renderEntity}
                    keyExtractor={(item) => item.id}
                    removeClippedSubviews={true}
                />

            </View>
        )}
    </View>
)
}
