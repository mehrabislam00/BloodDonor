"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/toast/ui/toast";

export default function AdminLoginSuccessToast() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") !== "success") return;

    toast.success({
      title: "Admin sign in successful",
      description: "Welcome to the admin dashboard.",
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  return null;
}
