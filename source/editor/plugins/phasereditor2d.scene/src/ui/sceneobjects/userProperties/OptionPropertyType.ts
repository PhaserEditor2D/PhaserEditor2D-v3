namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import code = core.code;

    export class OptionPropertyType extends UserPropertyType<string> {

        private _options: string[];

        constructor() {
            super("option", "");

            this._options = [];
        }

        createInspectorPropertyEditor(section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            const prop = userProp.getComponentProperty() as PrefabOptionUserPropertyWrapper;

            section.createPropertyEnumRow(parent, prop as IEnumProperty<any, any>, lockIcon);
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM_StringProperty(args, userProp.getComponentProperty());
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): code.FieldDeclCodeDOM {

            const decl = this.buildStringFieldCode(prop, value);

            const typeName = this._options.map(opt => code.CodeDOM.quote(opt)).join("|");

            decl.setType(typeName);

            return decl;
        }

        getOptions() {

            return this._options;
        }

        setOptions(options: string[]) {

            this._options = options;
        }

        writeJSON(data: any) {

            super.writeJSON(data);

            data.options = this._options;
        }

        readJSON(data: any) {

            super.readJSON(data);
            
            this._options = data.options;
        }

        getName() {

            return "Option";
        }

        createEditorElement(getValue: () => string, setValue: (value: string) => void): IPropertyEditor {

            const items = this._options.map(option => ({
                name: option,
                value: option
            }));

            const element = document.createElement("button");
            element.addEventListener("click", e => {

                const menu = new controls.Menu();

                for (const item of items) {

                    menu.add(new controls.Action({
                        text: item.name,
                        callback: () => {
                            setValue(item.value);
                        }
                    }));
                }

                menu.createWithEvent(e);
            });

            const update = () => {

                element.innerHTML = getValue();
            };

            return { element, update };
        }
    }
}