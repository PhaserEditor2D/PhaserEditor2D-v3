namespace colibri.ui.ide {

    export abstract class ViewPart extends Part {

        constructor(id: string) {
            super(id);
            
            this.addClass("View");
        }
    }
}