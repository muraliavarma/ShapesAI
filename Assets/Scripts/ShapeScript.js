#pragma strict

var polySize: int;
var sideLength: int;
var center: Vector3;
var mesh: Mesh;
var meshRenderer: MeshRenderer;
var isAI = false;
var textMeshPrefab: TextMesh;
var aiText : TextMesh;

function Start () {
	gameObject.AddComponent("MeshFilter");
	gameObject.AddComponent("MeshRenderer");
	mesh = GetComponent(MeshFilter).mesh;
	meshRenderer = GetComponent(MeshRenderer);
	meshRenderer.material.shader = Shader.Find ("VertexLit");
	meshRenderer.material.color = Color(0.4, 0.4, 0.4, 1);
	createPoly(polySize);

	if (isAI) {
		//add a text indicating it is an AI shape
		aiText = Instantiate(textMeshPrefab, Vector3.zero, Quaternion.identity);
		aiText.text = "AI";
		aiText.transform.parent = transform;
		aiText.transform.localPosition = Vector3(-0.5, 2, 0);
		aiText.fontSize = 10;
	}
}

function Update () {
	if (isAI) {
		if (polySize > 2) {
			aiText.text = 'AI';
		}
		else {
			aiText.text = '';
		}
	}
}

function createPoly(polySizeLocal: int) {
	
	mesh.Clear();
	if(polySize < 3) {
		polySize = 2;
		return;
	}
	polySize = polySizeLocal;
	var vertices = new Vector3[polySize + 1];
	var triangles = new int[3 * polySize];
	var angle = Mathf.PI * 2 / polySize;
	vertices[0] = center;
	
	for (var i = 0; i < polySize; i++) {
		vertices[i + 1] = center + (Vector3(Mathf.Cos((i + 1) * angle * sideLength), Mathf.Sin((i + 1) * angle * sideLength), 0));
		triangles[3 * i] = 0;
		triangles[3 * i + 1] = (i + 2) % polySize + 1;
		triangles[3 * i + 2] = (i + 1) % polySize + 1;
	}
	
	var uvs : Vector2[] = new Vector2[vertices.Length];
	for (i = 0 ; i < uvs.Length; i++) {
		uvs[i] = Vector2 (vertices[i].x, vertices[i].z);
	}
	
	mesh.vertices = vertices;
	mesh.uv = uvs;
	mesh.triangles = triangles;
}
