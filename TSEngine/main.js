var TSE;
(function (TSE) {
    var Engine = /** @class */ (function () {
        function Engine() {
            console.log("Hello World");
        }
        return Engine;
    }());
    TSE.Engine = Engine;
})(TSE || (TSE = {}));
window.onload = function () {
    var engine = new TSE.Engine();
    document.body.innerHTML += "Foo";
};
//# sourceMappingURL=main.js.map