var renderer, scene, camera, root, controls;
var ctrls = {
  type: 0,
  fold: 0,
  material: "Wireframe"
};
var materials = {
  "line": new THREE.LineBasicMaterial({color: 0xFFFFFF, linewidth: 2}),
  "flat": new THREE.MeshBasicMaterial({color: 0x009999, side: THREE.DoubleSide}),
  "lit": new THREE.MeshPhongMaterial({ambient: 0x333333, color: 0x666666, specular: 0xFFFFFF, side: THREE.DoubleSide, shininess: 70}),
  "normals": new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
};
var polyhedra = {
  "Platonic": {
    "Tetrahedron": 0,
    "Cube": 1,
    "Octahedron": 2,
    "Dodecahedron": 3,
    "Icosahedron": 4
  },
  "Kepler–Poinsot": {
    "Small Stellated Dodecahedron": 5,
    "Great Dodecahedron": 6,
    "Great Stellated Dodecahedron": 7,
    "Great Icosahedron": 8
  },
  "Archimedean": {
    "Truncated Tetrahedron": 9,
    "Cuboctahedron": 10,
    "Truncated Cube": 11,
    "Truncated Octahedron": 12,
    "Rhombicuboctahedron": 13,
    "Great Rhombicuboctahedron": 14,
    "Snub Cube (Laevo)": 15,
    "Icosidodecahedron": 16,
    "Truncated Dodecahedron": 17,
    "Truncated Icosahedron": 18,
    "Rhombicosidodecahedron": 19,
    "Great Rhombicosidodecahedron": 20,
    "Snub Dodecahedron (Laevo)": 21
  },
  "Archimedean Duals": {
    "Triakis Tetrahedron": 32,
    "Rhombic Dodecahedron": 33,
    "Triakis Octahedron": 34,
    "Tetrakis Hexahedron": 35,
    "Trapezoidal Icositetrahedron": 36,
    "Hexakis Octahedron": 37,
    "Pentagonal Icositetrahedron (Dextro)": 38,
    "Rhombic Triacontahedron": 39,
    "Triakis Icosahedron": 40,
    "Pentakis Dodecahedron": 41,
    "Trapezoidal Hexecontahedron": 42,
    "Hexakis Icosahedron": 43,
    "Pentagonal Hexecontahedron (Dextro)": 44
  },
  "Prisms & Anti-prisms": {
    "Triangular Prism": 22,
    "Pentagonal Prism": 23,
    "Hexagonal Prism": 24,
    "Octagonal Prism": 25,
    "Decagonal Prism": 26,
    "Square Antiprism": 27,
    "Pentagonal Antiprism": 28,
    "Hexagonal Antiprism": 29,
    "Octagonal Antiprism": 30,
    "Decagonal Antiprism": 31
  },
  "Johnson Solids": {
    "Square Pyramid (J1)": 45,
    "Pentagonal Pyramid (J2)": 46,
    "Triangular Cupola (J3)": 47,
    "Square Cupola (J4)": 48,
    "Pentagonal Cupola (J5)": 49,
    "Pentagonal Rotunda (J6)": 50,
    "Elongated Triangular Pyramid (J7)": 51,
    "Elongated Square Pyramid (J8)": 52,
    "Elongated Pentagonal Pyramid (J9)": 53,
    "Gyroelongated Square Pyramid (J10)": 54,
    "Gyroelongated Pentagonal Pyramid (J11)": 55,
    "Triangular Dipyramid (J12)": 56,
    "Pentagonal Dipyramid (J13)": 57,
    "Elongated Triangular Dipyramid (J14)": 58,
    "Elongated Square Dipyramid (J15)": 59,
    "Elongated Pentagonal Dipyramid (J16)": 60,
    "Gyroelongated Square Dipyramid (J17)": 61,
    "Elongated Triangular Cupola (J18)": 62,
    "Elongated Square Cupola (J19)": 63,
    "Elongated Pentagonal Cupola (J20)": 64,
    "Elongated Pentagonal Rotunds (J21)": 65,
    "Gyroelongated Triangular Cupola (J22)": 66,
    "Gyroelongated Square Cupola (J23)": 67,
    "Gyroelongated Pentagonal Cupola (J24)": 68,
    "Gyroelongated Pentagonal Rotunda (J25)": 69,
    "Gyrobifastigium (J26)": 70,
    "Triangular Orthobicupola (J27)": 71,
    "Square Orthobicupola (J28)": 72,
    "Square Gyrobicupola (J29)": 73,
    "Pentagonal Orthobicupola (J30)": 74,
    "Pentagonal Gyrobicupola (J31)": 75,
    "Pentagonal Orthocupolarontunda (J32)": 76,
    "Pentagonal Gyrocupolarotunda (J33)": 77,
    "Pentagonal Orthobirotunda (J34)": 78,
    "Elongated Triangular Orthobicupola (J35)": 79,
    "Elongated Triangular Gyrobicupola (J36)": 80,
    "Elongated Square Gyrobicupola (J37)": 81,
    "Elongated Pentagonal Orthobicupola (J38)": 82,
    "Elongated Pentagonal Gyrobicupola (J39)": 83,
    "Elongated Pentagonal Orthocupolarotunda (J40)": 84,
    "Elongated Pentagonal Gyrocupolarotunda (J41)": 85,
    "Elongated Pentagonal Orthobirotunda (J42)": 86,
    "Elongated Pentagonal Gyrobirotunda (J43)": 87,
    "Gyroelongated Triangular Bicupola (J44)": 88,
    "Gyroelongated Square Bicupola (J45)": 89,
    "Gyroelongated Pentagonal Bicupola (J46)": 90,
    "Gyroelongated Pentagonal Cupolarotunda (J47)": 91,
    "Gyroelongated Pentagonal Birotunda (J48)": 92,
    "Augmented Triangular Prism (J49)": 93,
    "Biaugmented Triangular Prism (J50)": 94,
    "Triaugmented Triangular Prism (J51)": 95,
    "Augmented Pentagonal Prism (J52)": 96,
    "Biaugmented Pentagonal Prism (J53)": 97,
    "Augmented Hexagonal Prism (J54)": 98,
    "Parabiaugmented Hexagonal Prism (J55)": 99,
    "Metabiaugmented Hexagonal Prism (J56)": 100,
    "Triaugmented Hexagonal Prism (J57)": 101,
    "Augmented Dodecahedron (J58)": 102,
    "Parabiaugmented Dodecahedron (J59)": 103,
    "Metabiaugmented Dodecahedron (J60)": 104,
    "Triaugmented Dodecahedron (J61)": 105,
    "Metabidiminished Icosahedron (J62)": 106,
    "Tridiminished Icosahedron (J63)": 107,
    "Augmented Tridiminished Icosahedron (J64)": 108,
    "Augmented Truncated Tetrahedron (J65)": 109,
    "Augmented Truncated Cube (J66)": 110,
    "Biaugmented Truncated Cube (J67)": 111,
    "Augmented Truncated Dodecahedron (J68)": 112,
    "Parabiaugmented Truncated Dodecahedron (J69)": 113,
    "Metabiaugmented Truncated Dodecahedron (J70)": 114,
    "Triaugmented Truncated Dodecahedron (J71)": 115,
    "Gyrate Rhombicosidodecahedron (J72)": 116,
    "Parabigyrate Rhombicosidodecahedron (J73)": 117,
    "Metabigyrate Rhombicosidodecahedron (J74)": 118,
    "Trigyrate Rhombicosidodecahedron (J75)": 119,
    "Diminished Rhombicosidodecahedron (J76)": 120,
    "Paragyrate Diminished Rhombicosidodecahedron (J77)": 121,
    "Metagyrate Diminished Rhombicosidodecahedron (J78)": 122,
    "Bigyrate Diminished Rhombicosidodecahedron (J79)": 123,
    "Parabidiminished Rhombicosidodecahedron (J80)": 124,
    "Metabidiminished Rhombicosidodecahedron (J81)": 125,
    "Gyrate Bidiminished Rhombicosidodecahedron (J82)": 126,
    "Tridiminished Rhombicosidodecahedron (J83)": 127,
    "Snub Disphenoid (J84)": 128,
    "Snub Square Antiprism (J85)": 129,
    "Sphenocorona (J86)": 130,
    "Augmented Sphenocorona (J87)": 131,
    "Sphenomegacorona (J88)": 132,
    "Hebesphenomegacorona (J89)": 133,
    "Disphenocingulum (J90)": 134,
    "Bilunabirotunda (J91)": 135,
    "Triangular Hebesphenorotunda (J92)": 136
  },
  "Others": {
    "Tetrahemihexahedron": 137,
    "Octahemioctahedron": 138,
    "Small Ditrigonal Icosidodecahedron": 139,
    "Dodecadodecahedron": 140,
    "Echidnahedron": 141
  }
};

