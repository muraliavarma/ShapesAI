var FOUNTAIN_OF_LIFE: int;
var FOUNTAIN_OF_DEATH: int;
var MERGE: int;
var SPLIT: int;
var LEFT_ROTATION: int;
var RIGHT_ROTATION: int;
var COLORING;
var FOUNTAIN_OF_LIFE_COUNT: int;
var FOUNTAIN_OF_DEATH_COUNT: int;

var states = new Array();

var currentState;

var numOptions: int;
var MAX_OPTIONS: int = 9;
var options: Array;
var isGraphGenerated = false;
var selectedOption;

var aiGO: GameObject;
var playerGO: GameObject;
var aiShapeScript: ShapeScript;
var playerShapeScript: ShapeScript;
var aiScript: MonoBehaviour;
var flashes = 0;
var flashText;

function Awake() {
	DontDestroyOnLoad(transform.gameObject);
}

function Start () {
	flashText = GameObject.Find('FlashText');
	//by default the ai knows nothing. And I mean nothing! Except mindlessly following the moron player
	resetLearning();
	selectedOption = -1;
}

function OnLevelWasLoaded(level: int) {
	playerGO = GameObject.Find('Player');
	aiGO = GameObject.Find('AI');
	playerShapeScript = playerGO.GetComponent('ShapeScript');
	aiShapeScript = aiGO.GetComponent('ShapeScript');
	var scripts = aiGO.GetComponents(MonoBehaviour);
	for(var script in scripts) {
		if (script.ToString().Contains('AIScript')) {
			aiScript = script;
		}
	}
	clearNetwork();
}

function Update () {

	if (flashes > 0) {
		flashes --;
		if (flashes % 20 < 10) {
			flashText.guiText.material.color = Color(1, 1, 1);
		}
		else {
			flashText.guiText.material.color = Color(0, 0, 0);
		}

		if (flashes == 0) {
			flashText.guiText.text = '';
		}
	}

	if (Input.GetKeyUp(KeyCode.G)) {
		clearOptions();
	}

	for (var c: char in Input.inputString) {
		if (isGraphGenerated) {
			if (c < '1'[0]|| c > '9'[0]) {
				break;
			}
			selectOption(parseInt(c) - parseInt('1'[0]));
		}
	}

	if (selectedOption != -1) {
		//this means, that the player has chosen one solution. we check in every update cycle which of the state needs to be done and if it is to be done by player or AI
		var option = options[selectedOption];
		for (var i = 0; i < option.length; i++) {
			var state = option[i];
			//TODO fountain
			if (aiShapeScript.polySize == state['aiPoly'] && playerShapeScript.polySize == state['playerPoly']) {
				var doneString = '';
				var todoString = 'Option ' + selectedOption + '\n';
				for (var j = 0; j < option.length; j++) {
					if (j < i) {
						doneString += printState(option[j]);
					}
					else {
						todoString += printState(option[j]);
					}
				}
				GameObject.Find('LogText').guiText.text = todoString;
				GameObject.Find('DoneText').guiText.text = doneString;

				//now we need to do the ith task. check if it is an AI task or not
				if (option[i]['action'].StartsWith('ai') || option[i]['action'] == 'solve') {
					aiScript.execute(option[i]);
				}
				else {
					aiScript.execute(null);
				}
			}
		}
	}

}

function clearNetwork() {
	isGraphGenerated = false;
	GameObject.Find('LogText').guiText.text = '';
	states = [];
	clearOptions();
}

function generateNetwork(smartObject: Hashtable) {
	isGraphGenerated = false;
	numOptions = 0;
	options = new Array();
	var aiShapeScript = GameObject.Find('AI').GetComponent(ShapeScript);
	var playerShapeScript = GameObject.Find('Player').GetComponent(ShapeScript);
	if (aiShapeScript.polySize < 3) {
		Debug.Log("AI does not exist!");
		return;
	}
	currentState = new Hashtable();
	currentState['aiPoly'] = aiShapeScript.polySize;
	currentState['playerPoly'] = playerShapeScript.polySize;

	computeFountainCounts();

	//each state contains the following info: name, ai poly, player poly, color, rotation, adjacency list[n], how to reach a state[n]
	var state = new Hashtable();
	state['name'] = smartObject['name'];
	state['playerPoly'] = smartObject['requiredPlayerPolySize'];
	state['aiPoly'] = smartObject['requiredAIPolySize'];
	state['color'] = smartObject['requiredColor'];
	state['rotation'] = smartObject['requiredRotation'];
	state['parent'] = -1;
	state['action'] = smartObject['action'] || 'exit';
	state['level'] = 0;
	states.Push(state);
	_generateNetwork(states);
}

