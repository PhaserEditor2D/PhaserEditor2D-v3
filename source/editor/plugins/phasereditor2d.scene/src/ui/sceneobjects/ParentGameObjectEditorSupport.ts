namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import json = core.json;

    export abstract class ParentGameObjectEditorSupport<T extends Layer | Container>
        extends GameObjectEditorSupport<T> {

        private _allowPickChildren = true;
        private _showChildrenInOutline = true;
        private _countPrefabChildren = 0;


        getCountPrefabChildren() {

            return this._countPrefabChildren;
        }

        isAllowPickChildren() {

            return this._allowPickChildren;
        }

        setAllowPickChildren(childrenPickable: boolean) {

            this._allowPickChildren = childrenPickable;
        }

        isShowChildrenInOutline() {

            return this._showChildrenInOutline;
        }

        setShowChildrenInOutline(showChildrenInOutline: boolean) {

            this._showChildrenInOutline = showChildrenInOutline;
        }

        getAppendedChildren() {

            const children = this.getObject().getChildren();

            const appended = children.slice(this._countPrefabChildren);

            return appended;
        }

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

            if (this.isPrefabInstance() && !this.isNestedPrefabInstance()) {

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

                // write nested prefabs

                containerData.nestedPrefabs = container.getChildren()

                    .filter(obj => obj.getEditorSupport().isMutableNestedPrefabInstance())

                    .filter(obj => finder.existsPrefab(obj.getEditorSupport().getPrefabId()))

                    .map(obj => {

                        const objData = {} as json.IObjectData;

                        obj.getEditorSupport().writeJSON(objData);

                        return objData as json.IObjectData;
                    })

                    .filter(data =>
                        (data.nestedPrefabs ?? []).length > 0
                        || (data.unlock ?? []).length > 0
                        || (data.components ?? []).length > 0);

                // write appended objects

                containerData.list = support.getAppendedChildren().map(obj => {

                    const objData = {} as json.IObjectData;

                    obj.getEditorSupport().writeJSON(objData);

                    return objData as json.IObjectData;
                });

            } else {

                containerData.list = container.getChildren().map(obj => {

                    const objData = {} as json.IObjectData;

                    obj.getEditorSupport().writeJSON(objData);

                    return objData as json.IObjectData;
                });
            }
        }

        private static readPrefabChildren(serializer: core.json.Serializer, list: json.IObjectData[]) {

            if (serializer.isPrefabInstance()) {

                this.readPrefabChildren(serializer.getPrefabSerializer(), list);
            }

            const localList = serializer.getData()["list"] || [];

            list.push(...localList);
        }

        static buildRawChildrenData(containerData: json.IObjectData) {

            const serializer = new json.Serializer(containerData);

            const isPrefabContainer = serializer.isPrefabInstance();

            /**
             * The orginal children of the container's prefab.
             * It means, it doesn't include the appended children.
             */
            let prefabChildren: json.IObjectData[] = [];

            /**
             * All the final children to be added to the container.
             */
            let children: json.IObjectData[];

            /**
             * Just the children added explicity to this container (without looking to the prefab).
             */
            const localChildren = containerData.list || [];

            if (isPrefabContainer) {

                prefabChildren = [];

                this.readPrefabChildren(serializer.getPrefabSerializer(), prefabChildren);

                const updatedPrefabChildren = ParentGameObjectEditorSupport
                    .buildUpdatedPrefabChildrenDataWithNestedPrefab(containerData, prefabChildren);

                children = [...updatedPrefabChildren, ...localChildren];

            } else {

                // it is not a prefab, just get the local children
                children = localChildren;
            }

            return { prefabChildren, children };
        }

        private readJSON_children(container: Container | Layer, containerData: json.IObjectData) {

            const containerSupport = container.getEditorSupport();

            const { children, prefabChildren } = ParentGameObjectEditorSupport
                .buildRawChildrenData(containerData);

            containerSupport._countPrefabChildren = prefabChildren.length;

            const maker = containerSupport.getScene().getMaker();

            container.removeAll(true);

            let i = 0;

            for (const childData of children) {

                let initObjData: any = {
                    id: childData.id,
                    prefabId: childData.prefabId,
                    type: childData.type,
                    label: childData.label,
                };

                // This is a very very ugly solution for this issue:
                // https://github.com/PhaserEditor2D/PhaserEditor2D-v3/issues/229
                // but making a bigger change in serialization at this moment could introduce a lot of bugs
                // and the TilemapLayer is a unique case in Phaser & the editor.
                // For example, you cannot create a prefab instance of a TilemapLayer
                if (childData.type === "TilemapLayer") {

                    initObjData = childData;
                }

                // creates an empty object
                const sprite = maker.createObject(initObjData);

                if (sprite) {

                    container.add(sprite);

                    // if it is not an appended child
                    if (i < prefabChildren.length) {

                        const prefabData = prefabChildren[i];

                        if (prefabData.scope === sceneobjects.ObjectScope.NESTED_PREFAB) {

                            sprite.getEditorSupport()._setNestedPrefabInstance(true);
                        }
                    }

                    // updates the object with the final data
                    sprite.getEditorSupport().readJSON(childData);
                }

                i++;
            }
        }

        /**
         * Build the children data but modified by the nested prefab info.
         * 
         * @param objData The container data
         * @param originalPrefabChildren The container's prefab children
         * @returns The children but modified by the nested prefabs
         */
        static buildUpdatedPrefabChildrenDataWithNestedPrefab(objData: core.json.IObjectData, originalPrefabChildren: core.json.IObjectData[]) {

            const result: json.IObjectData[] = [];

            const localNestedPrefabs = objData.nestedPrefabs ?? [];

            for (const originalChild of originalPrefabChildren) {

                if (originalChild.scope !== sceneobjects.ObjectScope.NESTED_PREFAB) {

                    result.push(originalChild);

                } else {

                    // find a local nested prefab

                    let localNestedPrefab: json.IObjectData;

                    for (const local of localNestedPrefabs) {

                        const localOriginalIdOfNestedPrefab = this.findOriginalIdOfNestedPrefab(local);

                        if (localOriginalIdOfNestedPrefab === originalChild.id) {

                            const remoteNestedPrefab = this.findRemoteNestedPrefab(objData.prefabId, originalChild.id);

                            if (remoteNestedPrefab) {

                                localNestedPrefab = colibri.core.json.copy(local) as json.IObjectData;
                                localNestedPrefab.prefabId = remoteNestedPrefab.id;

                            } else {

                                localNestedPrefab = local;
                            }

                            break;
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

                // const thisOriginalId = finder.getOriginalPrefabId(obj.prefabId);
                const thisOriginalId = this.findOriginalIdOfNestedPrefab(obj);

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

        private static findOriginalIdOfNestedPrefab(obj: json.IObjectData) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            if (obj.prefabId && finder.isNestedPrefab(obj.prefabId)) {

                const prefabData = finder.getPrefabData(obj.prefabId);

                return this.findOriginalIdOfNestedPrefab(prefabData);
            }

            return obj.id;
        }

        async buildDependencyHash(args: IBuildDependencyHashArgs) {

            super.buildDependencyHash(args);

            if (!this.isPrefabInstance()) {

                for (const obj of this.getObject().getChildren()) {

                    obj.getEditorSupport().buildDependencyHash(args);
                }
            }
        }
    }
}