namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;
    import SceneObject = ui.sceneobjects.SceneObject;

    export class SceneCodeDOMBuilder {

        private _scene: ui.Scene;
        private _isPrefabScene: boolean;
        private _file: io.FilePath;

        constructor(scene: ui.Scene, file: io.FilePath) {

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

                    const createMethodDecl = this.buildCreateMethod();
                    methods.push(createMethodDecl);
                }

                const fields: MemberDeclCodeDOM[] = [];
                this.buildClassFields(fields, this._scene.getDisplayListChildren());

                clsDecl.getBody().push(...methods);
                clsDecl.getBody().push(...fields);

                unit.getElements().push(clsDecl);
            }

            return unit;
        }

        private buildClassFields(fields: MemberDeclCodeDOM[], children: SceneObject[]) {

            for (const obj of children) {

                const support = obj.getEditorSupport();
                const scope = support.getScope();

                if (scope !== ui.sceneobjects.ObjectScope.METHOD) {

                    const varName = code.formatToValidVarName(support.getLabel());

                    const type = support.isPrefabInstance()
                        ? support.getPrefabName()
                        : support.getPhaserType();

                    const isPublic = support.getScope() === ui.sceneobjects.ObjectScope.PUBLIC;

                    const field = new FieldDeclCodeDOM(varName, type, isPublic);

                    fields.push(field);
                }

                if (obj instanceof ui.sceneobjects.Container) {

                    this.buildClassFields(fields, obj.list);
                }
            }
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

                superCall.arg("scene");

                ext.buildPrefabConstructorDeclarationSupperCallCodeDOM({
                    superMethodCallCodeDOM: superCall,
                    prefabObj: prefabObj
                });

                ctrDecl.getBody().push(superCall);
                ctrDecl.getBody().push(new RawCodeDOM(""));
            }

            const setPropsCodeList = this.buildSetObjectProperties({
                obj: prefabObj,
                varname: "this"
            });

            ctrDecl.getBody().push(...setPropsCodeList);

            if (prefabObj instanceof ui.sceneobjects.Container && !prefabObj.getEditorSupport().isPrefabInstance()) {

                this.addChildrenObjects({
                    createMethodDecl: ctrDecl,
                    obj: prefabObj
                });
            }

            return ctrDecl;
        }

        private buildCreateMethod() {

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

            if (objSupport.isPrefabInstance()) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                if (!obj.parentContainer) {
                    const addToScene = new MethodCallCodeDOM("existing", "this.add");
                    addToScene.arg(varname);
                    createMethodDecl.getBody().push(addToScene);
                }
            }

            if (obj.parentContainer) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                const container = obj.parentContainer as ui.sceneobjects.Container;

                const parentIsPrefabObject = obj.parentContainer as any === this._scene.getPrefabObject();

                const containerVarname = parentIsPrefabObject ? "this"
                    : formatToValidVarName(container.getEditorSupport().getLabel());

                const addToContainerCall = new MethodCallCodeDOM("add", containerVarname);

                addToContainerCall.arg(varname);

                createMethodDecl.getBody().push(addToContainerCall);
            }

            const setPropsCode = this.buildSetObjectProperties({
                obj,
                varname
            });

            if (setPropsCode.length > 0) {
                createObjectMethodCall.setDeclareReturnToVar(true);
                createMethodDecl.getBody().push(...setPropsCode);
            }

            if (obj instanceof ui.sceneobjects.Container && !objSupport.isPrefabInstance()) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                this.addChildrenObjects({
                    createMethodDecl,
                    obj: obj as ui.sceneobjects.Container
                });
            }

            if (createObjectMethodCall.isDeclareReturnToVar()) {

                createObjectMethodCall.setReturnToVar(varname);

                if (obj.getEditorSupport().getScope() !== ui.sceneobjects.ObjectScope.METHOD) {
                    createObjectMethodCall.setDeclareReturnToField(true);
                }
            }
        }

        private buildSetObjectProperties(args: {
            obj: SceneObject,
            varname: string
        }) {

            const obj = args.obj;
            const support = obj.getEditorSupport();
            const varname = args.varname;

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
            }

            return setPropsInstructions;
        }

        private addChildrenObjects(args: {
            obj: ui.sceneobjects.Container,
            createMethodDecl: MethodDeclCodeDOM
        }) {

            for (const child of args.obj.list) {

                args.createMethodDecl.getBody().push(new RawCodeDOM(""));
                args.createMethodDecl.getBody().push(new RawCodeDOM("// " + child.getEditorSupport().getLabel()));
                this.addCreateObjectCode(child, args.createMethodDecl);
            }
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