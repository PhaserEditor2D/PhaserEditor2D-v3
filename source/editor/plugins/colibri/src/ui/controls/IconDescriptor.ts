namespace colibri.ui.controls {

    export class IconDescriptor {

        constructor(public iconPlugin: Plugin, public iconName: string) {
        }

        getIcon() {

            return this.iconPlugin.getIcon(this.iconName);
        }
    }
}