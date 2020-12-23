/// <reference path="../object/properties/SceneGameObjectSection.ts" />

namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class ContainerSection extends SceneGameObjectSection<Container> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ContainerSection", "Container", false, true);
        }

        getSectionHelpPath() {

            return "scene-editor/container-object.html#container-properties";
        }

        createMenu(menu: controls.Menu) {

            menu.addCommand(editor.commands.CMD_TRIM_CONTAINER);
            menu.addCommand(editor.commands.CMD_BREAK_PARENT);

            menu.addSeparator();

            super.createMenu(menu);
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            this.createBooleanField(comp, ContainerComponent.allowPickChildren, false);
        }

        canEdit(obj: any, n: number): boolean {
            return obj instanceof Container;
        }

        canEditNumber(n: number): boolean {
            return n > 0;
        }
    }

}