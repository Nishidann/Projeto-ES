"use client";

import { useState, useEffect, use } from "react";

export default function EditarUsuario({ params }) {

  // ✔ Agora usando o use() corretamente (Next.js exige isso)
  const { id } = use(params);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("usuario");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const usuario = JSON.parse(user);

    // Não deixa editar outro perfil
    if (usuario.id !== parseInt(id)) {
      window.location.href = "/dashboard";
      return;
    }

    setNome(usuario.nome || "");
    setEmail(usuario.email || "");
    setSenha(""); // senha NÃO deve vir do banco

    setCarregando(false);
  }, [id]);

  const atualizarUsuario = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch(
        `http://localhost:8000/api/usuarios/${id}/atualizar/`,
        {
          method: "PUT", // ✔ CORRIGIDO — antes estava POST
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, senha }),
        }
      );

      if (resposta.status === 403) {
        setMensagem("Erro: Permissão negada (403)");
        return;
      }

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem("Erro: " + (dados.erro || "Falha ao atualizar"));
        return;
      }

      // ✔ Atualiza no localStorage sem salvar senha
      localStorage.setItem(
        "usuario",
        JSON.stringify({ id, nome, email })
      );

      setMensagem("Perfil atualizado com sucesso!");
    } catch (e) {
      setMensagem("Erro ao conectar ao servidor.");
    }
  };

  if (carregando) return <p className="carregando">Carregando...</p>;

  return (
    <div className="editar-container">
      <div className="card">
        <h1>Editar Perfil</h1>

        <form onSubmit={atualizarUsuario}>
          <div className="campo">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label>Senha (opcional)</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Deixe vazio para não mudar"
            />
          </div>

          <button className="btn-salvar" type="submit">Salvar Alterações</button>
        </form>

        {mensagem && <p className="mensagem">{mensagem}</p>}

        <a href="/dashboard" className="voltar">
          ← Voltar ao Dashboard
        </a>
      </div>

      <style jsx>{`
        .editar-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          min-height: 100vh;
          background: #f0f2f5;
        }

        .card {
          width: 100%;
          max-width: 420px;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12);
          animation: fadeIn 0.3s ease-in-out;
        }

        h1 {
          margin-bottom: 20px;
          text-align: center;
          font-size: 24px;
        }

        .campo {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }

        label {
          margin-bottom: 6px;
          font-weight: 500;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
        }

        input:focus {
          border-color: #1d4ed8;
          outline: none;
          box-shadow: 0 0 4px rgba(29,78,216,0.3);
        }

        .btn-salvar {
          width: 100%;
          padding: 12px;
          background: #1d4ed8;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 10px;
          transition: 0.2s;
        }

        .btn-salvar:hover {
          background: #163db3;
        }

        .mensagem {
          margin-top: 15px;
          text-align: center;
          color: green;
          font-weight: 500;
        }

        .voltar {
          display: block;
          margin-top: 20px;
          text-align: center;
          text-decoration: none;
          color: #1d4ed8;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
