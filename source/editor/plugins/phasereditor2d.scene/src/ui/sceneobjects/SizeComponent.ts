namespace phasereditor2d.scene.ui.sceneobjects {

    export interface ISizeLikeObject extends ISceneGameObject {
        width: number;
        height: number;
        setSize(width: number, height: number): void;
    }

    function updateDisplayOrigin(obj: Phaser.GameObjects.Sprite) {

        obj.setSize(obj.width, obj.height);
        obj.updateDisplayOrigin();
    }

    export class SizeComponent extends Component<ISizeLikeObject> {

        static width = SimpleProperty("width", 0, "Width", "The object's width.", false, updateDisplayOrigin);
        static height = SimpleProperty("height", 0, "Height", "The object's height.", false, updateDisplayOrigin);

        static size: IPropertyXY = {
            label: "Size",
            x: SizeComponent.width,
            y: SizeComponent.height
        }

        constructor(obj: ISizeLikeObject) {
            super(obj, [SizeComponent.width, SizeComponent.height]);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {

            // this.buildSetObjectPropertyCodeDOM_FloatProperty(args, SizeComponent.width, SizeComponent.height);
        }
    }
}