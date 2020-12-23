namespace phasereditor2d.scene.ui.sceneobjects {

    import controls = colibri.ui.controls;

    export class TilemapLayerSection extends SceneGameObjectSection<TilemapLayer> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.TilemapLayerData", "Tilemap Layer", false, false);
        }

        protected getSectionHelpPath() {

            return "scene-editor/tilemap-layer-object.html";
        }

        createForm(parent: HTMLDivElement) {

            const comp = this.createGridElement(parent, 2);

            {
                this.createLabel(comp, "Tilemap");

                const btn = this.createButton(comp, "", () => {

                    this.getEditor().setSelection([this.getSelectionFirstElement().tilemap]);
                });

                this.addUpdater(() => {

                    const tilemap = (this.getSelectionFirstElement().tilemap as Tilemap);

                    btn.textContent = tilemap.getEditorSupport().getLabel();
                });
            }

            this.layerProp(comp, "name", "Layer Name");
            this.layerProp(comp, "width", "Width");
            this.layerProp(comp, "height", "Height");
            this.layerProp(comp, "widthInPixels", "Width In Pixels");
            this.layerProp(comp, "heightInPixels", "Height In Pixels");
            this.layerProp(comp, "tileHeight", "Tile Height");
            this.layerProp(comp, "tileWidth", "Tile Width");
        }

        private layerProp(comp: HTMLElement, prop: string, name: string) {

            this.createLabel(comp, name, ScenePlugin.getInstance().getPhaserDocs().getDoc("Phaser.Tilemaps.LayerData." + prop));

            const text = this.createText(comp, true);

            this.addUpdater(() => {

                const layer = this.getSelectionFirstElement();

                const tilemap = layer.tilemap;

                const layerData = tilemap.layer;

                text.value = layerData[prop];
            });
        }

        canEdit(obj: any, n: number): boolean {

            return (obj instanceof TilemapLayer)
                && obj.tilemap !== undefined;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}