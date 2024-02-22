declare interface Color {
    rgba: number[];
    hsla: number[];
    rgbString: string;
    rgbaString: string;
    hslString: string;
    hslaString: string;
    hex: string;
  }

  declare type ColorCallback = (color: Color) => void;

  declare interface Options {
    parent?: HTMLElement;
    popup?: 'top' | 'bottom' | 'left' | 'right' | false;
    template?: string;
    layout?: string;
    alpha?: boolean;
    editor?: boolean;
    editorFormat?: 'hex' | 'hsl' | 'rgb';
    cancelButton?: boolean;
    color?: string;
    onChange?: ColorCallback;
    onDone?: ColorCallback;
    onOpen?: ColorCallback;
    onClose?: ColorCallback;
  }

  declare type Configuration = Options | HTMLElement;

  declare class Picker {
    constructor(options: Configuration);
    onChange: ColorCallback;
    onDone: ColorCallback;
    onOpen: ColorCallback;
    onClose: ColorCallback;
    setOptions(options: Configuration): void;
    openHandler(e: Event): void;
    closeHandler(e: Event): void;
    movePopup(options: Options, open: boolean): void;
    setColor(color: string | number[], silent: boolean): void;
    setColour: Picker['setColor'];
    show(): boolean;
    hide(): boolean;
    destroy(): void;
    // added by Arian
    domElement: HTMLElement;
  }
