#pragma strict
var chosenShapeScript : ShapeScript;
var solutionArea : GameObject;
var player : GameObject;
var ai : GameObject;
var playerShapeScript : ShapeScript;
var aiShapeScript : ShapeScript;
var bridgeScriptLevel2 : BridgeScriptLevel2;

function Start () {
	playerShapeScript = player.GetComponent(ShapeScript);
	aiShapeScript = ai.GetComponent(ShapeScript);
	bridgeScriptLevel2 = GameObject.Find("Bridge").GetComponent(BridgeScriptLevel2);
}

function Update () {
	
	if(Vector3.Distance(player.transform.position, solutionArea.transform.position) < Vector3.Distance(ai.transform.position, solutionArea.transform.position)) {
		chosenShapeScript = playerShapeScript;
	}
	else {
		chosenShapeScript = aiShapeScript;
	}
	
	//Debug.Log(Vector3.Distance(player.transform.position, solutionArea.transform.position));
	if(Vector3.Distance(player.transform.position, solutionArea.transform.position) < 3 || Vector3.Distance(ai.transform.position, solutionArea.transform.position) < 3) { 
		if(chosenShapeScript.polySize == 3) {
			bridgeScriptLevel2.showSolution1 = true;
		}
		else {
			bridgeScriptLevel2.showSolution1 = false;
		}
	}
	else {
		bridgeScriptLevel2.showSolution1 = false;
	}

}