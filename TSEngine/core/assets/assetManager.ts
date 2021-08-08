namespace TSE {

    export const MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED::";

    export class AssetManager {

        private static _loaders: IAssetLoader[] = [];
        private static _loaderAssets: { [name: string]: IAsset } = {};

        private constructor() {

        }

        public static initialize(): void {
            AssetManager._loaders.push(new ImageAssetLoader());
        }

        public static registrerLoader(loader: IAssetLoader): void {
            AssetManager._loaders.push(loader);
        }

        public static onAssetLoader(asset: IAsset): void {
            AssetManager._loaderAssets[asset.name] = asset;
            Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
        }

        public static loadAsset(assetName: string): void {
            let extension = assetName.split('.').pop().toLocaleLowerCase();
            for (let loader of AssetManager._loaders) {
                if (loader.supportedExtensions.indexOf(extension) !== -1) {
                    loader.loadAsset(assetName);
                    return;
                }
            }

            console.warn("Unable to load asset with extension " + extension + " because there is no loader associated with it.");
        }

        public static isAssetLoader(assetName: string): boolean {
            return AssetManager._loaderAssets[assetName] !== null && AssetManager._loaderAssets[assetName] !== undefined;
        }

        public static getAsset(assetName: string): IAsset {
            if (this.isAssetLoader) {
                return AssetManager._loaderAssets[assetName]

            } else {
                AssetManager.loadAsset(assetName);
            }
            return undefined;
        }
    }
}