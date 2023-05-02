namespace colibri.ui.controls.viewers {

	export class RenderCellArgs {

		constructor(
			public canvasContext: CanvasRenderingContext2D,
			public x: number,
			public y: number,
			public w: number,
			public h: number,
			public obj: any,
			public viewer: Viewer,
			public center = false) {
		}

		clone() {
			return new RenderCellArgs(this.canvasContext, this.x, this.y, this.w, this.h, this.obj, this.viewer, this.center);
		}
	}
}