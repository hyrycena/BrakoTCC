import React, { useState, useEffect } from "react";
import axios from "axios";
import { Flex, Layout, Input, Image, Button, Checkbox, message } from "antd";
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
  marginLeft: "350px",
  marginRight: "350px",
  marginBottom: "50px",
  minHeight: "80vh",
  backgroundColor: "#ffffff",
};

const CriarConta = ({ setLoginToken }) => {
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [confirmsenha, setConfirmPassword] = useState("");
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [selectedTiponome, setSelectedTipoNome] = useState();
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const [tipo, setTipo] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [emailDuplicateError, setEmailDuplicateError] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordMismatchError, setPasswordMismatchError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Conta criada com sucesso",
    });
  };

  const erro = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao criar conta",
    });
  };

  const erroDados = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao buscar dados",
    });
  };

  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "Email já está em uso",
    });
  };

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCheckboxChange = (id, name) => {
    setSelectedTipo(id);
    setSelectedTipoNome(name);
  };

  const criarConta = async () => {
    if (!validarEmail(email)) {
      setEmailError("Email inválido");
      return;
    }

    if (senha.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/criar", {
        email: email,
        senha: senha,
        tipo_id: selectedTipo,
        tipo: selectedTiponome,
      });

      success();

      setTimeout(() => {
        handleLogin();
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setEmailDuplicateError(error.response.data.error);
        warning();
      } else {
        erro();
      }
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/tipo-usuario")
      .then((response) => {
        setTipo(response.data);
      })
      .catch(() => {
        erroDados();
      });
  }, []);

  useEffect(() => {
    const isFormValid =
      email !== "" &&
      senha !== "" &&
      confirmsenha !== "" &&
      senha === confirmsenha &&
      selectedTipo !== null &&
      validarEmail(email) &&
      senha.length >= 6; 
    setIsDisabled(!isFormValid);
  }, [email, senha, confirmsenha, selectedTipo]);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: email,
        senha: senha,
      });

      if (response) {
        if (selectedTiponome === "Empresa") {
          navigate("/Editarperfil-adm");
          setLoginToken(response.data.token);
        } else {
          navigate("/Editarperfil");
          setLoginToken(response.data.token);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      {contextHolder}
      <Flex>
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
              <div>
                <span style={{ fontWeight: "bold", justifyContent: "left" }}>
                  Email
                </span>
                <Input
                  maxLength={50}
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
                    setEmailDuplicateError("");
                  }}
                />
                {emailError && (
                  <span style={{ color: "red" }}>{emailError}</span>
                )}
                {emailDuplicateError && (
                  <span style={{ color: "red" }}>{emailDuplicateError}</span>
                )}
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>Senha</span>
                <Input.Password
                  maxLength={50}
                  minLength={6}
                  style={{ padding: "1%" }}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.length < 6) {
                      setPasswordError("A senha deve ter pelo menos 6 caracteres");
                    } else {
                      setPasswordError("");
                    }
                  }}
                />
                {passwordError && (
                  <span style={{ color: "red" }}>{passwordError}</span>
                )}
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>Confirmar senha</span>
                <Input.Password
                  maxLength={50}
                  minLength={6}
                  style={{ padding: "1%" }}
                  placeholder="Confirme sua senha"
                  value={confirmsenha}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (senha !== e.target.value && e.target.value !== "") {
                      setPasswordMismatchError("As senhas não coincidem");
                    } else {
                      setPasswordMismatchError("");
                    }
                  }}
                />
                {passwordMismatchError && (
                  <span style={{ color: "red" }}>{passwordMismatchError}</span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "bold", justifyContent: "left" }}>
                O que você vai ser:
              </span>
              {tipo.map((tipos, key) => (
                <span key={key} style={{ fontWeight: "bold" }}>
                  <Checkbox
                    style={{ color: "#f1f1f1f1", fontWeight: "bold" }}
                    checked={selectedTipo === tipos.id}
                    onChange={() => handleCheckboxChange(tipos.id, tipos.name)}
                  >
                    {tipos.name}
                  </Checkbox>
                </span>
              ))}
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
                  width: "20%",
                  backgroundColor: "lightgrey",
                  color: "black",
                }}
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
              <Button
                disabled={isDisabled}
                type="primary"
                style={{
                  backgroundColor: isDisabled ? "lightgrey" : "#00B2FF",
                  color: isDisabled ? "gray" : "black",
                  width: "20%",
                }}
                onClick={criarConta}
              >
                Salvar
              </Button>
            </div>
          </Content>
        </Layout>
      </Flex>
    </>
  );
};

export default CriarConta;
