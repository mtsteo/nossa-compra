"use client";
import { useState } from "react";
import { BarcodeScanner } from "./components/BarCodeScanner";

export default function Home() {
  const [code, setCode] = useState("");
  const [openBarcodeReader, setOpenBarcodeReader] = useState(false);

  const handleOpenBarcodeReader = () => {
    console.log("first");
    setOpenBarcodeReader(true);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <BarcodeScanner
          open={true}
          setOpen={setOpenBarcodeReader}
          setCode={setCode}
        />
        <h1>{code}</h1>
        <button onClick={() => handleOpenBarcodeReader()}>Scannear</button>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
