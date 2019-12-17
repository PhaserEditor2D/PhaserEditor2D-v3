/// <reference path="./Viewer.ts"/>

namespace colibri.ui.controls.viewers {
    export interface ITreeContentProvider {
        getRoots(input: any): any[];

        getChildren(parent: any): any[];
    }
}