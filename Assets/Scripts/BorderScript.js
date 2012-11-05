#pragma strict
var player : GameObject;
var startPosition : Vector3;
var movementInstructions : GameObject;

function Start () {
	startPosition = Vector3(-80,0.7888,0.0);
}

function Update () {
	if(Vector3.Distance(player.rigidbody.position, startPosition) <= 3) {
		if(movementInstructions.renderer.material.color.a <= 1)
			movementInstructions.renderer.material.color.a += 0.01;
	}
	else {
		if(movementInstructions.renderer.material.color.a >= 0)
			movementInstructions.renderer.material.color.a -= 0.01;
	}
}