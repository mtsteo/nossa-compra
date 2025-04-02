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
                facingMode: { ideal: "user" },
              },
              target: document.querySelector("#barcode-scanner") as HTMLElement,
            },
            locator: {
              halfSample: true,
              patchSize: "medium",
              willReadFrequently: true,
            },
            numOfWorkers: navigator.hardwareConcurrency || 4,
            decoder: {
              readers: ["ean_reader"],
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
  }, [open, setCode, setOpen]);

  if (!open) return null;

  return (
    <div className="relative">
      <div id="barcode-scanner" className="w-full h-80 bg-black" />
    </div>
  );
}
