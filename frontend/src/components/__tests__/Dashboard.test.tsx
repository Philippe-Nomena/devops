import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../Dashboard"; // ← ../Dashboard au lieu de ../components/Dashboard

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  } as any);
});

describe("Dashboard", () => {
  it("affiche les boutons de génération", () => {
    render(<Dashboard token="fake-token" />);
    expect(screen.getByText(/Générer CERFA/i)).toBeInTheDocument();
    expect(screen.getByText(/Générer Convention/i)).toBeInTheDocument();
  });

  it("affiche le titre du tableau de bord", () => {
    render(<Dashboard token="fake-token" />);
    expect(screen.getByText(/Tableau de bord Documents/i)).toBeInTheDocument();
  });

  it("les boutons sont actifs par défaut", () => {
    render(<Dashboard token="fake-token" />);
    const btn = screen.getByText(/Générer CERFA/i);
    expect(btn).not.toBeDisabled();
  });
});
