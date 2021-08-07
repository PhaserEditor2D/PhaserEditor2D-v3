namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import json = core.json;

    export class ContainerEditorSupport extends GameObjectEditorSupport<Container> {

        private _allowPickChildren: boolean;

        constructor(obj: Container, scene: Scene) {
            super(ContainerExtension.getInstance(), obj, scene);

            this._allowPickChildren = true;

            this.addComponent(new TransformComponent(obj));
            this.addComponent(new VisibleComponent(obj));
            this.addComponent(new ContainerComponent(obj));
        }

        isAllowPickChildren() {
            return this._allowPickChildren;
        }

        setAllowPickChildren(childrenPickable: boolean) {
            this._allowPickChildren = childrenPickable;
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

        async buildDependencyHash(args: IBuildDependencyHashArgs) {

            super.buildDependencyHash(args);

            if (!this.isPrefabInstance()) {

                for (const obj of this.getObject().getChildren()) {

                    obj.getEditorSupport().buildDependencyHash(args);
                }
            }
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

            const finder = ScenePlugin.getInstance().getSceneFinder();

            if (this.isPrefabInstance()) {

                containerData.nestedPrefabs = this.getObject().getChildren()

                    .filter(obj => obj.getEditorSupport().isActiveNestedPrefab())

                    .filter(obj => finder.existsPrefab(obj.getEditorSupport().getPrefabId()))

                    .map(obj => {

                        const objData = {} as json.IObjectData;

                        obj.getEditorSupport().writeJSON(objData);

                        return objData as json.IObjectData;
                    })

                    .filter(data => (data.nestedPrefabs ?? []).length > 0 || (data.unlock ?? []).length > 0);

            } else {

                containerData.list = this.getObject().getChildren().map(obj => {

                    const objData = {} as json.IObjectData;

                    obj.getEditorSupport().writeJSON(objData);

                    return objData as json.IObjectData;
                });
            }
        }

        readJSON(containerData: json.IObjectData) {

            super.readJSON(containerData);

            const ser = this.getSerializer(containerData);

            const originalChildren = ser.read("list", []) as json.IObjectData[];

            const maker = this.getScene().getMaker();

            const container = this.getObject();

            container.removeAll(true);

            const children = containerData.prefabId ?
                ContainerEditorSupport.buildPrefabChildrenData(containerData, originalChildren) : originalChildren;

            for (const objData of children) {

                const sprite = maker.createObject(objData);

                if (sprite) {

                    this.getObject().add(sprite);
                }
            }
        }

        static buildPrefabChildrenData(objData: core.json.IObjectData, originalPrefabChildren: core.json.IObjectData[]) {

            const result: json.IObjectData[] = [];

            const finder = ScenePlugin.getInstance().getSceneFinder();

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

        static buildPrefabChildrenData__orig(objData: core.json.IObjectData, originalPrefabChildren: core.json.IObjectData[]) {

            const result: json.IObjectData[] = [];

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const localNestedPrefabs = objData.nestedPrefabs ?? [];

            for (const originalChild of originalPrefabChildren) {

                if (originalChild.scope !== sceneobjects.ObjectScope.NESTED_PREFAB) {

                    result.push(originalChild);

                } else {

                    let localNestedPrefab: json.IObjectData;

                    for (const local of localNestedPrefabs) {

                        const remoteNestedPrefab = this.findRemoteNestedPrefab(objData.prefabId, finder.getOriginalPrefabId(local.prefabId));

                        if (!remoteNestedPrefab || remoteNestedPrefab.id === originalChild.id) {

                            localNestedPrefab = local;
                            break;
                        }
                    }

                    if (localNestedPrefab) {

                        const nestedPrefab = this.reconnectWithRemoteNestedPrefab(objData.prefabId, localNestedPrefab);

                        if (nestedPrefab) {

                            result.push(nestedPrefab);

                        }

                    } else {

                        const remoteNestedPrefab = this.findRemoteNestedPrefab(objData.prefabId, originalChild.id);

                        if (remoteNestedPrefab) {

                            const nestedPrefab: core.json.IObjectData = {
                                id: Phaser.Utils.String.UUID(),
                                prefabId: remoteNestedPrefab.id,
                                label: remoteNestedPrefab.label,
                            };

                            result.push(nestedPrefab);

                        } else {

                            // ok, create one connecting with the original child

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

        private static reconnectWithRemoteNestedPrefab(parentPrefabId: string, nestedPrefabData: core.json.IObjectData) {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            const origNestedPrefabId = finder.getOriginalPrefabId(nestedPrefabData.prefabId);

            if (!origNestedPrefabId) {

                return null;
            }

            if (parentPrefabId === finder.getOriginalPrefabId(parentPrefabId)
                && nestedPrefabData.prefabId && origNestedPrefabId) {

                // is pointing directly to the original object
                return nestedPrefabData;
            }

            const pointedPrefabData = finder.getPrefabData(parentPrefabId);

            if (!pointedPrefabData) {

                return null;
            }

            const pointedNestedPrefab = (pointedPrefabData.nestedPrefabs ?? [])
                .find(obj => origNestedPrefabId === finder.getOriginalPrefabId(obj.prefabId));

            if (pointedNestedPrefab) {

                nestedPrefabData.prefabId = pointedNestedPrefab.id;

                return nestedPrefabData;
            }

            return this.reconnectWithRemoteNestedPrefab(pointedPrefabData.prefabId, nestedPrefabData);
        }

        getScreenBounds(camera: Phaser.Cameras.Scene2D.Camera) {

            const container = this.getObject();

            if (container.list.length === 0) {
                return [];
            }

            const minPoint = new Phaser.Math.Vector2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
            const maxPoint = new Phaser.Math.Vector2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

            const points: Phaser.Math.Vector2[] = [];

            for (const obj of container.getChildren()) {

                const bounds = obj.getEditorSupport().getScreenBounds(camera);

                points.push(...bounds);
            }

            const worldPoint = new Phaser.Math.Vector2(0, 0);

            container.getWorldTransformMatrix().transformPoint(0, 0, worldPoint);

            const p = camera.getScreenPoint(worldPoint.x, worldPoint.y);

            points.push(p);

            for (const point of points) {

                minPoint.x = Math.min(minPoint.x, point.x);
                minPoint.y = Math.min(minPoint.y, point.y);
                maxPoint.x = Math.max(maxPoint.x, point.x);
                maxPoint.y = Math.max(maxPoint.y, point.y);
            }

            return [
                new Phaser.Math.Vector2(minPoint.x, minPoint.y),
                new Phaser.Math.Vector2(maxPoint.x, minPoint.y),
                new Phaser.Math.Vector2(maxPoint.x, maxPoint.y),
                new Phaser.Math.Vector2(minPoint.x, maxPoint.y)
            ];
        }

        trim() {

            const container = this.getObject();

            if (container.length === 0) {

                return;
            }

            let minX = Number.MAX_SAFE_INTEGER;
            let minY = Number.MAX_SAFE_INTEGER;

            for (const child of container.list) {

                const sprite = child as unknown as Phaser.GameObjects.Sprite;

                minX = Math.min(sprite.x, minX);
                minY = Math.min(sprite.y, minY);
            }

            for (const child of container.list) {

                const sprite = child as unknown as Phaser.GameObjects.Sprite;

                sprite.x -= minX;
                sprite.y -= minY;
            }

            const p = new Phaser.Math.Vector2(0, 0);

            container.getWorldTransformMatrix().transformPoint(minX, minY, p);

            if (container.parentContainer) {

                container.parentContainer.getWorldTransformMatrix().applyInverse(p.x, p.y, p);
            }

            container.x = p.x;
            container.y = p.y;
        }
    }
}