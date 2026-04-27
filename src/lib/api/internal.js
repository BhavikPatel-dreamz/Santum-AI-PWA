export async function appFetch(endpoint, options = {}) {
  const response = await fetch(endpoint, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      message: data?.message || "Something went wrong",
      status: response.status,
      data,
    };
  }

  return data;
}
