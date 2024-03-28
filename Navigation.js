import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import StartPage from './StartPage'; // Adjust the path according to your project structure
import GamePage from './GamePage'; // Adjust the path according to your project structure

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName="StartPage">
            <Stack.Screen name="StartPage" component={StartPage} options={{ title: 'Welcome' }} />
            <Stack.Screen name="GamePage" component={GamePage} options={{ title: 'Memory Game' }} />
        </Stack.Navigator>
    );
}

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
