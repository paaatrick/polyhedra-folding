angular.module('polyhedraApp', [])
  .controller('PolyController', ['$http', function ($http) {

    var scene, camera, renderer, controls, root, parent, materials;

    this.amount = 0;
    this.materialOptions = ["Wireframe", "Solid", "Face Shape", "Lit", "Face Normals"];
    this.material = this.materialOptions[0];
    this.menuOpen = true;
    this.buttonText = '\xD7';

    this.show = function (number) {
      this.displayed = number;
      if (typeof root !== 'undefined') {
        scene.remove(root);
      }
      load(number);
    };

    this.draw = function () {
      update_materials();
      update_matrices();
      render();
    };

    this.toggleMenu = function () {
      this.menuOpen = !this.menuOpen;
      this.buttonText = this.menuOpen ? '\xD7' : '\u21D2';
    };

    var that = this;
    $http.get("/polyhedra.json")
      .success(function (data) {
        that.families = data.families;
        that.family = that.families[0];
        that.show(that.family.polyhedra[0].number);
      });


    materials = {
      "line": new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 2
      }),
      "flat": new THREE.MeshBasicMaterial({
        color: 0x009999,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 0.1
      }),
      "shape": new THREE.MeshBasicMaterial({
        color: 0xffffff,
        vertexColors: THREE.FaceColors,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 0.1
      }),
      "lit": new THREE.MeshPhongMaterial({
        ambient: 0x333333,
        color: 0x666666,
        specular: 0xFFFFFF,
        side: THREE.DoubleSide,
        shininess: 70,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 0.1
      }),
      "normals": new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 0.1
      })
    };

    var init = function () {
      var ambientLight, light1, light2, light3;

      parent = document.getElementById('scene');
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, parent.clientWidth / parent.clientHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(parent.clientWidth, parent.clientHeight);
      parent.appendChild(renderer.domElement);

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
    };

    var update_materials = function () {
      root.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.visible = true;
          switch (that.material) {
          case "Wireframe":
            child.visible = false;
            break;
          case "Solid":
            child.material = materials.flat;
            break;
          case "Face Shape":
            child.material = materials.shape;
            break;
          case "Lit":
            child.material = materials.lit;
            break;
          case "Face Normals":
            child.material = materials.normals;
            break;
          }
        } else if (child instanceof THREE.Line) {
          child.material = materials.line;
        }
      });
    };

    var update_matrices = function () {
      var t1, r, t2, m, u, c;
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
          r.makeRotationAxis(u.axis, that.amount / 100 * (Math.PI - u.amount));
          t2.makeTranslation(u.offset.x, u.offset.y, u.offset.z);
          m.multiplyMatrices(t2, r).multiply(t1);
          obj.matrix = m;
          obj.matrixAutoUpdate = false;
          obj.matrixWorldNeedsUpdate = true;
        }
      });
      c = new THREE.Box3().setFromObject(root).center();
      root.matrix.multiply(new THREE.Matrix4().makeTranslation(-c.x, -c.y, -c.z));
      root.matrixAutoUpdate = false;
      root.matrixWorldNeedsUpdate = true;
    };

    var load = function (which) {
      var loader = new THREE.PolyLoader();
      loader.load("poly/" + which, function (obj) {
        scene.add(obj);
        root = obj;
        render(); // bake in lighting info

        update_materials();
        update_matrices();

        render();
      });
    };

    var render = function () {
      renderer.render(scene, camera);
    };

    var onWindowResize = function () {
      camera.aspect = parent.clientWidth / parent.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(parent.clientWidth, parent.clientHeight);

      controls.handleResize();

      render();
    };

    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
    };

    init();
    animate();

  }]);
