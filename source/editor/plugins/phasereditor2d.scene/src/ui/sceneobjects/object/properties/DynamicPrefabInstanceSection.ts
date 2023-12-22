namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import io = colibri.core.io;

    export class DynamicPrefabInstanceSection extends SceneGameObjectSection<ISceneGameObject> {

        private _prefabFile: io.FilePath;
        private _properties: UserProperty[];

        constructor(
            page: controls.properties.PropertyPage,
            prefabFile: io.FilePath,
            properties: UserProperty[]) {
            super(page,
                DynamicPrefabInstanceSection.computeId(prefabFile),
                getSceneDisplayName(prefabFile),
                false, true, resources.getIcon(resources.ICON_GROUP),
                DynamicPrefabInstanceSection.computeTypeHash(prefabFile));

            this._prefabFile = prefabFile;
            this._properties = properties;
        }

        private static computeTypeHash(prefabFile: io.FilePath): string {

            const finder = ScenePlugin.getInstance().getSceneFinder();
            
            const prefabId = finder.getPrefabId(prefabFile);

            return `DynamicPrefabInstanceSection_${prefabFile.getNameWithoutExtension()}_${prefabId}`
        }

        private static computeId(prefabFile: io.FilePath) {

            const finder = ScenePlugin.getInstance().getSceneFinder();
            const id = finder.getPrefabId(prefabFile);
            const hash = prefabFile.getModTime();

            return `phasereditor2d.scene.ui.sceneobjects.DynamicPrefabInstanceSection_${id}_${hash}`;
        }

        getSectionHelpPath() {

            return "scene-editor/prefab-user-properties.html#user-properties-in-a-prefab-instance";
        }

        createMenu(menu: controls.Menu) {

            menu.addCommand(editor.commands.CMD_OPEN_PREFAB);

            const prefabName = this._prefabFile.getNameWithoutExtension();

            menu.addAction({
                text: `Select All ${prefabName}`,
                callback: () => {

                    const finder = ScenePlugin.getInstance().getSceneFinder();

                    const sel = [];

                    this.getEditor().getScene().visitAll(obj2 => {

                        if (GameObjectEditorSupport.hasEditorSupport(obj2)) {

                            const objES = GameObjectEditorSupport.getEditorSupport(obj2);

                            if (objES.isPrefabInstance()) {

                                const prefabFiles = finder.getPrefabHierarchy(objES.getPrefabId());

                                if (prefabFiles.indexOf(this._prefabFile) >= 0) {

                                    sel.push(obj2);
                                }
                            }
                        }
                    });

                    this.getEditor().setSelection(sel);
                }
            });

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            for (const prop of this._properties) {

                prop.getType().createInspectorPropertyEditor(this, comp, prop, true);
            }
        }

        canEdit(obj: sceneobjects.ISceneGameObject, n: number): boolean {

            if (sceneobjects.isGameObject(obj)) {

                const objES = obj.getEditorSupport();

                if (objES.isPrefabInstance()) {

                    const objPrefabFile = objES.getPrefabFile();

                    const finder = ScenePlugin.getInstance().getSceneFinder();
    
                    if (objES.isNestedPrefabInstance()) {

                        const objPrefabId = finder.getFirstNonNestedPrefabId(objES.getPrefabId());

                        if (objPrefabId) {

                            const sectionPrefabId = finder.getPrefabId(this._prefabFile);

                            return objPrefabId === sectionPrefabId;
                        }

                    } else {

                        if (finder.isPrefabVariant(objPrefabFile, this._prefabFile)) {

                            return true;
                        }
                    }
                }
            }

            return false;
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}