export const OFFLINE_ERROR_MESSAGE =
  "No internet connection. Please reconnect and try again.";

export function isUnauthorizedError(error) {
  return error?.status === 401 || error?.originalStatus === 401;
}

export function isOfflineError(error) {
  return (
    error?.data?.offline === true ||
    error?.error === "OFFLINE" ||
    error?.message === OFFLINE_ERROR_MESSAGE
  );
}

export function getClientErrorMessage(
  error,
  fallback = "Something went wrong",
) {
  if (isOfflineError(error)) {
    return OFFLINE_ERROR_MESSAGE;
  }

  return error?.message || error?.data?.message || error?.error || fallback;
}
