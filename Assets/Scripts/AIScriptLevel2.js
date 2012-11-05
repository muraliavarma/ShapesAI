#pragma strict

var player: GameObject;
var waypointContainer: GameObject;
var waypoints: Array;
var targetWaypointIdx: int;
var currWaypointIdx: int;
var spawnComplete;
var aiCameraActive:boolean;
var aiCamera:GameObject;
var done = false;
var aiMemoryScript: AIMemoryScript;
var networkState;	//this shows whether the AI is generating the network for the gate, puzzle1, puzzle 2 or exit
var isSolvingPuzzle = false;
var shapeScriptAI:ShapeScript;
var oldTimer:float = 0;

function Start () {
	player = GameObject.Find("Player");
	waypointContainer = GameObject.Find("Waypoints");

	var potentialWaypoints: Array = waypointContainer.GetComponentsInChildren(Transform);
	aiMemoryScript = GameObject.Find("AIMemory").GetComponent(AIMemoryScript);
	shapeScriptAI = GetComponent(ShapeScript);

	waypoints = new Array();
	for(var potentialWaypoint: Transform in potentialWaypoints) {
		if(potentialWaypoint != waypointContainer.transform) {
			waypoints[waypoints.length] = potentialWaypoint;
		}
	}
	
	aiCamera = GameObject.Find("AICamera");
	aiCamera.active = false;
	networkState = 'gate';
}

function Update() {
	var polySize = GetComponent(ShapeScript).polySize;
	if(!spawnComplete && polySize >= 3) {
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
		aiCameraActive = false;
		targetWaypointIdx = waypointClosestToPlayer();
		moveToWaypoint();
		if (networkState == 'gate' && currWaypointIdx != 7 && aiMemoryScript.selectedOption == -1) {
			done = false;
			aiMemoryScript.clearNetwork();
		}
		else if (networkState == 'puzzle' && (currWaypointIdx < 12 && currWaypointIdx > 2) && aiMemoryScript.selectedOption == -1) {
			done = false;
			aiMemoryScript.clearNetwork();
		}
		else if (networkState == 'exit' && currWaypointIdx != 3 && aiMemoryScript.selectedOption == -1) {
			done = false;
			aiMemoryScript.clearNetwork();
		}
	}


}

function moveToWaypoint() {
	
	//var bridgeScript:BridgeScriptLevel2 = GameObject.Find("BorderOuter/Bridge").GetComponent(BridgeScriptLevel2);
	aiCameraActive = true;
	
	//AI Camera setting
	if(aiCameraActive) {
		aiCamera.active = true;
	}
	else {
		aiCamera.active = false;
	}

	var dir = (waypoints[currWaypointIdx] as Transform).position - transform.position;

	if (currWaypointIdx == 7 && targetWaypointIdx == 7 && isSolvingPuzzle) {
		//then magik, go out of the way and touch fountain
		dir = GameObject.Find('Fountain').transform.position - transform.position;
		transform.position += 0.1 * dir.normalized;
		return;
	}

	transform.position += 0.1 * dir.normalized;
	
	if(currWaypointIdx == targetWaypointIdx && dir.magnitude < 1) {
		if (!done && targetWaypointIdx == 7 && networkState == 'gate') {
			done = true;
			//player and ai have both reached the door. generate network now
			var smartDoor = new Hashtable();
			smartDoor['name'] = 'gate';
			smartDoor['requiredPlayerPolySize'] = 3;
			smartDoor['requiredAIPolySize'] = 5;
			smartDoor['requiredColor'] = 'a';
			smartDoor['requiredRotation'] = 0;
			GameObject.Find("AIMemory").GetComponent(AIMemoryScript).generateNetwork(smartDoor);
		}
		if (!done && targetWaypointIdx >= 12 && networkState == 'puzzle') {
			done = true;
			smartDoor = new Hashtable();
			smartDoor['name'] = 'puzzle1';
			smartDoor['action'] = 'solve';
			smartDoor['requiredPlayerPolySize'] = 4;
			smartDoor['requiredAIPolySize'] = 3;
			smartDoor['requiredColor'] = 'a';
			smartDoor['requiredRotation'] = 0;
			GameObject.Find("AIMemory").GetComponent(AIMemoryScript).generateNetwork(smartDoor);
		}
		if (!done && targetWaypointIdx < 2 && networkState == 'puzzle') {
			done = true;
			smartDoor = new Hashtable();
			smartDoor['name'] = 'puzzle2';
			smartDoor['action'] = 'solve';
			smartDoor['requiredPlayerPolySize'] = 3;
			smartDoor['requiredAIPolySize'] = 4;
			smartDoor['requiredColor'] = 'a';
			smartDoor['requiredRotation'] = 0;
			GameObject.Find("AIMemory").GetComponent(AIMemoryScript).generateNetwork(smartDoor);
		}
		if (!done && targetWaypointIdx == 3 && networkState == 'exit') {
			done = true;
			smartDoor = new Hashtable();
			smartDoor['name'] = 'exit';
			smartDoor['requiredPlayerPolySize'] = 6;
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
	return closestWaypointIdx;

}

function execute(state: Hashtable) {
	var action = state ? state['action'] : 'follow';
	if (action == 'follow') {
		targetWaypointIdx = waypointClosestToPlayer();
	}
	else if (state['name'] == 'puzzle1') {
		targetWaypointIdx = 0;
	}
	else if (state['name'] == 'puzzle2') {
		targetWaypointIdx = 13;
	}
	else if (action == 'aifountain' || action == 'aideath') {
		//ai fountain of life/death
		targetWaypointIdx = 7;
		isSolvingPuzzle = true;
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
		isSolvingPuzzle = false;
		if(newTimer - oldTimer >= 1) { 
			oldTimer = Time.time;
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
