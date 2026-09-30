import { createServerFn } from "@tanstack/react-start";

export const getSiteOrigin = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getRequestUrl } = await import("@tanstack/start-server-core");
    return new URL(getRequestUrl()).origin;
  } catch {
    return "";
  }
});

export const legacyView = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getRequestUrl } = await import("@tanstack/start-server-core");
    const view = new URL(getRequestUrl()).searchParams.get("view");
    return view === "reviews" || view === "examples" ? view : "";
  } catch {
    return "";
  }
});
