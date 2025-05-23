#!/usr/bin/env tsx

/**
 * Test script for the enhanced Google Generative AI retry mechanism
 * 
 * This script tests various error scenarios to ensure the retry logic works correctly.
 * Run with: npx tsx test-retry.ts
 */

import { loadChatModelWithRetry } from "./chatModelWithRetry.js";
import { GoogleGenerativeAIError } from "@google/generative-ai";

// Mock error generator for testing
class MockError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "MockError";
  }
}

// Test scenarios
const testScenarios = [
  {
    name: "Streaming parse error",
    error: new GoogleGenerativeAIError("[GoogleGenerativeAI Error]: Failed to parse stream"),
    shouldRetry: true
  },
  {
    name: "JSON parse error variant",
    error: new Error("Unexpected token in JSON at position 42"),
    shouldRetry: true
  },
  {
    name: "Server-sent events error",
    error: new MockError("SSE parse error: malformed chunk"),
    shouldRetry: true
  },
  {
    name: "Network timeout",
    error: new MockError("Connection timeout after 30s"),
    shouldRetry: true
  },
  {
    name: "503 Service unavailable",
    error: new GoogleGenerativeAIError("503 Service Unavailable: overload"),
    shouldRetry: true
  },
  {
    name: "Authentication error",
    error: new GoogleGenerativeAIError("401 Unauthorized: Invalid API key"),
    shouldRetry: false
  }
];

// Mock the real model for testing
function createMockModel(errorToThrow?: Error, succeedAfterAttempts: number = 1) {
  let attempts = 0;
  
  return {
    generateContentStream: async (input: any, options: any = {}) => {
      attempts++;
      console.log(`[Mock] generateContentStream attempt ${attempts}`);
      
      if (errorToThrow && attempts < succeedAfterAttempts) {
        throw errorToThrow;
      }
      
      return {
        async *[Symbol.asyncIterator]() {
          yield { text: () => `Success after ${attempts} attempts` };
        },
        response: { text: () => `Success after ${attempts} attempts` }
      };
    },
    
    generateContent: async (input: any, options: any = {}) => {
      attempts++;
      console.log(`[Mock] generateContent attempt ${attempts}`);
      
      if (errorToThrow && attempts < succeedAfterAttempts) {
        throw errorToThrow;
      }
      
      return {
        response: { text: () => `Non-streaming success after ${attempts} attempts` }
      };
    }
  };
}

// Override the loadChatModel function for testing
const originalLoadChatModel = require("./utils.js").loadChatModel;

async function runTests() {
  console.log("🧪 Testing Enhanced Google Generative AI Retry Mechanism\n");
  
  for (const scenario of testScenarios) {
    console.log(`\n📋 Testing: ${scenario.name}`);
    console.log(`   Expected to retry: ${scenario.shouldRetry}`);
    
    // Mock the loadChatModel to return our test model
    const mockModel = createMockModel(scenario.error, scenario.shouldRetry ? 3 : 1);
    require("./utils.js").loadChatModel = async () => mockModel;
    
    try {
      const modelWithRetry = await loadChatModelWithRetry("gemini-1.5-flash");
      
      // Test streaming
      console.log("   Testing streaming...");
      const streamResult = await modelWithRetry.generateContentStream("test input");
      
      for await (const chunk of streamResult) {
        console.log(`   ✅ Stream result: ${chunk.text()}`);
        break; // Just test the first chunk
      }
      
    } catch (error) {
      if (scenario.shouldRetry) {
        console.log(`   ❌ Unexpected failure: ${error.message}`);
      } else {
        console.log(`   ✅ Expected failure: ${error.message}`);
      }
    }
  }
  
  // Test streaming fallback scenario
  console.log(`\n📋 Testing: Streaming fallback after repeated failures`);
  const streamingFailureModel = createMockModel(
    new GoogleGenerativeAIError("[GoogleGenerativeAI Error]: Failed to parse stream"), 
    10 // Will never succeed with streaming
  );
  
  require("./utils.js").loadChatModel = async () => streamingFailureModel;
  
  try {
    const modelWithRetry = await loadChatModelWithRetry("gemini-1.5-flash");
    console.log("   Testing repeated streaming failures leading to fallback...");
    
    const result = await modelWithRetry.generateContentStream("test input");
    for await (const chunk of result) {
      console.log(`   ✅ Fallback result: ${chunk.text()}`);
      break;
    }
  } catch (error) {
    console.log(`   ❌ Fallback failed: ${error.message}`);
  }
  
  // Restore original function
  require("./utils.js").loadChatModel = originalLoadChatModel;
  
  console.log("\n🎉 Test suite completed!");
  console.log("\n📊 Key improvements in the enhanced retry mechanism:");
  console.log("   • Broader error pattern detection");
  console.log("   • Automatic fallback to non-streaming after repeated streaming failures");
  console.log("   • Better error classification and logging");
  console.log("   • Configurable retry thresholds");
  console.log("   • Enhanced backoff strategy with jitter");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests }; 