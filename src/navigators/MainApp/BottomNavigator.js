import React from 'react';

import {Dimensions, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

//Colors
import {colors, GRAY, PRIMARY} from '../../constants/colors';

//Screens
import HomeScreen from '../../screens/MainApp/HomeScreen';
import ChatScreen from '../../screens/MainApp/ChatScreen';
import SearchScreen from '../../screens/MainApp/SearchScreen';
import PlayerScreen from '../../screens/MainApp/PlayerScreen';

const Tab = createBottomTabNavigator();

const {width, height} = Dimensions.get('window');

const BottomNavigator = ({navigation}) => {
	return (
		<>
			<Tab.Navigator
				initialRouteName="HomeScreen"
				screenOptions={({route}) => ({
					tabBarIcon: ({focused, color, size}) => {
						let iconName;
						if (route.name === 'HomeScreen') {
							iconName = 'home-outline';
						} else if (route.name === 'SearchScreen') {
							iconName = 'search-outline';
						} else if (route.name === 'ChatScreen') {
							iconName = 'chatbox-outline';
						}
						return (
							<Icon name={iconName} size={size} color={color} />
						);
					},
				})}
				tabBarOptions={{
					activeTintColor: 'white',
					inactiveTintColor: colors.disabled,
					keyboardHidesTabBar: true,
					showLabel: false,
					style: {
						backgroundColor: '#353941',
						height: height / 15,
						borderTopWidth: 0,
					},
				}}>
				<Tab.Screen name="HomeScreen" component={HomeScreen} />
				<Tab.Screen name="SearchScreen" component={SearchScreen} />
				<Tab.Screen name="PlayerScreen" component={PlayerScreen} options={({navigation}) =>{
						let tabBarVisible = false;
						return {
							tabBarVisible
						}
					}}/>
				<Tab.Screen name="ChatScreen" component={ChatScreen} />
			</Tab.Navigator>
		</>
	);
};

export default BottomNavigator;
