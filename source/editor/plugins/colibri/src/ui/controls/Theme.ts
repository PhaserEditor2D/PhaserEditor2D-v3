namespace colibri.ui.controls {

    export interface ITheme {

        id: string;

        classList: string[];

        displayName: string;

        viewerSelectionBackground: string;

        viewerSelectionForeground: string;

        viewerForeground: string;

        dark: boolean;

        sceneBackground: string;
    }
}