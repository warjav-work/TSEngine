// The main entry point to the application.
window.onload = function () {
    var engine = new TSE.Engine();
    engine.start();
};
var TSE;
(function (TSE) {
    /**
     * The game engine class.
     * */
    var Engine = /** @class */ (function () {
        /**
         * Creates a new engine.
         * */
        function Engine() {
            console.log("Hello World");
        }
        /**
         * Starts up this engine.
         * */
        Engine.prototype.start = function () {
            this._canvas = TSE.GLUtilities.initialize();
            TSE.gl.clearColor(0, 0, 0, 1);
            this.loop();
        };
        /**
         * The main gane loop.
         * */
        Engine.prototype.loop = function () {
            TSE.gl.clear(TSE.gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.loop.bind(this));
        };
        return Engine;
    }());
    TSE.Engine = Engine;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    /**
     * Responsible for setting up a WebGL rendering context.
     * */
    var GLUtilities = /** @class */ (function () {
        function GLUtilities() {
        }
        /**
         * Initializes WebGL, potentially using the canvas with an assigned id matching the provider if it is defined.
         * @param elementId The id for element to search for.
         */
        GLUtilities.initialize = function (elementId) {
            var canvas;
            if (elementId !== null && elementId !== undefined) {
                canvas = document.getElementById(elementId);
                if (canvas === null && canvas === undefined) {
                    throw new Error("Cannot find a canvas element named: " + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            TSE.gl = canvas.getContext("webgl");
            if (TSE.gl === null && TSE.gl === undefined) {
                throw new Error("Unable to initialize WebGl! ");
            }
            return canvas;
        };
        return GLUtilities;
    }());
    TSE.GLUtilities = GLUtilities;
})(TSE || (TSE = {}));
//# sourceMappingURL=main.js.map