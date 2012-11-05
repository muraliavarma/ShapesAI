#pragma strict

var player: GameObject;
var waypointContainer: GameObject;
var waypoints: Array;
var targetWaypointIdx: int;
var currWaypointIdx: int;
var spawnComplete: boolean;
var aiCameraActive:boolean;
var aiCamera:GameObject;
var waypointLogic: Array;
var shapeScriptAI:ShapeScript;
var oldTimer:float = 0;

function Start () {

	var potentialWaypoints: Array = waypointContainer.GetComponentsInChildren(Transform);
	waypoints = new Array();
	for(var potentialWaypoint: Transform in potentialWaypoints) {
		if(potentialWaypoint != waypointContainer.transform) {
			waypoints[waypoints.length] = potentialWaypoint;
		}
	}
	
	shapeScriptAI = GetComponent(ShapeScript);
	
	
	aiCamera = GameObject.Find("AICamera");
	aiCamera.active = false;
	
	waypointLogic = new Array(waypoints.length);
	//dyeing red
	waypointLogic[7] = new Array(16, 15, 14, 13, 12, 11, 8, 7);
	//finishing red
	waypointLogic[20] = new Array(7, 8, 11, 12, 13, 14, 15, 16, 20);
	//dyeing blue
	waypointLogic[9] = new Array(19, 20, 16, 15, 14, 13, 12, 11, 10, 9);
	//finishing blue
	waypointLogic[15] = new Array(9, 10, 11, 12, 13, 14, 15);
	
	//touching fountain
	waypointLogic[4] = new Array(15, 16, 20, 19, 17, 18, 1, 2, 3, 4);
	
	//fountain to gate
	waypointLogic[16] = new Array(4, 3, 2, 1, 18, 17, 19, 20, 16);
	
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
	} else {
		moveToWaypoint();
	}
}

function moveToWaypoint() {
	var bridgeScript:BridgeScriptLevel3 = GameObject.Find("BorderOuter/Bridge").GetComponent(BridgeScriptLevel3);
	aiCameraActive = true;
	if(bridgeScript.showSolution1 && bridgeScript.showSolution2) {
		if(player.GetComponent(ShapeScript).polySize + shapeScriptAI.polySize == 7) {
			targetWaypointIdx = 16;
		}
		else {
			targetWaypointIdx = 4;
		}
	}
	else if(bridgeScript.showSolution1) {
		Debug.Log("Sol1: " + bridgeScript.showSolution1);
		if(this.renderer.material.color == Color.blue) {
			Debug.Log("Already blue color");
			targetWaypointIdx = 15;
		}
		else {
			Debug.Log("Gonna color me blue!");
			targetWaypointIdx = 9;
		}
	}
	else if(bridgeScript.showSolution2) {
		Debug.Log("Sol2: " + bridgeScript.showSolution2);
		if(this.renderer.material.color == Color.red) {
			Debug.Log("Already red color");
			targetWaypointIdx = 20;
		}
		else {
			Debug.Log("Gonna color me red!");
			targetWaypointIdx = 7;
		}
	}
	else {
		//default is ai chasing player, so targetwaypoint is waypoint closest to player
		targetWaypointIdx = waypointClosestToPlayer();
		aiCameraActive = false;
	}
	
	//AI Camera setting
	if(aiCameraActive) {
		aiCamera.active = true;
	}
	else {
		aiCamera.active = false;
	}

	
	var dir = (waypoints[currWaypointIdx] as Transform).position - transform.position;
	transform.position += 0.1 * dir.normalized;
	
	if(currWaypointIdx == targetWaypointIdx && dir.magnitude < 1) {
	
		if(targetWaypointIdx == 7) {
			targetWaypointIdx = 15;
		}
		if(targetWaypointIdx == 9) {
			targetWaypointIdx = 20;
		}
	
		return;
	}
	if(dir.magnitude < 1) {
	
		if(targetWaypointIdx == 7 || targetWaypointIdx == 9 || targetWaypointIdx == 20 ||
			targetWaypointIdx == 15 || targetWaypointIdx == 4 || targetWaypointIdx == 16) {
			//player has solved blue, AI goes to dye red
			var currArray: Array = (waypointLogic[targetWaypointIdx] as Array);
			var idx = -1;
			for(var i = 0; i < currArray.length; i++) {
				if(currArray[i] == currWaypointIdx) {
					idx = i;
					break;
				}
			}
			if(idx > -1 && idx + 1 < currArray.length) {
				currWaypointIdx = currArray[idx + 1];
			}
			return;
		}
	
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


function OnCollisionEnter(collision: Collision) {

	//Debug.Log(collision.collider.name);
	var fountainFlag: boolean = collision.gameObject.GetComponent(FountainScript).state;
	var oldColor : Color;
	var newTimer = Time.time;
	var pushVector: Vector3 = transform.position - collision.contacts[0].point;
	transform.position += 0.2 * pushVector;
	if(collision.collider.name.Contains("Fountain")) {
		//Multiple collision handling.
		if(newTimer - oldTimer >= 2) { 
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
