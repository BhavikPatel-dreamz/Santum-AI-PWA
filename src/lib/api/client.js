export async function apiFetch(endpoint, options = {}) {
  const BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL;
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw {
        message: data?.message || "Something went wrong",
        status: res.status,
        data,
      };
    }

    return data;
  } catch (error) {
    throw error;
  }
}
