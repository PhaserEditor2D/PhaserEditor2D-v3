namespace phasereditor2d.scene.ui.editor.usercomponent {

    import controls = colibri.ui.controls;

    export class UserComponentEditorContentProvider implements controls.viewers.ITreeContentProvider {
        

        getRoots(input: UserComponentsModel): any[] {
            
            return input.getComponents();
        }

        getChildren(parent: any): any[] {

            if (parent instanceof UserComponent) {

                return parent.getUserProperties().getProperties();
            }

            return [];
        }

    }
}