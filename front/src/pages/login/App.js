import React, { useState } from "react";
import axios from "axios";
import { Layout, Input, Button, Image, message } from "antd";
import { useNavigate } from "react-router-dom";
import image from "../../components/Screenshot_50.png";

const { Content } = Layout;

const contentStyle = {
  color: "#ffffff",
  backgroundColor: "#000000",
  padding: "4%",
  borderRadius: "20px",

};

const layoutStyle = {
  marginTop: "50px",
  marginBottom: "50px",
  minHeight: "80vh",
  marginLeft: "auto",
  marginRight: "auto",
  width: "90%",
  maxWidth: "700px",
};

const App = ({ setLoginToken }) => {
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const erro = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao efetuar login",
    });
  };

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (!validarEmail(email)) {
      setEmailError("Email inválido");
      return;
    }

    if (senha.length < 6) {
      setSenhaError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: email,
        senha: senha,
      });

      if (response) {
        if (response.data.user.tipo === "Empresa") {
          navigate("/HomeAdmin");
          setLoginToken(response.data.token);
        }

        if (response.data.user.tipo === "Candidato") {
          navigate("/Home");
          setLoginToken(response.data.token);
        }
      }
    } catch (error) {
      erro();
    }
  };

  return (
    <>
      {contextHolder}
      <Layout style={layoutStyle}>
        <Content style={contentStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Image width={350} height={200} src={image} preview={false} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: "bold", justifyContent: "left" }}>
              Email
            </span>
            <Input
              maxLength={50}
              type="email"
              placeholder="Digite seu email"
              style={{
                padding: "1%",
              }}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!validarEmail(e.target.value)) {
                  setEmailError("Email inválido");
                } else {
                  setEmailError("");
                }
              }}
            />
            {emailError && <span style={{ color: "red" }}>{emailError}</span>}
          </div>
          <div>
            <span style={{ fontWeight: "bold" }}>Senha</span>
            <Input.Password
              maxLength={50}
              style={{ padding: "1%" }}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length >= 6) {
                  setSenhaError("");
                }
              }}
            />
            {senhaError && <span style={{ color: "red" }}>{senhaError}</span>}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10%",
            }}
          >
            <Button
              type="primary"
              style={{
                width: "45%",
                backgroundColor: "lightgrey",
                color: "black",
              }}
              onClick={() => navigate("/Criar-conta")}
            >
              Criar conta
            </Button>
            <Button
              type="primary"
              style={{
                width: "45%",
                backgroundColor: "lightgrey",
                color: "black",
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default App;
