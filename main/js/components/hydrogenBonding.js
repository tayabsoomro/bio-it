var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);


var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4.FromHexString("#99ddffFF");

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", (Math.PI / 2), (Math.PI / 4) , 20, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);



    // Function creates a water molecule
    var createWaterMolecule = function(x,y,z){

      var retWaterMolecule = {};

      // Hydrogen colors
      var material = new BABYLON.StandardMaterial(scene);
      material.alpha = 1;
      material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);


      var waterMolecule = {
        h: BABYLON.MeshBuilder.CreateSphere("h", {}, scene),
        o1: BABYLON.MeshBuilder.CreateSphere("o1", {}, scene),
        o2: BABYLON.MeshBuilder.CreateSphere("o2",{}, scene)
      };
      waterMolecule.h.material = material;

      // Hydrogen
      waterMolecule.h.position.x = x;
      waterMolecule.h.position.y = y;
      waterMolecule.h.position.z = z;


      scene.actionManager = new BABYLON.ActionManager(scene);
      scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
         if (evt.sourceEvent.key == "r") {
             console.log("SUP")
         }
      }));

      // First oxygen
      waterMolecule.o1.position.x = x+2;
      waterMolecule.o1.position.y = y+0;
      waterMolecule.o1.position.z = z+2;

      // Second oxygen
      waterMolecule.o2.position.x = x+2;
      waterMolecule.o2.position.y = y+0;
      waterMolecule.o2.position.z = z-2;

      var firstBond = [
          new BABYLON.Vector3(x+0, y+0, z+0),
          new BABYLON.Vector3(x+1, y+0, z-1),
          new BABYLON.Vector3(x+2, y+0, z-2)
      ];
      var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: firstBond}, scene);

      var secondBond = [
          new BABYLON.Vector3(x+0, y+0, z+0),
          new BABYLON.Vector3(x+1, y+0, z+1),
          new BABYLON.Vector3(x+2, y+0, z+2)
      ];
      var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: secondBond}, scene);

      retWaterMolecule.waterMolecule = waterMolecule;
      retWaterMolecule.firstBond = firstBond;
      retWaterMolecule.secondBond = secondBond;
      retWaterMolecule.lines = lines;

      return retWaterMolecule;

    };

    // Function creates chain of water molecules
    var createWater = function(numMolecules,elevation){
      waterMolecules = [];
      counter = -1;
      for(var i = 0; i < numMolecules; i++){
        for(var j = 0; j < numMolecules; j++) {
            counter++;
            waterMolecules.push(createWaterMolecule((i * 4), elevation, (-1 * j * 4)));

            var hydrogenBond1 = [
                new BABYLON.Vector3(
                    waterMolecules[counter].secondBond[0].x,
                    waterMolecules[counter].secondBond[0].y,
                    waterMolecules[counter].secondBond[0].z
                ),
                new BABYLON.Vector3(
                    waterMolecules[counter].secondBond[0].x - 2,
                    waterMolecules[counter].secondBond[0].y,
                    waterMolecules[counter].secondBond[0].z - 2
                )

            ];

            if (i == 1) {

                var dashedlines = BABYLON.Mesh.CreateDashedLines("lines1", hydrogenBond1, 3, 8, 8, scene, true);
                dashedlines = BABYLON.MeshBuilder.CreateDashedLines(null, {
                    points: hydrogenBond1,
                    instance: dashedlines
                });
            }
            var hydrogenBond2 = [
                new BABYLON.Vector3(
                    waterMolecules[counter].firstBond[0].x,
                    waterMolecules[counter].firstBond[0].y,
                    waterMolecules[counter].firstBond[0].z
                ),
                new BABYLON.Vector3(
                    waterMolecules[counter].firstBond[0].x - 2,
                    waterMolecules[counter].firstBond[0].y,
                    waterMolecules[counter].firstBond[0].z + 2
                )
            ];

            if (i == 1) {
                var dashedlines2 = BABYLON.Mesh.CreateDashedLines("lines2", hydrogenBond2, 3, 8, 8, scene, true);
                dashedlines2 = BABYLON.MeshBuilder.CreateDashedLines(null, {
                    points: hydrogenBond2,
                    instance: dashedlines2
                });

            }
        }
      }
    };

    createWater(2,0);
    return scene;

};

var scene = createScene();
scene.registerBeforeRender(myAnimation);

engine.runRenderLoop(function () {
    scene.render();
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});


var radius_step = 1;
var alpha_step = .02;

function myAnimation() {
    var scene = engine.scenes[0];
    var camera = scene.activeCamera;
    camera.radius -= radius_step;
    if (camera.radius < 60) {
        radius_step = 0;
        camera.alpha -= alpha_step;
        if (camera.alpha < 0) {
            scene.unregisterBeforeRender(myAnimation);
        }
    }
}