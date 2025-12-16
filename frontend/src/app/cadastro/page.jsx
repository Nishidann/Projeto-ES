"use client";

import { useState } from "react";
import { User, Mail, Lock, UserPlus, ArrowLeft } from "lucide-react";

export default function CadastroUsuario() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);

    try {
      await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      alert("Usuário criado com sucesso!");
      window.location.href = "/login";
    } catch (err) {
      alert("Erro ao criar usuário");
    }

    setCarregando(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur border border-slate-700 rounded-2xl shadow-xl p-8">

        {/* TÍTULO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">🎮 GameHub</h1>
          <p className="text-slate-400 text-sm mt-1">
            Crie sua conta
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* NOME */}
          <div className="relative">
            <User size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              name="nome"
              placeholder="Nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SENHA */}
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              name="senha"
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold transition disabled:opacity-60"
          >
            <UserPlus size={18} />
            {carregando ? "Criando..." : "Criar conta"}
          </button>
        </form>

        {/* LINKS */}
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="/login"
            className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-sm"
          >
            <ArrowLeft size={16} />
            Já tenho conta
          </a>

          <a
            href="/"
            className="text-center text-sm text-slate-400 hover:text-white transition"
          >
            Voltar para o início
          </a>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} GameHub
        </div>
      </div>
    </main>
  );
}
