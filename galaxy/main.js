var scene, camera, renderer;
var materials, planets;
var angle = 0;
var planetNames = ["earth", "jupiter", "mars", "mercury", "neptune", "pluto", "saturn", "sun", "uranus", "venus"]

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 80, window.innerWidth/window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}

function loadPlanetsTextures() {
  materials = [];
  var textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = true;

  planetNames.forEach(planet => {
    textureLoader.load(`./textures/${planet}.jpg`, function(texture) {
        materials.push(new THREE.MeshPhongMaterial( { map: texture,bumpScale: 0.005 } ));  
        if (materials.length == planetNames.length) {
            createPlanets();
            render();
        }
    });
  })
}

function createPlanets() {
  planets = [];
  for (var i = 0; i < planetNames.length; i++) {
    var p = new Planet(planetNames[i], materials[i]);
    planets.push(p)
  }
}

function initLights() {
  var light = new THREE.PointLight( 0xFFFFFF );
  light.position.set( 300, 300, 0 );
  scene.add( light );

  var light = new THREE.PointLight( 0xFFFFFF );
  light.position.set( 0, 300, 300 );
  scene.add( light );
}

function Planet(name, material) {
  this.name = name;
  // init
  var size = 10+Math.random()*10;

  var geometry = new THREE.SphereGeometry(size, 32, 32);
  var planet = new THREE.Mesh( geometry, material );
  
  // rotate cube
  var variance = 0.01;
  this.vr = {
    x: -variance + Math.random()*variance*2,
    y: -variance + Math.random()*variance*2
  }
  var field = 300;
  scene.add( planet );
  planet.position.x = -field+Math.random()*field*2;
  planet.position.y = -field+Math.random()*field*2;
  planet.position.z = -field+Math.random()*field*2;
  
  this.mesh = planet;
}

Planet.prototype.rotate = function() {
  this.mesh.rotation.x += this.vr.x;
  this.mesh.rotation.y += this.vr.y;
}

function render() {
  requestAnimationFrame( render );

  renderer.render(scene, camera);
  for (var i = 0; i < planetNames.length; i++) {
    planets[i].rotate();
  }
  
  updateCamPosition();
}

function updateCamPosition() {
  angle += 0.005;
  var z = 100 * Math.cos(angle);
  var y = 100 * Math.sin(angle);

  camera.position.z = z;
  camera.position.y = y;
  camera.rotation.x = z*0.02;
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


window.addEventListener("resize", resize);

initScene();
initLights();
loadPlanetsTextures();