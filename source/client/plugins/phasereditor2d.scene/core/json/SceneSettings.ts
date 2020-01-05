namespace phasereditor2d.scene.core.json {

    export declare type SourceLang = "JavaScript" | "TypeScript";

    export declare type MethodContextType = "Scene" | "Object";

    export class SceneSettings {

        constructor(
            public snapEnabled = false,
            public snapWidth = 16,
            public snapHeight = 16,
            public onlyGenerateMethods = false,
            public superClassName = "Phaser.Scene",
            public preloadMethodName = "",
            public createMethodName = "create",
            public sceneKey = "MyScene",
            public compilerLang: SourceLang = "JavaScript",
            public scopeBlocksToFolder: boolean = false,
            public methodContextType: MethodContextType = "Scene",
            public borderX = 0,
            public borderY = 0,
            public borderWidth = 800,
            public borderHeight = 600
        ) {

        }
    }
}