function render() {
  renderer.render(scene, camera);
}

function update_materials() {
  root.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.visible = true;
      switch ($("#drawstyle").val()) {
      case "Wireframe":
        child.visible = false;
        break;
      case "Flat":
        child.material = materials.flat;
        break;
      case "Lit":
        child.material = materials.lit;
        break;
      case "Normals":
        child.material = materials.normals;
        break;
      }
    } else if (child instanceof THREE.Line) {
      child.material = materials.line;
    }
  });
}

function update_matrices(amount) {
  var t1, r, t2, m, u;
  if (root === undefined) {
    return;
  }
  root.traverse(function (obj) {
    u = obj.userData;
    if (u.hasOwnProperty("offset")) {
      t1 = new THREE.Matrix4();
      r = new THREE.Matrix4();
      t2 = new THREE.Matrix4();
      m = new THREE.Matrix4();
      t1.makeTranslation(-u.offset.x, -u.offset.y, -u.offset.z);
      r.makeRotationAxis(u.axis, amount / 100 * (Math.PI - u.amount));
      t2.makeTranslation(u.offset.x, u.offset.y, u.offset.z);
      m.multiplyMatrices(t2, r).multiply(t1);
      obj.matrix = m;
      obj.matrixAutoUpdate = false;
      obj.matrixWorldNeedsUpdate = true;
    }
  });
  render();
}

