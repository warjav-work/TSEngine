var engine;
// The main entry point to the application.
window.onload = function () {
    engine = new TSE.Engine();
    engine.start();
};
window.onresize = function () {
    engine.resize();
};
var TSE;
(function (TSE) {
    /**
     * The game engine class.
     */
    var Engine = /** @class */ (function () {
        /**
         * Creates a new engine.
         */
        function Engine() {
            console.log("Hello World");
        }
        /**
         * Starts up this engine.
         */
        Engine.prototype.start = function () {
            this._canvas = TSE.GLUtilities.initialize();
            TSE.gl.clearColor(0, 0, 0, 1);
            this.loadShaders();
            this._shader.use();
            this.createBuffer();
            this.resize();
            this.loop();
        };
        /**
         * Resizes to canvas to fit the window.
         */
        Engine.prototype.resize = function () {
            if (this._canvas !== null && this._canvas !== undefined) {
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
            }
        };
        Engine.prototype.loop = function () {
            TSE.gl.clear(TSE.gl.COLOR_BUFFER_BIT);
            TSE.gl.bindBuffer(TSE.gl.ARRAY_BUFFER, this._buffer);
            TSE.gl.vertexAttribPointer(0, 3, TSE.gl.FLOAT, false, 0, 0);
            TSE.gl.enableVertexAttribArray(0);
            TSE.gl.drawArrays(TSE.gl.TRIANGLES, 0, 3);
            requestAnimationFrame(this.loop.bind(this));
        };
        Engine.prototype.createBuffer = function () {
            this._buffer = TSE.gl.createBuffer();
            var vertices = [
                // x,y,z
                0, 0, 0,
                0, 0.5, 0,
                0.5, 0.5, 0
            ];
            TSE.gl.bindBuffer(TSE.gl.ARRAY_BUFFER, this._buffer);
            TSE.gl.vertexAttribPointer(0, 3, TSE.gl.FLOAT, false, 0, 0);
            TSE.gl.enableVertexAttribArray(0);
            TSE.gl.bufferData(TSE.gl.ARRAY_BUFFER, new Float32Array(vertices), TSE.gl.STATIC_DRAW);
            TSE.gl.bindBuffer(TSE.gl.ARRAY_BUFFER, undefined);
            TSE.gl.disableVertexAttribArray(0);
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\n                attribute vec3 a_position;                \n                void main() {\n                    gl_Position = vec4(a_position, 1.0);\n                }";
            var fragmentShaderSource = "\n                precision mediump float;\n                void main() {\n                    gl_FragColor = vec4(1.0);\n                }\n                ";
            this._shader = new TSE.Shader('basic', vertexShaderSource, fragmentShaderSource);
        };
        return Engine;
    }());
    TSE.Engine = Engine;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    /**
     * Responsible for setting up a WebGL rendering context.
     */
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
var TSE;
(function (TSE) {
    /**
     * Represents a WebGL shader.
     */
    var Shader = /** @class */ (function () {
        /**
         * Create a new shader.
         * @param name The name of the shader.
         * @param vertexSource The source of the vertex shader.
         * @param fragmentSource The source of the fragment shader.
         */
        function Shader(name, vertexSource, fragmentSource) {
            this._name = name;
            var vertexShader = this.loadShader(vertexSource, TSE.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, TSE.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
        }
        Object.defineProperty(Shader.prototype, "name", {
            /**
             * The name of the shader.
             */
            get: function () {
                return this._name;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Use this shader.
         * */
        Shader.prototype.use = function () {
            TSE.gl.useProgram(this._program);
        };
        Shader.prototype.loadShader = function (source, shaderType) {
            var shader = TSE.gl.createShader(shaderType);
            TSE.gl.shaderSource(shader, source);
            TSE.gl.compileShader(shader);
            var error = TSE.gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader '" + this._name + "': " + error);
            }
            return shader;
        };
        Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
            this._program = TSE.gl.createProgram();
            TSE.gl.attachShader(this._program, vertexShader);
            TSE.gl.attachShader(this._program, fragmentShader);
            TSE.gl.linkProgram(this._program);
            var error = TSE.gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error("Error linking shader '" + this._name + "': " + error);
            }
        };
        return Shader;
    }());
    TSE.Shader = Shader;
})(TSE || (TSE = {}));
//# sourceMappingURL=main.js.map