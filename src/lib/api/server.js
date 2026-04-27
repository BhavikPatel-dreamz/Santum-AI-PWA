import { NextResponse } from "next/server";
import { apiFetch } from "./client";
import { getAuthToken } from "../auth/session";

export function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.data?.message ||
    error?.data?.data?.message ||
    error?.message ||
    fallback
  );
}

export function createErrorResponse(error, fallback) {
  const status = Number.isInteger(error?.status) ? error.status : 500;
  return NextResponse.json(
    { message: getErrorMessage(error, fallback) },
    { status },
  );
}

export function assertApiSuccess(data, fallbackMessage) {
  if (data?.success === false) {
    throw {
      status: 400,
      message: data?.data?.message || data?.message || fallbackMessage,
      data,
    };
  }

  return data;
}

export async function apiFetchWithAuth(endpoint, options = {}) {
  const token = await getAuthToken();

  if (!token) {
    throw { status: 401, message: "Unauthorized" };
  }

  const headers = new Headers(options.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);

  return apiFetch(endpoint, {
    ...options,
    headers,
  });
}
