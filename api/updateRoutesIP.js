async function updateRoutesIP(lat, lng, range, setRoutes, setStops) {
	// stops (coords -> stop_id)
	let endpoint = `https://data.edmonton.ca/resource/4vt2-8zrq.json?$limit=50000&$select=stop_id,stop_name,stop_lat,stop_lon&$where=stop_lat between ${
		lat - range
	} and ${lat + range} AND stop_lon between ${lng - range} and ${lng + range}`;
	let stopRes = await fetch(encodeURI(endpoint));

	if (stopRes.status != 200) {
		console.log('bad stop data');
		return;
	}
	let stops = await stopRes.json();
	let stopMap = {};
	stops.forEach(stop => {
		stopMap[stop.stop_id] = stop;
	});

	// trip schedule (stop_id -> route #)
	endpoint = `https://data.edmonton.ca/resource/4fvt-p2se.json?$limit=50000&$select=distinct trip_headsign,route_id,stop_id&$where=stop_id in(${stops
		.map(stop => `'${stop.stop_id}'`)
		.join(',')})`;
	let routeRes = await fetch(encodeURI(endpoint));

	if (routeRes.status != 200) {
		console.log('bad time data');
		return;
	}
	let routes = await routeRes.json();
	let routeMap = {};

	routes.forEach(route => {
		if (routeMap[route.route_id] == undefined) {
			routeMap[route.route_id] = stopMap[route.stop_id];
		} else {
			let oldLat = routeMap[route.route_id].stop_lat;
			let oldLng = routeMap[route.route_id].stop_lon;
			let newLat = stopMap[route.stop_id].stop_lat;
			let newLng = stopMap[route.stop_id].stop_lon;
			let oldDist = Math.hypot(oldLat - lat, oldLng - lng);
			let newDist = Math.hypot(newLat - lat, newLng - lng);
			if (newDist < oldDist) {
				routeMap[route.route_id] = stopMap[route.stop_id];
			}
		}
	});

	setRoutes(Object.keys(routeMap));

	let uniqueStops = {};

	Object.values(routeMap).forEach(stop => {
		uniqueStops[stop.stop_id] = stop;
	});

	console.log(Object.values(uniqueStops));

	setStops(Object.values(uniqueStops));

	//finishing
	console.log('request done');
}

export default updateRoutesIP;
