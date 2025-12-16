"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";

// Componente de estrelas
function Estrelas({ nota, setNota, readOnly = false }) {
  const total = 5;

  return (
    <div className="flex gap-1">
      {[...Array(total)].map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && setNota(i + 1)}
          className={`text-2xl ${
            i < nota ? "text-yellow-400" : "text-gray-500"
          }`}
        >
          ★
        </button>
      ))}
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
    const fetchJogo = async () => {
      const res = await fetch(`http://localhost:8000/api/jogo/${id}/`);
      const data = await res.json();
      setJogo(data);
    };

    const fetchComentarios = async () => {
      const res = await fetch(
        `http://localhost:8000/api/jogo/${id}/comentarios/`
      );
      const data = await res.json();
      setComentarios(data);
    };

    fetchJogo();
    fetchComentarios();
  }, [id]);

  // 🔹 cálculo correto da média
  const mediaNota = useMemo(() => {
    if (comentarios.length === 0) return null;
    const soma = comentarios.reduce((acc, c) => acc + c.nota, 0);
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

  if (!jogo) return <p className="text-white p-8">Carregando...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <a
          href="/dashboard"
          className="inline-block mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
        >
          ← Voltar para Dashboard
        </a>

        <h1 className="text-4xl font-bold">{jogo.titulo}</h1>
        <p className="text-gray-300">{jogo.descricao}</p>

        <p className="text-sm text-gray-400">
          Gênero: <span className="text-white">{jogo.genero}</span>
        </p>
        <p className="text-sm text-gray-400">
          Ano: <span className="text-white">{jogo.ano}</span>
        </p>

        {/* ⭐ Média de avaliação */}
        {mediaNota ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Avaliação média:</span>
            <Estrelas nota={Math.round(mediaNota)} readOnly />
            <span className="text-gray-300">
              ({mediaNota}/5 · {comentarios.length} avaliações)
            </span>
          </div>
        ) : (
          <p className="text-gray-400">Ainda sem avaliações</p>
        )}

        {/* Formulário de comentário */}
        {usuarioLogado && (
          <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-2xl font-semibold mb-2">
              Deixe seu comentário
            </h2>

            <textarea
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700"
              placeholder="Escreva seu comentário..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
            />

            <div className="flex items-center gap-4 mt-2">
              <label className="font-semibold">Nota:</label>
              <Estrelas nota={nota} setNota={setNota} />
              <button
                onClick={enviarComentario}
                className="ml-auto bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* Comentários */}
        {comentarios.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Comentários</h2>

            {comentarios.map((c) => (
              <div
                key={c.id}
                className="bg-gray-800 p-4 rounded-xl"
              >
                <p className="font-semibold">{c.usuario}</p>
                <p className="text-gray-300">{c.texto}</p>
                <Estrelas nota={c.nota} readOnly />
                <p className="text-sm text-gray-400">{c.criado_em}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
