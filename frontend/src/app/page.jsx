import Link from "next/link";
import { Star, Gamepad2, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      
      <div className="max-w-4xl w-full px-6 text-center">

        {/* TÍTULO */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          🎮 GameRate
        </h1>

        {/* SUBTÍTULO */}
        <p className="mt-6 text-slate-300 text-lg max-w-2xl mx-auto">
          Cadastre, avalie e descubra jogos de forma simples, rápida e organizada.
        </p>

        {/* BENEFÍCIOS */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6 text-slate-300">
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-indigo-400" />
            Organize seus jogos
          </div>

          <div className="flex items-center gap-3">
            <Star className="text-yellow-400" />
            Avalie com notas e comentários
          </div>

          <div className="flex items-center gap-3">
            <Users className="text-sky-400" />
            Veja avaliações da comunidade
          </div>
        </div>

        {/* BOTÕES */}
        <div className="mt-12 flex justify-center gap-4">
          <Link
            href="/cadastro"
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold transition"
          >
            Criar conta
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold transition"
          >
            Entrar
          </Link>
        </div>

        {/* FOOTER */}
        <p className="mt-14 text-xs text-slate-500">
          © {new Date().getFullYear()} GameRate
        </p>

      </div>
    </main>
  );
}
