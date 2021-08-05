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
            // Load
            this._projection = TSE.Matrix4x4.orthograthic(0, this._canvas.width, 0, this._canvas.height, -1.0, 100.0);
            this._sprite = new TSE.Sprite("test");
            this._sprite.load();
            this._sprite.position.x = 200;
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
                TSE.gl.viewport(-1, 1, 1, -1);
            }
        };
        Engine.prototype.loop = function () {
            TSE.gl.clear(TSE.gl.COLOR_BUFFER_BIT);
            // Set uniforms.
            var colorPosition = this._shader.getUniformLocation("u_color");
            TSE.gl.uniform4f(colorPosition, 1, 0.5, 0, 1);
            var projectionPosition = this._shader.getUniformLocation("u_projection");
            TSE.gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
            var modelLocation = this._shader.getUniformLocation("u_model");
            TSE.gl.uniformMatrix4fv(modelLocation, false, new Float32Array(TSE.Matrix4x4.translation(this._sprite.position).data));
            this._sprite.render();
            requestAnimationFrame(this.loop.bind(this));
        };
        Engine.prototype.loadShaders = function () {
            var vertexShaderSource = "\n                attribute vec3 a_position;\n\n                uniform mat4 u_projection;\n                uniform mat4 u_model;\n\n                void main() {\n                    gl_Position = u_projection * u_model * vec4(a_position, 1.0);\n                }";
            var fragmentShaderSource = "\n                precision mediump float;\n\n                uniform vec4 u_color;\n                void main() {\n                    gl_FragColor = u_color;\n                }\n                ";
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
     * Represents the information needed for a GLBuffer attribute.
     */
    var AttributeInfo = /** @class */ (function () {
        function AttributeInfo() {
        }
        return AttributeInfo;
    }());
    TSE.AttributeInfo = AttributeInfo;
    /**
     * Represents a WebGL buffer
     */
    var GLBuffer = /** @class */ (function () {
        /**
         * Create a new GL buffer.
         * @param elementSize The size of each in this buffer.
         * @param dataType The data type of this buffer. Default: gl.FLOAT.
         * @param targetBufferType The buffer target type. Can be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER. Default: gl.ARRAY_BUFFER.
         * @param mode The drawing mode of this buffer. (i.e. gl.TRIANGLES or gl.LINES). Default: gl.TRIANGLES.
         */
        function GLBuffer(elementSize, dataType, targetBufferType, mode) {
            if (dataType === void 0) { dataType = TSE.gl.FLOAT; }
            if (targetBufferType === void 0) { targetBufferType = TSE.gl.ARRAY_BUFFER; }
            if (mode === void 0) { mode = TSE.gl.TRIANGLES; }
            this._hasAttributeLocation = false;
            this._data = [];
            this._attributes = [];
            this._elementSize = elementSize;
            this._dataType = dataType;
            this._targetBufferType = targetBufferType;
            this._mode = mode;
            // Determine byte size
            switch (this._dataType) {
                case TSE.gl.FLOAT:
                case TSE.gl.INT:
                case TSE.gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case TSE.gl.SHORT:
                case TSE.gl.UNSIGNED_SHORT:
                    this._typeSize = 2;
                    break;
                case TSE.gl.BYTE:
                case TSE.gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognized data type: " + dataType.toString());
            }
            this._stride = this._elementSize * this._typeSize;
            this._buffer = TSE.gl.createBuffer();
        }
        /**
         * Destroys this buffer.
         * */
        GLBuffer.prototype.destroy = function () {
            TSE.gl.deleteBuffer(this._buffer);
        };
        /**
         * Bind this buffer.
         * @param normalized Indicetes if the data should be normalized. Default: false.
         */
        GLBuffer.prototype.bind = function (normalized) {
            if (normalized === void 0) { normalized = false; }
            TSE.gl.bindBuffer(this._targetBufferType, this._buffer);
            if (this._hasAttributeLocation) {
                for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                    var attr = _a[_i];
                    TSE.gl.vertexAttribPointer(attr.location, attr.size, this._dataType, normalized, this._stride, attr.offset * this._typeSize);
                    TSE.gl.enableVertexAttribArray(attr.location);
                }
            }
        };
        /**
         * Unbinds this buffer.
         * */
        GLBuffer.prototype.unbind = function () {
            for (var _i = 0, _a = this._attributes; _i < _a.length; _i++) {
                var attr = _a[_i];
                TSE.gl.disableVertexAttribArray(attr.location);
            }
            TSE.gl.bindBuffer(TSE.gl.ARRAY_BUFFER, this._buffer);
        };
        /**
         * Add an attribute with the provided information to this buffer.
         * @param info The information to be added.
         */
        GLBuffer.prototype.addAttributeLocation = function (info) {
            this._hasAttributeLocation = true;
            this._attributes.push(info);
        };
        /**
         *
         * Add data to this buffer.
         * @param data
         */
        GLBuffer.prototype.pushBackData = function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var dt = data_1[_i];
                this._data.push(dt);
            }
        };
        /**
         * Upload this buffer's data to GPU.
         * */
        GLBuffer.prototype.upload = function () {
            TSE.gl.bindBuffer(this._targetBufferType, this._buffer);
            var bufferData;
            switch (this._dataType) {
                case TSE.gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case TSE.gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case TSE.gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this._data);
                    break;
                case TSE.gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case TSE.gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break;
                case TSE.gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case TSE.gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }
            TSE.gl.bufferData(this._targetBufferType, bufferData, TSE.gl.STATIC_DRAW);
        };
        /**
         * Draw this buffer.
         * */
        GLBuffer.prototype.draw = function () {
            if (this._targetBufferType == TSE.gl.ARRAY_BUFFER) {
                TSE.gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
            }
            else if (this._targetBufferType == TSE.gl.ELEMENT_ARRAY_BUFFER) {
                TSE.gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        };
        return GLBuffer;
    }());
    TSE.GLBuffer = GLBuffer;
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
            this._attributes = {};
            this._uniforms = {};
            this._name = name;
            var vertexShader = this.loadShader(vertexSource, TSE.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, TSE.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.detectAttributes();
            this.detectUniforms();
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
        /**
         * Get location of an attribute with the provided name.
         * @param name The name of the attribute whose location to retrieve.
         */
        Shader.prototype.getAttributeLocation = function (name) {
            if (this._attributes[name] === null && this._attributes[name] === undefined) {
                throw new Error("Unable to find attribute named '" + name + "' in shader named '" + this._name + "'");
            }
            return this._attributes[name];
        };
        /**
         * Get location of an uniform with the provided name.
         * @param name The name of the uniform whose location to retrieve.
         */
        Shader.prototype.getUniformLocation = function (name) {
            if (this._uniforms[name] === null && this._uniforms[name] === undefined) {
                throw new Error("Unable to find attribute named '" + name + "' in shader named '" + this._name + "'");
            }
            return this._uniforms[name];
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
        Shader.prototype.detectAttributes = function () {
            var attributesCount = TSE.gl.getProgramParameter(this._program, TSE.gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < attributesCount; i++) {
                var info = TSE.gl.getActiveAttrib(this._program, i);
                if (!info) {
                    break;
                }
                this._attributes[info.name] = TSE.gl.getAttribLocation(this._program, info.name);
            }
        };
        Shader.prototype.detectUniforms = function () {
            var uniformCount = TSE.gl.getProgramParameter(this._program, TSE.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < uniformCount; i++) {
                var info = TSE.gl.getActiveUniform(this._program, i);
                if (!info) {
                    break;
                }
                this._uniforms[info.name] = TSE.gl.getUniformLocation(this._program, info.name);
            }
        };
        return Shader;
    }());
    TSE.Shader = Shader;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Sprite = /** @class */ (function () {
        function Sprite(name, width, heigth) {
            if (width === void 0) { width = 100; }
            if (heigth === void 0) { heigth = 100; }
            this.position = new TSE.Vector3();
            this._name = name;
            this._width = width;
            this._height = heigth;
        }
        Sprite.prototype.load = function () {
            this._buffer = new TSE.GLBuffer(3);
            var positionAttribute = new TSE.AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);
            var vertices = [
                // x,y,z
                0, 0, 0,
                0, this._height, 0,
                this._width, this._height, 0,
                this._width, this._height, 0,
                this._width, 0, 0,
                0, 0, 0
            ];
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        };
        Sprite.prototype.update = function (time) {
        };
        Sprite.prototype.render = function () {
            this._buffer.bind();
            this._buffer.draw();
        };
        return Sprite;
    }());
    TSE.Sprite = Sprite;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Matrix4x4 = /** @class */ (function () {
        function Matrix4x4() {
            this._data = [];
            this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }
        Object.defineProperty(Matrix4x4.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: false,
            configurable: true
        });
        Matrix4x4.identity = function () {
            return new Matrix4x4();
        };
        Matrix4x4.orthograthic = function (left, rigth, bottom, top, nearClip, farClip) {
            var matrix = new Matrix4x4();
            var lr = 1.0 / (left - rigth);
            var bt = 1.0 / (bottom - top);
            var nf = 1.0 / (nearClip - farClip);
            matrix._data[0] = -2.0 * lr;
            matrix._data[5] = -2.0 * bt;
            matrix._data[10] = 2.0 * nf;
            matrix.data[12] = (left + rigth) * lr;
            matrix.data[13] = (top + bottom) * bt;
            matrix.data[14] = (farClip + nearClip) * nf;
            return matrix;
        };
        Matrix4x4.translation = function (position) {
            var matrix = new Matrix4x4();
            matrix.data[12] = position.x;
            matrix.data[13] = position.y;
            matrix.data[14] = position.z;
            return matrix;
        };
        return Matrix4x4;
    }());
    TSE.Matrix4x4 = Matrix4x4;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var Vector3 = /** @class */ (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this._x = x;
            this._y = y;
            this._z = z;
        }
        Object.defineProperty(Vector3.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
            get: function () {
                return this._z;
            },
            set: function (value) {
                this._z = value;
            },
            enumerable: false,
            configurable: true
        });
        Vector3.prototype.toArray = function () {
            return [this._x, this._y, this._z];
        };
        Vector3.prototype.toFloat32Array = function () {
            return new Float32Array(this.toArray());
        };
        return Vector3;
    }());
    TSE.Vector3 = Vector3;
})(TSE || (TSE = {}));
var TSE;
(function (TSE) {
    var AssetManager = /** @class */ (function () {
        function AssetManager() {
        }
        return AssetManager;
    }());
    TSE.AssetManager = AssetManager;
})(TSE || (TSE = {}));
//# sourceMappingURL=main.js.map