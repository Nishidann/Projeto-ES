export default function AuthCard({ title, children }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {title}
        </h2>

        {children}
      </div>
    </main>
  );
}
