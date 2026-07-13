import { Head } from "vite-react-ssg";
import { Link } from "react-router-dom";

// 404: perda de sinal. Ruido/scanline dithered + o Ban confuso, voz DOS.
const NotFound = () => {
  return (
    <>
      <Head>
        <title>Erro 404 | botellho</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section className="dark bg-background px-4 py-16 text-foreground md:px-6 md:py-20">
        <p className="type-dos text-phosphor">&gt; erro 404 · rota não encontrada</p>

        <div className="mt-8 crt-frame flex aspect-[16/9] items-center justify-center" data-cursor="3d">
          <div className="static-noise" />
          <img
            src="/ban/ban-1.png"
            alt="Ban, confuso"
            className="relative z-10 h-40 w-40 object-contain md:h-56 md:w-56"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="crt-frame__glass" />
          <span className="crt-frame__tag type-label">sem sinal</span>
        </div>

        <h1 className="type-tese mt-10 max-w-3xl">Esse comando não existe.</h1>
        <p className="mt-6 max-w-md font-sans text-base text-muted-foreground">
          A rota digitada não roda neste terminal. Verifique o endereço ou volte
          pro início.
        </p>
        <Link to="/" className="cmd-button mt-10 inline-flex">Voltar pra home</Link>
      </section>
    </>
  );
};

export default NotFound;
