"use client";

import { useState } from "react";
import AuthCard from "../componentes/AuthCard";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const resposta = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || "Credenciais inválidas");
        return;
      }

      alert("Login realizado com sucesso!");

      // Aqui você pode salvar token, redirecionar, etc.
      // Exemplo:
      // localStorage.setItem("token", dados.token);

      setEmail("");
      setSenha("");

    } catch (error) {
      console.log(error);
      setErro("Erro ao conectar com o servidor.");
    }
  }

  return (
    <AuthCard title="Login">
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        
        {erro && <p className="text-red-400 text-center">{erro}</p>}

        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          Entrar
        </button>
      </form>
    </AuthCard>
  );
}
