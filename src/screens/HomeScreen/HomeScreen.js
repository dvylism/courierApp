import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, Button } from 'react-native'
import styles from './styles';
// import { firebase } from '../../firebase/config';
import firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
import DeliveryScreen from "../DeliveryScreen/DeliveryScreen";
import PickupScreen from "../PickupScreen/PickupScreen";
import ScanScreen from "../ScanScreen/ScanScreen";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
export default function HomeScreen(props) {
console.log(props);

    return (
        <>
            <Button
                title="Atsijungti"
                onPress={() => firebase.auth().signOut()}
            />
        <Tab.Navigator
            tabBarOptions={{
                labelStyle: {fontSize:18},
                activeTintColor: 'red',
                inactiveTintColor: 'black'
            }}
        >
            <Tab.Screen
                name="Paėmimas"
                children={()=><PickupScreen additionalProps={props}/>}

            />
            <Tab.Screen
                name="Pristatymas"
                children={()=><DeliveryScreen additionalProps={props}/>}
            />
            <Tab.Screen
                name="Skanavimas"
                children={()=><ScanScreen additionalProps={props}/>}
            />
        </Tab.Navigator>
            </>
    )
}
