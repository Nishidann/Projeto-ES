import "./globals.css";

export const metadata = {
  title: "Cadastro de Jogos",
  description: "Projeto de cadastro e reviews de jogos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
