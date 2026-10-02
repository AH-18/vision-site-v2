"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The brand questionnaire now lives inline on the Profile page under
// "My Identity" instead of its own stepper flow. This route is kept only so
// any stale link bounces somewhere sensible instead of 404ing.
export default function ProfileSetupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile");
  }, [router]);

  return null;
}
