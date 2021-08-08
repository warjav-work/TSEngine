namespace TSE {

    export class ImageAssetLoader implements IAssetLoader {
        public get supportedExtensions(): string[] {
            return ["png", "gif", "jpg"];
        }


        public loadAsset(assetName: string): void {
            let image: HTMLImageElement = new Image();
            image.onload = this.onImageLoader.bind(this, assetName, image);
            image.src = assetName;
        }

        private onImageLoader(assetName: string, image: HTMLImageElement): void {
            console.log("onImageLoader: assetName/image", assetName, image);
            let asset = new ImageAsset(assetName, image);
            AssetManager.onAssetLoader(asset);
        }

    }
}