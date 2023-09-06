/// <reference path="./UserPropertyType.ts"/>
namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;
    import code = core.code;

    export class KeyCodePropertyType extends UserPropertyType<string> {

        constructor(typeId = "keycode") {
            super(typeId, "SPACE");
        }

        getName(): string {

            return "Key Code";
        }

        createEditorElement(getValue: () => any, setValue: (value: any) => void): IPropertyEditor {

            const formBuilder = new controls.properties.FormBuilder();

            const btn = formBuilder.createButton(undefined, "Key Code", e => {

                const viewer = new KeyboardKeysViewer();

                const keyCode = getValue();
                viewer.revealAndSelect(keyCode);

                const dlg = new controls.dialogs.ViewerDialog(viewer, false);

                dlg.create();

                dlg.setTitle("Select Key Code");

                dlg.addOpenButton("Select", (sel) => {

                    const value = sel[0];

                    setValue(value);

                }, false);

                dlg.addCancelButton();
            });

            const update = () => {

                btn.textContent = getValue();
            };

            return {
                element: btn,
                update
            };
        }

        createInspectorPropertyEditor(section: SceneGameObjectSection<any>, parent: HTMLElement, userProp: UserProperty, lockIcon: boolean): void {

            section.createKeyCodeRow(parent, userProp.getComponentProperty(), lockIcon);
        }

        buildDeclarePropertyCodeDOM(prop: UserProperty, value: string): core.code.FieldDeclCodeDOM {

            return this.buildExpressionFieldCode(prop, "number", `Phaser.Input.Keyboard.KeyCodes.${value}`);
        }

        buildSetObjectPropertyCodeDOM(comp: Component<any>, args: ISetObjectPropertiesCodeDOMArgs, userProp: UserProperty): void {

            comp.buildSetObjectPropertyCodeDOM([userProp.getComponentProperty()], args2 => {

                const dom = new code.AssignPropertyCodeDOM(args2.fieldCodeName, args.objectVarName);

                dom.value(`Phaser.Input.Keyboard.KeyCodes.${args2.value}`);

                args.statements.push(dom);
            });
        }
    }
}