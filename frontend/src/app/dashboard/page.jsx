"use client";

import { useEffect, useState } from "react";
import { Search, Star, User, Plus, LogOut } from "lucide-react";

function Estrelas({ nota }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < nota
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-500"
          }
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [jogos, setJogos] = useState([]);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("padrao");

  /* =========================
     AUTENTICAÇÃO
  ========================== */
  useEffect(() => {
    const dados = localStorage.getItem("usuario");
    if (!dados) {
      window.location.href = "/login";
      return;
    }

    const usuarioLogado = JSON.parse(dados);
    setUser(usuarioLogado);
    carregarJogos();
  }, []);

  /* =========================
     LOGOUT
  ========================== */
  const logout = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  /* =========================
     API
  ========================== */
  const carregarJogos = async () => {
    const res = await fetch("http://localhost:8000/api/jogo/");
    const jogosData = await res.json();

    const jogosComMedia = await Promise.all(
      jogosData.map(async (jogo) => {
        try {
          const r = await fetch(
            `http://localhost:8000/api/jogo/${jogo.id}/comentarios/`
          );
          const comentarios = await r.json();

          const media = comentarios.length
            ? comentarios.reduce((a, c) => a + c.nota, 0) /
              comentarios.length
            : null;

          return {
            ...jogo,
            mediaNota: media,
            totalAvaliacoes: comentarios.length,
          };
        } catch {
          return {
            ...jogo,
            mediaNota: null,
            totalAvaliacoes: 0,
          };
        }
      })
    );

    setJogos(jogosComMedia);
  };

  if (!user) return null;

  /* =========================
     FILTRO + ORDENAÇÃO
  ========================== */
  const jogosFiltrados = [...jogos]
    .filter((j) =>
      j.titulo.toLowerCase().includes(busca.toLowerCase())
    )
    .sort((a, b) => {
      if (ordenacao === "nota_desc") {
        return (b.mediaNota || 0) - (a.mediaNota || 0);
      }

      if (ordenacao === "nota_asc") {
        return (a.mediaNota || 0) - (b.mediaNota || 0);
      }

      return 0;
    });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* HEADER */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* ESQUERDA */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              🎮 GameHub
            </h1>
            <p className="text-sm text-slate-400">
              Olá,{" "}
              <span className="font-semibold text-white">
                {user.nome}
              </span>
            </p>
          </div>

          {/* DIREITA */}
          <div className="flex items-center gap-3">
            <a
              href={`/usuarios/${user.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
            >
              <User size={18} /> Perfil
            </a>

            {user.is_admin && (
              <a
                href="/jogo/cadastrar"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold transition"
              >
                <Plus size={18} /> Novo Jogo
              </a>
            )}

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-red-600 transition"
            >
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-semibold">Dashboard</h2>
            <p className="text-slate-400 text-sm">
              Explore e gerencie os jogos cadastrados
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* BUSCA */}
            <div className="relative w-full md:w-64">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar jogos"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* ORDENAÇÃO */}
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="padrao">Ordem padrão</option>
              <option value="nota_desc">
                Melhor avaliados
              </option>
              <option value="nota_asc">
                Pior avaliados
              </option>
            </select>
          </div>
        </div>

        {jogosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            Nenhum jogo encontrado
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {jogosFiltrados.map((jogo) => (
              <div
                key={jogo.id}
                className="bg-slate-800 rounded-2xl border border-slate-700 shadow hover:shadow-indigo-500/10 transition"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold truncate">
                    {jogo.titulo}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                    {jogo.descricao}
                  </p>

                  <div className="mt-4 text-sm text-slate-400 space-y-1">
                    <p>
                      Gênero:{" "}
                      <span className="text-white">
                        {jogo.genero}
                      </span>
                    </p>
                    <p>
                      Ano:{" "}
                      <span className="text-white">
                        {jogo.ano}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    {jogo.mediaNota ? (
                      <div className="flex items-center gap-2">
                        <Estrelas
                          nota={Math.round(jogo.mediaNota)}
                        />
                        <span className="text-sm text-slate-300">
                          {jogo.mediaNota.toFixed(1)} (
                          {jogo.totalAvaliacoes})
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">
                        Sem avaliações
                      </span>
                    )}
                  </div>

                  <a
                    href={`/jogos/${jogo.id}`}
                    className="block mt-6 text-center py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold transition"
                  >
                    Ver detalhes
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
