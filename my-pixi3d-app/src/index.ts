/// <reference path='../global.d.ts' />

import { Application, Assets, Renderer, Resource, Texture } from "pixi.js"
import { CameraOrbitControl, LightingEnvironment, ImageBasedLighting, Model, Mesh3D, Light, LightType, ShadowCastingLight, ShadowQuality, Sprite3D, SpriteBillboardType, Vec3, Camera } from "pixi3d/pixi7"

let app = new Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view as HTMLCanvasElement)

class Pocho extends Sprite3D {
  speedX: number;
  speedY: number;
  speedZ: number;
  constructor(texture: Texture<Resource> | undefined , areaSize: number) {
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
        name: "pocho",
        srcs: "assets/cheers1.png",
      },
    ],
  }]
}

await Assets.init({ manifest })
let assets = await Assets.loadBundle("assets")

let model = app.stage.addChild(Model.from(assets.teapot))
model.y = -0.8

const pocho: Pocho[] = [];
for (let i = 0; i < 500; i++) {
  pocho.push(app.stage.addChild(new Pocho(Texture.from(manifest.bundles[0].assets[3].srcs), 50)));
}
// So the sprites can be sorted using z-index.
app.stage.sortableChildren = true;

app.ticker.add(() => {
  for (let eachpocho of pocho) {
    eachpocho.update();

    // This will render the bunnies from back to front.
    eachpocho.zIndex = -eachpocho.distanceFromCamera();
  }
});

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

let control = new CameraOrbitControl(app.view as HTMLCanvasElement);

