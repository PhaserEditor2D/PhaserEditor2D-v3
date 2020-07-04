namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;
    import SceneObject = ui.sceneobjects.ISceneObject;

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

            const unit = new UnitCodeDOM([]);

            if (settings.onlyGenerateMethods) {

                const createMethodDecl = this.buildCreateMethod();

                await this.buildPreloadMethod(unit.getBody() as any);

                unit.getBody().push(createMethodDecl);

            } else {

                const clsName = this._file.getNameWithoutExtension();
                const clsDecl = new ClassDeclCodeDOM(clsName);

                let superCls: string;

                if (this._isPrefabScene) {

                    const obj = this._scene.getPrefabObject();

                    if (!obj) {

                        return null;
                    }

                    const support = obj.getEditorSupport();

                    if (obj.getEditorSupport().isPrefabInstance()) {

                        superCls = support.getPrefabName();

                    } else {

                        superCls = support.getPhaserType();
                    }

                    superCls = settings.superClassName.trim().length === 0 ?
                        superCls : settings.superClassName;

                } else {

                    superCls = settings.superClassName.trim().length === 0 ?
                        "Phaser.Scene" : settings.superClassName;
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

                    // scene preload method

                    await this.buildPreloadMethod(methods);

                    // scene create method

                    const createMethodDecl = this.buildCreateMethod();
                    methods.push(createMethodDecl);
                }

                const fields: MemberDeclCodeDOM[] = [];

                this.buildObjectClassFields(fields, this._scene.getDisplayListChildren());
                this.buildListClassFields(fields);

                if (this._isPrefabScene) {

                    this.buildPrefabPropertiesFields(fields);
                }

                clsDecl.getBody().push(...methods);
                clsDecl.getBody().push(...fields);

                unit.getBody().push(clsDecl);
            }

            return unit;
        }

        buildPrefabPropertiesFields(fields: MemberDeclCodeDOM[]) {

            const decls = this._scene.getPrefabUserProperties()

                .getProperties()

                .flatMap(prop => prop.buildDeclarationsCode());

            fields.push(...decls);
        }

        private buildListClassFields(fields: MemberDeclCodeDOM[]) {

            const objMap = this._scene.buildObjectIdMap();

            for (const list of this._scene.getObjectLists().getLists()) {

                if (list.getScope() !== ui.sceneobjects.ObjectScope.METHOD) {

                    const listType = list.inferType(objMap);

                    const dom = new FieldDeclCodeDOM(
                        formatToValidVarName(list.getLabel()),
                        listType,
                        list.getScope() === ui.sceneobjects.ObjectScope.PUBLIC);

                    fields.push(dom);
                }
            }
        }

        private buildObjectClassFields(fields: MemberDeclCodeDOM[], children: SceneObject[]) {

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

                if (obj instanceof ui.sceneobjects.Container
                    && !obj.getEditorSupport().isPrefabInstance()) {

                    this.buildObjectClassFields(fields, obj.list);
                }
            }
        }

        private buildPrefabConstructorMethod() {

            const settings = this._scene.getSettings();

            const ctrDecl = new code.MethodDeclCodeDOM("constructor");

            const prefabObj = this._scene.getPrefabObject();

            if (!prefabObj) {

                throw new Error("Invalid prefab scene state: missing object.");
            }

            const type = prefabObj.getEditorSupport().getObjectType();

            const ext = ScenePlugin.getInstance().getObjectExtensionByObjectType(type);

            const objBuilder = ext.getCodeDOMBuilder();

            ctrDecl.arg("scene", "Phaser.Scene");

            objBuilder.buildPrefabConstructorDeclarationCodeDOM({
                ctrDeclCodeDOM: ctrDecl
            });

            {
                const superCall = new MethodCallCodeDOM("super");

                superCall.arg("scene");

                objBuilder.buildPrefabConstructorDeclarationSupperCallCodeDOM({
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

            this.addFieldInitCode(ctrDecl.getBody());

            {
                const initMethodName = settings.prefabInitMethodName;

                if (initMethodName) {

                    const body = ctrDecl.getBody();

                    if (body.length > 1) {
                        body.push(new RawCodeDOM(""));
                    }

                    body.push(new MethodCallCodeDOM(initMethodName, "this"));
                }
            }

            return ctrDecl;
        }

        private buildCreateMethod() {

            const settings = this._scene.getSettings();

            const createMethodDecl = new MethodDeclCodeDOM(settings.createMethodName);

            if (settings.onlyGenerateMethods && this._scene.isPrefabSceneType()) {

                createMethodDecl.arg("scene", "Phaser.Scene");
            }

            const body = createMethodDecl.getBody();

            for (const obj of this._scene.getDisplayListChildren()) {

                body.push(new RawCodeDOM(""));
                body.push(new RawCodeDOM("// " + obj.getEditorSupport().getLabel()));

                this.addCreateObjectCode(obj, createMethodDecl);
            }

            this.addFieldInitCode(body);

            return createMethodDecl;
        }

        private addFieldInitCode(body: CodeDOM[]) {

            const fields: CodeDOM[] = [];

            this._scene.visitAskChildren(obj => {

                const support = obj.getEditorSupport();

                const prefabObj = this._scene.isPrefabSceneType() ? this._scene.getPrefabObject() : null;

                if (!support.isMethodScope() && prefabObj !== obj) {

                    const varname = formatToValidVarName(support.getLabel());

                    const dom = new AssignPropertyCodeDOM(varname, "this");
                    dom.value(varname);

                    fields.push(dom);
                }

                return !support.isPrefabInstance();
            });

            for (const list of this._scene.getObjectLists().getLists()) {

                if (list.getScope() !== ui.sceneobjects.ObjectScope.METHOD) {

                    const map = this._scene.buildObjectIdMap();
                    const objectVarnames: string[] = [];

                    for (const objId of list.getObjectIds()) {

                        const obj = map.get(objId);

                        if (obj) {

                            objectVarnames.push(formatToValidVarName(obj.getEditorSupport().getLabel()));
                        }
                    }

                    const varname = formatToValidVarName(list.getLabel());

                    const dom = new AssignPropertyCodeDOM(varname, "this");

                    dom.value("[" + objectVarnames.join(", ") + "]");
                    fields.push(dom);
                }
            }

            if (fields.length > 0) {

                body.push(new RawCodeDOM(""));
                body.push(...fields);
            }
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

                    const builder = ext.getCodeDOMBuilder();

                    builder.buildCreatePrefabInstanceCodeDOM({
                        obj,
                        methodCallDOM: createObjectMethodCall,
                        sceneExpr: this._isPrefabScene ? "scene" : "this",
                        prefabSerializer
                    });

                } else {

                    throw new Error(`Cannot find prefab with id ${objSupport.getPrefabId()}.`);
                }

            } else {

                const builder = objSupport.getExtension().getCodeDOMBuilder();

                createObjectMethodCall = builder.buildCreateObjectWithFactoryCodeDOM({
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

            const setPropsCode = this.buildSetObjectProperties({
                obj,
                varname
            });

            if (setPropsCode.length > 0) {

                createObjectMethodCall.setDeclareReturnToVar(true);
                createMethodDecl.getBody().push(...setPropsCode);
            }

            if (obj.parentContainer) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                const container = obj.parentContainer as ui.sceneobjects.Container;

                const parentIsPrefabObject = this._scene.isPrefabSceneType()
                    && obj.parentContainer as any === this._scene.getPrefabObject();

                const containerVarname = parentIsPrefabObject ? "this"
                    : formatToValidVarName(container.getEditorSupport().getLabel());

                const addToContainerCall = new MethodCallCodeDOM("add", containerVarname);

                addToContainerCall.arg(varname);

                createMethodDecl.getBody().push(addToContainerCall);
            }

            if (obj instanceof ui.sceneobjects.Container && !objSupport.isPrefabInstance()) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                this.addChildrenObjects({
                    createMethodDecl,
                    obj: obj as ui.sceneobjects.Container
                });
            }

            {
                const lists = objSupport.getScene().getObjectLists().getListsByObjectId(objSupport.getId());

                if (lists.length > 0) {

                    createObjectMethodCall.setDeclareReturnToVar(true);
                }
            }

            if (!objSupport.isMethodScope()) {

                createObjectMethodCall.setDeclareReturnToVar(true);
                createObjectMethodCall.setDeclareReturnToField(true);
            }

            if (createObjectMethodCall.isDeclareReturnToVar()) {

                createObjectMethodCall.setReturnToVar(varname);
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

            const methodDecl = new MethodDeclCodeDOM("constructor");

            const superCall = new MethodCallCodeDOM("super", null);

            superCall.argLiteral(sceneKey);

            methodDecl.getBody().push(superCall);

            return methodDecl;
        }

        private async buildPreloadMethod(methods: MemberDeclCodeDOM[]) {

            const settings = this._scene.getSettings();

            if (settings.preloadPackFiles.length === 0) {

                return;
            }

            const preloadDom = new MethodDeclCodeDOM(settings.preloadMethodName);

            preloadDom.getBody().push(new RawCodeDOM(""));

            const ctx = (this._isPrefabScene ? "scene" : "this");

            for (const fileName of settings.preloadPackFiles) {

                const call = new MethodCallCodeDOM("pack", ctx + ".load");

                const parts = fileName.split("/");

                const namePart = parts[parts.length - 1];

                const key = namePart.substring(0, namePart.length - 5);

                const relativeName = parts.slice(1).join("/");

                call.argLiteral(key);
                call.argLiteral(relativeName);

                preloadDom.getBody().push(call);
            }

            methods.push(preloadDom);
        }
    }
}