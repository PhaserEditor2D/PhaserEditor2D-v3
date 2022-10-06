namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ArcadeGeometrySection extends SceneGameObjectSection<ISceneGameObject> {

        static ID = "phasereditor2d.scene.ui.sceneobjects.ArcadeGeometrySection";

        constructor(page: controls.properties.PropertyPage) {
            super(page, ArcadeGeometrySection.ID, "Arcade Physics Body Geometry");
        }

        getSectionHelpPath() {

            return "scene-editor/arcade-physics-properties.html#arcade-physics-body-geometry-section";
        }

        createMenu(menu: controls.Menu): void {
            
            this.createToolMenuItem(menu, ArcadeBodyTool.ID);

            menu.addSeparator();

            menu.addCommand(ui.editor.commands.CMD_ARCADE_CENTER_BODY);
            menu.addCommand(ui.editor.commands.CMD_ARCADE_RESIZE_TO_OBJECT_BODY);

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElementWithPropertiesBoolXY(parent);

            this.createPropertyEnumRow(comp, ArcadeComponent.geometry, false).style.gridColumn = "span 4";

            this.createPropertyXYRow(comp, ArcadeComponent.offset);

            this.createSeparatorForXYGrid(comp, "Circular");

            {
                const input = this.createPropertyFloatRow(comp, ArcadeComponent.radius);
                input.style.gridColumn = "span 4";
                this.addCheckGeometryUpdater(true, [input]);
            }

            this.createSeparatorForXYGrid(comp, "Rectangular");

            { 
                const elements = this.createPropertyXYRow(comp, ArcadeComponent.size);
                this.addCheckGeometryUpdater(false, elements);
            }
        }

        private addCheckGeometryUpdater(expectingCircle: boolean, elements: HTMLInputElement[]) {

            this.addUpdater(() => {

                const isCircle = this.flatValues_BooleanAnd(
                    this.getSelection().map(obj => ArcadeComponent.isCircleBody(obj)));

                for (const elem of elements) {

                    elem.disabled = elem.disabled || isCircle !== expectingCircle;
                }
            });
        }

        canEdit(obj: any, n: number): boolean {

            return n > 0 && GameObjectEditorSupport.hasObjectComponent(obj, ArcadeComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}