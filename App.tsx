//react imports
import React, {Fragment, useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
	SafeAreaView,
	ScrollView,
	Text,
	useColorScheme,
	NativeModules,
	StyleSheet,
	View,
	Image,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
const {MainReactModule} = NativeModules;

//api call imports
import updateBusesIP from './api/updateBusesIP';
import updateRoutesIP from './api/updateRoutesIP';

//constants
const RANGE = 0.005;
const BUS_ICON = require('./images/bus.png');
const STOP_ICON = require('./images/stop.png');
const CROSSHAIR_ICON = require('./images/crosshair.png');

//permission checking
check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
	.then(result => {
		switch (result) {
			case RESULTS.UNAVAILABLE:
				console.log(
					'This feature is not available (on this device / in this context)',
				);
				break;
			case RESULTS.DENIED:
				request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
					.then(result => {
						console.log('The permission is granted');
					})
					.catch(error => {
						console.error('Error requesting location permission', error);
					});
				break;
			case RESULTS.LIMITED:
				console.log('The permission is limited: some actions are possible');
				break;
			case RESULTS.GRANTED:
				console.log('The permission is granted');
				break;
			case RESULTS.BLOCKED:
				console.log('The permission is denied and not requestable anymore');
				break;
		}
	})
	.catch(error => {
		console.error('Error checking location permission', error);
	});

check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
	.then(result => {
		switch (result) {
			case RESULTS.UNAVAILABLE:
				console.log(
					'This feature is not available (on this device / in this context)',
				);
				break;
			case RESULTS.DENIED:
				request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
					.then(result => {
						console.log('The permission is granted');
					})
					.catch(error => {
						console.error('Error requesting location permission', error);
					});
				break;
			case RESULTS.LIMITED:
				console.log('The permission is limited: some actions are possible');
				break;
			case RESULTS.GRANTED:
				console.log('The permission is granted');
				break;
			case RESULTS.BLOCKED:
				console.log('The permission is denied and not requestable anymore');
				break;
		}
	})
	.catch(error => {
		console.error('Error checking location permission', error);
	});

//main app
function App() {
	const [curPos, setCurPos] = useState({
		latitude: 53.456617,
		longitude: -113.516498,
		latitudeDelta: 0.008,
		longitudeDelta: 0.008,
	});
	const [busList, setBusList] = useState([]);
	const [routes, setRoutes] = useState([]);
	const [stopList, setStopList] = useState([]);
	var moving = false;

	return (
		<SafeAreaView>
			<MapView
				className="z-10 top-0 pb-[100vh] left-0 right-0 absolute"
				initialRegion={curPos}
				showsUserLocation={true}
				onUserLocationChange={loc => {
					setCurPos({
						latitude: loc.latitude,
						longitude: loc.longitude,
						latitudeDelta: 0.008,
						longitudeDelta: 0.008,
					});
				}}
				onMapReady={() => {
					updateBusesIP(curPos.latitude, curPos.longitude, RANGE, setBusList);
					updateRoutesIP(
						curPos.latitude,
						curPos.longitude,
						RANGE,
						setRoutes,
						setStopList,
					);
					setInterval(
						updateBusesIP,
						10000,
						curPos.latitude,
						curPos.longitude,
						RANGE,
						setBusList,
					);
				}}
				onRegionChange={loc => {
					moving = true;
					setCurPos(loc);
				}}
				onRegionChangeComplete={loc => {
					moving = false;
					setTimeout(
						(lat, lng, setRoutes) => {
							if (moving) return;
							moving = true;
							console.log('request sending');
							updateRoutesIP(lat, lng, RANGE, setRoutes, setStopList).then(
								() => (moving = false),
							);
							updateBusesIP(
								curPos.latitude,
								curPos.longitude,
								RANGE,
								setBusList,
							);
						},
						100,
						loc.latitude,
						loc.longitude,
						setRoutes,
					);
				}}>
				<Marker
					coordinate={{
						longitude: curPos.longitude,
						latitude: curPos.latitude,
					}}
					anchor={{x: 0.5, y: 0.5}}>
					<View>
						<Image className="w-5 h-5" source={CROSSHAIR_ICON} />
					</View>
				</Marker>
				{busList.map((bus: any) => {
					return (
						<Marker
							key={bus.id}
							coordinate={bus.position}
							anchor={{x: 0.5, y: 0.3}}>
							<View>
								<Image
									rotation={bus.position.bearing - 270}
									className="w-10 h-10"
									source={BUS_ICON}
								/>
								<Text className="mt-[-6] text-blue-900 place-self-center text-center">
									{bus.routeId}
								</Text>
							</View>
						</Marker>
					);
				})}
				{stopList.map((stop: any) => {
					return (
						<Marker
							key={stop.stop_id}
							coordinate={{
								latitude: parseFloat(stop.stop_lat),
								longitude: parseFloat(stop.stop_lon),
							}}
							onPress={() => console.log(stop.stop_name)}
							anchor={{x: 0.5, y: 0.5}}>
							<View>
								<Image className="w-5 h-5" source={STOP_ICON} />
								{/* <Text className="mt-[-6] text-blue-900 place-self-center text-center">
									{stop.stop_name}
								</Text> */}
							</View>
						</Marker>
					);
				})}
			</MapView>
		</SafeAreaView>
	);
}

export default App;
