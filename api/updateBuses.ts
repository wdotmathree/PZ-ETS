import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

function updateBuses(setBusList) {
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
		let curBusList: Object[] = [];
		feed.entity.forEach((entity:any) => {
			if (!entity.vehicle) return;
			let routeId = entity.vehicle?.trip?.routeId;
			if (routeId == undefined) return;
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
