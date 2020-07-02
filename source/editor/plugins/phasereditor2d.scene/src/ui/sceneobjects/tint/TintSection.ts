namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    function TintPropertyAdapter(prop: IProperty<any>): IProperty<any> {

        return {

            name: prop.name,
            defValue: "#fff",
            label: prop.label,
            tooltip: prop.tooltip,
            local: prop.local,

            getValue: obj => {

                const intColor = prop.getValue(obj) as number;

                const color = Phaser.Display.Color.IntegerToColor(intColor);

                const hex = "#" + [color.red, color.green, color.blue]

                    .map(comp => Phaser.Display.Color.ComponentToHex(comp))

                    .join("");

                return hex;
            },

            setValue: (obj, value) => {

                const color = Phaser.Display.Color.HexStringToColor(value.substring(0, 7));

                const intColor = color.color;

                prop.setValue(obj, intColor);
            }
        };
    }

    export class TintSection extends SceneObjectSection<IOriginLikeObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TintSection", "Tint", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/tint-properties.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);
            comp.style.gridTemplateColumns = "auto auto 1fr";

            this.createBooleanProperty(comp, TintComponent.tintFill);

            this.createPropertyColorRow(comp, TintComponent.tintTopLeft, false);

            this.createPropertyColorRow(comp, TintComponent.tintTopRight, false);

            this.createPropertyColorRow(comp, TintComponent.tintBottomLeft, false);

            this.createPropertyColorRow(comp, TintComponent.tintBottomRight, false);
        }


        canEdit(obj: any, n: number): boolean {

            return EditorSupport.hasObjectComponent(obj, TintComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}