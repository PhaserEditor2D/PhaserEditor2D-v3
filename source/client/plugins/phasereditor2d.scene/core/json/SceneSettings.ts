namespace phasereditor2d.scene.core.json {

    import read = colibri.core.json.read;
    import write = colibri.core.json.write;

    export declare type SourceLang = "JavaScript" | "TypeScript";

    export class SceneSettings {

        constructor(
            public snapEnabled = false,
            public snapWidth = 16,
            public snapHeight = 16,
            public onlyGenerateMethods = false,
            public superClassName = "Phaser.Scene",
            public preloadMethodName = "",
            public createMethodName = "create",
            public sceneKey = "",
            public compilerLang: SourceLang = "JavaScript",
            public scopeBlocksToFolder: boolean = false,
            public borderX = 0,
            public borderY = 0,
            public borderWidth = 800,
            public borderHeight = 600
        ) {

        }

        toJSON() {

            const data = {};

            write(data, "snapEnabled", this.snapEnabled, false);
            write(data, "snapWidth", this.snapWidth, 16);
            write(data, "snapHeight", this.snapHeight, 16);
            write(data, "onlyGenerateMethods", this.onlyGenerateMethods, false);
            write(data, "superClassName", this.superClassName, "Phaser.Scene");
            write(data, "preloadMethodName", this.preloadMethodName, "");
            write(data, "createMethodName", this.createMethodName, "create");
            write(data, "sceneKey", this.sceneKey, "");
            write(data, "compilerLang", this.compilerLang, "JavaScript");
            write(data, "scopeBlocksToFolder", this.scopeBlocksToFolder, false);
            write(data, "borderX", this.borderX, 0);
            write(data, "borderY", this.borderY, 0);
            write(data, "borderWidth", this.borderWidth, 800);
            write(data, "borderHeigh", this.borderHeight, 600);

            return data;
        }

        readJSON(data: object) {

            this.snapEnabled = read(data, "snapEnabled", false);
            this.snapWidth = read(data, "snapWidth", 16);
            this.snapHeight = read(data, "snapHeight", 16);
            this.onlyGenerateMethods = read(data, "onlyGenerateMethods", false);
            this.superClassName = read(data, "superClassName", "Phaser.Scene");
            this.preloadMethodName = read(data, "preloadMethodName", "");
            this.createMethodName = read(data, "createMethodName", "create");
            this.sceneKey = read(data, "sceneKey", "");
            this.compilerLang = read(data, "compilerLang", "JavaScript");
            this.scopeBlocksToFolder = read(data, "scopeBlocksToFolder", false);
            this.borderX = read(data, "borderX", 0);
            this.borderY = read(data, "borderY", 0);
            this.borderWidth = read(data, "borderWidth", 800);
            this.borderHeight = read(data, "borderHeight", 600);
        }
    }
}