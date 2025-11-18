import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center p-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          GameRate
        </h1>

        <p className="text-gray-300 mt-4 text-lg">
          Cadastre e avalie seus jogos favoritos 🎮
        </p>

        {/* Botões */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/cadastro"
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
          >
            Cadastro
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow-md transition"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
