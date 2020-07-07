namespace phasereditor2d.scene.ui.sceneobjects {

    import usercomponent = ui.editor.usercomponent;

    interface IUserCompEntry {
        compName: string;
        propsData: any;
    }

    export class UserComponentsEditorComponent extends Component<ISceneObject> {

        private _userCompEntries: IUserCompEntry[];

        constructor(obj: ISceneObject) {
            super(obj, []);

            this._userCompEntries = [];
        }

        addUserComponent(compName: string) {

            this._userCompEntries.push({
                compName: compName,
                propsData: {}
            });
        }

        getUserComponents() {

            const finder = ScenePlugin.getInstance().getSceneFinder();

            return this._userCompEntries

                .map(entry => finder.getUserComponentByName(entry.compName))

                .filter(c => c !== undefined);
        }

        buildSetObjectPropertiesCodeDOM(args: ISetObjectPropertiesCodeDOMArgs): void {
            throw new Error("Method not implemented.");
        }
    }
}