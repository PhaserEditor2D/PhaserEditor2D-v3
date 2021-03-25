namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;

    interface IResource {
        id: string,
        path: string
    }

    export class CodeResources {

        private _resources: IResource[];
        private _resDataMap: Map<string, string>;

        constructor() {

            this._resources = [];
            this._resDataMap = new Map();
        }

        addResource(id: string, path: string) {

            this._resources.push({ id, path })
        }

        async preload(): Promise<void> {

            const plugin = ScenePlugin.getInstance();

            for (const res of this._resources) {

                const data = await plugin.getString(res.path);

                this._resDataMap.set(res.id, data);
            }
        }

        async createFile(resId: string, parent: io.FilePath, name: string): Promise<io.FilePath> {

            const data = this._resDataMap.get(resId);

            return await colibri.ui.ide.FileUtils.createFile_async(parent, name, data);
        }
    }
}