"use client";
import { useState } from "react";

export default function CadastroUsuario() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("http://localhost:3001/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Usuário criado!");
    window.location.href = "/usuarios";
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Cadastrar Usuário</h1>

      <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} />

      <button type="submit">Salvar</button>
    </form>
  );
}
