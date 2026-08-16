import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/components/forms/contact-form";

afterEach(() => vi.restoreAllMocks());

describe("ContactForm", () => {
  it("shows the provider response after a successful mocked submission", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true, id: "test" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const user = userEvent.setup();
    render(<ContactForm compact />);

    await user.type(screen.getByLabelText("Name"), "A Visitor");
    await user.type(screen.getByLabelText("Email"), "visitor@example.com");
    await user.type(screen.getByLabelText("Message"), "This is a detailed message for Akhil's portfolio.");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText(/message is on its way/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
  });
});
