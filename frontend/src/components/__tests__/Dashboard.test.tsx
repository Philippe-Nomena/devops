import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../Dashboard";

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  } as any);
});

describe("Dashboard", () => {
  const mockLogout = vi.fn();

  it("affiche les boutons de génération", () => {
    render(<Dashboard token="fake-token" onLogout={mockLogout} />);
    expect(screen.getByText(/Générer CERFA/i)).toBeInTheDocument();
    expect(screen.getByText(/Générer Convention/i)).toBeInTheDocument();
  });

  it("affiche le titre du tableau de bord", () => {
    render(<Dashboard token="fake-token" onLogout={mockLogout} />);
    expect(screen.getByText(/Tableau de bord/i)).toBeInTheDocument();
  });

  it("les boutons sont actifs par défaut", () => {
    render(<Dashboard token="fake-token" onLogout={mockLogout} />);
    const btn = screen.getByText(/Générer CERFA/i);
    expect(btn).not.toBeDisabled();
  });
});
