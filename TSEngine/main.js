var TSE;
(function (TSE) {
    var Engine = /** @class */ (function () {
        function Engine() {
            this._count = 0;
            console.log("Hello World");
        }
        Engine.prototype.start = function () {
            this.loop();
        };
        Engine.prototype.loop = function () {
            this._count++;
            document.title = this._count.toString();
            requestAnimationFrame(this.loop.bind(this));
        };
        return Engine;
    }());
    TSE.Engine = Engine;
})(TSE || (TSE = {}));
window.onload = function () {
    var engine = new TSE.Engine();
    engine.start();
    document.body.innerHTML += "Foo";
};
//# sourceMappingURL=main.js.map