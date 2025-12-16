"use client";

import { useState } from "react";

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

      // Normalize o formato salvo no localStorage
        const usuarioNormalizado = {
          id: data.id,
          nome: data.nome,
          email: data.email,
          is_admin: data.is_admin, // 🔥 agora vem do backend
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
    <div style={styles.container}>
      <h1 style={styles.titulo}>Login</h1>

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 400,
    margin: "80px auto",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    boxShadow: "0 0 10px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  titulo: {
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: 6,
  },
};
