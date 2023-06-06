namespace phasereditor2d.scene.ui.editor.properties {

    export class PrefabPropertyOrderAction {

        static allow(editor: SceneEditor, move: ui.editor.undo.DepthMove) {

            const sel = this.sortedSelection(editor);

            if (sel.length === 0) {

                return false;
            }

            for (const prop of sel) {

                if (!(prop instanceof ui.sceneobjects.UserProperty)) {

                    return false;
                }
            }

            const siblings = sel[0].getManager().getProperties();

            for (const prop of sel) {

                const index = siblings.indexOf(prop);

                const len = siblings.length;

                if (move === "Bottom" || move === "Down") {

                    if (index === len - 1) {

                        return false;
                    }

                } else { // Top || Up

                    if (index === 0) {

                        return false;
                    }
                }
            }

            return true;
        }

        static execute(editor: SceneEditor, depthMove: undo.DepthMove): void {

            const sel = this.sortedSelection(editor);

            switch (depthMove) {

                case "Bottom":

                    for (const prop of sel) {

                        const siblings = prop.getManager().getProperties();

                        Phaser.Utils.Array.BringToTop(siblings, prop);
                    }

                    break;

                case "Top":

                    for (let i = 0; i < sel.length; i++) {

                        const prop = sel[sel.length - i - 1];

                        const siblings = prop.getManager().getProperties();

                        Phaser.Utils.Array.SendToBack(siblings, prop)
                    }

                    break;

                case "Down":

                    for (let i = 0; i < sel.length; i++) {

                        const prop = sel[sel.length - i - 1];

                        const siblings = prop.getManager().getProperties();

                        Phaser.Utils.Array.MoveUp(siblings, prop);
                    }

                    break;

                case "Up":

                    for (const prop of sel) {

                        const siblings = prop.getManager().getProperties();

                        Phaser.Utils.Array.MoveDown(siblings, prop);
                    }

                    break;
            }
        }

        private static sortedSelection(editor: SceneEditor) {

            const sel = editor.getSelection() as any as sceneobjects.UserProperty[];
            const props = editor.getScene().getPrefabUserProperties().getProperties();

            sel.sort((a, b) => {

                const aa = props.indexOf(a);
                const bb = props.indexOf(b);

                return aa - bb;
            });

            return sel;
        }
    }
}