namespace phasereditor2d.scene.ui.sceneobjects {

    export class ObjectListDocSection extends editor.properties.DocsSection {

        constructor(page: colibri.ui.controls.properties.PropertyPage) {
            super(page, "phasereditor2d.scene.ui.sceneobjects.ObjectListSection");
        }

        protected getHelp(): string {
            // tslint:disable-next-line:no-trailing-whitespace

            const help = `An array of objects. Like in:

\`\`\`
const itemList = [collectable1,
    collectable2,
    coin1,
    coin2];
\`\`\`

`;
            return help;
        }

        canEdit(obj: any, n: number): boolean {

            return obj === ObjectList;
        }
    }
}