namespace phasereditor2d.scene.core.json {

    import read = colibri.core.json.read;
    import write = colibri.core.json.write;

    export class SceneSettings {

        constructor(
            public compilerEnabled = true,
            public compilerInsertSpaces = false,
            public compilerTabSize = 4,
            public snapEnabled = false,
            public snapWidth = 16,
            public snapHeight = 16,
            public onlyGenerateMethods = false,
            public superClassName = "",
            public preloadMethodName = "preload",
            public preloadPackFiles: string[] = [],
            public createMethodName = "create",
            public sceneKey = "",
            public exportClass = false,
            public autoImport = false,
            public compilerOutputLanguage = SourceLang.JAVA_SCRIPT,
            public scopeBlocksToFolder: boolean = false,
            public borderX = 0,
            public borderY = 0,
            public borderWidth = 800,
            public borderHeight = 600
        ) {

        }

        toJSON() {

            const data = {};

            write(data, "compilerEnabled", this.compilerEnabled, true);
            write(data, "compilerInsertSpaces", this.compilerInsertSpaces, false);
            write(data, "compilerTabSize", this.compilerTabSize, 4);
            write(data, "snapEnabled", this.snapEnabled, false);
            write(data, "snapWidth", this.snapWidth, 16);
            write(data, "snapHeight", this.snapHeight, 16);
            write(data, "onlyGenerateMethods", this.onlyGenerateMethods, false);
            write(data, "exportClass", this.exportClass, false);
            write(data, "autoImport", this.autoImport, false);
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

        readJSON(data: object) {

            this.compilerEnabled = read(data, "compilerEnabled", true);
            this.compilerInsertSpaces = read(data, "compilerInsertSpaces", false);
            this.compilerTabSize = read(data, "compilerTabSize", 4);
            this.snapEnabled = read(data, "snapEnabled", false);
            this.snapWidth = read(data, "snapWidth", 16);
            this.snapHeight = read(data, "snapHeight", 16);
            this.onlyGenerateMethods = read(data, "onlyGenerateMethods", false);
            this.exportClass = read(data, "exportClass", false);
            this.autoImport = read(data, "autoImport", false);
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
}