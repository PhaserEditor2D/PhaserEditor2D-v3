var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene) {
        var ide = colibri.ui.ide;
        scene.ICON_GROUP = "group";
        scene.ICON_TRANSLATE = "translate";
        scene.ICON_ANGLE = "angle";
        scene.ICON_SCALE = "scale";
        scene.ICON_ORIGIN = "origin";
        class ScenePlugin extends colibri.Plugin {
            constructor() {
                super("phasereditor2d.scene");
            }
            static getInstance() {
                return this._instance;
            }
            registerExtensions(reg) {
                // content type resolvers
                reg.addExtension(new colibri.core.ContentTypeExtension([new scene.core.SceneContentTypeResolver()], 5));
                // content type renderer
                reg.addExtension(new phasereditor2d.files.ui.viewers.SimpleContentTypeCellRendererExtension(scene.core.CONTENT_TYPE_SCENE, new scene.ui.viewers.SceneFileCellRenderer()));
                // icons loader
                reg.addExtension(ide.IconLoaderExtension.withPluginFiles(this, [
                    scene.ICON_GROUP,
                    scene.ICON_ANGLE,
                    scene.ICON_ORIGIN,
                    scene.ICON_SCALE,
                    scene.ICON_TRANSLATE
                ]));
                // commands
                reg.addExtension(new ide.commands.CommandExtension(scene.ui.editor.commands.SceneEditorCommands.registerCommands));
                // editors
                reg.addExtension(new ide.EditorExtension([
                    scene.ui.editor.SceneEditor.getFactory()
                ]));
                // new file wizards
                reg.addExtension(new scene.ui.dialogs.NewSceneFileDialogExtension());
                // scene object extensions
                reg.addExtension(scene.ui.sceneobjects.ImageExtension.getInstance(), scene.ui.sceneobjects.ContainerExtension.getInstance());
                // loader updates
                reg.addExtension(new scene.ui.sceneobjects.ImageLoaderUpdater());
                // property sections
                reg.addExtension(new scene.ui.editor.properties.SceneEditorPropertySectionExtension(page => new scene.ui.sceneobjects.VariableSection(page), page => new scene.ui.sceneobjects.TransformSection(page), page => new scene.ui.sceneobjects.OriginSection(page), page => new scene.ui.sceneobjects.TextureSection(page)));
            }
            getObjectExtensions() {
                return colibri.Platform
                    .getExtensions(scene.ui.sceneobjects.SceneObjectExtension.POINT_ID);
            }
            getObjectExtensionByObjectType(type) {
                return this.getObjectExtensions().find(ext => ext.getTypeName() === type);
            }
            getLoaderUpdaterForAsset(asset) {
                const exts = colibri.Platform
                    .getExtensions(scene.ui.sceneobjects.LoaderUpdaterExtension.POINT_ID);
                for (const ext of exts) {
                    if (ext.acceptAsset(asset)) {
                        return ext;
                    }
                }
                return null;
            }
        }
        ScenePlugin._instance = new ScenePlugin();
        scene.ScenePlugin = ScenePlugin;
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
                class AssignPropertyCodeDOM {
                    constructor(propertyName, contentExpr) {
                        this._propertyName = propertyName;
                        this._contextExpr = contentExpr;
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
                        return s;
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
                        this._members = [];
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
                    getMembers() {
                        return this._members;
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
                class FieldDeclCodeDOM extends code.MemberDeclCodeDOM {
                    constructor(name) {
                        super(name);
                    }
                    getType() {
                        return this._type;
                    }
                    setType(type) {
                        this._type = type;
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
                        for (const elem of this._unit.getElements()) {
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
                        for (const memberDecl of clsDecl.getMembers()) {
                            this.generateMemberDecl(memberDecl);
                            this.line();
                        }
                        this.section("/* START-USER-CODE */", "/* END-USER-CODE */", "\n\n// Write your code here.\n\n");
                        this.closeIndent("}");
                        this.line();
                    }
                    generateMemberDecl(memberDecl) {
                        if (memberDecl instanceof code_1.MethodDeclCodeDOM) {
                            this.generateMethodDecl(memberDecl, false);
                        }
                    }
                    generateMethodDecl(methodDecl, isFunction) {
                        if (isFunction) {
                            this.append("function ");
                        }
                        this.append(methodDecl.getName() + "() ");
                        this.line("{");
                        this.openIndent();
                        for (const instr of methodDecl.getInstructions()) {
                            this.generateInstr(instr);
                        }
                        this.closeIndent("}");
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
                        this.append(assign.getContextExpr());
                        this.append(".");
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
                        if (call.getContextExpr() != null) {
                            this.append(call.getContextExpr());
                            this.append(".");
                        }
                        this.append(call.getMethodName());
                        this.append("(");
                        this.join(call.getArgs());
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
                    constructor(methodName, contextExpr) {
                        super();
                        this._methodName = methodName;
                        this._contextExpr = contextExpr;
                        this._args = [];
                        this._declareReturnToVar = true;
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
                    arg(expr) {
                        this._args.push(expr);
                    }
                    argLiteral(expr) {
                        this._args.push(code.CodeDOM.quote(expr));
                    }
                    argFloat(n) {
                        // tslint:disable-next-line:no-construct
                        this._args.push(new Number(n).toString());
                    }
                    argInt(n) {
                        // tslint:disable-next-line:no-construct
                        this._args.push(new Number(Math.floor(n)).toString());
                    }
                    getMethodName() {
                        return this._methodName;
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
                    }
                    getInstructions() {
                        return this._instructions;
                    }
                    setInstructions(instructions) {
                        this._instructions = instructions;
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
    (function (scene_1) {
        var core;
        (function (core) {
            var code;
            (function (code) {
                class SceneCodeDOMBuilder {
                    constructor(scene, file) {
                        this._scene = scene;
                        this._file = file;
                    }
                    build() {
                        const methods = [];
                        const fields = [];
                        const unit = new code.UnitCodeDOM([]);
                        const settings = this._scene.getSettings();
                        if (settings.onlyGenerateMethods) {
                            // TODO
                        }
                        else {
                            const clsName = this._file.getNameWithoutExtension();
                            const clsDecl = new code.ClassDeclCodeDOM(clsName);
                            clsDecl.setSuperClass(settings.superClassName);
                            clsDecl.getMembers().push(...methods);
                            clsDecl.getMembers().push(...fields);
                            unit.getElements().push(clsDecl);
                        }
                        return unit;
                    }
                }
                code.SceneCodeDOMBuilder = SceneCodeDOMBuilder;
            })(code = core.code || (core.code = {}));
        })(core = scene_1.core || (scene_1.core = {}));
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
                    generateMemberDecl(memberDecl) {
                        if (memberDecl instanceof code.FieldDeclCodeDOM) {
                            this.line("private " + memberDecl.getName() + ": " + memberDecl.getType() + ";");
                        }
                        else {
                            super.generateMemberDecl(memberDecl);
                        }
                    }
                    generateTypeAnnotation(assign) {
                        // do nothing, in TypeScript uses the var declaration syntax
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
                        this._elements = elements;
                    }
                    getElements() {
                        return this._elements;
                    }
                    setElements(elements) {
                        this._elements = elements;
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
                var FileUtils = colibri.ui.ide.FileUtils;
                class SceneDataTable {
                    constructor() {
                        this._dataMap = new Map();
                        this._fileMap = new Map();
                    }
                    async preload() {
                        const dataMap = new Map();
                        const fileMap = new Map();
                        const files = await FileUtils.getFilesWithContentType(core.CONTENT_TYPE_SCENE);
                        for (const file of files) {
                            const content = await FileUtils.preloadAndGetFileString(file);
                            try {
                                const data = JSON.parse(content);
                                if (data.id) {
                                    if (data.displayList.length > 0) {
                                        const objData = data.displayList[0];
                                        dataMap.set(data.id, objData);
                                        fileMap.set(data.id, file);
                                    }
                                }
                            }
                            catch (e) {
                                console.error(`SceneDataTable: parsing file ${file.getFullName()}. Error: ${e.message}`);
                            }
                        }
                        this._dataMap = dataMap;
                        this._fileMap = fileMap;
                    }
                    getPrefabData(prefabId) {
                        return this._dataMap.get(prefabId);
                    }
                    getPrefabFile(prefabId) {
                        return this._fileMap.get(prefabId);
                    }
                }
                json.SceneDataTable = SceneDataTable;
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
                class SceneSettings {
                    constructor(snapEnabled = false, snapWidth = 16, snapHeight = 16, onlyGenerateMethods = false, superClassName = "Phaser.Scene", preloadMethodName = "", createMethodName = "create", sceneKey = "", compilerLang = "JavaScript", scopeBlocksToFolder = false, methodContextType = "Scene", borderX = 0, borderY = 0, borderWidth = 800, borderHeight = 600) {
                        this.snapEnabled = snapEnabled;
                        this.snapWidth = snapWidth;
                        this.snapHeight = snapHeight;
                        this.onlyGenerateMethods = onlyGenerateMethods;
                        this.superClassName = superClassName;
                        this.preloadMethodName = preloadMethodName;
                        this.createMethodName = createMethodName;
                        this.sceneKey = sceneKey;
                        this.compilerLang = compilerLang;
                        this.scopeBlocksToFolder = scopeBlocksToFolder;
                        this.methodContextType = methodContextType;
                        this.borderX = borderX;
                        this.borderY = borderY;
                        this.borderWidth = borderWidth;
                        this.borderHeight = borderHeight;
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
    (function (scene_2) {
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
                            displayList: [],
                            meta: {
                                app: "Phaser Editor 2D - Scene Editor",
                                url: "https://phasereditor2d.com",
                                contentType: core.CONTENT_TYPE_SCENE
                            }
                        };
                        for (const obj of this._scene.getDisplayListChildren()) {
                            const objData = {};
                            obj.getEditorSupport().writeJSON(this._scene.getMaker().getSerializer(objData));
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
        })(core = scene_2.core || (scene_2.core = {}));
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
                    constructor(data, table) {
                        this._data = data;
                        this._table = table;
                        if (this._data.prefabId) {
                            const prefabData = table.getPrefabData(this._data.prefabId);
                            if (prefabData) {
                                this._prefabSer = new Serializer(prefabData, table);
                            }
                            else {
                                console.error(`Cannot find scene prefab with id "${this._data.prefabId}".`);
                            }
                        }
                    }
                    getSerializer(data) {
                        return new Serializer(data, this._table);
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
                    getDefaultValue(name, defValue) {
                        const value = this._data[name];
                        if (value !== undefined) {
                            return value;
                        }
                        let defValueInPrefab;
                        if (this._prefabSer) {
                            defValueInPrefab = this._prefabSer.getDefaultValue(name, defValue);
                        }
                        if (defValueInPrefab !== undefined) {
                            return defValueInPrefab;
                        }
                        return defValue;
                    }
                    write(name, value, defValue) {
                        const defValue2 = this.getDefaultValue(name, defValue);
                        colibri.core.json.write(this._data, name, value, defValue2);
                    }
                    read(name, defValue) {
                        const defValue2 = this.getDefaultValue(name, defValue);
                        const value = colibri.core.json.read(this._data, name, defValue2);
                        return value;
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
                const x = worldX * this.zoom - this.scrollX * this.zoom;
                const y = worldY * this.zoom - this.scrollY * this.zoom;
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
            class GameScene extends Phaser.Scene {
                constructor(inEditor = true) {
                    super("ObjectScene");
                    this._id = Phaser.Utils.String.UUID();
                    this._inEditor = inEditor;
                    this._sceneType = "Scene";
                    this._maker = new ui.SceneMaker(this);
                    this._settings = new scene.core.json.SceneSettings();
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
                getMaker() {
                    return this._maker;
                }
                getDisplayListChildren() {
                    return this.sys.displayList.getChildren();
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
                makeNewName(baseName) {
                    const nameMaker = new colibri.ui.ide.utils.NameMaker((obj) => {
                        return obj.getEditorSupport().getLabel();
                    });
                    this.visit(obj => nameMaker.update([obj]));
                    return nameMaker.makeName(baseName);
                }
                getByEditorId(id) {
                    const obj = GameScene.findByEditorId(this.getDisplayListChildren(), id);
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
                getSceneType() {
                    return this._sceneType;
                }
                setSceneType(sceneType) {
                    this._sceneType = sceneType;
                }
                getCamera() {
                    return this.cameras.main;
                }
                setInitialState(state) {
                    this._initialState = state;
                }
                create() {
                    var _a, _b, _c;
                    if (this._inEditor) {
                        const camera = this.getCamera();
                        camera.setOrigin(0, 0);
                        // camera.backgroundColor = Phaser.Display.Color.ValueToColor("#6e6e6e");
                        camera.backgroundColor = Phaser.Display.Color.ValueToColor("#8e8e8e");
                        if (this._initialState) {
                            camera.zoom = (_a = this._initialState.cameraZoom, (_a !== null && _a !== void 0 ? _a : camera.zoom));
                            camera.scrollX = (_b = this._initialState.cameraScrollX, (_b !== null && _b !== void 0 ? _b : camera.scrollX));
                            camera.scrollY = (_c = this._initialState.cameraScrollY, (_c !== null && _c !== void 0 ? _c : camera.scrollY));
                            this._initialState = null;
                        }
                    }
                }
            }
            ui.GameScene = GameScene;
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_3) {
        var ui;
        (function (ui) {
            var json = scene_3.core.json;
            var FileUtils = colibri.ui.ide.FileUtils;
            class SceneMaker {
                constructor(scene) {
                    this._scene = scene;
                    this._sceneDataTable = new json.SceneDataTable();
                }
                static isValidSceneDataFormat(data) {
                    return "displayList" in data && Array.isArray(data.displayList);
                }
                async preload() {
                    await this._sceneDataTable.preload();
                }
                isPrefabFile(file) {
                    const ct = colibri.Platform.getWorkbench().getContentTypeRegistry().getCachedContentType(file);
                    // TODO: missing to check if it is a scene of type prefab.
                    return ct === scene_3.core.CONTENT_TYPE_SCENE;
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
                            prefabId: prefabData.id
                        });
                        return obj;
                    }
                    catch (e) {
                        console.error(e);
                        return null;
                    }
                }
                getSceneDataTable() {
                    return this._sceneDataTable;
                }
                getSerializer(data) {
                    return new json.Serializer(data, this._sceneDataTable);
                }
                createScene(data) {
                    this._scene.setSceneType(data.sceneType);
                    // removes this condition, it is used temporal for compatibility
                    if (data.id) {
                        this._scene.setId(data.id);
                    }
                    for (const objData of data.displayList) {
                        this.createObject(objData);
                    }
                }
                async updateSceneLoader(sceneData) {
                    phasereditor2d.pack.core.parsers.ImageFrameParser.initSourceImageMap(this._scene.game);
                    const finder = new phasereditor2d.pack.core.PackFinder();
                    await finder.preload();
                    for (const objData of sceneData.displayList) {
                        const ser = this.getSerializer(objData);
                        const type = ser.getType();
                        const ext = scene_3.ScenePlugin.getInstance().getObjectExtensionByObjectType(type);
                        if (ext) {
                            const assets = await ext.getAssetsFromObjectData({
                                serializer: ser,
                                finder: finder,
                                scene: this._scene
                            });
                            for (const asset of assets) {
                                const updater = scene_3.ScenePlugin.getInstance().getLoaderUpdaterForAsset(asset);
                                if (updater) {
                                    await updater.updateLoader(this._scene, asset);
                                }
                            }
                        }
                    }
                }
                createObject(data) {
                    const ser = this.getSerializer(data);
                    const type = ser.getType();
                    const ext = scene_3.ScenePlugin.getInstance().getObjectExtensionByObjectType(type);
                    if (ext) {
                        const sprite = ext.createSceneObjectWithData({
                            data: data,
                            scene: this._scene
                        });
                        if (sprite) {
                            sprite.getEditorSupport().readJSON(this.getSerializer(data));
                        }
                        return sprite;
                    }
                    else {
                        console.error(`SceneMaker: no extension is registered for type "${type}".`);
                    }
                    return null;
                }
            }
            ui.SceneMaker = SceneMaker;
        })(ui = scene_3.ui || (scene_3.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_4) {
        var ui;
        (function (ui) {
            var controls = colibri.ui.controls;
            var ide = colibri.ui.ide;
            class ThumbnailScene extends ui.GameScene {
                constructor(data, callback) {
                    super(false);
                    this._data = data;
                    this._callback = callback;
                }
                async create() {
                    const maker = this.getMaker();
                    await maker.preload();
                    await maker.updateSceneLoader(this._data);
                    maker.createScene(this._data);
                    const bounds = this.computeSceneBounds();
                    this.sys.renderer.snapshotArea(bounds.x, bounds.y, bounds.width, bounds.height, (img) => {
                        this._callback(img);
                    });
                }
                computeSceneBounds() {
                    const children = this.getDisplayListChildren();
                    if (children.length === 0) {
                        return { x: 0, y: 0, width: 10, height: 10 };
                    }
                    const camera = this.getCamera();
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
                        const scene = new ThumbnailScene(data, image => {
                            resolve(image);
                            parent.remove();
                        });
                        const game = new Phaser.Game({
                            type: Phaser.WEBGL,
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
                            },
                            scene: scene,
                        });
                    });
                }
            }
            ui.SceneThumbnail = SceneThumbnail;
        })(ui = scene_4.ui || (scene_4.ui = {}));
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
                var ide = colibri.ui.ide;
                const SCENE_EDITOR_BLOCKS_PACK_ITEM_TYPES = new Set(["image", "atlas", "atlasXML", "multiatlas", "unityAtlas", "spritesheet"]);
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
                        return ide.FileUtils.getAllFiles()
                            .filter(file => colibri.Platform.getWorkbench()
                            .getContentTypeRegistry()
                            .getCachedContentType(file) === scene.core.CONTENT_TYPE_SCENE)
                            .filter(file => file !== this._editor.getInput());
                    }
                    getChildren(parent) {
                        if (typeof (parent) === "string") {
                            switch (parent) {
                                case phasereditor2d.pack.core.ATLAS_TYPE:
                                    return this.getPackItems()
                                        .filter(item => item instanceof phasereditor2d.pack.core.BaseAtlasAssetPackItem);
                                case blocks.PREFAB_SECTION:
                                    // TODO: we need to implement the PrefabFinder
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
                            return obj.getName();
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
                        const finder = new phasereditor2d.pack.core.PackFinder();
                        await finder.preload();
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
                blocks.PREFAB_SECTION = "Prefab";
                class SceneEditorBlocksTreeRendererProvider extends phasereditor2d.pack.ui.viewers.AssetPackTreeViewerRenderer {
                    constructor(viewer) {
                        super(viewer, false);
                        this.setSections([
                            blocks.PREFAB_SECTION,
                            phasereditor2d.pack.core.IMAGE_TYPE,
                            phasereditor2d.pack.core.ATLAS_TYPE,
                            phasereditor2d.pack.core.SPRITESHEET_TYPE
                        ]);
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
            var dialogs;
            (function (dialogs) {
                class NewSceneFileDialogExtension extends phasereditor2d.files.ui.dialogs.NewFileContentExtension {
                    constructor() {
                        super({
                            dialogName: "Scene File",
                            dialogIcon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_GROUP),
                            fileExtension: "scene",
                            initialFileName: "Scene",
                            fileContent: JSON.stringify({
                                sceneType: "Scene",
                                displayList: [],
                                meta: {
                                    app: "Phaser Editor 2D - Scene Editor",
                                    url: "https://phasereditor2d.com",
                                    contentType: scene.core.CONTENT_TYPE_SCENE
                                }
                            })
                        });
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
            var editor;
            (function (editor_1) {
                class ActionManager {
                    constructor(editor) {
                        this._editor = editor;
                    }
                    deleteObjects() {
                        const objects = this._editor.getSelectedGameObjects();
                        // create the undo-operation before destroy the objects
                        this._editor.getUndoManager().add(new editor_1.undo.RemoveObjectsOperation(this._editor, objects));
                        for (const obj of objects) {
                            obj.destroy();
                        }
                        this._editor.refreshOutline();
                        this._editor.getSelectionManager().refreshSelection();
                        this._editor.setDirty(true);
                        this._editor.repaint();
                    }
                    joinObjectsInContainer() {
                        const sel = this._editor.getSelectedGameObjects();
                        for (const obj of sel) {
                            if (obj instanceof Phaser.GameObjects.Container || obj.parentContainer) {
                                alert("Nested containers are not supported");
                                return;
                            }
                        }
                        const container = ui.sceneobjects.ContainerExtension.getInstance()
                            .createContainerObjectWithChildren(this._editor.getGameScene(), sel);
                        this._editor.getUndoManager().add(new editor_1.undo.JoinObjectsInContainerOperation(this._editor, container));
                        this._editor.setSelection([container]);
                        this._editor.refreshOutline();
                        this._editor.setDirty(true);
                        this._editor.repaint();
                    }
                }
                editor_1.ActionManager = ActionManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_5) {
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
                    }
                    getCamera() {
                        return this._editor.getGameScene().getCamera();
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
                        this._editor.repaint();
                        e.preventDefault();
                    }
                    onMouseUp(e) {
                        this._dragStartPoint = null;
                        this._dragStartCameraScroll = null;
                    }
                    onWheel(e) {
                        const scene = this._editor.getGameScene();
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
                        this._editor.repaint();
                    }
                }
                editor_2.CameraManager = CameraManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_5.ui || (scene_5.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_6) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_3) {
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
                        if (this.acceptsDropDataArray(dataArray)) {
                            e.preventDefault();
                            const sprites = await this.createWithDropEvent(e, dataArray);
                            this._editor.getUndoManager().add(new editor_3.undo.AddObjectsOperation(this._editor, sprites));
                            this._editor.setSelection(sprites);
                            this._editor.refreshOutline();
                            this._editor.setDirty(true);
                            this._editor.repaint();
                            ide.Workbench.getWorkbench().setActivePart(this._editor);
                        }
                    }
                    async createWithDropEvent(e, dropAssetArray) {
                        const scene = this._editor.getGameScene();
                        const sceneMaker = scene.getMaker();
                        const exts = scene_6.ScenePlugin.getInstance().getObjectExtensions();
                        const nameMaker = new ide.utils.NameMaker(obj => {
                            return obj.getEditorSupport().getLabel();
                        });
                        scene.visit(obj => nameMaker.update([obj]));
                        const worldPoint = scene.getCamera().getWorldPoint(e.offsetX, e.offsetY);
                        const x = Math.floor(worldPoint.x);
                        const y = Math.floor(worldPoint.y);
                        for (const data of dropAssetArray) {
                            const ext = scene_6.ScenePlugin.getInstance().getLoaderUpdaterForAsset(data);
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
                                        nameMaker: nameMaker,
                                        scene: scene
                                    });
                                    sprites.push(sprite);
                                }
                            }
                        }
                        return sprites;
                    }
                    onDragOver(e) {
                        if (this.acceptsDropDataArray(controls.Controls.getApplicationDragData())) {
                            e.preventDefault();
                        }
                    }
                    acceptsDropData(data) {
                        if (data instanceof io.FilePath) {
                            if (this._editor.getSceneMaker().isPrefabFile(data)) {
                                return true;
                            }
                        }
                        for (const ext of scene_6.ScenePlugin.getInstance().getObjectExtensions()) {
                            if (ext.acceptsDropData(data)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    acceptsDropDataArray(dataArray) {
                        if (!dataArray) {
                            return false;
                        }
                        for (const item of dataArray) {
                            if (!this.acceptsDropData(item)) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                editor_3.DropManager = DropManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_6.ui || (scene_6.ui = {}));
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
                    }
                    renderSelection() {
                        const ctx = this._ctx;
                        ctx.save();
                        const camera = this._editor.getGameScene().getCamera();
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
                        const camera = this._editor.getGameScene().getCamera();
                        // parameters from settings
                        const snapEnabled = false;
                        const snapX = 10;
                        const snapY = 10;
                        const borderX = 0;
                        const borderY = 0;
                        const borderWidth = 800;
                        const borderHeight = 600;
                        const ctx = this._ctx;
                        const canvasWidth = this._canvas.width;
                        const canvasHeight = this._canvas.height;
                        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                        // render grid
                        ctx.strokeStyle = "#aeaeae";
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
                            ctx.strokeStyle = "#404040";
                            ctx.strokeRect(a.x + 2, a.y + 2, b.x - a.x, b.y - a.y);
                            ctx.restore();
                            ctx.lineWidth = 1;
                            ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
                            ctx.restore();
                        }
                    }
                }
                editor_4.OverlayLayer = OverlayLayer;
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
                        this._propertyProvider = new editor.properties.SceneEditorSectionProvider();
                    }
                    static getFactory() {
                        return new SceneEditorFactory();
                    }
                    async doSave() {
                        const writer = new json.SceneWriter(this.getGameScene());
                        const data = writer.toJSON();
                        const content = JSON.stringify(data, null, 4);
                        try {
                            await colibri.ui.ide.FileUtils.setFileString_async(this.getInput(), content);
                            this.setDirty(false);
                            this.updateTitleIcon();
                        }
                        catch (e) {
                            console.error(e);
                        }
                        // compile
                        {
                            const builder = new scene.core.code.SceneCodeDOMBuilder(this._gameScene, this.getInput());
                            const unit = builder.build();
                            const generator = this._gameScene.getSettings().compilerLang === "JavaScript" ?
                                new scene.core.code.JavaScriptUnitCodeGenerator(unit)
                                : new scene.core.code.TypeScriptUnitCodeGenerator(unit);
                            const str = generator.generate("");
                            console.log(str);
                        }
                        const win = colibri.Platform.getWorkbench().getActiveWindow();
                        win.saveWindowState();
                    }
                    saveState(state) {
                        if (!this._gameScene) {
                            return;
                        }
                        const camera = this._gameScene.cameras.main;
                        state.cameraZoom = camera.zoom;
                        state.cameraScrollX = camera.scrollX;
                        state.cameraScrollY = camera.scrollY;
                    }
                    restoreState(state) {
                        this._gameScene.setInitialState(state);
                    }
                    onEditorInputContentChanged() {
                        // TODO: missing to implement
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
                        this._gameCanvas = document.createElement("canvas");
                        this._gameCanvas.style.position = "absolute";
                        this.getElement().appendChild(container);
                        container.appendChild(this._gameCanvas);
                        this._overlayLayer = new editor.OverlayLayer(this);
                        container.appendChild(this._overlayLayer.getCanvas());
                        // create game scene
                        this._gameScene = new ui.GameScene();
                        this._game = new Phaser.Game({
                            type: Phaser.WEBGL,
                            canvas: this._gameCanvas,
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
                            scene: this._gameScene,
                        });
                        this._sceneRead = false;
                        this._gameBooted = false;
                        this._game.config.postBoot = () => {
                            // the scene is created just at this moment!
                            this.onGameBoot();
                        };
                        // init managers and factories
                        this._dropManager = new editor.DropManager(this);
                        this._cameraManager = new editor.CameraManager(this);
                        this._selectionManager = new editor.SelectionManager(this);
                        this._actionManager = new editor.ActionManager(this);
                    }
                    async updateTitleIcon() {
                        const file = this.getInput();
                        await ui.SceneThumbnailCache.getInstance().preload(file);
                        const img = this.getIcon();
                        if (img) {
                            img.preload().then(w => this.dispatchTitleUpdatedEvent());
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
                    createEditorToolbar(parent) {
                        const manager = new controls.ToolbarManager(parent);
                        manager.add(new controls.Action({
                            icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_TRANSLATE),
                        }));
                        manager.add(new controls.Action({
                            icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_SCALE),
                        }));
                        manager.add(new controls.Action({
                            icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_ANGLE),
                        }));
                        manager.add(new controls.Action({
                            icon: scene.ScenePlugin.getInstance().getIcon(scene.ICON_ORIGIN),
                        }));
                        manager.add(new controls.Action({
                            icon: colibri.Platform.getWorkbench().getWorkbenchIcon(colibri.ui.ide.ICON_PLUS),
                        }));
                        return manager;
                    }
                    async readScene() {
                        const maker = this._gameScene.getMaker();
                        this._sceneRead = true;
                        try {
                            const file = this.getInput();
                            await colibri.ui.ide.FileUtils.preloadFileString(file);
                            const content = colibri.ui.ide.FileUtils.getFileString(file);
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
                            .filter(obj => obj instanceof Phaser.GameObjects.GameObject)
                            .map(obj => obj);
                    }
                    getActionManager() {
                        return this._actionManager;
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
                    getGameScene() {
                        return this._gameScene;
                    }
                    getGame() {
                        return this._game;
                    }
                    getSceneMaker() {
                        return this._gameScene.getMaker();
                    }
                    layout() {
                        super.layout();
                        this._overlayLayer.resizeTo();
                        const parent = this._gameCanvas.parentElement;
                        const w = parent.clientWidth;
                        const h = parent.clientHeight;
                        this._game.scale.resize(w, h);
                        if (this._gameBooted) {
                            this._gameScene.getCamera().setSize(w, h);
                            this.repaint();
                        }
                    }
                    getPropertyProvider() {
                        return this._propertyProvider;
                    }
                    async onPartActivated() {
                        super.onPartActivated();
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
                        }
                        this.layout();
                        this.refreshOutline();
                        // for some reason, we should do this after a time, or the game is not stopped well.
                        setTimeout(() => this._game.loop.stop(), 500);
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
    (function (scene_7) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_5) {
                var controls = colibri.ui.controls;
                class SelectionManager {
                    constructor(editor) {
                        this._editor = editor;
                        const canvas = this._editor.getOverlayLayer().getCanvas();
                        canvas.addEventListener("click", e => this.onMouseClick(e));
                        this._editor.addEventListener(controls.EVENT_SELECTION_CHANGED, e => this.updateOutlineSelection());
                    }
                    clearSelection() {
                        this._editor.setSelection([]);
                        this._editor.repaint();
                    }
                    refreshSelection() {
                        this._editor.setSelection(this._editor.getSelection().filter(obj => {
                            if (obj instanceof Phaser.GameObjects.GameObject) {
                                return this._editor.getGameScene().sys.displayList.exists(obj);
                            }
                            return true;
                        }));
                    }
                    selectAll() {
                        const sel = this._editor.getGameScene().getDisplayListChildren();
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
                        if (result) {
                            const current = this._editor.getSelection();
                            let selected = result.pop();
                            if (selected) {
                                const obj = selected;
                                const owner = obj.getEditorSupport().getOwnerPrefabInstance();
                                selected = (owner !== null && owner !== void 0 ? owner : selected);
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
                            else {
                                next = [selected];
                            }
                        }
                        this._editor.setSelection(next);
                        this._editor.repaint();
                    }
                    hitTestOfActivePointer() {
                        const scene = this._editor.getGameScene();
                        const input = scene.input;
                        // const real = input["real_hitTest"];
                        // const fake = input["hitTest"];
                        // input["hitTest"] = real;
                        const result = input.hitTestPointer(scene.input.activePointer);
                        // input["hitTest"] = fake;
                        return result;
                    }
                }
                editor_5.SelectionManager = SelectionManager;
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_7.ui || (scene_7.ui = {}));
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
                var commands;
                (function (commands) {
                    const CMD_JOIN_IN_CONTAINER = "joinObjectsInContainer";
                    function isSceneScope(args) {
                        return args.activePart instanceof editor_6.SceneEditor ||
                            args.activePart instanceof phasereditor2d.outline.ui.views.OutlineView
                                && args.activeEditor instanceof editor_6.SceneEditor;
                    }
                    class SceneEditorCommands {
                        static registerCommands(manager) {
                            // select all
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_SELECT_ALL, args => args.activePart instanceof editor_6.SceneEditor, args => {
                                const editor = args.activeEditor;
                                editor.getSelectionManager().selectAll();
                            });
                            // clear selection
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_ESCAPE, isSceneScope, args => {
                                const editor = args.activeEditor;
                                editor.getSelectionManager().clearSelection();
                            });
                            // delete
                            manager.addHandlerHelper(colibri.ui.ide.actions.CMD_DELETE, isSceneScope, args => {
                                const editor = args.activeEditor;
                                editor.getActionManager().deleteObjects();
                            });
                            // join in container
                            manager.addCommandHelper({
                                id: CMD_JOIN_IN_CONTAINER,
                                name: "Join Objects",
                                tooltip: "Create a container with the selected objects"
                            });
                            manager.addHandlerHelper(CMD_JOIN_IN_CONTAINER, args => isSceneScope(args), args => {
                                const editor = args.activeEditor;
                                editor.getActionManager().joinObjectsInContainer();
                            });
                            manager.addKeyBinding(CMD_JOIN_IN_CONTAINER, new colibri.ui.ide.commands.KeyMatcher({
                                key: "j"
                            }));
                        }
                    }
                    commands.SceneEditorCommands = SceneEditorCommands;
                })(commands = editor_6.commands || (editor_6.commands = {}));
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
                var outline;
                (function (outline) {
                    class SceneEditorOutlineContentProvider {
                        getRoots(input) {
                            const editor = input;
                            const displayList = editor.getGameScene().sys.displayList;
                            if (displayList) {
                                return [displayList];
                            }
                            return [];
                        }
                        getChildren(parent) {
                            if (parent instanceof Phaser.GameObjects.DisplayList) {
                                return parent.getChildren();
                            }
                            else if (parent instanceof Phaser.GameObjects.Container) {
                                if (parent.getEditorSupport().isPrefabInstance()) {
                                    return [];
                                }
                                return parent.list;
                            }
                            return [];
                        }
                    }
                    outline.SceneEditorOutlineContentProvider = SceneEditorOutlineContentProvider;
                })(outline = editor_7.outline || (editor_7.outline = {}));
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
                            if (obj instanceof Phaser.GameObjects.DisplayList) {
                                return "Display List";
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
            (function (editor_8) {
                var outline;
                (function (outline) {
                    var ide = colibri.ui.ide;
                    class SceneEditorOutlineProvider extends ide.EditorViewerProvider {
                        constructor(editor) {
                            super();
                            this._editor = editor;
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
                            return new outline.SceneEditorOutlineRendererProvider(this._editor);
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
                })(outline = editor_8.outline || (editor_8.outline = {}));
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
            (function (editor_9) {
                var outline;
                (function (outline) {
                    var controls = colibri.ui.controls;
                    var ide = colibri.ui.ide;
                    class SceneEditorOutlineRendererProvider {
                        constructor(editor) {
                            this._editor = editor;
                            this._assetRendererProvider = new phasereditor2d.pack.ui.viewers.AssetPackCellRendererProvider("tree");
                        }
                        getCellRenderer(element) {
                            if (element instanceof Phaser.GameObjects.GameObject) {
                                const obj = element;
                                return obj.getEditorSupport().getCellRenderer();
                            }
                            else if (element instanceof Phaser.GameObjects.DisplayList) {
                                return new controls.viewers.IconImageCellRenderer(controls.Controls.getIcon(ide.ICON_FOLDER));
                            }
                            return new controls.viewers.EmptyCellRenderer(false);
                        }
                        async preload(args) {
                            return controls.Controls.resolveNothingLoaded();
                        }
                    }
                    outline.SceneEditorOutlineRendererProvider = SceneEditorOutlineRendererProvider;
                })(outline = editor_9.outline || (editor_9.outline = {}));
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
                    const COLORS = {
                        light: {
                            selected: "#ffaaaa",
                            normal: "#ff2222"
                        },
                        dark: {
                            selected: "#550055",
                            normal: "#ffaaff"
                        }
                    };
                    class SceneEditorOutlineViewerRenderer extends controls.viewers.TreeViewerRenderer {
                        constructor(viewer) {
                            super(viewer, 48);
                        }
                        setTextColor(args) {
                            if (args.obj instanceof Phaser.GameObjects.GameObject) {
                                const obj = args.obj;
                                if (obj.getEditorSupport().isPrefabInstance()) {
                                    const colors = controls.Controls.getTheme().dark ? COLORS.dark : COLORS.light;
                                    const color = args.viewer.isSelected(args.obj) ? colors.selected : colors.normal;
                                    args.canvasContext.fillStyle = color;
                                    return;
                                }
                            }
                            super.setTextColor(args);
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
                    var controls = colibri.ui.controls;
                    class SceneEditorSectionProvider extends controls.properties.PropertySectionProvider {
                        addSections(page, sections) {
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
                    class SceneSection extends colibri.ui.controls.properties.PropertySection {
                    }
                    properties.SceneSection = SceneSection;
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
            (function (editor_10) {
                var undo;
                (function (undo) {
                    var ide = colibri.ui.ide;
                    class SceneEditorOperation extends ide.undo.Operation {
                        constructor(editor) {
                            super();
                            this._editor = editor;
                        }
                    }
                    undo.SceneEditorOperation = SceneEditorOperation;
                })(undo = editor_10.undo || (editor_10.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene.ui || (scene.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./SceneEditorOperation.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_8) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_11) {
                var undo;
                (function (undo) {
                    class AddObjectsOperation extends undo.SceneEditorOperation {
                        constructor(editor, objects) {
                            super(editor);
                            this._dataList = objects.map(obj => {
                                const data = {};
                                obj.getEditorSupport().writeJSON(editor.getSceneMaker().getSerializer(data));
                                return data;
                            });
                        }
                        undo() {
                            const scene = this._editor.getGameScene();
                            for (const data of this._dataList) {
                                const obj = scene.getByEditorId(data.id);
                                if (obj) {
                                    obj.destroy();
                                }
                            }
                            this._editor.getSelectionManager().refreshSelection();
                            this.updateEditor();
                        }
                        redo() {
                            const maker = this._editor.getSceneMaker();
                            for (const data of this._dataList) {
                                maker.createObject(data);
                            }
                            this.updateEditor();
                        }
                        updateEditor() {
                            this._editor.setDirty(true);
                            this._editor.repaint();
                            this._editor.refreshOutline();
                        }
                    }
                    undo.AddObjectsOperation = AddObjectsOperation;
                })(undo = editor_11.undo || (editor_11.undo = {}));
            })(editor = ui.editor || (ui.editor = {}));
        })(ui = scene_8.ui || (scene_8.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_9) {
        var ui;
        (function (ui) {
            var editor;
            (function (editor_12) {
                var undo;
                (function (undo) {
                    class JoinObjectsInContainerOperation extends undo.SceneEditorOperation {
                        constructor(editor, container) {
                            super(editor);
                            this._containerId = container.getEditorSupport().getId();
                            this._objectsIdList = container.list.map(obj => obj.getEditorSupport().getId());
                        }
                        undo() {
                            const scene = this._editor.getGameScene();
                            const displayList = this._editor.getGameScene().sys.displayList;
                            const container = scene.getByEditorId(this._containerId);
                            for (const id of this._objectsIdList) {
                                const obj = ui.GameScene.findByEditorId(container.list, id);
                                if (obj) {
                                    container.remove(obj);
                                    displayList.add(obj);
                                }
                                else {
                                    console.error(`Undo: child with id=${id} not found in container ${this._containerId}`);
                                }
                            }
                            container.destroy();
                            this.updateEditor();
                        }
                        redo() {
                            const scene = this._editor.getGameScene();
                            const objects = this._objectsIdList.map(id => scene.getByEditorId(id));
                            const container = ui.sceneobjects.ContainerExtension.getInstance()
                                .createContainerObjectWithChildren(scene, objects);
                            container.getEditorSupport().setId(this._containerId);
                            this.updateEditor();
                        }
                        updateEditor() {
                            this._editor.setDirty(true);
                            this._editor.refreshOutline();
                            this._editor.repaint();
                        }
                    }
                    undo.JoinObjectsInContainerOperation = JoinObjectsInContainerOperation;
                })(undo = editor_12.undo || (editor_12.undo = {}));
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
            (function (editor_13) {
                var undo;
                (function (undo) {
                    class RemoveObjectsOperation extends undo.AddObjectsOperation {
                        constructor(editor, objects) {
                            super(editor, objects);
                        }
                        undo() {
                            super.redo();
                        }
                        redo() {
                            super.undo();
                        }
                    }
                    undo.RemoveObjectsOperation = RemoveObjectsOperation;
                })(undo = editor_13.undo || (editor_13.undo = {}));
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
            var sceneobjects;
            (function (sceneobjects) {
                class EditorSupport {
                    constructor(extension, obj) {
                        this._extension = extension;
                        this._object = obj;
                        this._serializables = [];
                        this._components = new Map();
                        this._object.setDataEnabled();
                        this.setId(Phaser.Utils.String.UUID());
                    }
                    // tslint:disable-next-line:ban-types
                    getComponent(ctr) {
                        return this._components.get(ctr);
                    }
                    // tslint:disable-next-line:ban-types
                    hasComponent(ctr) {
                        return this._components.has(ctr);
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
                    addComponent(...components) {
                        for (const c of components) {
                            this._components.set(c.constructor, c);
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
                    getLabel() {
                        return this._label;
                    }
                    setLabel(label) {
                        this._label = label;
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
                        if (this._prefabId) {
                            const file = this._scene.getMaker().getSceneDataTable().getPrefabFile(this._prefabId);
                            if (file) {
                                return file.getNameWithoutExtension();
                            }
                        }
                        return null;
                    }
                    getObjectType() {
                        const ser = this._scene.getMaker().getSerializer({
                            id: this.getId(),
                            type: this._extension.getTypeName(),
                            prefabId: this._prefabId
                        });
                        return ser.getType();
                    }
                    writeJSON(ser) {
                        if (this._prefabId) {
                            ser.getData().prefabId = this._prefabId;
                        }
                        else {
                            ser.write("type", this._extension.getTypeName());
                        }
                        ser.write("id", this.getId());
                        ser.write("label", this._label);
                        for (const s of this._serializables) {
                            s.writeJSON(ser);
                        }
                    }
                    readJSON(ser) {
                        this.setId(ser.read("id"));
                        this._prefabId = ser.getData().prefabId;
                        this._label = ser.read("label");
                        for (const s of this._serializables) {
                            s.readJSON(ser);
                        }
                    }
                }
                sceneobjects.EditorSupport = EditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_10.ui || (scene_10.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_11) {
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
        })(ui = scene_11.ui || (scene_11.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
/// <reference path="./LoaderUpdaterExtension.ts" />
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_12) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class ImageLoaderUpdater extends sceneobjects.LoaderUpdaterExtension {
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
                            imageFrameContainerPackItem.addToPhaserCache(scene.game);
                        }
                    }
                }
                sceneobjects.ImageLoaderUpdater = ImageLoaderUpdater;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_12.ui || (scene_12.ui = {}));
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
    (function (scene_13) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class Container extends Phaser.GameObjects.Container {
                    constructor(scene, x, y, children) {
                        super(scene, x, y, children);
                        this._editorSupport = new sceneobjects.ContainerEditorSupport(this);
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
        })(ui = scene_13.ui || (scene_13.ui = {}));
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
                class ContainerEditorSupport extends sceneobjects.EditorSupport {
                    constructor(obj) {
                        super(sceneobjects.ContainerExtension.getInstance(), obj);
                        this.addComponent(new sceneobjects.TransformComponent(obj));
                    }
                    getCellRenderer() {
                        if (this.isPrefabInstance()) {
                            const table = this.getScene().getMaker().getSceneDataTable();
                            const file = table.getPrefabFile(this.getPrefabId());
                            if (file) {
                                const image = ui.SceneThumbnailCache.getInstance().getContent(file);
                                if (image) {
                                    return new controls.viewers.ImageCellRenderer(image);
                                }
                            }
                        }
                        return new controls.viewers.IconImageCellRenderer(scene.ScenePlugin.getInstance().getIcon(scene.ICON_GROUP));
                    }
                    writeJSON(ser) {
                        super.writeJSON(ser);
                        if (!this.isPrefabInstance()) {
                            const data = ser.getData();
                            data.list = this.getObject().list.map(obj => {
                                const objData = {};
                                obj.getEditorSupport().writeJSON(ser.getSerializer(objData));
                                return objData;
                            });
                        }
                    }
                    readJSON(ser) {
                        super.readJSON(ser);
                        const list = ser.read("list", []);
                        const maker = this.getScene().getMaker();
                        const container = this.getObject();
                        // TODO: why? this should be executed once
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
                        for (const obj of container.list) {
                            const bounds = obj.getEditorSupport().getScreenBounds(camera);
                            for (const point of bounds) {
                                minPoint.x = Math.min(minPoint.x, point.x);
                                minPoint.y = Math.min(minPoint.y, point.y);
                                maxPoint.x = Math.max(maxPoint.x, point.x);
                                maxPoint.y = Math.max(maxPoint.y, point.y);
                            }
                        }
                        return [
                            new Phaser.Math.Vector2(minPoint.x, minPoint.y),
                            new Phaser.Math.Vector2(maxPoint.x, minPoint.y),
                            new Phaser.Math.Vector2(maxPoint.x, maxPoint.y),
                            new Phaser.Math.Vector2(minPoint.x, maxPoint.y)
                        ];
                    }
                }
                sceneobjects.ContainerEditorSupport = ContainerEditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
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
                    async getAssetsFromObjectData(args) {
                        const list = [];
                        const children = args.serializer.read("list", []);
                        for (const objData of children) {
                            const ser = args.serializer.getSerializer(objData);
                            const type = ser.getType();
                            const ext = scene_14.ScenePlugin.getInstance().getObjectExtensionByObjectType(type);
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
                    createSceneObjectWithData(args) {
                        const container = this.createContainerObject(args.scene, 0, 0, []);
                        container.getEditorSupport().readJSON(args.scene.getMaker().getSerializer(args.data));
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
        })(ui = scene_14.ui || (scene_14.ui = {}));
    })(scene = phasereditor2d.scene || (phasereditor2d.scene = {}));
})(phasereditor2d || (phasereditor2d = {}));
var phasereditor2d;
(function (phasereditor2d) {
    var scene;
    (function (scene_15) {
        var ui;
        (function (ui) {
            var sceneobjects;
            (function (sceneobjects) {
                class Image extends Phaser.GameObjects.Image {
                    constructor(scene, x, y, texture, frame) {
                        super(scene, x, y, texture, frame);
                        this._editorSupport = new sceneobjects.ImageEditorSupport(this);
                    }
                    getEditorSupport() {
                        return this._editorSupport;
                    }
                }
                sceneobjects.Image = Image;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene_15.ui || (scene_15.ui = {}));
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
                class ImageEditorSupport extends sceneobjects.EditorSupport {
                    constructor(obj) {
                        super(sceneobjects.ImageExtension.getInstance(), obj);
                        this.addComponent(new sceneobjects.TextureComponent(obj), new sceneobjects.TransformComponent(obj), new sceneobjects.OriginComponent(obj));
                    }
                    getCellRenderer() {
                        return new sceneobjects.TextureCellRenderer();
                    }
                    getTextureComponent() {
                        return this.getComponent(sceneobjects.TextureComponent);
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
                        let flipX = sprite.flipX ? -1 : 1;
                        let flipY = sprite.flipY ? -1 : 1;
                        if (sprite instanceof Phaser.GameObjects.TileSprite) {
                            flipX = 1;
                            flipY = 1;
                        }
                        const ox = sprite.originX;
                        const oy = sprite.originY;
                        const x = -w * ox * flipX;
                        const y = -h * oy * flipY;
                        const tx = sprite.getWorldTransformMatrix();
                        tx.transformPoint(x, y, points[0]);
                        tx.transformPoint(x + w * flipX, y, points[1]);
                        tx.transformPoint(x + w * flipX, y + h * flipY, points[2]);
                        tx.transformPoint(x, y + h * flipY, points[3]);
                        return points.map(p => camera.getScreenPoint(p.x, p.y));
                    }
                }
                sceneobjects.ImageEditorSupport = ImageEditorSupport;
            })(sceneobjects = ui.sceneobjects || (ui.sceneobjects = {}));
        })(ui = scene.ui || (scene.ui = {}));
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
                class ImageExtension extends sceneobjects.SceneObjectExtension {
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
                    async getAssetsFromObjectData(args) {
                        const key = args.serializer.read("textureKey");
                        // const key = (args.data as sceneobjects.TextureData).textureKey;
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
                        return ImageExtension.isImageOrImageFrameAsset(data);
                    }
                    createSceneObjectWithAsset(args) {
                        let key;
                        let frame;
                        let baseLabel;
                        if (args.asset instanceof phasereditor2d.pack.core.AssetPackImageFrame) {
                            key = args.asset.getPackItem().getKey();
                            frame = args.asset.getName();
                            baseLabel = frame + "";
                        }
                        else if (args.asset instanceof phasereditor2d.pack.core.ImageAssetPackItem) {
                            key = args.asset.getKey();
                            frame = null;
                            baseLabel = key;
                        }
                        const sprite = this.createImageObject(args.scene, args.x, args.y, key, frame);
                        const support = sprite.getEditorSupport();
                        support.setLabel(args.nameMaker.makeName(baseLabel));
                        support.getTextureComponent().setTexture(key, frame);
                        return sprite;
                    }
                    createSceneObjectWithData(args) {
                        const sprite = this.createImageObject(args.scene, 0, 0, undefined);
                        sprite.getEditorSupport().readJSON(args.scene.getMaker().getSerializer(args.data));
                        return sprite;
                    }
                    createImageObject(scene, x, y, key, frame) {
                        const sprite = new sceneobjects.Image(scene, x, y, key, frame);
                        sprite.getEditorSupport().setScene(scene);
                        scene.sys.displayList.add(sprite);
                        return sprite;
                    }
                }
                sceneobjects.ImageExtension = ImageExtension;
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
                class OriginComponent {
                    constructor(obj) {
                        this._obj = obj;
                    }
                    readJSON(ser) {
                        this._obj.originX = ser.read("originX", 0.5);
                        this._obj.originY = ser.read("originY", 0.5);
                    }
                    writeJSON(ser) {
                        ser.write("originX", this._obj.originX, 0.5);
                        ser.write("originY", this._obj.originY, 0.5);
                    }
                }
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
                class OriginSection extends ui.editor.properties.SceneSection {
                    constructor(page) {
                        super(page, "SceneEditor.OriginSection", "Origin", false);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 5);
                        // Position
                        {
                            this.createLabel(comp, "Origin");
                            // X
                            {
                                this.createLabel(comp, "X");
                                const text = this.createText(comp);
                                this.addUpdater(() => {
                                    text.value = this.flatValues_Number(this.getSelection().map(obj => obj.originX));
                                });
                            }
                            // y
                            {
                                this.createLabel(comp, "Y");
                                const text = this.createText(comp);
                                this.addUpdater(() => {
                                    text.value = this.flatValues_Number(this.getSelection().map(obj => obj.originY));
                                });
                            }
                        }
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
                class TransformComponent {
                    constructor(obj) {
                        this._obj = obj;
                    }
                    getObject() {
                        return this._obj;
                    }
                    readJSON(ser) {
                        this._obj.x = ser.read("x", 0);
                        this._obj.y = ser.read("y", 0);
                        this._obj.scaleX = ser.read("scaleX", 1);
                        this._obj.scaleY = ser.read("scaleY", 1);
                        this._obj.angle = ser.read("angle", 0);
                    }
                    writeJSON(ser) {
                        ser.write("x", this._obj.x, 0);
                        ser.write("y", this._obj.y, 0);
                        ser.write("scaleX", this._obj.scaleX, 1);
                        ser.write("scaleY", this._obj.scaleY, 1);
                        ser.write("angle", this._obj.angle, 0);
                    }
                }
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
                class TransformSection extends ui.editor.properties.SceneSection {
                    constructor(page) {
                        super(page, "SceneEditor.TransformSection", "Transform", false);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 5);
                        // Position
                        {
                            this.createLabel(comp, "Position");
                            // X
                            {
                                this.createLabel(comp, "X");
                                const text = this.createText(comp);
                                this.addUpdater(() => {
                                    text.value = this.flatValues_Number(this.getSelection().map(obj => obj.x));
                                });
                            }
                            // y
                            {
                                this.createLabel(comp, "Y");
                                const text = this.createText(comp);
                                this.addUpdater(() => {
                                    text.value = this.flatValues_Number(this.getSelection().map(obj => obj.y));
                                });
                            }
                        }
                        // Scale
                        {
                            this.createLabel(comp, "Scale");
                            // X
                            {
                                this.createLabel(comp, "X");
                                const text = this.createText(comp);
                                this.addUpdater(() => {
                                    text.value = this.flatValues_Number(this.getSelection().map(obj => obj.scaleX));
                                });
                            }
                            // y
                            {
                                this.createLabel(comp, "Y");
                                const text = this.createText(comp);
                                this.addUpdater(() => {
                                    text.value = this.flatValues_Number(this.getSelection().map(obj => obj.scaleY));
                                });
                            }
                        }
                        // Angle
                        {
                            this.createLabel(comp, "Angle").style.gridColumnStart = "span 2";
                            const text = this.createText(comp);
                            this.addUpdater(() => {
                                text.value = this.flatValues_Number(this.getSelection().map(obj => obj.angle));
                            });
                            this.createLabel(comp, "").style.gridColumnStart = "span 2";
                        }
                    }
                    canEdit(obj, n) {
                        return sceneobjects.EditorSupport.getObjectComponent(obj, sceneobjects.TransformComponent) !== null;
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
                class VariableSection extends ui.editor.properties.SceneSection {
                    constructor(page) {
                        super(page, "SceneEditor.VariableSection", "Variable", false);
                    }
                    createForm(parent) {
                        const comp = this.createGridElement(parent, 2);
                        {
                            // Name
                            this.createLabel(comp, "Name");
                            const text = this.createText(comp);
                            this.addUpdater(() => {
                                text.value = this.flatValues_StringJoin(this.getSelection().map(obj => obj.getEditorSupport().getLabel()));
                            });
                        }
                        {
                            // Type
                            this.createLabel(comp, "Type");
                            const text = this.createText(comp, true);
                            this.addUpdater(() => {
                                text.value = this.flatValues_StringJoin(this.getSelection().map(obj => {
                                    const support = obj.getEditorSupport();
                                    let typename = support.getObjectType();
                                    if (support.isPrefabInstance()) {
                                        typename = `prefab ${support.getPrefabName()} (${typename})`;
                                    }
                                    return typename;
                                }));
                            });
                        }
                    }
                    canEdit(obj, n) {
                        return obj instanceof Phaser.GameObjects.GameObject;
                    }
                    canEditNumber(n) {
                        return n === 1;
                    }
                }
                sceneobjects.VariableSection = VariableSection;
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
                class TextureCellRenderer {
                    renderCell(args) {
                        const sprite = args.obj;
                        const support = sprite.getEditorSupport();
                        const textureComp = support.getComponent(sceneobjects.TextureComponent);
                        if (textureComp) {
                            const { key, frame } = textureComp.getTexture();
                            const image = phasereditor2d.pack.core.parsers.ImageFrameParser
                                .getSourceImageFrame(support.getScene().game, key, frame);
                            if (image) {
                                image.paint(args.canvasContext, args.x, args.y, args.w, args.h, false);
                            }
                        }
                    }
                    cellHeight(args) {
                        return args.viewer.getCellSize();
                    }
                    async preload(args) {
                        const finder = new phasereditor2d.pack.core.PackFinder();
                        return finder.preload();
                    }
                }
                sceneobjects.TextureCellRenderer = TextureCellRenderer;
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
                class TextureComponent {
                    constructor(obj) {
                        this._obj = obj;
                    }
                    writeJSON(ser) {
                        ser.write("textureKey", this._textureKey);
                        ser.write("frameKey", this._textureFrameKey);
                    }
                    readJSON(ser) {
                        const key = ser.read("textureKey");
                        const frame = ser.read("frameKey");
                        this.setTexture(key, frame);
                    }
                    getKey() {
                        return this._textureKey;
                    }
                    setKey(key) {
                        this._textureKey = key;
                    }
                    setTexture(key, frame) {
                        this.setKey(key);
                        this.setFrame(frame);
                        this._obj.setTexture(key, frame);
                        // this should be called each time the texture is changed
                        this._obj.setInteractive();
                    }
                    getTexture() {
                        return {
                            key: this.getKey(),
                            frame: this.getFrame()
                        };
                    }
                    getFrame() {
                        return this._textureFrameKey;
                    }
                    setFrame(frame) {
                        this._textureFrameKey = frame;
                    }
                }
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
                class TextureSection extends ui.editor.properties.SceneSection {
                    constructor(page) {
                        super(page, "SceneEditor.TextureSection", "Texture", true);
                    }
                    createForm(parent) {
                        parent.classList.add("ImagePreviewFormArea", "PreviewBackground");
                        const imgControl = new controls.ImageControl(ide.IMG_SECTION_PADDING);
                        this.getPage().addEventListener(controls.EVENT_CONTROL_LAYOUT, (e) => {
                            imgControl.resizeTo();
                        });
                        parent.appendChild(imgControl.getElement());
                        setTimeout(() => imgControl.resizeTo(), 1);
                        this.addUpdater(() => {
                            const obj = this.getSelection()[0];
                            const { key, frame } = obj.getEditorSupport().getTextureComponent().getTexture();
                            const finder = new phasereditor2d.pack.core.PackFinder();
                            finder.preload().then(() => {
                                const img = finder.getAssetPackItemImage(key, frame);
                                imgControl.setImage(img);
                                setTimeout(() => imgControl.resizeTo(), 1);
                            });
                        });
                    }
                    canEdit(obj, n) {
                        return sceneobjects.EditorSupport.getObjectComponent(obj, sceneobjects.TextureComponent) !== null;
                    }
                    canEditNumber(n) {
                        return n === 1;
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
