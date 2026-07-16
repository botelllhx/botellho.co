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
import BanTest from "./pages/BanTest";
import SlugRedirect from "./system/SlugRedirect";
import { worksLoader, workCaseLoader } from "./pages/workLoaders";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    entry: "src/Layout.tsx",
    children: [
      { index: true, Component: Home, loader: worksLoader },
      { path: "estudio", Component: Studio },
      { path: "trabalhos", Component: Work, loader: worksLoader },
      { path: "trabalhos/:slug", Component: WorkCase, loader: workCaseLoader },
      { path: "laboratorio", Component: Lab },
      { path: "contato", Component: Contact },
      { path: "admin", Component: Admin },
      // diagnostico temporario do rig do Ban (cena pelada, sem efeitos)
      { path: "bantest", Component: BanTest },

      // Slugs EN antigos -> PT
      { path: "studio", element: <Navigate to="/estudio" replace /> },
      { path: "work", element: <Navigate to="/trabalhos" replace /> },
      { path: "work/:slug", element: <SlugRedirect base="/trabalhos" /> },
      { path: "lab", element: <Navigate to="/laboratorio" replace /> },
      { path: "contact", element: <Navigate to="/contato" replace /> },

      // Legado WordPress
      { path: "blog", element: <Navigate to="/laboratorio" replace /> },
      { path: "blog/:slug", element: <Navigate to="/laboratorio" replace /> },
      { path: "services/:slug", element: <Navigate to="/estudio" replace /> },

      { path: "*", Component: NotFound },
    ],
  },
];

export default routes;
