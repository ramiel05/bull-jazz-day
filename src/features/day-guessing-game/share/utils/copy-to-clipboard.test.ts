import { describe, it, expect, vi, beforeEach } from "vitest";
import { copyToClipboard } from "./copy-to-clipboard";

describe("copyToClipboard", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("should successfully write text to clipboard", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });

    await copyToClipboard("Hello World");

    expect(mockWriteText).toHaveBeenCalledWith("Hello World");
    expect(mockWriteText).toHaveBeenCalledTimes(1);
  });

  it("should propagate error when clipboard write fails", async () => {
    const mockWriteText = vi
      .fn()
      .mockRejectedValue(new Error("Permission denied"));
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });

    await expect(copyToClipboard("Some text")).rejects.toThrow(
      "Permission denied"
    );
  });

  it("should throw error when text is empty", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });

    await expect(copyToClipboard("")).rejects.toThrow();
    expect(mockWriteText).not.toHaveBeenCalled();
  });

  it("should call navigator.clipboard.writeText with correct text", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });

    const testMessage = "🎉 Correct!\n\nInternational Day of Peace is real!";
    await copyToClipboard(testMessage);

    expect(mockWriteText).toHaveBeenCalledWith(testMessage);
  });

  it("should propagate error to caller without catching", async () => {
    const customError = new Error("NotAllowedError");
    const mockWriteText = vi.fn().mockRejectedValue(customError);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });

    try {
      await copyToClipboard("Test");
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBe(customError);
    }
  });
});
