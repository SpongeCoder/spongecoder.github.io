(function(){
	const CAMERA_POSITION = 250;
  const PLANET_PARAMS = [
    {
      name: 'sun',
      radius: 50,
      wSeg: 80, hSeg: 80,
      textureUrl: 'img/texture_sun.jpg',
      rotation: {y: 0.004, x: 0}
    },
    {
      name: 'mercury',
      radius: 3,
      wSeg: 80, hSeg: 80,
      textureUrl: 'img/mercurymap.jpg',
      orbitRadius: 65,
      speed: 0.25,
      rotation: {y: 0.01, x: 0}
    },
    {
      name: 'venus',
      radius: 5,
      wSeg: 80, hSeg: 80,
      textureUrl: 'img/venusmap.jpg',
      orbitRadius: 80,
      speed: 0.2,
      rotation: {y: 0.02, x: 0}
    },
    {
      name: 'earth',
      radius: 6,
      wSeg: 80, hSeg: 80,
      textureUrl: 'img/earthmap1k.jpg',
      orbitRadius: 120,
      speed: 0.3,
      rotation: {y: 0.015, x: 0}
    },
    {
      name: 'mars',
      radius: 4,
      wSeg: 80, hSeg: 80,
      textureUrl: 'img/mars_1k_color.jpg',
      orbitRadius: 140,
      speed: 0.2,
      rotation: {y: 0.01, x: 0}
    },
    {
      name: 'jupiter',
      radius: 20,
      wSeg: 80, hSeg: 80,
      textureUrl: 'img/jupitermap.jpg',
      orbitRadius: 200,
      speed: 0.15,
      rotation: {y: 0.01, x: 0}
    },
    {
      name: 'saturn',
      radius: 15,
      wSeg: 80, hSeg: 80,
      textureUrl: 'img/saturnmap.jpg',
      orbitRadius: 280,
      speed: 0.12,
      rotation: {y: 0.012, x: 0}
    },
    {
      name: 'uranus',
      radius: 10,
      wSeg: 80, hSeg: 80,
      textureUrl: 'img/uranusmap.jpg',
      orbitRadius: 340,
      speed: 0.05,
      rotation: {y: 0.01, x: 0}
    },
    {
      name: 'neptune',
      radius: 8,
      wSeg: 80, hSeg: 80,
      textureUrl: 'img/neptunemap.jpg',
      orbitRadius: 370,
      speed: 0.02,
      rotation: {y: 0.01, x: 0}
    },
  ]

  class Planet
  {
    constructor({
      radius, wSeg, hSeg, textureUrl,
      orbitRadius, speed, rotation, scene
    })
    {
      const loader = new THREE.TextureLoader();
      let geometry, material, texture;

      this.scene = scene;
      this.orbitRadius = orbitRadius;
      this.speed = speed;
      this.rotation = rotation;

      texture = loader.load(textureUrl);
      texture.anisotropy = 100;

      geometry = new THREE.SphereGeometry(radius, wSeg, hSeg);
      material = new THREE.MeshPhongMaterial({ map: texture });
      this.planet = new THREE.Mesh(geometry, material);

      this.planet.castShadow = true;
      // planet.receiveShadow = true;

      if (orbitRadius) {
        this.drawOrbit();
      }

      this.scene.add(this.planet)

      return this;
    }

    getMesh = () =>
    {
      return this.planet;
    }

    setMesh = (newMesh) => {
      this.planet = newMesh;
    }

    drawOrbit = () =>
    {
      const geometry = new THREE.Geometry();
      const material = new THREE.PointsMaterial({
        color: 0xbbbbbb,
        size: 1,
        sizeAttenuation: false
      });

      for (let i = 0; i < 500; i++)
      {
        let vertex = new THREE.Vector3();

        vertex.x = Math.sin(Math.PI / 180 * i) * this.orbitRadius;
        vertex.z = Math.cos(Math.PI / 180 * i) * this.orbitRadius;

        geometry.vertices.push(vertex);
      }

      const orbita = new THREE.Points(geometry, material);
      this.scene.add(orbita);
    };

    update = (t) => {
      this.planet.rotation.x += this.rotation.x;
      this.planet.rotation.y += this.rotation.y;

      if (this.speed) {
        this.planet.position.x = Math.sin(t * this.speed) * this.orbitRadius;
        this.planet.position.z = Math.cos(t * this.speed) * this.orbitRadius;
      }
    }
  }

  class PlanetManager
  {
    constructor(scene)
    {
      this.scene = scene;
      this.planets = {};

      PLANET_PARAMS.forEach(planet => {
        this.addPlanet(planet)
      });
    }

    addPlanet = ({name, radius, wSeg, hSeg, textureUrl, orbitRadius, speed, rotation}) => {
      this.planets[name] = new Planet({radius, wSeg, hSeg, textureUrl, orbitRadius, speed, rotation, scene: this.scene})
    }

    getPlanet = (name) => {
      return this.planets[name].getMesh()
    }

    setPlanetMesh = (name, newMesh) => {
      this.planets[name].setMesh(newMesh);
    }

    update = (t) => {
      let planets = this.planets;
      for(let key in planets) {
        planets[key].update(t);
      }
    }

    // Свечение от солнца
    addedSunLight = (name = 'sun') => {
      const sun = this.getPlanet(name);
      const light = new THREE.PointLight(0xfcd440, 2, 8000);

      sun.material.emissive.set(0xCAAA33);
      sun.material.emissiveMap = sun.material.map;

      light.castShadow = true;
      light.shadowCameraNear = 1;
      light.shadowCameraFar = 30;
      light.shadowCameraVisible = true;
      light.shadowMapWidth = 2048;
      light.shadowMapHeight = 1024;
      light.shadowBias = 0.01;
      light.shadowDarkness = 0.5;

      sun.add(light);
    }
  }

	var Game = function() {
		let pause		= false,
			sceneSize = {w: window.innerWidth, h: window.innerHeight},
			scene 		= new THREE.Scene(),
			camera 		= new THREE.PerspectiveCamera( 75, sceneSize.w / sceneSize.h, 1, 10000 ),
			renderer 	= new THREE.WebGLRenderer({antialias: true}),
			controls;

		const init = function()
		{
			controls = new THREE.OrbitControls(camera);
			controls.damping = 0.1;
			controls.addEventListener('change', render);

			renderer.setSize(sceneSize.w, sceneSize.h);

			// renderer.shadowMap.enabled = true;
			// renderer.shadowMap.type = THREE.BasicShadowMap;

			document.body.appendChild(renderer.domElement);

			document.addEventListener('keyup', function(event)
      {
				if (event.keyCode == 32) // spacebar
				{
					if (pause) pause = false;
					else pause = true;
				}
			});
		}

    const planetManager = new PlanetManager(scene);
    planetManager.addedSunLight();

    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      'img/space.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(1000);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      }
    );

		const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

		camera.position.z = CAMERA_POSITION;
		camera.position.y = CAMERA_POSITION / 2;

		let t = 0;
		const update = () =>
    {
			if (!pause)
			{
        planetManager.update(t);

				// camera.lookAt(scene.position);

				t += Math.PI / 180 * 2;
			}
		}

		const loop = () =>
    {
			update();
			render();

			requestAnimationFrame(loop);
		}

		const render = () =>
    {
			renderer.render( scene, camera );
		}

		init();
		loop();
	}

	window.onload = function() {
		new Game();
	}

})();
