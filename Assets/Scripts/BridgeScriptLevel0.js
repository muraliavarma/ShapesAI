#pragma strict

var player: GameObject;

function Start () {

}

function Update () {

	if(Vector3.Distance(player.transform.position, transform.position) < 5) {
		// var smartDoor = new Hashtable();
		// smartDoor['name'] = 'exit';
		// smartDoor['requiredPolySize'] = 5;
		// smartDoor['requiredColor'] = 'a';
		// smartDoor['requiredRotation'] = 0;
		// GameObject.Find("AIMemory").GetComponent(AIMemoryScript).generateNetwork(smartDoor);
		Application.LoadLevel(1);
	}

}