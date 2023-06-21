/// <reference path="./SceneEditorPropertySectionExtension.ts" />
namespace phasereditor2d.scene.ui.editor.properties {

    export class DynamicUserComponentSectionExtension extends SceneEditorPropertySectionExtension {

        getSectionProviders(editor: SceneEditor): GetPropertySection[] {

            const compNames = editor.getSelectedGameObjects()
                .flatMap(obj => obj.getEditorSupport()
                    .getUserComponentsComponent()
                    .getUserComponentNodes())
                .map(compNode => compNode.getComponentName())

            const used = new Set();

            const result: GetPropertySection[] = [];

            const finder = ScenePlugin.getInstance().getSceneFinder();

            for(const compName of compNames) {

                if (!used.has(compName)) {

                    const findResult = finder.getUserComponentByName(compName);

                    if (findResult) {

                        result.push(page => new DynamicUserComponentPropertySection(
                            page, compName, `${findResult.file.getModTime()}`));
                    }
                }
            }

            // for (const model of finder.getUserComponentsModels()) {

            //     for (const comp of model.model.getComponents()) {

            //         result.push(page => new DynamicUserComponentPropertySection(
            //             page, comp.getName(), `${model.file.getModTime()}`));
            //     }
            // }

            return result;
        }
    }
}