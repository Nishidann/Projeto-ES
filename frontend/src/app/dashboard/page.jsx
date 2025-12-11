"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    const dados = localStorage.getItem("usuario");

    if (!dados) {
      window.location.href = "/login";
      return;
    }

    try {
      const usuarioLogado = JSON.parse(dados);
      setUser(usuarioLogado);

      // Buscar todos os jogos do backend
      fetch("http://localhost:8000/api/jogo/")
        .then(res => res.json())
        .then(data => setJogos(data))
        .catch(err => console.error("Erro ao carregar jogos:", err));

    } catch (erro) {
      console.error("Erro ao ler usuário:", erro);
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
  }, []);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-6 text-center drop-shadow-lg">
          Bem-vindo, {user.nome}
        </h1>

        <div className="flex justify-center gap-4 mb-8">
          <a
            href={`/usuarios/${user.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow"
          >
            Editar Perfil
          </a>
        </div>

        <h2 className="text-3xl font-semibold mb-4">Jogos Cadastrados</h2>

        {jogos.length === 0 ? (
          <p className="text-gray-300 text-center">Nenhum jogo cadastrado.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {jogos.map(jogo => (
              <div
                key={jogo.id}
                className="bg-gray-800/60 p-5 rounded-xl border border-gray-700 shadow-md backdrop-blur-md"
              >
                <h3 className="text-xl font-bold">{jogo.titulo}</h3>
                <p className="text-gray-300 mt-1">{jogo.descricao}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Gênero: <span className="text-white">{jogo.genero}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Ano: <span className="text-white">{jogo.ano}</span>
                </p>

                <div className="mt-4 flex gap-3">
                  <a
                    href={`/jogos/${jogo.id}`}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
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
