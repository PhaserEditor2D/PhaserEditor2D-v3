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
        private _fileNameMap: Map<string, io.FilePath>;

        constructor(scene: ui.Scene, file: io.FilePath) {

            this._scene = scene;
            this._sceneFile = file;
            this._isPrefabScene = this._scene.isPrefabSceneType();
            this._fileNameMap = new Map();
        }

        async build(): Promise<UnitCodeDOM> {

            colibri.ui.ide.Workbench.getWorkbench().getFileStorage().getRoot().visit(file => {

                if (file.isFile()) {

                    this._fileNameMap.set(file.getNameWithoutExtension(), file);
                }
            });

            const settings = this._scene.getSettings();

            const methods: MemberDeclCodeDOM[] = [];

            const unit = new UnitCodeDOM([]);

            this._unit = unit;

            if (settings.onlyGenerateMethods) {

                const createMethodDecl = this.buildCreateMethod();

                await this.buildPreloadMethod(unit.getBody() as any);

                unit.getBody().push(createMethodDecl);

            } else {

                const clsName = this.getClassName();
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

                } else {

                    const superClsFile = this._fileNameMap.get(superCls);

                    if (superClsFile) {

                        const filePath = code.getImportPath(this._sceneFile, superClsFile);

                        unit.addImport(superCls, filePath);
                    }
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
                this.buildPlainObjectsClassFields(fields);
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

            return unit;
        }

        private getClassName() {

            return this._sceneFile.getNameWithoutExtension();
        }

        buildPrefabPropertiesFields(fields: MemberDeclCodeDOM[]) {

            const decls = this._scene.getPrefabUserProperties()

                .getProperties()

                .filter(prop => !prop.isCustomDefinition())

                .flatMap(prop => prop.buildFieldDeclarationCode());

            fields.push(...decls);
        }

        private buildPlainObjectsClassFields(fields: MemberDeclCodeDOM[]) {

            for (const obj of this._scene.getPlainObjects()) {

                const editorSupport = obj.getEditorSupport();
                const scope = editorSupport.getScope();

                if (scope !== ui.sceneobjects.ObjectScope.METHOD) {

                    const objType = editorSupport.getPhaserType();

                    const dom = new FieldDeclCodeDOM(
                        formatToValidVarName(editorSupport.getLabel()),
                        objType,
                        scope === ui.sceneobjects.ObjectScope.PUBLIC);

                    dom.setAllowUndefined(!this._scene.isPrefabSceneType());

                    fields.push(dom);
                }
            }
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

                    dom.setAllowUndefined(!this._scene.isPrefabSceneType());

                    fields.push(dom);
                }
            }
        }

        private buildObjectClassFields(fields: MemberDeclCodeDOM[], children: ISceneGameObject[]) {

            for (const obj of children) {

                const objES = obj.getEditorSupport();
                const isMethodScope = objES.getScope() === ui.sceneobjects.ObjectScope.METHOD;
                const isPrefabObj = this._scene.isPrefabSceneType() && this._scene.getPrefabObject() === obj;
                const isPrefabScene = this._scene.isPrefabSceneType();

                if (!isMethodScope && !isPrefabObj) {

                    const varName = code.formatToValidVarName(objES.getLabel());

                    const explicitType = this.getExplicitType(obj);

                    const type = objES.isPrefabInstance()
                        ? objES.getPrefabName()
                        : (explicitType ? explicitType : objES.getPhaserType());

                    const isPublic = objES.isPublic();

                    const field = new FieldDeclCodeDOM(varName, type, isPublic);
                    // Allow undefined if the object is part of a scene.
                    // In a prefab, the objects are created in the constructor
                    field.setAllowUndefined(!isPrefabScene);

                    fields.push(field);
                }

                const children = this.getWalkingChildren(obj);

                if (children) {

                    this.buildObjectClassFields(fields, children);
                }
            }
        }

        private getWalkingChildren(obj: ISceneGameObject) {

            let children: ISceneGameObject[];

            if (obj instanceof Container || obj instanceof Layer) {

                const objES = obj.getEditorSupport();

                if (objES.isPrefabInstance()) {

                    if (objES.isPrefeabInstanceAppendedChild()) {

                        children = objES.getObjectChildren();

                    } else if (objES.isMutableNestedPrefabInstance()) {

                        children = objES.getMutableNestedPrefabChildren();

                    } else {

                        children = obj.getEditorSupport().getAppendedChildren();
                    }

                } else {

                    children = objES.getObjectChildren();
                }
            }

            return children;
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

            this.buildPrefabTypeScriptDefinitionsCodeDOM(prefabObj, objBuilder);

            ctrDecl.arg("scene", "Phaser.Scene");

            objBuilder.buildPrefabConstructorDeclarationCodeDOM({
                ctrDeclCodeDOM: ctrDecl,
                prefabObj
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

            if (prefabObj instanceof Container || prefabObj instanceof Layer) {

                this.addChildrenObjects({
                    createMethodDecl: ctrDecl,
                    obj: prefabObj,
                    lazyStatements
                });
            }

            this.addCreateAllPlainObjectCode(ctrDecl.getBody(), lazyStatements);

            this.addCreateListsCode(body);

            body.push(...lazyStatements);

            this.addFieldInitCode(body);

            {
                // prefab awake handler
                const settings = this._scene.getSettings();

                if (settings.generateAwakeHandler) {

                    body.push(new RawCodeDOM("// awake handler"));
                    body.push(new RawCodeDOM("this.scene.events.once(\"scene-awake\", () => this.awake());"));
                    body.push(new RawCodeDOM(""));
                }
            }

            body.push(new RawCodeDOM(""));
            body.push(new UserSectionCodeDOM("/* START-USER-CTR-CODE */", "/* END-USER-CTR-CODE */", "\n\t\t// Write your code here.\n\t\t"))

            this.buildCustomPropertiesInit(body);

            return ctrDecl;
        }

        private buildPrefabTypeScriptDefinitionsCodeDOM(prefabObj: ISceneGameObject, objBuilder: ui.sceneobjects.GameObjectCodeDOMBuilder) {

            for (const comp of prefabObj.getEditorSupport().getActiveComponents()) {

                comp.buildPrefabTypeScriptDefinitionsCodeDOM({
                    unit: this._unit,
                    prefabObj,
                    clsName: this.getClassName()
                });
            }

            const settings = this._scene.getSettings();

            for (const iface of this._unit.getTypeScriptInterfaces()) {

                iface.setExportInterface(settings.exportClass);
            }
        }

        private buildCustomPropertiesInit(body: code.CodeDOM[]) {

            const userProps = this._scene.getPrefabUserProperties();

            const assignDomList = userProps.getProperties()

                .filter(prop => prop.isCustomDefinition())

                .map(prop => {

                    const fieldDecl = prop.buildFieldDeclarationCode();

                    const assignDom = new code.AssignPropertyCodeDOM(fieldDecl.getName(), "this");
                    assignDom.value(fieldDecl.getInitialValueExpr());

                    return assignDom;
                });

            if (assignDomList.length > 0) {

                body.push(new code.RawCodeDOM("\n"));
                body.push(new code.RawCodeDOM("// custom definition props"));
            }

            body.push(...assignDomList);
        }

        private buildCreateMethod() {

            const settings = this._scene.getSettings();

            const createMethodDecl = new MethodDeclCodeDOM(settings.createMethodName);
            createMethodDecl.setReturnType("void");

            if (settings.onlyGenerateMethods && this._scene.isPrefabSceneType()) {

                createMethodDecl.arg("scene", "Phaser.Scene");
            }

            const body = createMethodDecl.getBody();
            const lazyStatements: CodeDOM[] = [];

            this.addCreateAllPlainObjectCode(body, lazyStatements);

            for (const obj of this._scene.getDisplayListChildren()) {

                if (obj.getEditorSupport().isMutableNestedPrefabInstance()) {

                    this.addCreateObjectCodeOfNestedPrefab(obj, createMethodDecl, lazyStatements);

                } else {

                    body.push(new RawCodeDOM(""));
                    body.push(new RawCodeDOM("// " + obj.getEditorSupport().getLabel()));

                    this.addCreateObjectCode(obj, createMethodDecl, lazyStatements);
                }
            }

            this.addCreateListsCode(body);

            body.push(...lazyStatements);

            this.addFieldInitCode(body);

            body.push(new RawCodeDOM(""));
            body.push(new RawCodeDOM(`this.events.emit("scene-awake");`));

            return createMethodDecl;
        }

        private addCreateAllPlainObjectCode(firstStatements: CodeDOM[], lazyStatements: CodeDOM[]) {

            for (const obj of this._scene.getPlainObjects()) {

                this.addCreatePlainObjectCode(obj, firstStatements, lazyStatements);
            }
        }

        private addCreatePlainObjectCode(
            obj: ui.sceneobjects.IScenePlainObject, firstStatements: CodeDOM[], lazyStatements: CodeDOM[]) {

            const objSupport = obj.getEditorSupport();

            const varname = formatToValidVarName(objSupport.getLabel());

            const result = objSupport.getExtension().buildCreateObjectWithFactoryCodeDOM({
                gameObjectFactoryExpr: this._scene.isPrefabSceneType() ? "scene" : "this",
                obj: obj,
                varname
            });

            const comments = [
                new RawCodeDOM(""),
                new RawCodeDOM("// " + obj.getEditorSupport().getLabel())
            ];

            if (result.firstStatements) {

                firstStatements.push(...comments);
                firstStatements.push(...result.firstStatements);
            }

            if (result.lazyStatements) {

                lazyStatements.push(...comments);
                lazyStatements.push(...result.lazyStatements);
            }

            const objectFactoryMethodCall = result.objectFactoryMethodCall;

            // methodCall.setDeclareReturnToVar(true);

            if (!objSupport.isMethodScope()) {

                objectFactoryMethodCall.setDeclareReturnToVar(true);
                objectFactoryMethodCall.setDeclareReturnToField(true);
            }

            if (objectFactoryMethodCall.isDeclareReturnToVar()) {

                objectFactoryMethodCall.setReturnToVar(varname);
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

                let dom: RawCodeDOM;
                const isTsOutput = this._scene.getSettings().compilerOutputLanguage === "TYPE_SCRIPT";

                if (isTsOutput && objectVarnames.length === 0) {

                    dom = new RawCodeDOM(`const ${varname}: Array<any> = [${objectVarnames.join(", ")}];`);

                } else {

                    dom = new RawCodeDOM(`const ${varname} = [${objectVarnames.join(", ")}];`);
                }

                body.push(dom);
            }
        }

        private addFieldInitCode_GameObjects(fields: CodeDOM[], prefabObj: ISceneGameObject, children: ISceneGameObject[]) {

            for (const obj of children) {

                const objES = obj.getEditorSupport();

                if (!objES.isMethodScope() && prefabObj !== obj) {

                    const varname = formatToValidVarName(objES.getLabel());

                    const dom = new AssignPropertyCodeDOM(varname, "this");
                    dom.value(varname);

                    fields.push(dom);
                }

                const walkingChildren = this.getWalkingChildren(obj);

                if (walkingChildren) {

                    this.addFieldInitCode_GameObjects(fields, prefabObj, walkingChildren);
                }
            }
        }

        private addFieldInitCode(body: CodeDOM[]) {

            const fields: CodeDOM[] = [];

            const prefabObj = this._scene.isPrefabSceneType() ? this._scene.getPrefabObject() : null;

            this.addFieldInitCode_GameObjects(fields, prefabObj, this._scene.getDisplayListChildren());

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

        private addCreateObjectCodeOfNestedPrefab(obj: ISceneGameObject, createMethodDecl: MethodDeclCodeDOM, lazyStatements: CodeDOM[]) {

            const varname = this.getPrefabInstanceVarName(obj);

            const result = this.buildSetObjectProperties({
                obj,
                varname
            });

            lazyStatements.push(...result.lazyStatements);

            createMethodDecl.getBody().push(...result.statements);

            if (obj instanceof Container || obj instanceof Layer) {

                this.addChildrenObjects({
                    createMethodDecl,
                    obj,
                    lazyStatements
                });
            }
        }

        private addCreateObjectCode(obj: ISceneGameObject, createMethodDecl: MethodDeclCodeDOM, lazyStatements: CodeDOM[]) {

            const objES = obj.getEditorSupport();

            let createObjectMethodCall: MethodCallCodeDOM;

            const objParent = objES.getObjectParent();
            let parentVarName: string;

            if (objParent) {

                const parentIsPrefabObject = this._scene.isPrefabSceneType()
                    && objParent === this._scene.getPrefabObject();

                parentVarName = parentIsPrefabObject ? "this"
                    : this.getPrefabInstanceVarName(objParent);
            }

            if (objES.isPrefabInstance()) {

                const clsName = objES.getPrefabName();

                const type = objES.getObjectType();

                const ext = ScenePlugin.getInstance().getGameObjectExtensionByObjectType(type);

                createObjectMethodCall = new code.MethodCallCodeDOM(clsName);
                createObjectMethodCall.setConstructor(true);

                const prefabSerializer = objES.getPrefabSerializer();

                if (prefabSerializer) {

                    const builder = ext.getCodeDOMBuilder();

                    builder.buildCreatePrefabInstanceCodeDOM({
                        obj,
                        methodCallDOM: createObjectMethodCall,
                        sceneExpr: this._isPrefabScene ? "scene" : "this",
                        parentVarName,
                        prefabSerializer
                    });

                    const filePath = code.getImportPath(this._sceneFile, objES.getPrefabFile());
                    this._unit.addImport(clsName, filePath);

                } else {

                    throw new Error(`Cannot find prefab with id ${objES.getPrefabId()}.`);
                }

            } else {

                const builder = objES.getExtension().getCodeDOMBuilder();

                const factoryVarName = builder.getChainToFactory();
                const sceneVarName = this._scene.isPrefabSceneType() ? `scene` : `this`;
                createObjectMethodCall = builder.buildCreateObjectWithFactoryCodeDOM({
                    gameObjectFactoryExpr: `${sceneVarName}.${factoryVarName}`,
                    sceneExpr: sceneVarName,
                    parentVarName, 
                    obj: obj
                });

                // for example, in case it is adding a ScriptNode to a scene
                if (createObjectMethodCall.isConstructor()) {

                    const clsName = createObjectMethodCall.getMethodName();

                    const clsFile = this._fileNameMap.get(clsName);

                    if (clsFile) {

                        const filePath = code.getImportPath(this._sceneFile, clsFile);

                        this._unit.addImport(clsName, filePath);
                    }
                }

                const forcingType = this.getExplicitType(obj);

                createObjectMethodCall.setExplicitType(forcingType);
            }

            const varname = formatToValidVarName(objES.getLabel());

            createMethodDecl.getBody().push(createObjectMethodCall);

            // script nodes are not added to the scene this way
            if (objES.isPrefabInstance() && objES.isDisplayObject()) {

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

            // the script nodes are not added to the parent this way
            if (objParent && objES.isDisplayObject()) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                const addToParentCall = new MethodCallCodeDOM("add", parentVarName);

                addToParentCall.arg(varname);

                createMethodDecl.getBody().push(addToParentCall);
            }

            if (obj instanceof Container || obj instanceof Layer) {

                createObjectMethodCall.setDeclareReturnToVar(true);

                this.addChildrenObjects({
                    createMethodDecl,
                    obj,
                    lazyStatements
                });
            }

            {
                const lists = objES.getScene().getObjectLists().getListsByObjectId(objES.getId());

                if (lists.length > 0) {

                    createObjectMethodCall.setDeclareReturnToVar(true);
                }
            }

            if (!objES.isMethodScope()) {

                createObjectMethodCall.setDeclareReturnToVar(true);
                createObjectMethodCall.setDeclareReturnToField(true);
            }

            if (createObjectMethodCall.isDeclareReturnToVar()) {

                createObjectMethodCall.setReturnToVar(varname);
            }
        }

        getExplicitType(obj: ISceneGameObject) {

            const objES = obj.getEditorSupport();

            return objES.getActiveComponents()

                .map(comp => comp.getExplicitTypesForMethodFactory())

                .filter(type => type !== undefined)

                .join(" & ");
        }

        private getPrefabInstanceVarName(obj: ISceneGameObject) {

            const objSupport = obj.getEditorSupport();

            if (objSupport.isScenePrefabObject()) {

                return "this";
            }

            const varName = formatToValidVarName(objSupport.getLabel());

            if (objSupport.isNestedPrefabInstance()) {

                const parent = this.findPrefabInstanceThatIsDefinedAsRootPrefab(obj);

                const parentVarName = this.getPrefabInstanceVarName(parent);

                return parentVarName + "." + varName;
            }

            return varName;
        }

        private findPrefabInstanceThatIsDefinedAsRootPrefab(obj: ui.sceneobjects.ISceneGameObject): ui.sceneobjects.ISceneGameObject {

            const parent = obj.getEditorSupport().getObjectParent();

            if (parent.getEditorSupport().isRootPrefabDefined()) {

                return parent;
            }

            return this.findPrefabInstanceThatIsDefinedAsRootPrefab(parent);
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

            for (const comp of support.getActiveComponents()) {

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

            const objES = args.obj.getEditorSupport();
            const body = args.createMethodDecl.getBody();
            const parentIsPrefab = objES.isPrefabInstance();

            for (const child of objES.getObjectChildren()) {

                const childES = child.getEditorSupport();

                if (childES.isMutableNestedPrefabInstance()) {

                    this.addCreateObjectCodeOfNestedPrefab(child, args.createMethodDecl, args.lazyStatements);

                } else if (!parentIsPrefab || childES.isPrefeabInstanceAppendedChild()) {

                    body.push(new RawCodeDOM(""));
                    body.push(new RawCodeDOM("// " + childES.getLabel()));

                    this.addCreateObjectCode(child, args.createMethodDecl, args.lazyStatements);
                }
            }
        }

        private buildSceneConstructorMethod(sceneKey: string) {

            const methodDecl = new MethodDeclCodeDOM("constructor");

            const superCall = new MethodCallCodeDOM("super", null);

            superCall.argLiteral(sceneKey);

            const body = methodDecl.getBody();

            body.push(superCall);

            body.push(new RawCodeDOM(""));
            body.push(new UserSectionCodeDOM("/* START-USER-CTR-CODE */", "/* END-USER-CTR-CODE */", "\n\t\t// Write your code here.\n\t\t"))

            return methodDecl;
        }

        private async buildPreloadMethod(methods: MemberDeclCodeDOM[]) {

            const settings = this._scene.getSettings();

            if (settings.preloadPackFiles.length === 0) {

                return;
            }

            const preloadDom = new MethodDeclCodeDOM(settings.preloadMethodName);
            preloadDom.setReturnType("void");

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