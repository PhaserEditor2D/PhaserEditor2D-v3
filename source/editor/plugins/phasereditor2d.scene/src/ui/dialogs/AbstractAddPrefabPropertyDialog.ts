namespace phasereditor2d.scene.ui.dialogs {

    import controls = colibri.ui.controls;

    export abstract class AbstractAddPrefabPropertyDialog extends controls.dialogs.ViewerDialog {

        constructor() {
            super(new UserPropertyTypesViewer(), false);

            this.setSize(300, 400, true);
        }

        create(hideParentDialog?: boolean): void {

            super.create(hideParentDialog);

            this.setTitle("Add Property");

            this.enableButtonOnlyWhenOneElementIsSelected(this.addOpenButton("Add Property", sel => {

                this.addProperty(sel[0] as sceneobjects.UserPropertyType<any>);
            }));

            this.addCancelButton();
        }
        
        protected abstract addProperty(propType: sceneobjects.UserPropertyType<any>): void;
    }

    class UserPropertyTypesViewer extends controls.viewers.TreeViewer {

        constructor() {
            super("phasereditor2d.scene.ui.dialogs.UserPropertyTypesViewer");

            this.setLabelProvider(new UserPropertyTypeLabelProvider());
            this.setContentProvider(new controls.viewers.ArrayTreeContentProvider());
            this.setCellRendererProvider(new controls.viewers.EmptyCellRendererProvider());
            this.setInput(ScenePlugin.getInstance().getUserPropertyTypes());
        }
    }

    class UserPropertyTypeLabelProvider implements controls.viewers.ILabelProvider {

        getLabel(obj: ui.sceneobjects.UserPropertyType<any>): string {

            return `${obj.getName()} Property`;
        }
    }
}