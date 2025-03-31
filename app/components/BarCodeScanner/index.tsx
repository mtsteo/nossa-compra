"use client";
import React, { useEffect, useState } from "react";
import Quagga from "quagga";

const PREFIX = "BarcodeScanner";

export function BarcodeScanner({ setCode, open, setOpen }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment",
          },
          target: document.querySelector("#barcode-scanner"),
        },
        locator: {
          halfSample: true,
          patchSize: "large", // x-small, small, medium, large, x-large
        },
        numOfWorkers: navigator.hardwareConcurrency,
        decoder: {
          readers: ["code_39_reader", "code_128_reader", "ean_reader"],
        },
        locate: true,
        multiple: false,
        frequency: 10,
      },
      (err: any) => {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
        return () => {
          Quagga.stop();
        };
      }
    );

    setTimeout(() => {
      setLoading(false);
    }, 500);

    Quagga.onProcessed((result: any) => {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            Number(drawingCanvas.getAttribute("width")),
            Number(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter((box: any) => {
              return box !== result.box;
            })
            .forEach((box: any) => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "#E0E0E0",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    Quagga.onDetected((result: any) => {
      setCode(result.codeResult.code);
      setOpen(false);
      Quagga.offDetected();
      Quagga.offProcessed();
      Quagga.stop();
    });
  }, [setCode, setOpen]);

  useEffect(() => {
    if (!open) {
      Quagga.offDetected();
      Quagga.offProcessed();
      Quagga.stop();
    }
  }, [open]);

  return <div className="h-80" id="barcode-scanner"></div>;
}
