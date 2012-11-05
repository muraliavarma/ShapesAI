#pragma strict

var state: boolean = true;
var activeColor: Color;
var aiMemoryScript: AIMemoryScript;
var oldTimer:float = 0;

function Start () {
	activeColor = gameObject.renderer.material.color;
	if (!state) {
		gameObject.renderer.material.color = Color.white;
	}
	aiMemoryScript = GameObject.Find("AIMemory").GetComponent(AIMemoryScript);
}

function Update () {

}

function swapState() {
	state = !state;
	if (state) {
		gameObject.renderer.material.color = activeColor;

		if (aiMemoryScript.FOUNTAIN_OF_DEATH == 0) {
			aiMemoryScript.doFlashText('Learnt Fountain of Death!');
		}

		//learn death. life is hard
		aiMemoryScript.FOUNTAIN_OF_DEATH = 1;

	}
	else {
		gameObject.renderer.material.color = Color.white;

		if (aiMemoryScript.FOUNTAIN_OF_LIFE == 0) {
			aiMemoryScript.doFlashText('Learnt Fountain of Life!');
		}
		//learn life. there is life after death
		aiMemoryScript.FOUNTAIN_OF_LIFE = 1;
	}
}