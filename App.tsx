/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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

const {MainReactModule} = NativeModules;

import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

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

const {MapModule} = NativeModules;

function App() {
	const [curPos, setCurPos] = useState({
		latitude: 53.47139,
		longitude: -113.34756,
		latitudeDelta: 0.008,
		longitudeDelta: 0.008,
	});

	const [busList, setBusList] = useState({});

	useEffect(() => {
		console.log('fetching');
		let req = new XMLHttpRequest();
		req.open(
			'GET',
			'http://gtfs.edmonton.ca/TMGTFSRealTimeWebService/Vehicle/VehiclePositions.pb',
			true,
		);
		req.responseType = 'arraybuffer';
		req.send();
		req.onload = function () {
			const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
				new Uint8Array(req.response),
			);
			let curBusList = {};
			feed.entity.forEach(entity => {
				// yes it is a string ight
				let routeId = entity.vehicle?.trip?.routeId;
				if (curBusList.hasOwnProperty[routeId] === undefined) {
					curBusList[routeId] = [];
				}
				curBusList[routeId].push({
					position: entity.vehicle.position,
					id: entity.vehicle.id,
				});
			});

			setBusList(curBusList);
			console.log('done fetching');
		};
	}, []);

	return (
		<SafeAreaView>
			<MapView
				className="z-10 top-0 pb-[100vh] left-0 right-0 absolute"
				initialRegion={curPos}
				showsUserLocation={true}
				// pitchEnabled
				onUserLocationChange={loc => {
					setCurPos({
						latitude: loc.latitude,
						longitude: loc.longitude,
						latitudeDelta: 0.008,
						longitudeDelta: 0.008,
					});
				}}>
				{Object.keys(busList).map(routeId => {
					console.log('fjeioafjeaoijef');
					return busList[routeId].map(bus => {
						return (
							<Marker
								key={Math.random()}
								coordinate={bus.position}
								anchor={{x: 0.5, y: 0.5}}
								title={bus.id}
								description="Retrived at 7:34">
								<View>
									<Image
										rotation={bus.position.bearing - 270}
										className="w-10 h-10"
										source={require('./images/bus.png')}
									/>
									<Text className="mt-[-8] text-blue-900 place-self-center text-center">
										{routeId}
									</Text>
								</View>
							</Marker>
						);
					});
				})}
			</MapView>
		</SafeAreaView>
	);
}

const mapStyle = [
	// {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
	// {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
	// {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
	// {
	// featureType: 'administrative.locality',
	// elementType: 'labels.text.fill',
	// stylers: [{color: '#d59563'}],
	// },
	// {
	// featureType: 'poi',
	// elementType: 'labels.text.fill',
	// stylers: [{color: '#d59563'}],
	// },
	// {
	// featureType: 'poi.park',
	// elementType: 'geometry',
	// stylers: [{color: '#263c3f'}],
	// },
	// {
	// featureType: 'poi.park',
	// elementType: 'labels.text.fill',
	// stylers: [{color: '#6b9a76'}],
	// },
	// {
	// featureType: 'road',
	// elementType: 'geometry',
	// stylers: [{color: '#38414e'}],
	// },
	// {
	// featureType: 'road',
	// elementType: 'geometry.stroke',
	// stylers: [{color: '#212a37'}],
	// },
	// {
	// featureType: 'road',
	// elementType: 'labels.text.fill',
	// stylers: [{color: '#9ca5b3'}],
	// },
	// {
	// featureType: 'road.highway',
	// elementType: 'geometry',
	// stylers: [{color: '#746855'}],
	// },
	// {
	// featureType: 'road.highway',
	// elementType: 'geometry.stroke',
	// stylers: [{color: '#1f2835'}],
	// },
	// {
	// featureType: 'road.highway',
	// elementType: 'labels.text.fill',
	// stylers: [{color: '#f3d19c'}],
	// },
	// {
	// featureType: 'transit',
	// elementType: 'geometry',
	// stylers: [{color: '#2f3948'}],
];

const styles = StyleSheet.create({});

export default App;
