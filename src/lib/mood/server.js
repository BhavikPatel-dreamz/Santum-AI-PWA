import {
  resolveCurrentUserKey,
} from "@/lib/user/server";

export async function resolveMoodUserKey() {
  return resolveCurrentUserKey();
}
