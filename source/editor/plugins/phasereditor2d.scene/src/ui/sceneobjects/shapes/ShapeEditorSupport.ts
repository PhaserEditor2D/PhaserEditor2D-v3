namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export interface IShapeGameObject
        extends ISceneGameObject,
        ITransformLikeObject,
        IOriginLikeObject,
        IVisibleLikeObject {

        fillColor: number;
        fillAlpha: number;
        strokeColor: number;
        strokeAlpha: number;
        lineWidth: number;
        isFilled: boolean;
        isStroked: boolean;
    }

    export abstract class ShapeEditorSupport<T extends IShapeGameObject> extends GameObjectEditorSupport<T> {

        static isShape(obj: ISceneObject): boolean {

            return obj instanceof Phaser.GameObjects.GameObject
                && obj.getEditorSupport() instanceof ShapeEditorSupport;
        }

        constructor(ext: SceneGameObjectExtension, obj: T, scene: Scene) {
            super(ext, obj, scene);

            this.addComponent(

                new TransformComponent(obj),
                new OriginComponent(obj),
                new VisibleComponent(obj),
                new ShapeComponent(obj)
            );
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            return new ObjectCellRenderer();
        }

        setInteractive() {

            this.getObject().setInteractive(interactive_shape);
        }

        computeContentHash() {

            const json = this.getObject().toJSON();

            const hash = JSON.stringify(json);

            return hash;
        }
    }
}