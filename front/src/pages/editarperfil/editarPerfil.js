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
  message,
  Form,
} from "antd";
import { useNavigate } from "react-router-dom";
import image from "../../components/Screenshot_50.png";
import InputMask from "react-input-mask";

const { Header, Content, Sider, Footer } = Layout;
const { Option } = Select;

const EditarPerfil = ({ logintoken }) => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({});
  const [fileName, setFileName] = useState("");
  const [base64, setBase64] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [endereco, setEndereco] = useState("");
  const [dt_nascimento, setDt_nascimento] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [sexo, setSexo] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  const erroMaxtamanho = () => {
    messageApi.open({
      type: "error",
      content:
        "Erro ao adicionar currículo: O arquivo excede o tamanho máximo de 1 MB",
    });
  };

  const erroCurriculo = () => {
    messageApi.open({
      type: "error",
      content:
        "Erro ao adicionar currículo: Somente arquivos PDF são permitidos",
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 1048576;

    if (file && file.type === "application/pdf") {
      if (file.size <= maxSize) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => setBase64(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
        setHasChanged(true);
      } else {
        erroMaxtamanho();
      }
    } else {
      erroCurriculo();
    }
  };

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!nome) newErrors.nome = "Nome é obrigatório";
    if (!cpf) newErrors.cpf = "CPF é obrigatório";
    if (!celular) newErrors.celular = "Celular é obrigatório";
    if (!endereco) newErrors.endereco = "Endereço é obrigatório";
    if (!dt_nascimento)
      newErrors.dt_nascimento = "Data de Nascimento é obrigatória";
    if (!estadoCivil) newErrors.estadoCivil = "Estado Civil é obrigatório";
    if (!sexo) newErrors.sexo = "Sexo é obrigatório";
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
        CPF: cpf,
        celular: celular,
        estado_civil: estadoCivil,
        dt_nascimento: dt_nascimento,
        sexo: sexo,
        endereco: endereco,
        curriculo: base64,
        email: email,
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
      erroDados();
    }
  };

  const handleChangeSexo = (value) => {
    setSexo(value);
    setHasChanged(true);
  };

  const handleChangeEstadoCivil = (value) => {
    setEstadoCivil(value);
    setHasChanged(true);
  };

  useEffect(() => {
    Perfildados();
  }, []);

  function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");

    if (cpf.length !== 11 || /^(.)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    let remainder;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i);
    }

    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i);
    }

    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[10])) return false;

    return true;
  }

  useEffect(() => {
    if (perfil.email) setEmail(perfil.email);
    if (perfil.CPF) setCpf(perfil.CPF);
    if (perfil.nome) setNome(perfil.nome);
    if (perfil.celular) setCelular(perfil.celular);
    if (perfil.endereco) setEndereco(perfil.endereco);
    if (perfil.dt_nascimento) setDt_nascimento(perfil.dt_nascimento);
    if (perfil.estado_civil) setEstadoCivil(perfil.estado_civil);
    if (perfil.sexo) setSexo(perfil.sexo);
    if (perfil.curriculo) setBase64(perfil.curriculo);
  }, [perfil]);

  useEffect(() => {
    const hasFormChanged = () => {
      return (
        email !== perfil.email ||
        cpf !== perfil.CPF ||
        nome !== perfil.nome ||
        celular !== perfil.celular ||
        endereco !== perfil.endereco ||
        dt_nascimento !== perfil.dt_nascimento ||
        estadoCivil !== perfil.estado_civil ||
        sexo !== perfil.sexo ||
        base64 !== ""
      );
    };

    setHasChanged(hasFormChanged());
  }, [
    email,
    cpf,
    nome,
    celular,
    endereco,
    dt_nascimento,
    estadoCivil,
    sexo,
    base64,
    perfil,
  ]);

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
                  label="Nome"
                  validateStatus={errors.nome ? "error" : ""}
                  help={errors.nome}
                >
                  <Input
                    maxLength={50}
                    style={{ border: "1px solid black" }}
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      setHasChanged(true);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="CPF"
                  validateStatus={errors.cpf ? "error" : ""}
                  help={errors.cpf}
                >
                  <InputMask
                    mask="999.999.999-99"
                    value={cpf}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setCpf(value);
                      setHasChanged(true);
                    }}
                    onBlur={(e) => {
                      if (cpf.length !== 11 || !validateCPF(cpf)) {
                        setErrors({
                          ...errors,
                          cpf: "Por favor, insira um CPF válido.",
                        });
                      } else {
                        setErrors({ ...errors, cpf: "" });
                      }
                    }}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        placeholder="CPF"
                        style={{ border: "1px solid black" }}
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
                    mask="(99)99999-9999"
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
                    value={endereco}
                    style={{ border: "1px solid black" }}
                    onChange={(e) => {
                      setEndereco(e.target.value);
                      setHasChanged(true);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Data de Nascimento"
                  validateStatus={errors.dt_nascimento ? "error" : ""}
                  help={errors.dt_nascimento}
                >
                  <InputMask
                    mask="99/99/9999"
                    value={dt_nascimento}
                    onChange={(e) => {
                      setDt_nascimento(e.target.value);
                      setHasChanged(true);
                    }}
                  >
                    {(inputProps) => (
                      <Input
                        {...inputProps}
                        placeholder="Data de Nascimento"
                        style={{ border: "1px solid black" }}
                      />
                    )}
                  </InputMask>
                </Form.Item>

                <Form.Item
                  label="Estado Civil"
                  validateStatus={errors.estadoCivil ? "error" : ""}
                  help={errors.estadoCivil}
                >
                  <Select
                    placeholder="Escolha uma opção"
                    onChange={handleChangeEstadoCivil}
                    style={{
                      width: 200,
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                    value={estadoCivil}
                  >
                    <Option value="Solteiro">Solteiro(a)</Option>
                    <Option value="Casado">Casado(a)</Option>
                    <Option value="Divorciado">Divorciado(a)</Option>
                    <Option value="Viúvo">Viúvo(a)</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Gênero"
                  validateStatus={errors.sexo ? "error" : ""}
                  help={errors.sexo}
                >
                  <Select
                    id="gender-select"
                    placeholder="Escolha uma opção"
                    onChange={handleChangeSexo}
                    style={{
                      width: 200,
                      border: "1px solid black",
                      borderRadius: 5,
                      color: "black",
                    }}
                    value={sexo}
                  >
                    <Option value="" disabled>
                      Escolha uma opção
                    </Option>
                    <Option value="Masculino">Masculino</Option>
                    <Option value="Feminino">Feminino</Option>
                    <Option value="Outro">Outro</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <p>Adicione seu Currículo:</p>
                  <input type="file" onChange={handleFileChange} />
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

export default EditarPerfil;
