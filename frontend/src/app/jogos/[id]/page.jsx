"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Componente para mostrar estrelas de avaliação
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
          className={`text-2xl ${i < nota ? "text-yellow-400" : "text-gray-500"} hover:text-yellow-300`}
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

  const usuarioLogado = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("usuario")) : null;

  // Buscar dados do jogo
  useEffect(() => {
    const fetchJogo = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/jogo/${id}/`);
        if (!res.ok) throw new Error("Erro ao buscar jogo");
        const data = await res.json();
        setJogo(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchComentarios = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/jogo/${id}/comentarios/`);
        if (!res.ok) throw new Error("Erro ao buscar comentários");
        const data = await res.json();
        setComentarios(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJogo();
    fetchComentarios();
  }, [id]);

  // Enviar comentário para o backend
  const enviarComentario = async () => {
    if (!novoComentario || !usuarioLogado) return;

    try {
      const res = await fetch("http://localhost:8000/api/jogo/comentarios/criar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioLogado.id,
          jogo_id: id,
          texto: novoComentario,
          nota,
        }),
      });

      if (!res.ok) throw new Error("Erro ao enviar comentário");
      const data = await res.json();

      setComentarios([...comentarios, data]);
      setNovoComentario("");
      setNota(5);
    } catch (err) {
      console.error(err);
    }
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

        {/* Info do jogo */}
        <h1 className="text-4xl font-bold drop-shadow-lg">{jogo.titulo}</h1>
        <p className="text-gray-300">{jogo.descricao}</p>
        <p className="text-sm text-gray-400">Gênero: <span className="text-white">{jogo.genero}</span></p>
        <p className="text-sm text-gray-400">Ano: <span className="text-white">{jogo.ano}</span></p>

        {/* Formulário de comentário */}
        {usuarioLogado && (
          <div className="bg-gray-800 p-4 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Deixe seu comentário</h2>
            <textarea
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
              placeholder="Escreva seu comentário..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
            />
            <div className="flex items-center gap-4 mt-2">
              <label className="font-semibold">Nota:</label>
              <Estrelas nota={nota} setNota={setNota} />
              <button
                onClick={enviarComentario}
                className="ml-auto bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* Lista de comentários */}
        {comentarios.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Comentários</h2>
            {comentarios.map((c) => (
              <div key={c.id} className="bg-gray-800 p-4 rounded-xl shadow-sm">
                <p className="text-white font-semibold">{c.usuario}</p>
                <p className="text-gray-300">{c.texto}</p>
                <div className="mt-1">
                  <Estrelas nota={c.nota} setNota={() => {}} readOnly />
                </div>
                <p className="text-sm text-gray-400 mt-1">{c.criado_em}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
