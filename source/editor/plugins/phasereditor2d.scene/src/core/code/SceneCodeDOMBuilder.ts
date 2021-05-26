/// <reference path="../../ui/sceneobjects/container/Container.ts"/>
/// <reference path="../../ui/sceneobjects/layer/Layer.ts"/>
namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;
    import ISceneGameObject = ui.sceneobjects.ISceneGameObject;
    import Container = ui.sceneobjects.Container;
    import Layer = ui.sceneobjects.Layer;

    export class SceneCodeDOMBuilder {

        private _scene: ui.Scene;
        private _isPrefabScene: boolean;
        private _sceneFile: io.FilePath;
        private _unit: UnitCodeDOM;

        constructor(scene: ui.Scene, file: io.FilePath) {

            this._scene = scene;
            this._sceneFile = file;
            this._isPrefabScene = this._scene.isPrefabSceneType();
        }

        async build(): Promise<UnitCodeDOM> {

            const settings = this._scene.getSettings();

            const methods: MemberDeclCodeDOM[] = [];

            const unit = new UnitCodeDOM([]);

            this._unit = unit;

            if (settings.onlyGenerateMethods) {

                const createMethodDecl = this.buildCreateMethod();

                await this.buildPreloadMethod(unit.getBody() as any);

                unit.getBody().push(createMethodDecl);

            } else {

                const clsName = this._sceneFile.getNameWithoutExtension();
                const clsDecl = new ClassDeclCodeDOM(clsName);

                clsDecl.setExportClass(settings.exportClass);

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

                if (superCls.startsWith("Phaser.")) {

                    unit.addImport("Phaser", "phaser");
                }

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

                if (this._isPrefabScene) {

                    clsDecl.getBody().push(new UserSectionCodeDOM(
                        "/* START-USER-CODE */", "/* END-USER-CODE */", "\n\n\t// Write your code here.\n\n\t"));

                } else {

                    const defaultContent = [
                        "",
                        "",
                        "// Write your code here",
                        "",
                        "create() {",
                        "",
                        "\tthis.editorCreate();",
                        "}",
                        "",
                        ""].join("\n\t");

                    clsDecl.getBody().push(new UserSectionCodeDOM(
                        "/* START-USER-CODE */", "/* END-USER-CODE */", defaultContent));
                }

                unit.getBody().push(clsDecl);
            }

            if (!settings.autoImport) {

                unit.removeImports();
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

        private buildObjectClassFields(fields: MemberDeclCodeDOM[], children: ISceneGameObject[]) {

            for (const obj of children) {

                const support = obj.getEditorSupport();
                const isMethodScope = support.getScope() === ui.sceneobjects.ObjectScope.METHOD;
                const isPrefabObj = this._scene.isPrefabSceneType() && this._scene.getPrefabObject() === obj;

                if (!isMethodScope && !isPrefabObj) {

                    const varName = code.formatToValidVarName(support.getLabel());

                    const type = support.isPrefabInstance()
                        ? support.getPrefabName()
                        : support.getPhaserType();

                    const isPublic = support.getScope() === ui.sceneobjects.ObjectScope.PUBLIC;

                    const field = new FieldDeclCodeDOM(varName, type, isPublic);

                    fields.push(field);
                }

                if ((obj instanceof Container || obj instanceof Layer)
                    && !obj.getEditorSupport().isPrefabInstance()) {

                    this.buildObjectClassFields(fields, obj.getChildren());
                }
            }
        }

        private buildPrefabConstructorMethod() {

            const ctrDecl = new code.MethodDeclCodeDOM("constructor");

            const body = ctrDecl.getBody();

            const prefabObj = this._scene.getPrefabObject();

            if (!prefabObj) {

                throw new Error("Invalid prefab scene state: missing object.");
            }

            const type = prefabObj.getEditorSupport().getObjectType();

            const ext = ScenePlugin.getInstance().getGameObjectExtensionByObjectType(type);

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

                body.push(superCall);
                body.push(new RawCodeDOM(""));
            }

            const lazyStatements: CodeDOM[] = [];

            const result = this.buildSetObjectProperties({
                obj: prefabObj,
                varname: "this"
            });

            lazyStatements.push(...result.lazyStatements);

            body.push(...result.statements);

            if ((prefabObj instanceof Container || prefabObj instanceof Layer) && !prefabObj.getEditorSupport().isPrefabInstance()) {

                this.addChildrenObjects({
                    createMethodDecl: ctrDecl,
                    obj: prefabObj,
                    lazyStatements
                });
            }

            this.addCreateAllPlainObjectCode(ctrDecl);

            this.addCreateListsCode(body);

            body.push(...lazyStatements);

            this.addFieldInitCode(body);

            return ctrDecl;
        }

        private buildCreateMethod() {

            const settings = this._scene.getSettings();

            const createMethodDecl = new MethodDeclCodeDOM(settings.createMethodName);

            if (settings.onlyGenerateMethods && this._scene.isPrefabSceneType()) {

                createMethodDecl.arg("scene", "Phaser.Scene");
            }

            const body = createMethodDecl.getBody();

            this.addCreateAllPlainObjectCode(createMethodDecl);

            const lazyStatements: CodeDOM[] = [];

            for (const obj of this._scene.getDisplayListChildren()) {

                body.push(new RawCodeDOM(""));
                body.push(new RawCodeDOM("// " + obj.getEditorSupport().getLabel()));

                this.addCreateObjectCode(obj, createMethodDecl, lazyStatements);
            }

            this.addCreateListsCode(body);

            body.push(...lazyStatements);

            this.addFieldInitCode(body);

            return createMethodDecl;
        }

        private addCreateAllPlainObjectCode(createMethodDecl: MethodDeclCodeDOM) {

            const body = createMethodDecl.getBody();

            for (const obj of this._scene.getPlainObjects()) {

                body.push(new RawCodeDOM(""));
                body.push(new RawCodeDOM("// " + obj.getEditorSupport().getLabel()));

                this.addCreatePlainObjectCode(obj, createMethodDecl);
            }
        }

        private addCreateListsCode(body: CodeDOM[]) {

            const lists = this._scene.getObjectLists().getLists();

            if (lists.length > 0) {

                body.push(
                    new RawCodeDOM(""),
                    new RawCodeDOM("// lists"));
            }

            for (const list of lists) {

                const map = this._scene.buildObjectIdMap();
                const objectVarnames: string[] = [];

                for (const objId of list.getObjectIds()) {

                    const obj = map.get(objId);

                    if (obj) {

                        objectVarnames.push(formatToValidVarName(obj.getEditorSupport().getLabel()));
                    }
                }

                const varname = formatToValidVarName(list.getLabel());

                const dom = new RawCodeDOM(`const ${varname} = [${objectVarnames.join(", ")}]`);

                body.push(dom);
            }
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

            for (const obj of this._scene.getPlainObjects()) {

                const editorSupport = obj.getEditorSupport();

                if (editorSupport.getScope() !== ui.sceneobjects.ObjectScope.METHOD) {

                    const varname = formatToValidVarName(editorSupport.getLabel());

                    const dom = new AssignPropertyCodeDOM(varname, "this");

                    dom.value(varname);

                    fields.push(dom);
                }
            }

            for (const list of this._scene.getObjectLists().getLists()) {

                if (list.getScope() !== ui.sceneobjects.ObjectScope.METHOD) {

                    const varname = formatToValidVarName(list.getLabel());

                    const dom = new AssignPropertyCodeDOM(varname, "this");

                    dom.value(varname);

                    fields.push(dom);
                }
            }

            if (fields.length > 0) {

                body.push(new RawCodeDOM(""));
                body.push(...fields);
            }
        }

        private addCreatePlainObjectCode(
            obj: ui.sceneobjects.IScenePlainObject, createMethodDecl: MethodDeclCodeDOM) {

            const objSupport = obj.getEditorSupport();

            const varname = formatToValidVarName(objSupport.getLabel());

            const createObjectMethodCalls = objSupport.getExtension().buildCreateObjectWithFactoryCodeDOM({
                gameObjectFactoryExpr: this._scene.isPrefabSceneType() ? "scene" : "this",
                obj: obj,
                varname
            })

            createMethodDecl.getBody().push(...createObjectMethodCalls);

            const mainCreateMethodCall = createObjectMethodCalls[0];

            mainCreateMethodCall.setDeclareReturnToVar(true);

            if (!objSupport.isMethodScope()) {

                mainCreateMethodCall.setDeclareReturnToVar(true);
                mainCreateMethodCall.setDeclareReturnToField(true);
            }

            if (mainCreateMethodCall.isDeclareReturnToVar()) {

                mainCreateMethodCall.setReturnToVar(varname);
            }
        }

        private addCreateObjectCode(obj: ISceneGameObject, createMethodDecl: MethodDeclCodeDOM, lazyStatements: CodeDOM[]) {

            const objSupport = obj.getEditorSupport();

            let createObjectMethodCall: MethodCallCodeDOM;

            if (objSupport.isPrefabInstance()) {

                const clsName = objSupport.getPrefabName();

                const type = objSupport.getObjectType();

                const ext = ScenePlugin.getInstance().getGameObjectExtensionByObjectType(type);

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

                    const filePath = code.getImportPath(this._sceneFile, objSupport.getPrefabFile());
                    this._unit.addImport(clsName, filePath);

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

            const objParent = ui.sceneobjects.getObjectParent(obj);

            createMethodDecl.getBody().push(createObjectMethodCall);

            if (objSupport.isPrefabInstance()) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                if (!objParent) {

                    const addToScene = new MethodCallCodeDOM("existing", "this.add");
                    addToScene.arg(varname);
                    createMethodDecl.getBody().push(addToScene);
                }
            }

            const result = this.buildSetObjectProperties({
                obj,
                varname
            });

            if (result.statements.length + result.lazyStatements.length > 0) {

                createObjectMethodCall.setDeclareReturnToVar(true);
            }

            lazyStatements.push(...result.lazyStatements);

            createMethodDecl.getBody().push(...result.statements);

            if (objParent) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                const parentIsPrefabObject = this._scene.isPrefabSceneType()
                    && objParent === this._scene.getPrefabObject();

                const parentVarname = parentIsPrefabObject ? "this"
                    : formatToValidVarName(objParent.getEditorSupport().getLabel());

                const addToParentCall = new MethodCallCodeDOM("add", parentVarname);

                addToParentCall.arg(varname);

                createMethodDecl.getBody().push(addToParentCall);
            }

            if ((obj instanceof Container || obj instanceof Layer) && !objSupport.isPrefabInstance()) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                this.addChildrenObjects({
                    createMethodDecl,
                    obj,
                    lazyStatements
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
            obj: ISceneGameObject,
            varname: string
        }) {

            const obj = args.obj;
            const support = obj.getEditorSupport();
            const varname = args.varname;

            let prefabSerializer: json.Serializer = null;

            if (support.isPrefabInstance()) {

                prefabSerializer = support.getPrefabSerializer();
            }

            const statements: CodeDOM[] = [];
            const lazyStatements: CodeDOM[] = [];

            for (const comp of support.getComponents()) {

                comp.buildSetObjectPropertiesCodeDOM({
                    statements,
                    lazyStatements,
                    objectVarName: varname,
                    prefabSerializer: prefabSerializer,
                    unit: this._unit,
                    sceneFile: this._sceneFile
                });
            }

            return { statements, lazyStatements };
        }

        private addChildrenObjects(args: {
            obj: Container | Layer,
            createMethodDecl: MethodDeclCodeDOM,
            lazyStatements: CodeDOM[]
        }) {

            for (const child of args.obj.getChildren()) {

                args.createMethodDecl.getBody().push(new RawCodeDOM(""));
                args.createMethodDecl.getBody().push(new RawCodeDOM("// " + child.getEditorSupport().getLabel()));

                this.addCreateObjectCode(child, args.createMethodDecl, args.lazyStatements);
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

                const file = colibri.ui.ide.FileUtils.getFileFromPath(fileName);

                let fileUrl = parts.slice(1).join("/");

                if (file) {

                    fileUrl = pack.core.AssetPackUtils.getUrlFromAssetFile(file.getParent(), file);
                }

                call.argLiteral(key);
                call.argLiteral(fileUrl);

                preloadDom.getBody().push(call);
            }

            methods.push(preloadDom);
        }
    }
}