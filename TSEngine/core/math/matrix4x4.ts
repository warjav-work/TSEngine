namespace TSE {
    export class Matrix4x4 {
        private _data: number[] = [];

        private constructor() {
            this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }

        public get data(): number[] {
            return this._data;
        }

        public static identity(): Matrix4x4 {
            return new Matrix4x4();
        }

        public static orthograthic(left: number, rigth: number, bottom: number, top: number, nearClip: number, farClip: number): Matrix4x4{
            let matrix = new Matrix4x4();

            let lr: number = 1.0 / (left - rigth);
            let bt: number = 1.0 / (bottom - top);
            let nf = 1.0 / (nearClip - farClip);

            matrix._data[0] = -2.0 * lr;

            matrix._data[5] = -2.0 * bt;

            matrix._data[10] = 2.0 * nf;

            matrix.data[12] = (left + rigth) * lr;
            matrix.data[13] = (top + bottom) * bt;
            matrix.data[14] = (farClip + nearClip) * nf;

            return matrix;
        }

        public static translation(position: Vector3): Matrix4x4 {
            let matrix = new Matrix4x4();
            matrix.data[12] = position.x;
            matrix.data[13] = position.y;
            matrix.data[14] = position.z;

            return matrix;

        }
    }
}