#pragma strict
var openTrigger:boolean;
var initPosition:Vector3;

function Start () {
	initPosition = transform.position;
}

function Update () {
	
	if(openTrigger) {
		if(initPosition.x - transform.position.x <= 5) {
			transform.position.x -= 0.05;
		} 
	}
	else {
		if(transform.position.x - initPosition.x <= 0) {
			transform.position.x += 0.05;
		}
	}

}