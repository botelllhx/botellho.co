import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";

// 404 na voz DOS: humor seco e saida clara. O Ban entra aqui no P3.
const NotFound = () => {
  return (
    <>
      <Head>
        <title>Erro 404 | botellho</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section className="flex min-h-[60vh] flex-col justify-center px-4 md:px-6">
        <p className="type-dos text-phosphor">&gt; erro 404 · rota não encontrada</p>
        <h1 className="type-tese mt-6 max-w-3xl">Esse comando não existe.</h1>
        <p className="mt-6 max-w-md font-sans text-base text-muted-foreground">
          A rota digitada não roda neste terminal. Verifique o endereço ou volte
          pro início.
        </p>
        <Link to="/" className="cmd-button mt-10 self-start">
          Voltar pra home
        </Link>
      </section>
    </>
  );
};

export default NotFound;
