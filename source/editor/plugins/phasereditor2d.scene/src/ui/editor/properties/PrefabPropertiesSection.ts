namespace phasereditor2d.scene.ui.editor.properties {

    import io = colibri.core.io;
    import controls = colibri.ui.controls;

    export class PrefabPropertiesSection extends SceneSection {

        private _propArea: HTMLDivElement;

        constructor(page: controls.properties.PropertyPage) {
            super(
                page, "phasereditor2d.scene.ui.editor.properties.PrefabPropertiesSection",
                "Prefab Properties", false, true);
        }

        protected createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent);

            comp.style.gridTemplateColumns = "1fr";

            this._propArea = this.createGridElement(comp, 2);
            comp.appendChild(this._propArea);

            const btn = this.createButton(comp, "Add Property", e => {
                // TODO
            });
            btn.style.gridColumn = "1 / span 2";
            btn.style.justifySelf = "center";

            this.addUpdater(()=> {

                // delete all property UI
                this._propArea.innerHTML = "";

                // add the properties here
                this.createLabel(this._propArea, "Property 1", "The property 1");
                this.createText(this._propArea);

            });
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof Scene && obj.getSettings().sceneType === core.json.SceneType.PREFAB;
        }
    }
}