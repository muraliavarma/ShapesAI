#pragma strict
var player : GameObject;
var entranceScript : EntranceMoveScript;
var playerShapeScript : ShapeScript;
var questionMark : GameObject;
var showSolution1 : boolean;
var showSolution2 : boolean;
var pentagonShape : GameObject;
var puzzle1Script : puzzleSolution1Script;
var puzzle2Script : puzzleSolution2Script;
var puzzle1Text: GameObject;
var puzzle2Text: GameObject;
var puzzle1Text2: GameObject;
var puzzle2Text2: GameObject;
var puzzleMainText: GameObject;
var splitText: GameObject;
var done = false;

function Start () {
	entranceScript = GameObject.Find("Entrance").GetComponent(EntranceMoveScript);
	playerShapeScript = player.GetComponent(ShapeScript);
	questionMark.renderer.material.color = Color.black;
	puzzle1Script = GameObject.Find("PuzzleTop").GetComponent(puzzleSolution1Script);
	puzzle2Script = GameObject.Find("PuzzleBottom").GetComponent(puzzleSolution2Script);
	puzzle1Text.renderer.material.color.a = 0;
	puzzle2Text.renderer.material.color.a = 0;
	puzzle1Text2.renderer.material.color.a = 0;
	puzzle2Text2.renderer.material.color.a = 0;
	puzzleMainText.renderer.material.color.a = 0;
}

function Update () {
	
	if(Vector3.Distance(player.transform.position, splitText.transform.position) < 8 && GameObject.Find('AI').GetComponent(ShapeScript).polySize < 3) {
		if(splitText.renderer.material.color.a <= 1) {
			splitText.renderer.material.color.a+=0.01;
		}
	}
	else {
		if(splitText.renderer.material.color.a >= 0) {
			splitText.renderer.material.color.a-=0.01;
		}
	}

	if(Vector3.Distance(player.transform.position, transform.position) < 1) {
		GameObject.Find('AI').GetComponent(ShapeScript).polySize = 2;
		//Application.LoadLevel(3);
		return;
	}
	
	if(Mathf.Abs(player.transform.position.y - puzzleMainText.transform.position.y) < 4) {
		if(puzzleMainText.renderer.material.color.a <= 1) {
			puzzleMainText.renderer.material.color.a+=0.01;
		}
	}
	else{
		if(puzzleMainText.renderer.material.color.a >= 0) {
			puzzleMainText.renderer.material.color.a-=0.01;
		}		
	}
	
	if(showSolution1 && showSolution2) {
		if (!done) {
			done = true;
			GameObject.Find("AI").GetComponent(AIScriptLevel2).networkState = 'exit';
			GameObject.Find("AI").GetComponent(AIScriptLevel2).done = false;
			GameObject.Find("AIMemory").GetComponent(AIMemoryScript).clearNetwork();
			puzzle1Script.enabled = false;
			puzzle2Script.enabled = false;
			questionMark.active = false;
			pentagonShape.active = true;
		}
		if(Vector3.Distance(transform.position, player.rigidbody.position) <= 5 ) {
			if(playerShapeScript.polySize == 6) {
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
	
	if(showSolution1) {
		if(puzzle1Text.renderer.material.color.a <= 1) {
			puzzle1Text.renderer.material.color.a+=0.01;
		}
		if(puzzle1Text2.renderer.material.color.a <= 1) {
			puzzle1Text2.renderer.material.color.a+=0.01;
		}
	}
	else {
		if(puzzle1Text.renderer.material.color.a >= 0) {
			puzzle1Text.renderer.material.color.a-=0.01;
		}
		if(puzzle1Text2.renderer.material.color.a >= 0) {
			puzzle1Text2.renderer.material.color.a-=0.01;
		}
	}
	
	if(showSolution2) {
		if(puzzle2Text.renderer.material.color.a <= 1) {
			puzzle2Text.renderer.material.color.a+=0.01;
		}
		if(puzzle2Text2.renderer.material.color.a <= 1) {
			puzzle2Text2.renderer.material.color.a+=0.01;
		}
	}
	else {
		if(puzzle2Text.renderer.material.color.a >= 0) {
			puzzle2Text.renderer.material.color.a-=0.01;
		}
		if(puzzle2Text2.renderer.material.color.a >= 0) {
			puzzle2Text2.renderer.material.color.a-=0.01;
		}
	}
}