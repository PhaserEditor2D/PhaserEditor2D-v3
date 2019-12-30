namespace colibri.ui.controls {

    export interface Theme {

        id: string;

        classList: string[];

        displayName: string;

        viewerSelectionBackground: string;

        viewerSelectionForeground: string;

        viewerForeground: string;

        dark: boolean;
    }
}