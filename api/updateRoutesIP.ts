const RANGE = 0.01; // degrees

async function updateRoutesIP(lat: Number, lng: Number, setRoutes: Function) {
	
	// stops (coords -> stop_id)
	let endpoint: string = `https://data.edmonton.ca/resource/4vt2-8zrq.json?$limit=50000&$select=stop_id,stop_name&$where=stop_lat between ${lat - RANGE} and ${lat + RANGE} AND stop_lon between ${lng - RANGE} and ${lng + RANGE}`;
	let stopRes: Response = await fetch(encodeURI(endpoint));
	
	if (stopRes.status != 200) {
		console.log("bad stop data");
		return;
	}
	let stops = await stopRes.json();

	// trip schedule (stop_id -> route #)
	endpoint = `https://data.edmonton.ca/resource/4fvt-p2se.json?$limit=50000&$select=distinct trip_headsign,route_id,stop_id&$where=stop_id in(${stops.map((stop: any) => `'${stop.stop_id}'`).join(",")})`;
	let stopTimeRes: Response = await fetch(encodeURI(endpoint));
	
	if (stopTimeRes.status != 200) {
		console.log("bad time data");
		return;
	}
	let stopTimes = await stopTimeRes.json();

	//finishing
	console.log("request done");
}

export default updateRoutesIP;
