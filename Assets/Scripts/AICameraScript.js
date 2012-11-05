#pragma strict

var target: Transform;

function Start () {

}

function Update () {
	transform.LookAt(target);
	transform.localPosition.x = target.localPosition.x;
	transform.localPosition.y = target.localPosition.y;
}