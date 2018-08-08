import NProgress from "nprogress";

import routerEvents from "../utils/routerEvents";

export default () => {
  routerEvents.on("routeChangeStart", () => NProgress.start());
  routerEvents.on("routeChangeComplete", () => NProgress.done());
  routerEvents.on("routeChangeError", () => NProgress.done());
};
