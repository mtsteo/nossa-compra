"use client";
import React, { useEffect } from "react";
import Quagga from "@ericblade/quagga2";

interface BarcodeScannerProps {
  setCode: (code: string | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function BarcodeScanner({
  setCode,
  open,
  setOpen,
}: BarcodeScannerProps) {
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
              },
              target: document.querySelector("#barcode-scanner") as HTMLElement,
            },
            locator: {
              halfSample: true,
              patchSize: "large",
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
          setCode(code);
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
  }, [open, setCode, setOpen]);

  if (!open) return null;

  return (
    <div className="relative">
      <div
        id="barcode-scanner"
        className="w-full h-80 bg-black rounded-lg overflow-hidden"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white bg-black bg-opacity-50 p-2 rounded">
          Aponte para o código de barras
        </p>
      </div>
    </div>
  );
}
