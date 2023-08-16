// import { Model, ShadowCastingLight, Renderer, CameraOrbitControl, Sprite, Application, Assets, Texture } from "pixi.js";
// import { LightingEnvironment, ImageBasedLighting, Light, Point3D, LightType, ShadowQuality } from "pixi3d/pixi7";
// import { Pocho } from "./Pocho";
// import { Keyboard } from "./Keyboard";
// import { manifest } from "./Manifest";

// await Assets.init({ manifest })
// let assets = await Assets.loadBundle("assets")
// export const impalaModel = Model.from(assets.impala);
// export const roadModel = Model.from(assets.road);
// export const hauntedhouseModel = Model.from(assets.hauntedhouse);
// export const firstpersonModel = Model.from(assets.firstperson);

// export async function setupModels(app: Application) {
//     await Assets.init({ manifest })
//     let assets = await Assets.loadBundle("assets")

//     let impala = app.stage.addChild(impalaModel)
//     impala.y = +1
//     impala.scale.set(30, 30, 30)

//     let road = app.stage.addChild(roadModel)
//     // road.y = +0.5
//     // road.scale.set(1,1,10)

//     let hauntedhouse = app.stage.addChild(hauntedhouseModel)
//     hauntedhouse.x = 50

//     let firstperson = app.stage.addChild(firstpersonModel)
//     firstperson.scale.set(0.03, 0.03, 0.03)

//     const pocho: Pocho[] = [];
//     for (let i = 0; i < 500; i++) {
//         pocho.push(app.stage.addChild(new Pocho(Texture.from(manifest.bundles[0].assets[3].srcs), 150, new Point3D(1, 1, 1))));
//     }
//     // for (let i = 0; i < 100; i++) {
//     //   pocho.push(app.stage.addChild(new Pocho(Texture.from(manifest.bundles[0].assets[4].srcs), 50)));
//     // }

//     // So the sprites can be sorted using z-index.
//     app.stage.sortableChildren = true;
// }

// export async function setupLights(app: Application) {
//     const assets = await Assets.loadBundle("assets");
//     setupModels(app);
//     LightingEnvironment.main.imageBasedLighting = new ImageBasedLighting(
//         assets.diffuse,
//         assets.specular
//     )

//     let directionalLight = new Light()
//     directionalLight.intensity = 1
//     directionalLight.type = LightType.directional
//     directionalLight.rotationQuaternion.setEulerAngles(25, 120, 0)
//     LightingEnvironment.main.lights.push(directionalLight)

//     let shadowCastingLight = new ShadowCastingLight(
//         app.renderer as Renderer, directionalLight, { shadowTextureSize: 1024, quality: ShadowQuality.medium })
//     shadowCastingLight.softness = 1
//     shadowCastingLight.shadowArea = 15

//     let pipeline = app.renderer.plugins.pipeline
//     pipeline.enableShadows(roadModel, shadowCastingLight)
//     pipeline.enableShadows(impalaModel, shadowCastingLight)

// }

// export function main(app: Application) {
//     // ... (Main logic)
// }
