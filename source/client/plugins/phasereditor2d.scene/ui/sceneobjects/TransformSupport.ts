namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export declare interface ITransformLike {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        angle: number;
    }

    export class TransformSupport {

        private _obj: ITransformLike;

        constructor(obj: ITransformLike) {
            this._obj = obj;
        }

        readJSON(data: any) {
            this._obj.x = read(data, "x", 0);
            this._obj.y = read(data, "y", 0);

            this._obj.scaleX = read(data, "scaleX", 1);
            this._obj.scaleY = read(data, "scaleY", 1);
            this._obj.angle = read(data, "angle", 0);
        }

        writeJSON(data: any) {

            write(data, "x", this._obj.x, 0);
            write(data, "y", this._obj.y, 0);
            write(data, "scaleX", this._obj.scaleX, 1);
            write(data, "scaleY", this._obj.scaleY, 1);
            write(data, "angle", this._obj.angle, 0);
        }
    }
}