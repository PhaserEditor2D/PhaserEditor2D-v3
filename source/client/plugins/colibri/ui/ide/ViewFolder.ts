namespace colibri.ui.ide {

    export class ViewFolder extends PartFolder {
        constructor(...classList: string[]) {
            super("ViewFolder", ...classList);
        }
    }
}