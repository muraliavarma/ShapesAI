#pragma strict
var player : GameObject;
var entranceScript : EntranceMoveScript;
var playerShapeScript : ShapeScript;
var helpText : GameObject;
var fountainText: GameObject;
var spaceText: GameObject;
var shapeObject: GameObject;

function Start () {
	entranceScript = GameObject.Find("Entrance").GetComponent(EntranceMoveScript);
	playerShapeScript = player.GetComponent(ShapeScript);
	for(var child: Transform in fountainText.transform) {
		child.renderer.material.color.a = 0;
	}
}

function Update () {

	if(Vector3.Distance(player.transform.position, spaceText.transform.position) < 8 && GameObject.Find('AI').GetComponent(ShapeScript).polySize > 2) {
		if(spaceText.renderer.material.color.a <= 1) {
			spaceText.renderer.material.color.a+=0.01;
		}
	}
	else {
		if(spaceText.renderer.material.color.a >= 0) {
			spaceText.renderer.material.color.a-=0.01;
		}
	}
	
	if(Vector3.Distance(transform.position, player.rigidbody.position) <= 5 ) {
		if(helpText.renderer.material.color.a <= 1) {
				helpText.renderer.material.color.a+=0.01;
		}
		if(playerShapeScript.polySize == shapeObject.GetComponent(ShapeScript).polySize) {
			entranceScript.openTrigger = true;
		}
		else {
			entranceScript.openTrigger = false;
		}
	}
	else {
		entranceScript.openTrigger = false;
		if(helpText.renderer.material.color.a >= 0) {
			helpText.renderer.material.color.a-=0.01;
		}
	}
	
	if(Vector3.Distance(player.transform.position, transform.position) < 1) {
		Application.LoadLevel(2);
	}
	
	if(Vector3.Distance(player.transform.position, Vector3(-3, 11, 0)) < 4) {
		for(var child: Transform in fountainText.transform) {
			if(child.renderer.material.color.a <= 1) {
				child.renderer.material.color.a+=0.01;
			}
		}
	}
	else {
		for(var child: Transform in fountainText.transform) {
			if(child.renderer.material.color.a >= 0) {
				child.renderer.material.color.a-=0.01;
			}
		}
	}

}