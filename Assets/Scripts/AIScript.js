#pragma strict

var player: GameObject;
var waypointContainer: GameObject;
var waypoints: Array;
var targetWaypointIdx: int;
var currWaypointIdx: int;
var spawnComplete;
var done = false;
var aiMemoryScript: AIMemoryScript;
var shapeScriptAI:ShapeScript;

function Start () {
	player = GameObject.Find("Player");
	waypointContainer = GameObject.Find("Waypoints");
	aiMemoryScript = GameObject.Find("AIMemory").GetComponent(AIMemoryScript);
	shapeScriptAI = GetComponent(ShapeScript);

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
		var closestWaypointIdx: int;
		var minDistance: float = 100000;
	
		for(var i = 0; i < waypoints.length; i++) {
			//iterate through each waypoint and find which is closest to AI
			var waypoint:Transform = waypoints[i];
			if(Vector3.Distance(waypoint.position, transform.position) < minDistance) {
				minDistance = Vector3.Distance(waypoint.position, transform.position);
				closestWaypointIdx = i;
			}
		}
		currWaypointIdx = closestWaypointIdx;
	}
	
	if(polySize < 3) {
		spawnComplete = false;
	}
	else if (aiMemoryScript.selectedOption != -1) {
		//this means that the player has selected some option
		moveToWaypoint();
	}
	else {
		targetWaypointIdx = waypointClosestToPlayer();
		moveToWaypoint();
		if (currWaypointIdx != 6 && aiMemoryScript.selectedOption == -1) {
			done = false;
			aiMemoryScript.clearNetwork();
		}
	}
}

function moveToWaypoint() {
	var dir = (waypoints[currWaypointIdx] as Transform).position - transform.position;
	transform.position += 0.1 * dir.normalized;
	
	if(currWaypointIdx == targetWaypointIdx && dir.magnitude < 1) {
		if (!done && targetWaypointIdx == 6) {
			done = true;
			//player and ai have both reached the door. generate network now
			var smartDoor = new Hashtable();
			smartDoor['name'] = 'exit';
			smartDoor['requiredPlayerPolySize'] = 5;
			smartDoor['requiredAIPolySize'] = 2;
			smartDoor['requiredColor'] = 'a';
			smartDoor['requiredRotation'] = 0;
			GameObject.Find("AIMemory").GetComponent(AIMemoryScript).generateNetwork(smartDoor);
		}
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
	return closestWaypointIdx == 16 ? 15 : closestWaypointIdx;

}

//this function is called from the ai memory. actions can be go to fountain of life/death, color ai, rotate etc
function execute(state: Hashtable) {
	var action = state ? state['action'] : 'follow';
	if (action == 'follow') {
		targetWaypointIdx = waypointClosestToPlayer();
	}
	else {
		targetWaypointIdx = 16;
	}
}

function OnCollisionEnter(collision: Collision) {

	//Debug.Log(collision.collider.name);
	var fountainFlag: boolean = collision.gameObject.GetComponent(FountainScript).state;
	var oldColor : Color;
	var newTimer = Time.time;
	var pushVector: Vector3 = transform.position - collision.contacts[0].point;
	transform.position += 0.2 * pushVector;
	if(collision.collider.name.Contains("Fountain")) {
		//Multiple collision handling.
		if(newTimer - collision.gameObject.GetComponent(FountainScript).oldTimer >= 1) { 
			collision.gameObject.GetComponent(FountainScript).oldTimer = Time.time;
			if(fountainFlag) {
				shapeScriptAI.createPoly(++shapeScriptAI.polySize);
				collision.gameObject.GetComponent(FountainScript).swapState();
				// oldColor = collision.collider.renderer.material.color;
				// collision.collider.renderer.material.color = Color.white;
				// player.GetComponent(PlayerScript).fountainFlag = !fountainFlag;
			}
			else {
				//shapeScriptPlayer.createPoly(shapeScriptPlayer.polySize + shapeScriptAI.polySize - 3);
				shapeScriptAI.createPoly(--shapeScriptAI.polySize);
				collision.gameObject.GetComponent(FountainScript).swapState();
				// collision.collider.renderer.material.color = oldColor;
				// player.GetComponent(PlayerScript).fountainFlag = !fountainFlag;
			}	
		}
	}
	
}
