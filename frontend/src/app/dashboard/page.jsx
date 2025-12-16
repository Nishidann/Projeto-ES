"use client";

import { useEffect, useState } from "react";

// ⭐ Componente de estrelas (somente leitura)
function Estrelas({ nota }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < nota ? "text-yellow-400" : "text-gray-500"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [jogos, setJogos] = useState([]);

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

  const carregarJogos = async () => {
    try {
      const resJogos = await fetch("http://localhost:8000/api/jogo/");
      const jogosData = await resJogos.json();

      // 🔹 Para cada jogo, buscar comentários e calcular média
      const jogosComMedia = await Promise.all(
        jogosData.map(async (jogo) => {
          try {
            const resComentarios = await fetch(
              `http://localhost:8000/api/jogo/${jogo.id}/comentarios/`
            );
            const comentarios = await resComentarios.json();

            let media = null;

            if (comentarios.length > 0) {
              const soma = comentarios.reduce(
                (acc, c) => acc + c.nota,
                0
              );
              media = soma / comentarios.length;
            }

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
    } catch (err) {
      console.error("Erro ao carregar jogos:", err);
    }
  };

  if (!user) return null;

  return (
    
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Bem-vindo, {user.nome}
        </h1>

        {user.is_admin && (
          <a
            href="/jogo/cadastrar"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
          >
            + Cadastrar Jogo
          </a>
        )}

        {/* ✅ BOTÃO DE PERFIL (MANTIDO) */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href={`/usuarios/${user.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            Editar Perfil
          </a>
        </div>

        <h2 className="text-3xl font-semibold mb-4">
          Jogos Cadastrados
        </h2>

        {jogos.length === 0 ? (
          <p className="text-gray-300 text-center">
            Nenhum jogo cadastrado.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {jogos.map((jogo) => (
              <div
                key={jogo.id}
                className="bg-gray-800/60 p-5 rounded-xl border border-gray-700 shadow-md"
              >
                <h3 className="text-xl font-bold">
                  {jogo.titulo}
                </h3>

                <p className="text-gray-300 mt-1">
                  {jogo.descricao}
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Gênero:{" "}
                  <span className="text-white">
                    {jogo.genero}
                  </span>
                </p>

                <p className="text-sm text-gray-400">
                  Ano:{" "}
                  <span className="text-white">
                    {jogo.ano}
                  </span>
                </p>

                {/* ⭐ MÉDIA CORRETA */}
                <div className="mt-3">
                  {jogo.mediaNota ? (
                    <div className="flex items-center gap-2">
                      <Estrelas
                        nota={Math.round(jogo.mediaNota)}
                      />
                      <span className="text-sm text-gray-300">
                        {jogo.mediaNota.toFixed(1)}/5 (
                        {jogo.totalAvaliacoes})
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Sem avaliações
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <a
                    href={`/jogos/${jogo.id}`}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  >
                    Ver
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
