namespace TSE {

    export class Engine {
        private _count: number = 0;
        public constructor() {
            console.log("Hello World")
        }

        public start(): void {
            this.loop();
        }
        private loop(): void {
            this._count++;

            document.title = this._count.toString();

            requestAnimationFrame(this.loop.bind(this));

        }
    }
}
window.onload = function () {
    let engine = new TSE.Engine();
    engine.start();
    document.body.innerHTML += "Foo";
}