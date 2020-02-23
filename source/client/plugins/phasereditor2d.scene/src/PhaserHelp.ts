namespace phasereditor2d.scene {

    export function PhaserHelp(key: string) {

        if (key === undefined) {

            return undefined;
        }

        const prefix = "phaser:";

        if (key.startsWith(prefix)) {

            return ScenePlugin.getInstance().getPhaserDocs().getDoc(key.substring(prefix.length));
        }

        return key;
    }
}