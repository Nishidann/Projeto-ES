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

      // Aqui futuramente vamos buscar jogos do backend:
      // fetch(`http://localhost:8000/api/jogos/usuario/${usuarioLogado.id}`)
      //   .then(res => res.json())
      //   .then(data => setJogos(data));

      // Jogos de exemplo (até integrar no backend)
      setJogos([
        { id: 1, nome: "The Witcher 3", status: "Publicado" },
        { id: 2, nome: "Celeste", status: "Rascunho" },
        { id: 3, nome: "Dark Souls", status: "Publicado" },
      ]);

    } catch (erro) {
      console.error("Erro ao ler usuário:", erro);
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
  }, []);

  if (!user) return null;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎮 Bem-vindo, {user.nome}</h1>

      <div style={styles.actions}>
        <a href={`/usuarios/${user.id}`} style={styles.buttonBlue}>Editar Perfil</a>
        <a href="/jogos/criar" style={styles.buttonGreen}>+ Adicionar Jogo</a>
      </div>

      <h2 style={styles.subtitle}>Seus Jogos</h2>

      <div style={styles.cardContainer}>
        {jogos.length === 0 ? (
          <p style={{ fontSize: 16, opacity: 0.7 }}>Você ainda não adicionou jogos.</p>
        ) : (
          jogos.map((jogo) => (
            <div key={jogo.id} style={styles.card}>
              <h3 style={{ margin: 0 }}>{jogo.nome}</h3>
              <p style={{ opacity: 0.6 }}>{jogo.status}</p>

              <div style={styles.cardButtons}>
                <a href={`/jogos/${jogo.id}`} style={styles.buttonSmall}>Ver</a>
                <a href={`/jogos/${jogo.id}/editar`} style={styles.buttonSmallYellow}>Editar</a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    maxWidth: "900px",
    margin: "40px auto",
    fontFamily: "Arial",
  },

  title: {
    fontSize: "32px",
    marginBottom: "20px",
  },

  subtitle: {
    fontSize: "22px",
    marginTop: "30px",
    marginBottom: "10px",
  },

  actions: {
    display: "flex",
    gap: "12px",
  },

  buttonBlue: {
    padding: "10px 14px",
    background: "#1d4ed8",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
  },

  buttonGreen: {
    padding: "10px 14px",
    background: "#22c55e",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
  },

  cardContainer: {
    marginTop: "10px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },

  card: {
    padding: "14px",
    borderRadius: "10px",
    background: "#f8f8f8",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },

  cardButtons: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },

  buttonSmall: {
    padding: "6px 10px",
    background: "#1d4ed8",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
  },

  buttonSmallYellow: {
    padding: "6px 10px",
    background: "#eab308",
    color: "black",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
  },
};