function load(which) {
  var loader = new THREE.PolyLoader();
  loader.load("poly/" + which, function (obj) {
    scene.add(obj);
    root = obj;
    render(); // bake in lighting info

    update_materials();
    update_matrices($("#foldamount").slider("value"));

    render();
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
  render();
}

function populate_polytypes(family, parent) {
  var list, item, poly;
  parent.empty();
  list = $("<ul>").appendTo(parent);
  for (poly in polyhedra[family]) {
    if (polyhedra[family].hasOwnProperty(poly)) {
      item = $("<li>").appendTo(list);
      $("<a>")
        .attr("href", "#")
        .text(poly)
        .click(function () {
          $("li").css("list-style", "none");
          $(this).parent().css("list-style", "disc");
          scene.remove(root);
          load(polyhedra[$("#polyfam").val()][this.text]);
        })
        .appendTo(item);
    }
  }
}

function init() {
  var ambientLight, light1, light2, light3;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  ambientLight = new THREE.AmbientLight(0x4f3066);
  light1 = new THREE.DirectionalLight(0xBEC6FF);
  light1.position.set(1, -1, 1);
  light2 = new THREE.DirectionalLight(0xFFFFFF);
  light2.position.set(1, 1, 1);
  light3 = new THREE.DirectionalLight(0xFFE6BE);
  light3.position.set(-1, 1, 1);

  scene.add(ambientLight);
  scene.add(light1);
  scene.add(light2);
  scene.add(light3);

  camera.position = new THREE.Vector3(0, 5, 5);
  camera.up = new THREE.Vector3(0, 0, 1);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  window.addEventListener('resize', onWindowResize, false);

  load(0);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function build_ui() {
  var family;
  for (family in polyhedra) {
    if (polyhedra.hasOwnProperty(family)) {
      $("<option>").text(family).appendTo($("#polyfam"));
    }
  }
  $("#polyfam").change(function () {
    populate_polytypes(this.value, $("#polytype"));
  });
  populate_polytypes($("#polyfam").val(), $("#polytype"));
  $("li:first").css("list-style", "disc");
  $("#foldamount").slider({
    range: "min",
    value: 0,
    min: 0,
    max: 100,
    slide: function (event, element) {
      update_matrices(element.value);
    }
  });
  $("#drawstyle").change(function () {
    update_materials();
    render();
  });
}

build_ui();
init();
animate();
