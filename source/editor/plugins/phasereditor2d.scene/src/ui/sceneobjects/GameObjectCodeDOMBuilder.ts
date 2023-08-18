namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    /**
     * This class provides the methods to build the CodeDOM of the different aspects
     * of the code generation associated to game objects.
     *
     * Each object extension provides an instance of this class, that is used by the Scene compiler.
     */
    export abstract class GameObjectCodeDOMBuilder {
        
        
        private _chainToFactory: string;

        /**
         * 
         * @param chainToFactory The code chain to reach the factory of the object.
         * It is in the context of a scene. It is `add` by default, like in `scene.add.sprite(...)`.
         * But it could be `physics.add`, like in `scene.physics.add.spirte(...)`.
         */
        constructor(chainToFactory = "add") {

            this._chainToFactory = chainToFactory;
        }

        getChainToFactory() {

            return this._chainToFactory;
        }

        /**
         * Build a method call CodeDOM to create the scene object of this extension,
         * using the factories provided by Phaser.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): code.MethodCallCodeDOM;

        /**
         * Build a CodeDOM expression to create a prefab instance that
         * has as root type the same type of this scene object type.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void;

        /**
         * Adds the X and Y arguments to the prefab's instance creation.
         *
         * @param args This method args.
         */
        protected buildCreatePrefabInstanceCodeDOM_XY_Arguments(args: IBuildPrefabConstructorCodeDOMArgs) {

            const obj = args.obj as any as ITransformLikeObject;
            const objES = obj.getEditorSupport();
            
            const call = args.methodCallDOM;

            if (objES.isUnlockedPropertyXY(TransformComponent.position)) {

                call.argFloat(obj.x);
                call.argFloat(obj.y);

            } else {

                call.arg("undefined");
                call.arg("undefined");
            }
        }

        /**
         * Adds the Width and Height arguments to the prefab's instance creation.
         *
         * @param args This method args.
         */
         protected buildCreatePrefabInstanceCodeDOM_Size_Arguments(args: IBuildPrefabConstructorCodeDOMArgs) {

            const obj = args.obj as any as ISizeLikeObject;
            const call = args.methodCallDOM;

            if (obj.getEditorSupport().isUnlockedPropertyXY(SizeComponent.size)) {

                call.argFloat(obj.width);
                call.argFloat(obj.height);

            } else {

                call.arg("undefined");
                call.arg("undefined");
            }
        }

        /**
         * Build the CodeDOM of the prefab class constructor.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void;

        /**
         * Build the CodeDOM of the super-method call in a prefab constructor.
         *
         * This method is used by the Scene compiler.
         *
         * @param args This method args.
         */
        abstract buildPrefabConstructorDeclarationSupperCallCodeDOM(
            args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void;

        /**
         * Adds the X and Y parameters to the `super` statement of a prefab constructor.
         *
         * @param args Method args
         */
        protected buildPrefabConstructorDeclarationSupperCallCodeDOM_XYParameters(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs) {

            const obj = args.prefabObj;
            const objES = obj.getEditorSupport();

            const call = args.superMethodCallCodeDOM;

            if (objES.isUnlockedPropertyXY(TransformComponent.position)) {

                call.arg(`x ?? ${TransformComponent.x.getValue(obj)}`);
                call.arg(`y ?? ${TransformComponent.y.getValue(obj)}`);

            } else {

                call.arg("x");
                call.arg("y");
            }
        }

        /**
         * Adds the Width and Height parameters to the `super` statement of a prefab constructor.
         *
         * @param args Method args
         */
         protected buildPrefabConstructorDeclarationSupperCallCodeDOM_SizeParameters(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs) {

            const obj = args.prefabObj as ISizeLikeObject;
            const call = args.superMethodCallCodeDOM;

            if (obj.getEditorSupport().isUnlockedProperty(SizeComponent.width)) {

                call.arg("width ?? " + obj.width);
                call.arg("height ?? " + obj.height);

            } else {

                call.arg("width");
                call.arg("height");
            }
        }
    }
}