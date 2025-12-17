import { render, screen, waitFor } from "@testing-library/react";
import JogoDetalhe from "./page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
}));

beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() =>
        JSON.stringify({ id: 1, nome: "Teste" })
      ),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

global.fetch = jest.fn();

describe("Página JogoDetalhe", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("calcula corretamente a média das notas", async () => {
    fetch
      .mockResolvedValueOnce({
        json: async () => ({
          titulo: "Jogo Teste",
          descricao: "Descrição",
          genero: "Ação",
          ano: 2024,
        }),
      })
      .mockResolvedValueOnce({
        json: async () => [
          { id: 1, nota: 5 },
          { id: 2, nota: 3 },
        ],
      });

    render(<JogoDetalhe />);

    await waitFor(() => {
      expect(
        screen.getByText("4.0/5 · 2 avaliações")
      ).toBeInTheDocument();
    });
  });

  test("renderiza os comentários na tela", async () => {
    fetch
      .mockResolvedValueOnce({
        json: async () => ({
          titulo: "Jogo Teste",
          descricao: "Descrição",
          genero: "Ação",
          ano: 2024,
        }),
      })
      .mockResolvedValueOnce({
        json: async () => [
          {
            id: 1,
            usuario: "Maria",
            texto: "Muito bom",
            nota: 5,
            criado_em: "2024-01-01",
          },
        ],
      });

    render(<JogoDetalhe />);

    await waitFor(() => {
      expect(
        screen.getByText("Muito bom")
      ).toBeInTheDocument();
    });
  });
});
