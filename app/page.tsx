"use client";
import { useCallback, useEffect, useState } from "react";
import { BarcodeScanner } from "./components/BarCodeScanner";
import Quagga from "@ericblade/quagga2";

export default function Home() {
  const [code, setCode] = useState("");
  const [openBarcodeReader, setOpenBarcodeReader] = useState(false);
  const [cameras, setCameras] = useState([] as any); // array of available cameras, as returned by Quagga.CameraAccess.enumerateVideoDevices()
  const [torchOn, setTorch] = useState(false);

  const handleOpenBarcodeReader = () => {
    setOpenBarcodeReader(true);
  };

  useEffect(() => {
    const enableCamera = async () => {
      try {
        await Quagga.CameraAccess.request(null, {});
        const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
        console.log("Cameras Detected: ", cameras);
        setCameras(cameras);
        await Quagga.CameraAccess.disableTorch(); // disable torch at start, in case it was enabled before and we hot-reloaded
      } catch (err) {
        console.log(err);
      }
    };

    const disableCamera = () => {
      Quagga.CameraAccess.release().catch((err) => console.log(err));
    };

    enableCamera();

    return () => {
      disableCamera();
    };
  }, []);

  const onTorchClick = useCallback(() => {
    const torch = !torchOn;
    setTorch(torch);
    if (torch) {
      Quagga.CameraAccess.enableTorch();
    } else {
      Quagga.CameraAccess.disableTorch();
    }
  }, [torchOn, setTorch]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <BarcodeScanner
          open={openBarcodeReader}
          setOpen={setOpenBarcodeReader}
          setCode={setCode}
        />
        <h1>{code}</h1>
        <button onClick={onTorchClick}>
          {torchOn ? "Disable Torch" : "Enable Torch"}
        </button>

        <button onClick={handleOpenBarcodeReader}>Scannear</button>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
