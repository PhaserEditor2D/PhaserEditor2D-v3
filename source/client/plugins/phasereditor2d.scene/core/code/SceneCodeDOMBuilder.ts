namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;
    import SceneObject = ui.sceneobjects.SceneObject;

    export class SceneCodeDOMBuilder {

        private _scene: ui.GameScene;
        private _file: io.FilePath;

        constructor(scene: ui.GameScene, file: io.FilePath) {

            this._scene = scene;
            this._file = file;
        }

        async build(): Promise<UnitCodeDOM> {

            const settings = this._scene.getSettings();

            const methods: MemberDeclCodeDOM[] = [];

            if (settings.preloadMethodName.trim().length > 0) {

                const preloadDom = await this.buildPreloadMethod();

                methods.push(preloadDom);
            }

            const fields: MemberDeclCodeDOM[] = [];

            const unit = new UnitCodeDOM([]);

            if (settings.onlyGenerateMethods) {

                // TODO

            } else {

                const clsName = this._file.getNameWithoutExtension();
                const clsDecl = new ClassDeclCodeDOM(clsName);

                clsDecl.setSuperClass(settings.superClassName);

                // constructor
                {
                    const key = settings.sceneKey;

                    if (key.trim().length > 0) {

                        const ctrMethod = this.buildConstructorMethod(key);
                        methods.push(ctrMethod);
                    }
                }

                // create
                {
                    const createMethodDecl = this.buildCreateMethod(fields);
                    methods.push(createMethodDecl);
                }

                clsDecl.getMembers().push(...methods);
                clsDecl.getMembers().push(...fields);

                unit.getElements().push(clsDecl);
            }

            return unit;
        }

        private buildCreateMethod(fields: MemberDeclCodeDOM[]) {

            const settings = this._scene.getSettings();

            const createMethodDecl = new MethodDeclCodeDOM(settings.createMethodName);

            const publicObjects: SceneObject[] = [];

            for (const obj of this._scene.getDisplayListChildren()) {

                // TODO: if it is a prefab, the construction is other!

                const support = obj.getEditorSupport();

                let createObjectMethodCall: code.MethodCallCodeDOM;

                if (support.isPrefabInstance()) {

                    const clsName = support.getPrefabName();

                    const type = support.getObjectType();

                    const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

                    createObjectMethodCall = new code.MethodCallCodeDOM(clsName);
                    createObjectMethodCall.setConstructor(true);

                    ext.buildNewPrefabInstanceCodeDOM({
                        obj,
                        methodCallDOM: createObjectMethodCall,
                        sceneExpr: "this"
                    });

                } else {

                    const ext = support.getExtension();

                    createObjectMethodCall = ext.buildAddObjectCodeDOM({
                        gameObjectFactoryExpr: "this.add",
                        obj: obj
                    });
                }

                createMethodDecl.getInstructions().push(createObjectMethodCall);
            }

            return createMethodDecl;
        }

        private buildConstructorMethod(sceneKey: string) {

            const methodDecl = new MethodDeclCodeDOM("constructor");

            const superCall = new MethodCallCodeDOM("super", null);

            superCall.argLiteral(sceneKey);

            methodDecl.getInstructions().push(superCall);

            return methodDecl;
        }

        private async buildPreloadMethod() {

            const settings = this._scene.getSettings();

            const preloadDom = new MethodDeclCodeDOM(settings.preloadMethodName);

            // TODO: the packs to be loaded should be set manually.
            // We can provide a Scene Loader dialog where the user can select the packs to be loaded.

            /*

            for (const pair of packSectionList) {
                var call = new MethodCallDom("pack", "this.load");
                call.argLiteral(pair[0]);
                call.argLiteral(pair[1]);
                preloadDom.getInstructions().add(call);
            }*/

            return preloadDom;
        }
    }
}