function _generateNetwork(states: Array) {
	//generate further levels so that the 0th element is the end state
	//this is based on knowledge gained by the AI

	var maxDepth: int = 5;

	//go thru all the levels
	for (var level = 0; level < maxDepth; level++) {
		//check which all states match this level
		for (var i = 0; i < states.length; i++) {
			if (states[i]['level'] == level) {
				var state = states[i];
				var reqPlayerPolySize = state['playerPoly'];
				var reqAiPolySize = state['aiPoly'];
				
				if (MERGE > 0) {
					if (reqPlayerPolySize != 3) {
						var newState = new Hashtable();
						newState['name'] = 'none';
						newState['aiPoly'] = reqAiPolySize + 1;
						newState['playerPoly'] = reqPlayerPolySize - 1;
						newState['color'] = state['color'];
						newState['rotation'] = state['rotation'];
						newState['parent'] = i;
						newState['action'] = 'merge';
						newState['level'] = level + 1;
						states.Push(newState);
						checkCurrentState(newState);
					}
				}

				if (SPLIT > 0) {
					if (reqAiPolySize != 2) {
						newState = new Hashtable();
						newState['name'] = 'none';
						newState['aiPoly'] = reqAiPolySize - 1;
						newState['playerPoly'] = reqPlayerPolySize + 1;
						newState['color'] = state['color'];
						newState['rotation'] = state['rotation'];
						newState['parent'] = i;
						newState['action'] = 'split';
						newState['level'] = level + 1;
						states.Push(newState);
						checkCurrentState(newState);
					}
				}

				if (FOUNTAIN_OF_LIFE > 0) {
					if (reqAiPolySize > 3) {
						newState = new Hashtable();
						newState['name'] = 'none';
						newState['aiPoly'] = reqAiPolySize - 1;
						newState['playerPoly'] = reqPlayerPolySize;
						newState['color'] = state['color'];
						newState['rotation'] = state['rotation'];
						newState['parent'] = i;
						newState['action'] = 'aifountain';
						newState['level'] = level + 1;
						states.Push(newState);
						//FOUNTAIN_OF_LIFE_COUNT --;
						//FOUNTAIN_OF_DEATH_COUNT ++;
						checkCurrentState(newState);
					}
					if (reqPlayerPolySize > 3) {
						newState = new Hashtable();
						newState['name'] = 'none';
						if (reqAiPolySize >= 3) {
							newState['aiPoly'] = reqAiPolySize;
							newState['playerPoly'] = reqPlayerPolySize - 1;
							newState['color'] = state['color'];
							newState['rotation'] = state['rotation'];
							newState['parent'] = i;
							newState['action'] = 'playerfountain';
							newState['level'] = level + 1;
							states.Push(newState);
							//FOUNTAIN_OF_LIFE_COUNT --;
							//FOUNTAIN_OF_DEATH_COUNT ++;
							checkCurrentState(newState);
						}

						if(reqAiPolySize == 3) {
							newState = new Hashtable();
							newState['aiPoly'] = 2;
							newState['playerPoly'] = reqPlayerPolySize;
							newState['name'] = 'none';
							newState['color'] = state['color'];
							newState['rotation'] = state['rotation'];
							newState['parent'] = i;
							newState['action'] = 'playerfountain';
							newState['level'] = level + 1;
							states.Push(newState);
							//FOUNTAIN_OF_LIFE_COUNT --;
							//FOUNTAIN_OF_DEATH_COUNT ++;
							checkCurrentState(newState);
						}
						
					}
				}

				if (FOUNTAIN_OF_DEATH > 0) {
					if (true) {
						newState = new Hashtable();
						newState['name'] = 'none';
						newState['aiPoly'] = reqAiPolySize + 1;
						newState['playerPoly'] = reqPlayerPolySize;
						newState['color'] = state['color'];
						newState['rotation'] = state['rotation'];
						newState['parent'] = i;
						newState['action'] = 'aideath';
						newState['level'] = level + 1;
						states.Push(newState);
						//FOUNTAIN_OF_DEATH_COUNT --;
						//FOUNTAIN_OF_LIFE_COUNT ++;
						checkCurrentState(newState);
					}
					if (true) {
						newState = new Hashtable();
						newState['name'] = 'none';
						if (reqAiPolySize >= 2) {
							newState['aiPoly'] = reqAiPolySize + 1;
							newState['playerPoly'] = reqPlayerPolySize;
							newState['color'] = state['color'];
							newState['rotation'] = state['rotation'];
							newState['parent'] = i;
							newState['action'] = 'playerdeath';
							newState['level'] = level + 1;
							states.Push(newState);
							//FOUNTAIN_OF_LIFE_COUNT --;
							//FOUNTAIN_OF_DEATH_COUNT ++;
							checkCurrentState(newState);
						}

						if(reqAiPolySize == 2) {
							newState = new Hashtable();
							newState['aiPoly'] = 2;
							newState['playerPoly'] = reqPlayerPolySize + 1;
							newState['color'] = state['color'];
							newState['rotation'] = state['rotation'];
							newState['parent'] = i;
							newState['action'] = 'playerdeath';
							newState['level'] = level + 1;
							states.Push(newState);
							//FOUNTAIN_OF_LIFE_COUNT --;
							//FOUNTAIN_OF_DEATH_COUNT ++;
							checkCurrentState(newState);
						}
					}
				}
			}
		}
	}
	displayOptions();
	//executeOption(0);
	//printTheActualGraph();
}

