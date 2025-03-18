import React from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f2f2f7;
  padding: 20px;
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.div`
  margin-bottom: 24px;

  img {
    width: 80px;
    height: 80px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #0084ff;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #8e8e93;
  margin-bottom: 32px;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const GoogleIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 12px;
`;

const ErrorMessage = styled.div`
  background-color: #fef1f2;
  color: #ff3b30;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
`;

const Login: React.FC = () => {
  const { signInWithGoogle, loading, error, clearError } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // Error is handled in the AuthContext
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <img
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            alt="RanjanchatAI Logo"
          />
        </Logo>
        <Title>RanjanchatAI</Title>
        <Subtitle>Sign in to access your personal AI assistant</Subtitle>

        {error && <ErrorMessage onClick={clearError}>{error}</ErrorMessage>}

        <GoogleButton onClick={handleGoogleSignIn} disabled={loading}>
          <GoogleIcon
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google logo"
          />
          {loading ? "Signing in..." : "Continue with Google"}
        </GoogleButton>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
