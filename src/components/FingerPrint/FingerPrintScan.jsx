"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function FingerPrintScan() {
  const router = useRouter();
  const [scanState, setScanState] = useState("idle");
  const [scanProgress, setScanProgress] = useState(0);

  // Simulate scanning animation when in "scanning" state
  useEffect(() => {
    if (scanState !== "scanning") return;

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanState("success");
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [scanState]);

  const handleScannerPress = () => {
    if (scanState === "idle" || scanState === "error") {
      setScanState("scanning");
    }
  };

  const handleContinue = () => {
    if (scanState === "success") {
      router.push("/language"); // adjust route as needed
    } else {
      setScanState("scanning");
    }
  };

  const fingerSrc =
    scanState === "success"
      ? "/icons/finger-print-img-green.png"
      : scanState === "scanning"
        ? "/icons/finger-print-img-green.png"
        : "/icons/finger-print-img-black.png";

  const scanLineColor =
    scanState === "success" ? "#23cf67" : scanState === "error" ? "#ef4444" : "#23cf67";

  return (
    <>
      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; opacity: 1; }
          48%  { top: 100%; opacity: 1; }
          50%  { top: 100%; opacity: 0; }
          51%  { top: 0%; opacity: 0; }
          52%  { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 1; }
        }
        @keyframes cornerPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes successPulse {
          0%   { transform: scale(1);    opacity: 1; }
          50%  { transform: scale(1.08); opacity: 0.85; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scan-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, ${scanLineColor} 20%, ${scanLineColor} 80%, transparent 100%);
          animation: scanLine 1.8s linear infinite;
          box-shadow: 0 0 8px 2px ${scanLineColor}66;
        }
        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          animation: cornerPulse 1.2s ease-in-out infinite;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 2.5px solid; border-left: 2.5px solid; border-radius: 4px 0 0 0; }
        .corner-tr { top: -1px; right: -1px; border-top: 2.5px solid; border-right: 2.5px solid; border-radius: 0 4px 0 0; }
        .corner-bl { bottom: -1px; left: -1px; border-bottom: 2.5px solid; border-left: 2.5px solid; border-radius: 0 0 0 4px; }
        .corner-br { bottom: -1px; right: -1px; border-bottom: 2.5px solid; border-right: 2.5px solid; border-radius: 0 0 4px 0; }
        .success-img { animation: successPulse 1.4s ease-in-out infinite; }
        .fade-up { animation: fadeSlideUp 0.5s ease both; }
      `}</style>

      <div className="min-h-dvh bg-white">
        <div className="mx-auto flex min-h-dvh w-full max-w-[600px] flex-col bg-white">
          <header className="relative h-[120px] overflow-hidden bg-[#23cf67] px-5 pt-6">
            <Image
              src="/icons/let-you-screen-main-img.jpg"
              alt=""
              width={480}
              height={108}
              priority
              unoptimized
              sizes="(max-width: 480px) 100vw, 480px"
              className="absolute inset-0 top-0 w-[60%] mx-auto object-cover"
            />

            <div className="relative z-10 flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="Go back"
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/80 bg-white/10 text-white transition-colors hover:bg-white/15"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                  <line x1="9" y1="12" x2="20" y2="12" />
                </svg>
              </button>
              <h1 className="text-[18px] font-medium leading-6 text-white">
                Create New PIN
              </h1>
            </div>
          </header>

          <section className="relative -mt-10 flex flex-1 flex-col rounded-t-[32px] bg-white pb-10 pt-3">
            {/* ── Subtitle ── */}
            <div className="px-6 pt-5 pb-2">
              <p className="text-[18px] leading-6 text-[#555] text-center font-satoshi">
                Add a PIN Number to make your account more secure.
              </p>
            </div>

            {/* ── Scanner area ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
              {/* Scanner box */}
              <button
                type="button"
                onClick={handleScannerPress}
                aria-label="Tap to scan fingerprint"
                className="relative outline-none focus:outline-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {/* Outer glow when scanning/success */}
                {(scanState === "scanning" || scanState === "success") && (
                  <div
                    className="absolute inset-[-12px] rounded-[24px] pointer-events-none"
                    style={{
                      background:
                        scanState === "success"
                          ? "radial-gradient(ellipse at center, #23cf6722 0%, transparent 70%)"
                          : "radial-gradient(ellipse at center, #23cf6715 0%, transparent 70%)",
                      transition: "background 0.4s",
                    }}
                  />
                )}

                {/* Scanner frame */}
                <div
                  className="relative overflow-hidden rounded-[16px]"
                  style={{
                    width: 210,
                    height: 210,
                    background:
                      scanState === "success"
                        ? "linear-gradient(145deg, #f0fef5 0%, #e6faf0 100%)"
                        : "linear-gradient(145deg, #f8f8f8 0%, #f0f0f0 100%)",
                    transition: "background 0.4s",
                  }}
                >
                  {/* Corner brackets */}
                  {["tl", "tr", "bl", "br"].map((c) => (
                    <div
                      key={c}
                      className={`corner corner-${c}`}
                      style={{ borderColor: scanState === "success" ? "#23cf67" : "#23cf67aa" }}
                    />
                  ))}

                  {/* Scan line — only while scanning */}
                  {scanState === "scanning" && <div className="scan-line" />}

                  {/* Progress fill overlay */}
                  {scanState === "scanning" && (
                    <div
                      className="absolute left-0 right-0 bottom-0 pointer-events-none transition-all"
                      style={{
                        height: `${scanProgress}%`,
                        background: "linear-gradient(0deg, #23cf6718 0%, transparent 100%)",
                      }}
                    />
                  )}

                  {/* Fingerprint image */}
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <div className={scanState === "success" ? "success-img" : ""} style={{ width: 130, height: 130, position: "relative" }}>
                      <Image
                        src={fingerSrc}
                        alt="Fingerprint"
                        fill
                        sizes="130px"
                        className="object-contain"
                        style={{
                          filter:
                            scanState === "idle"
                              ? "none"
                              : scanState === "scanning"
                                ? "drop-shadow(0 0 6px #23cf6766)"
                                : scanState === "success"
                                  ? "drop-shadow(0 0 10px #23cf67aa)"
                                  : "drop-shadow(0 0 6px #ef444466)",
                          transition: "filter 0.3s",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </button>

              {/* Status text */}
              <p
                key={scanState}
                className="fade-up text-center text-[13.5px] leading-5 px-4"
                style={{
                  color:
                    scanState === "success"
                      ? "#16a34a"
                      : scanState === "error"
                        ? "#ef4444"
                        : "#444",
                }}
              >
                {scanState === "idle" &&
                  "Please put your finger on the finger print scanner to get started."}
                {scanState === "scanning" && "Scanning… keep your finger steady."}
                {scanState === "success" && "Fingerprint registered successfully!"}
                {scanState === "error" && "Scan failed. Tap the scanner to try again."}
              </p>
            </div>

            {/* ── Bottom actions ── */}

            <div className="px-6 pb-10 flex flex-col gap-4">
              <button
                type="button"
                onClick={handleContinue}
                className="mt-8 mx-auto w-full max-w-[343px] py-4 rounded-[14px] text-white text-[18px] font-semibold tracking-wide transition-all duration-200"
                style={{
                  background:
                    scanState === "success"
                      ? "linear-gradient(135deg, #23cf67 0%, #1ab856 100%)"
                      : "linear-gradient(135deg, #23cf67 0%, #1fc45e 100%)",
                  boxShadow: "0 4px 20px #23cf6740",
                }}
              >
                Continue
              </button>

              <button
                type="button"
                onClick={() => router.push("/language")}
                className="w-full text-center text-[18px] font-medium leading-6 text-[#0F0F0F] font-poppins py-1 transition-opacity active:opacity-60"
              >
                Skip, I&apos;ll do this later
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}