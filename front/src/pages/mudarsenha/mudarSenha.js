import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  Layout,
  Menu,
  theme,
  Image,
  Button,
  Select,
  Form,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import image from "../../components/Screenshot_50.png";
import InputMask from "react-input-mask";

const { Header, Content, Sider, Footer } = Layout;
const { Option } = Select;

const MudarSenha = ({ logintoken }) => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({});
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [senhaError, setSenhaError] = useState("");

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Dados atualizados com sucesso",
    });
  };

  const erro = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao atualizar dados",
    });
  };

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!senha) newErrors.senha = "A nova senha é obrigatória";
    if (senhaError) newErrors.senha = senhaError;

    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validarEmail(email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const data = {
        email: email,
        senha: senha,
      };

      await axios.put("http://localhost:3000/users", data, { headers });

      success();

      setTimeout(() => {
        navigate("/Perfil");
      }, 1000);
    } catch (error) {
      erro();
    }
  };

  const Perfildados = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const response = await axios.get("http://localhost:3000/users/dados", {
        headers,
      });

      setPerfil(response.data);
    } catch (error) {
      alert("Erro ao buscar dados");
    }
  };

  useEffect(() => {
    Perfildados();
  }, []);

  useEffect(() => {
    if (perfil.email) setEmail(perfil.email);
  }, [perfil]);

  useEffect(() => {
    const hasFormChanged = () => {
      return email !== perfil.email || senha !== "" || senhaError !== "";
    };

    setHasChanged(hasFormChanged());
  }, [email, senha, senhaError, perfil]);

  return (
    <>
      {contextHolder}

      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "black",
          }}
        >
          <Image width={100} src={image} preview={false} />
          <Menu
            mode="inline"
            style={{ backgroundColor: "black" }}
            defaultSelectedKeys={["4"]}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: 200,
          }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          />
          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "initial",
            }}
          >
            <div
              style={{
                padding: 24,
                textAlign: "left",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <p>Editar dados pessoais:</p>
              </div>
              <Form layout="vertical">
                <Form.Item
                  label="Email"
                  validateStatus={errors.email ? "error" : ""}
                  help={errors.email}
                >
                  <Input
                    maxLength={50}
                    type="email"
                    placeholder="Email"
                    value={email}
                    style={{ border: "1px solid black" }}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Senha"
                  validateStatus={errors.senha ? "error" : ""}
                  help={errors.senha}
                >
                  <Input
                    maxLength={50}
                    minLength={6}
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    style={{ border: "1px solid black" }}
                    onChange={(e) => {
                      setSenha(e.target.value);
                    }}
                    onBlur={() => {
                      if (senha.length > 0 && senha.length < 6) {
                        setSenhaError("A senha deve ter pelo menos 6 caracteres");
                      } else {
                        setSenhaError("");
                      }
                    }}
                  />
                </Form.Item>
              </Form>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingTop: "24px",
                }}
              >
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#00B2FF",
                    color: "black",
                  }}
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>

                <Button
                  type="primary"
                  disabled={!hasChanged}
                  style={{
                    backgroundColor: hasChanged ? "#00B2FF" : "white",
                    color: hasChanged ? "black" : "gray",
                    marginLeft: "10px",
                  }}
                  onClick={handleLogin}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}></Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default MudarSenha;