function checkCurrentState(newState: Hashtable) {
	if (numOptions < MAX_OPTIONS && newState['aiPoly'] == currentState['aiPoly'] && newState['playerPoly'] == currentState['playerPoly']) {
		var option = savePath(newState);
		if (isValidOption(option)) {
			options.Push(option);
			numOptions ++;
		}
	}
}

function isValidOption(option) {
	//check if progression of states is possible according to world count of fountains
	var currFOL = FOUNTAIN_OF_LIFE_COUNT;
	var currFOD = FOUNTAIN_OF_DEATH_COUNT;
	for (var i = 0; i < option.length; i++) {
		state = option[i];
		if (state['action'].Contains('fountain')) {
			if (currFOL < 1) {
				return false;
			}
			currFOL --;
			currFOD ++;
		}
		else if (state['action'].Contains('death')) {
			if (currFOD < 1) {
				return false;
			}
			currFOD --;
			currFOL ++;
		}
	}

	//prune consecutive actions that undo each other
	for (i = 0; i < option.length - 1; i ++) {
		var action1 = option[i]['action'];
		var action2 = option[i+1]['action'];
		if (action1 == 'merge' && action2 == 'split' ||
			action1 == 'split' && action2 == 'merge' ||
			action1 == 'aideath' && action2 == 'aifountain' ||
			action1 == 'aifountain' && action2 == 'aideath') {
			return false;
		}
	}


	return true;
}

function printTheActualGraph() {
	Debug.Log('States:');
	for (var i = 0; i < states.length; i++) {
		Debug.Log('State with index: ' + i + ' has ai size ' + states[i]['aiPoly'] + ', player size ' + states[i]['playerPoly'] +
			', level ' + states[i]['level']+ ', parent index ' + states[i]['parent'] + ', action ' + states[i]['action']);
	}
}

function savePath(state: Hashtable) {
	var option = new Array();
	while (state['parent'] != -1) {
		// Debug.Log('State has ai size ' + state['aiPoly'] + ', player size ' + state['playerPoly'] +
		// 	', level ' + state['level']+ ', parent index ' + state['parent'] + ', action ' + state['action']);
		option.Push(state);
		state = states[state['parent']];
	}
	//print the exit condition
	state = states[0];
	option.Push(state);
	// Debug.Log('State has ai size ' + state['aiPoly'] + ', player size ' + state['playerPoly'] +
	// 	', level ' + state['level']+ ', parent index ' + state['parent'] + ', action ' + state['action']);
	// Debug.Log("----------------------------------");
	return option;
}

function computeFountainCounts() {
	FOUNTAIN_OF_LIFE_COUNT = 0;
	FOUNTAIN_OF_DEATH_COUNT = 0;
	var fountains = GameObject.FindGameObjectsWithTag('Fountain');
	for (var fountain in fountains) {
		//count the fols only if the ai has been taught about fols
		if (fountain.GetComponent(FountainScript).state) {
			if (FOUNTAIN_OF_LIFE > 0) {
 				FOUNTAIN_OF_LIFE_COUNT ++;
 			}
		}
		else if (FOUNTAIN_OF_DEATH > 0) {
			FOUNTAIN_OF_DEATH_COUNT ++;
		}
	}
}

function displayOptions() {
	var optionText = '';
	if (numOptions == 0) {
		//then the ai was not able to find a path at all!
		optionText = 'No options available. You are a bad bad teacher.';
	}
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		optionText += (i + 1) + '. ';
		for (state in option) {
			//Debug.Log(state['action']);
			optionText += '\n' + state['action'];
		}
		optionText += '\n------------\n';
	}
	GameObject.Find('LogText').guiText.text = optionText;
	isGraphGenerated = true;
}

function selectOption(optionIdx: int) {
	selectedOption = optionIdx;
	var option = options[optionIdx];
	isGraphGenerated = false;
	var optionText = '';
	optionText += 'Option ' + optionIdx + '\n';
	for (state in option) {
		//Debug.Log(state['action']);
		optionText += printState(state);
	}
	GameObject.Find('LogText').guiText.material.color = Color(0.8, 0.2, 0.2);
	GameObject.Find('LogText').guiText.text = optionText;
	GameObject.Find('DoneText').guiText.material.color = Color(0.2, 0.8, 0.2);
	GameObject.Find('DoneText').guiText.text = '';
}

function printState(state: Hashtable) {
	return '\n' + state['action'];// + ', ' + state['aiPoly'] + ', ' + state['playerPoly'];
}

function clearOptions() {
		selectedOption = -1;
		GameObject.Find('LogText').guiText.material.color = Color.white;
		GameObject.Find('LogText').guiText.text = '';
		GameObject.Find('DoneText').guiText.text = '';

}

function doFlashText(text) {
	flashes = 200;
	flashText.guiText.text = text;
}

function resetLearning() {
	SPLIT = 0;
	MERGE = 0;
	FOUNTAIN_OF_LIFE = 0;
	FOUNTAIN_OF_DEATH = 0;
}