"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";

// ⭐ Estrelas
function Estrelas({ nota, setNota, readOnly = false }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const valor = i + 1;
        const ativa =
          hover !== null ? valor <= hover : valor <= nota;

        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && setNota(valor)}
            onMouseEnter={() => !readOnly && setHover(valor)}
            onMouseLeave={() => !readOnly && setHover(null)}
            className={`
              p-1 rounded-md transition
              ${readOnly ? "cursor-default" : "cursor-pointer hover:bg-slate-700"}
            `}
            aria-label={`Nota ${valor}`}
          >
            <Star
              size={20}
              className={
                ativa
                  ? "fill-yellow-400 text-yellow-400 transition"
                  : "text-slate-500 transition"
              }
            />
          </button>
        );
      })}

      {!readOnly && (
        <span className="ml-2 text-sm text-slate-400">
          {hover ?? nota}/5
        </span>
      )}
    </div>
  );
}


export default function JogoDetalhe() {
  const { id } = useParams();
  const [jogo, setJogo] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [nota, setNota] = useState(5);

  const usuarioLogado =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("usuario"))
      : null;

  useEffect(() => {
    fetch(`http://localhost:8000/api/jogo/${id}/`)
      .then((r) => r.json())
      .then(setJogo);

    fetch(`http://localhost:8000/api/jogo/${id}/comentarios/`)
      .then((r) => r.json())
      .then(setComentarios);
  }, [id]);

  const mediaNota = useMemo(() => {
    if (!comentarios.length) return null;
    const soma = comentarios.reduce((a, c) => a + c.nota, 0);
    return (soma / comentarios.length).toFixed(1);
  }, [comentarios]);

  const enviarComentario = async () => {
    if (!novoComentario || !usuarioLogado) return;

    const res = await fetch(
      "http://localhost:8000/api/jogo/comentarios/criar/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioLogado.id,
          jogo_id: id,
          texto: novoComentario,
          nota,
        }),
      }
    );

    const data = await res.json();
    setComentarios([...comentarios, data]);
    setNovoComentario("");
    setNota(5);
  };

  if (!jogo)
    return <p className="text-white p-8">Carregando...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <section className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Voltar */}
        <a
          href="/dashboard"
          className="inline-block px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition font-semibold"
        >
          ← Voltar ao Dashboard
        </a>

        {/* Card do jogo */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
          <h1 className="text-4xl font-bold">{jogo.titulo}</h1>

          <p className="text-slate-300 leading-relaxed">
            {jogo.descricao}
          </p>

          <div className="flex gap-6 text-sm text-slate-400">
            <span>
              Gênero:{" "}
              <span className="text-white font-semibold">
                {jogo.genero}
              </span>
            </span>
            <span>
              Ano:{" "}
              <span className="text-white font-semibold">
                {jogo.ano}
              </span>
            </span>
          </div>

          {/* Média */}
          {mediaNota ? (
            <div className="flex items-center gap-3">
              <Estrelas
                nota={Math.round(mediaNota)}
                readOnly
              />
              <span className="text-slate-300 text-sm">
                {mediaNota}/5 · {comentarios.length} avaliações
              </span>
            </div>
          ) : (
            <p className="text-slate-500">
              Sem avaliações ainda
            </p>
          )}
        </div>

        {/* Comentário */}
        {usuarioLogado && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold">
              Deixe sua avaliação
            </h2>

            <textarea
              className="w-full p-4 rounded-lg bg-slate-900 border border-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Escreva seu comentário..."
              value={novoComentario}
              onChange={(e) =>
                setNovoComentario(e.target.value)
              }
            />

            <div className="flex items-center gap-4">
              <Estrelas nota={nota} setNota={setNota} />

              <button
                onClick={enviarComentario}
                className="ml-auto px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold transition"
              >
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* Comentários */}
        {comentarios.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Comentários
            </h2>

            {comentarios.map((c) => (
              <div
                key={c.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4"
              >
                <p className="font-semibold">{c.usuario}</p>
                <p className="text-slate-300">
                  {c.texto}
                </p>
                <Estrelas nota={c.nota} readOnly />
                <p className="text-xs text-slate-500 mt-1">
                  {c.criado_em}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
