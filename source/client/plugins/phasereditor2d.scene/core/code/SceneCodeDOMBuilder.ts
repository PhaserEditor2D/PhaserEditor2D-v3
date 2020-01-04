namespace phasereditor2d.scene.core.code {

    import io = colibri.core.io;

    export class SceneCodeDOMBuilder {

        private _scene: ui.GameScene;
        private _file: io.FilePath;

        constructor(scene: ui.GameScene, file: io.FilePath) {

            this._scene = scene;
            this._file = file;
        }

        build(): UnitCodeDOM {

            const methods: MemberDeclDOM[] = [];
            const fields: MemberDeclDOM[] = [];

            const unit = new UnitCodeDOM([]);

            const settings = this._scene.getSettings();

            if (settings.onlyGenerateMethods) {

                // TODO

            } else {

                const clsName = this._file.getNameWithoutExtension();
                const clsDecl = new ClassDeclCodeDOM(clsName);

                clsDecl.setSuperClass(settings.superClassName);

                clsDecl.getMembers().push(...methods);
                clsDecl.getMembers().push(...fields);

                unit.getElements().push(clsDecl);
            }

            return unit;
        }
    }
}