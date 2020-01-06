namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;
    import SceneObject = ui.sceneobjects.SceneObject;

    export class SceneCodeDOMBuilder {

        private _scene: ui.GameScene;
        private _isPrefabScene: boolean;
        private _file: io.FilePath;

        constructor(scene: ui.GameScene, file: io.FilePath) {

            this._scene = scene;
            this._file = file;
            this._isPrefabScene = this._scene.isPrefabSceneType();
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

                let superCls: string;

                if (this._isPrefabScene) {

                    const obj = this._scene.getPrefabObject();
                    const support = obj.getEditorSupport();

                    if (obj.getEditorSupport().isPrefabInstance()) {

                        superCls = support.getPrefabName();

                    } else {

                        superCls = support.getPhaserType();
                    }

                } else {

                    superCls = settings.superClassName;
                }

                clsDecl.setSuperClass(superCls);

                if (this._isPrefabScene) {

                    // prefab constructor

                    const ctrMethod = this.buildPrefabConstructorMethod();
                    methods.push(ctrMethod);

                } else {

                    // scene constructor

                    const key = settings.sceneKey;

                    if (key.trim().length > 0) {

                        const ctrMethod = this.buildSceneConstructorMethod(key);
                        methods.push(ctrMethod);
                    }

                    // scene create method

                    const createMethodDecl = this.buildCreateMethod(fields);
                    methods.push(createMethodDecl);
                }

                clsDecl.getMembers().push(...methods);
                clsDecl.getMembers().push(...fields);

                unit.getElements().push(clsDecl);
            }

            return unit;
        }

        private buildPrefabConstructorMethod() {

            const ctrDecl = new code.MethodDeclCodeDOM("constructor");

            const prefabObj = this._scene.getPrefabObject();

            if (!prefabObj) {

                throw new Error("Invalid prefab scene state: missing object.");
            }

            const type = prefabObj.getEditorSupport().getObjectType();

            const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

            ctrDecl.addArg("scene", "Phaser.Scene");

            ext.buildPrefabConstructorDeclarationCodeDOM({
                ctrDeclCodeDOM: ctrDecl
            });

            {
                const superCall = new MethodCallCodeDOM("super");

                for (const arg of ctrDecl.getArgs()) {

                    superCall.arg(arg.name);
                }

                ctrDecl.getBody().push(superCall);
                ctrDecl.getBody().push(new RawCodeDOM(""));
            }

            this.addSetObjectProperties({
                obj: prefabObj,
                temporalVar: false,
                createMethodDecl: ctrDecl,
                varname: "this"
            });

            if (prefabObj instanceof ui.sceneobjects.Container) {

                this.addChildrenObjects({
                    createMethodDecl: ctrDecl,
                    obj: prefabObj,
                    temporalVar: false
                });
            }

            return ctrDecl;
        }

        private buildCreateMethod(fields: MemberDeclCodeDOM[]) {

            const settings = this._scene.getSettings();

            const createMethodDecl = new MethodDeclCodeDOM(settings.createMethodName);

            const body = createMethodDecl.getBody();

            for (const obj of this._scene.getDisplayListChildren()) {

                body.push(new RawCodeDOM(""));
                body.push(new RawCodeDOM("// " + obj.getEditorSupport().getLabel()));

                this.addCreateObjectCode(obj, createMethodDecl);
            }

            return createMethodDecl;
        }

        private addCreateObjectCode(obj: SceneObject, createMethodDecl: MethodDeclCodeDOM) {

            const objSupport = obj.getEditorSupport();

            let createObjectMethodCall: MethodCallCodeDOM;

            if (objSupport.isPrefabInstance()) {

                const clsName = objSupport.getPrefabName();

                const type = objSupport.getObjectType();

                const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

                createObjectMethodCall = new code.MethodCallCodeDOM(clsName);
                createObjectMethodCall.setConstructor(true);

                const prefabSerializer = objSupport.getPrefabSerializer();

                if (prefabSerializer) {

                    ext.buildCreatePrefabInstanceCodeDOM({
                        obj,
                        methodCallDOM: createObjectMethodCall,
                        sceneExpr: this._isPrefabScene ? "scene" : "this",
                        prefabSerializer
                    });

                } else {

                    throw new Error(`Cannot find prefab with id ${objSupport.getPrefabId()}.`);
                }

            } else {

                const ext = objSupport.getExtension();

                createObjectMethodCall = ext.buildCreateObjectWithFactoryCodeDOM({
                    gameObjectFactoryExpr: this._scene.isPrefabSceneType() ? "scene.add" : "this.add",
                    obj: obj
                });
            }

            const varname = formatToValidVarName(objSupport.getLabel());

            createMethodDecl.getBody().push(createObjectMethodCall);

            let temporalVar = false;

            if (objSupport.isPrefabInstance()) {

                temporalVar = true;

                if (!obj.parentContainer) {
                    const addToScene = new MethodCallCodeDOM("existing", "this.add");
                    addToScene.arg(varname);
                    createMethodDecl.getBody().push(addToScene);
                }
            }

            if (obj.parentContainer) {

                temporalVar = true;

                const container = obj.parentContainer as ui.sceneobjects.Container;

                const parentIsPrefabObject = obj.parentContainer as any === this._scene.getPrefabObject();

                const containerVarname = parentIsPrefabObject ? "this"
                    : formatToValidVarName(container.getEditorSupport().getLabel());

                const addToContainerCall = new MethodCallCodeDOM("add", containerVarname);

                addToContainerCall.arg(varname);

                createMethodDecl.getBody().push(addToContainerCall);
            }

            const result = this.addSetObjectProperties({
                temporalVar,
                createMethodDecl,
                obj,
                varname
            });

            temporalVar = result.temporalVar || temporalVar;

            if (obj instanceof ui.sceneobjects.Container) {

                temporalVar = this.addChildrenObjects({
                    temporalVar,
                    createMethodDecl,
                    obj: obj as ui.sceneobjects.Container
                }) || temporalVar;
            }

            if (temporalVar) {

                createObjectMethodCall.setReturnToVar(varname);
                createObjectMethodCall.setDeclareReturnToVar(true);
            }
        }

        private addSetObjectProperties(args: {
            temporalVar: boolean,
            obj: SceneObject,
            varname: string,
            createMethodDecl: code.MethodDeclCodeDOM
        }): {
            temporalVar: boolean
        } {

            const obj = args.obj;
            const support = obj.getEditorSupport();
            const varname = args.varname;
            const createMethodDecl = args.createMethodDecl;
            let temporalVar = args.temporalVar;

            let prefabSerializer: json.Serializer = null;

            if (support.isPrefabInstance()) {

                prefabSerializer = support.getPrefabSerializer();
            }

            const setPropsInstructions: CodeDOM[] = [];

            for (const comp of support.getComponents()) {

                comp.buildSetObjectPropertiesCodeDOM({
                    result: setPropsInstructions,
                    objectVarName: varname,
                    prefabSerializer: prefabSerializer
                });

                temporalVar = temporalVar || setPropsInstructions.length > 0;

            }

            createMethodDecl.getBody().push(...setPropsInstructions);

            return {
                temporalVar
            };
        }

        private addChildrenObjects(args: {
            temporalVar: boolean,
            obj: ui.sceneobjects.Container,
            createMethodDecl: MethodDeclCodeDOM
        }) {

            if (args.obj instanceof ui.sceneobjects.Container && !args.obj.getEditorSupport().isPrefabInstance()) {

                args.temporalVar = args.temporalVar || args.obj.list.length > 0;

                for (const child of args.obj.list) {

                    args.createMethodDecl.getBody().push(new RawCodeDOM(""));
                    args.createMethodDecl.getBody().push(new RawCodeDOM("// " + child.getEditorSupport().getLabel()));
                    this.addCreateObjectCode(child, args.createMethodDecl);
                }
            }

            return args.temporalVar;
        }

        private buildSceneConstructorMethod(sceneKey: string) {

            const settings = this._scene.getSettings();

            const methodDecl = new MethodDeclCodeDOM("constructor");

            const superCall = new MethodCallCodeDOM("super", null);

            superCall.argLiteral(sceneKey);

            methodDecl.getBody().push(superCall);

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