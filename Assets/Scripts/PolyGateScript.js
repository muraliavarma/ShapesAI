#pragma strict
var openTrigger:boolean;
var initPosition:Vector3;
var player : GameObject;
var triangleShape : GameObject;
var requiredPolySize: int;
var done = false;
var fountain: GameObject;

function Start () {
	initPosition = transform.position;
	if (Application.loadedLevel == 2) {
		fountain = GameObject.Find('Fountain');
		fountain.SetActiveRecursively(false);
	}
}

function Update () {
	if(Vector3.Distance(transform.position, player.rigidbody.position) < 5) {
		if (player.GetComponent(ShapeScript).polySize == requiredPolySize) {
			if (Application.loadedLevel == 2 && !done) {
				done = true;
				fountain.SetActiveRecursively(true);
				GameObject.Find("AI").GetComponent(AIScriptLevel2).networkState = 'puzzle';
				GameObject.Find("AI").GetComponent(AIScriptLevel2).done = false;
				GameObject.Find("AIMemory").GetComponent(AIMemoryScript).clearNetwork();
			}
			if(transform.position.y - initPosition.y <= 5) {
				transform.position.y += 0.05;
			} 
			if(transform.position.y - initPosition.y >= 2.5){
				triangleShape.active = false;
			}
		}
	}
}