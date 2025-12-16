"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, ArrowLeft, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setCarregando(true);

    try {
      const res = await fetch("http://localhost:8000/api/usuarios/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok || data.erro) {
        alert(data.erro || "Erro ao fazer login");
        setCarregando(false);
        return;
      }

      const usuarioNormalizado = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        is_admin: data.is_admin,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioNormalizado));
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
      console.error(error);
    }

    setCarregando(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur border border-slate-700 rounded-2xl shadow-xl p-8">
        
        {/* TÍTULO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">GameRate</h1>
          <p className="text-slate-400 text-sm mt-1">
            Entre para continuar
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SENHA */}
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ENTRAR */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold transition disabled:opacity-60"
          >
            <LogIn size={18} />
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* AÇÕES EXTRAS */}
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="/"
            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-sm"
          >
            <ArrowLeft size={16} />
            Voltar para o início
          </a>

          <a
            href="/cadastro"
            className="flex items-center justify-center gap-2 py-2 rounded-lg border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white transition text-sm"
          >
            <UserPlus size={16} />
            Criar uma conta
          </a>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} GameRate
        </div>
      </div>
    </main>
  );
}
