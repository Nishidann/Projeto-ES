"use client";
import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function fetchUsuarios() {
      const res = await fetch("http://localhost:3001/usuarios");
      const data = await res.json();
      setUsuarios(data);
    }
    fetchUsuarios();
  }, []);

  return (
    <div>
      <h1>Usuários</h1>
      <a href="/usuarios/cadastro">Novo Usuário</a>

      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nome} - {u.email}
            <a href={`/usuarios/${u.id}`}>Editar</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
