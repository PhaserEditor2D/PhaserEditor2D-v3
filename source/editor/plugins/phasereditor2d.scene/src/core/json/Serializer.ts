namespace phasereditor2d.scene.core.json {

    export class Serializer {

        private _data: IObjectData;
        private _prefabSer: Serializer;

        constructor(data: IObjectData) {

            this._data = data;

            const finder = ScenePlugin.getInstance().getSceneFinder();

            if (this._data.prefabId) {

                const prefabData = finder.getPrefabData(this._data.prefabId);

                if (prefabData) {

                    this._prefabSer = new Serializer(prefabData);

                } else {

                    finder.printDebugInfo();

                    throw new Error(`[${this._data.label}] Cannot find scene prefab with id "${this._data.prefabId}".`);
                }
            }
        }

        getSerializer(data: IObjectData) {

            return new Serializer(data);
        }

        getData() {

            return this._data;
        }

        getType(): string {

            if (this._prefabSer) {

                return this._prefabSer.getType();
            }

            return this._data.type;
        }

        getPhaserType(): string {

            if (this._prefabSer) {

                return this._prefabSer.getPhaserType();
            }

            const ext = ScenePlugin.getInstance().getGameObjectExtensionByObjectType(this._data.type);

            if (!ext) {

                const msg = `Cannot find extension for ObjectType '${this._data.type}'`;

                alert(msg);
                
                throw new Error(msg);
            }

            return ext.getPhaserTypeName();
        }

        getPrefabSerializer() {

            return this._prefabSer;
        }

        private getDefaultValue(name: string, defaultValue?: any) {

            if (this.isPrefabInstance()) {

                if (!this.isUnlocked(name)) {

                    const defaultPrefabValue = this._prefabSer.getDefaultValue(name, defaultValue);

                    if (defaultPrefabValue !== undefined) {
                        return defaultPrefabValue;
                    }

                    return defaultValue;
                }
            }

            const localValue = this._data[name];

            if (localValue === undefined) {

                return defaultValue;
            }

            return localValue;
        }

        isUnlocked(name: string) {

            if (this.isPrefabInstance()) {

                // check if it is a local component property
                if (this._data.components) {

                    for (const compName of this._data.components) {

                        if (name.startsWith(compName + ".")) {

                            return true;
                        }
                    }
                }

                if (this._data.unlock) {

                    const i = this._data.unlock.indexOf(name);

                    return i >= 0;
                }

                return false;
            }

            return true;
        }

        setUnlocked(name: string, unlocked: boolean) {

            if (this.isPrefabInstance()) {

                const dataUnlock = this._data.unlock ?? [];

                const set = new Set(dataUnlock);

                if (unlocked) {

                    set.add(name);

                } else {

                    set.delete(name);
                }

                this._data.unlock = [...set];
            }
        }

        isPrefabInstance() {

            return typeof this._data.prefabId === "string";
        }

        write(name: string, value: any, defValue?: any) {

            if (this.isPrefabInstance()) {

                if (this.isUnlocked(name)) {

                    // const defValue2 = this.getDefaultValue(name, defValue);

                    // colibri.core.json.write(this._data, name, value, defValue2);
                    this._data[name] = value;
                }

            } else {

                colibri.core.json.write(this._data, name, value, defValue);
            }
        }

        read(name: string, defValue?: any) {

            // const defValue2 = this.getDefaultValue(name, defValue);
            // const value = colibri.core.json.read(this._data, name, defValue2);
            // return value;

            if (this.isPrefabInstance()) {

                const prefabValue = this.getDefaultValue(name, defValue);

                if (this.isUnlocked(name)) {

                    return colibri.core.json.read(this._data, name, prefabValue);
                }

                return prefabValue;
            }

            return colibri.core.json.read(this._data, name, defValue);
        }
    }
}