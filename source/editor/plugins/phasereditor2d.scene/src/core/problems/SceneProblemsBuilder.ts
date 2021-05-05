namespace phasereditor2d.scene.core.problems {

    import io = colibri.core.io;

    class SceneProblemsBuilder extends colibri.problems.ProblemBuilderExtension {

        constructor() {
            super(CONTENT_TYPE_SCENE);
        }

        async build(files: colibri.core.io.FilePath[]): Promise<colibri.problems.core.Problem[]> {

            const finder = new core.json.SceneFinder();
            await finder.preloadFiles(files)

            const problems: colibri.problems.core.Problem[] = [];


            for (const file of finder.getSceneFiles()) {

                const sceneData = finder.getSceneData(file);

                this.validateSceneObjects(finder, problems, sceneData.displayList, file);
            }

            return problems;
        }


        private validateSceneObjects(
            finder: json.SceneFinder,
            problems: colibri.problems.core.Problem[],
            list: json.IObjectData[],
            file: io.FilePath) {

            for (const obj of list) {

                if (obj.prefabId) {

                    const prefabData = finder.getPrefabData(obj.prefabId);

                    if (!prefabData) {

                        problems.push(new colibri.problems.core.Problem(
                            colibri.problems.core.PROBLEM_ERROR,
                            `'${obj.label}' references a missing prefab (${obj.prefabId}).`,
                            file));
                    }
                }

                if (obj.type === ui.sceneobjects.ContainerExtension.getInstance().getTypeName()) {

                    this.validateSceneObjects(finder, problems, (obj as ui.sceneobjects.IContainerData).list, file);
                }
            }
        }
    }

    export function createSceneProblemsBuilder(): any {

        return new SceneProblemsBuilder();
    }
}