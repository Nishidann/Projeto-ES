"use client";

import { useEffect, useState } from "react";

export default function JogoCadastrarPage() {
  const [jogos, setJogos] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [generoId, setGeneroId] = useState("");
  const [ano, setAno] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [user, setUser] = useState(null);

  /* =========================
     AUTENTICAÇÃO / ADMIN
  ========================== */
  useEffect(() => {
    const dados = localStorage.getItem("usuario");

    if (!dados) {
      window.location.href = "/login";
      return;
    }

    const usuario = JSON.parse(dados);

    if (!usuario.is_admin) {
      alert("Acesso restrito a administradores");
      window.location.href = "/dashboard";
      return;
    }

    setUser(usuario);
    carregarJogos();
    carregarGeneros();
  }, []);

  /* =========================
     API
  ========================== */
  const carregarJogos = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/jogo/");
      const dados = await res.json();
      setJogos(dados);
    } catch (erro) {
      console.error("Erro ao carregar jogos:", erro);
    }
  };

  const carregarGeneros = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/jogo/generos/");
      const dados = await res.json();
      setGeneros(dados);
    } catch (erro) {
      console.error("Erro ao carregar gêneros:", erro);
    }
  };

  /* =========================
     CRIAR / EDITAR
  ========================== */
  const salvarJogo = async (e) => {
    e.preventDefault();

    const corpo = {
      titulo,
      descricao,
      genero: generoId,
      ano: parseInt(ano),
      usuario_id: user.id, // 🔐 importante
    };

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
        body: JSON.stringify(corpo),
      });

      if (!res.ok) throw new Error("Erro ao salvar jogo");

      limparFormulario();
      carregarJogos();
    } catch (erro) {
      console.error("Erro ao salvar jogo:", erro);
    }
  };

  const deletarJogo = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este jogo?")) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/jogo/${id}/deletar/`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_id: user.id }),
        }
      );

      if (!res.ok) throw new Error("Erro ao deletar jogo");
      carregarJogos();
    } catch (erro) {
      console.error("Erro ao deletar jogo:", erro);
    }
  };

  const editar = (jogo) => {
    setEditandoId(jogo.id);
    setTitulo(jogo.titulo);
    setDescricao(jogo.descricao);
    setGeneroId(jogo.genero);
    setAno(jogo.ano);
  };

  const limparFormulario = () => {
    setTitulo("");
    setDescricao("");
    setGeneroId("");
    setAno("");
    setEditandoId(null);
  };

  if (!user) return null;

  /* =========================
     UI
  ========================== */
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">
      <div className="max-w-3xl mx-auto">

        <a
          href="/dashboard"
          className="inline-block mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
        >
          ← Voltar para Dashboard
        </a>

        <h1 className="text-4xl font-bold text-center mb-8">
          {editandoId ? "Editar Jogo" : "Cadastrar Jogo"}
        </h1>

        {/* FORM */}
        <form
          onSubmit={salvarJogo}
          className="bg-gray-800/60 p-6 rounded-xl space-y-4 border border-gray-700"
        >
          <input
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <textarea
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <select
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
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
            type="number"
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            placeholder="Ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold"
          >
            {editandoId ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>

        {/* LISTA */}
        <h2 className="text-3xl font-semibold mt-10 mb-4">
          Jogos Cadastrados
        </h2>

        <div className="space-y-4">
          {jogos.map((jogo) => (
            <div
              key={jogo.id}
              className="bg-gray-800 p-5 rounded-xl border border-gray-700"
            >
              <h3 className="text-2xl font-bold">{jogo.titulo}</h3>
              <p className="text-gray-300">{jogo.descricao}</p>
              <p className="text-sm text-gray-400">
                Gênero: <span className="text-white">{jogo.genero}</span>
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
          ))}
        </div>

      </div>
    </main>
  );
}
