#pragma strict
var chosenShapeScript : ShapeScript;
var player : GameObject;
var ai : GameObject;
var playerShapeScript : ShapeScript;
var aiShapeScript : ShapeScript;
var bridgeScriptLevel3 : BridgeScriptLevel3;
var chosenCharacter : GameObject;

function Start () {
	playerShapeScript = player.GetComponent(ShapeScript);
	aiShapeScript = ai.GetComponent(ShapeScript);
	bridgeScriptLevel3 = GameObject.Find("Bridge").GetComponent(BridgeScriptLevel3);
}

function Update () {
	
	if(Vector3.Distance(player.transform.position, transform.position) < Vector3.Distance(ai.transform.position, transform.position)) {
		chosenShapeScript = playerShapeScript;
		chosenCharacter = player;
	}
	else {
		chosenShapeScript = aiShapeScript;
		chosenCharacter = ai;
	}
	
	//Debug.Log(Vector3.Distance(player.transform.position, solutionArea.transform.position));
	if(Vector3.Distance(player.transform.position, transform.position) < 5 || Vector3.Distance(ai.transform.position, transform.position) < 5) { 
		if(chosenCharacter.renderer.material.color == Color.blue && chosenShapeScript.polySize == 3) {
			Debug.Log("Puzzle2 Unlocked");
			bridgeScriptLevel3.showSolution2 = true;
		}
		else {
			bridgeScriptLevel3.showSolution2 = false;
		}
	}
	else {
		bridgeScriptLevel3.showSolution2 = false ;
	}
}