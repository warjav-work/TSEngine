namespace TSE {

    /**
     * The game engine class.
     * */
    export class Engine {
        private _canvas: HTMLCanvasElement;

        /**
         * Creates a new engine.
         * */
        public constructor() {
            console.log("Hello World")
        }

        /**
         * Starts up this engine.
         * */
        public start(): void {
            this._canvas = GLUtilities.initialize();

            gl.clearColor(0, 0, 0, 1);

            this.loop();
        }

        /**
         * The main gane loop.
         * */
        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            requestAnimationFrame(this.loop.bind(this));

        }
    }
}