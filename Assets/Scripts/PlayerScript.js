#pragma strict
var shapeScriptPlayer:ShapeScript;
var ai: GameObject;
var shapeScriptAI:ShapeScript;
var oldColor : Color;
var aiMemoryScript: AIMemoryScript;

function Start () {
	shapeScriptPlayer = gameObject.GetComponent(ShapeScript);
	ai = GameObject.Find("AI");
	shapeScriptAI = ai.GetComponent(ShapeScript);
	aiMemoryScript = GameObject.Find("AIMemory").GetComponent(AIMemoryScript);
}

function Update () {
	transform.localPosition.x += 0.1 * Input.GetAxis('Horizontal');
	transform.localPosition.y += 0.1 * Input.GetAxis('Vertical');
	
	//Split
	if(Input.GetKeyUp(KeyCode.LeftShift)) {
		if (aiMemoryScript.SPLIT == 0) {
			aiMemoryScript.doFlashText('Learnt Splitting!');
		}
		if(shapeScriptPlayer.polySize > 3) {
			aiMemoryScript.SPLIT = 1;
			shapeScriptPlayer.createPoly(--shapeScriptPlayer.polySize);
			shapeScriptAI.createPoly(++shapeScriptAI.polySize);
		}
	}
	
	//Merge
	if(Input.GetKeyUp(KeyCode.Space)) {
		if (aiMemoryScript.MERGE == 0) {
			aiMemoryScript.doFlashText('Learnt Merging!');
		}
		aiMemoryScript.MERGE = 1;
		if(shapeScriptAI.polySize >= 3) {
			shapeScriptPlayer.createPoly(++shapeScriptPlayer.polySize);
			shapeScriptAI.createPoly(--shapeScriptAI.polySize);
			if(shapeScriptAI.polySize == 2) {
				shapeScriptAI.mesh.Clear();
			}
		}
	}

	if(Input.GetKey(KeyCode.Q)) {
		transform.Rotate(0, 0, 5);
	}

	if(Input.GetKey(KeyCode.E)) {
		transform.Rotate(0, 0, -5);
	}

}

function OnCollisionEnter(collision: Collision) {

	//Debug.Log(collision.collider.name);
	var newTimer = Time.time;
	var pushVector: Vector3 = transform.position - collision.contacts[0].point;
	transform.position += 0.2 * pushVector;
	if(collision.collider.name.Contains("Fountain")) {
		//Multiple collision handling.
		if(newTimer - collision.gameObject.GetComponent(FountainScript).oldTimer >= 2) { 
			collision.gameObject.GetComponent(FountainScript).oldTimer = Time.time;
			var fountainFlag: boolean = collision.gameObject.GetComponent(FountainScript).state;
			if(fountainFlag) {
				if(shapeScriptAI.polySize < 3) {
					shapeScriptAI.createPoly(++shapeScriptAI.polySize);
				}
				else {
					shapeScriptPlayer.createPoly(++shapeScriptPlayer.polySize);
				}
				collision.gameObject.GetComponent(FountainScript).swapState();
				//oldColor = collision.collider.renderer.material.color;
				//collision.collider.renderer.material.color = Color.white;
				//collision.gameObject.GetComponent(FountainScript).state = !fountainFlag;
			}
			//allow decrement only if cumulative size greater than 3
			else if(shapeScriptPlayer.polySize + shapeScriptAI.polySize - 2 > 3) {
				//if ai, then decrement ai
				if (shapeScriptAI.polySize > 2) {
					shapeScriptAI.createPoly(shapeScriptAI.polySize - 1);
				}
				//otherwise decrement player (obviously)
				else {
					shapeScriptPlayer.createPoly(shapeScriptPlayer.polySize - 1);
				}
				collision.gameObject.GetComponent(FountainScript).swapState();
				//collision.collider.renderer.material.color = oldColor;
				//collision.gameObject.GetComponent(FountainScript).state = !fountainFlag;
			}	
		}
	}
	
}

function OnCollisionStay(collision: Collision) {
	OnCollisionEnter(collision);
}