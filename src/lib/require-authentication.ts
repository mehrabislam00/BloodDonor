"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/lib/toast";

export async function requireAuthentication(message: string): Promise<boolean> {
  try {
    const { data, error } = await authClient.getSession();

    if (data?.user) return true;

    if (error && error.status !== 401) {
      toast.error("Unable to verify your login. Please try again.");
      return false;
    }

    toast.warning(message);
    return false;
  } catch {
    toast.error("Unable to verify your login. Please try again.");
    return false;
  }
}
