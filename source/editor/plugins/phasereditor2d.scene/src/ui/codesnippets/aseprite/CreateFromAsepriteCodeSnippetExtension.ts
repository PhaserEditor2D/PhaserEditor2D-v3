namespace phasereditor2d.scene.ui.codesnippets {

    export class CreateFromAsepriteCodeSnippetExtension extends CodeSnippetExtension {

        static TYPE = "animsCreateFromAseprite";

        constructor() {
            super(CreateFromAsepriteCodeSnippetExtension.TYPE, "Create Animations From Aseprite");
        }

        isEnabledFor(_editor: editor.SceneEditor): boolean {
            
            return !_editor.getScene().isPrefabSceneType();
        }

        createEmptyCodeSnippet(): CodeSnippet {

            return new CreateFromAsepriteCodeSnippet();
        }

        async createAndConfigureCodeSnippets(): Promise<CodeSnippet[]> {

            const finder = new pack.core.PackFinder();

            await finder.preload();

            const input = finder.getAssets()
                .filter(i => i instanceof pack.core.AsepriteAssetPackItem);

            const dlg = new pack.ui.dialogs.AssetSelectionDialog("tree", false);

            dlg.create();

            dlg.setTitle("Select Aseprite File Key");

            dlg.getViewer().setInput(input);

            const result = await dlg.getResultPromise() as pack.core.AnimationConfigInPackItem[];

            const snippets = (result || []).map(a => {

                const snippet = new CreateFromAsepriteCodeSnippet();
                snippet.assetKey = a.getKey();

                return snippet;
            });

            return snippets;
        }
    }
}