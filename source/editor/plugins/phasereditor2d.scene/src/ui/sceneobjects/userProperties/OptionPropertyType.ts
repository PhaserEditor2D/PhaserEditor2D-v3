namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class OptionPropertyType extends UserPropertyType<string> {

        private _options: string[];

        constructor() {
            super("option", "");

            this._options = [];
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

            this._options = data.options;
        }

        getName() {

            return "Option";
        }

        renderValue(value: string): string {

            return value;
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