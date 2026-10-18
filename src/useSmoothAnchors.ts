import { useEffect } from "react";
import { installSmoothAnchors } from "./smoothAnchors";

export function useSmoothAnchors() {
  useEffect(installSmoothAnchors, []);
}
