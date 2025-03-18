import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { testApiKey } from "../services/geminiService";

const TestContainer = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e9ecef;
`;

const TestTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
  color: #343a40;
`;

const TestResult = styled.div<{ success: boolean }>`
  padding: 8px 12px;
  background-color: ${(props) => (props.success ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.success ? "#155724" : "#721c24")};
  border-radius: 4px;
  margin-top: 8px;
  font-size: 14px;
`;

const TestButton = styled.button`
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 8px;

  &:hover {
    background-color: #0062cc;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ApiKeyTest: React.FC = () => {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const result = await testApiKey();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: "Test failed with an unexpected error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run the test automatically when the component mounts
  useEffect(() => {
    runTest();
  }, []);

  return (
    <TestContainer>
      <TestTitle>API Connection Status</TestTitle>
      {testResult && (
        <TestResult success={testResult.success}>
          {testResult.success ? "✅ " : "❌ "}
          {testResult.message}
        </TestResult>
      )}
      <TestButton onClick={runTest} disabled={isLoading}>
        {isLoading ? "Testing..." : "Test API Connection"}
      </TestButton>
    </TestContainer>
  );
};

export default ApiKeyTest;
