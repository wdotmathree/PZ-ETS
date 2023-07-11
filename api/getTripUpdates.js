function getTripUpdates(setTripUpdates) {
	let endpoint =
		'http://gtfs.edmonton.ca/TMGTFSRealTimeWebService/TripUpdate/TripUpdates.pb';
	let req = new XMLHttpRequest();
	req.open('GET', endpoint, true);
	req.responseType = 'arraybuffer';
	req.send();
	req.onloadend = () => {
		const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
			new Uint8Array(req.response),
		);
		let curList = [];

		feed.entity.forEach(entity => {
			if (!entity.tripUpdate) return;
			let routeId = entity.tripUpdate?.trip?.routeId;
			if (routeId == undefined) return;
			curList.push({
				trip: entity.tripUpdate.trip,
				stopTimeUpdate: entity.tripUpdate.stopTimeUpdate,
			});
		});
		setTripUpdates(curList);
	};
}

export default getTripUpdates;
