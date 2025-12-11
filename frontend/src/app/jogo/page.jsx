"use client";

import { useEffect, useState } from "react";

export default function JogoPage() {
  const [jogos, setJogos] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [generoId, setGeneroId] = useState("");
  const [ano, setAno] = useState("");

  const [editandoId, setEditandoId] = useState(null);

  // Carregar lista de jogos
  const carregarJogos = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/jogo/");
      if (!res.ok) throw new Error("Erro ao buscar jogos");
      const dados = await res.json();
      setJogos(dados);
    } catch (erro) {
      console.error("Erro ao carregar jogos:", erro);
    }
  };

  // Carregar lista de gêneros
  const carregarGeneros = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/jogo/generos/");
      if (!res.ok) throw new Error("Erro ao buscar gêneros");
      const dados = await res.json();
      setGeneros(dados);
    } catch (erro) {
      console.error("Erro ao carregar gêneros:", erro);
    }
  };

  useEffect(() => {
    carregarJogos();
    carregarGeneros();
  }, []);

  // Criar ou editar jogo
  const salvarJogo = async (e) => {
    e.preventDefault();

    const corpo = JSON.stringify({
      titulo,
      descricao,
      genero: generoId,
      ano: parseInt(ano),
    });

    let url = "http://localhost:8000/api/jogo/criar/";
    let metodo = "POST";

    if (editandoId) {
      url = `http://localhost:8000/api/jogo/${editandoId}/atualizar/`;
      metodo = "PUT";
    }

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: corpo,
      });
      if (!res.ok) throw new Error("Erro ao salvar jogo");

      setTitulo("");
      setDescricao("");
      setGeneroId("");
      setAno("");
      setEditandoId(null);

      carregarJogos();
    } catch (erro) {
      console.error("Erro ao salvar jogo:", erro);
    }
  };

  // Deletar jogo
  const deletarJogo = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/jogo/${id}/deletar/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao deletar jogo");
      carregarJogos();
    } catch (erro) {
      console.error("Erro ao deletar jogo:", erro);
    }
  };

  // Carregar jogo para edição
  const editar = (jogo) => {
    setEditandoId(jogo.id);
    setTitulo(jogo.titulo);
    setDescricao(jogo.descricao);
    setGeneroId(jogo.genero);
    setAno(jogo.ano);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 drop-shadow-lg">
          {editandoId ? "Editar Jogo" : "Cadastrar Jogo"}
        </h1>

        {/* FORM */}
        <form
          onSubmit={salvarJogo}
          className="bg-gray-800/60 p-6 rounded-xl shadow-lg space-y-4 backdrop-blur-md border border-gray-700"
        >
          <input
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <textarea
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <select
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
            value={generoId}
            onChange={(e) => setGeneroId(e.target.value)}
            required
          >
            <option value="">Selecione um gênero</option>
            {generos.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>

          <input
            className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
            type="number"
            placeholder="Ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
          >
            {editandoId ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>

        {/* LISTA */}
        <h2 className="text-3xl font-semibold mt-10 mb-4">Jogos Cadastrados</h2>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {jogos.length === 0 ? (
            <p className="text-gray-300">Nenhum jogo cadastrado.</p>
          ) : (
            jogos.map((jogo) => (
              <div
                key={jogo.id}
                className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 shadow-md"
              >
                <h3 className="text-2xl font-bold">{jogo.titulo}</h3>
                <p className="text-gray-300">{jogo.descricao}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Gênero: <span className="text-white">{jogo.genero || "Sem gênero"}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Ano: <span className="text-white">{jogo.ano}</span>
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => editar(jogo)}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deletarJogo(jogo.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
