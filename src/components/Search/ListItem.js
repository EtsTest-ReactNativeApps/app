import React, {useState} from 'react';
import {
	View,
	Text,
	Dimensions,
	Modal,
	Pressable,
	Image,
	StyleSheet,
	Alert,
} from 'react-native';
import Type from '../Shared/Type';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../constants/colors';
import LinearGradient from '../Shared/LinearGradient';
import Overlay from './Overlay';

const {width, height} = Dimensions.get('screen');

const ListItem = ({navigation, data}) => {
	const [modalVisible, setModalVisible] = useState(false);

	const handlePress = () => {
		console.log('lol pressed');
		// return <Overlay open={true} />;
		setModalVisible(true);
	};

	return (
		<View style={{flexDirection: 'row', width: '100%'}}>
			<View style={styles.centeredView}>
				<Overlay
					data={data}
					toggleVisibility={setModalVisible}
					modalVisible={modalVisible}
				/>
			</View>

			<View
				style={{
					width: width / 7,
					height: width / 7,
					borderRadius: 1,
					marginVertical: 5,
					marginHorizontal: 10,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Image
					source={{
						uri: data.album_image,
					}}
					style={{
						width: 50,
						height: 50,
						borderRadius: 6,
						overflow: 'hidden',
					}}
				/>
			</View>

			<View
				style={{
					marginVertical: 10,
					marginHorizontal: 15,
					justifyContent: 'space-around',
					flex: 1,
				}}>
				<View
					style={{
						flexDirection: 'row',
						marginTop: 5,
						justifyContent: 'space-between',
						flex: 1,
						width: '100%',
					}}>
					<Type
						style={{
							fontSize: width / 24,
							color: colors.text,
							fontWeight: 'bold',
						}}>
						{data.track_name.length > 10
							? `${data.track_name.substring(0, 10)}....`
							: data.track_name}
					</Type>

					<TouchableOpacity onPress={handlePress}>
						<Icon
							name="pause-outline"
							size={20}
							style={{
								color: 'white',
							}}
						/>
					</TouchableOpacity>
				</View>

				<Type
					style={{
						fontSize: width / 26,
						color: '#D3D3D3',
					}}>
					{data.artist_name}
				</Type>
			</View>
		</View>
	);
};

export default ListItem;

const styles = StyleSheet.create({
	centeredView: {},
});