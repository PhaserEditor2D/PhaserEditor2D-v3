namespace phasereditor2d.scene.ui.sceneobjects {

    import write = colibri.core.json.write;
    import read = colibri.core.json.read;

    export declare interface IOriginLike {
        originX: number;
        originY: number;
    }

    export class OriginComponent implements json.ObjectSerializer {

        private _obj: IOriginLike;

        constructor(obj: IOriginLike) {
            this._obj = obj;
        }

        readJSON(data: json.ObjectData) {

            this._obj.originX = read(data, "originX", 0.5);
            this._obj.originY = read(data, "originY", 0.5);
        }

        writeJSON(data: json.ObjectData) {

            write(data, "originX", this._obj.originX, 0.5);
            write(data, "originY", this._obj.originY, 0.5);
        }
    }
}