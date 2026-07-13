import { Navigate, useParams } from "react-router-dom";

// Redireciona /base/:slug preservando o slug (rotas EN antigas -> PT).
const SlugRedirect = ({ base }: { base: string }) => {
  const { slug } = useParams();
  return <Navigate to={slug ? `${base}/${slug}` : base} replace />;
};

export default SlugRedirect;
