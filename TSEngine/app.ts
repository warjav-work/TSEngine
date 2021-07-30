namespace TSE {

    export class Engine {
        public constructor() {
            console.log("Hello World")
        }

        public start(): void {

        }
    }
}
window.onload = function () {
    let engine = new TSE.Engine();
    document.body.innerHTML += "Foo";
}