"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../componentes/AuthCard";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const resposta = await fetch("http://localhost:8000/api/usuarios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || "Erro ao criar usuário");
        return;
      }

      // ✅ Cadastro OK → redireciona para a tela inicial
      router.push("/"); 
      // se quiser ir para login, use:
      // router.push("/login");

    } catch (error) {
      console.error(error);
      setErro("Erro de conexão com o servidor.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 px-4 py-16">

      <div className="w-full max-w-lg">
        <AuthCard title="Criar Conta">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

            {erro && (
              <p className="text-red-400 text-center">{erro}</p>
            )}

            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Seu email"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-300 mb-1">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Crie uma senha"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Criar Conta
            </button>
          </form>
        </AuthCard>
      </div>

    </div>
  );
}
