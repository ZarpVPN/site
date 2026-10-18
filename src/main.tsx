import "./styles.scss";
import { initClient } from "./client";

if (import.meta.env.DEV) {
  void import("./hydrateDev").then(({ hydrateDev }) => hydrateDev());
} else {
  initClient();
}
