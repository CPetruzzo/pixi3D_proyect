/// <reference path='../global.d.ts' />

import { Application, Assets, Color, Renderer, Resource, Sprite, Texture } from "pixi.js"
import { CameraOrbitControl, LightingEnvironment, ImageBasedLighting, Model, Mesh3D, Light, LightType, ShadowCastingLight, ShadowQuality, Sprite3D, SpriteBillboardType, Vec3, Camera, Point3D, Fog } from "pixi3d/pixi7"
import { Keyboard } from "./Keyboard";

let app = new Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view as HTMLCanvasElement)
Keyboard.initialize(); /* lo llamo una vez y nunca mas */

export class Pocho extends Sprite3D {
  speedX: number;
  speedY: number;
  speedZ: number;
  constructor(texture: Texture<Resource> | undefined, areaSize: number, scale?: Point3D) {
    super(texture);

    this.pixelsPerUnit = areaSize;
    this.position.set(
      -this.pixelsPerUnit / 2 + Math.random() * this.pixelsPerUnit,
      0,
      -this.pixelsPerUnit / 2 + Math.random() * this.pixelsPerUnit
    );

    this.speedX = -0.01 + Math.random() * 0.02;
    this.speedY = Math.random() * 6;
    this.speedZ = -0.01 + Math.random() * 0.02;

    // The billboard type is set so the sprite always face the camera.
    this.billboardType = SpriteBillboardType.spherical;

    if (scale) {
      this.scale = scale;
    }
  }

  distanceFromCamera() {
    return Vec3.distance(
      this.worldTransform.position,
      Camera.main.worldTransform.position
    );
  }

  update() {
    this.position.x += this.speedX;
    this.position.y = Math.cos((this.speedY += 0.4)) * 0.05;
    this.position.z += this.speedZ;

    if (this.position.x > this.pixelsPerUnit / 2) {
      this.speedX *= -1;
      this.position.x = this.pixelsPerUnit / 2;
    } else if (this.position.x < -this.pixelsPerUnit / 2) {
      this.speedX *= -1;
      this.position.x = -this.pixelsPerUnit / 2;
    }
    if (this.position.z > this.pixelsPerUnit / 2) {
      this.speedZ *= -1;
      this.position.z = this.pixelsPerUnit / 2;
    } else if (this.position.z < -this.pixelsPerUnit / 2) {
      this.speedZ *= -1;
      this.position.z = -this.pixelsPerUnit / 2;
    }
  }
}

const manifest = {
  bundles: [{
    name: "assets",
    assets: [
      {
        name: "diffuse",
        srcs: "assets/chromatic/diffuse.cubemap",
      },
      {
        name: "specular",
        srcs: "assets/chromatic/specular.cubemap",
      },
      {
        name: "teapot",
        srcs: "assets/teapot/teapot.gltf",
      },
      {
        name: "loli",
        srcs: "assets/cheers1.png",
      },
      {
        name: "pocho",
        srcs: "assets/cheers2.png",
      },
      {
        name: "impala",
        srcs: "assets/impala/impala.gltf",
      },
      {
        name: "road",
        srcs: "assets/road/road.gltf",
      },
    ],
  }]
}

await Assets.init({ manifest })
let assets = await Assets.loadBundle("assets")

let model = app.stage.addChild(Model.from(assets.impala))
model.y = +1
model.scale.set(30,30,30)

let road = app.stage.addChild(Model.from(assets.road))
// road.y = +0.5
// road.scale.set(1,1,10)


const pocho: Pocho[] = [];
// for (let i = 0; i < 500; i++) {
//   pocho.push(app.stage.addChild(new Pocho(Texture.from(manifest.bundles[0].assets[3].srcs), 150, new Point3D(1,1,1))));
// }
for (let i = 0; i < 100; i++) {
  pocho.push(app.stage.addChild(new Pocho(Texture.from(manifest.bundles[0].assets[4].srcs), 50)));
}

// So the sprites can be sorted using z-index.
app.stage.sortableChildren = true;

let ground = app.stage.addChild(Mesh3D.createPlane())
ground.y = -0.8
ground.scale.set(100, 1, 100)

LightingEnvironment.main.imageBasedLighting = new ImageBasedLighting(
  assets.diffuse,
  assets.specular
)

let directionalLight = new Light()
directionalLight.intensity = 1
directionalLight.type = LightType.directional
directionalLight.rotationQuaternion.setEulerAngles(25, 120, 0)
LightingEnvironment.main.lights.push(directionalLight)

let shadowCastingLight = new ShadowCastingLight(
  app.renderer as Renderer, directionalLight, { shadowTextureSize: 1024, quality: ShadowQuality.medium })
shadowCastingLight.softness = 1
shadowCastingLight.shadowArea = 15

let pipeline = app.renderer.plugins.pipeline
pipeline.enableShadows(ground, shadowCastingLight)
pipeline.enableShadows(model, shadowCastingLight)

// Configura velocidades para el movimiento de la cámara
const cameraMoveSpeed = 0.1;
const cameraRotationSpeed = 0.01;

// Crea una instancia del CameraOrbitControl y pásale la cámara y el canvas
const cameraControl = new CameraOrbitControl(app.view as HTMLCanvasElement);
let vignette = app.stage.addChild(
  Sprite.from(
    "https://raw.githubusercontent.com/jnsmalm/pixi3d-sandbox/master/assets/vignette.png"
  )
);

// const color = new Color();
// const niebla = new Fog(undefined, undefined, undefined);
// app.stage.addChild(niebla)

app.ticker.add(() => {
  Object.assign(vignette, {
    width: app.renderer.width, height: app.renderer.height
  });
  for (let eachpocho of pocho) {
    eachpocho.update();

    // This will render the bunnies from back to front.
    eachpocho.zIndex = -eachpocho.distanceFromCamera();
  }
  // // cameraControl.updateCamera();
  //   // Calcula el vector de dirección de la cámara
  //   const cameraDirection = Vec3.set(0, 0, -1);
  //   cameraDirection.applyEuler(cameraControl.angles.x, cameraControl.angles.y, 0);

  //   // Normaliza el vector para asegurarte de que tiene longitud 1
  //   cameraDirection.normalize();

  if (Keyboard.state.get("KeyW")) {
    cameraControl.target.z -= cameraMoveSpeed; // Mueve el objetivo hacia arriba
  }
  if (Keyboard.state.get("KeyA")) {
    cameraControl.target.x -= cameraMoveSpeed; // Mueve el objetivo hacia la izquierda
  }
  if (Keyboard.state.get("KeyS")) {
    cameraControl.target.z += cameraMoveSpeed; // Mueve el objetivo hacia abajo
  }
  if (Keyboard.state.get("KeyD")) {
    cameraControl.target.x += cameraMoveSpeed; // Mueve el objetivo hacia la derecha
  }
  if (Keyboard.state.get("Space")) {
    cameraControl.target.y += cameraMoveSpeed; // Mueve el objetivo hacia la derecha
  }
  if (Keyboard.state.get("Enter")) {
    cameraControl.target.y -= cameraMoveSpeed; // Mueve el objetivo hacia la derecha
  }

  if (Keyboard.state.get("ArrowUp")){
    model.z += 1
  }
  if (Keyboard.state.get("ArrowDown")){
    model.z -= 1
  }

});