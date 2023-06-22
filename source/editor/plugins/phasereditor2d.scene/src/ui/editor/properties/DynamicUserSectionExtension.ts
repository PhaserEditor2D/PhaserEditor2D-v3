/// <reference path="./SceneEditorPropertySectionExtension.ts" />
namespace phasereditor2d.scene.ui.editor.properties {

    import io = colibri.core.io;

    export class DynamicUserSectionExtension extends SceneEditorPropertySectionExtension {

        getSectionProviders(editor: SceneEditor): GetPropertySection[] {

            const result: GetPropertySection[] = [];

            const visitedPrefabs = new Set<io.FilePath>();
            const visitedComps = new Set<string>();

            const finder = ScenePlugin.getInstance().getSceneFinder();

            // add local user components

            for (const obj of editor.getSelectedGameObjects()) {

                const objES = obj.getEditorSupport();

                const localComps = objES.getUserComponentsComponent()
                    .getLocalUserComponents();

                for (const compInfo of localComps) {

                    const compName = compInfo.component.getName();

                    visitedComps.add(compName);

                    result.push(page => new DynamicUserComponentPropertySection(
                        page, compName, `${compInfo.file.getModTime()}`));
                }
            }


            for (const obj of editor.getSelectedGameObjects()) {

                const objES = obj.getEditorSupport();

                if (!objES.isPrefabInstance()) {

                    continue;
                }

                const prefabFile = objES.getPrefabFile();

                if (visitedPrefabs.has(prefabFile)) {

                    continue;
                }

                visitedPrefabs.add(prefabFile);

                const prefabUserProps = objES.getComponent(sceneobjects.PrefabUserPropertyComponent) as sceneobjects.PrefabUserPropertyComponent;
                const prefabInfoList = prefabUserProps.getPropertiesByPrefab();

                // add all properties from prefabs

                for (const prefabInfo of prefabInfoList) {

                    // add section for the current prefab info

                    result.push(page => new sceneobjects.DynamicPrefabInstanceSection(
                        page, prefabInfo.prefabFile, prefabInfo.properties));

                    // add all user component properties defined in the current prefab

                    const userComps = objES.getUserComponentsComponent();

                    const compNames = userComps
                        .getPrefabUserComponents()
                        .filter(i => i.prefabFile === prefabInfo.prefabFile)
                        .flatMap(i => i.components)
                        .map(c => c.getName())
                        .filter(name => !visitedComps.has(name));

                    for (const compName of compNames) {

                        visitedComps.add(compName);

                        const findResult = finder.getUserComponentByName(compName);

                        if (findResult) {

                            const prefabName = prefabInfo.prefabFile.getNameWithoutExtension();

                            result.push(page => new DynamicUserComponentPropertySection(
                                page, compName, `${findResult.file.getModTime()}`, prefabName));
                        }
                    }
                }
            }


            // this.addUserComponentSections(editor, result);

            // this.addPrefabSections(editor, result);

            return result;
        }

        private addPrefabSections(editor: SceneEditor, result: GetPropertySection[]) {

            for (const obj of editor.getSelectedGameObjects()) {

                const objES = obj.getEditorSupport();
                const prefabUserProps = objES.getComponent(sceneobjects.PrefabUserPropertyComponent) as sceneobjects.PrefabUserPropertyComponent;
                const infoList = prefabUserProps.getPropertiesByPrefab();

                for (const info of infoList) {

                    result.push(page => new sceneobjects.DynamicPrefabInstanceSection(
                        page, info.prefabFile, info.properties));
                }
            }
        }

        private addUserComponentSections(editor: SceneEditor, result: GetPropertySection[]) {

            const compNames = editor.getSelectedGameObjects()
                .flatMap(obj => obj.getEditorSupport()
                    .getUserComponentsComponent()
                    .getUserComponentNodes())
                .map(compNode => compNode.getComponentName());

            const used = new Set();

            const finder = ScenePlugin.getInstance().getSceneFinder();

            for (const compName of compNames) {

                if (!used.has(compName)) {

                    const findResult = finder.getUserComponentByName(compName);

                    if (findResult) {

                        result.push(page => new DynamicUserComponentPropertySection(
                            page, compName, `${findResult.file.getModTime()}`));
                    }
                }
            }
        }
    }
}