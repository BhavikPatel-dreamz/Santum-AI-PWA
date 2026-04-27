export const OTP_PHONE_STORAGE_KEY = "pendingOtpPhone";

export function normalizePhoneNumber(phone = "") {
  const cleanedPhone = String(phone).trim().replace(/[^\d+]/g, "");

  if (!cleanedPhone) {
    return "";
  }

  if (cleanedPhone.startsWith("+")) {
    return `+${cleanedPhone.slice(1).replace(/\+/g, "")}`;
  }

  return cleanedPhone.replace(/\+/g, "");
}

export function maskPhoneNumber(phone = "", dialCode = "") {
  const normalizedPhone = normalizePhoneNumber(phone);
  const normalizedDialCode = normalizePhoneNumber(dialCode);

  if (!normalizedPhone) {
    return "";
  }

  const phoneDigits = normalizedPhone.replace(/\D/g, "");
  const dialCodeDigits = normalizedDialCode.replace(/\D/g, "");
  const localDigits =
    dialCodeDigits && phoneDigits.startsWith(dialCodeDigits)
      ? phoneDigits.slice(dialCodeDigits.length)
      : phoneDigits;
  const visiblePrefix = normalizedDialCode || (normalizedPhone.startsWith("+") ? "+" : "");

  if (localDigits.length <= 2) {
    return [visiblePrefix, localDigits].filter(Boolean).join(" ").trim();
  }

  const maskedLocalDigits = `${"*".repeat(localDigits.length - 2)}${localDigits.slice(-2)}`;

  return [visiblePrefix, maskedLocalDigits].filter(Boolean).join(" ").trim();
}

