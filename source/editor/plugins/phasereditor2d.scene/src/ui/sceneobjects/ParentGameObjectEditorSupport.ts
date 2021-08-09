namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import json = core.json;

    export abstract class ParentGameObjectEditorSupport<T extends Layer | Container>
        extends GameObjectEditorSupport<T> {

        private _allowPickChildren: boolean = true;

        setInteractive() {
            // nothing
        }

        destroy() {

            for (const obj of this.getObject().getChildren()) {

                obj.getEditorSupport().destroy();
            }

            super.destroy();
        }

        getCellRenderer(): colibri.ui.controls.viewers.ICellRenderer {

            if (this.isPrefabInstance()) {

                const finder = ScenePlugin.getInstance().getSceneFinder();

                const file = finder.getPrefabFile(this.getPrefabId());

                if (file) {

                    const image = SceneThumbnailCache.getInstance().getContent(file);

                    if (image) {

                        return new controls.viewers.ImageCellRenderer(image);
                    }
                }
            }

            return new controls.viewers.IconImageCellRenderer(ScenePlugin.getInstance().getIcon(ICON_GROUP));
        }

        writeJSON(containerData: json.IObjectData) {

            super.writeJSON(containerData);

            this.writeJSON_children(this.getObject(), containerData);
        }

        readJSON(containerData: json.IObjectData) {

            super.readJSON(containerData);

            this.readJSON_children(this.getObject(), containerData);
        }

        private writeJSON_children(container: Container | Layer, containerData: json.IObjectData) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const support = container.getEditorSupport();

            if (support.isPrefabInstance()) {

                containerData.nestedPrefabs = container.getChildren()

                    .filter(obj => obj.getEditorSupport().isMutableNestedPrefabInstance())

                    .filter(obj => finder.existsPrefab(obj.getEditorSupport().getPrefabId()))

                    .map(obj => {

                        const objData = {} as json.IObjectData;

                        obj.getEditorSupport().writeJSON(objData);

                        return objData as json.IObjectData;
                    })

                    .filter(data => (data.nestedPrefabs ?? []).length > 0 || (data.unlock ?? []).length > 0);

            } else {

                containerData.list = container.getChildren().map(obj => {

                    const objData = {} as json.IObjectData;

                    obj.getEditorSupport().writeJSON(objData);

                    return objData as json.IObjectData;
                });
            }
        }

        private readJSON_children(container: Container | Layer, containerData: json.IObjectData) {

            const support = container.getEditorSupport();

            const ser = support.getSerializer(containerData);

            const originalChildren = ser.read("list", []) as json.IObjectData[];

            const maker = support.getScene().getMaker();

            container.removeAll(true);

            const children = containerData.prefabId ?
                ParentGameObjectEditorSupport.buildPrefabChildrenData(containerData, originalChildren) : originalChildren;

            let i = 0;

            for (const childData of children) {

                // creates an empty object
                const sprite = maker.createObject({
                    id: childData.id,
                    prefabId: childData.prefabId,
                    type: childData.type,
                    label: childData.label,
                });

                if (sprite) {

                    container.add(sprite);

                    const originalData = originalChildren[i];

                    if (originalData.scope === sceneobjects.ObjectScope.NESTED_PREFAB) {

                        sprite.getEditorSupport()._setMutableNestedPrefab(true);
                    }

                    // updates the object with the final data
                    sprite.getEditorSupport().readJSON(childData);
                }

                i++;
            }
        }

        static buildPrefabChildrenData(objData: core.json.IObjectData, originalPrefabChildren: core.json.IObjectData[]) {

            const result: json.IObjectData[] = [];

            const localNestedPrefabs = objData.nestedPrefabs ?? [];

            for (const originalChild of originalPrefabChildren) {

                if (originalChild.scope !== sceneobjects.ObjectScope.NESTED_PREFAB) {

                    result.push(originalChild);

                } else {


                    // find a local nested prefab

                    let localNestedPrefab: json.IObjectData;

                    for (const local of localNestedPrefabs) {

                        const remoteNestedPrefab = this.findRemoteNestedPrefab(objData.prefabId, originalChild.id);

                        if (remoteNestedPrefab) {

                            localNestedPrefab = colibri.core.json.copy(local) as json.IObjectData;
                            localNestedPrefab.prefabId = remoteNestedPrefab.id;

                            break;

                        } else {

                            if (local.prefabId === originalChild.id) {

                                localNestedPrefab = local;

                                break;
                            }
                        }
                    }

                    if (localNestedPrefab) {

                        result.push(localNestedPrefab);

                    } else {

                        // we don't have a local prefab, find one remote and create a pointer to it

                        const remoteNestedPrefab = this.findRemoteNestedPrefab(objData.prefabId, originalChild.id);

                        if (remoteNestedPrefab) {

                            // we found a remote nested prefab, create a link to it

                            const nestedPrefab: core.json.IObjectData = {
                                id: Phaser.Utils.String.UUID(),
                                prefabId: remoteNestedPrefab.id,
                                label: remoteNestedPrefab.label,
                            };

                            result.push(nestedPrefab);

                        } else {

                            // ok, just create a link with the original child

                            const nestedPrefab: core.json.IObjectData = {
                                id: Phaser.Utils.String.UUID(),
                                prefabId: originalChild.id,
                                label: originalChild.label,
                            };

                            result.push(nestedPrefab);
                        }
                    }
                }
            }

            return result;
        }

        private static findRemoteNestedPrefab(parentPrefabId: string, originalNestedPrefabId: string): json.IObjectData {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const prefabData = finder.getPrefabData(parentPrefabId);

            if (!prefabData) {

                return null;
            }

            const nestedPrefab = (prefabData.nestedPrefabs ?? []).find(obj => {

                const thisOriginalId = finder.getOriginalPrefabId(obj.prefabId);

                return thisOriginalId === originalNestedPrefabId
            });

            if (nestedPrefab) {

                return nestedPrefab;
            }

            if (prefabData.prefabId) {

                return this.findRemoteNestedPrefab(prefabData.prefabId, originalNestedPrefabId);
            }

            return null;
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs) {

            super.buildDependencyHash(args);

            if (!this.isPrefabInstance()) {

                for (const obj of this.getObject().getChildren()) {

                    obj.getEditorSupport().buildDependencyHash(args);
                }
            }
        }

        isAllowPickChildren() {

            return this._allowPickChildren;
        }

        setAllowPickChildren(childrenPickable: boolean) {

            this._allowPickChildren = childrenPickable;
        }
    }
}