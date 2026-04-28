export function isUnauthorizedError(error) {
  return error?.status === 401 || error?.originalStatus === 401;
}

export function getClientErrorMessage(
  error,
  fallback = "Something went wrong",
) {
  return error?.message || error?.data?.message || error?.error || fallback;
}
