namespace phasereditor2d.scene.ui.sceneobjects {

    import code = core.code;

    export abstract class FXObjectCodeDOMBuilder extends GameObjectCodeDOMBuilder {
        
        abstract buildCreateObjectWithFactoryCodeDOM(args: IBuildObjectFactoryCodeDOMArgs): core.code.MethodCallCodeDOM;

        buildCreatePrefabInstanceCodeDOM(args: IBuildPrefabConstructorCodeDOMArgs): void {
            
            throw new Error("FX prefab not supported.");
        }
        
        buildPrefabConstructorDeclarationCodeDOM(args: IBuildPrefabConstructorDeclarationCodeDOM): void {

            throw new Error("FX prefab not supported.");
        }
        
        buildPrefabConstructorDeclarationSupperCallCodeDOM(args: IBuildPrefabConstructorDeclarationSupperCallCodeDOMArgs): void {

            throw new Error("FX prefab not supported.");
        }
    }
}