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
import updateBuses from './api/updateBuses';
import updateRoutesIP from './api/updateRoutesIP';

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
					updateBuses(setBusList);
					updateRoutesIP(curPos.latitude, curPos.longitude, setRoutes);
					setInterval(updateBuses, 10000, setBusList);
				}}
				onRegionChange={() => (moving = true)}
				onRegionChangeComplete={loc => {
					moving = false;
					setTimeout(
						(lat, lng, setRoutes) => {
							if (moving) return;
							moving = true;
							console.log('request sending');
							updateRoutesIP(lat, lng, setRoutes).then(() => (moving = false));
						},
						1000,
						loc.latitude,
						loc.longitude,
						setRoutes,
					);
				}}>
				{busList.map(bus => {
					return (
						<Marker
							key={bus.id}
							coordinate={bus.position}
							anchor={{x: 0.5, y: 0.3}}>
							<View>
								<Image
									rotation={bus.position.bearing - 270}
									className="w-10 h-10"
									source={require('./images/bus.png')}
								/>
								<Text className="mt-[-6] text-blue-900 place-self-center text-center">
									{bus.routeId}
								</Text>
							</View>
						</Marker>
					);
				})}
			</MapView>
		</SafeAreaView>
	);
}

export default App;
