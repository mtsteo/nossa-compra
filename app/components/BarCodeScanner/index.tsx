"use client";
import React, { useEffect, useState } from "react";
import Quagga from "@ericblade/quagga2";

interface BarcodeScannerProps {
  setCode: (code: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function BarcodeScanner({
  setCode,
  open,
  setOpen,
}: BarcodeScannerProps) {
  const [zoom, setZoom] = useState(1);
  const [supportsZoom, setSupportsZoom] = useState(false);

  // Verifica suporte a zoom
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const track = stream.getVideoTracks()[0];
      setSupportsZoom("zoom" in track.getCapabilities());
      track.stop();
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    const initQuagga = async () => {
      try {
        await Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              constraints: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: { ideal: "environment" },
                ...(supportsZoom && { advanced: [{ zoom: zoom * 100 }] }),
              },
              target: document.querySelector("#barcode-scanner") as HTMLElement,
            },
            locator: {
              halfSample: true,
              patchSize: "medium",
            },
            numOfWorkers: navigator.hardwareConcurrency || 4,
            decoder: {
              readers: ["code_128_reader", "ean_reader", "ean_8_reader"],
            },
            locate: true,
          },
          (err) => {
            if (err) {
              console.error("Quagga initialization error:", err);
              return;
            }
            Quagga.start();
          }
        );

        Quagga.onDetected((result) => {
          const code = result.codeResult.code;
          setCode(code as string);
          setOpen(false);
        });
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    initQuagga();

    return () => {
      Quagga.stop();
      Quagga.offDetected();
    };
  }, [open, setCode, setOpen, zoom, supportsZoom]);

  if (!open) return null;

  return (
    <div className="relative">
      <div id="barcode-scanner" className="w-full h-80 bg-black" />

      {supportsZoom && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button onClick={() => setZoom((p) => Math.max(1, p - 0.5))}>
            ➖
          </button>
          <span className="text-white">{zoom.toFixed(1)}x</span>
          <button onClick={() => setZoom((p) => Math.min(3, p + 0.5))}>
            ➕
          </button>
        </div>
      )}
    </div>
  );
}
