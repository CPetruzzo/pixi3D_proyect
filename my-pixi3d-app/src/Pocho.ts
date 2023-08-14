import { Texture, Resource } from "pixi.js";
import { SpriteBillboardType, Vec3, Camera } from "pixi3d/*";
import { Sprite3D } from "pixi3d/*";

export class Pocho extends Sprite3D {
    areaSize: any;
    speedX: number;
    speedY: number;
    speedZ: number;
    constructor(texture: Texture<Resource> | undefined, areaSize: any) {
        super(texture);

        this.areaSize = areaSize;
        this.position.set(
            -this.areaSize / 2 + Math.random() * this.areaSize,
            0,
            -this.areaSize / 2 + Math.random() * this.areaSize
        );

        this.speedX = -0.01 + Math.random() * 0.02;
        this.speedY = Math.random() * 6;
        this.speedZ = -0.01 + Math.random() * 0.02;

        // The billboard type is set so the sprite always face the camera.
        this.billboardType = SpriteBillboardType.spherical;
    }

    public distanceFromCamera() {
        return Vec3.distance(
            this.worldTransform.position,
            Camera.main.worldTransform.position
        );
    }

    public update() {
        this.position.x += this.speedX;
        this.position.y = Math.cos((this.speedY += 0.4)) * 0.05;
        this.position.z += this.speedZ;

        if (this.position.x > this.areaSize / 2) {
            this.speedX *= -1;
            this.position.x = this.areaSize / 2;
        } else if (this.position.x < -this.areaSize / 2) {
            this.speedX *= -1;
            this.position.x = -this.areaSize / 2;
        }
        if (this.position.z > this.areaSize / 2) {
            this.speedZ *= -1;
            this.position.z = this.areaSize / 2;
        } else if (this.position.z < -this.areaSize / 2) {
            this.speedZ *= -1;
            this.position.z = -this.areaSize / 2;
        }
    }
}