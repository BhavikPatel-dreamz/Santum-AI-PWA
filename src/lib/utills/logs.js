export default function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div className="m-2 text-sm text-red-700">
      {/* <span className="mt-[2px] text-red-500">⚠️</span> */}
      <p className="leading-snug">{error}</p>
    </div>
  );
}

export function SuccessMessage({ message }) {
  if (!error) return null;

  return (
    <div className="mt-2 flex items-start gap-2 rounded-lg border border-[#00D061]/30 bg-[#00D061]/10 px-3 py-2 text-sm text-[#00A653] shadow-sm">
      <span className="mt-[2px]">⚠️</span>
      <p className="leading-snug">{message}</p>
    </div>
  );
}
