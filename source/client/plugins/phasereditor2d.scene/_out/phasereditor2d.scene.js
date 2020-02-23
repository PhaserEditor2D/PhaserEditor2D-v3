var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        function PhaserHelp(key) {
            if (key === undefined) {
                return undefined;
            }
            const prefix = "phaser:";
            if (key.startsWith(prefix)) {
                return scene.ScenePlugin.getInstance().getPhaserDocs().getDoc(key.substring(prefix.length));
            }
            return key;
        }
        scene.PhaserHelp = PhaserHelp;
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_1) {
        var ide = colibri.ui.ide;
        var controls = colibri.ui.controls;
        scene_1.ICON_GROUP = "group";
        scene_1.ICON_TRANSLATE = "translate";
        scene_1.ICON_ANGLE = "angle";
        scene_1.ICON_SCALE = "scale";
        scene_1.ICON_ORIGIN = "origin";
        scene_1.ICON_BUILD = "build";
        scene_1.ICON_LOCKED = "locked";
        scene_1.ICON_UNLOCKED = "unlocked";
        scene_1.ICON_LIST = "list";
        class ScenePlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.scene");
                this._docs = new phasereditor2d.ide.core.PhaserDocs(this, "data/phaser-docs.json");
            }
            static getInstance() {
                return this._instance;
            }
            getPhaserDocs() {
                return this._docs;
            }
            registerExtensions(reg) {
                this._sceneFinder = new scene_1.core.json.SceneFinder();
                // preload project
                reg.addExtension(this._sceneFinder.getProjectPreloader(), 
                // tslint:disable-next-line:new-parens
                new (class extends ide.PreloadProjectResourcesExtension {
                    async computeTotal() {
                        return 0;
                    }
                    async preload() {
                        return ScenePlugin.getInstance().getPhaserDocs().preload();
                    }
                }));
                // content type resolvers
                reg.addExtension(new colibri.core.ContentTypeExtension([new scene_1.core.SceneContentTypeResolver()], 5));
                // content type renderer
                reg.addExtension(new phasereditor2d.files.ui.viewers.SimpleContentTypeCellRendererExtension(scene_1.core.CONTENT_TYPE_SCENE, new scene_1.ui.viewers.SceneFileCellRenderer()));
                // icons loader
                reg.addExtension(ide.IconLoaderExtension.withPluginFiles(this, [
                    scene_1.ICON_GROUP,
                    scene_1.ICON_ANGLE,
                    scene_1.ICON_ORIGIN,
                    scene_1.ICON_SCALE,
                    scene_1.ICON_TRANSLATE,
                    scene_1.ICON_BUILD,
                    scene_1.ICON_LOCKED,
                    scene_1.ICON_UNLOCKED,
                    scene_1.ICON_LIST
                ]));
                // loader updates
                reg.addExtension(new scene_1.ui.sceneobjects.ImageLoaderUpdater(), new scene_1.ui.sceneobjects.BitmapFontLoaderUpdater());
                // commands
                reg.addExtension(new ide.commands.CommandExtension(scene_1.ui.editor.commands.SceneEditorCommands.registerCommands));
                // main menu
                reg.addExtension(new controls.MenuExtension(phasereditor2d.ide.ui.DesignWindow.MENU_MAIN, {
                    command: scene_1.ui.editor.commands.CMD_COMPILE_ALL_SCENE_FILES
                }));
                reg.addExtension(new controls.MenuExtension(phasereditor2d.files.ui.views.FilesView.MENU_ID, {
                    command: scene_1.ui.editor.commands.CMD_COMPILE_ALL_SCENE_FILES
                }));
                // editors
                reg.addExtension(new ide.EditorExtension([
                    scene_1.ui.editor.SceneEditor.getFactory()
                ]));
                // new file wizards
                reg.addExtension(new scene_1.ui.dialogs.NewSceneFileDialogExtension(), new scene_1.ui.dialogs.NewPrefabFileDialogExtension());
                // file properties
                reg.addExtension(new phasereditor2d.files.ui.views.FilePropertySectionExtension(page => new scene_1.ui.SceneFileSection(page), page => new scene_1.ui.ManySceneFileSection(page)));
                // scene object extensions
                reg.addExtension(scene_1.ui.sceneobjects.ImageExtension.getInstance(), scene_1.ui.sceneobjects.SpriteExtension.getInstance(), scene_1.ui.sceneobjects.TileSpriteExtension.getInstance(), scene_1.ui.sceneobjects.TextExtension.getInstance(), scene_1.ui.sceneobjects.BitmapTextExtension.getInstance(), scene_1.ui.sceneobjects.ContainerExtension.getInstance());
                // property sections
                reg.addExtension(new scene_1.ui.editor.properties.SceneEditorPropertySectionExtension(page => new scene_1.ui.sceneobjects.GameObjectVariableSection(page), page => new scene_1.ui.sceneobjects.ListVariableSection(page), page => new scene_1.ui.sceneobjects.GameObjectListSection(page), page => new scene_1.ui.sceneobjects.ParentSection(page), page => new scene_1.ui.sceneobjects.ContainerSection(page), page => new scene_1.ui.sceneobjects.TransformSection(page), page => new scene_1.ui.sceneobjects.OriginSection(page), page => new scene_1.ui.sceneobjects.FlipSection(page), page => new scene_1.ui.sceneobjects.VisibleSection(page), page => new scene_1.ui.sceneobjects.AlphaSection(page), page => new scene_1.ui.sceneobjects.TileSpriteSection(page), page => new scene_1.ui.sceneobjects.TextureSection(page), page => new scene_1.ui.sceneobjects.TextContentSection(page), page => new scene_1.ui.sceneobjects.TextSection(page), page => new scene_1.ui.sceneobjects.BitmapTextSection(page), page => new scene_1.ui.sceneobjects.ListSection(page)));
                // scene tools
                reg.addExtension(new scene_1.ui.editor.tools.SceneToolExtension(new scene_1.ui.sceneobjects.TranslateTool(), new scene_1.ui.sceneobjects.RotateTool(), new scene_1.ui.sceneobjects.ScaleTool(), new scene_1.ui.sceneobjects.TileSpriteSizeTool()));
            }
            getDefaultSceneLanguage() {
                let typeScript = false;
                try {
                    const finder = ScenePlugin.getInstance().getSceneFinder();
                    const files = [...finder.getFiles()];
                    files.sort((a, b) => b.getModTime() - a.getModTime());
                    if (files.length > 0) {
                        const file = files[0];
                        const s = new scene_1.core.json.SceneSettings();
                        s.readJSON(finder.getSceneData(file).settings);
                        typeScript = s.compilerOutputLanguage === scene_1.core.json.SourceLang.TYPE_SCRIPT;
                    }
                }
                catch (e) {
                    console.error(e);
                }
                return typeScript ?
                    scene_1.core.json.SourceLang.TYPE_SCRIPT : scene_1.core.json.SourceLang.JAVA_SCRIPT;
            }
            getSceneFinder() {
                return this._sceneFinder;
            }
            getObjectExtensions() {
                return colibri.Platform
                    .getExtensions(scene_1.ui.sceneobjects.SceneObjectExtension.POINT_ID);
            }
            getObjectExtensionByObjectType(type) {
                return this.getObjectExtensions().find(ext => ext.getTypeName() === type);
            }
            getLoaderUpdaterForAsset(asset) {
                const exts = colibri.Platform
                    .getExtensions(scene_1.ui.sceneobjects.LoaderUpdaterExtension.POINT_ID);
                for (const ext of exts) {
                    if (ext.acceptAsset(asset)) {
                        return ext;
                    }
                }
                return null;
            }
            getLoaderUpdaters() {
                const exts = colibri.Platform
                    .getExtensions(scene_1.ui.sceneobjects.LoaderUpdaterExtension.POINT_ID);
                return exts;
            }
            async compileAll() {
                const files = this._sceneFinder.getFiles();
                const dlg = new controls.dialogs.ProgressDialog();
                dlg.create();
                dlg.setTitle("Compiling Scene Files");
                const monitor = new controls.dialogs.ProgressDialogMonitor(dlg);
                monitor.addTotal(files.length);
                for (const file of files) {
                    const data = this.getSceneFinder().getSceneData(file);
                    const scene = await scene_1.ui.OfflineScene.createScene(data);
                    const compiler = new scene_1.core.code.SceneCompiler(scene, file);
                    await compiler.compile();
                    scene.destroyGame();
                    monitor.step();
                }
                dlg.close();
            }
        }
        ScenePlugin._instance = new ScenePlugin();
        ScenePlugin.DEFAULT_CANVAS_CONTEXT = Phaser.CANVAS;
        ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT = Phaser.WEBGL;
        scene_1.ScenePlugin = ScenePlugin;
        colibri.Platform.addPlugin(ScenePlugin.getInstance());
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core_1) {
            var core = colibri.core;
            core_1.CONTENT_TYPE_SCENE = "phasereditor2d.core.scene.SceneContentType";
            class SceneContentTypeResolver extends core.ContentTypeResolver {
                constructor() {
                    super("phasereditor2d.scene.core.SceneContentTypeResolver");
                }
                async computeContentType(file) {
                    if (file.getExtension() === "scene") {
                        const content = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);
                        if (content !== null) {
                            try {
                                const data = JSON.parse(content);
                                if (data.meta.contentType === core_1.CONTENT_TYPE_SCENE) {
                                    return core_1.CONTENT_TYPE_SCENE;
                                }
                            }
                            catch (e) {
                                // nothing
                            }
                        }
                    }
                    return core.CONTENT_TYPE_ANY;
                }
            }
            core_1.SceneContentTypeResolver = SceneContentTypeResolver;
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class CodeDOM {
                    getOffset() {
                        return this._offset;
                    }
                    setOffset(offset) {
                        this._offset = offset;
                    }
                    static toHex(n) {
                        const hex = n.toString(16);
                        if (hex.length < 2) {
                            return "0" + hex;
                        }
                        return hex;
                    }
                    static quote(s) {
                        if (s === null || s === undefined || s.length === 0) {
                            return '""';
                        }
                        let b;
                        let c;
                        let i;
                        const len = s.length;
                        let result = '"';
                        for (i = 0; i < len; i += 1) {
                            b = c;
                            c = s.charAt(i);
                            switch (c) {
                                case "\\":
                                case '"':
                                    result += "\\";
                                    result += c;
                                    break;
                                case "/":
                                    if (b === "<") {
                                        result += "\\";
                                    }
                                    result += c;
                                    break;
                                case "\b":
                                    result += "\\b";
                                    break;
                                case "\t":
                                    result += "\\t";
                                    break;
                                case "\n":
                                    result += "\\n";
                                    break;
                                case "\f":
                                    result += "\\f";
                                    break;
                                case "\r":
                                    result += "\\r";
                                    break;
                                default:
                                    result += c;
                            }
                        }
                        result += '"';
                        return result;
                    }
                }
                code.CodeDOM = CodeDOM;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./CodeDOM.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class AssignPropertyCodeDOM extends code.CodeDOM {
                    constructor(propertyName, context) {
                        super();
                        this._propertyName = propertyName;
                        this._contextExpr = context;
                    }
                    value(expr) {
                        this._propertyValueExpr = expr;
                    }
                    valueLiteral(expr) {
                        this._propertyValueExpr = code.CodeDOM.quote(expr);
                    }
                    valueFloat(n) {
                        // tslint:disable-next-line:no-construct
                        this._propertyValueExpr = new Number(n).toString();
                    }
                    valueInt(n) {
                        // tslint:disable-next-line:no-construct
                        this._propertyValueExpr = new Number(Math.floor(n)).toString();
                    }
                    valueBool(b) {
                        // tslint:disable-next-line:no-construct
                        this._propertyValueExpr = new Boolean(b).toString();
                    }
                    getPropertyName() {
                        return this._propertyName;
                    }
                    getContextExpr() {
                        return this._contextExpr;
                    }
                    setContextExpr(contextExpr) {
                        this._contextExpr = contextExpr;
                    }
                    getPropertyValueExpr() {
                        return this._propertyValueExpr;
                    }
                    getPropertyType() {
                        return this._propertyType;
                    }
                    setPropertyType(propertyType) {
                        this._propertyType = propertyType;
                    }
                }
                code.AssignPropertyCodeDOM = AssignPropertyCodeDOM;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class BaseCodeGenerator {
                    constructor() {
                        this._text = "";
                        this._indent = 0;
                    }
                    getOffset() {
                        return this._text.length;
                    }
                    generate(replace) {
                        this._replace = (replace !== null && replace !== void 0 ? replace : "");
                        this.internalGenerate();
                        return this._text;
                    }
                    length() {
                        return this._text.length;
                    }
                    getStartSectionContent(endTag, defaultContent) {
                        const j = this._replace.indexOf(endTag);
                        const size = this._replace.length;
                        if (size > 0 && j !== -1) {
                            const section = this._replace.substring(0, j);
                            return section;
                        }
                        return defaultContent;
                    }
                    getSectionContent(openTag, closeTag, defaultContent) {
                        const i = this._replace.indexOf(openTag);
                        let j = this._replace.indexOf(closeTag);
                        if (j === -1) {
                            j = this._replace.length;
                        }
                        if (i !== -1 && j !== -1) {
                            const section = this._replace.substring(i + openTag.length, j);
                            return section;
                        }
                        return defaultContent;
                    }
                    getReplaceContent() {
                        return this._replace;
                    }
                    userCode(text) {
                        const lines = text.split("\n");
                        for (const line of lines) {
                            this.line(line);
                        }
                    }
                    sectionStart(endTag, defaultContent) {
                        this.append(this.getStartSectionContent(endTag, defaultContent));
                        this.append(endTag);
                    }
                    sectionEnd(openTag, defaultContent) {
                        this.append(openTag);
                        this.append(this.getSectionContent(openTag, "papa(--o^^o--)pig", defaultContent));
                    }
                    section(openTag, closeTag, defaultContent) {
                        const content = this.getSectionContent(openTag, closeTag, defaultContent);
                        this.append(openTag);
                        this.append(content);
                        this.append(closeTag);
                    }
                    cut(start, end) {
                        const str = this._text.substring(start, end);
                        const s1 = this._text.slice(0, start);
                        const s2 = this._text.slice(end, this._text.length);
                        this._text = s1 + s2;
                        // _sb.delete(start, end);
                        return str;
                    }
                    trim(run) {
                        const a = this.length();
                        run();
                        const b = this.length();
                        const str = this._text.substring(a, b);
                        if (str.trim().length === 0) {
                            this.cut(a, b);
                        }
                    }
                    append(str) {
                        this._text += str;
                    }
                    join(list) {
                        for (let i = 0; i < list.length; i++) {
                            if (i > 0) {
                                this.append(", ");
                            }
                            this.append(list[i]);
                        }
                    }
                    line(line = "") {
                        this.append(line);
                        this.append("\n");
                        this.append(this.getIndentTabs());
                    }
                    static escapeStringLiterals(str) {
                        return str.replace("\\", "\\\\").replace("\\R", "\n").replace("'", "\\'").replace("\"", "\\\"");
                    }
                    openIndent(line = "") {
                        this._indent++;
                        this.line(line);
                    }
                    closeIndent(str = "") {
                        this._indent--;
                        this.line();
                        this.line(str);
                    }
                    getIndentTabs() {
                        return "\t".repeat(this._indent);
                    }
                    static emptyStringToNull(str) {
                        return str == null ? null : (str.trim().length === 0 ? null : str);
                    }
                }
                code.BaseCodeGenerator = BaseCodeGenerator;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./CodeDOM.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class MemberDeclCodeDOM extends code.CodeDOM {
                    constructor(name) {
                        super();
                        this._name = name;
                    }
                    getName() {
                        return this._name;
                    }
                }
                code.MemberDeclCodeDOM = MemberDeclCodeDOM;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./MemberDeclCodeDOM.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class ClassDeclCodeDOM extends code.MemberDeclCodeDOM {
                    constructor(name) {
                        super(name);
                        this._body = [];
                    }
                    getConstructor() {
                        return this._constructor;
                    }
                    setConstructor(constructor) {
                        this._constructor = constructor;
                    }
                    getSuperClass() {
                        return this._superClass;
                    }
                    setSuperClass(superClass) {
                        this._superClass = superClass;
                    }
                    getBody() {
                        return this._body;
                    }
                }
                code.ClassDeclCodeDOM = ClassDeclCodeDOM;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                function isAlphaNumeric(c) {
                    const n = c.charCodeAt(0);
                    return (n > 47 && n < 58) // 0-9
                        || (n > 64 && n < 91) // a-z
                        || (n > 96 && n < 123); // A-Z
                }
                code.isAlphaNumeric = isAlphaNumeric;
                function formatToValidVarName(name) {
                    let s = "";
                    for (const c of name) {
                        if (isAlphaNumeric(c)) {
                            s += (s.length === 0 ? c.toLowerCase() : c);
                        }
                        else {
                            s += "_";
                        }
                    }
                    return s;
                }
                code.formatToValidVarName = formatToValidVarName;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class FieldDeclCodeDOM extends code.MemberDeclCodeDOM {
                    constructor(name, type, publicScope = false) {
                        super(name);
                        this._type = type;
                        this._publicScope = publicScope;
                    }
                    isPublic() {
                        return this._publicScope;
                    }
                    getType() {
                        return this._type;
                    }
                }
                code.FieldDeclCodeDOM = FieldDeclCodeDOM;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code_1) {
                class JavaScriptUnitCodeGenerator extends code_1.BaseCodeGenerator {
                    constructor(unit) {
                        super();
                        this._unit = unit;
                    }
                    internalGenerate() {
                        this.sectionStart("/* START OF COMPILED CODE */", "\n// You can write more code here\n\n");
                        this.line();
                        this.line();
                        for (const elem of this._unit.getBody()) {
                            this.generateUnitElement(elem);
                        }
                        this.sectionEnd("/* END OF COMPILED CODE */", "\n\n// You can write more code here\n");
                    }
                    generateUnitElement(elem) {
                        if (elem instanceof code_1.ClassDeclCodeDOM) {
                            this.generateClass(elem);
                        }
                        else if (elem instanceof code_1.MethodDeclCodeDOM) {
                            this.line();
                            this.generateMethodDecl(elem, true);
                            this.line();
                        }
                    }
                    generateClass(clsDecl) {
                        this.append("class " + clsDecl.getName() + " ");
                        if (clsDecl.getSuperClass() && clsDecl.getSuperClass().trim().length > 0) {
                            this.append("extends " + clsDecl.getSuperClass() + " ");
                        }
                        this.openIndent("{");
                        this.line();
                        for (const memberDecl of clsDecl.getBody()) {
                            this.generateMemberDecl(memberDecl);
                            this.line();
                        }
                        this.section("/* START-USER-CODE */", "\t/* END-USER-CODE */", "\n\n\t// Write your code here.\n\n");
                        this.closeIndent("}");
                        this.line();
                    }
                    generateMemberDecl(memberDecl) {
                        if (memberDecl instanceof code_1.MethodDeclCodeDOM) {
                            this.generateMethodDecl(memberDecl, false);
                        }
                        else if (memberDecl instanceof code_1.FieldDeclCodeDOM) {
                            this.generateFieldDecl(memberDecl);
                        }
                    }
                    generateFieldDecl(fieldDecl) {
                        this.append(`// ${fieldDecl.isPublic() ? "public" : "private"} `);
                        this.line(`${fieldDecl.getName()}: ${fieldDecl.getType()}`);
                    }
                    generateMethodDecl(methodDecl, isFunction) {
                        if (isFunction) {
                            this.append("function ");
                        }
                        this.append(methodDecl.getName() + "(");
                        this.generateMethodDeclArgs(methodDecl);
                        this.openIndent(") {");
                        for (const instr of methodDecl.getBody()) {
                            this.generateInstr(instr);
                        }
                        this.closeIndent("}");
                    }
                    generateMethodDeclArgs(methodDecl) {
                        this.append(methodDecl.getArgs()
                            .map(arg => arg.name)
                            .join(", "));
                    }
                    generateInstr(instr) {
                        instr.setOffset(this.getOffset());
                        if (instr instanceof code_1.RawCodeDOM) {
                            this.generateRawCode(instr);
                        }
                        else if (instr instanceof code_1.MethodCallCodeDOM) {
                            this.generateMethodCall(instr);
                        }
                        else if (instr instanceof code_1.AssignPropertyCodeDOM) {
                            this.generateAssignProperty(instr);
                        }
                    }
                    generateAssignProperty(assign) {
                        this.generateTypeAnnotation(assign);
                        if (assign.getContextExpr()) {
                            this.append(assign.getContextExpr());
                            this.append(".");
                        }
                        this.append(assign.getPropertyName());
                        this.append(" = ");
                        this.append(assign.getPropertyValueExpr());
                        this.append(";");
                        this.line();
                    }
                    generateTypeAnnotation(assign) {
                        const type = assign.getPropertyType();
                        if (type != null) {
                            this.line("/** @type {" + type + "} */");
                        }
                    }
                    generateMethodCall(call) {
                        if (call.getReturnToVar()) {
                            if (call.isDeclareReturnToVar()) {
                                this.append("const ");
                            }
                            this.append(call.getReturnToVar());
                            this.append(" = ");
                        }
                        if (call.isConstructor()) {
                            this.append("new ");
                        }
                        if (call.getContextExpr() && call.getContextExpr().length > 0) {
                            this.append(call.getContextExpr());
                            this.append(".");
                        }
                        this.append(call.getMethodName());
                        this.append("(");
                        const args = [...call.getArgs()];
                        while (args.length > 0 && args[args.length - 1] === "undefined") {
                            args.pop();
                        }
                        this.join(args);
                        this.line(");");
                    }
                    generateRawCode(raw) {
                        const code = raw.getCode();
                        const lines = code.split("\\R");
                        for (const line of lines) {
                            this.line(line);
                        }
                    }
                }
                code_1.JavaScriptUnitCodeGenerator = JavaScriptUnitCodeGenerator;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class MethodCallCodeDOM extends code.CodeDOM {
                    constructor(methodName, contextExpr = "") {
                        super();
                        this._methodName = methodName;
                        this._contextExpr = contextExpr;
                        this._args = [];
                        this._declareReturnToVar = false;
                        this._isConstructor = false;
                        this._declareReturnToField = false;
                    }
                    isConstructor() {
                        return this._isConstructor;
                    }
                    setConstructor(isConstructor) {
                        this._isConstructor = isConstructor;
                    }
                    getReturnToVar() {
                        return this._returnToVar;
                    }
                    setReturnToVar(returnToVar) {
                        this._returnToVar = returnToVar;
                    }
                    setDeclareReturnToVar(declareReturnToVar) {
                        this._declareReturnToVar = declareReturnToVar;
                    }
                    isDeclareReturnToVar() {
                        return this._declareReturnToVar;
                    }
                    setDeclareReturnToField(declareReturnToField) {
                        this._declareReturnToField = declareReturnToField;
                    }
                    isDeclareReturnToField() {
                        return this._declareReturnToField;
                    }
                    arg(expr) {
                        this._args.push(expr);
                    }
                    argStringOrFloat(expr) {
                        switch (typeof expr) {
                            case "string":
                                this.argLiteral(expr);
                                break;
                            case "number":
                                this.argFloat(expr);
                                break;
                        }
                    }
                    argStringOrInt(expr) {
                        switch (typeof expr) {
                            case "string":
                                this.argLiteral(expr);
                                break;
                            case "number":
                                this.argInt(expr);
                                break;
                        }
                    }
                    argLiteral(expr) {
                        this._args.push(code.CodeDOM.quote(expr));
                    }
                    argFloat(n) {
                        this._args.push(n + "");
                    }
                    argInt(n) {
                        this._args.push(Math.floor(n) + "");
                    }
                    getMethodName() {
                        return this._methodName;
                    }
                    setMethodName(methodName) {
                        this._methodName = methodName;
                    }
                    getContextExpr() {
                        return this._contextExpr;
                    }
                    getArgs() {
                        return this._args;
                    }
                }
                code.MethodCallCodeDOM = MethodCallCodeDOM;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class MethodDeclCodeDOM extends code.MemberDeclCodeDOM {
                    constructor(name) {
                        super(name);
                        this._args = [];
                        this._body = [];
                    }
                    arg(name, type, optional = false) {
                        this._args.push({
                            name, type, optional
                        });
                    }
                    getArgs() {
                        return this._args;
                    }
                    getBody() {
                        return this._body;
                    }
                    setBody(body) {
                        this._body = body;
                    }
                }
                code.MethodDeclCodeDOM = MethodDeclCodeDOM;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code_2) {
                class RawCodeDOM extends code_2.CodeDOM {
                    constructor(code) {
                        super();
                        this._code = code;
                    }
                    static many(...codes) {
                        return codes.map(code => new RawCodeDOM(code));
                    }
                    getCode() {
                        return this._code;
                    }
                }
                code_2.RawCodeDOM = RawCodeDOM;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_2) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class SceneCodeDOMBuilder {
                    constructor(scene, file) {
                        this._scene = scene;
                        this._file = file;
                        this._isPrefabScene = this._scene.isPrefabSceneType();
                    }
                    async build() {
                        const settings = this._scene.getSettings();
                        const methods = [];
                        if (!this._isPrefabScene) {
                            if (settings.preloadPackFiles.length > 0) {
                                const preloadDom = await this.buildPreloadMethod();
                                methods.push(preloadDom);
                            }
                        }
                        const unit = new code.UnitCodeDOM([]);
                        if (settings.onlyGenerateMethods) {
                            const createMethodDecl = this.buildCreateMethod();
                            unit.getBody().push(createMethodDecl);
                        }
                        else {
                            const clsName = this._file.getNameWithoutExtension();
                            const clsDecl = new code.ClassDeclCodeDOM(clsName);
                            let superCls;
                            if (this._isPrefabScene) {
                                const obj = this._scene.getPrefabObject();
                                if (!obj) {
                                    return null;
                                }
                                const support = obj.getEditorSupport();
                                if (obj.getEditorSupport().isPrefabInstance()) {
                                    superCls = support.getPrefabName();
                                }
                                else {
                                    superCls = support.getPhaserType();
                                }
                                superCls = settings.superClassName.trim().length === 0 ?
                                    superCls : settings.superClassName;
                            }
                            else {
                                superCls = settings.superClassName.trim().length === 0 ?
                                    "Phaser.Scene" : settings.superClassName;
                            }
                            clsDecl.setSuperClass(superCls);
                            if (this._isPrefabScene) {
                                // prefab constructor
                                const ctrMethod = this.buildPrefabConstructorMethod();
                                methods.push(ctrMethod);
                            }
                            else {
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
                            const fields = [];
                            this.buildObjectClassFields(fields, this._scene.getDisplayListChildren());
                            this.buildListClassFields(fields);
                            clsDecl.getBody().push(...methods);
                            clsDecl.getBody().push(...fields);
                            unit.getBody().push(clsDecl);
                        }
                        return unit;
                    }
                    buildListClassFields(fields) {
                        for (const list of this._scene.getObjectLists().getLists()) {
                            if (list.getScope() !== scene_2.ui.sceneobjects.ObjectScope.METHOD) {
                                const dom = new code.FieldDeclCodeDOM(code.formatToValidVarName(list.getLabel()), "any[]", list.getScope() === scene_2.ui.sceneobjects.ObjectScope.PUBLIC);
                                fields.push(dom);
                            }
                        }
                    }
                    buildObjectClassFields(fields, children) {
                        for (const obj of children) {
                            const support = obj.getEditorSupport();
                            const scope = support.getScope();
                            if (scope !== scene_2.ui.sceneobjects.ObjectScope.METHOD) {
                                const varName = code.formatToValidVarName(support.getLabel());
                                const type = support.isPrefabInstance()
                                    ? support.getPrefabName()
                                    : support.getPhaserType();
                                const isPublic = support.getScope() === scene_2.ui.sceneobjects.ObjectScope.PUBLIC;
                                const field = new code.FieldDeclCodeDOM(varName, type, isPublic);
                                fields.push(field);
                            }
                            if (obj instanceof scene_2.ui.sceneobjects.Container
                                && !obj.getEditorSupport().isPrefabInstance()) {
                                this.buildObjectClassFields(fields, obj.list);
                            }
                        }
                    }
                    buildPrefabConstructorMethod() {
                        const settings = this._scene.getSettings();
                        const ctrDecl = new code.MethodDeclCodeDOM("constructor");
                        const prefabObj = this._scene.getPrefabObject();
                        if (!prefabObj) {
                            throw new Error("Invalid prefab scene state: missing object.");
                        }
                        const type = prefabObj.getEditorSupport().getObjectType();
                        const ext = scene_2.ScenePlugin.getInstance().getObjectExtensionByObjectType(type);
                        const objBuilder = ext.getCodeDOMBuilder();
                        ctrDecl.arg("scene", "Phaser.Scene");
                        objBuilder.buildPrefabConstructorDeclarationCodeDOM({
                            ctrDeclCodeDOM: ctrDecl
                        });
                        {
                            const superCall = new code.MethodCallCodeDOM("super");
                            superCall.arg("scene");
                            objBuilder.buildPrefabConstructorDeclarationSupperCallCodeDOM({
                                superMethodCallCodeDOM: superCall,
                                prefabObj: prefabObj
                            });
                            ctrDecl.getBody().push(superCall);
                            ctrDecl.getBody().push(new code.RawCodeDOM(""));
                        }
                        const setPropsCodeList = this.buildSetObjectProperties({
                            obj: prefabObj,
                            varname: "this"
                        });
                        ctrDecl.getBody().push(...setPropsCodeList);
                        if (prefabObj instanceof scene_2.ui.sceneobjects.Container && !prefabObj.getEditorSupport().isPrefabInstance()) {
                            this.addChildrenObjects({
                                createMethodDecl: ctrDecl,
                                obj: prefabObj
                            });
                        }
                        this.addFieldInitCode(ctrDecl.getBody());
                        {
                            const createName = settings.createMethodName;
                            if (createName) {
                                const body = ctrDecl.getBody();
                                if (body.length > 1) {
                                    body.push(new code.RawCodeDOM(""));
                                }
                                body.push(new code.MethodCallCodeDOM(createName, "this"));
                            }
                        }
                        return ctrDecl;
                    }
                    buildCreateMethod() {
                        const settings = this._scene.getSettings();
                        const createMethodDecl = new code.MethodDeclCodeDOM(settings.createMethodName);
                        if (settings.onlyGenerateMethods && settings.sceneType === core.json.SceneType.PREFAB) {
                            createMethodDecl.arg("scene", "Phaser.Scene");
                        }
                        const body = createMethodDecl.getBody();
                        for (const obj of this._scene.getDisplayListChildren()) {
                            body.push(new code.RawCodeDOM(""));
                            body.push(new code.RawCodeDOM("// " + obj.getEditorSupport().getLabel()));
                            this.addCreateObjectCode(obj, createMethodDecl);
                        }
                        this.addFieldInitCode(body);
                        return createMethodDecl;
                    }
                    addFieldInitCode(body) {
                        const fields = [];
                        this._scene.visitAskChildren(obj => {
                            const support = obj.getEditorSupport();
                            if (!support.isMethodScope()) {
                                const varname = code.formatToValidVarName(support.getLabel());
                                const dom = new code.AssignPropertyCodeDOM(varname, "this");
                                dom.value(varname);
                                fields.push(dom);
                            }
                            return !support.isPrefabInstance();
                        });
                        for (const list of this._scene.getObjectLists().getLists()) {
                            if (list.getScope() !== scene_2.ui.sceneobjects.ObjectScope.METHOD) {
                                const map = this._scene.buildObjectIdMap();
                                const objectVarnames = [];
                                for (const objId of list.getObjectIds()) {
                                    const obj = map.get(objId);
                                    if (obj) {
                                        objectVarnames.push(code.formatToValidVarName(obj.getEditorSupport().getLabel()));
                                    }
                                }
                                const varname = code.formatToValidVarName(list.getLabel());
                                const dom = new code.AssignPropertyCodeDOM(varname, "this");
                                dom.value("[" + objectVarnames.join(", ") + "]");
                                fields.push(dom);
                            }
                        }
                        if (fields.length > 0) {
                            body.push(new code.RawCodeDOM(""));
                            body.push(new code.RawCodeDOM("// fields"));
                            body.push(...fields);
                        }
                    }
                    addCreateObjectCode(obj, createMethodDecl) {
                        const objSupport = obj.getEditorSupport();
                        let createObjectMethodCall;
                        if (objSupport.isPrefabInstance()) {
                            const clsName = objSupport.getPrefabName();
                            const type = objSupport.getObjectType();
                            const ext = scene_2.ScenePlugin.getInstance().getObjectExtensionByObjectType(type);
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
                            }
                            else {
                                throw new Error(`Cannot find prefab with id ${objSupport.getPrefabId()}.`);
                            }
                        }
                        else {
                            const builder = objSupport.getExtension().getCodeDOMBuilder();
                            createObjectMethodCall = builder.buildCreateObjectWithFactoryCodeDOM({
                                gameObjectFactoryExpr: this._scene.isPrefabSceneType() ? "scene.add" : "this.add",
                                obj: obj
                            });
                        }
                        const varname = code.formatToValidVarName(objSupport.getLabel());
                        createMethodDecl.getBody().push(createObjectMethodCall);
                        if (objSupport.isPrefabInstance()) {
                            createObjectMethodCall.setDeclareReturnToVar(true);
                            if (!obj.parentContainer) {
                                const addToScene = new code.MethodCallCodeDOM("existing", "this.add");
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
                            const container = obj.parentContainer;
                            const parentIsPrefabObject = this._scene.isPrefabSceneType()
                                && obj.parentContainer === this._scene.getPrefabObject();
                            const containerVarname = parentIsPrefabObject ? "this"
                                : code.formatToValidVarName(container.getEditorSupport().getLabel());
                            const addToContainerCall = new code.MethodCallCodeDOM("add", containerVarname);
                            addToContainerCall.arg(varname);
                            createMethodDecl.getBody().push(addToContainerCall);
                        }
                        if (obj instanceof scene_2.ui.sceneobjects.Container && !objSupport.isPrefabInstance()) {
                            createObjectMethodCall.setDeclareReturnToVar(true);
                            this.addChildrenObjects({
                                createMethodDecl,
                                obj: obj
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
                    buildSetObjectProperties(args) {
                        const obj = args.obj;
                        const support = obj.getEditorSupport();
                        const varname = args.varname;
                        let prefabSerializer = null;
                        if (support.isPrefabInstance()) {
                            prefabSerializer = support.getPrefabSerializer();
                        }
                        const setPropsInstructions = [];
                        for (const comp of support.getComponents()) {
                            comp.buildSetObjectPropertiesCodeDOM({
                                result: setPropsInstructions,
                                objectVarName: varname,
                                prefabSerializer: prefabSerializer
                            });
                        }
                        return setPropsInstructions;
                    }
                    addChildrenObjects(args) {
                        for (const child of args.obj.list) {
                            args.createMethodDecl.getBody().push(new code.RawCodeDOM(""));
                            args.createMethodDecl.getBody().push(new code.RawCodeDOM("// " + child.getEditorSupport().getLabel()));
                            this.addCreateObjectCode(child, args.createMethodDecl);
                        }
                    }
                    buildSceneConstructorMethod(sceneKey) {
                        const methodDecl = new code.MethodDeclCodeDOM("constructor");
                        const superCall = new code.MethodCallCodeDOM("super", null);
                        superCall.argLiteral(sceneKey);
                        methodDecl.getBody().push(superCall);
                        return methodDecl;
                    }
                    async buildPreloadMethod() {
                        const settings = this._scene.getSettings();
                        const preloadDom = new code.MethodDeclCodeDOM(settings.preloadMethodName);
                        preloadDom.getBody().push(new code.RawCodeDOM(""));
                        const ctx = (this._isPrefabScene ? "scene" : "this");
                        for (const fileName of settings.preloadPackFiles) {
                            const call = new code.MethodCallCodeDOM("pack", ctx + ".load");
                            const parts = fileName.split("/");
                            const namePart = parts[parts.length - 1];
                            const key = namePart.substring(0, namePart.length - 5);
                            const relativeName = parts.slice(1).join("/");
                            call.argLiteral(key);
                            call.argLiteral(relativeName);
                            preloadDom.getBody().push(call);
                        }
                        return preloadDom;
                    }
                }
                code.SceneCodeDOMBuilder = SceneCodeDOMBuilder;
            })(code = core.code || (core.code = {}));
        })(core = scene_2.core || (scene_2.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_3) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                var ide = colibri.ui.ide;
                class SceneCompiler {
                    constructor(scene, sceneFile) {
                        this._scene = scene;
                        this._sceneFile = sceneFile;
                    }
                    async compile() {
                        const compileToJS = this._scene.getSettings()
                            .compilerOutputLanguage === core.json.SourceLang.JAVA_SCRIPT;
                        const builder = new core.code.SceneCodeDOMBuilder(this._scene, this._sceneFile);
                        const unit = await builder.build();
                        if (!unit) {
                            return;
                        }
                        const generator = compileToJS ?
                            new core.code.JavaScriptUnitCodeGenerator(unit)
                            : new core.code.TypeScriptUnitCodeGenerator(unit);
                        const fileExt = compileToJS ? "js" : "ts";
                        const fileName = this._sceneFile.getNameWithoutExtension() + "." + fileExt;
                        let replaceContent = "";
                        {
                            const outputFile = this._sceneFile.getSibling(fileName);
                            if (outputFile) {
                                replaceContent = await ide.FileUtils.getFileStorage().getFileString(outputFile);
                            }
                        }
                        const output = generator.generate(replaceContent);
                        await ide.FileUtils.createFile_async(this._sceneFile.getParent(), fileName, output);
                    }
                }
                code.SceneCompiler = SceneCompiler;
            })(code = core.code || (core.code = {}));
        })(core = scene_3.core || (scene_3.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class TypeScriptUnitCodeGenerator extends code.JavaScriptUnitCodeGenerator {
                    constructor(unit) {
                        super(unit);
                    }
                    generateFieldDecl(fieldDecl) {
                        const mod = fieldDecl.isPublic() ? "public" : "private";
                        this.line(`${mod} ${fieldDecl.getName()}: ${fieldDecl.getType()};`);
                    }
                    generateTypeAnnotation(assign) {
                        // do nothing, in TypeScript uses the var declaration syntax
                    }
                    generateMethodDeclArgs(methodDecl) {
                        this.append(methodDecl.getArgs()
                            .map(arg => `${arg.name}${arg.optional ? "?" : ""}: ${arg.type}`)
                            .join(", "));
                    }
                }
                code.TypeScriptUnitCodeGenerator = TypeScriptUnitCodeGenerator;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class UnitCodeDOM {
                    constructor(elements) {
                        this._body = elements;
                    }
                    getBody() {
                        return this._body;
                    }
                    setBody(body) {
                        this._body = body;
                    }
                }
                code.UnitCodeDOM = UnitCodeDOM;
            })(code = core.code || (core.code = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var json;
            (function (json) {
                let SceneType;
                (function (SceneType) {
                    SceneType["SCENE"] = "SCENE";
                    SceneType["PREFAB"] = "PREFAB";
                })(SceneType = json.SceneType || (json.SceneType = {}));
            })(json = core.json || (core.json = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var json;
            (function (json) {
                var FileUtils = colibri.ui.ide.FileUtils;
                var controls = colibri.ui.controls;
                class SceneFinderPreloader extends colibri.ui.ide.PreloadProjectResourcesExtension {
                    constructor(finder) {
                        super();
                        this._finder = finder;
                    }
                    async computeTotal() {
                        const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);
                        return files.length;
                    }
                    preload(monitor) {
                        return this._finder.preload(monitor);
                    }
                }
                class SceneFinder {
                    constructor() {
                        this._dataMap = new Map();
                        this._sceneDataMap = new Map();
                        this._fileMap = new Map();
                        this._files = [];
                        this._prefabFiles = [];
                        colibri.ui.ide.FileUtils.getFileStorage().addChangeListener(async (e) => {
                            await this.handleStorageChange(e);
                        });
                    }
                    async handleStorageChange(change) {
                        const test = (names) => {
                            for (const name of names) {
                                if (name.endsWith(".scene")) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        if (test(change.getAddRecords())
                            || test(change.getModifiedRecords())
                            || test(change.getDeleteRecords())
                            || test(change.getRenameFromRecords())
                            || test(change.getRenameToRecords())) {
                            await this.preload(controls.EMPTY_PROGRESS_MONITOR);
                        }
                    }
                    getProjectPreloader() {
                        return new SceneFinderPreloader(this);
                    }
                    async preload(monitor) {
                        const dataMap = new Map();
                        const sceneDataMap = new Map();
                        const fileMap = new Map();
                        const sceneFiles = [];
                        const prefabFiles = [];
                        const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);
                        for (const file of files) {
                            const content = await FileUtils.preloadAndGetFileString(file);
                            try {
                                const data = JSON.parse(content);
                                sceneDataMap.set(file.getFullName(), data);
                                if (data.id) {
                                    if (data.displayList.length > 0) {
                                        const objData = data.displayList[data.displayList.length - 1];
                                        dataMap.set(data.id, objData);
                                        fileMap.set(data.id, file);
                                    }
                                    if (data.sceneType === json.SceneType.PREFAB) {
                                        prefabFiles.push(file);
                                    }
                                }
                                sceneFiles.push(file);
                            }
                            catch (e) {
                                console.error(`SceneDataTable: parsing file ${file.getFullName()}. Error: ${e.message}`);
                            }
                            monitor.step();
                        }
                        this._dataMap = dataMap;
                        this._sceneDataMap = sceneDataMap;
                        this._fileMap = fileMap;
                        this._files = sceneFiles;
                        this._prefabFiles = prefabFiles;
                    }
                    getPrefabId(file) {
                        const data = this.getSceneData(file);
                        if (data) {
                            if (data.sceneType === json.SceneType.PREFAB) {
                                return data.id;
                            }
                        }
                        return null;
                    }
                    getFiles() {
                        return this._files;
                    }
                    getPrefabFiles() {
                        return this._prefabFiles;
                    }
                    getPrefabData(prefabId) {
                        return this._dataMap.get(prefabId);
                    }
                    getPrefabFile(prefabId) {
                        return this._fileMap.get(prefabId);
                    }
                    getSceneData(file) {
                        return this._sceneDataMap.get(file.getFullName());
                    }
                    getAllSceneData() {
                        return this.getFiles().map(file => this.getSceneData(file));
                    }
                }
                json.SceneFinder = SceneFinder;
            })(json = core.json || (core.json = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var json;
            (function (json) {
                var read = colibri.core.json.read;
                var write = colibri.core.json.write;
                let SourceLang;
                (function (SourceLang) {
                    SourceLang["JAVA_SCRIPT"] = "JAVA_SCRIPT";
                    SourceLang["TYPE_SCRIPT"] = "TYPE_SCRIPT";
                })(SourceLang = json.SourceLang || (json.SourceLang = {}));
                class SceneSettings {
                    constructor(sceneType = json.SceneType.SCENE, snapEnabled = false, snapWidth = 16, snapHeight = 16, onlyGenerateMethods = false, superClassName = "", preloadMethodName = "preload", preloadPackFiles = [], createMethodName = "create", sceneKey = "", compilerOutputLanguage = SourceLang.JAVA_SCRIPT, scopeBlocksToFolder = false, borderX = 0, borderY = 0, borderWidth = 800, borderHeight = 600) {
                        this.sceneType = sceneType;
                        this.snapEnabled = snapEnabled;
                        this.snapWidth = snapWidth;
                        this.snapHeight = snapHeight;
                        this.onlyGenerateMethods = onlyGenerateMethods;
                        this.superClassName = superClassName;
                        this.preloadMethodName = preloadMethodName;
                        this.preloadPackFiles = preloadPackFiles;
                        this.createMethodName = createMethodName;
                        this.sceneKey = sceneKey;
                        this.compilerOutputLanguage = compilerOutputLanguage;
                        this.scopeBlocksToFolder = scopeBlocksToFolder;
                        this.borderX = borderX;
                        this.borderY = borderY;
                        this.borderWidth = borderWidth;
                        this.borderHeight = borderHeight;
                    }
                    toJSON() {
                        const data = {};
                        write(data, "sceneType", this.sceneType, json.SceneType.SCENE);
                        write(data, "snapEnabled", this.snapEnabled, false);
                        write(data, "snapWidth", this.snapWidth, 16);
                        write(data, "snapHeight", this.snapHeight, 16);
                        write(data, "onlyGenerateMethods", this.onlyGenerateMethods, false);
                        write(data, "superClassName", this.superClassName, "");
                        write(data, "preloadMethodName", this.preloadMethodName, "preload");
                        write(data, "preloadPackFiles", this.preloadPackFiles, []);
                        write(data, "createMethodName", this.createMethodName, "create");
                        write(data, "sceneKey", this.sceneKey, "");
                        write(data, "compilerOutputLanguage", this.compilerOutputLanguage, SourceLang.JAVA_SCRIPT);
                        write(data, "scopeBlocksToFolder", this.scopeBlocksToFolder, false);
                        write(data, "borderX", this.borderX, 0);
                        write(data, "borderY", this.borderY, 0);
                        write(data, "borderWidth", this.borderWidth, 800);
                        write(data, "borderHeight", this.borderHeight, 600);
                        return data;
                    }
                    readJSON(data) {
                        this.sceneType = read(data, "sceneType", json.SceneType.SCENE);
                        this.snapEnabled = read(data, "snapEnabled", false);
                        this.snapWidth = read(data, "snapWidth", 16);
                        this.snapHeight = read(data, "snapHeight", 16);
                        this.onlyGenerateMethods = read(data, "onlyGenerateMethods", false);
                        this.superClassName = read(data, "superClassName", "");
                        this.preloadMethodName = read(data, "preloadMethodName", "preload");
                        this.preloadPackFiles = read(data, "preloadPackFiles", []);
                        this.createMethodName = read(data, "createMethodName", "create");
                        this.sceneKey = read(data, "sceneKey", "");
                        this.compilerOutputLanguage = read(data, "compilerOutputLanguage", SourceLang.JAVA_SCRIPT);
                        this.scopeBlocksToFolder = read(data, "scopeBlocksToFolder", false);
                        this.borderX = read(data, "borderX", 0);
                        this.borderY = read(data, "borderY", 0);
                        this.borderWidth = read(data, "borderWidth", 800);
                        this.borderHeight = read(data, "borderHeight", 600);
                    }
                }
                json.SceneSettings = SceneSettings;
            })(json = core.json || (core.json = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_4) {
        var core;
        (function (core) {
            var json;
            (function (json_1) {
                class SceneWriter {
                    constructor(scene) {
                        this._scene = scene;
                    }
                    toJSON() {
                        const sceneData = {
                            id: this._scene.getId(),
                            sceneType: this._scene.getSceneType(),
                            settings: this._scene.getSettings().toJSON(),
                            displayList: [],
                            meta: {
                                app: "Phaser Editor 2D - Scene Editor",
                                url: "https://phasereditor2d.com",
                                contentType: core.CONTENT_TYPE_SCENE
                            }
                        };
                        this._scene.getObjectLists().writeJSON(sceneData);
                        for (const obj of this._scene.getDisplayListChildren()) {
                            const objData = {};
                            obj.getEditorSupport().writeJSON(objData);
                            sceneData.displayList.push(objData);
                        }
                        return sceneData;
                    }
                    toString() {
                        const json = this.toJSON();
                        return JSON.stringify(json);
                    }
                }
                json_1.SceneWriter = SceneWriter;
            })(json = core.json || (core.json = {}));
        })(core = scene_4.core || (scene_4.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var core;
        (function (core) {
            var json;
            (function (json) {
                class Serializer {
                    constructor(data) {
                        this._data = data;
                        const finder = scene.ScenePlugin.getInstance().getSceneFinder();
                        if (this._data.prefabId) {
                            const prefabData = finder.getPrefabData(this._data.prefabId);
                            if (prefabData) {
                                this._prefabSer = new Serializer(prefabData);
                            }
                            else {
                                console.error(`Cannot find scene prefab with id "${this._data.prefabId}".`);
                            }
                        }
                    }
                    getSerializer(data) {
                        return new Serializer(data);
                    }
                    getData() {
                        return this._data;
                    }
                    getType() {
                        if (this._prefabSer) {
                            return this._prefabSer.getType();
                        }
                        return this._data.type;
                    }
                    getPhaserType() {
                        if (this._prefabSer) {
                            return this._prefabSer.getPhaserType();
                        }
                        const ext = scene.ScenePlugin.getInstance().getObjectExtensionByObjectType(this._data.type);
                        return ext.getPhaserTypeName();
                    }
                    getDefaultValue(name, defaultValue) {
                        if (this.isPrefabInstance()) {
                            if (!this.isUnlocked(name)) {
                                const defaultPrefabValue = this._prefabSer.getDefaultValue(name, defaultValue);
                                if (defaultPrefabValue !== undefined) {
                                    return defaultPrefabValue;
                                }
                                return defaultValue;
                            }
                        }
                        const localValue = this._data[name];
                        if (localValue === undefined) {
                            return defaultValue;
                        }
                        return localValue;
                    }
                    isUnlocked(name) {
                        if (this.isPrefabInstance()) {
                            if (this._data.unlock) {
                                const i = this._data.unlock.indexOf(name);
                                return i >= 0;
                            }
                            return false;
                        }
                        return true;
                    }
                    setUnlocked(name, unlocked) {
                        if (this.isPrefabInstance()) {
                            const set = new Set(...(this._data.unlock ? this._data.unlock : []));
                            if (unlocked) {
                                set.add(name);
                            }
                            else {
                                set.delete(name);
                            }
                            this._data.unlock = [...set];
                        }
                    }
                    isPrefabInstance() {
                        return typeof this._data.prefabId === "string";
                    }
                    write(name, value, defValue) {
                        if (this.isPrefabInstance()) {
                            if (this.isUnlocked(name)) {
                                const defValue2 = this.getDefaultValue(name, defValue);
                                colibri.core.json.write(this._data, name, value, defValue2);
                            }
                        }
                        else {
                            colibri.core.json.write(this._data, name, value, defValue);
                        }
                    }
                    read(name, defValue) {
                        // const defValue2 = this.getDefaultValue(name, defValue);
                        // const value = colibri.core.json.read(this._data, name, defValue2);
                        // return value;
                        if (this.isPrefabInstance()) {
                            const prefabValue = this.getDefaultValue(name, defValue);
                            if (this.isUnlocked(name)) {
                                return colibri.core.json.read(this._data, name, prefabValue);
                            }
                            return prefabValue;
                        }
                        return colibri.core.json.read(this._data, name, defValue);
                    }
                }
                json.Serializer = Serializer;
            })(json = core.json || (core.json = {}));
        })(core = scene.core || (scene.core = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            Phaser.Cameras.Scene2D.Camera.prototype.getScreenPoint = function (worldX, worldY) {
                // const x = worldX * this.zoom - this.scrollX * this.zoom;
                // const y = worldY * this.zoom - this.scrollY * this.zoom;
                const x = (worldX - this.scrollX) * this.zoom;
                const y = (worldY - this.scrollY) * this.zoom;
                return new Phaser.Math.Vector2(x, y);
            };
            Phaser.Cameras.Scene2D.Camera.prototype.getWorldPoint2 = function (screenX, screenY) {
                const x = screenX / this.zoom + this.scrollX;
                const y = screenY / this.zoom + this.scrollY;
                return new Phaser.Math.Vector2(x, y);
            };
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var controls = colibri.ui.controls;
            var io = colibri.core.io;
            class ManySceneFileSection extends controls.properties.PropertySection {
                constructor(page) {
                    super(page, "phasereditor2d.scene.ui.ManySceneFileSection", "Scene", true, false);
                }
                createForm(parent) {
                    const viewer = new phasereditor2d.files.ui.views.GridImageFileViewer();
                    const filteredViewer = new colibri.ui.ide.properties.FilteredViewerInPropertySection(this.getPage(), viewer);
                    parent.appendChild(filteredViewer.getElement());
                    this.addUpdater(() => {
                        viewer.setInput([]);
                        viewer.repaint();
                        viewer.setInput(this.getSelection());
                        filteredViewer.resizeTo();
                    });
                }
                canEdit(obj, n) {
                    return obj instanceof io.FilePath
                        && colibri.Platform.getWorkbench().getContentTypeRegistry()
                            .getCachedContentType(obj) === scene.core.CONTENT_TYPE_SCENE;
                }
                canEditNumber(n) {
                    return n > 1;
                }
            }
            ui.ManySceneFileSection = ManySceneFileSection;
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            class Scene extends Phaser.Scene {
                constructor(inEditor = true) {
                    super("ObjectScene");
                    this._id = Phaser.Utils.String.UUID();
                    this._inEditor = inEditor;
                    this._maker = new ui.SceneMaker(this);
                    this._settings = new scene.core.json.SceneSettings();
                    this._packCache = new phasereditor2d.pack.core.parsers.AssetPackCache();
                    this._objectLists = new ui.sceneobjects.ObjectLists();
                }
                registerDestroyListener(name) {
                    // console.log(name + ": register destroy listener.");
                    // this.game.events.on(Phaser.Core.Events.DESTROY, e => {
                    //     console.log(name + ": destroyed.");
                    // });
                }
                getPackCache() {
                    return this._packCache;
                }
                destroyGame() {
                    if (this.game) {
                        this.game.destroy(true);
                        this.game.loop.tick();
                    }
                }
                removeAll() {
                    this.sys.updateList.removeAll();
                    this.sys.displayList.removeAll();
                    // a hack to clean the whole scene
                    this.input["_list"].length = 0;
                    this.input["_pendingInsertion"].length = 0;
                    this.input["_pendingRemoval"].length = 0;
                    for (const obj of this.getDisplayListChildren()) {
                        obj.getEditorSupport().destroy();
                    }
                }
                getPrefabObject() {
                    const list = this.getDisplayListChildren();
                    return list[list.length - 1];
                }
                getObjectLists() {
                    return this._objectLists;
                }
                getSettings() {
                    return this._settings;
                }
                getId() {
                    return this._id;
                }
                setId(id) {
                    this._id = id;
                }
                getSceneType() {
                    return this._settings.sceneType;
                }
                isPrefabSceneType() {
                    return this.getSceneType() === scene.core.json.SceneType.PREFAB;
                }
                setSceneType(sceneType) {
                    this._settings.sceneType = sceneType;
                }
                getMaker() {
                    return this._maker;
                }
                getDisplayListChildren() {
                    return this.sys.displayList.getChildren();
                }
                getInputSortedObjects() {
                    const list = [];
                    for (const child of this.children.list) {
                        if (child instanceof ui.sceneobjects.Container) {
                            for (const child2 of child.list) {
                                list.push(child2);
                            }
                        }
                        else {
                            list.push(child);
                        }
                    }
                    return list;
                }
                visit(visitor) {
                    for (const obj of this.getDisplayListChildren()) {
                        visitor(obj);
                        if (obj instanceof ui.sceneobjects.Container) {
                            for (const child of obj.list) {
                                visitor(child);
                            }
                        }
                    }
                }
                visitAskChildren(visitor) {
                    for (const obj of this.getDisplayListChildren()) {
                        const visitChildren = visitor(obj);
                        if (visitChildren) {
                            if (obj instanceof ui.sceneobjects.Container) {
                                for (const child of obj.list) {
                                    visitor(child);
                                }
                            }
                        }
                    }
                }
                makeNewName(baseName) {
                    const nameMaker = new colibri.ui.ide.utils.NameMaker((obj) => {
                        if (obj instanceof Phaser.GameObjects.GameObject) {
                            return obj.getEditorSupport().getLabel();
                        }
                        return obj.getLabel();
                    });
                    this.visitAskChildren(obj => {
                        nameMaker.update([obj]);
                        return !obj.getEditorSupport().isPrefabInstance();
                    });
                    for (const list of this._objectLists.getLists()) {
                        nameMaker.update([list]);
                    }
                    return nameMaker.makeName(baseName);
                }
                buildObjectIdMap() {
                    const map = new Map();
                    this.visit(obj => {
                        map.set(obj.getEditorSupport().getId(), obj);
                    });
                    return map;
                }
                snapPoint(x, y) {
                    if (this._settings.snapEnabled) {
                        return {
                            x: Math.round(x / this._settings.snapWidth) * this._settings.snapWidth,
                            y: Math.round(y / this._settings.snapHeight) * this._settings.snapHeight
                        };
                    }
                    return { x, y };
                }
                getByEditorId(id) {
                    const obj = Scene.findByEditorId(this.getDisplayListChildren(), id);
                    if (!obj) {
                        console.error(`Object with id=${id} not found.`);
                    }
                    return obj;
                }
                static findByEditorId(list, id) {
                    for (const obj of list) {
                        if (obj.getEditorSupport().getId() === id) {
                            return obj;
                        }
                        if (obj instanceof ui.sceneobjects.Container) {
                            const result = this.findByEditorId(obj.list, id);
                            if (result) {
                                return result;
                            }
                        }
                    }
                    return null;
                }
                getCamera() {
                    return this.cameras.main;
                }
                create() {
                    this.registerDestroyListener("Scene");
                    if (this._inEditor) {
                        const camera = this.getCamera();
                        camera.setOrigin(0, 0);
                    }
                }
            }
            ui.Scene = Scene;
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./Scene.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_5) {
        var ui;
        (function (ui) {
            class OfflineScene extends ui.Scene {
                constructor(data) {
                    super(false);
                    this._data = data;
                }
                static async createScene(data) {
                    const promise = new Promise((resolve, reject) => {
                        const scene = new OfflineScene(data);
                        scene.setCallback(() => {
                            resolve(scene);
                        });
                        const game = new Phaser.Game({
                            type: Phaser.CANVAS,
                            width: 1,
                            height: 1,
                            audio: {
                                noAudio: true,
                            },
                            scene: scene,
                        });
                    });
                    return promise;
                }
                setCallback(callback) {
                    this._callback = callback;
                }
                async create() {
                    this.registerDestroyListener("OfflineScene");
                    const maker = this.getMaker();
                    await maker.preload();
                    await maker.updateSceneLoader(this._data);
                    maker.createScene(this._data);
                    this._callback();
                }
            }
            ui.OfflineScene = OfflineScene;
        })(ui = scene_5.ui || (scene_5.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var controls = colibri.ui.controls;
            var io = colibri.core.io;
            class SceneFileSection extends controls.properties.PropertySection {
                constructor(page) {
                    super(page, "phasereditor2d.scene.ui.SceneFileSection", "Scene", true, false);
                }
                createForm(parent) {
                    const imgControl = new controls.ImageControl();
                    this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e) => {
                        imgControl.resizeTo();
                    });
                    parent.appendChild(imgControl.getElement());
                    this.addUpdater(async () => {
                        const file = this.getSelectionFirstElement();
                        const cache = ui.SceneThumbnailCache.getInstance();
                        await cache.preload(file);
                        const image = ui.SceneThumbnailCache.getInstance().getContent(file);
                        imgControl.setImage(image);
                        setTimeout(() => imgControl.resizeTo(), 1);
                    });
                }
                canEdit(obj, n) {
                    return obj instanceof io.FilePath
                        && colibri.Platform.getWorkbench().getContentTypeRegistry()
                            .getCachedContentType(obj) === scene.core.CONTENT_TYPE_SCENE;
                }
                canEditNumber(n) {
                    return n === 1;
                }
            }
            ui.SceneFileSection = SceneFileSection;
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_6) {
        var ui;
        (function (ui) {
            var ide = colibri.ui.ide;
            var json = scene_6.core.json;
            var FileUtils = colibri.ui.ide.FileUtils;
            class SceneMaker {
                constructor(scene) {
                    this._scene = scene;
                    this._packFinder = new phasereditor2d.pack.core.PackFinder();
                }
                static acceptDropFile(dropFile, editorFile) {
                    if (dropFile.getFullName() === editorFile.getFullName()) {
                        return false;
                    }
                    const sceneFinder = scene_6.ScenePlugin.getInstance().getSceneFinder();
                    const sceneData = sceneFinder.getSceneData(dropFile);
                    if (sceneData) {
                        if (sceneData.sceneType !== scene_6.core.json.SceneType.PREFAB) {
                            return false;
                        }
                        if (sceneData.displayList.length === 0) {
                            return false;
                        }
                        const objData = sceneData.displayList[sceneData.displayList.length - 1];
                        if (objData.prefabId) {
                            const prefabFile = sceneFinder.getPrefabFile(objData.prefabId);
                            if (prefabFile) {
                                return this.acceptDropFile(prefabFile, editorFile);
                            }
                        }
                        return true;
                    }
                    return false;
                }
                static isValidSceneDataFormat(data) {
                    return "displayList" in data && Array.isArray(data.displayList);
                }
                getPackFinder() {
                    return this._packFinder;
                }
                async preload() {
                    await this._packFinder.preload();
                    const updaters = scene_6.ScenePlugin.getInstance().getLoaderUpdaters();
                    for (const updater of updaters) {
                        updater.clearCache(this._scene.game);
                    }
                }
                async buildDependenciesHash() {
                    const builder = new phasereditor2d.ide.core.MultiHashBuilder();
                    for (const obj of this._scene.getDisplayListChildren()) {
                        await obj.getEditorSupport().buildDependencyHash({ builder });
                    }
                    const cache = this._scene.getPackCache();
                    const files = new Set();
                    for (const asset of cache.getAssets()) {
                        files.add(asset.getPack().getFile());
                        asset.computeUsedFiles(files);
                    }
                    for (const file of files) {
                        builder.addPartialFileToken(file);
                    }
                    const hash = builder.build();
                    return hash;
                }
                isPrefabFile(file) {
                    const ct = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(file);
                    if (ct === scene_6.core.CONTENT_TYPE_SCENE) {
                        const finder = scene_6.ScenePlugin.getInstance().getSceneFinder();
                        const data = finder.getSceneData(file);
                        return data && data.sceneType === json.SceneType.PREFAB;
                    }
                    return false;
                }
                async createPrefabInstanceWithFile(file) {
                    const content = await FileUtils.preloadAndGetFileString(file);
                    if (!content) {
                        return null;
                    }
                    try {
                        const prefabData = JSON.parse(content);
                        const obj = this.createObject({
                            id: Phaser.Utils.String.UUID(),
                            prefabId: prefabData.id,
                            label: "temporal"
                        });
                        const { x, y } = this.getCanvasCenterPoint();
                        const transformComponent = obj.getEditorSupport()
                            .getComponent(ui.sceneobjects.TransformComponent);
                        if (transformComponent) {
                            const sprite = obj;
                            sprite.x = x;
                            sprite.y = y;
                        }
                        return obj;
                    }
                    catch (e) {
                        console.error(e);
                        return null;
                    }
                }
                getSerializer(data) {
                    return new json.Serializer(data);
                }
                createScene(sceneData) {
                    if (sceneData.settings) {
                        this._scene.getSettings().readJSON(sceneData.settings);
                    }
                    if (sceneData.lists) {
                        this._scene.getObjectLists().readJSON(sceneData);
                    }
                    this._scene.setSceneType(sceneData.sceneType);
                    // removes this condition, it is used temporal for compatibility
                    this._scene.setId(sceneData.id);
                    for (const objData of sceneData.displayList) {
                        this.createObject(objData);
                    }
                }
                async updateSceneLoader(sceneData) {
                    await this.updateSceneLoaderWithObjDataList(sceneData.displayList);
                }
                async updateSceneLoaderWithObjDataList(list) {
                    const finder = new phasereditor2d.pack.core.PackFinder();
                    await finder.preload();
                    for (const objData of list) {
                        const ser = this.getSerializer(objData);
                        const type = ser.getType();
                        const ext = scene_6.ScenePlugin.getInstance().getObjectExtensionByObjectType(type);
                        if (ext) {
                            const assets = await ext.getAssetsFromObjectData({
                                serializer: ser,
                                finder: finder,
                                scene: this._scene
                            });
                            for (const asset of assets) {
                                const updater = scene_6.ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);
                                if (updater) {
                                    await updater.updateLoader(this._scene, asset);
                                }
                            }
                        }
                    }
                }
                getCanvasCenterPoint() {
                    const canvas = this._scene.game.canvas;
                    let x = canvas.width / 2;
                    let y = canvas.height / 2;
                    const worldPoint = this._scene.getCamera().getWorldPoint(x, y);
                    x = Math.floor(worldPoint.x);
                    y = Math.floor(worldPoint.y);
                    return { x, y };
                }
                createEmptyObject(ext, extraData) {
                    const { x, y } = this.getCanvasCenterPoint();
                    const newObject = ext.createEmptySceneObject({
                        scene: this._scene,
                        x,
                        y,
                        extraData
                    });
                    const nameMaker = new ide.utils.NameMaker(obj => {
                        return obj.getEditorSupport().getLabel();
                    });
                    this._scene.visit(obj => nameMaker.update([obj]));
                    newObject.getEditorSupport().setLabel(nameMaker.makeName(ext.getTypeName().toLowerCase()));
                    return newObject;
                }
                createObject(data) {
                    const ser = this.getSerializer(data);
                    const type = ser.getType();
                    const ext = scene_6.ScenePlugin.getInstance().getObjectExtensionByObjectType(type);
                    if (ext) {
                        const sprite = ext.createSceneObjectWithData({
                            data: data,
                            scene: this._scene
                        });
                        return sprite;
                    }
                    else {
                        console.error(`SceneMaker: no extension is registered for type "${type}".`);
                    }
                    return null;
                }
            }
            ui.SceneMaker = SceneMaker;
        })(ui = scene_6.ui || (scene_6.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_7) {
        var ui;
        (function (ui) {
            var controls = colibri.ui.controls;
            var ide = colibri.ui.ide;
            class ThumbnailScene extends ui.Scene {
                constructor(data, callback) {
                    super(false);
                    if (data.sceneType === scene_7.core.json.SceneType.PREFAB) {
                        if (data.displayList.length > 1) {
                            data.displayList.splice(0, data.displayList.length - 1);
                        }
                    }
                    this._data = data;
                    this._callback = callback;
                }
                async create() {
                    this.registerDestroyListener("ThumbnailScene");
                    const maker = this.getMaker();
                    await maker.preload();
                    await maker.updateSceneLoader(this._data);
                    maker.createScene(this._data);
                    let bounds = this.computeSceneBounds();
                    const s = this.getSettings();
                    if (bounds.height > s.borderWidth && bounds.height > s.borderHeight) {
                        bounds = {
                            x: s.borderX,
                            y: s.borderY,
                            width: s.borderWidth,
                            height: s.borderHeight
                        };
                    }
                    this.sys.renderer.snapshotArea(bounds.x, bounds.y, bounds.width, bounds.height, (img) => {
                        this._callback(img);
                        this.destroyGame();
                    });
                }
                computeSceneBounds() {
                    const children = this.getDisplayListChildren();
                    if (children.length === 0) {
                        return { x: 0, y: 0, width: 10, height: 10 };
                    }
                    const camera = this.getCamera();
                    const s = this.getSettings();
                    let minX = Number.MAX_VALUE;
                    let minY = Number.MAX_VALUE;
                    let maxX = Number.MIN_VALUE;
                    let maxY = Number.MIN_VALUE;
                    for (const obj of this.getDisplayListChildren()) {
                        const points = obj.getEditorSupport().getScreenBounds(camera);
                        for (const point of points) {
                            minX = Math.min(minX, point.x);
                            minY = Math.min(minY, point.y);
                            maxX = Math.max(maxX, point.x);
                            maxY = Math.max(maxY, point.y);
                        }
                    }
                    return {
                        x: Math.floor(minX),
                        y: Math.floor(minY),
                        width: Math.floor(maxX - minX),
                        height: Math.floor(maxY - minY)
                    };
                }
            }
            class SceneThumbnail {
                constructor(file) {
                    this._file = file;
                    this._image = null;
                }
                paint(context, x, y, w, h, center) {
                    if (this._image) {
                        this._image.paint(context, x, y, w, h, center);
                    }
                }
                paintFrame(context, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
                    if (this._image) {
                        this._image.paintFrame(context, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
                    }
                }
                getWidth() {
                    return this._image ? this._image.getWidth() : 16;
                }
                getHeight() {
                    return this._image ? this._image.getHeight() : 16;
                }
                preloadSize() {
                    return this.preload();
                }
                async preload() {
                    if (this._image == null) {
                        if (this._promise) {
                            return this._promise;
                        }
                        this._promise = ide.FileUtils.preloadFileString(this._file)
                            .then(() => this.createImageElement())
                            .then(imageElement => {
                            this._image = new controls.ImageWrapper(imageElement);
                            this._promise = null;
                            return controls.PreloadResult.RESOURCES_LOADED;
                        });
                        return this._promise;
                    }
                    return controls.Controls.resolveNothingLoaded();
                }
                createImageElement() {
                    return new Promise((resolve, reject) => {
                        const content = ide.FileUtils.getFileString(this._file);
                        const data = JSON.parse(content);
                        const width = 1200;
                        const height = 800;
                        const canvas = document.createElement("canvas");
                        canvas.style.width = (canvas.width = width) + "px";
                        canvas.style.height = (canvas.height = height) + "px";
                        const parent = document.createElement("div");
                        parent.style.position = "fixed";
                        parent.style.left = -width - 10 + "px";
                        parent.appendChild(canvas);
                        document.body.appendChild(parent);
                        const game = new Phaser.Game({
                            type: scene_7.ScenePlugin.DEFAULT_CANVAS_CONTEXT,
                            canvas: canvas,
                            parent: null,
                            width: width,
                            height: height,
                            scale: {
                                mode: Phaser.Scale.NONE
                            },
                            render: {
                                pixelArt: true,
                                transparent: true
                            },
                            audio: {
                                noAudio: true
                            }
                        });
                        const scene = new ThumbnailScene(data, image => {
                            resolve(image);
                            scene.destroyGame();
                            parent.remove();
                        });
                        game.scene.add("scene", scene, true);
                    });
                }
            }
            ui.SceneThumbnail = SceneThumbnail;
        })(ui = scene_7.ui || (scene_7.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var core = colibri.core;
            class SceneThumbnailCache extends core.io.FileContentCache {
                constructor() {
                    super(async (file) => {
                        const image = new ui.SceneThumbnail(file);
                        await image.preload();
                        return Promise.resolve(image);
                    });
                }
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new SceneThumbnailCache();
                    }
                    return this._instance;
                }
            }
            ui.SceneThumbnailCache = SceneThumbnailCache;
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                class SceneEditorBlocksCellRendererProvider extends phasereditor2d.pack.ui.viewers.AssetPackCellRendererProvider {
                    constructor() {
                        super("grid");
                    }
                    getCellRenderer(element) {
                        if (element instanceof colibri.core.io.FilePath) {
                            return new ui.viewers.SceneFileCellRenderer();
                        }
                        return super.getCellRenderer(element);
                    }
                }
                blocks.SceneEditorBlocksCellRendererProvider = SceneEditorBlocksCellRendererProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                const SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES = new Set([
                    phasereditor2d.pack.core.IMAGE_TYPE,
                    phasereditor2d.pack.core.ATLAS_TYPE,
                    phasereditor2d.pack.core.ATLAS_XML_TYPE,
                    phasereditor2d.pack.core.MULTI_ATLAS_TYPE,
                    phasereditor2d.pack.core.UNITY_ATLAS_TYPE,
                    phasereditor2d.pack.core.SPRITESHEET_TYPE,
                    phasereditor2d.pack.core.BITMAP_FONT_TYPE
                ]);
                class SceneEditorBlocksContentProvider extends phasereditor2d.pack.ui.viewers.AssetPackContentProvider {
                    constructor(sceneEditor, getPacks) {
                        super();
                        this._getPacks = getPacks;
                        this._editor = sceneEditor;
                    }
                    getPackItems() {
                        return this._getPacks()
                            .flatMap(pack => pack.getItems())
                            .filter(item => SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES.has(item.getType()));
                    }
                    getRoots(input) {
                        const roots = [];
                        roots.push(...this.getSceneFiles());
                        roots.push(...this.getPackItems());
                        return roots;
                    }
                    getSceneFiles() {
                        const finder = scene.ScenePlugin.getInstance().getSceneFinder();
                        return finder.getFiles()
                            .filter(file => ui.SceneMaker.acceptDropFile(file, this._editor.getInput()));
                    }
                    getChildren(parent) {
                        if (typeof (parent) === "string") {
                            switch (parent) {
                                case phasereditor2d.pack.core.ATLAS_TYPE:
                                    return this.getPackItems()
                                        .filter(item => item instanceof phasereditor2d.pack.core.BaseAtlasAssetPackItem);
                                case phasereditor2d.pack.core.BITMAP_FONT_TYPE:
                                    return this.getPackItems()
                                        .filter(item => item instanceof phasereditor2d.pack.core.BitmapFontAssetPackItem);
                                case blocks.PREFAB_SECTION:
                                    const files = this.getSceneFiles();
                                    return files;
                            }
                            return this.getPackItems()
                                .filter(item => item.getType() === parent);
                        }
                        return super.getChildren(parent);
                    }
                }
                blocks.SceneEditorBlocksContentProvider = SceneEditorBlocksContentProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                var core = colibri.core;
                class SceneEditorBlocksLabelProvider extends phasereditor2d.pack.ui.viewers.AssetPackLabelProvider {
                    getLabel(obj) {
                        if (obj instanceof core.io.FilePath) {
                            return obj.getNameWithoutExtension();
                        }
                        return super.getLabel(obj);
                    }
                }
                blocks.SceneEditorBlocksLabelProvider = SceneEditorBlocksLabelProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                class SceneEditorBlocksPropertyProvider extends phasereditor2d.pack.ui.properties.AssetPackPreviewPropertyProvider {
                    addSections(page, sections) {
                        super.addSections(page, sections);
                    }
                }
                blocks.SceneEditorBlocksPropertyProvider = SceneEditorBlocksPropertyProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                var ide = colibri.ui.ide;
                class SceneEditorBlocksProvider extends ide.EditorViewerProvider {
                    constructor(editor) {
                        super();
                        this._editor = editor;
                        this._packs = [];
                    }
                    async preload() {
                        let finder;
                        if (this._editor.getScene()) {
                            finder = this._editor.getSceneMaker().getPackFinder();
                        }
                        else {
                            finder = new phasereditor2d.pack.core.PackFinder();
                            await finder.preload();
                        }
                        this._packs = finder.getPacks();
                    }
                    prepareViewerState(state) {
                        if (state.expandedObjects) {
                            state.expandedObjects = this.getFreshItems(state.expandedObjects);
                        }
                        if (state.selectedObjects) {
                            state.selectedObjects = this.getFreshItems(state.selectedObjects);
                        }
                    }
                    getFreshItems(items) {
                        const set = new Set();
                        for (const obj of items) {
                            if (obj instanceof phasereditor2d.pack.core.AssetPackItem) {
                                const item = this.getFreshItem(obj);
                                if (item) {
                                    set.add(item);
                                }
                            }
                            else if (obj instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                                const item = this.getFreshItem(obj.getPackItem());
                                if (item instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem) {
                                    const frame = item.findFrame(obj.getName());
                                    if (frame) {
                                        set.add(frame);
                                    }
                                }
                            }
                            else {
                                set.add(obj);
                            }
                        }
                        return set;
                    }
                    getFreshItem(item) {
                        const freshPack = this._packs.find(pack => pack.getFile() === item.getPack().getFile());
                        const finder = new phasereditor2d.pack.core.PackFinder(freshPack);
                        return finder.findAssetPackItem(item.getKey());
                    }
                    getContentProvider() {
                        return new blocks.SceneEditorBlocksContentProvider(this._editor, () => this._packs);
                    }
                    getLabelProvider() {
                        return new blocks.SceneEditorBlocksLabelProvider();
                    }
                    getCellRendererProvider() {
                        return new blocks.SceneEditorBlocksCellRendererProvider();
                    }
                    getTreeViewerRenderer(viewer) {
                        // TODO: we should implements the Favorites section
                        return new blocks.SceneEditorBlocksTreeRendererProvider(viewer);
                    }
                    getUndoManager() {
                        return this._editor;
                    }
                    getPropertySectionProvider() {
                        return new blocks.SceneEditorBlocksPropertyProvider();
                    }
                    getInput() {
                        return this;
                    }
                }
                blocks.SceneEditorBlocksProvider = SceneEditorBlocksProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                var controls = colibri.ui.controls;
                var io = colibri.core.io;
                blocks.PREFAB_SECTION = "Prefab";
                class SceneEditorBlocksTreeRendererProvider extends phasereditor2d.pack.ui.viewers.AssetPackTreeViewerRenderer {
                    constructor(viewer) {
                        super(viewer, false);
                        this.setSections([
                            blocks.PREFAB_SECTION,
                            phasereditor2d.pack.core.IMAGE_TYPE,
                            phasereditor2d.pack.core.ATLAS_TYPE,
                            phasereditor2d.pack.core.SPRITESHEET_TYPE,
                            phasereditor2d.pack.core.BITMAP_FONT_TYPE
                        ]);
                    }
                    prepareContextForText(args) {
                        super.prepareContextForText(args);
                        if (args.obj instanceof io.FilePath) {
                            const type = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(args.obj);
                            if (type === scene.core.CONTENT_TYPE_SCENE) {
                                args.canvasContext.font = `italic ${controls.FONT_HEIGHT}px ${controls.FONT_FAMILY}`;
                            }
                        }
                    }
                }
                blocks.SceneEditorBlocksTreeRendererProvider = SceneEditorBlocksTreeRendererProvider;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var blocks;
            (function (blocks) {
                var controls = colibri.ui.controls;
                var io = colibri.core.io;
                class SceneEditorBlocksTreeRendererProvider_Compact extends phasereditor2d.pack.ui.viewers.AssetPackTreeViewerRenderer {
                    constructor(viewer) {
                        super(viewer, false);
                        this.setSections([]);
                    }
                    prepareContextForText(args) {
                        super.prepareContextForText(args);
                        if (args.obj instanceof io.FilePath) {
                            const type = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(args.obj);
                            if (type === scene.core.CONTENT_TYPE_SCENE) {
                                args.canvasContext.font = `italic ${controls.FONT_HEIGHT}px ${controls.FONT_FAMILY}`;
                            }
                        }
                    }
                }
                blocks.SceneEditorBlocksTreeRendererProvider_Compact = SceneEditorBlocksTreeRendererProvider_Compact;
            })(blocks = ui.blocks || (ui.blocks = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewPrefabFileDialogExtension extends phasereditor2d.files.ui.dialogs.NewFileContentExtension {
                    getCreateFileContentFunc() {
                        return (args) => {
                            const sceneData = {
                                id: Phaser.Utils.String.UUID(),
                                settings: {
                                    createMethodName: "",
                                    preloadMethodName: "",
                                    compilerOutputLanguage: scene.ScenePlugin.getInstance().getDefaultSceneLanguage()
                                },
                                sceneType: scene.core.json.SceneType.PREFAB,
                                displayList: [],
                                meta: {
                                    app: "Phaser Editor 2D - Scene Editor",
                                    url: "https://phasereditor2d.com",
                                    contentType: scene.core.CONTENT_TYPE_SCENE
                                }
                            };
                            return JSON.stringify(sceneData, null, 4);
                        };
                    }
                    constructor() {
                        super({
                            dialogName: "Prefab File",
                            dialogIcon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_GROUP),
                            fileExtension: "scene",
                            initialFileName: "Prefab"
                        });
                    }
                    getInitialFileLocation() {
                        return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_SCENE);
                    }
                }
                dialogs.NewPrefabFileDialogExtension = NewPrefabFileDialogExtension;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var dialogs;
            (function (dialogs) {
                class NewSceneFileDialogExtension extends phasereditor2d.files.ui.dialogs.NewFileContentExtension {
                    constructor() {
                        super({
                            dialogName: "Scene File",
                            dialogIcon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_GROUP),
                            fileExtension: "scene",
                            initialFileName: "Scene"
                        });
                    }
                    getCreateFileContentFunc() {
                        return (args) => {
                            let name = args.fileName;
                            const i = name.lastIndexOf(".");
                            if (i > 0) {
                                name = name.substring(0, i);
                            }
                            const sceneData = {
                                id: Phaser.Utils.String.UUID(),
                                settings: {
                                    compilerOutputLanguage: scene.ScenePlugin.getInstance().getDefaultSceneLanguage(),
                                    sceneKey: name
                                },
                                sceneType: scene.core.json.SceneType.SCENE,
                                displayList: [],
                                meta: {
                                    app: "Phaser Editor 2D - Scene Editor",
                                    url: "https://phasereditor2d.com",
                                    contentType: scene.core.CONTENT_TYPE_SCENE
                                }
                            };
                            return JSON.stringify(sceneData, null, 2);
                        };
                    }
                    getInitialFileLocation() {
                        return super.findInitialFileLocationBasedOnContentType(scene.core.CONTENT_TYPE_SCENE);
                    }
                }
                dialogs.NewSceneFileDialogExtension = NewSceneFileDialogExtension;
            })(dialogs = ui.dialogs || (ui.dialogs = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                var io = colibri.core.io;
                class ObjectExtensionAndPrefabLabelProvider extends controls.viewers.LabelProvider {
                    getLabel(obj) {
                        if (obj instanceof io.FilePath) {
                            return obj.getNameWithoutExtension();
                        }
                        else if (obj instanceof ui.sceneobjects.SceneObjectExtension) {
                            return obj.getTypeName();
                        }
                        return obj;
                    }
                }
                viewers.ObjectExtensionAndPrefabLabelProvider = ObjectExtensionAndPrefabLabelProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class ObjectExtensionAndPrefabViewer extends controls.viewers.TreeViewer {
                    constructor() {
                        super();
                        const treeRenderer = new controls.viewers.ShadowGridTreeViewerRenderer(this);
                        treeRenderer.setSections(ObjectExtensionAndPrefabViewer.SECTIONS);
                        this.setLabelProvider(new viewers.ObjectExtensionAndPrefabLabelProvider());
                        this.setCellRendererProvider(new viewers.ObjectExtensionAndPrefabCellRendererProvider());
                        this.setContentProvider(new ObjectExtensionAndPrefabContentProvider());
                        this.setTreeRenderer(treeRenderer);
                        this.setInput(ObjectExtensionAndPrefabViewer.SECTIONS);
                        this.setCellSize(78);
                    }
                }
                ObjectExtensionAndPrefabViewer.BUILT_IN_SECTION = "Built-In";
                ObjectExtensionAndPrefabViewer.PREFAB_SECTION = "User Prefab";
                ObjectExtensionAndPrefabViewer.SECTIONS = [
                    ObjectExtensionAndPrefabViewer.BUILT_IN_SECTION,
                    ObjectExtensionAndPrefabViewer.PREFAB_SECTION,
                ];
                viewers.ObjectExtensionAndPrefabViewer = ObjectExtensionAndPrefabViewer;
                class ObjectExtensionAndPrefabContentProvider {
                    getRoots(input) {
                        return ObjectExtensionAndPrefabViewer.SECTIONS;
                    }
                    getChildren(parent) {
                        const plugin = scene.ScenePlugin.getInstance();
                        if (parent === ObjectExtensionAndPrefabViewer.BUILT_IN_SECTION) {
                            return plugin.getObjectExtensions();
                        }
                        else if (parent === ObjectExtensionAndPrefabViewer.PREFAB_SECTION) {
                            return plugin.getSceneFinder().getPrefabFiles();
                        }
                        return [];
                    }
                }
                viewers.ObjectExtensionAndPrefabContentProvider = ObjectExtensionAndPrefabContentProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../viewers/ObjectExtensionAndPrefabLabelProvider.ts"/>
/// <reference path="../viewers/ObjectExtensionAndPrefabViewer.ts"/>
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_1) {
                var controls = colibri.ui.controls;
                class AddObjectDialog extends controls.dialogs.ViewerDialog {
                    constructor(editor) {
                        super(new AddObjectDialogViewer());
                        this._editor = editor;
                        const size = this.getSize();
                        this.setSize(size.width, size.height * 1.5);
                    }
                    create() {
                        super.create();
                        this.setTitle("Add Object");
                        this.enableButtonOnlyWhenOneElementIsSelected(this.addOpenButton("Create", async (sel) => {
                            const type = sel[0];
                            if (type === AddObjectDialog.OBJECT_LIST_TYPE) {
                                this._editor.getUndoManager().add(new ui.sceneobjects.NewListOperation(this._editor));
                            }
                            else {
                                let extraData;
                                if (type instanceof ui.sceneobjects.SceneObjectExtension) {
                                    const result = await type.collectExtraDataForCreateEmptyObject();
                                    if (result.abort) {
                                        return;
                                    }
                                    if (result.dataNotFoundMessage) {
                                        alert(result.dataNotFoundMessage);
                                        return;
                                    }
                                    extraData = result.data;
                                }
                                this._editor.getUndoManager().add(new editor_1.undo.AddObjectOperation(this._editor, type, extraData));
                            }
                        }));
                        this.addCancelButton();
                        this.getViewer().setSelection([]);
                    }
                }
                AddObjectDialog.OBJECT_LIST_TYPE = "ObjectListType";
                editor_1.AddObjectDialog = AddObjectDialog;
                class AddObjectDialogViewer extends ui.viewers.ObjectExtensionAndPrefabViewer {
                    constructor() {
                        super();
                        this.setLabelProvider(new class extends ui.viewers.ObjectExtensionAndPrefabLabelProvider {
                            getLabel(obj) {
                                if (obj === AddObjectDialog.OBJECT_LIST_TYPE) {
                                    return "List";
                                }
                                return super.getLabel(obj);
                            }
                        }());
                        this.setCellRendererProvider(new class extends ui.viewers.ObjectExtensionAndPrefabCellRendererProvider {
                            getCellRenderer(obj) {
                                if (obj === AddObjectDialog.OBJECT_LIST_TYPE) {
                                    return new controls.viewers.IconImageCellRenderer(scene.ScenePlugin.getInstance().getIcon(scene.ICON_LIST));
                                }
                                return super.getCellRenderer(obj);
                            }
                        }());
                        this.setContentProvider(new class extends ui.viewers.ObjectExtensionAndPrefabContentProvider {
                            getChildren(obj) {
                                if (obj === ui.viewers.ObjectExtensionAndPrefabViewer.BUILT_IN_SECTION) {
                                    const list = [...super.getChildren(obj)];
                                    list.push(AddObjectDialog.OBJECT_LIST_TYPE);
                                    return list;
                                }
                                return super.getChildren(obj);
                            }
                        }());
                    }
                }
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_8) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_2) {
                class CameraManager {
                    constructor(editor) {
                        this._editor = editor;
                        this._dragStartPoint = null;
                        const canvas = this._editor.getOverlayLayer().getCanvas();
                        canvas.addEventListener("wheel", e => this.onWheel(e));
                        canvas.addEventListener("mousedown", e => this.onMouseDown(e));
                        canvas.addEventListener("mousemove", e => this.onMouseMove(e));
                        canvas.addEventListener("mouseup", e => this.onMouseUp(e));
                        this._state = {
                            scrollX: 0,
                            scrollY: 0,
                            zoom: 1
                        };
                    }
                    getCamera() {
                        return this._editor.getScene().getCamera();
                    }
                    onMouseDown(e) {
                        if (e.button === 1) {
                            const camera = this.getCamera();
                            this._dragStartPoint = new Phaser.Math.Vector2(e.offsetX, e.offsetY);
                            this._dragStartCameraScroll = new Phaser.Math.Vector2(camera.scrollX, camera.scrollY);
                            e.preventDefault();
                        }
                    }
                    onMouseMove(e) {
                        if (this._dragStartPoint === null) {
                            return;
                        }
                        const dx = this._dragStartPoint.x - e.offsetX;
                        const dy = this._dragStartPoint.y - e.offsetY;
                        const camera = this.getCamera();
                        camera.scrollX = this._dragStartCameraScroll.x + dx / camera.zoom;
                        camera.scrollY = this._dragStartCameraScroll.y + dy / camera.zoom;
                        this.updateState();
                        this._editor.repaint();
                        e.preventDefault();
                    }
                    updateState() {
                        const camera = this.getCamera();
                        this._state.scrollX = camera.scrollX;
                        this._state.scrollY = camera.scrollY;
                        this._state.zoom = camera.zoom;
                    }
                    onMouseUp(e) {
                        this._dragStartPoint = null;
                        this._dragStartCameraScroll = null;
                    }
                    onWheel(e) {
                        const scene = this._editor.getScene();
                        const camera = scene.getCamera();
                        const delta = e.deltaY;
                        const zoomDelta = (delta > 0 ? 0.9 : 1.1);
                        // const pointer = scene.input.activePointer;
                        const point1 = camera.getWorldPoint(e.offsetX, e.offsetY);
                        camera.zoom *= zoomDelta;
                        // update the camera matrix
                        camera.preRender(scene.scale.resolution);
                        const point2 = camera.getWorldPoint(e.offsetX, e.offsetY);
                        const dx = point2.x - point1.x;
                        const dy = point2.y - point1.y;
                        camera.scrollX += -dx;
                        camera.scrollY += -dy;
                        this.updateState();
                        this._editor.repaint();
                    }
                    getState() {
                        return this._state;
                    }
                    setState(state) {
                        if (state) {
                            const camera = this.getCamera();
                            camera.scrollX = state.scrollX;
                            camera.scrollY = state.scrollY;
                            camera.zoom = state.zoom;
                            this._state = state;
                        }
                    }
                }
                editor_2.CameraManager = CameraManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_8.ui || (scene_8.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_3) {
                class ClipboardManager {
                    constructor(editor) {
                        this._editor = editor;
                        this._clipboard = [];
                    }
                    getClipboard() {
                        return this._clipboard;
                    }
                    getClipboardCopy() {
                        return this._clipboard.map(obj => JSON.parse(JSON.stringify(obj)));
                    }
                    copy() {
                        this._clipboard = [];
                        let minX = Number.MAX_VALUE;
                        let minY = Number.MAX_VALUE;
                        const p = new Phaser.Math.Vector2();
                        for (const obj of this._editor.getSelectedGameObjects()) {
                            const sprite = obj;
                            sprite.getWorldTransformMatrix().transformPoint(0, 0, p);
                            minX = Math.min(minX, p.x);
                            minY = Math.min(minY, p.y);
                        }
                        for (const obj of this._editor.getSelectedGameObjects()) {
                            const objData = {};
                            obj.getEditorSupport().writeJSON(objData);
                            const sprite = obj;
                            sprite.getWorldTransformMatrix().transformPoint(0, 0, p);
                            p.x -= minX;
                            p.y -= minY;
                            objData["x"] = p.x;
                            objData["y"] = p.y;
                            this._clipboard.push({
                                type: "ISceneObject",
                                data: objData
                            });
                        }
                        for (const list of this._editor.getSelectedLists()) {
                            const listData = {};
                            list.writeJSON(listData);
                            this._clipboard.push({
                                type: "ObjectList",
                                data: listData
                            });
                        }
                    }
                    paste() {
                        if (this._clipboard.length > 0) {
                            this._editor.getUndoManager().add(new editor_3.undo.PasteOperation(this._editor));
                        }
                    }
                    cut() {
                        if (this._editor.getSelection().length > 0) {
                            this._editor.getUndoManager().add(new editor_3.undo.CutOperation(this._editor));
                        }
                    }
                }
                editor_3.ClipboardManager = ClipboardManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_4) {
                var controls = colibri.ui.controls;
                class ConvertTypeDialog extends controls.dialogs.ViewerDialog {
                    constructor(editor) {
                        super(new ui.viewers.ObjectExtensionAndPrefabViewer());
                        this._editor = editor;
                        const size = this.getSize();
                        this.setSize(size.width, size.height * 1.5);
                    }
                    static canConvert(editor) {
                        return this.getObjectsToMorph(editor).length > 0;
                    }
                    static getObjectsToMorph(editor) {
                        return editor.getSelection().filter(obj => obj instanceof Phaser.GameObjects.GameObject);
                    }
                    create() {
                        const viewer = this.getViewer();
                        super.create();
                        this.setTitle("Replace Type");
                        this.enableButtonOnlyWhenOneElementIsSelected(this.addOpenButton("Replace", (sel) => {
                            this._editor.getUndoManager().add(new editor_4.undo.ConvertTypeOperation(this._editor, viewer.getSelectionFirstElement()));
                            this.close();
                        }));
                        viewer.selectFirst();
                        this.addButton("Cancel", () => this.close());
                    }
                }
                editor_4.ConvertTypeDialog = ConvertTypeDialog;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_9) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_5) {
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                var io = colibri.core.io;
                class DropManager {
                    constructor(editor) {
                        this._editor = editor;
                        const canvas = this._editor.getOverlayLayer().getCanvas();
                        canvas.addEventListener("dragover", e => this.onDragOver(e));
                        canvas.addEventListener("drop", e => this.onDragDrop_async(e));
                    }
                    async onDragDrop_async(e) {
                        const dataArray = controls.Controls.getApplicationDragDataAndClean();
                        for (const data of dataArray) {
                            if (data instanceof io.FilePath) {
                                if (data.getExtension() !== "scene") {
                                    alert(`Only items shown in the Blocks view can be added to the scene.
                        <br>The Blocks view shows Scene Prefabs and items defined in the Asset Pack files.
                        <br>You can add files to a Pack File using the Inspector view or opening a pack file in the Asset Pack editor.`);
                                    return;
                                }
                            }
                        }
                        if (this.acceptDropDataArray(dataArray)) {
                            e.preventDefault();
                            await this._editor.getUndoManager()
                                .add(new editor_5.undo.CreateObjectWithAssetOperation(this._editor, e, dataArray));
                            await this._editor.refreshDependenciesHash();
                            ide.Workbench.getWorkbench().setActivePart(this._editor);
                        }
                    }
                    async createWithDropEvent(e, dropAssetArray) {
                        const scene = this._editor.getScene();
                        const sceneMaker = scene.getMaker();
                        const exts = scene_9.ScenePlugin.getInstance().getObjectExtensions();
                        const nameMaker = new ide.utils.NameMaker(obj => {
                            return obj.getEditorSupport().getLabel();
                        });
                        scene.visit(obj => nameMaker.update([obj]));
                        const worldPoint = scene.getCamera().getWorldPoint(e.offsetX, e.offsetY);
                        const x = Math.floor(worldPoint.x);
                        const y = Math.floor(worldPoint.y);
                        const sceneFinder = scene_9.ScenePlugin.getInstance().getSceneFinder();
                        for (const data of dropAssetArray) {
                            if (data instanceof io.FilePath) {
                                const file = data;
                                if (sceneMaker.isPrefabFile(file)) {
                                    const sceneData = sceneFinder.getSceneData(file);
                                    if (sceneData) {
                                        await sceneMaker.updateSceneLoader(sceneData);
                                    }
                                }
                            }
                        }
                        for (const data of dropAssetArray) {
                            const ext = scene_9.ScenePlugin.getInstance().getLoaderUpdaterForAsset(data);
                            if (ext) {
                                await ext.updateLoader(scene, data);
                            }
                        }
                        const sprites = [];
                        for (const data of dropAssetArray) {
                            if (data instanceof io.FilePath) {
                                if (sceneMaker.isPrefabFile(data)) {
                                    const sprite = await sceneMaker.createPrefabInstanceWithFile(data);
                                    const transformComp = sprite.getEditorSupport()
                                        .getComponent(ui.sceneobjects.TransformComponent);
                                    if (transformComp) {
                                        const obj = transformComp.getObject();
                                        obj.x = x;
                                        obj.y = y;
                                    }
                                    if (sprite) {
                                        sprites.push(sprite);
                                    }
                                    continue;
                                }
                            }
                            for (const ext of exts) {
                                if (ext.acceptsDropData(data)) {
                                    const sprite = ext.createSceneObjectWithAsset({
                                        x: x,
                                        y: y,
                                        asset: data,
                                        scene: scene
                                    });
                                    sprites.push(sprite);
                                    break;
                                }
                            }
                        }
                        for (const sprite of sprites) {
                            const support = sprite.getEditorSupport();
                            let label = support.isPrefabInstance() ? support.getPrefabName() : support.getLabel();
                            label = scene_9.core.code.formatToValidVarName(label);
                            label = nameMaker.makeName(label);
                            support.setLabel(label);
                        }
                        return sprites;
                    }
                    onDragOver(e) {
                        const dataArray = controls.Controls.getApplicationDragData();
                        // accept any kind of file, so we can show a message when the drop is done.
                        for (const data of dataArray) {
                            if (data instanceof io.FilePath) {
                                e.preventDefault();
                                return;
                            }
                        }
                        if (this.acceptDropDataArray(dataArray)) {
                            e.preventDefault();
                        }
                    }
                    acceptDropData(data) {
                        if (data instanceof io.FilePath) {
                            return ui.SceneMaker.acceptDropFile(data, this._editor.getInput());
                        }
                        for (const ext of scene_9.ScenePlugin.getInstance().getObjectExtensions()) {
                            if (ext.acceptsDropData(data)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    acceptDropDataArray(dataArray) {
                        if (!dataArray) {
                            return false;
                        }
                        for (const item of dataArray) {
                            if (!this.acceptDropData(item)) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                editor_5.DropManager = DropManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_9.ui || (scene_9.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_6) {
                var controls = colibri.ui.controls;
                class MenuCreator {
                    constructor(editor) {
                        this._editor = editor;
                    }
                    fillMenu(menu) {
                        menu.addCommand(editor_6.commands.CMD_ADD_SCENE_OBJECT);
                        menu.addMenu(this.createToolsMenu());
                        menu.addSeparator();
                        menu.addMenu(this.createTypeMenu());
                        menu.addMenu(this.createOriginMenu());
                        menu.addMenu(this.createTextureMenu());
                        menu.addMenu(this.createContainerMenu());
                        menu.addSeparator();
                        menu.addMenu(this.createSnappingMenu());
                        menu.addMenu(this.createEditMenu());
                        menu.addSeparator();
                        menu.addCommand(colibri.ui.ide.actions.CMD_UPDATE_CURRENT_EDITOR, {
                            text: "Refresh Scene"
                        });
                        menu.addCommand(editor_6.commands.CMD_COMPILE_SCENE_EDITOR);
                        menu.addCommand(editor_6.commands.CMD_OPEN_COMPILED_FILE);
                    }
                    createEditMenu() {
                        const menu = new controls.Menu("Edit");
                        menu.addCommand(colibri.ui.ide.actions.CMD_UNDO);
                        menu.addCommand(colibri.ui.ide.actions.CMD_REDO);
                        menu.addSeparator();
                        menu.addCommand(colibri.ui.ide.actions.CMD_CUT);
                        menu.addCommand(colibri.ui.ide.actions.CMD_COPY);
                        menu.addCommand(colibri.ui.ide.actions.CMD_PASTE);
                        return menu;
                    }
                    createOriginMenu() {
                        const menu = new controls.Menu("Origin");
                        for (const data of editor_6.commands.SceneEditorCommands.computeOriginCommandData()) {
                            menu.addCommand(data.command);
                        }
                        return menu;
                    }
                    createToolsMenu() {
                        const menu = new controls.Menu("Tools");
                        const activeTool = this._editor.getToolsManager().getActiveTool();
                        const exts = colibri.Platform.getExtensions(editor_6.tools.SceneToolExtension.POINT_ID);
                        for (const ext of exts) {
                            for (const tool of ext.getTools()) {
                                menu.addCommand(tool.getCommandId(), {
                                    selected: activeTool === tool
                                });
                            }
                        }
                        return menu;
                    }
                    createTypeMenu() {
                        const menu = new controls.Menu("Type");
                        menu.addCommand(editor_6.commands.CMD_OPEN_PREFAB);
                        menu.addCommand(editor_6.commands.CMD_CONVERT_OBJECTS);
                        menu.addCommand(editor_6.commands.CMD_CONVERT_TO_TILE_SPRITE_OBJECTS);
                        return menu;
                    }
                    createContainerMenu() {
                        const menu = new controls.Menu("Container");
                        menu.addCommand(editor_6.commands.CMD_JOIN_IN_CONTAINER);
                        menu.addCommand(editor_6.commands.CMD_TRIM_CONTAINER);
                        menu.addCommand(editor_6.commands.CMD_BREAK_CONTAINER);
                        menu.addCommand(editor_6.commands.CMD_MOVE_TO_PARENT);
                        menu.addCommand(editor_6.commands.CMD_SELECT_PARENT);
                        return menu;
                    }
                    createSnappingMenu() {
                        const menu = new controls.Menu("Snapping");
                        menu.addCommand(editor_6.commands.CMD_TOGGLE_SNAPPING);
                        menu.addCommand(editor_6.commands.CMD_SET_SNAPPING_TO_OBJECT_SIZE);
                        return menu;
                    }
                    createTextureMenu() {
                        const menu = new controls.Menu("Texture");
                        menu.addCommand(editor_6.commands.CMD_SELECT_ALL_OBJECTS_SAME_TEXTURE);
                        menu.addCommand(editor_6.commands.CMD_REPLACE_TEXTURE);
                        return menu;
                    }
                }
                editor_6.MenuCreator = MenuCreator;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_7) {
                class MouseManager {
                    constructor(editor) {
                        this._editor = editor;
                        this._toolInAction = false;
                        const canvas = editor.getOverlayLayer().getCanvas();
                        this._mousePosition = { x: 0, y: 0 };
                        canvas.addEventListener("click", e => this.onClick(e));
                        canvas.addEventListener("mousedown", e => this.onMouseDown(e));
                        canvas.addEventListener("mouseup", e => this.onMouseUp(e));
                        canvas.addEventListener("mousemove", e => this.onMouseMove(e));
                    }
                    createArgs(e) {
                        return {
                            camera: this._editor.getScene().getCamera(),
                            editor: this._editor,
                            objects: this._editor.getSelection(),
                            x: e.offsetX,
                            y: e.offsetY
                        };
                    }
                    onMouseDown(e) {
                        if (e.button !== 0) {
                            return;
                        }
                        const toolsManager = this._editor.getToolsManager();
                        const tool = toolsManager.getActiveTool();
                        if (tool) {
                            const args = this.createArgs(e);
                            for (const obj of args.objects) {
                                if (!tool.canEdit(obj)) {
                                    return;
                                }
                            }
                            if (tool.containsPoint(args)) {
                                this._toolInAction = true;
                                tool.onStartDrag(args);
                            }
                        }
                    }
                    getMousePosition() {
                        return this._mousePosition;
                    }
                    getDropPosition() {
                        const p = this._editor.getScene().getCamera()
                            .getWorldPoint(this._mousePosition.x, this._mousePosition.y);
                        return this._editor.getScene().snapPoint(p.x, p.y);
                    }
                    onMouseMove(e) {
                        this._mousePosition.x = e.offsetX;
                        this._mousePosition.y = e.offsetY;
                        const toolsManager = this._editor.getToolsManager();
                        const tool = toolsManager.getActiveTool();
                        if (tool && this._toolInAction) {
                            const args = this.createArgs(e);
                            tool.onDrag(args);
                        }
                    }
                    onMouseUp(e) {
                        const toolsManager = this._editor.getToolsManager();
                        const tool = toolsManager.getActiveTool();
                        if (tool) {
                            const args = this.createArgs(e);
                            for (const obj of args.objects) {
                                if (!tool.canEdit(obj)) {
                                    return;
                                }
                            }
                            tool.onStopDrag(args);
                        }
                    }
                    onClick(e) {
                        if (this._toolInAction) {
                            this._toolInAction = false;
                            return;
                        }
                        const selManager = this._editor.getSelectionManager();
                        const toolsManager = this._editor.getToolsManager();
                        const tool = toolsManager.getActiveTool();
                        if (tool) {
                            const args = this.createArgs(e);
                            let canEdit = true;
                            for (const obj of args.objects) {
                                if (!tool.canEdit(obj)) {
                                    canEdit = false;
                                    break;
                                }
                            }
                            if (canEdit && tool.containsPoint(args)) {
                                return;
                            }
                        }
                        selManager.onMouseClick(e);
                    }
                }
                editor_7.MouseManager = MouseManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_8) {
                var controls = colibri.ui.controls;
                class OverlayLayer {
                    constructor(editor) {
                        this._editor = editor;
                        this._canvas = document.createElement("canvas");
                        this._canvas.style.position = "absolute";
                    }
                    getCanvas() {
                        return this._canvas;
                    }
                    resetContext() {
                        this._ctx = this._canvas.getContext("2d");
                        this._ctx.imageSmoothingEnabled = false;
                        this._ctx.font = "12px Monospace";
                    }
                    resizeTo() {
                        const parent = this._canvas.parentElement;
                        this._canvas.width = Math.floor(parent.clientWidth);
                        this._canvas.height = Math.floor(parent.clientHeight);
                        this._canvas.style.width = this._canvas.width + "px";
                        this._canvas.style.height = this._canvas.height + "px";
                        this.resetContext();
                    }
                    render() {
                        if (!this._ctx) {
                            this.resetContext();
                        }
                        this.renderGrid();
                        this.renderSelection();
                        this.renderTools();
                    }
                    renderTools() {
                        const manager = this._editor.getToolsManager();
                        const tool = manager.getActiveTool();
                        if (!tool) {
                            return;
                        }
                        const renderSel = this._editor.getSelection().filter(obj => tool.canRender(obj));
                        if (renderSel.length === 0) {
                            return;
                        }
                        const editSel = this._editor.getSelection().filter(obj => tool.canEdit(obj));
                        const ctx = this._ctx;
                        ctx.save();
                        tool.render({
                            editor: this._editor,
                            canvasContext: ctx,
                            objects: renderSel,
                            canEdit: editSel.length === renderSel.length,
                            camera: this._editor.getScene().getCamera()
                        });
                        ctx.restore();
                    }
                    renderSelection() {
                        const theme = controls.Controls.getTheme();
                        const ctx = this._ctx;
                        ctx.save();
                        const camera = this._editor.getScene().getCamera();
                        for (const obj of this._editor.getSelection()) {
                            if (obj instanceof Phaser.GameObjects.GameObject) {
                                const sprite = obj;
                                const points = sprite.getEditorSupport().getScreenBounds(camera);
                                if (points.length === 4) {
                                    ctx.strokeStyle = "black";
                                    ctx.lineWidth = 4;
                                    ctx.beginPath();
                                    ctx.moveTo(points[0].x, points[0].y);
                                    ctx.lineTo(points[1].x, points[1].y);
                                    ctx.lineTo(points[2].x, points[2].y);
                                    ctx.lineTo(points[3].x, points[3].y);
                                    ctx.closePath();
                                    ctx.stroke();
                                    ctx.strokeStyle = "#00ff00";
                                    // ctx.strokeStyle = controls.Controls.getTheme().viewerSelectionBackground;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(points[0].x, points[0].y);
                                    ctx.lineTo(points[1].x, points[1].y);
                                    ctx.lineTo(points[2].x, points[2].y);
                                    ctx.lineTo(points[3].x, points[3].y);
                                    ctx.closePath();
                                    ctx.stroke();
                                }
                            }
                        }
                        ctx.restore();
                    }
                    renderGrid() {
                        const settings = this._editor.getScene().getSettings();
                        const camera = this._editor.getScene().getCamera();
                        // parameters from settings
                        const snapEnabled = settings.snapEnabled;
                        const snapX = settings.snapWidth;
                        const snapY = settings.snapHeight;
                        const borderX = settings.borderX;
                        const borderY = settings.borderY;
                        const borderWidth = settings.borderWidth;
                        const borderHeight = settings.borderHeight;
                        const ctx = this._ctx;
                        const canvasWidth = this._canvas.width;
                        const canvasHeight = this._canvas.height;
                        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                        // render grid
                        const theme = controls.Controls.getTheme();
                        ctx.strokeStyle = theme.dark ? "#6e6e6eaa" : "#bebebe";
                        ctx.lineWidth = 1;
                        let gapX = 4;
                        let gapY = 4;
                        if (snapEnabled) {
                            gapX = snapX;
                            gapY = snapY;
                        }
                        {
                            for (let i = 1; true; i++) {
                                const delta = camera.getScreenPoint(gapX * i, gapY * i).subtract(camera.getScreenPoint(0, 0));
                                if (delta.x > 64 && delta.y > 64) {
                                    gapX = gapX * i;
                                    gapY = gapY * i;
                                    break;
                                }
                            }
                        }
                        const worldStartPoint = camera.getWorldPoint(0, 0);
                        worldStartPoint.x = Phaser.Math.Snap.Floor(worldStartPoint.x, gapX);
                        worldStartPoint.y = Phaser.Math.Snap.Floor(worldStartPoint.y, gapY);
                        const worldEndPoint = camera.getWorldPoint(canvasWidth, canvasHeight);
                        const grid = (render) => {
                            let worldY = worldStartPoint.y;
                            while (worldY < worldEndPoint.y) {
                                const point = camera.getScreenPoint(0, worldY);
                                render.horizontal(worldY, Math.floor(point.y));
                                worldY += gapY;
                            }
                            let worldX = worldStartPoint.x;
                            while (worldX < worldEndPoint.x) {
                                const point = camera.getScreenPoint(worldX, 0);
                                render.vertical(worldX, Math.floor(point.x));
                                worldX += gapX;
                            }
                        };
                        let labelWidth = 0;
                        ctx.save();
                        ctx.fillStyle = ctx.strokeStyle;
                        // labels
                        grid({
                            horizontal: (worldY, screenY) => {
                                const w = ctx.measureText(worldY.toString()).width;
                                labelWidth = Math.max(labelWidth, w + 2);
                                ctx.save();
                                ctx.fillStyle = "#000000";
                                ctx.fillText(worldY.toString(), 0 + 1, screenY + 4 + 1);
                                ctx.restore();
                                ctx.fillText(worldY.toString(), 0, screenY + 4);
                            },
                            vertical: (worldX, screenX) => {
                                if (screenX < labelWidth) {
                                    return;
                                }
                                const w = ctx.measureText(worldX.toString()).width;
                                ctx.save();
                                ctx.fillStyle = "#000000";
                                ctx.fillText(worldX.toString(), screenX - w / 2 + 1, 15 + 1);
                                ctx.restore();
                                ctx.fillText(worldX.toString(), screenX - w / 2, 15);
                            }
                        });
                        // lines
                        grid({
                            horizontal: (worldY, screenY) => {
                                if (screenY < 20) {
                                    return;
                                }
                                ctx.beginPath();
                                ctx.moveTo(labelWidth, screenY);
                                ctx.lineTo(canvasWidth, screenY);
                                ctx.stroke();
                            },
                            vertical: (worldX, screenX) => {
                                if (screenX < labelWidth) {
                                    return;
                                }
                                ctx.beginPath();
                                ctx.moveTo(screenX, 20);
                                ctx.lineTo(screenX, canvasHeight);
                                ctx.stroke();
                            }
                        });
                        ctx.restore();
                        {
                            ctx.save();
                            ctx.lineWidth = 2;
                            const a = camera.getScreenPoint(borderX, borderY);
                            const b = camera.getScreenPoint(borderX + borderWidth, borderY + borderHeight);
                            ctx.save();
                            ctx.strokeStyle = theme.dark ? "#0a0a0a" : "#404040";
                            ctx.strokeRect(a.x + 2, a.y + 2, b.x - a.x, b.y - a.y);
                            ctx.restore();
                            ctx.lineWidth = 1;
                            ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
                            ctx.restore();
                        }
                    }
                }
                editor_8.OverlayLayer = OverlayLayer;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var controls = colibri.ui.controls;
                var io = colibri.core.io;
                var json = scene.core.json;
                var FileUtils = colibri.ui.ide.FileUtils;
                class SceneEditorFactory extends colibri.ui.ide.EditorFactory {
                    constructor() {
                        super("phasereditor2d.SceneEditorFactory");
                    }
                    acceptInput(input) {
                        if (input instanceof io.FilePath) {
                            const contentType = colibri.Platform.getWorkbench()
                                .getContentTypeRegistry().getCachedContentType(input);
                            return contentType === scene.core.CONTENT_TYPE_SCENE;
                        }
                        return false;
                    }
                    createEditor() {
                        return new SceneEditor();
                    }
                }
                class SceneEditor extends colibri.ui.ide.FileEditor {
                    constructor() {
                        super("phasereditor2d.SceneEditor");
                        this.addClass("SceneEditor");
                        this._blocksProvider = new ui.blocks.SceneEditorBlocksProvider(this);
                        this._outlineProvider = new editor.outline.SceneEditorOutlineProvider(this);
                        this._propertyProvider = new editor.properties.SceneEditorSectionProvider(this);
                    }
                    static getFactory() {
                        return new SceneEditorFactory();
                    }
                    openSourceFileInEditor() {
                        const lang = this._scene.getSettings().compilerOutputLanguage;
                        const ext = lang === json.SourceLang.JAVA_SCRIPT ? ".js" : ".ts";
                        const file = this.getInput().getSibling(this.getInput().getNameWithoutExtension() + ext);
                        if (file) {
                            colibri.Platform.getWorkbench().openEditor(file);
                        }
                    }
                    async doSave() {
                        // compile first because the SceneFinder will be updated after the file is changed.
                        await this.compile();
                        // saves the file
                        const sceneFile = this.getInput();
                        const writer = new json.SceneWriter(this.getScene());
                        const data = writer.toJSON();
                        const content = JSON.stringify(data, null, 4);
                        try {
                            await FileUtils.setFileString_async(sceneFile, content);
                            this.setDirty(false);
                            this.updateTitleIcon();
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    async compile() {
                        const compiler = new scene.core.code.SceneCompiler(this._scene, this.getInput());
                        await compiler.compile();
                    }
                    saveState(state) {
                        if (!this._scene) {
                            return;
                        }
                        state.cameraState = this._cameraManager.getState();
                        state.toolsState = this._toolsManager.getState();
                    }
                    restoreState(state) {
                        this._editorState = state;
                        this._toolsManager.setState(state.toolsState);
                    }
                    async onEditorInputContentChanged() {
                        const file = this.getInput();
                        const str = await colibri.ui.ide.FileUtils.preloadAndGetFileString(file);
                        const sceneData = JSON.parse(str);
                        this.refreshSceneWithData(sceneData);
                    }
                    setInput(file) {
                        super.setInput(file);
                        // we do this here because the icon should be shown even if the editor is not created yet.
                        this.updateTitleIcon();
                    }
                    createPart() {
                        this.setLayoutChildren(false);
                        const container = document.createElement("div");
                        container.classList.add("SceneEditorContainer");
                        this.getElement().appendChild(container);
                        const pool = Phaser.Display.Canvas.CanvasPool;
                        this._gameCanvas = scene.ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT === Phaser.CANVAS
                            ? pool.create2D(this.getElement(), 100, 100)
                            : pool.createWebGL(this.getElement(), 100, 100);
                        this._gameCanvas.classList.add("GameCanvas");
                        this._gameCanvas.style.position = "absolute";
                        this.getElement().appendChild(container);
                        container.appendChild(this._gameCanvas);
                        this._overlayLayer = new editor.OverlayLayer(this);
                        container.appendChild(this._overlayLayer.getCanvas());
                        this.createGame();
                        // init managers and factories
                        this._dropManager = new editor.DropManager(this);
                        this._cameraManager = new editor.CameraManager(this);
                        this._selectionManager = new editor.SelectionManager(this);
                        this._toolsManager = new editor.tools.SceneToolsManager(this);
                        this._mouseManager = new editor.MouseManager(this);
                        this._clipboardManager = new editor.ClipboardManager(this);
                        this._overlayLayer.getCanvas().addEventListener("contextmenu", e => this.onMenu(e));
                    }
                    createGame() {
                        this._scene = new ui.Scene();
                        this._game = new Phaser.Game({
                            type: scene.ScenePlugin.DEFAULT_EDITOR_CANVAS_CONTEXT,
                            canvas: this._gameCanvas,
                            // backgroundColor: "#8e8e8e",
                            scale: {
                                mode: Phaser.Scale.NONE
                            },
                            render: {
                                pixelArt: true,
                                transparent: true
                            },
                            audio: {
                                noAudio: true
                            },
                            scene: this._scene,
                        });
                        this._sceneRead = false;
                        this._gameBooted = false;
                        this._game.config.postBoot = () => {
                            // the scene is created just at this moment!
                            this.onGameBoot();
                        };
                    }
                    async updateTitleIcon(force = false) {
                        const file = this.getInput();
                        await ui.SceneThumbnailCache.getInstance().preload(file, force);
                        const img = this.getIcon();
                        if (img) {
                            await img.preload();
                            this.dispatchTitleUpdatedEvent();
                        }
                        else {
                            this.dispatchTitleUpdatedEvent();
                        }
                    }
                    getIcon() {
                        const file = this.getInput();
                        if (file) {
                            const img = ui.SceneThumbnailCache.getInstance().getContent(file);
                            if (img) {
                                return img;
                            }
                        }
                        return super.getIcon();
                    }
                    createToolActions() {
                        if (this._toolActionMap) {
                            return;
                        }
                        this._toolActionMap = new Map();
                        const tuples = [
                            [ui.sceneobjects.TranslateTool.ID, editor.commands.CMD_TRANSLATE_SCENE_OBJECT],
                            [ui.sceneobjects.ScaleTool.ID, editor.commands.CMD_SCALE_SCENE_OBJECT],
                            [ui.sceneobjects.RotateTool.ID, editor.commands.CMD_ROTATE_SCENE_OBJECT]
                        ];
                        for (const info of tuples) {
                            const [toolId, cmd] = info;
                            this._toolActionMap.set(toolId, new controls.Action({
                                commandId: cmd,
                                showText: false
                            }));
                        }
                    }
                    getToolActionMap() {
                        return this._toolActionMap;
                    }
                    createEditorToolbar(parent) {
                        this.createToolActions();
                        const manager = new controls.ToolbarManager(parent);
                        manager.add(this._toolActionMap.get(ui.sceneobjects.TranslateTool.ID));
                        manager.add(this._toolActionMap.get(ui.sceneobjects.ScaleTool.ID));
                        manager.add(this._toolActionMap.get(ui.sceneobjects.RotateTool.ID));
                        return manager;
                    }
                    onMenu(e) {
                        e.preventDefault();
                        const menu = new controls.Menu();
                        this.fillContextMenu(menu);
                        menu.createWithEvent(e);
                    }
                    fillContextMenu(menu) {
                        const creator = new editor.MenuCreator(this);
                        creator.fillMenu(menu);
                    }
                    openAddObjectDialog() {
                        const dlg = new editor.AddObjectDialog(this);
                        dlg.create();
                    }
                    toggleSnapping() {
                        const enabled = !this.getScene().getSettings().snapEnabled;
                        this.getUndoManager().add(new editor.properties.ChangeSettingsPropertyOperation({
                            editor: this,
                            props: [
                                {
                                    name: "snapEnabled",
                                    value: enabled,
                                }
                            ],
                            repaint: true
                        }));
                    }
                    setSnappingToObjectSize() {
                        const obj = this.getSelectedGameObjects()[0];
                        if (obj) {
                            if (obj.width !== undefined && obj.height !== undefined) {
                                this.getUndoManager().add(new editor.properties.ChangeSettingsPropertyOperation({
                                    editor: this,
                                    props: [
                                        {
                                            name: "snapEnabled",
                                            value: true,
                                        },
                                        {
                                            name: "snapWidth",
                                            value: obj.width
                                        },
                                        {
                                            name: "snapHeight",
                                            value: obj.height
                                        }
                                    ],
                                    repaint: true
                                }));
                            }
                        }
                    }
                    async readScene() {
                        const maker = this._scene.getMaker();
                        this._sceneRead = true;
                        try {
                            const file = this.getInput();
                            await FileUtils.preloadFileString(file);
                            const content = FileUtils.getFileString(file);
                            const data = JSON.parse(content);
                            if (ui.SceneMaker.isValidSceneDataFormat(data)) {
                                await maker.preload();
                                await maker.updateSceneLoader(data);
                                maker.createScene(data);
                            }
                            else {
                                alert("Invalid file format.");
                            }
                        }
                        catch (e) {
                            alert(e.message);
                            throw e;
                        }
                    }
                    getSelectedGameObjects() {
                        return this.getSelection()
                            .filter(obj => obj instanceof Phaser.GameObjects.GameObject);
                    }
                    getSelectedLists() {
                        return this.getSelection()
                            .filter(obj => obj instanceof ui.sceneobjects.ObjectList);
                    }
                    getDropManager() {
                        return this._dropManager;
                    }
                    getClipboardManager() {
                        return this._clipboardManager;
                    }
                    getToolsManager() {
                        return this._toolsManager;
                    }
                    getMouseManager() {
                        return this._mouseManager;
                    }
                    getSelectionManager() {
                        return this._selectionManager;
                    }
                    getOverlayLayer() {
                        return this._overlayLayer;
                    }
                    getGameCanvas() {
                        return this._gameCanvas;
                    }
                    getScene() {
                        return this._scene;
                    }
                    getGame() {
                        return this._game;
                    }
                    getSceneMaker() {
                        return this._scene.getMaker();
                    }
                    getPackFinder() {
                        return this.getSceneMaker().getPackFinder();
                    }
                    layout() {
                        super.layout();
                        if (!this._game) {
                            return;
                        }
                        this._overlayLayer.resizeTo();
                        const parent = this._gameCanvas.parentElement;
                        const w = parent.clientWidth;
                        const h = parent.clientHeight;
                        this._game.scale.resize(w, h);
                        if (this._gameBooted) {
                            this._scene.getCamera().setSize(w, h);
                            this.repaint();
                        }
                    }
                    getPropertyProvider() {
                        return this._propertyProvider;
                    }
                    onPartClosed() {
                        if (super.onPartClosed()) {
                            if (this._scene) {
                                this._scene.destroyGame();
                            }
                            return true;
                        }
                        return false;
                    }
                    async refreshScene() {
                        console.log("Scene Editor: refreshing.");
                        const writer = new json.SceneWriter(this._scene);
                        const sceneData = writer.toJSON();
                        await this.refreshSceneWithData(sceneData);
                    }
                    async refreshSceneWithData(sceneData) {
                        for (const obj of this._scene.getDisplayListChildren()) {
                            obj.getEditorSupport().destroy();
                        }
                        this._scene.removeAll();
                        const maker = this.getSceneMaker();
                        await maker.preload();
                        await maker.updateSceneLoader(sceneData);
                        maker.createScene(sceneData);
                        const sel = this.getSelection()
                            .map(obj => obj instanceof Phaser.GameObjects.GameObject ?
                            this._scene.getByEditorId(obj.getEditorSupport().getId())
                            : obj)
                            .filter(v => v !== null && v !== undefined);
                        this.setSelection(sel);
                        this._currentRefreshHash = await this.buildDependenciesHash();
                        this.refreshOutline();
                        await this.updateTitleIcon(true);
                    }
                    async buildDependenciesHash() {
                        const maker = this._scene.getMaker();
                        await maker.getPackFinder().preload();
                        const hash = await maker.buildDependenciesHash();
                        return hash;
                    }
                    async refreshDependenciesHash() {
                        this._currentRefreshHash = await this.buildDependenciesHash();
                    }
                    async onPartActivated() {
                        super.onPartActivated();
                        {
                            if (this._scene) {
                                const hash = await this.buildDependenciesHash();
                                if (this._currentRefreshHash !== null
                                    && this._currentRefreshHash !== undefined
                                    && hash !== this._currentRefreshHash) {
                                    console.log("Scene Editor: " + this.getInput().getFullName() + " dependency changed.");
                                    await this.refreshScene();
                                }
                            }
                        }
                        if (this._blocksProvider) {
                            await this._blocksProvider.preload();
                            this._blocksProvider.repaint();
                        }
                    }
                    getEditorViewerProvider(key) {
                        switch (key) {
                            case phasereditor2d.blocks.ui.views.BlocksView.EDITOR_VIEWER_PROVIDER_KEY:
                                return this._blocksProvider;
                            case phasereditor2d.outline.ui.views.OutlineView.EDITOR_VIEWER_PROVIDER_KEY:
                                return this._outlineProvider;
                            default:
                                break;
                        }
                        return null;
                    }
                    getOutlineProvider() {
                        return this._outlineProvider;
                    }
                    refreshOutline() {
                        this._outlineProvider.repaint();
                    }
                    async onGameBoot() {
                        this._gameBooted = true;
                        if (!this._sceneRead) {
                            await this.readScene();
                            if (this._editorState) {
                                if (this._editorState) {
                                    this._cameraManager.setState(this._editorState.cameraState);
                                }
                                this._editorState = null;
                            }
                            this._currentRefreshHash = await this.buildDependenciesHash();
                        }
                        this.layout();
                        this.refreshOutline();
                        // for some reason, we should do this after a time, or the game is not stopped well.
                        setTimeout(() => {
                            this._game.loop.stop();
                        }, 500);
                        this.updateTitleIcon(true);
                    }
                    repaint() {
                        if (!this._gameBooted) {
                            return;
                        }
                        this._game.loop.tick();
                        this._overlayLayer.render();
                    }
                }
                editor.SceneEditor = SceneEditor;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_10) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_9) {
                var controls = colibri.ui.controls;
                class SelectionManager {
                    constructor(editor) {
                        this._editor = editor;
                        this._editor.addEventListener(controls.EVENT_SELECTION_CHANGED, e => this.updateOutlineSelection());
                    }
                    getSelectionIds() {
                        const list = [];
                        list.push(...this._editor.getSelectedGameObjects()
                            .map(obj => obj.getEditorSupport().getId()));
                        list.push(...this._editor.getSelection()
                            .filter(obj => obj instanceof ui.sceneobjects.ObjectList)
                            .map(obj => obj.getId()));
                        return list;
                    }
                    setSelectionByIds(ids) {
                        const map = new Map(this._editor.getScene().buildObjectIdMap());
                        for (const list of this._editor.getScene().getObjectLists().getLists()) {
                            map.set(list.getId(), list);
                        }
                        const sel = ids
                            .map(id => map.get(id))
                            .filter(obj => obj !== undefined);
                        this._editor.setSelection(sel);
                    }
                    clearSelection() {
                        this._editor.setSelection([]);
                        this._editor.repaint();
                    }
                    refreshSelection() {
                        this._editor.setSelection(this._editor.getSelection()
                            .map(obj => {
                            const objMap = this._editor.getScene().buildObjectIdMap();
                            if (obj instanceof Phaser.GameObjects.GameObject) {
                                return objMap.get(obj.getEditorSupport().getId());
                            }
                            if (obj instanceof ui.sceneobjects.ObjectList) {
                                return this._editor.getScene().getObjectLists().getListById(obj.getId());
                            }
                            return undefined;
                        })
                            .filter(obj => obj !== undefined && obj !== null));
                    }
                    selectAll() {
                        const sel = this._editor.getScene().getDisplayListChildren();
                        this._editor.setSelection(sel);
                        this._editor.repaint();
                    }
                    updateOutlineSelection() {
                        const provider = this._editor.getOutlineProvider();
                        provider.setSelection(this._editor.getSelection(), true, true);
                        provider.repaint();
                    }
                    onMouseClick(e) {
                        const result = this.hitTestOfActivePointer();
                        let next = [];
                        if (result && result.length > 0) {
                            const current = this._editor.getSelection();
                            let selected = result[result.length - 1];
                            if (selected) {
                                const obj = selected;
                                const owner = obj.getEditorSupport().getOwnerPrefabInstance();
                                selected = (owner !== null && owner !== void 0 ? owner : selected);
                            }
                            if (selected) {
                                const container = selected.parentContainer;
                                if (container) {
                                    if (!container.getEditorSupport().isAllowPickChildren()) {
                                        selected = container;
                                    }
                                }
                            }
                            if (e.ctrlKey || e.metaKey) {
                                if (new Set(current).has(selected)) {
                                    next = current.filter(obj => obj !== selected);
                                }
                                else {
                                    next = current;
                                    next.push(selected);
                                }
                            }
                            else if (selected) {
                                next = [selected];
                            }
                        }
                        this._editor.setSelection(next);
                        this._editor.repaint();
                    }
                    hitTestOfActivePointer() {
                        const scene = this._editor.getScene();
                        const manager = scene.input.manager;
                        const objects = scene.getInputSortedObjects();
                        const result = manager.hitTest(scene.input.activePointer, objects, scene.getCamera());
                        return result;
                    }
                }
                editor_9.SelectionManager = SelectionManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_10.ui || (scene_10.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_10) {
                var commands;
                (function (commands) {
                    commands.CAT_SCENE_EDITOR = "phasereditor2d.scene.ui.editor.commands.SceneEditor";
                    commands.CMD_JOIN_IN_CONTAINER = "phasereditor2d.scene.ui.editor.commands.JoinInContainer";
                    commands.CMD_BREAK_CONTAINER = "phasereditor2d.scene.ui.editor.commands.BreakContainer";
                    commands.CMD_TRIM_CONTAINER = "phasereditor2d.scene.ui.editor.commands.TrimContainer";
                    commands.CMD_MOVE_TO_PARENT = "phasereditor2d.scene.ui.editor.commands.MoveToParent";
                    commands.CMD_SELECT_PARENT = "phasereditor2d.scene.ui.editor.commands.SelectParent";
                    commands.CMD_OPEN_COMPILED_FILE = "phasereditor2d.scene.ui.editor.commands.OpenCompiledFile";
                    commands.CMD_COMPILE_SCENE_EDITOR = "phasereditor2d.scene.ui.editor.commands.CompileSceneEditor";
                    commands.CMD_COMPILE_ALL_SCENE_FILES = "phasereditor2d.scene.ui.editor.commands.CompileAllSceneFiles";
                    commands.CMD_TRANSLATE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.MoveSceneObject";
                    commands.CMD_ROTATE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.RotateSceneObject";
                    commands.CMD_SCALE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.ScaleSceneObject";
                    commands.CMD_RESIZE_TILE_SPRITE_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.ResizeTileSpriteSceneObject";
                    commands.CMD_ADD_SCENE_OBJECT = "phasereditor2d.scene.ui.editor.commands.AddSceneObject";
                    commands.CMD_TOGGLE_SNAPPING = "phasereditor2d.scene.ui.editor.commands.ToggleSnapping";
                    commands.CMD_SET_SNAPPING_TO_OBJECT_SIZE = "phasereditor2d.scene.ui.editor.commands.SetSnappingToObjectSize";
                    commands.CMD_CONVERT_OBJECTS = "phasereditor2d.scene.ui.editor.commands.MorphObjects";
                    commands.CMD_CONVERT_TO_TILE_SPRITE_OBJECTS = "phasereditor2d.scene.ui.editor.commands.ConvertToTileSprite";
                    commands.CMD_SELECT_ALL_OBJECTS_SAME_TEXTURE = "phasereditor2d.scene.ui.editor.commands.SelectAllObjectsWithSameTexture";
                    commands.CMD_REPLACE_TEXTURE = "phasereditor2d.scene.ui.editor.commands.ReplaceTexture";
                    commands.CMD_OPEN_PREFAB = "phasereditor2d.scene.ui.editor.commands.OpenPrefab";
                    function isSceneScope(args) {
                        return args.activePart instanceof editor_10.SceneEditor
                            || (args.activeEditor instanceof editor_10.SceneEditor &&
                                (args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
                                    || args.activePart instanceof phasereditor2d.inspector.ui.views.InspectorView));
                    }
                    function isOnlyContainerSelected(args) {
                        return isSceneScope(args) && editorHasSelection(args)
                            && args.activeEditor.getSelectedGameObjects()
                                .filter(obj => obj instanceof ui.sceneobjects.Container)
                                .length === args.activeEditor.getSelection().length;
                    }
                    function editorHasSelection(args) {
                        return args.activeEditor && args.activeEditor.getSelection().length > 0;
                    }
                    class SceneEditorCommands {
                        static registerCommands(manager) {
                            manager.addCategory({
                                id: commands.CAT_SCENE_EDITOR,
                                name: "Scene Editor"
                            });
                            // copy
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_COPY, args => isSceneScope(args) && args.activeEditor.getSelection().length > 0, args => {
                                args.activeEditor.getClipboardManager().copy();
                            });
                            // paste
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_PASTE, args => isSceneScope(args), args => {
                                args.activeEditor.getClipboardManager().paste();
                            });
                            // cut
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_CUT, args => isSceneScope(args) && args.activeEditor.getSelection().length > 0, args => {
                                args.activeEditor.getClipboardManager().cut();
                            });
                            // update current editor
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_UPDATE_CURRENT_EDITOR, args => args.activeEditor instanceof editor_10.SceneEditor, args => args.activeEditor.refreshScene());
                            // select all
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_SELECT_ALL, args => args.activePart instanceof editor_10.SceneEditor, args => {
                                const editor = args.activeEditor;
                                editor.getSelectionManager().selectAll();
                            });
                            // clear selection
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE, isSceneScope, args => {
                                const editor = args.activeEditor;
                                editor.getSelectionManager().clearSelection();
                            });
                            // delete
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE, args => isSceneScope(args) && args.activeEditor.getSelection().length > 0, args => args.activeEditor.getUndoManager()
                                .add(new editor_10.undo.DeleteOperation(args.activeEditor)));
                            SceneEditorCommands.registerContainerCommands(manager);
                            SceneEditorCommands.registerCompilerCommands(manager);
                            SceneEditorCommands.registerToolsCommands(manager);
                            SceneEditorCommands.registerOriginCommands(manager);
                            SceneEditorCommands.registerDepthCommands(manager);
                            SceneEditorCommands.registerTypeCommands(manager);
                            // add object dialog
                            manager.add({
                                command: {
                                    id: commands.CMD_ADD_SCENE_OBJECT,
                                    icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ICON_PLUS),
                                    name: "Add Object",
                                    tooltip: "Add a new object to the scene",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: isSceneScope,
                                    executeFunc: args => {
                                        const dlg = new editor.AddObjectDialog(args.activeEditor);
                                        dlg.create();
                                    }
                                },
                                keys: {
                                    key: "A"
                                }
                            });
                            // texture
                            manager.add({
                                command: {
                                    id: commands.CMD_SELECT_ALL_OBJECTS_SAME_TEXTURE,
                                    name: "Select All With Same Texture",
                                    tooltip: "Select all the objects with the same texture.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => isSceneScope(args)
                                        && args.activeEditor.getSelection()
                                            .filter(obj => obj instanceof Phaser.GameObjects.GameObject
                                            && ui.sceneobjects.EditorSupport.hasObjectComponent(obj, ui.sceneobjects.TextureComponent))
                                            .length > 0,
                                    executeFunc: args => {
                                        const editor = args.activeEditor;
                                        const textures = new Set();
                                        for (const obj of args.activeEditor.getSelection()) {
                                            const textureComponent = ui.sceneobjects.EditorSupport
                                                .getObjectComponent(obj, ui.sceneobjects.TextureComponent);
                                            const keys = textureComponent.getTextureKeys();
                                            textures.add(JSON.stringify(keys));
                                        }
                                        const sel = [];
                                        editor.getScene().visit(obj => {
                                            const textureComponent = ui.sceneobjects.EditorSupport
                                                .getObjectComponent(obj, ui.sceneobjects.TextureComponent);
                                            if (textureComponent) {
                                                const keys = textureComponent.getTextureKeys();
                                                if (textures.has(JSON.stringify(keys))) {
                                                    sel.push(obj);
                                                }
                                            }
                                        });
                                        editor.setSelection(sel);
                                    }
                                }
                            });
                            // change texture
                            manager.add({
                                command: {
                                    id: commands.CMD_REPLACE_TEXTURE,
                                    name: "Replace Texture",
                                    tooltip: "Change the texture of the selected objects.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,
                                    executeFunc: args => {
                                        ui.sceneobjects.ChangeTextureOperation.runDialog(args.activeEditor);
                                    }
                                },
                                keys: {
                                    key: "X"
                                }
                            });
                            // snapping
                            manager.add({
                                command: {
                                    id: commands.CMD_TOGGLE_SNAPPING,
                                    name: "Toggle Snapping",
                                    tooltip: "Enable/disable the snapping.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: isSceneScope,
                                    executeFunc: args => {
                                        const editor = args.activeEditor;
                                        editor.toggleSnapping();
                                    }
                                },
                                keys: {
                                    key: "E"
                                }
                            });
                            manager.add({
                                command: {
                                    id: commands.CMD_SET_SNAPPING_TO_OBJECT_SIZE,
                                    name: "Snap To Object Size",
                                    tooltip: "Enable snapping and set size to the selected object.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => isSceneScope(args)
                                        && args.activeEditor.getSelectedGameObjects().length > 0,
                                    executeFunc: args => {
                                        const editor = args.activeEditor;
                                        editor.setSnappingToObjectSize();
                                    }
                                },
                                keys: {
                                    key: "W"
                                }
                            });
                        }
                        static registerContainerCommands(manager) {
                            // join in container
                            manager.add({
                                command: {
                                    id: commands.CMD_JOIN_IN_CONTAINER,
                                    name: "Create Container With Selection",
                                    tooltip: "Create a container with the selected objects",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => isSceneScope(args),
                                    executeFunc: args => args.activeEditor.getUndoManager().add(new ui.sceneobjects.CreateContainerWithObjectsOperation(args.activeEditor))
                                },
                                keys: {
                                    key: "J"
                                }
                            });
                            // trim container
                            manager.add({
                                command: {
                                    id: commands.CMD_TRIM_CONTAINER,
                                    name: "Trim Container",
                                    tooltip: "Remove left/top margin of children.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: isOnlyContainerSelected,
                                    executeFunc: args => args.activeEditor.getUndoManager().add(new ui.sceneobjects.TrimContainerOperation(args.activeEditor))
                                },
                                keys: {
                                    key: "T",
                                    shift: true
                                }
                            });
                            // break container
                            manager.add({
                                command: {
                                    id: commands.CMD_BREAK_CONTAINER,
                                    name: "Break Container",
                                    tooltip: "Destroy container and re-parent children.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: isOnlyContainerSelected,
                                    executeFunc: args => args.activeEditor.getUndoManager().add(new ui.sceneobjects.BreakContainerOperation(args.activeEditor))
                                },
                                keys: {
                                    key: "B",
                                    shift: true
                                }
                            });
                            // select parent
                            manager.add({
                                command: {
                                    id: commands.CMD_SELECT_PARENT,
                                    name: "Select Parent",
                                    tooltip: "Select the parent container",
                                    category: commands.CAT_SCENE_EDITOR,
                                },
                                handler: {
                                    testFunc: args => isSceneScope(args) && args.activeEditor
                                        .getSelectedGameObjects()
                                        .map(obj => obj.parentContainer)
                                        .filter(parent => parent !== undefined && parent !== null)
                                        .length > 0,
                                    executeFunc: args => {
                                        const editor = args.activeEditor;
                                        const sel = editor.getSelectedGameObjects()
                                            .map(obj => obj.parentContainer)
                                            .filter(parent => parent !== undefined && parent !== null);
                                        editor.setSelection(sel);
                                    }
                                },
                                keys: {
                                    key: "P"
                                }
                            });
                            // move to parent
                            manager.add({
                                command: {
                                    id: commands.CMD_MOVE_TO_PARENT,
                                    name: "Move To Parent",
                                    tooltip: "Re-parent the selected objects.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => isSceneScope(args) && editorHasSelection(args)
                                        && args.activeEditor.getSelectedGameObjects()
                                            .length === args.activeEditor.getSelection().length,
                                    executeFunc: args => {
                                        const dlg = new ui.sceneobjects.ParentDialog(args.activeEditor);
                                        dlg.create();
                                    }
                                }
                            });
                        }
                        static registerTypeCommands(manager) {
                            // change type dialog
                            manager.add({
                                command: {
                                    id: commands.CMD_CONVERT_OBJECTS,
                                    name: "Replace Type",
                                    tooltip: "Replace the type of the selected objects.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => isSceneScope(args)
                                        && editor_10.ConvertTypeDialog.canConvert(args.activeEditor),
                                    executeFunc: args => {
                                        const dlg = new editor.ConvertTypeDialog(args.activeEditor);
                                        dlg.create();
                                    }
                                }
                            });
                            // change type to tile sprite
                            manager.add({
                                command: {
                                    id: commands.CMD_CONVERT_TO_TILE_SPRITE_OBJECTS,
                                    name: "Convert To TileSprite",
                                    tooltip: "Convert the selected objects into TileSprite instances. Or resize it if it is a TileSprite.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => isSceneScope(args)
                                        && editor_10.ConvertTypeDialog.canConvert(args.activeEditor),
                                    executeFunc: args => {
                                        const editor = args.activeEditor;
                                        editor.getUndoManager().add(new editor_10.undo.ConvertTypeOperation(editor, ui.sceneobjects.TileSpriteExtension.getInstance()));
                                    }
                                },
                                keys: {
                                    key: "L"
                                }
                            });
                            // open prefab
                            manager.add({
                                command: {
                                    id: commands.CMD_OPEN_PREFAB,
                                    name: "Open Prefab",
                                    category: commands.CAT_SCENE_EDITOR,
                                    tooltip: "Open the Prefab file of the selected prefab instance."
                                },
                                handler: {
                                    testFunc: args => {
                                        if (!isSceneScope(args)) {
                                            return false;
                                        }
                                        const editor = args.activeEditor;
                                        const sel = editor.getSelectedGameObjects();
                                        for (const obj of sel) {
                                            if (!obj.getEditorSupport().isPrefabInstance()) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    },
                                    executeFunc: args => {
                                        const editor = args.activeEditor;
                                        const sel = editor.getSelectedGameObjects();
                                        for (const obj of sel) {
                                            const file = obj.getEditorSupport().getPrefabFile();
                                            if (file) {
                                                colibri.Platform.getWorkbench().openEditor(file);
                                            }
                                        }
                                    }
                                },
                                keys: {
                                    key: "F"
                                }
                            });
                        }
                        static registerCompilerCommands(manager) {
                            // open compiled file
                            manager.add({
                                command: {
                                    id: commands.CMD_OPEN_COMPILED_FILE,
                                    icon: phasereditor2d.webContentTypes.WebContentTypesPlugin.getInstance().getIcon(phasereditor2d.webContentTypes.ICON_FILE_SCRIPT),
                                    name: "Open Output File",
                                    tooltip: "Open the output source file of the scene.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => args.activeEditor instanceof editor_10.SceneEditor,
                                    executeFunc: args => args.activeEditor.openSourceFileInEditor()
                                }
                            });
                            // compile scene editor
                            manager.add({
                                command: {
                                    id: commands.CMD_COMPILE_SCENE_EDITOR,
                                    icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_BUILD),
                                    name: "Compile Scene",
                                    tooltip: "Compile the editor's Scene.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => args.activeEditor instanceof editor_10.SceneEditor,
                                    executeFunc: args => args.activeEditor.compile(),
                                }
                            });
                            // compile all scene files
                            manager.add({
                                command: {
                                    id: commands.CMD_COMPILE_ALL_SCENE_FILES,
                                    icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_BUILD),
                                    name: "Compile Scenes",
                                    tooltip: "Compile all the Scene files of the project.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: args => args.activeWindow instanceof phasereditor2d.ide.ui.DesignWindow,
                                    executeFunc: args => scene.ScenePlugin.getInstance().compileAll(),
                                },
                                keys: {
                                    control: true,
                                    alt: true,
                                    key: "B"
                                }
                            });
                        }
                        static registerToolsCommands(manager) {
                            manager.add({
                                command: {
                                    id: commands.CMD_TRANSLATE_SCENE_OBJECT,
                                    name: "Translate Tool",
                                    icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_TRANSLATE),
                                    tooltip: "Translate the selected scene objects",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: isSceneScope,
                                    executeFunc: args => args.activeEditor
                                        .getToolsManager().swapTool(ui.sceneobjects.TranslateTool.ID)
                                },
                                keys: {
                                    key: "T"
                                }
                            });
                            manager.add({
                                command: {
                                    id: commands.CMD_ROTATE_SCENE_OBJECT,
                                    name: "Rotate Tool",
                                    icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_ANGLE),
                                    tooltip: "Rotate the selected scene objects",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: isSceneScope,
                                    executeFunc: args => args.activeEditor
                                        .getToolsManager().swapTool(ui.sceneobjects.RotateTool.ID)
                                },
                                keys: {
                                    key: "R"
                                }
                            });
                            manager.add({
                                command: {
                                    id: commands.CMD_SCALE_SCENE_OBJECT,
                                    name: "Scale Tool",
                                    icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_SCALE),
                                    tooltip: "Scale the selected scene objects",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: isSceneScope,
                                    executeFunc: args => args.activeEditor
                                        .getToolsManager().swapTool(ui.sceneobjects.ScaleTool.ID)
                                },
                                keys: {
                                    key: "S"
                                }
                            });
                            manager.add({
                                command: {
                                    id: commands.CMD_RESIZE_TILE_SPRITE_SCENE_OBJECT,
                                    name: "Resize TileSprite Tool",
                                    tooltip: "Resize selected TileSprite objects.",
                                    category: commands.CAT_SCENE_EDITOR
                                },
                                handler: {
                                    testFunc: isSceneScope,
                                    executeFunc: args => args.activeEditor
                                        .getToolsManager().swapTool(ui.sceneobjects.TileSpriteSizeTool.ID)
                                },
                                keys: {
                                    key: "Z"
                                }
                            });
                        }
                        static registerDepthCommands(manager) {
                            for (const tuple of [["Up", "PageUp"], ["Down", "PageDown"], ["Top", "Home"], ["Bottom", "End"]]) {
                                const move = tuple[0];
                                const key = tuple[1];
                                manager.add({
                                    command: {
                                        id: "phasereditor2d.scene.ui.editor.commands.Depth" + move,
                                        name: "Move Object " + move,
                                        category: commands.CAT_SCENE_EDITOR,
                                        tooltip: "Move the object in its container to " + move + "."
                                    },
                                    handler: {
                                        testFunc: args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,
                                        executeFunc: args => args.activeEditor.getUndoManager().add(new editor_10.undo.DepthOperation(args.activeEditor, move))
                                    },
                                    keys: {
                                        key
                                    }
                                });
                            }
                        }
                        static computeOriginCommandData() {
                            const names = [
                                "Top/Left",
                                "Top/Center",
                                "Top/Right",
                                "Middle/Left",
                                "Middle/Center",
                                "Middle/Right",
                                "Bottom/Left",
                                "Bottom/Center",
                                "Bottom/Right"
                            ];
                            const values = [
                                [0, 1],
                                [0.5, 1],
                                [1, 1],
                                [0, 0.5],
                                [0.5, 0.5],
                                [1, 0.5],
                                [0, 0],
                                [0.5, 0],
                                [1, 0],
                            ];
                            const list = [];
                            for (let i = 0; i < 9; i++) {
                                const id = "phasereditor2d.scene.ui.editor.commands.SetOrigin_" + (i + 1) + "_ToObject";
                                list.push({
                                    command: id,
                                    name: "Set Origin To " + names[i],
                                    x: values[i][0],
                                    y: values[i][1],
                                    key: (i + 1).toString(),
                                });
                            }
                            return list;
                        }
                        static registerOriginCommands(manager) {
                            const originProperty = {
                                name: "origin",
                                defValue: undefined,
                                getValue: obj => ({ x: obj.originX, y: obj.originY }),
                                setValue: (obj, value) => obj.setOrigin(value.x, value.y)
                            };
                            for (const data of this.computeOriginCommandData()) {
                                manager.add({
                                    command: {
                                        id: data.command,
                                        name: data.name,
                                        tooltip: `Set the origin of the object to (${data.x},${data.y}`,
                                        category: commands.CAT_SCENE_EDITOR
                                    },
                                    keys: {
                                        key: data.key,
                                        shift: true,
                                    },
                                    handler: {
                                        testFunc: args => isSceneScope(args) && args.activeEditor.getSelection().length > 0,
                                        executeFunc: args => {
                                            const objects = args.activeEditor.getSelection()
                                                .filter(obj => ui.sceneobjects.EditorSupport
                                                .hasObjectComponent(obj, ui.sceneobjects.TransformComponent));
                                            args.activeEditor.getUndoManager().add(new ui.sceneobjects.SimpleOperation(args.activeEditor, objects, originProperty, {
                                                x: data.x,
                                                y: data.y
                                            }));
                                        }
                                    },
                                });
                            }
                        }
                    }
                    commands.SceneEditorCommands = SceneEditorCommands;
                })(commands = editor_10.commands || (editor_10.commands = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_11) {
                var outline;
                (function (outline) {
                    class SceneEditorOutlineContentProvider {
                        getRoots(input) {
                            const editor = input;
                            const displayList = editor.getScene().sys.displayList;
                            const roots = [];
                            if (displayList) {
                                roots.push(displayList);
                            }
                            roots.push(editor.getScene().getObjectLists());
                            return roots;
                        }
                        getChildren(parent) {
                            if (parent instanceof Phaser.GameObjects.DisplayList) {
                                const list = [...parent.getChildren()];
                                list.reverse();
                                return list;
                            }
                            else if (parent instanceof Phaser.GameObjects.Container) {
                                if (parent.getEditorSupport().isPrefabInstance()) {
                                    return [];
                                }
                                const list = [...parent.list];
                                list.reverse();
                                return list;
                            }
                            else if (parent instanceof ui.sceneobjects.ObjectLists) {
                                return parent.getLists();
                            }
                            return [];
                        }
                    }
                    outline.SceneEditorOutlineContentProvider = SceneEditorOutlineContentProvider;
                })(outline = editor_11.outline || (editor_11.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var outline;
                (function (outline) {
                    class SceneEditorOutlineLabelProvider {
                        getLabel(obj) {
                            if (obj instanceof Phaser.GameObjects.GameObject) {
                                return obj.getEditorSupport().getLabel();
                            }
                            else if (obj instanceof Phaser.GameObjects.DisplayList) {
                                return "Display List";
                            }
                            else if (obj instanceof ui.sceneobjects.ObjectLists) {
                                return "Lists";
                            }
                            else if (obj instanceof ui.sceneobjects.ObjectList) {
                                return obj.getLabel();
                            }
                            return "" + obj;
                        }
                    }
                    outline.SceneEditorOutlineLabelProvider = SceneEditorOutlineLabelProvider;
                })(outline = editor.outline || (editor.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_12) {
                var outline;
                (function (outline) {
                    var ide = colibri.ui.ide;
                    class SceneEditorOutlineProvider extends ide.EditorViewerProvider {
                        constructor(editor) {
                            super();
                            this._editor = editor;
                        }
                        fillContextMenu(menu) {
                            this._editor.fillContextMenu(menu);
                        }
                        getUndoManager() {
                            return this._editor.getUndoManager();
                        }
                        getContentProvider() {
                            return new outline.SceneEditorOutlineContentProvider();
                        }
                        getLabelProvider() {
                            return new outline.SceneEditorOutlineLabelProvider();
                        }
                        getCellRendererProvider() {
                            return new outline.SceneEditorOutlineRendererProvider();
                        }
                        getTreeViewerRenderer(viewer) {
                            return new outline.SceneEditorOutlineViewerRenderer(viewer);
                        }
                        getPropertySectionProvider() {
                            return this._editor.getPropertyProvider();
                        }
                        getInput() {
                            return this._editor;
                        }
                        preload() {
                            return;
                        }
                        onViewerSelectionChanged(selection) {
                            this._editor.setSelection(selection, false);
                            this._editor.repaint();
                        }
                    }
                    outline.SceneEditorOutlineProvider = SceneEditorOutlineProvider;
                })(outline = editor_12.outline || (editor_12.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var outline;
                (function (outline) {
                    var controls = colibri.ui.controls;
                    class SceneEditorOutlineRendererProvider {
                        getCellRenderer(element) {
                            if (element instanceof Phaser.GameObjects.GameObject) {
                                const obj = element;
                                return obj.getEditorSupport().getCellRenderer();
                            }
                            else if (element instanceof Phaser.GameObjects.DisplayList
                                || element instanceof ui.sceneobjects.ObjectLists) {
                                return new controls.viewers.IconImageCellRenderer(colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_FOLDER));
                            }
                            else if (element instanceof ui.sceneobjects.ObjectList) {
                                return new controls.viewers.IconImageCellRenderer(scene.ScenePlugin.getInstance().getIcon(scene.ICON_LIST));
                            }
                            return new controls.viewers.EmptyCellRenderer(false);
                        }
                        async preload(args) {
                            return controls.Controls.resolveNothingLoaded();
                        }
                    }
                    outline.SceneEditorOutlineRendererProvider = SceneEditorOutlineRendererProvider;
                })(outline = editor.outline || (editor.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var outline;
                (function (outline) {
                    var controls = colibri.ui.controls;
                    class SceneEditorOutlineViewerRenderer extends controls.viewers.TreeViewerRenderer {
                        constructor(viewer) {
                            super(viewer, 48);
                        }
                        prepareContextForText(args) {
                            if (args.obj instanceof Phaser.GameObjects.GameObject) {
                                const obj = args.obj;
                                if (obj.getEditorSupport().isPrefabInstance()) {
                                    args.canvasContext.font = `italic ${controls.FONT_HEIGHT}px ${controls.FONT_FAMILY}`;
                                }
                            }
                            super.prepareContextForText(args);
                        }
                    }
                    outline.SceneEditorOutlineViewerRenderer = SceneEditorOutlineViewerRenderer;
                })(outline = editor.outline || (editor.outline = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class BaseSceneSection extends colibri.ui.controls.properties.PropertySection {
                        getHelp(key) {
                            return "";
                        }
                        getEditor() {
                            return colibri.Platform.getWorkbench()
                                .getActiveWindow().getEditorArea()
                                .getSelectedEditor();
                        }
                        getUndoManager() {
                            return this.getEditor().getUndoManager();
                        }
                    }
                    properties.BaseSceneSection = BaseSceneSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_13) {
                var properties;
                (function (properties) {
                    class SceneSection extends properties.BaseSceneSection {
                        getScene() {
                            return this.getSelection()[0];
                        }
                        canEdit(obj, n) {
                            return obj instanceof ui.Scene;
                        }
                        canEditNumber(n) {
                            return n === 1;
                        }
                        getSettings() {
                            return this.getScene().getSettings();
                        }
                        getHelp(key) {
                            return "TODO";
                        }
                        createStringField(comp, name, label, tooltip) {
                            const labelElement = this.createLabel(comp, label, tooltip);
                            const textElement = this.createText(comp);
                            this.addUpdater(() => {
                                textElement.value = this.getSettings()[name].toString();
                            });
                            textElement.addEventListener("change", e => {
                                const editor = this.getEditor();
                                editor.getUndoManager().add(new properties.ChangeSettingsPropertyOperation({
                                    editor: editor,
                                    props: [{
                                            name,
                                            value: textElement.value,
                                        }],
                                    repaint: true
                                }));
                            });
                            return {
                                label: labelElement,
                                text: textElement
                            };
                        }
                        createIntegerField(comp, name, label, tooltip) {
                            const labelElement = this.createLabel(comp, label, tooltip);
                            const textElement = this.createText(comp);
                            this.addUpdater(() => {
                                textElement.value = this.getSettings()[name].toString();
                            });
                            textElement.addEventListener("change", e => {
                                const editor = this.getEditor();
                                editor.getUndoManager().add(new properties.ChangeSettingsPropertyOperation({
                                    editor: editor,
                                    props: [{
                                            name: name,
                                            value: Number.parseInt(textElement.value, 10),
                                        }],
                                    repaint: true
                                }));
                            });
                            return {
                                label: labelElement,
                                text: textElement
                            };
                        }
                        createMenuField(comp, items, name, label, tooltip) {
                            this.createLabel(comp, label, tooltip);
                            const btn = this.createMenuButton(comp, "-", items, value => {
                                const editor = this.getEditor();
                                editor.getUndoManager().add(new properties.ChangeSettingsPropertyOperation({
                                    editor: editor,
                                    props: [{
                                            name: name,
                                            value: value,
                                        }],
                                    repaint: true
                                }));
                            });
                            this.addUpdater(() => {
                                const item = items.find(i => i.value === this.getSettings()[name]);
                                btn.textContent = item ? item.name : "-";
                            });
                        }
                        createBooleanField(comp, name, label) {
                            const checkElement = this.createCheckbox(comp, label);
                            this.addUpdater(() => {
                                checkElement.checked = this.getSettings()[name];
                            });
                            checkElement.addEventListener("change", e => {
                                const editor = this.getEditor();
                                editor.getUndoManager().add(new properties.ChangeSettingsPropertyOperation({
                                    editor: editor,
                                    props: [{
                                            name: name,
                                            value: checkElement.checked,
                                        }],
                                    repaint: true
                                }));
                            });
                            return checkElement;
                        }
                    }
                    properties.SceneSection = SceneSection;
                })(properties = editor_13.properties || (editor_13.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneSection.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class BorderSection extends properties.SceneSection {
                        constructor(page) {
                            super(page, "phasereditor2d.scene.ui.editor.properties.DisplaySection", "Border", false, true);
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 3);
                            comp.style.gridTemplateColumns = "auto auto 1fr auto 1fr";
                            this.createLabel(comp, "Border");
                            this.createIntegerField(comp, "borderX", "X", "Scene border position (X)");
                            this.createIntegerField(comp, "borderY", "Y", "Scene border position (Y)");
                            this.createLabel(comp, "");
                            this.createIntegerField(comp, "borderWidth", "Width", "Scene border width");
                            this.createIntegerField(comp, "borderHeight", "Height", "Scene border height");
                        }
                    }
                    properties.BorderSection = BorderSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_14) {
                var undo;
                (function (undo) {
                    var ide = colibri.ui.ide;
                    class SceneEditorOperation extends ide.undo.Operation {
                        constructor(editor) {
                            super();
                            this._editor = editor;
                        }
                        getEditor() {
                            return this._editor;
                        }
                        getScene() {
                            return this._editor.getScene();
                        }
                    }
                    undo.SceneEditorOperation = SceneEditorOperation;
                })(undo = editor_14.undo || (editor_14.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../undo/SceneEditorOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class ChangeSettingsPropertyOperation extends editor.undo.SceneEditorOperation {
                        constructor(args) {
                            super(args.editor);
                            this._props = args.props;
                            this._repaint = args.repaint;
                        }
                        async execute() {
                            const settings = this._editor.getScene().getSettings();
                            this._before = new Map();
                            this._after = new Map();
                            for (const prop of this._props) {
                                this._before.set(prop.name, settings[prop.name]);
                                this._after.set(prop.name, prop.value);
                            }
                            this.setValue(this._after);
                        }
                        setValue(value) {
                            const settings = this._editor.getScene().getSettings();
                            for (const prop of this._props) {
                                settings[prop.name] = value.get(prop.name);
                            }
                            this._editor.setSelection(this._editor.getSelection());
                            this._editor.setDirty(true);
                            if (this._repaint) {
                                this._editor.repaint();
                            }
                        }
                        undo() {
                            this.setValue(this._before);
                        }
                        redo() {
                            this.setValue(this._after);
                        }
                    }
                    properties.ChangeSettingsPropertyOperation = ChangeSettingsPropertyOperation;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class CompilerSection extends properties.SceneSection {
                        constructor(page) {
                            super(page, "phasereditor2d.scene.ui.editor.properties.CompilerSection", "Compiler", false, true);
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 3);
                            comp.style.gridTemplateColumns = "auto 1fr";
                            // this.createMenuField(
                            //     comp, [
                            //     {
                            //         name: "Scene",
                            //         value: core.json.SceneType.SCENE,
                            //     },
                            //     {
                            //         name: "Prefab",
                            //         value: core.json.SceneType.PREFAB,
                            //     }],
                            //     "sceneType", "Scene Type",
                            //     "If this is a regular scene or a prefab.");
                            this.createMenuField(comp, [
                                {
                                    name: "JavaScript",
                                    value: scene.core.json.SourceLang.JAVA_SCRIPT,
                                },
                                {
                                    name: "TypeScript",
                                    value: scene.core.json.SourceLang.TYPE_SCRIPT
                                }
                            ], "compilerOutputLanguage", "Output Language", "The scene compiler output language.");
                            this.createStringField(comp, "superClassName", "Super Class", "The super class used for the scene. If it is blank (no-value) then use default value.");
                            this.createStringField(comp, "createMethodName", "Create Method", "The name of the create method.");
                        }
                    }
                    properties.CompilerSection = CompilerSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    var controls = colibri.ui.controls;
                    class SceneCompilerSection extends properties.SceneSection {
                        constructor(page) {
                            super(page, "phasereditor2d.scene.ui.editor.properties.SceneCompilerSection", "Scene Compiler", false, true);
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 3);
                            comp.style.gridTemplateColumns = "auto 1fr";
                            this.createStringField(comp, "sceneKey", "Scene Key", "The key of the scene. Used when the scene is loaded with the Phaser loader.");
                            this.createBooleanField(comp, "onlyGenerateMethods", this.createLabel(comp, "Only Generate Methods", "No class code is generated, only the \"create\" or \"preload\" methods."));
                            this.createPreloadPackFilesField(comp);
                            this.createStringField(comp, "preloadMethodName", "Preload Method", "The name of the preload method. It may be empty.");
                        }
                        createPreloadPackFilesField(parent) {
                            this.createLabel(parent, "Preload Pack Files", "The Pack files to be loaded in this scene.");
                            const btn = this.createButton(parent, "0 selected", (e) => {
                                const viewer = new controls.viewers.TreeViewer();
                                viewer.setLabelProvider(new phasereditor2d.files.ui.viewers.FileLabelProvider());
                                viewer.setCellRendererProvider(new phasereditor2d.files.ui.viewers.FileCellRendererProvider("tree"));
                                viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                                const finder = this.getEditor().getPackFinder();
                                const packs = viewer.setInput(finder.getPacks().map(pack => pack.getFile()));
                                viewer.setSelection(this.getSettings().preloadPackFiles
                                    .map(name => finder.getPacks().find(pack => pack.getFile().getFullName() === name))
                                    .filter(pack => pack !== null && pack !== undefined)
                                    .map(pack => pack.getFile()));
                                const dlg = new controls.dialogs.ViewerDialog(viewer);
                                const selectionCallback = (files) => {
                                    const names = files.map(file => file.getFullName());
                                    this.getEditor().getUndoManager().add(new properties.ChangeSettingsPropertyOperation({
                                        editor: this.getEditor(),
                                        props: [{
                                                name: "preloadPackFiles",
                                                value: names
                                            }],
                                        repaint: false
                                    }));
                                    this.updateWithSelection();
                                    dlg.close();
                                };
                                dlg.create();
                                dlg.setTitle("Select Pack Files");
                                const selectBtn = dlg.addButton("Select", () => {
                                    selectionCallback(viewer.getSelection());
                                });
                                selectBtn.textContent = "Select " + viewer.getSelection().length + " Files";
                                viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, () => {
                                    selectBtn.textContent = "Select " + viewer.getSelection().length + " Files";
                                });
                                dlg.addButton("Clear", () => {
                                    viewer.setSelection([]);
                                });
                                dlg.addButton("Cancel", () => {
                                    dlg.close();
                                });
                                viewer.addEventListener(controls.viewers.EVENT_OPEN_ITEM, _ => {
                                    selectionCallback([viewer.getSelection()[0]]);
                                });
                            });
                            this.addUpdater(() => {
                                btn.textContent = this.getSettings().preloadPackFiles.length + " selected";
                            });
                        }
                        canEdit(obj, n) {
                            return obj instanceof ui.Scene && obj.getSettings().sceneType === scene.core.json.SceneType.SCENE;
                        }
                    }
                    properties.SceneCompilerSection = SceneCompilerSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_15) {
                var properties;
                (function (properties) {
                    var controls = colibri.ui.controls;
                    class SceneEditorSectionProvider extends controls.properties.PropertySectionProvider {
                        constructor(editor) {
                            super();
                            this._editor = editor;
                        }
                        getEmptySelectionObject() {
                            return this._editor.getScene();
                        }
                        addSections(page, sections) {
                            sections.push(new properties.SnappingSection(page), new properties.BorderSection(page), new properties.CompilerSection(page), new properties.SceneCompilerSection(page));
                            const exts = colibri.Platform
                                .getExtensions(properties.SceneEditorPropertySectionExtension.POINT_ID);
                            for (const ext of exts) {
                                for (const provider of ext.getSectionProviders()) {
                                    sections.push(provider(page));
                                }
                            }
                        }
                    }
                    properties.SceneEditorSectionProvider = SceneEditorSectionProvider;
                })(properties = editor_15.properties || (editor_15.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class SceneEditorPropertySectionExtension extends colibri.Extension {
                        constructor(...sectionProviders) {
                            super(SceneEditorPropertySectionExtension.POINT_ID);
                            this._sectionProviders = sectionProviders;
                        }
                        getSectionProviders() {
                            return this._sectionProviders;
                        }
                    }
                    SceneEditorPropertySectionExtension.POINT_ID = "phasereditor2d.scene.ui.editor.properties.SceneEditorPropertySectionExtension";
                    properties.SceneEditorPropertySectionExtension = SceneEditorPropertySectionExtension;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var properties;
                (function (properties) {
                    class SnappingSection extends properties.SceneSection {
                        constructor(page) {
                            super(page, "phasereditor2d.scene.ui.editor.properties.SnappingSection", "Snapping");
                        }
                        createForm(parent) {
                            const comp = this.createGridElement(parent, 3);
                            comp.style.gridTemplateColumns = "auto auto 1fr auto 1fr";
                            {
                                const label = this.createLabel(comp, "Enabled", "Enable snapping");
                                label.style.gridColumn = "1 / span 2";
                                this.createBooleanField(comp, "snapEnabled", label)
                                    .style.gridColumn = "3 / span 3";
                            }
                            this.createLabel(comp, "Size");
                            this.createIntegerField(comp, "snapWidth", "Width", "Scene snapping width.");
                            this.createIntegerField(comp, "snapHeight", "Height", "Scene snapping height.");
                        }
                    }
                    properties.SnappingSection = SnappingSection;
                })(properties = editor.properties || (editor.properties = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var tools;
                (function (tools) {
                    class SceneToolItem {
                        getScreenPointOfObject(args, obj, fx, fy) {
                            const worldPoint = new Phaser.Geom.Point(0, 0);
                            const sprite = obj;
                            const x = sprite.width * fx;
                            const y = sprite.height * fy;
                            sprite.getWorldTransformMatrix().transformPoint(x, y, worldPoint);
                            return args.camera.getScreenPoint(worldPoint.x, worldPoint.y);
                        }
                        getScreenToObjectScale(args, obj) {
                            let x = args.camera.zoom;
                            let y = args.camera.zoom;
                            const sprite = obj;
                            let next = sprite.parentContainer;
                            while (next) {
                                x *= next.scaleX;
                                y *= next.scaleY;
                                next = next.parentContainer;
                            }
                            return { x, y };
                        }
                        globalAngle(sprite) {
                            let a = sprite.angle;
                            const parent = sprite.parentContainer;
                            if (parent) {
                                a += this.globalAngle(parent);
                            }
                            return a;
                        }
                        drawArrowPath(ctx, color) {
                            ctx.save();
                            ctx.fillStyle = color;
                            ctx.strokeStyle = "#000";
                            ctx.beginPath();
                            ctx.moveTo(0, -6);
                            ctx.lineTo(12, 0);
                            ctx.lineTo(0, 6);
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();
                            ctx.restore();
                        }
                        drawCircle(ctx, color) {
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.arc(0, 0, 6, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = "#000";
                            ctx.stroke();
                        }
                        drawRect(ctx, color) {
                            ctx.save();
                            ctx.translate(-5, -5);
                            ctx.beginPath();
                            ctx.rect(0, 0, 10, 10);
                            ctx.fillStyle = color;
                            ctx.strokeStyle = "#000";
                            ctx.fill();
                            ctx.stroke();
                            ctx.restore();
                        }
                        getAvgScreenPointOfObjects(args, fx = obj => 0, fy = obj => 0) {
                            let avgY = 0;
                            let avgX = 0;
                            for (const obj of args.objects) {
                                const point = this.getScreenPointOfObject(args, obj, fx(obj), fy(obj));
                                avgX += point.x;
                                avgY += point.y;
                            }
                            avgX /= args.objects.length;
                            avgY /= args.objects.length;
                            return new Phaser.Math.Vector2(avgX, avgY);
                        }
                    }
                    tools.SceneToolItem = SceneToolItem;
                })(tools = editor.tools || (editor.tools = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneToolItem.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var tools;
                (function (tools) {
                    class PointToolItem extends tools.SceneToolItem {
                        constructor(color) {
                            super();
                            this._color = color;
                        }
                        render(args) {
                            const point = this.getPoint(args);
                            const ctx = args.canvasContext;
                            ctx.fillStyle = args.canEdit ? this._color : editor.tools.SceneTool.COLOR_CANNOT_EDIT;
                            ctx.beginPath();
                            ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = "#000";
                            ctx.stroke();
                        }
                        containsPoint(args) {
                            return false;
                        }
                        onStartDrag(args) {
                            // nothing
                        }
                        onDrag(args) {
                            // nothing
                        }
                        onStopDrag(args) {
                            // nothing
                        }
                    }
                    tools.PointToolItem = PointToolItem;
                })(tools = editor.tools || (editor.tools = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./PointToolItem.ts"/>
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var tools;
                (function (tools) {
                    class CenterPointToolItem extends tools.PointToolItem {
                        constructor(color) {
                            super(color);
                        }
                        getPoint(args) {
                            return this.getAvgScreenPointOfObjects(args);
                        }
                    }
                    tools.CenterPointToolItem = CenterPointToolItem;
                })(tools = editor.tools || (editor.tools = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneToolItem.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var tools;
                (function (tools_1) {
                    class LineToolItem extends tools_1.SceneToolItem {
                        constructor(color, ...tools) {
                            super();
                            this._color = color;
                            this._tools = tools;
                        }
                        render(args) {
                            const ctx = args.canvasContext;
                            ctx.save();
                            ctx.beginPath();
                            let start = true;
                            for (const tool of this._tools) {
                                const { x, y } = tool.getPoint(args);
                                if (start) {
                                    ctx.moveTo(x, y);
                                }
                                else {
                                    ctx.lineTo(x, y);
                                }
                                start = false;
                            }
                            ctx.strokeStyle = "#000";
                            ctx.lineWidth = 4;
                            ctx.stroke();
                            ctx.strokeStyle = args.canEdit ? this._color : tools_1.SceneTool.COLOR_CANNOT_EDIT;
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            ctx.restore();
                        }
                        containsPoint(args) {
                            return false;
                        }
                        onStartDrag(args) {
                            // nothing
                        }
                        onDrag(args) {
                            // nothing
                        }
                        onStopDrag(args) {
                            // nothing
                        }
                    }
                    tools_1.LineToolItem = LineToolItem;
                })(tools = editor.tools || (editor.tools = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var tools;
                (function (tools) {
                    class SceneTool {
                        constructor(config) {
                            this._config = config;
                            this._items = [];
                        }
                        getId() {
                            return this._config.id;
                        }
                        getCommandId() {
                            return this._config.command;
                        }
                        getItems() {
                            return this._items;
                        }
                        addItems(...items) {
                            this._items.push(...items);
                        }
                        render(args) {
                            for (const item of this._items) {
                                item.render(args);
                            }
                        }
                        containsPoint(args) {
                            for (const item of this._items) {
                                if (item.containsPoint(args)) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        onStartDrag(args) {
                            for (const item of this._items) {
                                item.onStartDrag(args);
                            }
                        }
                        onDrag(args) {
                            for (const item of this._items) {
                                item.onDrag(args);
                            }
                        }
                        onStopDrag(args) {
                            for (const item of this._items) {
                                item.onStopDrag(args);
                            }
                        }
                    }
                    SceneTool.COLOR_CANNOT_EDIT = "#808080";
                    tools.SceneTool = SceneTool;
                })(tools = editor.tools || (editor.tools = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var tools;
                (function (tools_2) {
                    class SceneToolExtension extends colibri.Extension {
                        constructor(...tools) {
                            super(SceneToolExtension.POINT_ID);
                            this._tools = tools;
                        }
                        getTools() {
                            return this._tools;
                        }
                    }
                    SceneToolExtension.POINT_ID = "phasereditor2d.scene.ui.editor.tools.SceneToolExtension";
                    tools_2.SceneToolExtension = SceneToolExtension;
                })(tools = editor.tools || (editor.tools = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor) {
                var tools;
                (function (tools) {
                    class SceneToolOperation extends editor.undo.SceneEditorOperation {
                        constructor(toolArgs) {
                            super(toolArgs.editor);
                            this._objects = toolArgs.objects;
                            this._values0 = new Map();
                            this._values1 = new Map();
                        }
                        async execute() {
                            for (const obj of this._objects) {
                                const sprite = obj;
                                const value0 = this.getInitialValue(sprite);
                                const value1 = this.getFinalValue(sprite);
                                const id = sprite.getEditorSupport().getId();
                                this._values0.set(id, value0);
                                this._values1.set(id, value1);
                            }
                            this.getEditor().setDirty(true);
                        }
                        setValues(values) {
                            for (const obj of this._objects) {
                                const sprite = obj;
                                const id = sprite.getEditorSupport().getId();
                                const value = values.get(id);
                                this.setValue(obj, value);
                            }
                            this._editor.setDirty(true);
                            this._editor.dispatchSelectionChanged();
                        }
                        undo() {
                            this.setValues(this._values0);
                        }
                        redo() {
                            this.setValues(this._values1);
                        }
                    }
                    tools.SceneToolOperation = SceneToolOperation;
                })(tools = editor.tools || (editor.tools = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_16) {
                var tools;
                (function (tools) {
                    class SceneToolsManager {
                        constructor(editor) {
                            this._editor = editor;
                            const exts = colibri.Platform.getExtensions(tools.SceneToolExtension.POINT_ID);
                            this._tools = exts.flatMap(ext => ext.getTools());
                            this.setActiveTool(this.findTool(ui.sceneobjects.TranslateTool.ID));
                        }
                        setState(state) {
                            if (state) {
                                const id = state.selectedId;
                                const tool = this.findTool(id);
                                if (tool) {
                                    this.setActiveTool(tool);
                                }
                            }
                        }
                        getState() {
                            return {
                                selectedId: this._activeTool ? this._activeTool.getId() : undefined
                            };
                        }
                        findTool(toolId) {
                            return this._tools.find(tool => tool.getId() === toolId);
                        }
                        getActiveTool() {
                            return this._activeTool;
                        }
                        setActiveTool(tool) {
                            this.updateAction(this._activeTool, false);
                            this.updateAction(tool, true);
                            this._activeTool = tool;
                            this._editor.repaint();
                        }
                        updateAction(tool, selected) {
                            if (tool) {
                                const action = this._editor.getToolActionMap().get(tool.getId());
                                if (action) {
                                    action.setSelected(selected);
                                }
                            }
                        }
                        swapTool(toolId) {
                            const tool = this.findTool(toolId);
                            this.setActiveTool(tool === this._activeTool ? null : tool);
                        }
                    }
                    tools.SceneToolsManager = SceneToolsManager;
                })(tools = editor_16.tools || (editor_16.tools = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_11) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_17) {
                var undo;
                (function (undo) {
                    class SceneSnapshotOperation extends undo.SceneEditorOperation {
                        constructor(editor) {
                            super(editor);
                        }
                        async execute() {
                            this._before = this.takeSnapshot();
                            await this.performModification();
                            this._after = this.takeSnapshot();
                            this._editor.setDirty(true);
                            this._editor.refreshOutline();
                        }
                        takeSnapshot() {
                            const scene = this.getScene();
                            return {
                                displayList: scene.getDisplayListChildren().map(obj => {
                                    const data = {};
                                    obj.getEditorSupport().writeJSON(data);
                                    return data;
                                }),
                                lists: scene.getObjectLists().getLists().map(list => {
                                    const data = {};
                                    list.writeJSON(data);
                                    return data;
                                }),
                                selection: this.getEditor().getSelectionManager().getSelectionIds()
                            };
                        }
                        loadSnapshot(snapshot) {
                            const editor = this.getEditor();
                            const scene = this.getScene();
                            const maker = scene.getMaker();
                            scene.removeAll();
                            for (const data of snapshot.displayList) {
                                maker.createObject(data);
                            }
                            scene.getObjectLists().readJSON_lists(snapshot.lists);
                            editor.setDirty(true);
                            editor.repaint();
                            editor.refreshOutline();
                            editor.getSelectionManager().setSelectionByIds(snapshot.selection);
                        }
                        undo() {
                            this.loadSnapshot(this._before);
                        }
                        redo() {
                            this.loadSnapshot(this._after);
                        }
                    }
                    undo.SceneSnapshotOperation = SceneSnapshotOperation;
                })(undo = editor_17.undo || (editor_17.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_11.ui || (scene_11.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneSnapshotOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_18) {
                var undo;
                (function (undo) {
                    var io = colibri.core.io;
                    class AddObjectOperation extends undo.SceneSnapshotOperation {
                        constructor(editor, type, extraData) {
                            super(editor);
                            this._type = type;
                            this._extraData = extraData;
                        }
                        async performModification() {
                            const maker = this._editor.getSceneMaker();
                            let obj;
                            if (this._type instanceof io.FilePath) {
                                obj = await maker.createPrefabInstanceWithFile(this._type);
                            }
                            else {
                                obj = maker.createEmptyObject(this._type, this._extraData);
                            }
                            this.getEditor().setSelection([obj]);
                        }
                    }
                    undo.AddObjectOperation = AddObjectOperation;
                })(undo = editor_18.undo || (editor_18.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_12) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_19) {
                var undo;
                (function (undo) {
                    class ObjectSnapshotOperation extends undo.SceneEditorOperation {
                        constructor(editor, objects) {
                            super(editor);
                            this._objects = objects;
                        }
                        async execute() {
                            this._before = this.takeSnapshot(this._objects);
                            this._after = this.makeChangeSnapshot(this._objects);
                            this.loadSnapshot(this._after);
                        }
                        takeSnapshot(objects) {
                            const snapshot = {
                                objects: []
                            };
                            for (const obj of objects) {
                                const data = {};
                                obj.getEditorSupport().writeJSON(data);
                                let parentId;
                                const sprite = obj;
                                if (sprite.parentContainer) {
                                    parentId = sprite.parentContainer.getEditorSupport().getId();
                                }
                                snapshot.objects.push({
                                    parentId,
                                    objData: data
                                });
                            }
                            return snapshot;
                        }
                        async loadSnapshot(snapshot) {
                            const scene = this.getScene();
                            const maker = scene.getMaker();
                            const selectionIds = this.getEditor().getSelectionManager().getSelectionIds();
                            await maker.updateSceneLoaderWithObjDataList(snapshot.objects.map(objSnapshot => objSnapshot.objData));
                            for (const objSnapshot of snapshot.objects) {
                                const oldObj = scene.getByEditorId(objSnapshot.objData.id);
                                if (oldObj) {
                                    const objData = objSnapshot.objData;
                                    const newObj = maker.createObject(objData);
                                    scene.sys.displayList.remove(newObj);
                                    if (objSnapshot.parentId) {
                                        const parent = scene.getByEditorId(objSnapshot.parentId);
                                        if (parent) {
                                            parent.replace(oldObj, newObj);
                                        }
                                    }
                                    else {
                                        scene.sys.displayList.replace(oldObj, newObj);
                                    }
                                    oldObj.getEditorSupport().destroy();
                                }
                            }
                            await this.getEditor().refreshDependenciesHash();
                            this._editor.setDirty(true);
                            this._editor.getSelectionManager().setSelectionByIds(selectionIds);
                        }
                        undo() {
                            this.loadSnapshot(this._before);
                        }
                        redo() {
                            this.loadSnapshot(this._after);
                        }
                    }
                    undo.ObjectSnapshotOperation = ObjectSnapshotOperation;
                })(undo = editor_19.undo || (editor_19.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_12.ui || (scene_12.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./ObjectSnapshotOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_20) {
                var undo;
                (function (undo) {
                    var io = colibri.core.io;
                    class ConvertTypeOperation extends undo.ObjectSnapshotOperation {
                        constructor(editor, targetType) {
                            super(editor, ConvertTypeOperation.filterObjects(editor.getSelectedGameObjects(), targetType));
                            this._targetType = targetType;
                        }
                        async execute() {
                            if (this._targetType instanceof io.FilePath) {
                                const finder = scene.ScenePlugin.getInstance().getSceneFinder();
                                const sceneData = finder.getSceneData(this._targetType);
                                await this.getEditor().getSceneMaker().updateSceneLoader(sceneData);
                            }
                            await super.execute();
                        }
                        makeChangeSnapshot(input) {
                            const result = {
                                objects: []
                            };
                            const finder = scene.ScenePlugin.getInstance().getSceneFinder();
                            for (const obj of input) {
                                let parentId;
                                if (obj.parentContainer) {
                                    parentId = obj.getEditorSupport().getParentId();
                                }
                                const support = obj.getEditorSupport();
                                const objData = {};
                                support.writeJSON(objData);
                                if (support.isPrefabInstance()) {
                                    delete objData.prefabId;
                                }
                                else {
                                    delete objData.type;
                                }
                                if (this._targetType instanceof io.FilePath) {
                                    objData.prefabId = finder.getPrefabId(this._targetType);
                                }
                                else {
                                    objData.type = this._targetType.getTypeName();
                                }
                                const ser = this._editor.getScene().getMaker().getSerializer(objData);
                                const type = ser.getType();
                                const ext = scene.ScenePlugin.getInstance().getObjectExtensionByObjectType(type);
                                ext.adaptDataAfterTypeConversion(ser, obj);
                                result.objects.push({
                                    objData,
                                    parentId
                                });
                            }
                            return result;
                        }
                        static filterObjects(input, targetType) {
                            return input.filter(obj => {
                                if (obj.getEditorSupport().isPrefabInstance()) {
                                    if (obj.getEditorSupport().getPrefabFile() === targetType) {
                                        return false;
                                    }
                                }
                                else if (obj.getEditorSupport().getExtension() === targetType) {
                                    return false;
                                }
                                return true;
                            });
                        }
                    }
                    undo.ConvertTypeOperation = ConvertTypeOperation;
                })(undo = editor_20.undo || (editor_20.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_21) {
                var undo;
                (function (undo) {
                    class CreateObjectWithAssetOperation extends undo.SceneSnapshotOperation {
                        constructor(editor, e, data) {
                            super(editor);
                            this._e = e;
                            this._data = data;
                        }
                        async performModification() {
                            const sprites = await this.getEditor().getDropManager().createWithDropEvent(this._e, this._data);
                            this.getEditor().setSelection(sprites);
                        }
                    }
                    undo.CreateObjectWithAssetOperation = CreateObjectWithAssetOperation;
                })(undo = editor_21.undo || (editor_21.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneSnapshotOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_22) {
                var undo;
                (function (undo) {
                    class CutOperation extends undo.SceneSnapshotOperation {
                        constructor(editor) {
                            super(editor);
                        }
                        async performModification() {
                            this._editor.getClipboardManager().copy();
                            const lists = this._editor.getScene().getObjectLists();
                            for (const obj of this._editor.getSelection()) {
                                if (obj instanceof Phaser.GameObjects.GameObject) {
                                    const sprite = obj;
                                    sprite.getEditorSupport().destroy();
                                    lists
                                        .removeObjectById(sprite.getEditorSupport().getId());
                                }
                                else if (obj instanceof ui.sceneobjects.ObjectList) {
                                    lists.removeListById(obj.getId());
                                }
                            }
                            this._editor.setSelection([]);
                        }
                    }
                    undo.CutOperation = CutOperation;
                })(undo = editor_22.undo || (editor_22.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_23) {
                var undo;
                (function (undo) {
                    class DeleteOperation extends undo.SceneSnapshotOperation {
                        constructor(editor) {
                            super(editor);
                        }
                        async performModification() {
                            const editor = this._editor;
                            const lists = editor.getScene().getObjectLists();
                            for (const obj of editor.getSelectedGameObjects()) {
                                obj.getEditorSupport().destroy();
                                lists.removeObjectById(obj.getEditorSupport().getId());
                            }
                            for (const obj of editor.getSelectedLists()) {
                                lists.removeListById(obj.getId());
                            }
                            editor.setSelection([]);
                        }
                    }
                    undo.DeleteOperation = DeleteOperation;
                })(undo = editor_23.undo || (editor_23.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_24) {
                var undo;
                (function (undo) {
                    class DepthOperation extends undo.SceneSnapshotOperation {
                        constructor(editor, depthMove) {
                            super(editor);
                            this._depthMove = depthMove;
                        }
                        performModification() {
                            const objects = this.getEditor().getSelectedGameObjects();
                            const displayList = this.getScene().sys.displayList;
                            objects.sort((a, b) => {
                                const aa = a.parentContainer ? a.parentContainer.getIndex(a) : displayList.getIndex(a);
                                const bb = b.parentContainer ? b.parentContainer.getIndex(b) : displayList.getIndex(b);
                                return aa - bb;
                            });
                            switch (this._depthMove) {
                                case "Top":
                                    for (const obj of objects) {
                                        (obj.parentContainer || displayList).bringToTop(obj);
                                    }
                                    break;
                                case "Bottom":
                                    for (let i = 0; i < objects.length; i++) {
                                        const obj = objects[objects.length - i - 1];
                                        (obj.parentContainer || displayList).sendToBack(obj);
                                    }
                                    break;
                                case "Up":
                                    for (let i = 0; i < objects.length; i++) {
                                        const obj = objects[objects.length - i - 1];
                                        (obj.parentContainer || displayList).moveUp(obj);
                                    }
                                    break;
                                case "Down":
                                    for (const obj of objects) {
                                        (obj.parentContainer || displayList).moveDown(obj);
                                    }
                                    break;
                            }
                            this.getEditor().repaint();
                        }
                    }
                    undo.DepthOperation = DepthOperation;
                })(undo = editor_24.undo || (editor_24.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneSnapshotOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_25) {
                var undo;
                (function (undo) {
                    class PasteOperation extends undo.SceneSnapshotOperation {
                        constructor(editor) {
                            super(editor);
                        }
                        async performModification() {
                            const items = this.getEditor().getClipboardManager().getClipboardCopy();
                            const maker = this._editor.getSceneMaker();
                            const sel = [];
                            const nameMaker = new colibri.ui.ide.utils.NameMaker((obj) => obj.getEditorSupport().getLabel());
                            this.getScene().visitAskChildren(obj => {
                                nameMaker.update([obj]);
                                return !obj.getEditorSupport().isPrefabInstance();
                            });
                            for (const item of items) {
                                if (item.type === "ISceneObject") {
                                    const data = item.data;
                                    data.id = Phaser.Utils.String.UUID();
                                    data.label = nameMaker.makeName(data.label);
                                    const { x, y } = this.getEditor().getMouseManager().getDropPosition();
                                    data["x"] = data["x"] + x;
                                    data["y"] = data["y"] + y;
                                    const obj = maker.createObject(data);
                                    sel.push(obj);
                                }
                            }
                            this._editor.setSelection(sel);
                        }
                    }
                    undo.PasteOperation = PasteOperation;
                })(undo = editor_25.undo || (editor_25.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var code = scene.core.code;
                var read = colibri.core.json.read;
                var write = colibri.core.json.write;
                class Component {
                    constructor(obj, properties) {
                        this._obj = obj;
                        this._properties = new Set(properties);
                    }
                    getProperties() {
                        return this._properties;
                    }
                    getObject() {
                        return this._obj;
                    }
                    write(ser, ...properties) {
                        for (const prop of properties) {
                            ser.write(prop.name, prop.getValue(this._obj), prop.defValue);
                        }
                    }
                    read(ser, ...properties) {
                        for (const prop of properties) {
                            const value = ser.read(prop.name, prop.defValue);
                            prop.setValue(this._obj, value);
                        }
                    }
                    writeLocal(ser, ...properties) {
                        for (const prop of properties) {
                            write(ser.getData(), prop.name, prop.getValue(this._obj), prop.defValue);
                        }
                    }
                    readLocal(ser, ...properties) {
                        for (const prop of properties) {
                            const value = read(ser.getData(), prop.name, prop.defValue);
                            prop.setValue(this._obj, value);
                        }
                    }
                    buildSetObjectPropertyCodeDOM_String(fieldName, value, defValue, args) {
                        const dom = new code.AssignPropertyCodeDOM(fieldName, args.objectVarName);
                        let add = false;
                        if (args.prefabSerializer) {
                            add = value !== args.prefabSerializer.read(fieldName, defValue);
                        }
                        else {
                            add = value !== defValue;
                        }
                        if (add) {
                            dom.valueLiteral(value);
                            args.result.push(dom);
                        }
                    }
                    buildSetObjectPropertyCodeDOM_StringProperty(args, ...properties) {
                        for (const prop of properties) {
                            this.buildSetObjectPropertyCodeDOM_String(prop.name, prop.getValue(this.getObject()), prop.defValue, args);
                        }
                    }
                    buildSetObjectPropertyCodeDOM_BooleanProperty(args, ...properties) {
                        for (const prop of properties) {
                            this.buildSetObjectPropertyCodeDOM_Boolean(prop.name, prop.getValue(this.getObject()), prop.defValue, args);
                        }
                    }
                    buildSetObjectPropertyCodeDOM_Boolean(fieldName, value, defValue, args) {
                        const dom = new code.AssignPropertyCodeDOM(fieldName, args.objectVarName);
                        let add = false;
                        if (args.prefabSerializer) {
                            add = value !== args.prefabSerializer.read(fieldName, defValue);
                        }
                        else {
                            add = value !== defValue;
                        }
                        if (add) {
                            dom.valueBool(value);
                            args.result.push(dom);
                        }
                    }
                    buildSetObjectPropertyCodeDOM_FloatProperty(args, ...properties) {
                        for (const prop of properties) {
                            this.buildSetObjectPropertyCodeDOM_Float(prop.name, prop.getValue(this.getObject()), prop.defValue, args);
                        }
                    }
                    buildSetObjectPropertyCodeDOM_Float(fieldName, value, defValue, args) {
                        const dom = new code.AssignPropertyCodeDOM(fieldName, args.objectVarName);
                        let add = false;
                        if (args.prefabSerializer) {
                            add = value !== args.prefabSerializer.read(fieldName, defValue);
                        }
                        else {
                            add = value !== defValue;
                        }
                        if (add) {
                            dom.valueFloat(value);
                            args.result.push(dom);
                        }
                    }
                    async buildDependenciesHash(args) {
                        // nothing by default
                    }
                    writeJSON(ser) {
                        for (const prop of this._properties) {
                            if (prop.local) {
                                this.writeLocal(ser, prop);
                            }
                            else {
                                this.write(ser, prop);
                            }
                        }
                    }
                    readJSON(ser) {
                        for (const prop of this._properties) {
                            if (prop.local) {
                                this.readLocal(ser, prop);
                            }
                            else {
                                this.read(ser, prop);
                            }
                        }
                    }
                }
                sceneobjects.Component = Component;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_13) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                let ObjectScope;
                (function (ObjectScope) {
                    ObjectScope["METHOD"] = "METHOD";
                    ObjectScope["CLASS"] = "CLASS";
                    ObjectScope["PUBLIC"] = "PUBLIC";
                })(ObjectScope = sceneobjects.ObjectScope || (sceneobjects.ObjectScope = {}));
                class EditorSupport {
                    constructor(extension, obj, scene) {
                        this._extension = extension;
                        this._object = obj;
                        this._scene = scene;
                        this._label = extension.getTypeName().toLocaleLowerCase();
                        this._scope = ObjectScope.METHOD;
                        this._unlockedProperties = new Set();
                        this._serializables = [];
                        this._componentMap = new Map();
                        this._object.setDataEnabled();
                        this.setId(Phaser.Utils.String.UUID());
                        this.addComponent(new sceneobjects.VariableComponent(this._object));
                        this.setInteractive();
                        scene.sys.displayList.add(obj);
                    }
                    computeContentHash() {
                        return "";
                    }
                    destroy() {
                        const obj = this.getObject();
                        obj.disableInteractive();
                        obj.destroy();
                        obj.active = false;
                        obj.visible = false;
                        // hack, to remove the object from the input list
                        const list = this._scene.input["_list"];
                        const i = list.indexOf(obj);
                        if (i > 0) {
                            list.splice(i, 1);
                        }
                    }
                    isMethodScope() {
                        return this._scope === ObjectScope.METHOD;
                    }
                    hasProperty(property) {
                        for (const comp of this._componentMap.values()) {
                            if (comp.getProperties().has(property)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    isLockedProperty(property) {
                        return !this.isUnlockedProperty(property);
                    }
                    isUnlockedProperty(property) {
                        if (property === sceneobjects.TransformComponent.x || property === sceneobjects.TransformComponent.y) {
                            return true;
                        }
                        if (this.isPrefabInstance()) {
                            return this._unlockedProperties.has(property.name);
                        }
                        return true;
                    }
                    setUnlockedProperty(property, unlock) {
                        if (unlock) {
                            this._unlockedProperties.add(property.name);
                        }
                        else {
                            this._unlockedProperties.delete(property.name);
                        }
                    }
                    static async buildPrefabDependencyHash(builder, prefabId) {
                        if (!prefabId) {
                            return;
                        }
                        const finder = scene_13.ScenePlugin.getInstance().getSceneFinder();
                        const file = finder.getPrefabFile(prefabId);
                        if (!file) {
                            return;
                        }
                        const token = "prefab(" + prefabId + "," + file.getModTime() + ")";
                        builder.addPartialToken(token);
                        const sceneData = finder.getSceneData(file);
                        if (!sceneData) {
                            return;
                        }
                        for (const objData of sceneData.displayList) {
                            this.buildPrefabDependencyHash(builder, objData.prefabId);
                        }
                    }
                    async buildDependencyHash(args) {
                        EditorSupport.buildPrefabDependencyHash(args.builder, this._prefabId);
                        for (const comp of this.getComponents()) {
                            comp.buildDependenciesHash(args);
                        }
                    }
                    getScreenBounds(camera) {
                        const sprite = this.getObject();
                        const points = [
                            new Phaser.Math.Vector2(0, 0),
                            new Phaser.Math.Vector2(0, 0),
                            new Phaser.Math.Vector2(0, 0),
                            new Phaser.Math.Vector2(0, 0)
                        ];
                        let w = sprite.width;
                        let h = sprite.height;
                        if (sprite instanceof Phaser.GameObjects.BitmapText) {
                            // the BitmapText.width is considered a displayWidth, it is already multiplied by the scale
                            w = w / sprite.scaleX;
                            h = h / sprite.scaleY;
                        }
                        const ox = sprite.originX;
                        const oy = sprite.originY;
                        const x = -w * ox;
                        const y = -h * oy;
                        const tx = sprite.getWorldTransformMatrix();
                        tx.transformPoint(x, y, points[0]);
                        tx.transformPoint(x + w, y, points[1]);
                        tx.transformPoint(x + w, y + h, points[2]);
                        tx.transformPoint(x, y + h, points[3]);
                        return points.map(p => camera.getScreenPoint(p.x, p.y));
                    }
                    // tslint:disable-next-line:ban-types
                    getComponent(ctr) {
                        return this._componentMap.get(ctr);
                    }
                    // tslint:disable-next-line:ban-types
                    hasComponent(ctr) {
                        return this._componentMap.has(ctr);
                    }
                    getComponents() {
                        return this._componentMap.values();
                    }
                    // tslint:disable-next-line:ban-types
                    static getObjectComponent(obj, ctr) {
                        var _a;
                        if (obj && typeof obj["getEditorSupport"] === "function") {
                            const support = obj["getEditorSupport"]();
                            return _a = support.getComponent(ctr), (_a !== null && _a !== void 0 ? _a : null);
                        }
                        return null;
                    }
                    // tslint:disable-next-line:ban-types
                    static hasObjectComponent(obj, ctr) {
                        return this.getObjectComponent(obj, ctr) !== null;
                    }
                    addComponent(...components) {
                        for (const c of components) {
                            this._componentMap.set(c.constructor, c);
                        }
                        this._serializables.push(...components);
                    }
                    setNewId(sprite) {
                        this.setId(Phaser.Utils.String.UUID());
                    }
                    getExtension() {
                        return this._extension;
                    }
                    getObject() {
                        return this._object;
                    }
                    getId() {
                        return this._object.name;
                    }
                    setId(id) {
                        this._object.name = id;
                    }
                    getParentId() {
                        if (this.getObject().parentContainer) {
                            return this.getObject().parentContainer
                                .getEditorSupport().getId();
                        }
                        return undefined;
                    }
                    getLabel() {
                        return this._label;
                    }
                    setLabel(label) {
                        this._label = label;
                    }
                    getScope() {
                        return this._scope;
                    }
                    setScope(scope) {
                        this._scope = scope;
                    }
                    getScene() {
                        return this._scene;
                    }
                    setScene(scene) {
                        this._scene = scene;
                    }
                    isPrefabInstance() {
                        return typeof this._prefabId === "string";
                    }
                    _setPrefabId(prefabId) {
                        this._prefabId = prefabId;
                    }
                    getOwnerPrefabInstance() {
                        if (this._object.parentContainer) {
                            const parent = this._object.parentContainer;
                            return parent.getEditorSupport().getOwnerPrefabInstance();
                        }
                        if (this._object.getEditorSupport().isPrefabInstance()) {
                            return this._object;
                        }
                        return null;
                    }
                    getPrefabId() {
                        return this._prefabId;
                    }
                    getPrefabName() {
                        const file = this.getPrefabFile();
                        if (file) {
                            return file.getNameWithoutExtension();
                        }
                        return null;
                    }
                    getPrefabFile() {
                        if (this._prefabId) {
                            const finder = scene_13.ScenePlugin.getInstance().getSceneFinder();
                            const file = finder.getPrefabFile(this._prefabId);
                            return file;
                        }
                        return null;
                    }
                    getPrefabData() {
                        if (this._prefabId) {
                            const finder = scene_13.ScenePlugin.getInstance().getSceneFinder();
                            const data = finder.getPrefabData(this._prefabId);
                            return data;
                        }
                        return null;
                    }
                    getPrefabSerializer() {
                        const data = this.getPrefabData();
                        if (data) {
                            return this._scene.getMaker().getSerializer(data);
                        }
                        return null;
                    }
                    getObjectType() {
                        const ser = this._scene.getMaker().getSerializer({
                            id: this.getId(),
                            type: this._extension.getTypeName(),
                            prefabId: this._prefabId,
                            label: "temporal"
                        });
                        return ser.getType();
                    }
                    getPhaserType() {
                        const ser = this._scene.getMaker().getSerializer({
                            id: this.getId(),
                            type: this._extension.getTypeName(),
                            prefabId: this._prefabId,
                            label: "temporal",
                        });
                        return ser.getPhaserType();
                    }
                    getSerializer(data) {
                        return this._scene.getMaker().getSerializer(data);
                    }
                    writeJSON(data) {
                        if (this.isPrefabInstance()) {
                            data.prefabId = this._prefabId;
                        }
                        else {
                            data.type = this._extension.getTypeName();
                        }
                        data.id = this.getId();
                        if (this._prefabId && this._unlockedProperties.size > 0) {
                            data["unlock"] = [...this._unlockedProperties];
                        }
                        const ser = this.getSerializer(data);
                        for (const s of this._serializables) {
                            s.writeJSON(ser);
                        }
                    }
                    readJSON(data) {
                        var _a;
                        const ser = this.getSerializer(data);
                        this.setId(data.id);
                        this._prefabId = data.prefabId;
                        this._unlockedProperties = new Set((_a = data["unlock"], (_a !== null && _a !== void 0 ? _a : [])));
                        for (const s of this._serializables) {
                            s.readJSON(ser);
                        }
                    }
                }
                sceneobjects.EditorSupport = EditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_13.ui || (scene_13.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_14) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class LoaderUpdaterExtension extends colibri.Extension {
                    constructor() {
                        super(LoaderUpdaterExtension.POINT_ID);
                    }
                }
                LoaderUpdaterExtension.POINT_ID = "phasereditor2d.scene.ui.sceneobjects.AssetLoaderExtension";
                sceneobjects.LoaderUpdaterExtension = LoaderUpdaterExtension;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_14.ui || (scene_14.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./LoaderUpdaterExtension.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_15) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ImageLoaderUpdater extends sceneobjects.LoaderUpdaterExtension {
                    clearCache(game) {
                        const list = game.textures.list;
                        for (const key in list) {
                            if (key === "__DEFAULT" || key === "__MISSING") {
                                continue;
                            }
                            if (list.hasOwnProperty(key)) {
                                const texture = list[key];
                                texture.destroy();
                                delete list[key];
                            }
                        }
                    }
                    acceptAsset(asset) {
                        return asset instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem
                            || asset instanceof phasereditor2d.pack.core.AssetPackImageFrame;
                    }
                    async updateLoader(scene, asset) {
                        let imageFrameContainerPackItem = null;
                        if (asset instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem) {
                            imageFrameContainerPackItem = asset;
                        }
                        else if (asset instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                            imageFrameContainerPackItem = asset.getPackItem();
                        }
                        if (imageFrameContainerPackItem !== null) {
                            await imageFrameContainerPackItem.preload();
                            await imageFrameContainerPackItem.preloadImages();
                            imageFrameContainerPackItem.addToPhaserCache(scene.game, scene.getPackCache());
                        }
                    }
                }
                sceneobjects.ImageLoaderUpdater = ImageLoaderUpdater;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_15.ui || (scene_15.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_16) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                function interactive_getAlpha_SharedTexture(hitArea, x, y, obj) {
                    const sprite = obj;
                    const textureManager = obj.getEditorSupport().getScene().textures;
                    const alpha = textureManager.getPixelAlpha(x, y, sprite.texture.key, sprite.frame.name);
                    return alpha > 0;
                }
                sceneobjects.interactive_getAlpha_SharedTexture = interactive_getAlpha_SharedTexture;
                function interactive_getAlpha_RenderTexture(hitArea, x, y, obj) {
                    const sprite = obj;
                    // TODO: lets fix the bound checking.
                    // const hitBounds = x >= 0 && y >= 0 && x <= sprite.width && y <= sprite.height;
                    // if (!hitBounds) {
                    //     return false;
                    // }
                    const scene = obj.getEditorSupport().getScene();
                    const renderTexture = new Phaser.GameObjects.RenderTexture(scene, 0, 0, 5, 5);
                    const scaleX = sprite.scaleX;
                    const scaleY = sprite.scaleY;
                    const originX = sprite.originX;
                    const originY = sprite.originY;
                    const angle = sprite.angle;
                    sprite.scaleX = 1;
                    sprite.scaleY = 1;
                    sprite.originX = 0;
                    sprite.originY = 0;
                    sprite.angle = 0;
                    let renderX = -x;
                    let renderY = -y;
                    if (sprite instanceof sceneobjects.TileSprite) {
                        renderX = -x - sprite.width * originX;
                        renderY = -y - sprite.height * originY;
                    }
                    renderTexture.draw([sprite], renderX, renderY);
                    sprite.scaleX = scaleX;
                    sprite.scaleY = scaleY;
                    sprite.originX = originX;
                    sprite.originY = originY;
                    sprite.angle = angle;
                    const colorArray = [];
                    renderTexture.snapshotPixel(0, 0, (c) => {
                        colorArray[0] = c;
                    });
                    renderTexture.destroy();
                    const color = colorArray[0];
                    const alpha = color ? color.alpha : 0;
                    return alpha > 0;
                }
                sceneobjects.interactive_getAlpha_RenderTexture = interactive_getAlpha_RenderTexture;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_16.ui || (scene_16.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                /**
                 * This class provides the methods to build the CodeDOM of the different aspects
                 * of the code generation associated to game objects.
                 *
                 * Each object extension provides an instance of this class, that is used by the Scene compiler.
                 */
                class ObjectCodeDOMBuilder {
                }
                sceneobjects.ObjectCodeDOMBuilder = ObjectCodeDOMBuilder;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class SceneObjectExtension extends colibri.Extension {
                    constructor(config) {
                        super(SceneObjectExtension.POINT_ID);
                        this._typeName = config.typeName;
                        this._phaserTypeName = config.phaserTypeName;
                    }
                    getTypeName() {
                        return this._typeName;
                    }
                    getPhaserTypeName() {
                        return this._phaserTypeName;
                    }
                    /**
                     * Adapt the data taken from a type conversion.
                     *
                     * @param serializer Serializer of the data resulted by the type-conversion.
                     * @param originalObject The original object that was converted.
                     */
                    adaptDataAfterTypeConversion(serializer, originalObject) {
                        // nothing by default
                    }
                    /**
                     * Collect the data used to create a new, empty object. For example, a BitmapText requires
                     * a BitmapFont key to be created, so this method opens a dialog to select the font.
                     */
                    async collectExtraDataForCreateEmptyObject() {
                        return {};
                    }
                }
                SceneObjectExtension.POINT_ID = "phasereditor2d.scene.ui.SceneObjectExtension";
                sceneobjects.SceneObjectExtension = SceneObjectExtension;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                function SimpleProperty(name, defValue, label, tooltip, local = false) {
                    return {
                        name,
                        defValue,
                        label,
                        tooltip: tooltip,
                        local,
                        getValue: obj => obj[name],
                        setValue: (obj, value) => obj[name] = value
                    };
                }
                sceneobjects.SimpleProperty = SimpleProperty;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TextContentComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [TextContentComponent.text]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        this.buildSetObjectPropertyCodeDOM_StringProperty(args, TextContentComponent.text);
                    }
                }
                TextContentComponent.text = sceneobjects.SimpleProperty("text", "", "Text");
                sceneobjects.TextContentComponent = TextContentComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var controls = colibri.ui.controls;
                class SceneObjectSection extends ui.editor.properties.BaseSceneSection {
                    createGridElementWithPropertiesXY(parent) {
                        const comp = this.createGridElement(parent);
                        comp.style.gridTemplateColumns = "auto auto auto 1fr auto 1fr";
                        return comp;
                    }
                    createGridElementWithPropertiesBoolXY(parent) {
                        const comp = this.createGridElement(parent);
                        comp.style.gridTemplateColumns = "auto auto auto 1fr auto 1fr";
                        return comp;
                    }
                    createLock(parent, ...properties) {
                        const mutableIcon = new controls.MutableIcon();
                        const element = mutableIcon.getElement();
                        element.classList.add("PropertyLockIcon");
                        parent.appendChild(element);
                        const lockedIcon = scene.ScenePlugin.getInstance().getIcon(scene.ICON_LOCKED);
                        const unlockedIcon = scene.ScenePlugin.getInstance().getIcon(scene.ICON_UNLOCKED);
                        element.addEventListener("click", e => {
                            const unlocked = !this.isUnlocked(...properties);
                            this.getEditor().getUndoManager().add(new sceneobjects.PropertyUnlockOperation(this.getEditor(), this.getSelection(), properties, unlocked));
                        });
                        this.addUpdater(() => {
                            const thereIsPrefabInstances = this.getSelection()
                                .map(obj => obj.getEditorSupport().isPrefabInstance())
                                .find(b => b);
                            if (thereIsPrefabInstances) {
                                element.style.width = controls.ICON_SIZE + "px";
                                const unlocked = this.isUnlocked(...properties);
                                mutableIcon.setIcon(unlocked ? unlockedIcon : lockedIcon);
                                mutableIcon.repaint();
                            }
                            else {
                                element.style.width = "0px";
                            }
                        });
                    }
                    isUnlocked(...properties) {
                        for (const obj of this.getSelection()) {
                            for (const property of properties) {
                                const locked = !obj.getEditorSupport().isUnlockedProperty(property);
                                if (locked) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    createNumberPropertyRow(parent, prop, fullWidth = true) {
                        this.createLock(parent, prop);
                        this.createLabel(parent, prop.label, scene.PhaserHelp(prop.tooltip))
                            .style.gridColumn = "2/ span 2";
                        this.createFloatField(parent, prop)
                            .style.gridColumn = fullWidth ? "4 / span 3" : "4";
                    }
                    createNumberProperty(parent, prop) {
                        this.createLock(parent, prop);
                        this.createLabel(parent, prop.label, scene.PhaserHelp(prop.tooltip));
                        this.createFloatField(parent, prop);
                    }
                    createBooleanProperty(parent, prop) {
                        this.createLock(parent, prop);
                        this.createBooleanField(parent, prop);
                    }
                    createPropertyBoolXYRow(parent, propXY, lockIcon = true) {
                        if (lockIcon) {
                            this.createLock(parent, propXY.x, propXY.y);
                            this.createLabel(parent, propXY.label, scene.PhaserHelp(propXY.tooltip));
                        }
                        else {
                            const label = this.createLabel(parent, propXY.label, scene.PhaserHelp(propXY.tooltip));
                            label.style.gridColumn = "2";
                        }
                        for (const prop of [propXY.x, propXY.y]) {
                            this.createBooleanField(parent, prop);
                        }
                    }
                    createPropertyFloatRow(parent, prop, lockIcon = true) {
                        if (lockIcon) {
                            this.createLock(parent, prop);
                        }
                        const label = this.createLabel(parent, prop.label);
                        label.style.gridColumn = "2";
                        const text = this.createFloatField(parent, prop);
                        return text;
                    }
                    createPropertyStringRow(parent, prop, lockIcon = true) {
                        if (lockIcon) {
                            this.createLock(parent, prop);
                        }
                        const label = this.createLabel(parent, prop.label);
                        label.style.gridColumn = "2";
                        const text = this.createStringField(parent, prop);
                        return text;
                    }
                    createPropertyEnumRow(parent, prop, lockIcon = true) {
                        if (lockIcon) {
                            this.createLock(parent, prop);
                        }
                        const label = this.createLabel(parent, prop.label);
                        label.style.gridColumn = "2";
                        const btn = this.createEnumField(parent, prop);
                        return btn;
                    }
                    createPropertyXYRow(parent, propXY, lockIcon = true) {
                        if (lockIcon) {
                            this.createLock(parent, propXY.x, propXY.y);
                            this.createLabel(parent, propXY.label, scene.PhaserHelp(propXY.tooltip));
                        }
                        else {
                            const label = this.createLabel(parent, propXY.label, scene.PhaserHelp(propXY.tooltip));
                            label.style.gridColumn = "2";
                        }
                        for (const prop of [propXY.x, propXY.y]) {
                            this.createLabel(parent, prop.label, scene.PhaserHelp(prop.tooltip));
                            this.createFloatField(parent, prop);
                        }
                    }
                    createEnumField(parent, property, checkUnlocked = true) {
                        const items = property.values
                            .map(value => {
                            return {
                                name: property.getValueLabel(value),
                                value
                            };
                        });
                        const btn = this.createMenuButton(parent, "", items, value => {
                            this.getEditor().getUndoManager().add(new sceneobjects.SimpleOperation(this.getEditor(), this.getSelection(), property, value));
                        });
                        this.addUpdater(() => {
                            btn.disabled = checkUnlocked && !this.isUnlocked(property);
                            btn.textContent = this.flatValues_StringJoinDifferent(this.getSelection()
                                .map(obj => property.getValueLabel(property.getValue(obj))));
                        });
                        return btn;
                    }
                    // tslint:disable-next-line:ban-types
                    createFloatField(parent, property) {
                        const text = this.createText(parent, false);
                        text.addEventListener("change", e => {
                            const value = Number.parseFloat(text.value);
                            this.getEditor().getUndoManager().add(new sceneobjects.SimpleOperation(this.getEditor(), this.getSelection(), property, value));
                        });
                        this.addUpdater(() => {
                            text.readOnly = !this.isUnlocked(property);
                            text.value = this.flatValues_Number(this.getSelection()
                                .map(obj => property.getValue(obj)));
                        });
                        return text;
                    }
                    createStringField(parent, property, checkUnlock = true, readOnlyOnMultiple = false, multiLine = false) {
                        const text = multiLine ? this.createTextArea(parent, false) : this.createText(parent, false);
                        text.addEventListener("change", e => {
                            const value = text.value;
                            this.getEditor().getUndoManager().add(new sceneobjects.SimpleOperation(this.getEditor(), this.getSelection(), property, value));
                        });
                        this.addUpdater(() => {
                            text.readOnly = checkUnlock && !this.isUnlocked(property);
                            if (readOnlyOnMultiple) {
                                text.readOnly = text.readOnly || readOnlyOnMultiple && this.getSelection().length > 1;
                            }
                            text.value = this.flatValues_StringOneOrNothing(this.getSelection()
                                .map(obj => property.getValue(obj)));
                        });
                        return text;
                    }
                    createBooleanField(parent, property, checkUnlock = true) {
                        const labelElement = this.createLabel(parent, property.label, scene.PhaserHelp(property.tooltip));
                        const checkElement = this.createCheckbox(parent, labelElement);
                        checkElement.addEventListener("change", e => {
                            const value = checkElement.checked;
                            this.getEditor().getUndoManager().add(new sceneobjects.SimpleOperation(this.getEditor(), this.getSelection(), property, value));
                        });
                        this.addUpdater(() => {
                            checkElement.disabled = checkUnlock && !this.isUnlocked(property);
                            const list = this.getSelection()
                                .map(obj => property.getValue(obj))
                                .filter(b => !b);
                            checkElement.checked = list.length === 0;
                        });
                        return checkElement;
                    }
                }
                sceneobjects.SceneObjectSection = SceneObjectSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./object/properties/SceneObjectSection.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TextContentSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor.scene.ui.sceneobjects.TextContentSection", "Text Content", false, false);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent);
                        comp.style.gridTemplateColumns = "auto auto 1fr";
                        this.createLock(comp, sceneobjects.TextContentComponent.text);
                        this.createLabel(comp, sceneobjects.TextContentComponent.text.label);
                        this.createStringField(comp, sceneobjects.TextContentComponent.text, true, false, true);
                    }
                    canEdit(obj, n) {
                        return sceneobjects.EditorSupport.hasObjectComponent(obj, sceneobjects.TextContentComponent);
                    }
                    canEditNumber(n) {
                        return n === 1;
                    }
                }
                sceneobjects.TextContentSection = TextContentSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_17) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BitmapFontLoaderUpdater extends sceneobjects.LoaderUpdaterExtension {
                    clearCache(game) {
                        const fontCache = game.cache.bitmapFont;
                        const keys = fontCache.getKeys();
                        for (const key of keys) {
                            fontCache.remove(key);
                        }
                    }
                    acceptAsset(asset) {
                        return asset instanceof phasereditor2d.pack.core.BitmapFontAssetPackItem;
                    }
                    async updateLoader(scene, asset) {
                        const font = asset;
                        await font.preload();
                        await font.preloadImages();
                        font.addToPhaserCache(scene.game, scene.getPackCache());
                    }
                }
                sceneobjects.BitmapFontLoaderUpdater = BitmapFontLoaderUpdater;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_17.ui || (scene_17.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_18) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BitmapText extends Phaser.GameObjects.BitmapText {
                    constructor(scene, x, y, font, text) {
                        super(scene, x, y, font, "New BitmapText");
                        this._editorSupport = new sceneobjects.BitmapTextEditorSupport(this, scene);
                    }
                    getEditorSupport() {
                        return this._editorSupport;
                    }
                }
                sceneobjects.BitmapText = BitmapText;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_18.ui || (scene_18.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var code = scene.core.code;
                class BitmapTextCodeDOMBuilder extends sceneobjects.ObjectCodeDOMBuilder {
                    buildCreateObjectWithFactoryCodeDOM(args) {
                        const call = new code.MethodCallCodeDOM("bitmapText", args.gameObjectFactoryExpr);
                        const obj = args.obj;
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                        call.argLiteral(obj.font);
                        call.argLiteral(obj.text);
                        return call;
                    }
                    buildCreatePrefabInstanceCodeDOM(args) {
                        const call = args.methodCallDOM;
                        const obj = args.obj;
                        const support = args.obj.getEditorSupport();
                        call.arg(args.sceneExpr);
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                        if (support.isUnlockedProperty(sceneobjects.BitmapTextComponent.font)) {
                            call.argLiteral(obj.font);
                        }
                        else {
                            call.arg("undefined");
                        }
                    }
                    buildPrefabConstructorDeclarationCodeDOM(args) {
                        const ctr = args.ctrDeclCodeDOM;
                        ctr.arg("x", "number");
                        ctr.arg("y", "number");
                        ctr.arg("font", "string", true);
                    }
                    buildPrefabConstructorDeclarationSupperCallCodeDOM(args) {
                        const obj = args.prefabObj;
                        const support = obj.getEditorSupport();
                        const call = args.superMethodCallCodeDOM;
                        call.arg("x");
                        call.arg("y");
                        if (support.isLockedProperty(sceneobjects.BitmapTextComponent.font)) {
                            call.arg("font");
                        }
                        else {
                            call.arg("font || " + code.CodeDOM.quote(obj.font));
                        }
                    }
                }
                sceneobjects.BitmapTextCodeDOMBuilder = BitmapTextCodeDOMBuilder;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BitmapTextComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [
                            BitmapTextComponent.font,
                            BitmapTextComponent.align,
                            BitmapTextComponent.fontSize,
                            BitmapTextComponent.letterSpacing
                        ]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        this.buildSetObjectPropertyCodeDOM_FloatProperty(args, BitmapTextComponent.fontSize, BitmapTextComponent.align, BitmapTextComponent.letterSpacing);
                    }
                }
                BitmapTextComponent.font = {
                    name: "font",
                    label: "Font",
                    defValue: undefined,
                    getValue: obj => obj.font,
                    setValue: (obj, value) => obj.setFont(value)
                };
                BitmapTextComponent.align = {
                    name: "align",
                    label: "Align",
                    defValue: Phaser.GameObjects.BitmapText.ALIGN_LEFT,
                    getValue: obj => obj.align,
                    setValue: (obj, value) => obj.align = value,
                    getValueLabel: value => {
                        return {
                            [Phaser.GameObjects.BitmapText.ALIGN_LEFT]: "LEFT",
                            [Phaser.GameObjects.BitmapText.ALIGN_CENTER]: "CENTER",
                            [Phaser.GameObjects.BitmapText.ALIGN_RIGHT]: "RIGHT"
                        }[value];
                    },
                    values: [
                        Phaser.GameObjects.BitmapText.ALIGN_LEFT,
                        Phaser.GameObjects.BitmapText.ALIGN_CENTER,
                        Phaser.GameObjects.BitmapText.ALIGN_RIGHT
                    ]
                };
                BitmapTextComponent.fontSize = {
                    name: "fontSize",
                    label: "Font Size",
                    defValue: 0,
                    getValue: obj => obj.fontSize,
                    setValue: (obj, value) => obj.setFontSize(value)
                };
                BitmapTextComponent.letterSpacing = {
                    name: "letterSpacing",
                    label: "Letter Spacing",
                    defValue: 0,
                    getValue: obj => obj.letterSpacing,
                    setValue: (obj, value) => obj.setLetterSpacing(value)
                };
                sceneobjects.BitmapTextComponent = BitmapTextComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_19) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BitmapTextEditorSupport extends sceneobjects.EditorSupport {
                    constructor(obj, scene) {
                        super(sceneobjects.BitmapTextExtension.getInstance(), obj, scene);
                        this.addComponent(new sceneobjects.TransformComponent(obj), new sceneobjects.OriginComponent(obj), new sceneobjects.VisibleComponent(obj), new sceneobjects.AlphaComponent(obj), new sceneobjects.TextContentComponent(obj), new sceneobjects.BitmapTextComponent(obj));
                    }
                    computeContentHash() {
                        const obj = this.getObject();
                        return JSON.stringify({
                            text: obj.text,
                            font: obj.font,
                            tint: obj.tint
                        });
                    }
                    getCellRenderer() {
                        return new sceneobjects.ObjectCellRenderer();
                    }
                    setInteractive() {
                        this.getObject().setInteractive(sceneobjects.interactive_getAlpha_RenderTexture);
                    }
                }
                sceneobjects.BitmapTextEditorSupport = BitmapTextEditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_19.ui || (scene_19.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BitmapTextExtension extends sceneobjects.SceneObjectExtension {
                    constructor() {
                        super({
                            phaserTypeName: "Phaser.GameObjects.BitmapText",
                            typeName: "BitmapText"
                        });
                    }
                    static getInstance() {
                        return this._instance;
                    }
                    acceptsDropData(data) {
                        return data instanceof phasereditor2d.pack.core.BitmapFontAssetPackItem;
                    }
                    createSceneObjectWithAsset(args) {
                        const font = args.asset;
                        return new sceneobjects.BitmapText(args.scene, args.x, args.y, font.getKey(), "New BitmapText");
                    }
                    async collectExtraDataForCreateEmptyObject() {
                        const finder = new phasereditor2d.pack.core.PackFinder();
                        await finder.preload();
                        const dlg = new phasereditor2d.pack.ui.dialogs.AssetSelectionDialog();
                        dlg.create();
                        dlg.getViewer().setInput(finder.getPacks()
                            .flatMap(pack => pack.getItems())
                            .filter(item => item instanceof phasereditor2d.pack.core.BitmapFontAssetPackItem));
                        dlg.getViewer().setCellSize(128);
                        dlg.setTitle("Select Bitmap Font");
                        const promise = new Promise((resolver, reject) => {
                            dlg.setSelectionCallback(async (sel) => {
                                const item = sel[0];
                                await item.preload();
                                await item.preloadImages();
                                const result = {
                                    data: item
                                };
                                resolver(result);
                            });
                            dlg.setCancelCallback(() => {
                                const result = {
                                    abort: true
                                };
                                resolver(result);
                            });
                        });
                        return promise;
                    }
                    createEmptySceneObject(args) {
                        const fontAsset = args.extraData;
                        fontAsset.addToPhaserCache(args.scene.game, args.scene.getPackCache());
                        return new sceneobjects.BitmapText(args.scene, args.x, args.y, fontAsset.getKey(), "New BitmapText");
                    }
                    createSceneObjectWithData(args) {
                        const serializer = new scene.core.json.Serializer(args.data);
                        const font = serializer.read(sceneobjects.BitmapTextComponent.font.name);
                        const obj = new sceneobjects.BitmapText(args.scene, 0, 0, font, "");
                        obj.getEditorSupport().readJSON(args.data);
                        return obj;
                    }
                    async getAssetsFromObjectData(args) {
                        const font = args.serializer.read(sceneobjects.BitmapTextComponent.font.name);
                        const asset = args.finder.findAssetPackItem(font);
                        if (asset instanceof phasereditor2d.pack.core.BitmapFontAssetPackItem) {
                            return [asset];
                        }
                        return [];
                    }
                    getCodeDOMBuilder() {
                        return new sceneobjects.BitmapTextCodeDOMBuilder();
                    }
                }
                BitmapTextExtension._instance = new BitmapTextExtension();
                sceneobjects.BitmapTextExtension = BitmapTextExtension;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BitmapTextSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor.scene.ui.sceneobjects.BitmapTextSection", "Bitmap Text");
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent);
                        comp.style.gridTemplateColumns = "auto auto 1fr";
                        {
                            // font
                            this.createLock(comp, sceneobjects.BitmapTextComponent.font);
                            this.createLabel(comp, sceneobjects.BitmapTextComponent.font.name);
                            const btn = this.createButton(comp, "", async () => {
                                const input = this.getEditor().getPackFinder().getPacks()
                                    .flatMap(pack => pack.getItems())
                                    .filter(item => item instanceof phasereditor2d.pack.core.BitmapFontAssetPackItem);
                                const dlg = new phasereditor2d.pack.ui.dialogs.AssetSelectionDialog();
                                dlg.create();
                                dlg.setTitle("Select Bitmap Font");
                                dlg.getViewer().setCellSize(128);
                                dlg.getViewer().setInput(input);
                                dlg.getViewer().repaint();
                                dlg.setSelectionCallback(async (sel) => {
                                    const item = sel[0];
                                    await item.preload();
                                    await item.preloadImages();
                                    item.addToPhaserCache(this.getEditor().getGame(), this.getEditor().getScene().getPackCache());
                                    this.getUndoManager().add(new sceneobjects.SimpleOperation(this.getEditor(), this.getSelection(), sceneobjects.BitmapTextComponent.font, item.getKey()));
                                });
                            });
                            this.addUpdater(() => {
                                if (this.getSelection().length !== 1) {
                                    btn.textContent = this.getSelection().length + " selected";
                                }
                                else {
                                    btn.textContent = this.getSelectionFirstElement().font;
                                }
                            });
                        }
                        this.createPropertyFloatRow(comp, sceneobjects.BitmapTextComponent.fontSize);
                        this.createPropertyEnumRow(comp, sceneobjects.BitmapTextComponent.align);
                        this.createPropertyFloatRow(comp, sceneobjects.BitmapTextComponent.letterSpacing);
                    }
                    canEdit(obj, n) {
                        return obj instanceof sceneobjects.BitmapText;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.BitmapTextSection = BitmapTextSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../../editor/undo/SceneSnapshotOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BreakContainerOperation extends ui.editor.undo.SceneSnapshotOperation {
                    async performModification() {
                        const displayList = this.getEditor().getScene().sys.displayList;
                        const sel = [];
                        for (const obj of this._editor.getSelectedGameObjects()) {
                            const container = obj;
                            const children = [...container.list];
                            for (const child of children) {
                                const sprite = child;
                                const p = new Phaser.Math.Vector2(0, 0);
                                sprite.getWorldTransformMatrix().transformPoint(0, 0, p);
                                sprite.x = p.x;
                                sprite.y = p.y;
                                sel.push(sprite);
                                container.remove(sprite);
                            }
                            container.getEditorSupport().destroy();
                        }
                        for (const obj of sel) {
                            displayList.add(obj);
                        }
                        this.getEditor().setSelection(sel);
                    }
                }
                sceneobjects.BreakContainerOperation = BreakContainerOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_20) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class Container extends Phaser.GameObjects.Container {
                    constructor(scene, x, y, children) {
                        super(scene, x, y, children);
                        this._editorSupport = new sceneobjects.ContainerEditorSupport(this, scene);
                    }
                    getEditorSupport() {
                        return this._editorSupport;
                    }
                    get list() {
                        return super.list;
                    }
                    set list(list) {
                        super.list = list;
                    }
                }
                sceneobjects.Container = Container;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_20.ui || (scene_20.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var code = scene.core.code;
                class ContainerCodeDOMBuilder extends sceneobjects.ObjectCodeDOMBuilder {
                    static getInstance() {
                        return this._instance;
                    }
                    buildPrefabConstructorDeclarationSupperCallCodeDOM(args) {
                        const call = args.superMethodCallCodeDOM;
                        call.arg("x");
                        call.arg("y");
                    }
                    buildPrefabConstructorDeclarationCodeDOM(args) {
                        const ctr = args.ctrDeclCodeDOM;
                        ctr.arg("x", "number");
                        ctr.arg("y", "number");
                    }
                    buildCreatePrefabInstanceCodeDOM(args) {
                        const obj = args.obj;
                        const call = args.methodCallDOM;
                        call.arg(args.sceneExpr);
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                    }
                    buildCreateObjectWithFactoryCodeDOM(args) {
                        const obj = args.obj;
                        const call = new code.MethodCallCodeDOM("container", args.gameObjectFactoryExpr);
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                        return call;
                    }
                }
                ContainerCodeDOMBuilder._instance = new ContainerCodeDOMBuilder();
                sceneobjects.ContainerCodeDOMBuilder = ContainerCodeDOMBuilder;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ContainerComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [ContainerComponent.allowPickChildren]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        // nothing
                    }
                }
                ContainerComponent.allowPickChildren = {
                    name: "allowPickChildren",
                    label: "Allow Pick Children",
                    tooltip: "If the container children can be pickable in the scene.",
                    defValue: true,
                    local: true,
                    getValue: obj => obj.getEditorSupport().isAllowPickChildren(),
                    setValue: (obj, value) => obj.getEditorSupport().setAllowPickChildren(value)
                };
                sceneobjects.ContainerComponent = ContainerComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_21) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var controls = colibri.ui.controls;
                class ContainerEditorSupport extends sceneobjects.EditorSupport {
                    constructor(obj, scene) {
                        super(sceneobjects.ContainerExtension.getInstance(), obj, scene);
                        this._allowPickChildren = true;
                        this.addComponent(new sceneobjects.TransformComponent(obj));
                        this.addComponent(new sceneobjects.ContainerComponent(obj));
                    }
                    isAllowPickChildren() {
                        return this._allowPickChildren;
                    }
                    setAllowPickChildren(childrenPickable) {
                        this._allowPickChildren = childrenPickable;
                    }
                    setInteractive() {
                        // nothing
                    }
                    destroy() {
                        for (const obj of this.getObject().list) {
                            obj.getEditorSupport().destroy();
                        }
                        super.destroy();
                    }
                    async buildDependencyHash(args) {
                        super.buildDependencyHash(args);
                        if (!this.isPrefabInstance()) {
                            for (const obj of this.getObject().list) {
                                obj.getEditorSupport().buildDependencyHash(args);
                            }
                        }
                    }
                    getCellRenderer() {
                        if (this.isPrefabInstance()) {
                            const finder = scene_21.ScenePlugin.getInstance().getSceneFinder();
                            const file = finder.getPrefabFile(this.getPrefabId());
                            if (file) {
                                const image = ui.SceneThumbnailCache.getInstance().getContent(file);
                                if (image) {
                                    return new controls.viewers.ImageCellRenderer(image);
                                }
                            }
                        }
                        return new controls.viewers.IconImageCellRenderer(scene_21.ScenePlugin.getInstance().getIcon(scene_21.ICON_GROUP));
                    }
                    writeJSON(containerData) {
                        super.writeJSON(containerData);
                        if (!this.isPrefabInstance()) {
                            containerData.list = this.getObject().list.map(obj => {
                                const objData = {};
                                obj.getEditorSupport().writeJSON(objData);
                                return objData;
                            });
                        }
                    }
                    readJSON(containerData) {
                        super.readJSON(containerData);
                        const ser = this.getSerializer(containerData);
                        const list = ser.read("list", []);
                        const maker = this.getScene().getMaker();
                        const container = this.getObject();
                        container.removeAll(true);
                        for (const objData of list) {
                            const sprite = maker.createObject(objData);
                            container.add(sprite);
                        }
                    }
                    getScreenBounds(camera) {
                        const container = this.getObject();
                        if (container.list.length === 0) {
                            return [];
                        }
                        const minPoint = new Phaser.Math.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
                        const maxPoint = new Phaser.Math.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);
                        const points = [];
                        for (const obj of container.list) {
                            const bounds = obj.getEditorSupport().getScreenBounds(camera);
                            points.push(...bounds);
                        }
                        const p = camera.getScreenPoint(container.x, container.y);
                        points.push(p);
                        for (const point of points) {
                            minPoint.x = Math.min(minPoint.x, point.x);
                            minPoint.y = Math.min(minPoint.y, point.y);
                            maxPoint.x = Math.max(maxPoint.x, point.x);
                            maxPoint.y = Math.max(maxPoint.y, point.y);
                        }
                        return [
                            new Phaser.Math.Vector2(minPoint.x, minPoint.y),
                            new Phaser.Math.Vector2(maxPoint.x, minPoint.y),
                            new Phaser.Math.Vector2(maxPoint.x, maxPoint.y),
                            new Phaser.Math.Vector2(minPoint.x, maxPoint.y)
                        ];
                    }
                    trim() {
                        const container = this.getObject();
                        if (container.length === 0) {
                            return;
                        }
                        let minX = Number.MAX_VALUE;
                        let minY = Number.MAX_VALUE;
                        for (const child of container.list) {
                            const sprite = child;
                            minX = Math.min(sprite.x, minX);
                            minY = Math.min(sprite.y, minY);
                        }
                        for (const child of container.list) {
                            const sprite = child;
                            sprite.x -= minX;
                            sprite.y -= minY;
                        }
                        const p = new Phaser.Math.Vector2(0, 0);
                        container.getWorldTransformMatrix().transformPoint(minX, minY, p);
                        container.x += p.x;
                        container.y += p.y;
                    }
                }
                sceneobjects.ContainerEditorSupport = ContainerEditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_21.ui || (scene_21.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_22) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ContainerExtension extends sceneobjects.SceneObjectExtension {
                    constructor() {
                        super({
                            typeName: "Container",
                            phaserTypeName: "Phaser.GameObjects.Container"
                        });
                    }
                    static getInstance() {
                        return this._instance || (this._instance = new ContainerExtension());
                    }
                    getCodeDOMBuilder() {
                        return sceneobjects.ContainerCodeDOMBuilder.getInstance();
                    }
                    async getAssetsFromObjectData(args) {
                        const list = [];
                        const children = args.serializer.read("list", []);
                        for (const objData of children) {
                            const ser = args.serializer.getSerializer(objData);
                            const type = ser.getType();
                            const ext = scene_22.ScenePlugin.getInstance().getObjectExtensionByObjectType(type);
                            if (ext) {
                                const list2 = await ext.getAssetsFromObjectData({
                                    serializer: ser,
                                    scene: args.scene,
                                    finder: args.finder
                                });
                                list.push(...list2);
                            }
                        }
                        return list;
                    }
                    createEmptySceneObject(args) {
                        return this.createContainerObject(args.scene, 0, 0, []);
                    }
                    createSceneObjectWithData(args) {
                        const container = this.createContainerObject(args.scene, 0, 0, []);
                        container.getEditorSupport().readJSON(args.data);
                        return container;
                    }
                    createContainerObject(scene, x, y, list) {
                        const container = new sceneobjects.Container(scene, x, y, list);
                        container.getEditorSupport().setScene(scene);
                        scene.sys.displayList.add(container);
                        return container;
                    }
                    createContainerObjectWithChildren(scene, objectList) {
                        const container = this.createContainerObject(scene, 0, 0, objectList);
                        const name = scene.makeNewName("container");
                        container.getEditorSupport().setLabel(name);
                        return container;
                    }
                    acceptsDropData(data) {
                        return false;
                    }
                    createSceneObjectWithAsset(args) {
                        return null;
                    }
                }
                sceneobjects.ContainerExtension = ContainerExtension;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_22.ui || (scene_22.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../object/properties/SceneObjectSection.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ContainerSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.ContainerSection", "Container", false, true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 2);
                        this.createBooleanField(comp, sceneobjects.ContainerComponent.allowPickChildren, false);
                    }
                    canEdit(obj, n) {
                        return obj instanceof sceneobjects.Container;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.ContainerSection = ContainerSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../../editor/undo/SceneSnapshotOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class CreateContainerWithObjectsOperation extends ui.editor.undo.SceneSnapshotOperation {
                    async performModification() {
                        const container = sceneobjects.ContainerExtension.getInstance().createEmptySceneObject({
                            scene: this.getScene(),
                            x: 0,
                            y: 0
                        });
                        container.getEditorSupport().setLabel(this.getScene().makeNewName("container"));
                        for (const obj of this._editor.getSelectedGameObjects()) {
                            const sprite = obj;
                            const p = new Phaser.Math.Vector2(0, 0);
                            sprite.getWorldTransformMatrix().transformPoint(0, 0, p);
                            if (sprite.parentContainer) {
                                sprite.parentContainer.remove(sprite);
                            }
                            container.add(sprite);
                            sprite.x = p.x;
                            sprite.y = p.y;
                        }
                        container.getEditorSupport().trim();
                        this.getEditor().setSelection([container]);
                    }
                }
                sceneobjects.CreateContainerWithObjectsOperation = CreateContainerWithObjectsOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TrimContainerOperation extends ui.editor.undo.SceneSnapshotOperation {
                    async performModification() {
                        for (const obj of this._editor.getSelectedGameObjects()) {
                            const container = obj;
                            container.getEditorSupport().trim();
                        }
                        this.getEditor().dispatchSelectionChanged();
                    }
                }
                sceneobjects.TrimContainerOperation = TrimContainerOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../ObjectCodeDOMBuilder.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var code = scene.core.code;
                class BaseImageCodeDOMBuilder extends sceneobjects.ObjectCodeDOMBuilder {
                    constructor(factoryMethodName) {
                        super();
                        this._factoryMethodName = factoryMethodName;
                    }
                    buildPrefabConstructorDeclarationSupperCallCodeDOM(args) {
                        const call = args.superMethodCallCodeDOM;
                        call.arg("x");
                        call.arg("y");
                        this.buildPrefabConstructorDeclarationSupperCallCodeDOM_TextureParameters(args, call);
                    }
                    buildPrefabConstructorDeclarationSupperCallCodeDOM_TextureParameters(args, call) {
                        const obj = args.prefabObj;
                        const support = obj.getEditorSupport();
                        if (support.isLockedProperty(sceneobjects.TextureComponent.texture)) {
                            call.arg("texture");
                            call.arg("frame");
                        }
                        else {
                            const texture = sceneobjects.TextureComponent.texture.getValue(obj);
                            const key = texture.key || "__DEFAULT";
                            const frame = texture.frame;
                            call.arg("texture || " + code.CodeDOM.quote(key));
                            let frameCode;
                            if (typeof frame === "string") {
                                frameCode = code.CodeDOM.quote(frame);
                            }
                            else if (typeof frame === "number") {
                                frameCode = frame.toString();
                            }
                            if (frameCode) {
                                call.arg("frame !== undefined && frame !== null ? frame : " + frameCode);
                            }
                        }
                    }
                    buildPrefabConstructorDeclarationCodeDOM(args) {
                        const ctr = args.ctrDeclCodeDOM;
                        ctr.arg("x", "number");
                        ctr.arg("y", "number");
                        ctr.arg("texture", "string", true);
                        ctr.arg("frame", "number | string", true);
                    }
                    buildCreatePrefabInstanceCodeDOM(args) {
                        const obj = args.obj;
                        const support = obj.getEditorSupport();
                        const call = args.methodCallDOM;
                        call.arg(args.sceneExpr);
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                        if (support.isUnlockedProperty(sceneobjects.TextureComponent.texture)) {
                            this.addTextureFrameArgsToObjectFactoryMethodCallDOM(args.methodCallDOM, args.obj);
                        }
                    }
                    buildCreateObjectWithFactoryCodeDOM(args) {
                        const obj = args.obj;
                        const call = new code.MethodCallCodeDOM(this._factoryMethodName, args.gameObjectFactoryExpr);
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                        this.addTextureFrameArgsToObjectFactoryMethodCallDOM(call, args.obj);
                        return call;
                    }
                    addTextureFrameArgsToObjectFactoryMethodCallDOM(call, obj) {
                        const texture = sceneobjects.TextureComponent.texture.getValue(obj);
                        if (texture.key) {
                            call.argLiteral(texture.key);
                            call.argStringOrInt(texture.frame);
                        }
                        else {
                            call.argLiteral("__DEFAULT");
                        }
                    }
                }
                sceneobjects.BaseImageCodeDOMBuilder = BaseImageCodeDOMBuilder;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_23) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BaseImageEditorSupport extends sceneobjects.EditorSupport {
                    constructor(extension, obj, scene) {
                        super(extension, obj, scene);
                        this.addComponent(new sceneobjects.TextureComponent(obj), new sceneobjects.TransformComponent(obj), new sceneobjects.OriginComponent(obj), new sceneobjects.FlipComponent(obj), new sceneobjects.VisibleComponent(obj), new sceneobjects.AlphaComponent(obj));
                    }
                    getCellRenderer() {
                        return new sceneobjects.TextureCellRenderer();
                    }
                    getTextureComponent() {
                        return this.getComponent(sceneobjects.TextureComponent);
                    }
                    setInteractive() {
                        this.getObject().setInteractive(sceneobjects.interactive_getAlpha_SharedTexture);
                    }
                }
                sceneobjects.BaseImageEditorSupport = BaseImageEditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_23.ui || (scene_23.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_24) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BaseImageExtension extends sceneobjects.SceneObjectExtension {
                    async getAssetsFromObjectData(args) {
                        const { key, frame } = args.serializer.read(sceneobjects.TextureComponent.texture.name, {});
                        const finder = args.finder;
                        const item = finder.findAssetPackItem(key);
                        if (item) {
                            return [item];
                        }
                        return [];
                    }
                    static isImageOrImageFrameAsset(data) {
                        return data instanceof phasereditor2d.pack.core.AssetPackImageFrame || data instanceof phasereditor2d.pack.core.ImageAssetPackItem;
                    }
                    acceptsDropData(data) {
                        return sceneobjects.ImageExtension.isImageOrImageFrameAsset(data);
                    }
                    createEmptySceneObject(args) {
                        return this.createImageObject(args.scene, args.x, args.y);
                    }
                    createSceneObjectWithAsset(args) {
                        let key;
                        let frame;
                        let baseLabel;
                        if (args.asset instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                            key = args.asset.getPackItem().getKey();
                            frame = args.asset.getName();
                            baseLabel = frame.toString();
                        }
                        else if (args.asset instanceof phasereditor2d.pack.core.ImageAssetPackItem) {
                            key = args.asset.getKey();
                            frame = undefined;
                            baseLabel = key;
                        }
                        const sprite = this.createImageObject(args.scene, args.x, args.y, key, frame);
                        const support = sprite.getEditorSupport();
                        support.setLabel(baseLabel);
                        const textureComponent = support.getComponent(sceneobjects.TextureComponent);
                        textureComponent.setTextureKeys({ key, frame });
                        return sprite;
                    }
                    createSceneObjectWithData(args) {
                        let key;
                        let frame;
                        const textureData = args.data;
                        if (textureData.texture) {
                            key = textureData.texture.key;
                            frame = textureData.texture.frame;
                        }
                        const sprite = this.createImageObject(args.scene, 0, 0, key, frame);
                        sprite.getEditorSupport().readJSON(args.data);
                        return sprite;
                    }
                    createImageObject(scene, x, y, key, frame) {
                        const sprite = this.newObject(scene, x, y, key, frame);
                        return sprite;
                    }
                    adaptDataAfterTypeConversion(serializer, originalObject) {
                        const support = originalObject.getEditorSupport();
                        if (support.isPrefabInstance()) {
                            const textureComponent = support.getComponent(sceneobjects.TextureComponent);
                            const keys = textureComponent.getTextureKeys();
                            serializer.write(sceneobjects.TextureComponent.texture.name, keys, {});
                        }
                    }
                }
                sceneobjects.BaseImageExtension = BaseImageExtension;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_24.ui || (scene_24.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_25) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class Image extends Phaser.GameObjects.Image {
                    constructor(scene, x, y, texture, frame) {
                        super(scene, x, y, texture, frame);
                        this._editorSupport = new sceneobjects.ImageEditorSupport(this, scene);
                    }
                    getEditorSupport() {
                        return this._editorSupport;
                    }
                }
                sceneobjects.Image = Image;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_25.ui || (scene_25.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_26) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ImageEditorSupport extends sceneobjects.BaseImageEditorSupport {
                    constructor(obj, scene) {
                        super(sceneobjects.ImageExtension.getInstance(), obj, scene);
                    }
                }
                sceneobjects.ImageEditorSupport = ImageEditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_26.ui || (scene_26.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./BaseImageExtension.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_27) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ImageExtension extends sceneobjects.BaseImageExtension {
                    constructor() {
                        super({
                            typeName: "Image",
                            phaserTypeName: "Phaser.GameObjects.Image"
                        });
                    }
                    static getInstance() {
                        var _a;
                        return _a = this._instance, (_a !== null && _a !== void 0 ? _a : (this._instance = new ImageExtension()));
                    }
                    getCodeDOMBuilder() {
                        return new sceneobjects.BaseImageCodeDOMBuilder("image");
                    }
                    newObject(scene, x, y, key, frame) {
                        return new sceneobjects.Image(scene, x, y, key || null, frame);
                    }
                }
                sceneobjects.ImageExtension = ImageExtension;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_27.ui || (scene_27.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var controls = colibri.ui.controls;
                class ListSection extends ui.editor.properties.BaseSceneSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.ListSection", "List", true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent);
                        comp.style.gridTemplateColumns = "1fr";
                        comp.style.gridTemplateRows = "1fr auto";
                        const viewer = new controls.viewers.TreeViewer();
                        viewer.setCellSize(64);
                        viewer.setLabelProvider(new ui.editor.outline.SceneEditorOutlineLabelProvider());
                        viewer.setCellRendererProvider(new ui.editor.outline.SceneEditorOutlineRendererProvider());
                        viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        const filteredViewer = new colibri.ui.ide.properties
                            .FilteredViewerInPropertySection(this.getPage(), viewer);
                        comp.appendChild(filteredViewer.getElement());
                        this.addUpdater(() => {
                            const list = this.getSelectionFirstElement();
                            const map = this.getEditor().getScene().buildObjectIdMap();
                            const input = list.getObjectIds()
                                .map(id => map.get(id))
                                .filter(obj => obj !== undefined);
                            viewer.setInput(input);
                            viewer.setSelection([]);
                        });
                        const btnRow = document.createElement("div");
                        comp.appendChild(btnRow);
                        const selectBtn = this.createButton(btnRow, "Select In Scene", () => {
                            this.getEditor().setSelection(viewer.getSelection());
                        });
                        selectBtn.style.float = "right";
                        const removeBtn = this.createButton(btnRow, "Remove From List", () => {
                            this.getUndoManager().add(new sceneobjects.RemoveObjectsFromListOperation(this.getEditor(), this.getSelectionFirstElement(), viewer.getSelection()));
                        });
                        removeBtn.style.float = "right";
                        removeBtn.style.marginRight = "5px";
                        viewer.addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                            selectBtn.disabled = removeBtn.disabled = viewer.getSelection().length === 0;
                        });
                    }
                    canEdit(obj, n) {
                        return obj instanceof sceneobjects.ObjectList;
                    }
                    canEditNumber(n) {
                        return n === 1;
                    }
                }
                sceneobjects.ListSection = ListSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ListVariableSection extends ui.editor.properties.BaseSceneSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.ListVariableSection", "Variable", false);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 2);
                        {
                            // Name
                            this.createLabel(comp, "Name");
                            const text = this.createText(comp);
                            text.addEventListener("change", e => {
                                this.performChange(list => {
                                    list.setLabel(text.value);
                                });
                            });
                            this.addUpdater(() => {
                                text.value = this.getSelectionFirstElement().getLabel();
                            });
                        }
                        {
                            // Scope
                            this.createLabel(comp, "Scope", "The lexical scope of the object.");
                            const items = [{
                                    name: "Method",
                                    value: sceneobjects.ObjectScope.METHOD
                                }, {
                                    name: "Class",
                                    value: sceneobjects.ObjectScope.CLASS
                                }, {
                                    name: "Public",
                                    value: sceneobjects.ObjectScope.PUBLIC
                                }];
                            const btn = this.createMenuButton(comp, "", items, scope => {
                                this.performChange(list => {
                                    list.setScope(scope);
                                });
                            });
                            this.addUpdater(() => {
                                btn.textContent = items
                                    .find(item => item.value === this.getSelectionFirstElement().getScope())
                                    .name;
                            });
                        }
                    }
                    performChange(performChange) {
                        this.getUndoManager().add(new sceneobjects.ChangeListOperation(this.getEditor(), this.getSelectionFirstElement(), performChange));
                    }
                    canEdit(obj, n) {
                        return obj instanceof sceneobjects.ObjectList;
                    }
                    canEditNumber(n) {
                        return n === 1;
                    }
                }
                sceneobjects.ListVariableSection = ListVariableSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ObjectList {
                    constructor() {
                        this._id = Phaser.Utils.String.UUID();
                        this._label = "list";
                        this._scope = sceneobjects.ObjectScope.CLASS;
                        this._objectIds = [];
                    }
                    getObjectIds() {
                        return this._objectIds;
                    }
                    setObjectsIds(ids) {
                        this._objectIds = ids;
                    }
                    getId() {
                        return this._id;
                    }
                    setId(id) {
                        this._id = id;
                    }
                    getLabel() {
                        return this._label;
                    }
                    setLabel(label) {
                        this._label = label;
                    }
                    getScope() {
                        return this._scope;
                    }
                    setScope(scope) {
                        this._scope = scope;
                    }
                    readJSON(data) {
                        this._id = data.id;
                        this._label = data.label;
                        this._objectIds = data.objectIds || [];
                        this._scope = data.scope || sceneobjects.ObjectScope.CLASS;
                    }
                    writeJSON(data) {
                        data.id = this._id;
                        data.label = this._label;
                        data.objectIds = this._objectIds.length === 0 ? undefined : [...this._objectIds];
                        data.scope = this._scope === sceneobjects.ObjectScope.CLASS ? undefined : this._scope;
                    }
                }
                sceneobjects.ObjectList = ObjectList;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ObjectLists {
                    constructor() {
                        this._lists = [];
                    }
                    getLists() {
                        return this._lists;
                    }
                    getListById(id) {
                        return this._lists.find(list => list.getId() === id);
                    }
                    getListsByObjectId(objectId) {
                        const result = this._lists
                            .filter(list => list.getObjectIds().findIndex(id => id === objectId) >= 0);
                        return result;
                    }
                    readJSON_lists(listsArray) {
                        this._lists = [];
                        for (const listData of listsArray) {
                            const list = new sceneobjects.ObjectList();
                            list.readJSON(listData);
                            this._lists.push(list);
                        }
                    }
                    readJSON(sceneData) {
                        const lists = sceneData.lists;
                        if (Array.isArray(lists)) {
                            this.readJSON_lists(lists);
                        }
                        else {
                            this._lists = [];
                        }
                    }
                    writeJSON(sceneData) {
                        sceneData.lists = undefined;
                        if (this._lists.length > 0) {
                            sceneData.lists = this.toJSON_lists();
                        }
                    }
                    toJSON_lists() {
                        const listsData = [];
                        for (const list of this._lists) {
                            const listData = {};
                            list.writeJSON(listData);
                            listsData.push(listData);
                        }
                        return listsData;
                    }
                    removeListById(id) {
                        const i = this._lists.findIndex(l => l.getId() === id);
                        if (i >= 0) {
                            this._lists.splice(i, 1);
                        }
                    }
                    removeObjectById(objId) {
                        for (const list of this._lists) {
                            const i = list.getObjectIds().findIndex(id => id === objId);
                            if (i >= 0) {
                                list.getObjectIds().splice(i, 1);
                            }
                        }
                    }
                }
                sceneobjects.ObjectLists = ObjectLists;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ListsSnapshotOperation extends ui.editor.undo.SceneEditorOperation {
                    constructor(editor) {
                        super(editor);
                    }
                    async execute() {
                        const lists = this._editor.getScene().getObjectLists();
                        this._before = lists.toJSON_lists();
                        this.performChange(lists);
                        this._after = lists.toJSON_lists();
                        this.loadData(this._after);
                    }
                    loadData(data) {
                        const lists = this._editor.getScene().getObjectLists();
                        lists.readJSON_lists(data);
                        this._editor.setDirty(true);
                        this._editor.refreshOutline();
                        this._editor.getSelectionManager().refreshSelection();
                    }
                    undo() {
                        this.loadData(this._before);
                    }
                    redo() {
                        this.loadData(this._after);
                    }
                }
                sceneobjects.ListsSnapshotOperation = ListsSnapshotOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./ListsSnapshotOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class AddObjectListOperation extends sceneobjects.ListsSnapshotOperation {
                    constructor(editor, list) {
                        super(editor);
                        this._list = list;
                    }
                    performChange(lists) {
                        lists.getLists().push(this._list);
                        this._editor.refreshOutline();
                        this._editor.setSelection([this._list]);
                    }
                }
                sceneobjects.AddObjectListOperation = AddObjectListOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class AddObjectsToListOperation extends sceneobjects.ListsSnapshotOperation {
                    constructor(editor, list, objects) {
                        super(editor);
                        this._list = list;
                        this._objects = objects;
                    }
                    performChange(lists) {
                        this._list.getObjectIds().push(...this._objects.map(obj => obj.getEditorSupport().getId()));
                        delete this._list;
                        delete this._objects;
                    }
                }
                sceneobjects.AddObjectsToListOperation = AddObjectsToListOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ChangeListOperation extends ui.editor.undo.SceneEditorOperation {
                    constructor(editor, list, performChange) {
                        super(editor);
                        this._list = list;
                        this._performChange = performChange;
                    }
                    async execute() {
                        this._before = {};
                        this._list.writeJSON(this._before);
                        this._performChange(this._list);
                        this._after = {};
                        this._list.writeJSON(this._after);
                        delete this._list;
                        this.loadData(this._after);
                    }
                    loadData(listData) {
                        const list = this._editor.getScene().getObjectLists().getListById(listData.id);
                        list.readJSON(listData);
                        this._editor.setDirty(true);
                        this._editor.refreshOutline();
                        this._editor.dispatchSelectionChanged();
                    }
                    undo() {
                        this.loadData(this._before);
                    }
                    redo() {
                        this.loadData(this._after);
                    }
                }
                sceneobjects.ChangeListOperation = ChangeListOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class NewListOperation extends sceneobjects.ListsSnapshotOperation {
                    performChange(lists) {
                        const list = new sceneobjects.ObjectList();
                        list.setLabel(this.getEditor().getScene().makeNewName("list"));
                        lists.getLists().push(list);
                        this.getEditor().setSelection([list]);
                    }
                }
                sceneobjects.NewListOperation = NewListOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./ListsSnapshotOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class RemoveObjectListOperation extends sceneobjects.ListsSnapshotOperation {
                    constructor(editor, toDeleteArray) {
                        super(editor);
                        this._toDeleteArray = toDeleteArray;
                    }
                    performChange(sceneLists) {
                        for (const list of this._toDeleteArray) {
                            const i = sceneLists.getLists().indexOf(list);
                            sceneLists.getLists().splice(i, 1);
                        }
                        this._editor.refreshOutline();
                        this._editor.setSelection([]);
                    }
                }
                sceneobjects.RemoveObjectListOperation = RemoveObjectListOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class RemoveObjectsFromListOperation extends sceneobjects.ListsSnapshotOperation {
                    constructor(editor, list, objects) {
                        super(editor);
                        this._list = list;
                        this._objects = objects;
                    }
                    performChange(lists) {
                        const objectsInListIds = this._list.getObjectIds();
                        const objectsIds = new Set(this._objects.map(obj => obj.getEditorSupport().getId()));
                        this._list.setObjectsIds(objectsInListIds.filter(id => !objectsIds.has(id)));
                        delete this._list;
                        delete this._objects;
                    }
                }
                sceneobjects.RemoveObjectsFromListOperation = RemoveObjectsFromListOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class AlphaComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [
                            AlphaComponent.alpha,
                            AlphaComponent.alphaTopLeft,
                            AlphaComponent.alphaTopRight,
                            AlphaComponent.alphaBottomLeft,
                            AlphaComponent.alphaBottomRight
                        ]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        for (const prop of this.getProperties()) {
                            this.buildSetObjectPropertyCodeDOM_FloatProperty(args, prop);
                        }
                    }
                }
                AlphaComponent.alpha = {
                    name: "alpha",
                    label: "Alpha",
                    tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alpha",
                    defValue: 1,
                    getValue: obj => obj.alpha,
                    setValue: (obj, value) => obj.alpha = value
                };
                AlphaComponent.alphaTopLeft = {
                    name: "alphaTopLeft",
                    label: "Left",
                    tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alphaTopLeft",
                    defValue: 1,
                    getValue: obj => obj.alphaTopLeft,
                    setValue: (obj, value) => obj.alphaTopLeft = value
                };
                AlphaComponent.alphaTopRight = {
                    name: "alphaTopRight",
                    label: "Right",
                    tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alphaTopRight",
                    defValue: 1,
                    getValue: obj => obj.alphaTopRight,
                    setValue: (obj, value) => obj.alphaTopRight = value
                };
                AlphaComponent.alphaBottomLeft = {
                    name: "alphaBottomLeft",
                    label: "Left",
                    tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alphaBottomLeft",
                    defValue: 1,
                    getValue: obj => obj.alphaBottomLeft,
                    setValue: (obj, value) => obj.alphaBottomLeft = value
                };
                AlphaComponent.alphaBottomRight = {
                    name: "alphaBottomRight",
                    label: "Right",
                    tooltip: "phaser:Phaser.GameObjects.Components.Alpha.alphaBottomRight",
                    defValue: 1,
                    getValue: obj => obj.alphaBottomRight,
                    setValue: (obj, value) => obj.alphaBottomRight = value
                };
                AlphaComponent.alphaTop = {
                    label: "Alpha Top",
                    x: AlphaComponent.alphaTopLeft,
                    y: AlphaComponent.alphaTopRight
                };
                AlphaComponent.alphaBottom = {
                    label: "Alpha Bottom",
                    x: AlphaComponent.alphaBottomLeft,
                    y: AlphaComponent.alphaBottomRight
                };
                sceneobjects.AlphaComponent = AlphaComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class FlipComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [FlipComponent.flipX, FlipComponent.flipY]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, ...this.getProperties());
                    }
                }
                FlipComponent.flipX = sceneobjects.SimpleProperty("flipX", false, "Flip X", "phaser:Phaser.GameObjects.Components.Flip.flipX");
                FlipComponent.flipY = sceneobjects.SimpleProperty("flipY", false, "Flip Y", "phaser:Phaser.GameObjects.Components.Flip.flipY");
                sceneobjects.FlipComponent = FlipComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var controls = colibri.ui.controls;
                class ObjectCellRenderer {
                    renderCell(args) {
                        const obj = args.obj;
                        const support = obj.getEditorSupport();
                        const hash = support.computeContentHash();
                        const key = "__renderer__image_" + hash;
                        const cached = obj.getData(key);
                        if (cached) {
                            cached.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
                            return;
                        }
                        // send image to garbage.
                        obj.data.remove("__last_renderer_image");
                        const angle = obj.angle;
                        obj.setAngle(0);
                        const render = new Phaser.GameObjects.RenderTexture(support.getScene(), 0, 0, obj.width, obj.height);
                        render.draw(obj, 0, 0);
                        render.snapshot(imgElement => {
                            const img = new controls.ImageWrapper(imgElement);
                            obj.setData("__last_renderer_image", img);
                            obj.setData(key, img);
                            img.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
                        });
                        obj.setAngle(angle);
                        render.destroy();
                    }
                    cellHeight(args) {
                        return args.viewer.getCellSize();
                    }
                    preload(args) {
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                sceneobjects.ObjectCellRenderer = ObjectCellRenderer;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../Component.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var code = scene.core.code;
                class OriginComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [
                            OriginComponent.originX,
                            OriginComponent.originY
                        ]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        const obj = this.getObject();
                        let add = false;
                        let defaultValue = 0.5;
                        if (obj instanceof sceneobjects.Text) {
                            defaultValue = 0;
                        }
                        if (args.prefabSerializer) {
                            add = obj.originX !== args.prefabSerializer.read("originX", defaultValue)
                                || obj.originY !== args.prefabSerializer.read("originY", defaultValue);
                        }
                        else {
                            add = obj.originX !== defaultValue || obj.originY !== defaultValue;
                        }
                        if (add) {
                            const dom = new code.MethodCallCodeDOM("setOrigin", args.objectVarName);
                            dom.argFloat(obj.originX);
                            dom.argFloat(obj.originY);
                            args.result.push(dom);
                        }
                    }
                }
                OriginComponent.originX = {
                    name: "originX",
                    label: "X",
                    tooltip: "phaser:Phaser.GameObjects.Components.Origin.originX",
                    defValue: 0.5,
                    getValue: obj => obj.originX,
                    setValue: (obj, value) => obj.setOrigin(value, obj.originY)
                };
                OriginComponent.originY = {
                    name: "originY",
                    label: "Y",
                    tooltip: "phaser:Phaser.GameObjects.Components.Origin.originY",
                    defValue: 0.5,
                    getValue: obj => obj.originY,
                    setValue: (obj, value) => obj.setOrigin(obj.originX, value)
                };
                OriginComponent.origin = {
                    label: "Origin",
                    tooltip: "phaser:Phaser.GameObjects.Components.Origin.setOrigin",
                    x: OriginComponent.originX,
                    y: OriginComponent.originY
                };
                sceneobjects.OriginComponent = OriginComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class SceneObjectOperation extends ui.editor.undo.SceneEditorOperation {
                    constructor(editor, objects, value) {
                        super(editor);
                        this._objects = objects;
                        this._value = value;
                    }
                    async execute() {
                        this._objIdList = this._objects.map(obj => obj.getEditorSupport().getId());
                        this._values1 = this._objects.map(_ => this._value);
                        this._values2 = this._objects.map(obj => this.getValue(obj));
                        // don't keep the objects reference, we have the ids.
                        this._objects = null;
                        this.update(this._values1);
                    }
                    undo() {
                        this.update(this._values2);
                    }
                    redo() {
                        this.update(this._values1);
                    }
                    update(values) {
                        for (let i = 0; i < this._objIdList.length; i++) {
                            const id = this._objIdList[i];
                            const obj = this._editor.getScene().getByEditorId(id);
                            const value = values[i];
                            if (obj) {
                                this.setValue(obj, value);
                            }
                        }
                        this._editor.setSelection(this._editor.getSelection());
                        this._editor.setDirty(true);
                    }
                }
                sceneobjects.SceneObjectOperation = SceneObjectOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class SimpleOperation extends sceneobjects.SceneObjectOperation {
                    constructor(editor, objects, property, value) {
                        super(editor, objects, value);
                        this._property = property;
                    }
                    getValue(obj) {
                        return this._property.getValue(obj);
                    }
                    setValue(obj, value) {
                        this._property.setValue(obj, value);
                    }
                }
                sceneobjects.SimpleOperation = SimpleOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../Component.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TransformComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [
                            TransformComponent.x,
                            TransformComponent.y,
                            TransformComponent.scaleX,
                            TransformComponent.scaleY,
                            TransformComponent.angle
                        ]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TransformComponent.scaleX, TransformComponent.scaleY, TransformComponent.angle);
                    }
                }
                TransformComponent.x = sceneobjects.SimpleProperty("x", 0, "X", "phaser:Phaser.GameObjects.Components.Transform.x", true);
                TransformComponent.y = sceneobjects.SimpleProperty("y", 0, "Y", "phaser:Phaser.GameObjects.Components.Transform.y", true);
                TransformComponent.position = {
                    label: "Position",
                    tooltip: "phaser:Phaser.GameObjects.Components.Transform.setPosition",
                    x: TransformComponent.x,
                    y: TransformComponent.y
                };
                TransformComponent.scaleX = sceneobjects.SimpleProperty("scaleX", 1, "X", "phaser:Phaser.GameObjects.Components.Transform.scaleX");
                TransformComponent.scaleY = sceneobjects.SimpleProperty("scaleY", 1, "Y", "phaser:Phaser.GameObjects.Components.Transform.scaleY");
                TransformComponent.scale = {
                    label: "Scale",
                    x: TransformComponent.scaleX,
                    y: TransformComponent.scaleY
                };
                TransformComponent.angle = sceneobjects.SimpleProperty("angle", 0, "Angle", "phaser:Phaser.GameObjects.Components.Transform.angle");
                sceneobjects.TransformComponent = TransformComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class VariableComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [
                            VariableComponent.label,
                            VariableComponent.scope
                        ]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        // nothing
                    }
                }
                VariableComponent.label = {
                    name: "label",
                    tooltip: "The variable name of the object.",
                    defValue: undefined,
                    local: true,
                    getValue: obj => obj.getEditorSupport().getLabel(),
                    setValue: (obj, value) => obj.getEditorSupport().setLabel(value)
                };
                VariableComponent.scope = {
                    name: "scope",
                    tooltip: "The variable lexical scope.",
                    defValue: sceneobjects.ObjectScope.METHOD,
                    local: true,
                    getValue: obj => obj.getEditorSupport().getScope(),
                    setValue: (obj, value) => obj.getEditorSupport().setScope(value),
                    values: [sceneobjects.ObjectScope.METHOD, sceneobjects.ObjectScope.CLASS, sceneobjects.ObjectScope.PUBLIC],
                    getValueLabel: value => value[0] + value.toLowerCase().substring(1)
                };
                sceneobjects.VariableComponent = VariableComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class VisibleComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [VisibleComponent.visible]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        this.buildSetObjectPropertyCodeDOM_BooleanProperty(args, VisibleComponent.visible);
                    }
                }
                VisibleComponent.visible = {
                    name: "visible",
                    label: "Visible",
                    defValue: true,
                    getValue: obj => obj.visible,
                    setValue: (obj, value) => obj.visible = value
                };
                sceneobjects.VisibleComponent = VisibleComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class AlphaSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.AlphaSection", "Alpha", false, true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElementWithPropertiesXY(parent);
                        this.createNumberPropertyRow(comp, sceneobjects.AlphaComponent.alpha, true);
                        this.createPropertyXYRow(comp, sceneobjects.AlphaComponent.alphaTop);
                        this.createPropertyXYRow(comp, sceneobjects.AlphaComponent.alphaBottom);
                    }
                    canEdit(obj, n) {
                        return sceneobjects.EditorSupport.getObjectComponent(obj, sceneobjects.AlphaComponent) && n > 0;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.AlphaSection = AlphaSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneObjectSection.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class FlipSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.FlipSection", "Flip", false, true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent);
                        comp.style.gridTemplateColumns = "auto auto auto auto auto";
                        this.createLock(comp, sceneobjects.FlipComponent.flipX, sceneobjects.FlipComponent.flipY);
                        this.createBooleanField(comp, sceneobjects.FlipComponent.flipX);
                        this.createBooleanField(comp, sceneobjects.FlipComponent.flipY);
                    }
                    canEdit(obj, n) {
                        return sceneobjects.EditorSupport.getObjectComponent(obj, sceneobjects.OriginComponent) !== null;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.FlipSection = FlipSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneObjectSection.ts"/>
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_28) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var controls = colibri.ui.controls;
                class GameObjectListSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.GameObjectListSection", "Lists", false, true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 2);
                        this.createLabel(comp, "Lists", "The lists where this object belongs to.");
                        const btn = this.createButton(comp, "", e => {
                            const listsRoot = this.getEditor().getScene().getObjectLists();
                            const menu = new controls.Menu();
                            const selObjIds = this.getSelection().map(obj => obj.getEditorSupport().getId());
                            const usedLists = new Set(selObjIds.flatMap(objId => listsRoot.getListsByObjectId(objId)));
                            const notUsedLists = listsRoot.getLists().filter(list => !usedLists.has(list));
                            for (const list of notUsedLists) {
                                menu.add(new controls.Action({
                                    icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_PLUS),
                                    text: list.getLabel(),
                                    callback: () => {
                                        this.getUndoManager().add(new sceneobjects.AddObjectsToListOperation(this.getEditor(), list, this.getEditor().getSelectedGameObjects()));
                                    }
                                }));
                            }
                            menu.addSeparator();
                            for (const list of usedLists) {
                                menu.add(new controls.Action({
                                    icon: colibri.ColibriPlugin.getInstance().getIcon(colibri.ICON_MINUS),
                                    text: list.getLabel(),
                                    callback: () => {
                                        this.getUndoManager().add(new sceneobjects.RemoveObjectsFromListOperation(this.getEditor(), list, this.getEditor().getSelectedGameObjects()));
                                    }
                                }));
                            }
                            menu.createWithEvent(e);
                        });
                        this.addUpdater(() => {
                            const scene = this.getEditor().getScene();
                            if (!scene) {
                                return;
                            }
                            const listsRoot = scene.getObjectLists();
                            const lists = new Set(this.getSelection()
                                .map(obj => obj.getEditorSupport().getId())
                                .flatMap(objId => listsRoot.getListsByObjectId(objId))
                                .map(list => list.getLabel()));
                            btn.textContent = "[" + [...lists].join(",") + "]";
                        });
                    }
                    canEdit(obj, n) {
                        return obj instanceof Phaser.GameObjects.GameObject;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.GameObjectListSection = GameObjectListSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_28.ui || (scene_28.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneObjectSection.ts"/>
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class GameObjectVariableSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.GameObjectVariableSection", "Variable", false);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 2);
                        {
                            // Name
                            this.createLabel(comp, "Name");
                            this.createStringField(comp, sceneobjects.VariableComponent.label, false, true);
                        }
                        {
                            // Type
                            this.createLabel(comp, "Type");
                            const text = this.createText(comp, true);
                            this.addUpdater(() => {
                                text.value = this.flatValues_StringJoinDifferent(this.getSelection().map(obj => {
                                    const support = obj.getEditorSupport();
                                    let typename = support.getObjectType();
                                    if (support.isPrefabInstance()) {
                                        typename = `prefab ${support.getPrefabName()} (${typename})`;
                                    }
                                    return typename;
                                }));
                            });
                        }
                        {
                            // Scope
                            this.createLabel(comp, "Scope", "The lexical scope of the object.");
                            this.createEnumField(comp, sceneobjects.VariableComponent.scope, false);
                        }
                    }
                    canEdit(obj, n) {
                        return obj instanceof Phaser.GameObjects.GameObject;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.GameObjectVariableSection = GameObjectVariableSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class MoveToContainerOperation extends ui.editor.undo.SceneSnapshotOperation {
                    constructor(editor, parentId) {
                        super(editor);
                        this._parentId = parentId;
                    }
                    performModification() {
                        const map = this.getScene().buildObjectIdMap();
                        const displayList = this.getScene().sys.displayList;
                        for (const obj of this.getEditor().getSelectedGameObjects()) {
                            const sprite = obj;
                            const objSupport = obj.getEditorSupport();
                            if (objSupport.getParentId() === this._parentId) {
                                continue;
                            }
                            const p = new Phaser.Math.Vector2(0, 0);
                            if (sprite.parentContainer) {
                                sprite.parentContainer.remove(sprite);
                            }
                            else {
                                displayList.remove(sprite);
                            }
                            if (this._parentId) {
                                const container = map.get(this._parentId);
                                sprite.getWorldTransformMatrix().transformPoint(0, 0, p);
                                container.getWorldTransformMatrix().applyInverse(p.x, p.y, p);
                                sprite.x = p.x;
                                sprite.y = p.y;
                                container.add(sprite);
                            }
                            else {
                                sprite.getWorldTransformMatrix().transformPoint(0, 0, p);
                                sprite.x = p.x;
                                sprite.y = p.y;
                                displayList.add(sprite);
                            }
                        }
                    }
                }
                sceneobjects.MoveToContainerOperation = MoveToContainerOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneObjectSection.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class OriginSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.OriginSection", "Origin", false, true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElementWithPropertiesXY(parent);
                        this.createPropertyXYRow(comp, sceneobjects.OriginComponent.origin);
                    }
                    canEdit(obj, n) {
                        return sceneobjects.EditorSupport.getObjectComponent(obj, sceneobjects.OriginComponent) !== null;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.OriginSection = OriginSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var controls = colibri.ui.controls;
                class ParentDialog extends controls.dialogs.ViewerDialog {
                    constructor(editor) {
                        super(new controls.viewers.TreeViewer());
                        this._editor = editor;
                    }
                    create() {
                        const viewer = this.getViewer();
                        viewer.setLabelProvider(new ui.editor.outline.SceneEditorOutlineLabelProvider());
                        viewer.setCellRendererProvider(new ui.editor.outline.SceneEditorOutlineRendererProvider());
                        viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        const input = [this._editor.getScene().sys.displayList];
                        this._editor.getScene().visit(obj => {
                            if (obj instanceof sceneobjects.Container) {
                                input.push(obj);
                            }
                        });
                        viewer.setInput(input);
                        super.create();
                        this.setTitle("Parent");
                        this.enableButtonOnlyWhenOneElementIsSelected(this.addOpenButton("Move", sel => {
                            const parent = sel[0];
                            if (parent instanceof Phaser.GameObjects.DisplayList) {
                                this._editor.getUndoManager().add(new sceneobjects.MoveToContainerOperation(this._editor));
                            }
                            else {
                                this._editor.getUndoManager().add(new sceneobjects.MoveToContainerOperation(this._editor, parent.getEditorSupport().getId()));
                            }
                        }));
                        this.addCancelButton();
                    }
                }
                sceneobjects.ParentDialog = ParentDialog;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ParentSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.ParentSection", "Parent Container", false, true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 2);
                        this.createLabel(comp, "Parent");
                        const btn = this.createButton(comp, "(Select)", e => {
                            const dlg = new sceneobjects.ParentDialog(this.getEditor());
                            dlg.create();
                        });
                        this.addUpdater(() => {
                            const sel = this.getSelection();
                            const parents = sel
                                .map(obj => obj.parentContainer)
                                .filter(cont => cont);
                            const parentsSet = new Set(parents);
                            let str;
                            if (parentsSet.size === 1 && parents.length === sel.length) {
                                str = parents[0].getEditorSupport().getLabel();
                            }
                            else if (parents.length === 0) {
                                str = "Display List";
                            }
                            else {
                                str = `(${parentsSet.size} selected)`;
                            }
                            btn.textContent = str;
                        });
                    }
                    canEdit(obj, n) {
                        return obj instanceof Phaser.GameObjects.GameObject
                            && !(obj instanceof sceneobjects.Container);
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.ParentSection = ParentSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../SceneObjectOperation.ts"/>
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class PropertyUnlockOperation extends sceneobjects.SceneObjectOperation {
                    constructor(editor, objects, properties, unlocked) {
                        super(editor, objects, unlocked);
                        this._properties = properties;
                    }
                    getValue(obj) {
                        for (const prop of this._properties) {
                            const locked = !obj.getEditorSupport().isUnlockedProperty(prop);
                            if (locked) {
                                return false;
                            }
                        }
                        return true;
                    }
                    setValue(obj, unlocked) {
                        for (const prop of this._properties) {
                            const support = obj.getEditorSupport();
                            if (support.isPrefabInstance()) {
                                if (!unlocked) {
                                    const prefabSer = support.getPrefabSerializer();
                                    const propValue = prefabSer.read(prop.name, prop.defValue);
                                    prop.setValue(obj, propValue);
                                }
                                obj.getEditorSupport().setUnlockedProperty(prop, unlocked);
                            }
                        }
                    }
                }
                sceneobjects.PropertyUnlockOperation = PropertyUnlockOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../../../editor/properties/BaseSceneSection.ts"/>
/// <reference path="./SceneObjectSection.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TransformSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.TransformSection", "Transform", false);
                    }
                    createForm(parent) {
                        const comp = this.createGridElementWithPropertiesXY(parent);
                        this.createPropertyXYRow(comp, sceneobjects.TransformComponent.position, false);
                        this.createPropertyXYRow(comp, sceneobjects.TransformComponent.scale);
                        this.createNumberPropertyRow(comp, sceneobjects.TransformComponent.angle, false);
                    }
                    canEdit(obj, n) {
                        return sceneobjects.EditorSupport.getObjectComponent(obj, sceneobjects.TransformComponent) !== null && n > 0;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.TransformSection = TransformSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class VisibleSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.VisibleSection", "Visible", false, true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent);
                        comp.style.gridTemplateColumns = "auto auto 1fr";
                        this.createBooleanProperty(comp, sceneobjects.VisibleComponent.visible);
                    }
                    canEdit(obj, n) {
                        return sceneobjects.EditorSupport.getObjectComponent(obj, sceneobjects.VisibleComponent) && n > 0;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.VisibleSection = VisibleSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class BaseObjectTool extends ui.editor.tools.SceneTool {
                    constructor(config, ...properties) {
                        super(config);
                        this._properties = properties;
                    }
                    canEdit(obj) {
                        if (obj instanceof Phaser.GameObjects.GameObject) {
                            const support = obj.getEditorSupport();
                            for (const prop of this._properties) {
                                if (!support.hasProperty(prop)) {
                                    return false;
                                }
                                if (!support.isUnlockedProperty(prop)) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        return false;
                    }
                    canRender(obj) {
                        if (obj instanceof Phaser.GameObjects.GameObject) {
                            const support = obj.getEditorSupport();
                            for (const prop of this._properties) {
                                if (support.hasProperty(prop)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                }
                sceneobjects.BaseObjectTool = BaseObjectTool;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class RotateLineToolItem extends ui.editor.tools.SceneToolItem {
                    constructor(start) {
                        super();
                        this._start = start;
                    }
                    render(args) {
                        let globalStartAngle = 0;
                        let globalEndAngle = 0;
                        for (const sprite of args.objects) {
                            const endAngle = this.globalAngle(sprite);
                            const startAngle = 0;
                            globalStartAngle += startAngle;
                            globalEndAngle += endAngle;
                        }
                        const len = args.objects.length;
                        globalStartAngle /= len;
                        globalEndAngle /= len;
                        const angle = this._start ? globalStartAngle : globalEndAngle;
                        const point = this.getAvgScreenPointOfObjects(args);
                        const ctx = args.canvasContext;
                        ctx.save();
                        ctx.translate(point.x, point.y);
                        ctx.rotate(Phaser.Math.DegToRad(angle));
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(100, 0);
                        ctx.strokeStyle = "#000";
                        ctx.lineWidth = 4;
                        ctx.stroke();
                        ctx.strokeStyle = args.canEdit ? sceneobjects.RotateToolItem.COLOR : ui.editor.tools.SceneTool.COLOR_CANNOT_EDIT;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.restore();
                    }
                    containsPoint(args) {
                        return false;
                    }
                    onStartDrag(args) {
                        // nothing
                    }
                    onDrag(args) {
                        // nothing
                    }
                    onStopDrag(args) {
                        // nothing
                    }
                }
                sceneobjects.RotateLineToolItem = RotateLineToolItem;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../../../editor/tools/SceneToolOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class RotateOperation extends ui.editor.tools.SceneToolOperation {
                    getInitialValue(obj) {
                        return sceneobjects.RotateToolItem.getInitialAngle(obj);
                    }
                    getFinalValue(obj) {
                        return obj.angle;
                    }
                    setValue(obj, value) {
                        obj.angle = value;
                    }
                }
                sceneobjects.RotateOperation = RotateOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./BaseObjectTool.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class RotateTool extends sceneobjects.BaseObjectTool {
                    constructor() {
                        super({
                            id: RotateTool.ID,
                            command: ui.editor.commands.CMD_ROTATE_SCENE_OBJECT,
                        }, sceneobjects.TransformComponent.angle);
                        this.addItems(new sceneobjects.RotateLineToolItem(true), new sceneobjects.RotateLineToolItem(false), new ui.editor.tools.CenterPointToolItem(sceneobjects.RotateToolItem.COLOR), new sceneobjects.RotateToolItem());
                    }
                }
                RotateTool.ID = "phasereditor2d.scene.ui.sceneobjects.RotateTool";
                sceneobjects.RotateTool = RotateTool;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class RotateToolItem extends ui.editor.tools.SceneToolItem {
                    constructor() {
                        super();
                    }
                    getPoint(args) {
                        return this.getAvgScreenPointOfObjects(args);
                    }
                    render(args) {
                        const point = this.getPoint(args);
                        const ctx = args.canvasContext;
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, 100, 0, Math.PI * 2);
                        ctx.lineWidth = 4;
                        ctx.strokeStyle = "#000";
                        ctx.stroke();
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = args.canEdit ? RotateToolItem.COLOR : ui.editor.tools.SceneTool.COLOR_CANNOT_EDIT;
                        ctx.stroke();
                    }
                    containsPoint(args) {
                        const point = this.getPoint(args);
                        const d = Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y);
                        return Math.abs(d - 100) < 10;
                    }
                    onStartDrag(args) {
                        if (!this.containsPoint(args)) {
                            return;
                        }
                        this._initCursorPos = { x: args.x, y: args.y };
                        for (const obj of args.objects) {
                            obj.setData("AngleToolItem.initAngle", obj.angle);
                        }
                    }
                    onDrag(args) {
                        if (!this._initCursorPos) {
                            return;
                        }
                        const dx = this._initCursorPos.x - args.x;
                        const dy = this._initCursorPos.y - args.y;
                        if (Math.abs(dx) < 1 || Math.abs(dy) < 1) {
                            return;
                        }
                        const point = this.getPoint(args);
                        for (const obj of args.objects) {
                            const sprite = obj;
                            const deltaRadians = angleBetweenTwoPointsWithFixedPoint(args.x, args.y, this._initCursorPos.x, this._initCursorPos.y, point.x, point.y);
                            const initAngle = sprite.getData("AngleToolItem.initAngle");
                            const deltaAngle = Phaser.Math.RadToDeg(deltaRadians);
                            sprite.angle = initAngle + deltaAngle;
                        }
                        args.editor.dispatchSelectionChanged();
                    }
                    static getInitialAngle(obj) {
                        return obj.getData("AngleToolItem.initAngle");
                    }
                    onStopDrag(args) {
                        if (!this._initCursorPos) {
                            return;
                        }
                        args.editor.getUndoManager().add(new sceneobjects.RotateOperation(args));
                        this._initCursorPos = null;
                    }
                }
                RotateToolItem.COLOR = "#aaf";
                sceneobjects.RotateToolItem = RotateToolItem;
                function angleBetweenTwoPointsWithFixedPoint(point1X, point1Y, point2X, point2Y, fixedX, fixedY) {
                    const angle1 = Math.atan2(point1Y - fixedY, point1X - fixedX);
                    const angle2 = Math.atan2(point2Y - fixedY, point2X - fixedX);
                    return angle1 - angle2;
                }
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ScaleOperation extends ui.editor.tools.SceneToolOperation {
                    getInitialValue(obj) {
                        return sceneobjects.ScaleToolItem.getInitialScale(obj);
                    }
                    getFinalValue(obj) {
                        const sprite = obj;
                        return { x: sprite.scaleX, y: sprite.scaleY };
                    }
                    setValue(obj, value) {
                        const sprite = obj;
                        sprite.setScale(value.x, value.y);
                    }
                }
                sceneobjects.ScaleOperation = ScaleOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./BaseObjectTool.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ScaleTool extends sceneobjects.BaseObjectTool {
                    constructor() {
                        super({
                            id: ScaleTool.ID,
                            command: ui.editor.commands.CMD_SCALE_SCENE_OBJECT,
                        }, sceneobjects.TransformComponent.scaleX, sceneobjects.TransformComponent.scaleY);
                        this.addItems(new sceneobjects.ScaleToolItem(1, 0.5), new sceneobjects.ScaleToolItem(1, 1), new sceneobjects.ScaleToolItem(0.5, 1));
                    }
                }
                ScaleTool.ID = "phasereditor2d.scene.ui.sceneobjects.ScaleTool";
                sceneobjects.ScaleTool = ScaleTool;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ScaleToolItem extends ui.editor.tools.SceneToolItem {
                    constructor(x, y) {
                        super();
                        this._x = x;
                        this._y = y;
                    }
                    getPoint(args) {
                        return this.getAvgScreenPointOfObjects(args, (sprite) => this._x - sprite.originX, (sprite) => this._y - sprite.originY);
                    }
                    render(args) {
                        const point = this.getPoint(args);
                        const ctx = args.canvasContext;
                        ctx.save();
                        ctx.translate(point.x, point.y);
                        const angle = this.globalAngle(args.objects[0]);
                        ctx.rotate(Phaser.Math.DegToRad(angle));
                        this.drawRect(ctx, args.canEdit ? "#0ff" : ui.editor.tools.SceneTool.COLOR_CANNOT_EDIT);
                        ctx.restore();
                    }
                    containsPoint(args) {
                        const point = this.getPoint(args);
                        return Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y) < 20;
                    }
                    onStartDrag(args) {
                        if (!this.containsPoint(args)) {
                            return;
                        }
                        this._dragging = true;
                        const point = this.getPoint(args);
                        for (const obj of args.objects) {
                            const sprite = obj;
                            const worldTx = new Phaser.GameObjects.Components.TransformMatrix();
                            const initLocalPos = new Phaser.Math.Vector2();
                            sprite.getWorldTransformMatrix(worldTx);
                            worldTx.applyInverse(point.x, point.y, initLocalPos);
                            sprite.setData("ScaleToolItem", {
                                initScaleX: sprite.scaleX,
                                initScaleY: sprite.scaleY,
                                initWidth: sprite.width,
                                initHeight: sprite.height,
                                initLocalPos: initLocalPos,
                                initWorldTx: worldTx
                            });
                        }
                    }
                    static getInitialScale(obj) {
                        const data = obj.getData("ScaleToolItem");
                        return { x: data.initScaleX, y: data.initScaleY };
                    }
                    onDrag(args) {
                        if (!this._dragging) {
                            return;
                        }
                        for (const obj of args.objects) {
                            const sprite = obj;
                            const data = sprite.data.get("ScaleToolItem");
                            const initLocalPos = data.initLocalPos;
                            const localPos = new Phaser.Math.Vector2();
                            const worldTx = data.initWorldTx;
                            worldTx.applyInverse(args.x, args.y, localPos);
                            let flipX = sprite.flipX ? -1 : 1;
                            let flipY = sprite.flipY ? -1 : 1;
                            if (sprite instanceof Phaser.GameObjects.TileSprite) {
                                flipX = 1;
                                flipY = 1;
                            }
                            const dx = (localPos.x - initLocalPos.x) * flipX / args.camera.zoom;
                            const dy = (localPos.y - initLocalPos.y) * flipY / args.camera.zoom;
                            let width = data.initWidth - sprite.displayOriginX;
                            let height = data.initHeight - sprite.displayOriginY;
                            if (width === 0) {
                                width = data.initWidth;
                            }
                            if (height === 0) {
                                height = data.initHeight;
                            }
                            const scaleDX = dx / width * data.initScaleX;
                            const scaleDY = dy / height * data.initScaleY;
                            const newScaleX = data.initScaleX + scaleDX;
                            const newScaleY = data.initScaleY + scaleDY;
                            const changeAll = this._x === 1 && this._y === 1;
                            const changeX = this._x === 1 && this._y === 0.5 || changeAll;
                            const changeY = this._x === 0.5 && this._y === 1 || changeAll;
                            if (changeX) {
                                sprite.scaleX = newScaleX;
                            }
                            if (changeY) {
                                sprite.scaleY = newScaleY;
                            }
                            args.editor.dispatchSelectionChanged();
                        }
                    }
                    onStopDrag(args) {
                        if (this._dragging) {
                            args.editor.getUndoManager().add(new sceneobjects.ScaleOperation(args));
                            this._dragging = false;
                        }
                    }
                }
                sceneobjects.ScaleToolItem = ScaleToolItem;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TileSpriteSizeOperation extends ui.editor.tools.SceneToolOperation {
                    getInitialValue(obj) {
                        return sceneobjects.TileSpriteSizeToolItem.getInitialSize(obj);
                    }
                    getFinalValue(obj) {
                        const sprite = obj;
                        return { x: sprite.width, y: sprite.height };
                    }
                    setValue(obj, value) {
                        const sprite = obj;
                        sprite.setSize(value.x, value.y);
                    }
                }
                sceneobjects.TileSpriteSizeOperation = TileSpriteSizeOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TileSpriteSizeTool extends sceneobjects.BaseObjectTool {
                    constructor() {
                        super({
                            id: TileSpriteSizeTool.ID,
                            command: ui.editor.commands.CMD_RESIZE_TILE_SPRITE_SCENE_OBJECT,
                        }, sceneobjects.TileSpriteComponent.width, sceneobjects.TileSpriteComponent.height);
                        this.addItems(new sceneobjects.TileSpriteSizeToolItem(1, 0.5), new sceneobjects.TileSpriteSizeToolItem(1, 1), new sceneobjects.TileSpriteSizeToolItem(0.5, 1));
                    }
                    canEdit(obj) {
                        return obj instanceof sceneobjects.TileSprite;
                    }
                }
                TileSpriteSizeTool.ID = "phasereditor2d.scene.ui.sceneobjects.TileSpriteResizeTool";
                sceneobjects.TileSpriteSizeTool = TileSpriteSizeTool;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TileSpriteSizeToolItem extends ui.editor.tools.SceneToolItem {
                    constructor(x, y) {
                        super();
                        this._x = x;
                        this._y = y;
                    }
                    getPoint(args) {
                        return this.getAvgScreenPointOfObjects(args, (sprite) => this._x - sprite.originX, (sprite) => this._y - sprite.originY);
                    }
                    render(args) {
                        const point = this.getPoint(args);
                        const ctx = args.canvasContext;
                        ctx.save();
                        ctx.translate(point.x, point.y);
                        const angle = this.globalAngle(args.objects[0]);
                        ctx.rotate(Phaser.Math.DegToRad(angle));
                        this.drawRect(ctx, args.canEdit ? "#00f" : ui.editor.tools.SceneTool.COLOR_CANNOT_EDIT);
                        ctx.restore();
                    }
                    containsPoint(args) {
                        const point = this.getPoint(args);
                        return Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y) < 20;
                    }
                    onStartDrag(args) {
                        if (!this.containsPoint(args)) {
                            return;
                        }
                        this._dragging = true;
                        const point = this.getPoint(args);
                        const worldTx = new Phaser.GameObjects.Components.TransformMatrix();
                        for (const obj of args.objects) {
                            const sprite = obj;
                            const initLocalPos = new Phaser.Math.Vector2();
                            sprite.getWorldTransformMatrix(worldTx);
                            worldTx.applyInverse(point.x, point.y, initLocalPos);
                            sprite.setData("TileSizeTool", {
                                initWidth: sprite.width,
                                initHeight: sprite.height,
                                initLocalPos: initLocalPos
                            });
                        }
                    }
                    static getInitialSize(obj) {
                        const data = obj.getData("TileSizeTool");
                        return { x: data.initWidth, y: data.initHeight };
                    }
                    onDrag(args) {
                        if (!this._dragging) {
                            return;
                        }
                        const camera = args.camera;
                        const worldTx = new Phaser.GameObjects.Components.TransformMatrix();
                        for (const obj of args.objects) {
                            const sprite = obj;
                            const data = sprite.data.get("TileSizeTool");
                            const initLocalPos = data.initLocalPos;
                            const localPos = new Phaser.Math.Vector2();
                            sprite.getWorldTransformMatrix(worldTx);
                            worldTx.applyInverse(args.x, args.y, localPos);
                            const flipX = sprite.flipX ? -1 : 1;
                            const flipY = sprite.flipY ? -1 : 1;
                            const dx = (localPos.x - initLocalPos.x) * flipX / camera.zoom;
                            const dy = (localPos.y - initLocalPos.y) * flipY / camera.zoom;
                            const { x: width, y: height } = args.editor.getScene().snapPoint(data.initWidth + dx, data.initHeight + dy);
                            const changeAll = this._x === 1 && this._y === 1;
                            const changeX = this._x === 1 && this._y === 0.5 || changeAll;
                            const changeY = this._x === 0.5 && this._y === 1 || changeAll;
                            if (changeX) {
                                sprite.setSize(width, sprite.height);
                            }
                            if (changeY) {
                                sprite.setSize(sprite.width, height);
                            }
                            args.editor.dispatchSelectionChanged();
                        }
                    }
                    onStopDrag(args) {
                        if (this._dragging) {
                            args.editor.getUndoManager().add(new sceneobjects.TileSpriteSizeOperation(args));
                            this._dragging = false;
                        }
                    }
                }
                sceneobjects.TileSpriteSizeToolItem = TileSpriteSizeToolItem;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../../../editor/tools/SceneToolOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TranslateOperation extends ui.editor.tools.SceneToolOperation {
                    getInitialValue(obj) {
                        return sceneobjects.TranslateToolItem.getInitObjectPosition(obj);
                    }
                    getFinalValue(obj) {
                        const sprite = obj;
                        return { x: sprite.x, y: sprite.y };
                    }
                    setValue(obj, value) {
                        const sprite = obj;
                        sprite.x = value.x;
                        sprite.y = value.y;
                    }
                }
                sceneobjects.TranslateOperation = TranslateOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TranslateTool extends sceneobjects.BaseObjectTool {
                    constructor() {
                        super({
                            id: TranslateTool.ID,
                            command: ui.editor.commands.CMD_TRANSLATE_SCENE_OBJECT,
                        }, sceneobjects.TransformComponent.x, sceneobjects.TransformComponent.y);
                        const x = new sceneobjects.TranslateToolItem("x");
                        const y = new sceneobjects.TranslateToolItem("y");
                        const xy = new sceneobjects.TranslateToolItem("xy");
                        this.addItems(new ui.editor.tools.LineToolItem("#f00", xy, x), new ui.editor.tools.LineToolItem("#0f0", xy, y), xy, x, y);
                    }
                }
                TranslateTool.ID = "phasereditor2d.scene.ui.sceneobjects.TranslateTool";
                sceneobjects.TranslateTool = TranslateTool;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TranslateToolItem extends ui.editor.tools.SceneToolItem {
                    constructor(axis) {
                        super();
                        this._axis = axis;
                    }
                    containsPoint(args) {
                        const point = this.getPoint(args);
                        const d = Phaser.Math.Distance.Between(args.x, args.y, point.x, point.y);
                        return d < 20;
                    }
                    onStartDrag(args) {
                        if (this.containsPoint(args)) {
                            this._initCursorPos = { x: args.x, y: args.y };
                            for (const obj of args.objects) {
                                const sprite = obj;
                                sprite.setData("TranslateTool.initPosition", { x: sprite.x, y: sprite.y });
                            }
                        }
                    }
                    onDrag(args) {
                        if (!this._initCursorPos) {
                            return;
                        }
                        const dx = args.x - this._initCursorPos.x;
                        const dy = args.y - this._initCursorPos.y;
                        for (const obj of args.objects) {
                            const sprite = obj;
                            const scale = this.getScreenToObjectScale(args, obj);
                            const dx2 = dx / scale.x;
                            const dy2 = dy / scale.y;
                            const { x, y } = sprite.getData("TranslateTool.initPosition");
                            const xAxis = this._axis === "x" || this._axis === "xy" ? 1 : 0;
                            const yAxis = this._axis === "y" || this._axis === "xy" ? 1 : 0;
                            const { x: x2, y: y2 } = args.editor.getScene().snapPoint(x + dx2 * xAxis, y + dy2 * yAxis);
                            sprite.setPosition(x2, y2);
                        }
                        args.editor.dispatchSelectionChanged();
                    }
                    static getInitObjectPosition(obj) {
                        return obj.getData("TranslateTool.initPosition");
                    }
                    onStopDrag(args) {
                        if (this._initCursorPos) {
                            const editor = args.editor;
                            editor.getUndoManager().add(new sceneobjects.TranslateOperation(args));
                        }
                        this._initCursorPos = null;
                    }
                    getPoint(args) {
                        const { x, y } = this.getAvgScreenPointOfObjects(args);
                        return {
                            x: this._axis === "x" ? x + 100 : x,
                            y: this._axis === "y" ? y + 100 : y
                        };
                    }
                    render(args) {
                        const { x, y } = this.getPoint(args);
                        const ctx = args.canvasContext;
                        ctx.strokeStyle = "#000";
                        if (this._axis === "xy") {
                            ctx.save();
                            ctx.translate(x, y);
                            this.drawCircle(ctx, args.canEdit ? "#ff0" : ui.editor.tools.SceneTool.COLOR_CANNOT_EDIT);
                            ctx.restore();
                        }
                        else {
                            ctx.save();
                            ctx.translate(x, y);
                            if (this._axis === "y") {
                                ctx.rotate(Math.PI / 2);
                            }
                            this.drawArrowPath(ctx, args.canEdit ? (this._axis === "x" ? "#f00" : "#0f0") : ui.editor.tools.SceneTool.COLOR_CANNOT_EDIT);
                            ctx.restore();
                        }
                    }
                }
                sceneobjects.TranslateToolItem = TranslateToolItem;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_29) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class Sprite extends Phaser.GameObjects.Image {
                    constructor(scene, x, y, texture, frame) {
                        super(scene, x, y, texture, frame);
                        this._editorSupport = new sceneobjects.SpriteEditorSupport(this, scene);
                    }
                    getEditorSupport() {
                        return this._editorSupport;
                    }
                }
                sceneobjects.Sprite = Sprite;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_29.ui || (scene_29.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../image/BaseImageEditorSupport.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_30) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class SpriteEditorSupport extends sceneobjects.BaseImageEditorSupport {
                    constructor(obj, scene) {
                        super(sceneobjects.SpriteExtension.getInstance(), obj, scene);
                    }
                }
                sceneobjects.SpriteEditorSupport = SpriteEditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_30.ui || (scene_30.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_31) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class SpriteExtension extends sceneobjects.BaseImageExtension {
                    constructor() {
                        super({
                            phaserTypeName: "Phaser.GameObjects.Sprite",
                            typeName: "Sprite"
                        });
                    }
                    static getInstance() {
                        return this._instance;
                    }
                    getCodeDOMBuilder() {
                        return new sceneobjects.BaseImageCodeDOMBuilder("sprite");
                    }
                    newObject(scene, x, y, key, frame) {
                        return new sceneobjects.Sprite(scene, x, y, key, frame);
                    }
                }
                SpriteExtension._instance = new SpriteExtension();
                sceneobjects.SpriteExtension = SpriteExtension;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_31.ui || (scene_31.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_32) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class Text extends Phaser.GameObjects.Text {
                    constructor(scene, x, y, text, style) {
                        super(scene, x, y, text, style);
                        this._editorSupport = new sceneobjects.TextEditorSupport(this, scene);
                    }
                    getEditorSupport() {
                        return this._editorSupport;
                    }
                }
                sceneobjects.Text = Text;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_32.ui || (scene_32.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var code = scene.core.code;
                class TextCodeDOMBuilder extends sceneobjects.ObjectCodeDOMBuilder {
                    buildCreateObjectWithFactoryCodeDOM(args) {
                        const obj = args.obj;
                        const call = new code.MethodCallCodeDOM("text", args.gameObjectFactoryExpr);
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                        call.argLiteral("");
                        call.arg("{}");
                        return call;
                    }
                    buildCreatePrefabInstanceCodeDOM(args) {
                        const obj = args.obj;
                        const call = args.methodCallDOM;
                        call.arg(args.sceneExpr);
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                    }
                    buildPrefabConstructorDeclarationSupperCallCodeDOM(args) {
                        const call = args.superMethodCallCodeDOM;
                        call.arg("x");
                        call.arg("y");
                        if (!args.prefabObj.getEditorSupport().isPrefabInstance()) {
                            call.argLiteral("");
                            call.arg("{}");
                        }
                    }
                    buildPrefabConstructorDeclarationCodeDOM(args) {
                        const ctr = args.ctrDeclCodeDOM;
                        ctr.arg("x", "number");
                        ctr.arg("y", "number");
                    }
                }
                sceneobjects.TextCodeDOMBuilder = TextCodeDOMBuilder;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var code = scene.core.code;
                class TextComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [
                            TextComponent.fixedWidth,
                            TextComponent.fixedHeight,
                            TextComponent.paddingLeft,
                            TextComponent.paddingTop,
                            TextComponent.paddingRight,
                            TextComponent.paddingBottom,
                            TextComponent.lineSpacing,
                            TextComponent.align,
                            TextComponent.fontFamily,
                            TextComponent.fontSize,
                            TextComponent.fontStyle,
                            TextComponent.color,
                            TextComponent.stroke,
                            TextComponent.strokeThickness,
                            TextComponent.backgroundColor,
                            TextComponent.shadowOffsetX,
                            TextComponent.shadowOffsetY,
                            TextComponent.shadowStroke,
                            TextComponent.shadowFill,
                            TextComponent.shadowColor,
                            TextComponent.shadowBlur,
                            TextComponent.baselineX,
                            TextComponent.baselineY,
                            TextComponent.maxLines
                        ]);
                    }
                    styleToJson() {
                        const comp = TextComponent;
                        const obj = this.getObject();
                        const support = obj.getEditorSupport();
                        const data = {};
                        const simpleProps = [
                            comp.align,
                            comp.backgroundColor,
                            comp.baselineX,
                            comp.baselineY,
                            comp.color,
                            comp.fixedWidth,
                            comp.fixedHeight,
                            comp.fontFamily,
                            comp.fontSize,
                            comp.fontStyle,
                            comp.maxLines,
                            comp.stroke,
                            comp.strokeThickness,
                            comp.shadowOffsetX,
                            comp.shadowOffsetY,
                            comp.shadowColor,
                            comp.shadowBlur,
                            comp.shadowStroke,
                            comp.shadowFill
                        ];
                        if (support.isPrefabInstance()) {
                            for (const prop of simpleProps) {
                                if (support.isUnlockedProperty(prop)) {
                                    data[prop.name] = prop.getValue(obj);
                                }
                            }
                        }
                        else {
                            for (const prop of simpleProps) {
                                const value = prop.getValue(obj);
                                if (value !== prop.defValue) {
                                    data[prop.name] = value;
                                }
                            }
                        }
                        return data;
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        const obj = this.getObject();
                        const support = obj.getEditorSupport();
                        {
                            // style
                            const style = this.styleToJson();
                            const literal = JSON.stringify(style);
                            if (literal !== "{}") {
                                const dom = new code.MethodCallCodeDOM("setStyle", args.objectVarName);
                                dom.arg(literal);
                                args.result.push(dom);
                            }
                        }
                        {
                            // padding
                            const comp = TextComponent;
                            const padding = {};
                            const map = {
                                left: comp.paddingLeft,
                                top: comp.paddingTop,
                                right: comp.paddingRight,
                                bottom: comp.paddingBottom
                            };
                            if (support.isPrefabInstance()) {
                                // tslint:disable-next-line:forin
                                for (const key in map) {
                                    const prop = map[key];
                                    if (support.isUnlockedProperty(prop)) {
                                        padding[key] = prop.getValue(obj);
                                    }
                                }
                            }
                            else {
                                // tslint:disable-next-line:forin
                                for (const key in map) {
                                    const prop = map[key];
                                    const value = prop.getValue(obj);
                                    if (value !== prop.defValue) {
                                        padding[key] = value;
                                    }
                                }
                            }
                            const literal = JSON.stringify(padding);
                            if (literal !== "{}") {
                                const dom = new code.MethodCallCodeDOM("setPadding", args.objectVarName);
                                dom.arg(literal);
                                args.result.push(dom);
                            }
                        }
                    }
                }
                TextComponent.fixedWidth = {
                    name: "fixedWidth",
                    label: "Width",
                    defValue: 0,
                    getValue: obj => obj.style.fixedWidth,
                    setValue: (obj, value) => obj.setFixedSize(value, obj.style.fixedHeight)
                };
                TextComponent.fixedHeight = {
                    name: "fixedHeight",
                    label: "Height",
                    defValue: 0,
                    getValue: obj => obj.style.fixedHeight,
                    setValue: (obj, value) => obj.setFixedSize(obj.style.fixedWidth, value)
                };
                TextComponent.fixedSize = {
                    label: "Fixed Size",
                    x: TextComponent.fixedWidth,
                    y: TextComponent.fixedHeight
                };
                TextComponent.paddingLeft = {
                    name: "paddingLeft",
                    label: "Padding Left",
                    defValue: 0,
                    getValue: obj => obj.padding["left"],
                    setValue: (obj, value) => { obj.padding["left"] = value; obj.updateText(); }
                };
                TextComponent.paddingTop = {
                    name: "paddingTop",
                    label: "Padding Top",
                    defValue: 0,
                    getValue: obj => obj.padding["top"],
                    setValue: (obj, value) => { obj.padding["top"] = value; obj.updateText(); }
                };
                TextComponent.paddingRight = {
                    name: "paddingRight",
                    label: "Padding Right",
                    defValue: 0,
                    getValue: obj => obj.padding["right"],
                    setValue: (obj, value) => { obj.padding["right"] = value; obj.updateText(); }
                };
                TextComponent.paddingBottom = {
                    name: "paddingBottom",
                    label: "Padding Bottom",
                    defValue: 0,
                    getValue: obj => obj.padding["bottom"],
                    setValue: (obj, value) => { obj.padding["bottom"] = value; obj.updateText(); }
                };
                TextComponent.lineSpacing = {
                    name: "lineSpacing",
                    label: "Line Spacing",
                    defValue: 0,
                    getValue: obj => obj.lineSpacing,
                    setValue: (obj, value) => obj.setLineSpacing(value)
                };
                TextComponent.align = {
                    name: "align",
                    label: "Align",
                    defValue: "left",
                    getValue: obj => obj.style.align,
                    setValue: (obj, value) => obj.setAlign(value),
                    values: ["left", "right", "center", "justify"],
                    getValueLabel: value => value.toUpperCase()
                };
                TextComponent.fontFamily = {
                    name: "fontFamily",
                    label: "Font Family",
                    defValue: "Courier",
                    getValue: obj => obj.style.fontFamily,
                    setValue: (obj, value) => obj.setFontFamily(value)
                };
                TextComponent.fontSize = {
                    name: "fontSize",
                    label: "Font Size",
                    defValue: "16px",
                    getValue: obj => obj.style.fontSize,
                    setValue: (obj, value) => obj.setFontSize(value)
                };
                TextComponent.fontStyle = {
                    name: "fontStyle",
                    label: "Font Style",
                    defValue: "",
                    getValue: obj => obj.style.fontStyle,
                    setValue: (obj, value) => obj.setFontStyle(value),
                    values: ["", "italic", "bold", "bold italic"],
                    getValueLabel: value => value === "" ? "(Default)" : value.toUpperCase()
                };
                TextComponent.color = {
                    name: "color",
                    label: "Color",
                    defValue: "#fff",
                    getValue: obj => obj.style.color,
                    setValue: (obj, value) => obj.setColor(value)
                };
                TextComponent.stroke = {
                    name: "stroke",
                    label: "Stroke",
                    defValue: "#fff",
                    getValue: obj => obj.style.stroke,
                    setValue: (obj, value) => obj.setStroke(value, obj.style.strokeThickness)
                };
                TextComponent.strokeThickness = {
                    name: "strokeThickness",
                    label: "Stroke Thickness",
                    defValue: 0,
                    getValue: obj => obj.style.strokeThickness,
                    setValue: (obj, value) => obj.setStroke(obj.style.stroke, value)
                };
                TextComponent.backgroundColor = {
                    name: "backgroundColor",
                    label: "Background Color",
                    defValue: null,
                    getValue: obj => obj.style.backgroundColor,
                    setValue: (obj, value) => obj.setBackgroundColor(value)
                };
                TextComponent.shadowOffsetX = {
                    name: "shadow.offsetX",
                    label: "X",
                    defValue: 0,
                    getValue: obj => obj.style.shadowOffsetX,
                    setValue: (obj, value) => obj.setShadowOffset(value, obj.style.shadowOffsetY)
                };
                TextComponent.shadowOffsetY = {
                    name: "shadow.offsetY",
                    label: "Y",
                    defValue: 0,
                    getValue: obj => obj.style.shadowOffsetY,
                    setValue: (obj, value) => obj.setShadowOffset(obj.style.shadowOffsetX, value)
                };
                TextComponent.shadowOffset = {
                    label: "Shadow Offset",
                    x: TextComponent.shadowOffsetX,
                    y: TextComponent.shadowOffsetY
                };
                TextComponent.shadowStroke = {
                    name: "shadow.stroke",
                    label: "Stroke",
                    defValue: false,
                    getValue: obj => obj.style.shadowStroke,
                    setValue: (obj, value) => obj.setShadowStroke(value)
                };
                TextComponent.shadowFill = {
                    name: "shadow.fill",
                    label: "Fill",
                    defValue: false,
                    getValue: obj => obj.style.shadowFill,
                    setValue: (obj, value) => obj.setShadowFill(value)
                };
                TextComponent.shadow = {
                    label: "Shadow",
                    x: TextComponent.shadowStroke,
                    y: TextComponent.shadowFill
                };
                TextComponent.shadowColor = {
                    name: "shadow.color",
                    label: "Shadow Color",
                    defValue: "#000",
                    getValue: obj => obj.style.shadowColor,
                    setValue: (obj, value) => obj.setShadowColor(value)
                };
                TextComponent.shadowBlur = {
                    name: "shadow.blur",
                    label: "Shadow Blur",
                    defValue: 0,
                    getValue: obj => obj.style.shadowBlur,
                    setValue: (obj, value) => obj.setShadowBlur(value)
                };
                TextComponent.baselineX = {
                    name: "baselineX",
                    label: "X",
                    defValue: 1.2,
                    getValue: obj => obj.style.baselineX,
                    setValue: (obj, value) => obj.style.baselineX = value
                };
                TextComponent.baselineY = {
                    name: "baselineY",
                    label: "Y",
                    defValue: 1.4,
                    getValue: obj => obj.style.baselineY,
                    setValue: (obj, value) => obj.style.baselineY = value
                };
                TextComponent.baseline = {
                    label: "Baseline",
                    x: TextComponent.baselineX,
                    y: TextComponent.baselineY
                };
                TextComponent.maxLines = {
                    name: "maxLines",
                    label: "Max Lines",
                    defValue: 0,
                    getValue: obj => obj.style.maxLines,
                    setValue: (obj, value) => obj.setMaxLines(value)
                };
                sceneobjects.TextComponent = TextComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_33) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TextEditorSupport extends sceneobjects.EditorSupport {
                    constructor(obj, scene) {
                        super(sceneobjects.TextExtension.getInstance(), obj, scene);
                        this.addComponent(new sceneobjects.TransformComponent(obj), new sceneobjects.OriginComponent(obj), new sceneobjects.FlipComponent(obj), new sceneobjects.VisibleComponent(obj), new sceneobjects.AlphaComponent(obj), new sceneobjects.TextContentComponent(obj), new sceneobjects.TextComponent(obj));
                    }
                    computeContentHash() {
                        const obj = this.getObject();
                        const hash = JSON.stringify({
                            text: obj.text,
                            style: obj.style.toJSON(),
                            flip: obj.flipX + "," + obj.flipY,
                            tint: obj.tint,
                            angle: obj.angle
                        });
                        return hash;
                    }
                    getCellRenderer() {
                        return new sceneobjects.ObjectCellRenderer();
                    }
                    setInteractive() {
                        this.getObject().setInteractive();
                    }
                }
                sceneobjects.TextEditorSupport = TextEditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_33.ui || (scene_33.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TextExtension extends sceneobjects.SceneObjectExtension {
                    constructor() {
                        super({
                            phaserTypeName: "Phaser.GameObjects.Text",
                            typeName: "Text"
                        });
                    }
                    static getInstance() {
                        return this._instance;
                    }
                    acceptsDropData(data) {
                        return false;
                    }
                    createSceneObjectWithAsset(args) {
                        return null;
                    }
                    createEmptySceneObject(args) {
                        const text = new sceneobjects.Text(args.scene, args.x, args.y, "New text", {});
                        return text;
                    }
                    createSceneObjectWithData(args) {
                        const text = new sceneobjects.Text(args.scene, 0, 0, "", {});
                        text.getEditorSupport().readJSON(args.data);
                        return text;
                    }
                    async getAssetsFromObjectData(args) {
                        return [];
                    }
                    getCodeDOMBuilder() {
                        return new sceneobjects.TextCodeDOMBuilder();
                    }
                }
                TextExtension._instance = new TextExtension();
                sceneobjects.TextExtension = TextExtension;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TextSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor.scene.ui.sceneobjects.TextSection", "Text");
                    }
                    createForm(parent) {
                        const comp = this.createGridElementWithPropertiesXY(parent);
                        // fontFamily
                        this.createPropertyStringRow(comp, sceneobjects.TextComponent.fontFamily).style.gridColumn = "3 / span 4";
                        // fontSize
                        this.createPropertyStringRow(comp, sceneobjects.TextComponent.fontSize).style.gridColumn = "3 / span 4";
                        // fontStyle
                        this.createPropertyEnumRow(comp, sceneobjects.TextComponent.fontStyle).style.gridColumn = "3 / span 4";
                        // align
                        this.createPropertyEnumRow(comp, sceneobjects.TextComponent.align).style.gridColumn = "3 / span 4";
                        // color
                        this.createPropertyStringRow(comp, sceneobjects.TextComponent.color).style.gridColumn = "3 / span 4";
                        // stroke
                        this.createPropertyStringRow(comp, sceneobjects.TextComponent.stroke).style.gridColumn = "3 / span 4";
                        // strokeThickness
                        this.createPropertyFloatRow(comp, sceneobjects.TextComponent.strokeThickness).style.gridColumn = "3 / span 4";
                        // backgroundColor
                        this.createPropertyStringRow(comp, sceneobjects.TextComponent.backgroundColor).style.gridColumn = "3 / span 4";
                        // shadow
                        this.createPropertyBoolXYRow(comp, sceneobjects.TextComponent.shadow);
                        // shadowOffset
                        this.createPropertyXYRow(comp, sceneobjects.TextComponent.shadowOffset);
                        // shadowColor
                        this.createPropertyStringRow(comp, sceneobjects.TextComponent.shadowColor).style.gridColumn = "3 / span 4";
                        // shadowBlur
                        this.createPropertyFloatRow(comp, sceneobjects.TextComponent.shadowBlur).style.gridColumn = "3 / span 4";
                        // fixedSize
                        this.createPropertyXYRow(comp, sceneobjects.TextComponent.fixedSize);
                        {
                            // padding
                            const comp2 = this.createGridElement(comp);
                            comp2.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
                            comp2.style.gridColumn = "3 / span 4";
                            comp2.style.paddingBottom = "0px";
                            comp.appendChild(comp2);
                            this.createLabel(comp2, "Left").style.justifySelf = "center";
                            this.createLabel(comp2, "Top").style.justifySelf = "center";
                            this.createLabel(comp2, "Right").style.justifySelf = "center";
                            this.createLabel(comp2, "Bottom").style.justifySelf = "center";
                            this.createLock(comp, sceneobjects.TextComponent.paddingLeft, sceneobjects.TextComponent.paddingTop, sceneobjects.TextComponent.paddingRight, sceneobjects.TextComponent.paddingBottom);
                            this.createLabel(comp, "Padding");
                            const comp3 = this.createGridElement(comp);
                            comp3.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
                            comp3.style.gridColumn = "3 / span 4";
                            comp.appendChild(comp3);
                            this.createFloatField(comp3, sceneobjects.TextComponent.paddingLeft);
                            this.createFloatField(comp3, sceneobjects.TextComponent.paddingTop);
                            this.createFloatField(comp3, sceneobjects.TextComponent.paddingRight);
                            this.createFloatField(comp3, sceneobjects.TextComponent.paddingBottom);
                        }
                        // baseline
                        this.createPropertyXYRow(comp, sceneobjects.TextComponent.baseline);
                        // lineSpacing
                        this.createPropertyFloatRow(comp, sceneobjects.TextComponent.lineSpacing).style.gridColumn = "3 / span 4";
                        // maxLines
                        this.createPropertyFloatRow(comp, sceneobjects.TextComponent.maxLines).style.gridColumn = "3 / span 4";
                    }
                    canEdit(obj, n) {
                        return obj instanceof sceneobjects.Text;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.TextSection = TextSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ChangeTextureOperation extends sceneobjects.SceneObjectOperation {
                    static runDialog(editor) {
                        const finder = editor.getPackFinder();
                        const cache = editor.getScene().getPackCache();
                        const objects = editor.getSelectedGameObjects()
                            .filter(obj => sceneobjects.EditorSupport.hasObjectComponent(obj, sceneobjects.TextureComponent))
                            .filter(obj => !obj.getEditorSupport().isPrefabInstance()
                            || obj.getEditorSupport().isUnlockedProperty(sceneobjects.TextureComponent.texture));
                        const objectKeys = objects
                            .map(obj => sceneobjects.EditorSupport.getObjectComponent(obj, sceneobjects.TextureComponent))
                            .map(comp => comp.getTextureKeys());
                        const selectedFrames = objectKeys.map(k => cache.getImage(k.key, k.frame));
                        sceneobjects.TextureSelectionDialog.createDialog(finder, selectedFrames, async (sel) => {
                            const frame = sel[0];
                            let newKeys;
                            const item = frame.getPackItem();
                            item.addToPhaserCache(editor.getGame(), cache);
                            if (item instanceof phasereditor2d.pack.core.ImageAssetPackItem) {
                                newKeys = { key: item.getKey() };
                            }
                            else {
                                newKeys = { key: item.getKey(), frame: frame.getName() };
                            }
                            editor
                                .getUndoManager().add(new ChangeTextureOperation(editor, objects, newKeys));
                        });
                    }
                    constructor(editor, objects, value) {
                        super(editor, objects, value);
                    }
                    getValue(obj) {
                        const comp = obj.getEditorSupport().getComponent(sceneobjects.TextureComponent);
                        return comp.getTextureKeys();
                    }
                    setValue(obj, value) {
                        const finder = this.getEditor().getPackFinder();
                        const item = finder.findAssetPackItem(value.key);
                        if (item) {
                            item.addToPhaserCache(this.getEditor().getGame(), this.getScene().getPackCache());
                        }
                        const comp = obj.getEditorSupport().getComponent(sceneobjects.TextureComponent);
                        comp.setTextureKeys(value);
                        const editor = this.getEditor();
                        editor.refreshDependenciesHash();
                        editor.dispatchSelectionChanged();
                        editor.repaint();
                    }
                }
                sceneobjects.ChangeTextureOperation = ChangeTextureOperation;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var controls = colibri.ui.controls;
                class TextureCellRenderer {
                    renderCell(args) {
                        const image = this.getImage(args);
                        if (image) {
                            image.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
                        }
                        else {
                            controls.DefaultImage.paintEmpty(args.canvasContext, args.x, args.y, args.w, args.h);
                        }
                    }
                    getImage(args) {
                        const obj = args.obj;
                        const support = obj.getEditorSupport();
                        const textureComp = support.getComponent(sceneobjects.TextureComponent);
                        if (textureComp) {
                            const { key, frame } = textureComp.getTextureKeys();
                            const image = support.getScene().getPackCache().getImage(key, frame);
                            return image;
                        }
                        return null;
                    }
                    cellHeight(args) {
                        return args.viewer.getCellSize();
                    }
                    async preload(args) {
                        const image = this.getImage(args);
                        if (image) {
                            return image.preload();
                        }
                        return controls.PreloadResult.NOTHING_LOADED;
                    }
                }
                sceneobjects.TextureCellRenderer = TextureCellRenderer;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="../Component.ts"/>
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TextureComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [
                            TextureComponent.texture
                        ]);
                        this._textureKeys = {};
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        // nothing, the properties are set when the object is created.
                    }
                    getTextureKeys() {
                        return this._textureKeys;
                    }
                    setTextureKeys(keys) {
                        this._textureKeys = keys;
                        if (this._textureKeys.frame === null) {
                            this._textureKeys.frame = undefined;
                        }
                        const obj = this.getObject();
                        obj.setTexture(keys.key || null, keys.frame);
                    }
                    removeTexture() {
                        this.setTextureKeys({});
                    }
                }
                TextureComponent.texture = {
                    name: "texture",
                    defValue: {},
                    getValue: obj => {
                        const textureComponent = obj.getEditorSupport().getComponent(TextureComponent);
                        return textureComponent.getTextureKeys();
                    },
                    setValue: (obj, value) => {
                        const textureComponent = obj.getEditorSupport().getComponent(TextureComponent);
                        textureComponent.setTextureKeys(value);
                    }
                };
                sceneobjects.TextureComponent = TextureComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var controls = colibri.ui.controls;
                var ide = colibri.ui.ide;
                class TextureSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.TextureSection", "Texture", false, true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent);
                        comp.style.gridTemplateColumns = "auto 1fr auto";
                        // Preview
                        const imgComp = document.createElement("div");
                        imgComp.style.gridColumn = "1/ span 3";
                        imgComp.style.height = "200px";
                        comp.appendChild(imgComp);
                        const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);
                        imgControl.getElement().style.position = "relative";
                        this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e) => {
                            setTimeout(() => imgControl.resizeTo(), 1);
                        });
                        imgComp.appendChild(imgControl.getElement());
                        this.addUpdater(async () => {
                            const frames = this.getSelectedFrames();
                            imgControl.setImage(new controls.MultiImage(frames, 10, 10));
                            setTimeout(() => imgControl.resizeTo(), 1);
                        });
                        // Lock
                        this.createLock(comp, sceneobjects.TextureComponent.texture);
                        // Buttons
                        {
                            const changeBtn = this.createButton(comp, "Select", e => {
                                sceneobjects.ChangeTextureOperation.runDialog(this.getEditor());
                            });
                            const deleteBtn = this.createButton(comp, "Delete", e => {
                                this.getEditor().getUndoManager()
                                    .add(new sceneobjects.ChangeTextureOperation(this.getEditor(), this.getSelection(), {}));
                            });
                            this.addUpdater(() => {
                                if (this.getSelection().length === 1) {
                                    const obj = this.getSelection()[0];
                                    const textureComp = this.getTextureComponent(obj);
                                    const { key, frame } = textureComp.getTextureKeys();
                                    let str = "(Select)";
                                    if (frame !== undefined) {
                                        str = frame + " @ " + key;
                                    }
                                    else if (key) {
                                        str = key;
                                    }
                                    changeBtn.textContent = str;
                                }
                                else {
                                    changeBtn.textContent = "Multiple Textures";
                                }
                                const unlocked = this.isUnlocked(sceneobjects.TextureComponent.texture);
                                changeBtn.disabled = !unlocked;
                                deleteBtn.disabled = !unlocked;
                            });
                        }
                    }
                    getSelectedFrames() {
                        // this happens when the editor is opened but the scene is not yet created
                        if (!this.getEditor().getScene()) {
                            return [];
                        }
                        const cache = this.getEditor().getScene().getPackCache();
                        const images = new Set();
                        for (const obj of this.getSelection()) {
                            const textureComp = this.getTextureComponent(obj);
                            const { key, frame } = textureComp.getTextureKeys();
                            const img = cache.getImage(key, frame);
                            if (img) {
                                images.add(img);
                            }
                        }
                        return [...images];
                    }
                    getTextureComponent(obj) {
                        return obj.getEditorSupport().getComponent(sceneobjects.TextureComponent);
                    }
                    canEdit(obj, n) {
                        return sceneobjects.EditorSupport.getObjectComponent(obj, sceneobjects.TextureComponent) !== null;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.TextureSection = TextureSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var controls = colibri.ui.controls;
                class TextureSelectionDialog extends controls.dialogs.ViewerDialog {
                    constructor(finder, callback) {
                        super(new controls.viewers.TreeViewer());
                        this._finder = finder;
                        this._callback = callback;
                        const size = this.getSize();
                        this.setSize(size.width, size.height * 1.5);
                    }
                    static async createDialog(finder, selected, callback) {
                        const dlg = new TextureSelectionDialog(finder, callback);
                        dlg.create();
                        dlg.getViewer().setSelection(selected);
                        dlg.getViewer().reveal(...selected);
                        return dlg;
                    }
                    create() {
                        const viewer = this.getViewer();
                        viewer.setLabelProvider(new phasereditor2d.pack.ui.viewers.AssetPackLabelProvider());
                        viewer.setTreeRenderer(new controls.viewers.ShadowGridTreeViewerRenderer(viewer, false, true));
                        viewer.setCellRendererProvider(new phasereditor2d.pack.ui.viewers.AssetPackCellRendererProvider("grid"));
                        viewer.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
                        viewer.setCellSize(64);
                        viewer.setInput(this._finder.getPacks()
                            .flatMap(pack => pack.getItems())
                            .filter(item => item instanceof phasereditor2d.pack.core.ImageFrameContainerAssetPackItem)
                            .flatMap(item => {
                            const frames = item.getFrames();
                            if (item instanceof phasereditor2d.pack.core.SpritesheetAssetPackItem) {
                                if (frames.length > 50) {
                                    return frames.slice(0, 50);
                                }
                            }
                            return frames;
                        }));
                        super.create();
                        this.setTitle("Select Texture");
                        const btn = this.addButton("Select", () => {
                            this._callback(this.getViewer().getSelection());
                            this.close();
                        });
                        btn.disabled = true;
                        this.getViewer().addEventListener(controls.EVENT_SELECTION_CHANGED, e => {
                            btn.disabled = this.getViewer().getSelection().length === 0;
                        });
                        this.addButton("Cancel", () => this.close());
                    }
                }
                sceneobjects.TextureSelectionDialog = TextureSelectionDialog;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_34) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TileSprite extends Phaser.GameObjects.TileSprite {
                    constructor(scene, x, y, width, height, texture, frame) {
                        super(scene, x, y, width, height, texture, frame);
                        this._editorSupport = new sceneobjects.TileSpriteEditorSupport(this, scene);
                    }
                    getEditorSupport() {
                        return this._editorSupport;
                    }
                }
                sceneobjects.TileSprite = TileSprite;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_34.ui || (scene_34.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                var code = scene.core.code;
                class TileSpriteCodeDOMBuilder extends sceneobjects.BaseImageCodeDOMBuilder {
                    constructor() {
                        super("tileSprite");
                    }
                    buildCreatePrefabInstanceCodeDOM(args) {
                        const obj = args.obj;
                        const support = obj.getEditorSupport();
                        const call = args.methodCallDOM;
                        call.arg(args.sceneExpr);
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                        if (support.isUnlockedProperty(sceneobjects.TileSpriteComponent.width)) {
                            call.argFloat(obj.width);
                        }
                        else {
                            call.arg("undefined");
                        }
                        if (support.isUnlockedProperty(sceneobjects.TileSpriteComponent.height)) {
                            call.argFloat(obj.height);
                        }
                        else {
                            call.arg("undefined");
                        }
                        if (support.isUnlockedProperty(sceneobjects.TextureComponent.texture)) {
                            this.addTextureFrameArgsToObjectFactoryMethodCallDOM(args.methodCallDOM, args.obj);
                        }
                    }
                    buildPrefabConstructorDeclarationCodeDOM(args) {
                        const ctr = args.ctrDeclCodeDOM;
                        ctr.arg("x", "number");
                        ctr.arg("y", "number");
                        ctr.arg("width", "number", true);
                        ctr.arg("height", "number", true);
                        ctr.arg("texture", "string", true);
                        ctr.arg("frame", "number | string", true);
                    }
                    buildPrefabConstructorDeclarationSupperCallCodeDOM(args) {
                        const obj = args.prefabObj;
                        const support = obj.getEditorSupport();
                        const call = args.superMethodCallCodeDOM;
                        call.arg("x");
                        call.arg("y");
                        if (support.isLockedProperty(sceneobjects.TileSpriteComponent.width)) {
                            call.argFloat(obj.width);
                        }
                        else {
                            call.arg("typeof width === \"number\" ? width : " + obj.width);
                        }
                        if (support.isLockedProperty(sceneobjects.TileSpriteComponent.height)) {
                            call.argFloat(obj.height);
                        }
                        else {
                            call.arg("typeof height === \"number\" ? height : " + obj.height);
                        }
                        this.buildPrefabConstructorDeclarationSupperCallCodeDOM_TextureParameters(args, call);
                    }
                    buildCreateObjectWithFactoryCodeDOM(args) {
                        const obj = args.obj;
                        const call = new code.MethodCallCodeDOM("tileSprite", args.gameObjectFactoryExpr);
                        call.argFloat(obj.x);
                        call.argFloat(obj.y);
                        call.argFloat(obj.width);
                        call.argFloat(obj.height);
                        this.addTextureFrameArgsToObjectFactoryMethodCallDOM(call, obj);
                        return call;
                    }
                }
                sceneobjects.TileSpriteCodeDOMBuilder = TileSpriteCodeDOMBuilder;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TileSpriteComponent extends sceneobjects.Component {
                    constructor(obj) {
                        super(obj, [
                            TileSpriteComponent.width,
                            TileSpriteComponent.height,
                            TileSpriteComponent.tilePositionX,
                            TileSpriteComponent.tilePositionY,
                            TileSpriteComponent.tileScaleX,
                            TileSpriteComponent.tileScaleY
                        ]);
                    }
                    buildSetObjectPropertiesCodeDOM(args) {
                        this.buildSetObjectPropertyCodeDOM_FloatProperty(args, TileSpriteComponent.tilePositionX, TileSpriteComponent.tilePositionY, TileSpriteComponent.tileScaleX, TileSpriteComponent.tileScaleY);
                    }
                }
                TileSpriteComponent.width = sceneobjects.SimpleProperty("width", undefined, "Width");
                TileSpriteComponent.height = sceneobjects.SimpleProperty("height", undefined, "Height");
                TileSpriteComponent.tilePositionX = sceneobjects.SimpleProperty("tilePositionX", 0, "X");
                TileSpriteComponent.tilePositionY = sceneobjects.SimpleProperty("tilePositionY", 0, "Y");
                TileSpriteComponent.tileScaleX = sceneobjects.SimpleProperty("tileScaleX", 1, "X");
                TileSpriteComponent.tileScaleY = sceneobjects.SimpleProperty("tileScaleY", 1, "Y");
                TileSpriteComponent.size = {
                    label: "Size",
                    x: TileSpriteComponent.width,
                    y: TileSpriteComponent.height
                };
                TileSpriteComponent.tilePosition = {
                    label: "Tile Position",
                    x: TileSpriteComponent.tilePositionX,
                    y: TileSpriteComponent.tilePositionY
                };
                TileSpriteComponent.tileScale = {
                    label: "Tile Scale",
                    x: TileSpriteComponent.tileScaleX,
                    y: TileSpriteComponent.tileScaleY
                };
                sceneobjects.TileSpriteComponent = TileSpriteComponent;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_35) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TileSpriteEditorSupport extends sceneobjects.BaseImageEditorSupport {
                    constructor(obj, scene) {
                        super(sceneobjects.TileSpriteExtension.getInstance(), obj, scene);
                        this.addComponent(new sceneobjects.TileSpriteComponent(obj));
                    }
                    setInteractive() {
                        this.getObject().setInteractive(sceneobjects.interactive_getAlpha_RenderTexture);
                    }
                }
                sceneobjects.TileSpriteEditorSupport = TileSpriteEditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_35.ui || (scene_35.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_36) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TileSpriteExtension extends sceneobjects.BaseImageExtension {
                    constructor() {
                        super({
                            phaserTypeName: "Phaser.GameObjects.TileSprite",
                            typeName: "TileSprite"
                        });
                    }
                    static getInstance() {
                        return this._instance;
                    }
                    adaptDataAfterTypeConversion(serializer, originalObject) {
                        super.adaptDataAfterTypeConversion(serializer, originalObject);
                        const obj = originalObject;
                        const width = obj.width === undefined ? 20 : obj.width;
                        const height = obj.height === undefined ? 20 : obj.height;
                        serializer.getData()[sceneobjects.TileSpriteComponent.width.name] = width;
                        serializer.getData()[sceneobjects.TileSpriteComponent.height.name] = height;
                    }
                    getCodeDOMBuilder() {
                        return new sceneobjects.TileSpriteCodeDOMBuilder();
                    }
                    newObject(scene, x, y, key, frame) {
                        if (key) {
                            return new sceneobjects.TileSprite(scene, x, y, 0, 0, key, frame);
                        }
                        return new sceneobjects.TileSprite(scene, x, y, 64, 64, null, null);
                    }
                }
                TileSpriteExtension._instance = new TileSpriteExtension();
                sceneobjects.TileSpriteExtension = TileSpriteExtension;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_36.ui || (scene_36.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class TileSpriteSection extends sceneobjects.SceneObjectSection {
                    constructor(page) {
                        super(page, "phasereditor2d.scene.ui.sceneobjects.TileSprite", "Tile Sprite", false, true);
                    }
                    createForm(parent) {
                        const comp = this.createGridElementWithPropertiesXY(parent);
                        this.createPropertyXYRow(comp, sceneobjects.TileSpriteComponent.size);
                        this.createPropertyXYRow(comp, sceneobjects.TileSpriteComponent.tilePosition);
                        this.createPropertyXYRow(comp, sceneobjects.TileSpriteComponent.tileScale);
                    }
                    canEdit(obj, n) {
                        return obj instanceof sceneobjects.TileSprite && n > 0;
                    }
                    canEditNumber(n) {
                        return n > 0;
                    }
                }
                sceneobjects.TileSpriteSection = TileSpriteSection;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                var io = colibri.core.io;
                class ObjectExtensionAndPrefabCellRendererProvider {
                    getCellRenderer(element) {
                        if (element instanceof io.FilePath) {
                            return new viewers.SceneFileCellRenderer();
                        }
                        return new viewers.ObjectExtensionCellRendererProvider().getCellRenderer(element);
                    }
                    preload(args) {
                        if (args.obj instanceof io.FilePath) {
                            return new viewers.SceneFileCellRenderer().preload(args);
                        }
                        return controls.Controls.resolveNothingLoaded();
                    }
                }
                viewers.ObjectExtensionAndPrefabCellRendererProvider = ObjectExtensionAndPrefabCellRendererProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class ObjectExtensionCellRendererProvider extends controls.viewers.EmptyCellRendererProvider {
                    constructor() {
                        super(_ => new controls.viewers.IconImageCellRenderer(scene.ScenePlugin.getInstance().getIcon(scene.ICON_GROUP)));
                    }
                }
                viewers.ObjectExtensionCellRendererProvider = ObjectExtensionCellRendererProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                var controls = colibri.ui.controls;
                class ObjectExtensionLabelProvider extends controls.viewers.LabelProvider {
                    getLabel(ext) {
                        return ext.getTypeName();
                    }
                }
                viewers.ObjectExtensionLabelProvider = ObjectExtensionLabelProvider;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ui;
        (function (ui) {
            var viewers;
            (function (viewers) {
                class SceneFileCellRenderer {
                    renderCell(args) {
                        const file = args.obj;
                        const image = ui.SceneThumbnailCache.getInstance().getContent(file);
                        if (image) {
                            image.paint(args.canvasContext, args.x, args.y, args.w, args.h, args.center);
                        }
                    }
                    cellHeight(args) {
                        return args.viewer.getCellSize();
                    }
                    async preload(args) {
                        const file = args.obj;
                        return ui.SceneThumbnailCache.getInstance().preload(file);
                    }
                }
                viewers.SceneFileCellRenderer = SceneFileCellRenderer;
            })(viewers = ui.viewers || (ui.viewers = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
