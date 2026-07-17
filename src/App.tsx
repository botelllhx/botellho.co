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
import ErroDeRota from "./pages/ErroDeRota";
import Admin from "./pages/Admin";
import SlugRedirect from "./system/SlugRedirect";
import { worksLoader, workCaseLoader } from "./pages/workLoaders";

const paginas: RouteRecord[] = [
  { index: true, Component: Home, loader: worksLoader },
  { path: "estudio", Component: Studio },
  { path: "trabalhos", Component: Work, loader: worksLoader },
  { path: "trabalhos/:slug", Component: WorkCase, loader: workCaseLoader },
  { path: "laboratorio", Component: Lab },
  { path: "contato", Component: Contact },
  { path: "admin", Component: Admin },
];

const redirects: RouteRecord[] = [
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
];

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    entry: "src/Layout.tsx",
    // Ultima rede: se o proprio Layout quebrar, ainda sai uma tela digna.
    errorElement: <ErroDeRota />,
    children: [
      // Cada pagina tem o seu errorElement, e nao so o pai: assim uma falha troca
      // apenas o miolo e a navegacao continua de pe. Sem isto, qualquer chunk
      // lazy que nao chega faz o React Router apagar a PAGINA INTEIRA e por no
      // lugar a tela crua "Unexpected Application Error!", que foi o que o Google
      // rastreou e marcou como soft 404.
      ...paginas.map((rota) => ({ ...rota, errorElement: <ErroDeRota /> })),
      ...redirects,
      { path: "*", Component: NotFound },
    ],
  },
];

export default routes;
