/// <reference path="./SceneEditorPropertySectionExtension.ts" />
namespace phasereditor2d.scene.ui.editor.properties {

    export class DynamicUserComponentSectionExtension extends SceneEditorPropertySectionExtension {

        getSectionProviders(): GetPropertySection[] {

            const result: GetPropertySection[] = [];

            const finder = ScenePlugin.getInstance().getSceneFinder();

            for (const model of finder.getUserComponentsModels()) {

                for (const comp of model.model.getComponents()) {

                    result.push(page => new DynamicPropertySection(
                        page, comp.getName(), `${model.file.getModTime()}`));
                }
            }

            return result;
        }
    }
}