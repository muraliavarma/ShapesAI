#pragma strict

var player: GameObject;
var waypointContainer: GameObject;
var waypoints: Array;
var targetWaypointIdx: int;
var currWaypointIdx: int;
var spawnComplete;

function Start () {
	player = GameObject.Find("Player");
	waypointContainer = GameObject.Find("Waypoints");

	var potentialWaypoints: Array = waypointContainer.GetComponentsInChildren(Transform);
	waypoints = new Array();
	for(var potentialWaypoint: Transform in potentialWaypoints) {
		if(potentialWaypoint != waypointContainer.transform) {
			waypoints[waypoints.length] = potentialWaypoint;
		}
	}
	
}

function Update() {
	var polySize = GetComponent(ShapeScript).polySize;
	if(!spawnComplete && polySize == 3) {
		//spawn code
		spawnComplete = true;
		
		transform.position = player.transform.position;
		
		//move to closest waypoint upon spawn
		// var closestWaypointIdx: int;
		// var minDistance: float = 100000;
	
		// for(var i = 0; i < waypoints.length; i++) {
		// 	//iterate through each waypoint and find which is closest to AI
		// 	var waypoint:Transform = waypoints[i];
		// 	if(Vector3.Distance(waypoint.position, transform.position) < minDistance) {
		// 		minDistance = Vector3.Distance(waypoint.position, transform.position);
		// 		closestWaypointIdx = i;
		// 	}
		// }
		// currWaypointIdx = closestWaypointIdx;
	}
	
	if(polySize < 3) {
		spawnComplete = false;
	} else {
		currWaypointIdx = waypointClosestToPlayer();
		moveToWaypoint();
	}
}

function moveToWaypoint() {
	var dir = (waypoints[currWaypointIdx] as Transform).position - transform.position;
	transform.position += 0.1 * dir.normalized;
	
	if(currWaypointIdx == targetWaypointIdx && dir.magnitude < 1) {
		return;
	}
	if(dir.magnitude < 1) {
		if(currWaypointIdx > targetWaypointIdx) {
			currWaypointIdx --;
		}
		if(currWaypointIdx < targetWaypointIdx) {
			currWaypointIdx ++;
		}
	}
	
}


function waypointClosestToPlayer() {
	var closestWaypointIdx: int;
	var minDistance: float = 100000;

	for(var i = 0; i < waypoints.length; i++) {
		//iterate through each waypoint and find which is closest to AI
		var waypoint:Transform = waypoints[i];
		if(Vector3.Distance(waypoint.position, player.transform.position) < minDistance) {
			minDistance = Vector3.Distance(waypoint.position, player.transform.position);
			closestWaypointIdx = i;
		}
	}
	return closestWaypointIdx;

}