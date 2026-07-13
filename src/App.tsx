import type { RouteRecord } from "vite-react-ssg";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Studio from "./pages/Studio";
import Work from "./pages/Work";
import WorkCase from "./pages/WorkCase";
import Lab from "./pages/Lab";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { worksLoader, workCaseLoader } from "./pages/workLoaders";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    entry: "src/Layout.tsx",
    children: [
      { index: true, Component: Home },
      { path: "studio", Component: Studio },
      { path: "work", Component: Work, loader: worksLoader },
      { path: "work/:slug", Component: WorkCase, loader: workCaseLoader },
      { path: "lab", Component: Lab },
      { path: "contact", Component: Contact },
      { path: "admin", Component: Admin },

      // Legado -> novo (redirect client-side no GitHub Pages)
      { path: "blog", element: <Navigate to="/lab" replace /> },
      { path: "blog/:slug", element: <Navigate to="/lab" replace /> },
      { path: "services/:slug", element: <Navigate to="/studio" replace /> },

      { path: "*", Component: NotFound },
    ],
  },
];

export default routes;
