#pragma strict
var player : GameObject;

function Start () {
}

function Update () {

}

function OnTriggerEnter (other:Collider) {
	Debug.Log("Hit the redcube");
	if(other.name == "Player" || other.name == "AI") {
		other.gameObject.renderer.material.color = Color.white;
	}
}