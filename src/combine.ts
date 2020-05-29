import { getCombiner, Combiner } from "./combiners";
import { CombinationParameters } from "./params";

const resizeCanvas = (
  canvas: HTMLCanvasElement,
  images: HTMLImageElement[],
  combiner: Combiner
) => {
  const combinedWidths = images
    .map((i) => i.width)
    .reduce(combiner.widthAccumulator, 0);
  const combinedHeights = images
    .map((i) => i.height)
    .reduce(combiner.heightAccumulator, 0);
  canvas.width = combinedWidths;
  canvas.height = combinedHeights;
};

export const combine = (p: CombinationParameters): Promise<Blob | string> => {
  if (p.imagePaths.length < 2) {
    return Promise.reject("You need to supply at least 2 images to combine");
  }

  const c: HTMLCanvasElement = document.createElement("canvas");
  c.setAttribute("style", "visibility: hidden");
  document.body.appendChild(c);

  const imagePromises = p.imagePaths.map((p) => {
    const imageElement = new Image();

    // It is necessary to restrict CORS request here. Otherwise, we might leak credentials etc.
    // so browsers rightly disallow exporting canvases that could leak information retrieved
    // in such a manner.
    imageElement.crossOrigin = "anonymous";
    return new Promise<HTMLImageElement>((resolve, reject) => {
      imageElement.onload = () => {
        resolve(imageElement);
      };

      imageElement.onerror = () => {
        reject(p);
      };

      if (typeof p === "string") {
        imageElement.src = p;
      } else {
        imageElement.src = URL.createObjectURL(p);
      }
    });
  });

  const context = c.getContext("2d")!;
  const promise = Promise.all(imagePromises)
    .then(
      (imageElements) => {
        const combiner = getCombiner(p.combinerKind);

        resizeCanvas(c, imageElements, combiner);

        let x = 0;
        let y = 0;
        imageElements.forEach((imageElement) => {
          context.drawImage(imageElement, x, y);
          x += combiner.offsetX(imageElement.width);
          y += combiner.offsetY(imageElement.height);
        });

        return new Promise<Blob>((resolve, reject) => {
          // TODO Allow specifying format other than the default (PNG)
          // and use that extension to save the resulting file
          c.toBlob((b: Blob | null) => {
            if (b === null) reject();

            resolve(b!);
          });
        });
      },
      (erroredEntry) => {
        return Promise.reject(erroredEntry);
      }
    )
    .finally(() => {
      document.body.removeChild(c);
    });

  return promise;
};
