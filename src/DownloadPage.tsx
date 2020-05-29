import React, { useState, useEffect } from "react";
import qs from "qs";
import { Location } from "history";
import { saveAs } from "file-saver";

import { getCombiner, Combiner } from "./combiners";
import { getParams, CombinationParameters } from "./params";
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

const combine = (p: CombinationParameters): Promise<Blob | string> => {
  if (p.imagePaths.length < 2) {
    return Promise.reject("You need to supply at least 2 images to combine");
  }

  const c: HTMLCanvasElement = document.createElement("canvas");
  c.setAttribute("style", "visibility: hidden");
  document.body.appendChild(c);

  const imagePromises = p.imagePaths.map((p) => {
    const imagePath1 = p;

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
        reject(imageElement);
      };

      imageElement.src = imagePath1;
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
      (anyImageErrored) => anyImageErrored
    )
    .finally(() => {
      document.body.removeChild(c);
    });

  return promise;
};

interface DownloadPageProps {
  location: Location;
}

const DownloadPage = (p: DownloadPageProps) => {
  const q = qs.parse(p.location.search, { ignoreQueryPrefix: true });
  const params = getParams(q);

  const [fallback, setFallback] = useState<Blob | null>(null);

  useEffect(() => {
    combine(params).then(
      (success) => {
        saveAs(success, "combined.png");
        setFallback(success as Blob);
      },
      (failure) => {
        // TODO: React to img 404, 500 etc. appropriately.
        console.log(failure);
      }
    );
  }, []);

  return (
    <>
      <div>Download started...</div>
      {fallback !== null && (
        <a download="combined.png" href={URL.createObjectURL(fallback)}>
          Didn't work? Try this direct link instead.
        </a>
      )}
      <a href="/">What is this?</a>
    </>
  );
};

export default DownloadPage;
