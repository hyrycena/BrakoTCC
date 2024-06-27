import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Layout, Menu, theme, Image, Button, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import image from "../../../components/Screenshot_50.png";
import InputMask from "react-input-mask";

const { Header, Content, Sider, Footer } = Layout;

const EditarPerfilAdmin = ({ logintoken }) => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({});
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [endereco, setEndereco] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const erroDados = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao buscar dados:",
    });
  };

  const erro = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao atualizar dados",
    });
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Dados atualizados com sucesso",
    });
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!nome) newErrors.nome = "Nome é obrigatório";
    if (!cnpj) newErrors.cnpj = "CNPJ é obrigatório";
    if (!celular) newErrors.celular = "Celular é obrigatório";
    if (!endereco) newErrors.endereco = "Endereço é obrigatório";
    if (!email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validarEmail(email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const editarDados = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const data = {
        nome: nome,
        CPF: cnpj,
        celular: celular,
        endereco: endereco,
        email: email,
      };

      await axios.put("http://localhost:3000/users", data, { headers });

      success();
      setTimeout(() => {
        navigate("/Perfil-adm");
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
      erroDados();
    }
  };

  useEffect(() => {
    Perfildados();
  }, []);

  const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/\D/g, "");

    if (cnpj.length !== 14) return false;

    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  };

  useEffect(() => {
    if (perfil.email) setEmail(perfil.email);
    if (perfil.CPF) setCnpj(perfil.CPF);
    if (perfil.nome) setNome(perfil.nome);
    if (perfil.celular) setCelular(perfil.celular);
    if (perfil.endereco) setEndereco(perfil.endereco);
  }, [perfil]);

  useEffect(() => {
    const hasFormChanged = () => {
      return (
        email !== perfil.email ||
        cnpj !== perfil.CPF ||
        nome !== perfil.nome ||
        celular !== perfil.celular ||
        endereco !== perfil.endereco
      );
    };

    setHasChanged(hasFormChanged());
  }, [email, cnpj, nome, celular, endereco, perfil]);

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
                  fontSize: 20,
                }}
              >
                <p>Editar dados da Empresa: {perfil.nome }</p>
              </div>
              <Form layout="vertical">
                <Form.Item
                  label="Nome"
                  validateStatus={errors.nome ? "error" : ""}
                  help={errors.nome}
                >
                  <Input
                    maxLength={50}
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    style={{ border: "1px solid black" }}
                    onChange={(e) => {
                      setNome(e.target.value);
                      setHasChanged(true);
                    }}
                  />
                </Form.Item>
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
                      setHasChanged(true);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="CNPJ"
                  validateStatus={errors.cnpj ? "error" : ""}
                  help={errors.cnpj}
                >
                  <InputMask
                    mask="99.999.999/9999-99"
                    value={cnpj}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCnpj(value);
                      setHasChanged(true);
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (!validateCNPJ(value)) {
                        setErrors({
                          ...errors,
                          cnpj: "Por favor, insira um CNPJ válido.",
                        });
                      } else {
                        setErrors({ ...errors, cnpj: "" });
                      }
                    }}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        type="text"
                        style={{ border: "1px solid black" }}
                        placeholder="CNPJ"
                      />
                    )}
                  </InputMask>
                </Form.Item>

                <Form.Item
                  label="Celular"
                  validateStatus={errors.celular ? "error" : ""}
                  help={errors.celular}
                >
                  <InputMask
                    mask="(99) 99999-9999"
                    value={celular}
                    onChange={(e) => {
                      setCelular(e.target.value);
                      setHasChanged(true);
                    }}
                    onBlur={(e) => {
                      const unmaskedValue = e.target.value.replace(/\D/g, "");
                      if (
                        unmaskedValue.length < 10 ||
                        unmaskedValue.length > 11
                      ) {
                        setErrors({
                          ...errors,
                          celular:
                            "Por favor, insira um número de celular válido.",
                        });
                      } else {
                        setErrors({ ...errors, celular: "" });
                      }
                    }}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        placeholder="Celular"
                        style={{ border: "1px solid black" }}
                      />
                    )}
                  </InputMask>
                </Form.Item>
                <Form.Item
                  label="Endereço"
                  validateStatus={errors.endereco ? "error" : ""}
                  help={errors.endereco}
                >
                  <Input
                    maxLength={50}
                    type="text"
                    placeholder="Endereço"
                    style={{ border: "1px solid black" }}
                    value={endereco}
                    onChange={(e) => {
                      setEndereco(e.target.value);
                      setHasChanged(true);
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
                    border: "1px solid black",
                    backgroundColor: hasChanged ? "#00B2FF" : "white",
                    color: hasChanged ? "black" : "gray",
                  }}
                  onClick={editarDados}
                  disabled={!hasChanged}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          ></Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default EditarPerfilAdmin;
