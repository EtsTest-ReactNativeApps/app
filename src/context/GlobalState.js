import React, {createContext, useEffect, useReducer} from 'react';
import AppReducer from './AppReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Actions} from './ActionsOverview';

const initialState = {
	user:null,
	token:null,
	queue: [],
	color: '',
	pausedState:true,
	selectedTrack:0
};

const retrieveItem = async (key) => {
	try {
		const data = await AsyncStorage.getItem(key);
		return data ? JSON.parse(data) : initialState[key];
	} catch (e) {
		console.log('Failed to fetch the data from storage');
	}
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({children}) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	useEffect(() => {
		const fetchQueue = async () => {
			const queue = await retrieveItem('queue');
			dispatch({type: Actions.UPDATE_QUEUE, payload: queue});
		};

		const fetchUser = async () => {
			const user = await retrieveItem("user");
			dispatch({
				type:Actions.UPDATE_USER,payload:user
			})
		}

		const fetchToken = async () => {
			const token = await retrieveItem("token");
			dispatch({
				type:Actions.UPDATE_TOKEN,payload:token
			})
		}

		const fetchPausedState = async () => {
			const pausedState = await retrieveItem("pausedState");
			dispatch({
				type:Actions.UPDATE_PAUSEDSTATE,
				payload:pausedState
			})
		}

		const fetchSelectedTrack = async () => {
			const selectedTrack = await retrieveItem("selectedTrack");
			dispatch({
				type:Actions.UPDATE_SELECTEDTRACK,
				payload:selectedTrack
			})
		}

		fetchUser();
		fetchToken();
		fetchQueue();
		fetchPausedState();
		fetchSelectedTrack();

	}, []);

	const updateUser = (userDetails) => {
		dispatch({
			type:Actions.UPDATE_USER,
			payload:userDetails
		})
	}

	const updateToken = (token) => {
		dispatch({
			type:Actions.UPDATE_TOKEN,
			payload:token
		})
	}

	const updateQueue = (trackDetails) => {
		dispatch({
			type: Actions.UPDATE_QUEUE,
			payload: trackDetails,
		});
	};

	const updateColor = (color) => {
		dispatch({
			type: Actions.UPDATE_COLOR,
			payload: color,
		});
	};

	const updatePausedState = (currentState) => {
		dispatch({
			type: Actions.UPDATE_PAUSEDSTATE,
			payload:currentState
		})
	}

	const updateSelectedTrack = (selectedIndex) => {
		console.log(selectedIndex,"selected from dispatch fun");
		dispatch({
			type: Actions.UPDATE_SELECTEDTRACK,
			payload: selectedIndex
		})
	}

	return (
		<GlobalContext.Provider
			value={{
				queue: state.queue,
				color: state.color,
				pausedState:state.pausedState,
				selectedTrack:state.selectedTrack,
				updateUser,
				updateToken,
				updateQueue,
				updateColor,
				updatePausedState,
				updateSelectedTrack,
			}}>
			{children}
		</GlobalContext.Provider>
	);
};
