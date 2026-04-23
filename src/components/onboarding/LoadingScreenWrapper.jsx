"use client";
import { useState } from "react";
import LoadingScreen from "./LoadingScreen";

export default function LoadingScreenWrapper() {
  const [done, setDone] = useState(false);
  if (done) return null;
  return <LoadingScreen onDone={() => setDone(true)} />;
}