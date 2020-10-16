namespace phasereditor2d.pack.ui.properties {

    import controls = colibri.ui.controls;

    export class TilemapTiledSection extends controls.properties.PropertySection<core.TilemapTiledJSONAssetPackItem> {

        constructor(page: controls.properties.PropertyPage) {
            super(page, "phasereditor2d.pack.ui.properties.TilemapTiledSection", "Tilemap Info", true, false);
        }

        createForm(parent: HTMLDivElement) {

            const comp = document.createElement("div");

            this.addUpdater(async () => {

                const tilemap = this.getSelectionFirstElement();

                await tilemap.preload();

                let html = `
                <b>Tilesets</b>
                <p>
                <table class="TilemapTable" border="1" cellspacing="0">
                    <tr>
                        <th>Name</th><th>Image</th>
                    </tr>
                `;

                for (const tileset of tilemap.getTilesetsData()) {

                    html += `
                    <tr>
                        <td>${tileset.name}</td>
                        <td>${tileset.image}</td>
                    </tr>
                    `;
                }

                html += `
                </table>
                </p>`;

                html += `
                <br>
                <b>Tilemaps</b>
                <p>
                    <table class="TilemapTable" border="1" cellspacing="0">
                        ${tilemap.getLayerNames().map(name => `<tr><td>${name}</td></tr>`).join("")}
                    </table>
                </p>
                `;

                comp.innerHTML = html;
            });

            parent.appendChild(comp);
        }

        canEdit(obj: any, n: number): boolean {

            return obj instanceof core.TilemapTiledJSONAssetPackItem;
        }

        canEditNumber(n: number): boolean {

            return n === 1;
        }
    }
}