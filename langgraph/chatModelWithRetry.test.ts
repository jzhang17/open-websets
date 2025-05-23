import { jest } from "@jest/globals";
import { GoogleGenerativeAIError } from "@google/generative-ai";

const mockLoadChatModel = jest.fn();

jest.unstable_mockModule("./utils.js", () => ({
  loadChatModel: mockLoadChatModel,
}));

const { loadChatModelWithRetry } = await import("./chatModelWithRetry.js");

const mockModel: any = { generateContentStream: jest.fn() };
// @ts-ignore
(mockModel.generateContentStream as any)
  .mockRejectedValueOnce(new GoogleGenerativeAIError("Failed to parse stream"))
  .mockResolvedValueOnce("ok");

// Mock will be reset for second test

// @ts-ignore
(mockLoadChatModel as any).mockResolvedValue(mockModel);

test("retries parsing failures", async () => {
  const model: any = await loadChatModelWithRetry("gemini");
  const result = await model.generateContentStream([]);
  expect(result).toBe("ok");
  expect(mockModel.generateContentStream).toHaveBeenCalledTimes(2);
});

test("retries when error message string matches", async () => {
  (mockModel.generateContentStream as any).mockReset()
    .mockRejectedValueOnce(new Error("Failed to parse stream"))
    .mockResolvedValueOnce("ok2");

  const model: any = await loadChatModelWithRetry("gemini");
  const result = await model.generateContentStream([]);
  expect(result).toBe("ok2");
  expect(mockModel.generateContentStream).toHaveBeenCalledTimes(2);
});
