namespace phasereditor2d.scene.ui.sceneobjects {

    export class TextExtension extends SceneObjectExtension {

        private static _instance = new TextExtension();

        static getInstance() {
            return this._instance;
        }

        constructor() {
            super({
                phaserTypeName: "Phaser.GameObjects.Text",
                typeName: "Text"
            });
        }

        acceptsDropData(data: any): boolean {
            return false;
        }

        createSceneObjectWithAsset(args: ICreateWithAssetArgs): ISceneObject {
            return null;
        }

        createEmptySceneObject(args: ICreateEmptyArgs): ISceneObject {

            const text = new Text(args.scene, args.x, args.y, "New text", {});

            return text;
        }

        createSceneObjectWithData(args: ICreateWithDataArgs): ISceneObject {

            const text = new Text(args.scene, 0, 0, "", {});

            text.getEditorSupport().readJSON(args.data);

            return text;
        }

        async getAssetsFromObjectData(args: IGetAssetsFromObjectArgs): Promise<any[]> {

            return [];
        }

        getCodeDOMBuilder(): ObjectCodeDOMBuilder {

            return new TextCodeDOMBuilder();
        }
    }
}