"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save, Pencil, Trash2 } from "lucide-react";

export default function JogoCadastrarPage() {
  const [jogos, setJogos] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [generoId, setGeneroId] = useState("");
  const [ano, setAno] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [user, setUser] = useState(null);

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

  const carregarJogos = async () => {
    const res = await fetch("http://localhost:8000/api/jogo/");
    const dados = await res.json();
    setJogos(dados);
  };

  const carregarGeneros = async () => {
    const res = await fetch("http://localhost:8000/api/jogo/generos/");
    const dados = await res.json();
    setGeneros(dados);
  };

  const salvarJogo = async (e) => {
    e.preventDefault();

    const corpo = {
      titulo,
      descricao,
      genero: generoId,
      ano: parseInt(ano),
      usuario_id: user.id,
    };

    let url = "http://localhost:8000/api/jogo/criar/";
    let metodo = "POST";

    if (editandoId) {
      url = `http://localhost:8000/api/jogo/${editandoId}/atualizar/`;
      metodo = "PUT";
    }

    await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });

    limparFormulario();
    carregarJogos();
  };

  const deletarJogo = async (id) => {
    if (!confirm("Deseja deletar este jogo?")) return;

    await fetch(`http://localhost:8000/api/jogo/${id}/deletar/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: user.id }),
    });

    carregarJogos();
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 text-slate-300 hover:text-white"
        >
          <ArrowLeft size={18} /> Voltar ao Dashboard
        </a>

        <h1 className="text-3xl font-bold mb-8">
          {editandoId ? "Editar Jogo" : "Cadastrar Novo Jogo"}
        </h1>

        {/* FORM */}
        <form
          onSubmit={salvarJogo}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4"
        >
          <input
            className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Título do jogo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <textarea
            className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Descrição"
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ano"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold transition"
          >
            <Save size={18} /> {editandoId ? "Salvar Alterações" : "Cadastrar Jogo"}
          </button>
        </form>

        {/* LISTA */}
        <h2 className="text-2xl font-semibold mt-12 mb-4">Jogos Cadastrados</h2>

        <div className="space-y-4">
          {jogos.map((jogo) => (
            <div
              key={jogo.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5"
            >
              <h3 className="text-xl font-bold">{jogo.titulo}</h3>
              <p className="text-slate-400 text-sm mt-1">{jogo.descricao}</p>

              <div className="mt-2 text-sm text-slate-400">
                <span>Gênero: <span className="text-white">{jogo.genero}</span></span> •{' '}
                <span>Ano: <span className="text-white">{jogo.ano}</span></span>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => editar(jogo)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  <Pencil size={16} /> Editar
                </button>

                <button
                  onClick={() => deletarJogo(jogo.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold"
                >
                  <Trash2 size={16} /> Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
