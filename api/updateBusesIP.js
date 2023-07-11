import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

function updateBuses(lat, lng, range, setBusList) {
	let req = new XMLHttpRequest();
	req.open(
		'GET',
		'http://gtfs.edmonton.ca/TMGTFSRealTimeWebService/Vehicle/VehiclePositions.pb',
		true,
	);
	req.responseType = 'arraybuffer';
	req.send();
	req.onloadend = () => {
		const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
			new Uint8Array(req.response),
		);
		let curBusList = [];
		feed.entity.forEach(entity => {
			if (!entity.vehicle) return;
			let routeId = entity.vehicle?.trip?.routeId;
			if (routeId == undefined) return;
			let busLat = entity.vehicle.position.latitude;
			let butLng = entity.vehicle.position.longitude;
			if (Math.abs(lat - busLat) > range || Math.abs(lng - butLng) > range)
				return;
			curBusList.push({
				position: entity.vehicle.position,
				routeId: routeId,
				id: entity.vehicle.vehicle?.id,
			});
		});

		setBusList(curBusList);
	};
}

export default updateBuses;
