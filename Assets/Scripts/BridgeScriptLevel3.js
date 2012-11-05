#pragma strict
var redSolution : GameObject;
var blueSolution : GameObject;
var questionMark : GameObject;
var pentagonShape : GameObject;
var showSolution1 : boolean;
var showSolution2 : boolean;
var finalSolution : boolean;
var player : GameObject;
var playerShapeScript : ShapeScript;
var entranceScript : EntranceMoveScript;
var puzzle1Script : puzzle1SolutionLevel3;
var puzzle2Script : puzzle2SolutionLevel3;
var doneText: GameObject;

function Start () {
	redSolution.renderer.material.color = Color.red;
	GameObject.Find("RedSolutionSide2").renderer.material.color = Color.red;
	GameObject.Find("RedSolutionSide3").renderer.material.color = Color.red;
	blueSolution.renderer.material.color = Color.blue;
	GameObject.Find("BlueSolutionSide2").renderer.material.color = Color.blue;
	GameObject.Find("BlueSolutionSide3").renderer.material.color = Color.blue;
	questionMark.renderer.material.color = Color.black;
	entranceScript = GameObject.Find("Entrance").GetComponent(EntranceMoveScript);
	playerShapeScript = player.GetComponent(ShapeScript);
	puzzle1Script = GameObject.Find("RedTriangle").GetComponent(puzzle1SolutionLevel3);
	puzzle2Script = GameObject.Find("BlueTriangle").GetComponent(puzzle2SolutionLevel3);
	doneText.renderer.material.color.a = 0;
}

function Update () {
	
	
	if(Vector3.Distance(player.transform.position, transform.position) < 1) {
		if(doneText.renderer.material.color.a <= 1) {
			doneText.renderer.material.color.a+=0.01;
		}
	}

	if((showSolution1 && showSolution2) || finalSolution == true) {
		//Debug.Log("Puzzle completed");
		puzzle1Script.enabled = false;
		puzzle2Script.enabled = false;
		finalSolution = true;
		questionMark.active = false;
		pentagonShape.active = true;
		if(Vector3.Distance(transform.position, player.rigidbody.position) <= 5 ) {
			if(playerShapeScript.polySize == 5) {
				entranceScript.openTrigger = true;
			}
			else {
				entranceScript.openTrigger = false;
			}
		}
		else {
			entranceScript.openTrigger = false;
		}
	}
}