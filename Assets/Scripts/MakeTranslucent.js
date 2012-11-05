#pragma strict

function Start () {
	GameObject.Find("RedCube").renderer.material.color.a = 0.75;
	GameObject.Find("GreenCube").renderer.material.color.a = 0.75;
	GameObject.Find("BlueCube").renderer.material.color.a = 0.75;
	GameObject.Find("ColorlessCube").renderer.material.color.a = 0.75;
	
	//Debug.Log(GameObject.Find("RedCube").renderer.material.color.a);
}

function Update () {

}