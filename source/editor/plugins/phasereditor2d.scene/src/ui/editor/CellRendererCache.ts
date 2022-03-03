namespace phasereditor2d.scene.ui.editor {

    import controls = colibri.ui.controls;

    export class CellRendererCache {

        private _imageMap: Map<string, controls.IImage>;
        private _hashMap: Map<string, string>;
        private _promiseMap: Map<string, Promise<controls.PreloadResult>>;

        constructor() {

            this._imageMap = new Map();
            this._hashMap = new Map();
            this._promiseMap = new Map();
        }

        getImage(obj: sceneobjects.ISceneGameObject) {

            const objId = obj.getEditorSupport().getId();

            const imageInCache = this._imageMap.get(objId);

            return imageInCache;
        }


        async preloadImage(
            obj: sceneobjects.ISceneGameObject): Promise<controls.PreloadResult> {

            const objId = obj.getEditorSupport().getId();

            if (this._promiseMap.has(objId)) {

                return this._promiseMap.get(objId);
            }

            const hash = obj.getEditorSupport().computeContentHash();

            const hashInCache = this._hashMap.get(objId);

            if (hashInCache === hash) {

                return controls.PreloadResult.NOTHING_LOADED;
            }

            if (this._promiseMap.has(objId)) {

                return this._promiseMap.get(objId);
            }

            const makeImagePromise = new Promise<controls.PreloadResult>((resolve, reject) => {

                const sprite = obj as sceneobjects.Sprite;

                const angle = sprite.angle;
                const originX = sprite.originX;
                const originY = sprite.originY;
                const scaleX = sprite.scaleX;
                const scaleY = sprite.scaleY;

                sprite.setAngle(0);
                sprite.setOrigin(0, 0);
                sprite.setScale(1, 1);

                let renderX = 0;
                let renderY = 0;
                let renderWidth = sprite.width;
                let renderHeight = sprite.height;

                if (sprite instanceof sceneobjects.TilemapLayer) {

                    const layer = sprite as sceneobjects.TilemapLayer;

                    if (layer.getEditorSupport().getOrientation() === Phaser.Tilemaps.Orientation.ISOMETRIC) {

                        renderX = layer.width / 2;
                        renderY = 0;
                        renderWidth = layer.width * 2;
                        renderHeight = layer.height * 2;
                    }
                }

                renderWidth = Math.max(1, Math.min(1024, renderWidth));
                renderHeight = Math.max(1, Math.min(1024, renderHeight));

                const scene = sprite.getEditorSupport().getScene();

                const render = new Phaser.GameObjects.RenderTexture(
                    scene, 0, 0, renderWidth, renderHeight);

                render.draw(sprite, renderX, renderY);

                try {

                    render.snapshot(imgElement => {

                        const img = new controls.ImageWrapper(imgElement as HTMLImageElement);

                        this._hashMap.set(objId, hash);
                        this._imageMap.set(objId, img);
                        this._promiseMap.delete(objId);

                        resolve(controls.PreloadResult.RESOURCES_LOADED);
                    });

                } catch (e) {

                    console.error(obj.getEditorSupport().getLabel() + ": " + e.message);
                }

                sprite.setAngle(angle);
                sprite.setOrigin(originX, originY);
                sprite.setScale(scaleX, scaleY);

                render.destroy();
            });

            this._promiseMap.set(objId, makeImagePromise);

            return makeImagePromise;
        }


        clear() {

            this._imageMap.clear();
            this._hashMap.clear();
            this._promiseMap.clear();
        }
    }
}