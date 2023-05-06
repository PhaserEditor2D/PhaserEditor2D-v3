namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class HitAreaSection extends SceneGameObjectSection<ISceneGameObject> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.HitAreaSection", "Hit Area");
        }

        createMenu(menu: controls.Menu): void {
            
            menu.addCommand(ui.editor.commands.CMD_HIT_AREA_DISABLE);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 3);

            const { hitAreaShape } = HitAreaComponent;

            this.createPropertyEnumRow(comp, hitAreaShape);
        }

        canEdit(obj: any, n: number): boolean {

            return GameObjectEditorSupport.hasObjectComponent(obj, HitAreaComponent);
        }

        canEditNumber(n: number): boolean {

            return n > 0;
        }
    }
}