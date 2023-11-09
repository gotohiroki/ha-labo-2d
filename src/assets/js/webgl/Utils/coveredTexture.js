// このコードは、テクスチャを画面にフィットするスケールで表示するための関数を提供しています。

// calcCoveredTextureScale 関数:
// 引数 texture は対象のテクスチャです。
// 引数 aspect は画面のアスペクト比を表します。
// 引数 target は結果を格納するためのオプションのベクトルです。

// この関数は、テクスチャのアスペクト比 (imageAspect) と画面のアスペクト比 (aspect) を比較し、テクスチャの幅 (x) と高さ (y) のスケールを計算します。もし aspect が imageAspect より小さい場合、テクスチャの高さを 1 に固定し、幅を調整します。それ以外の場合は、幅を 1 に固定し、高さを調整します。最終的なスケールが [x, y] に設定され、target にセットされることがあります。この関数は最終的なスケール [x, y] を返します。

export function calcCoveredTextureScale(texture, aspect, target) {
  const imageAspect = texture.image.width / texture.image.height;
  const [x, y] = aspect < imageAspect ? [aspect / imageAspect, 1] : [1, imageAspect / aspect];
  target?.set(x, y);
  return [x, y];
}

// coveredTexture 関数:
// 引数 texture は処理対象のテクスチャです。
// 引数 screenAspect は画面のアスペクト比を表します。

// この関数は、テクスチャを画面にフィットさせるためにテクスチャの行列を設定します。最初に、texture.matrixAutoUpdate を false に設定してテクスチャの行列更新を停止します。次に、テクスチャのスケールを calcCoveredTextureScale 関数を使用して計算し、その結果 [x, y] を取得します。最後に、texture.matrix.setUvTransform を使用して、テクスチャのスケールとオフセットを設定し、フィットさせたテクスチャを得ます。最終的に、処理後のテクスチャが返されます。

export function coveredTexture(texture, screenAspect) {
  texture.matrixAutoUpdate = false;
  const [x, y] = calcCoveredTextureScale(texture, screenAspect);
  texture.matrix.setUvTransform(0, 0, x, y, 0, 0.5, 0.5);
  return texture;
}