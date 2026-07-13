import type { RouteRecord } from "vite-react-ssg";
import Layout from "./Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Studio from "./pages/Studio";
import Admin from "./pages/Admin";
// @ts-expect-error legacy .jsx sem tipos
import BlogPage from "./pages/legacy/BlogPage";
// @ts-expect-error legacy .jsx sem tipos
import BlogPostPage from "./pages/legacy/BlogPostPage";
// @ts-expect-error legacy .jsx sem tipos
import ServicePage from "./pages/legacy/ServicePage";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    entry: "src/Layout.tsx",
    children: [
      { index: true, Component: Index },
      { path: "studio", Component: Studio },
      { path: "admin", Component: Admin },

      // Rotas legadas (serao migradas em itens seguintes do backlog)
      { path: "blog", Component: BlogPage },
      { path: "blog/:slug", Component: BlogPostPage },
      { path: "services/:slug", Component: ServicePage },

      { path: "*", Component: NotFound },
    ],
  },
];

export default routes;
