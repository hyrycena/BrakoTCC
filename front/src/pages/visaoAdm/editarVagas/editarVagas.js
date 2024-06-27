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
import { Link, useNavigate } from "react-router-dom";
import image from "../../../components/Screenshot_50.png";

const { Header, Content, Sider, Footer } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const EditarVagas = ({ vagasData, logintoken }) => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({});
  const [tiposDeVaga, setTiposDeVaga] = useState([]);
  const [nome, setNome] = useState("");
  const [local, setLocal] = useState("");
  const [salario, setSalario] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("");

  const [hasChanged, setHasChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const erroTipoVaga = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao obter tipos de vaga",
    });
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Vaga editada com sucesso",
    });
  };

  const erro = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao editar a vaga",
    });
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const createVaga = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const data = {
        nome,
        local,
        salario,
        descricao,
        tipo_de_vaga_id: tipoSelecionado,
      };

      await axios.put(`http://localhost:3000/vagas/${vagasData.id}`, data, {
        headers,
      });

      success();
      setTimeout(() => {
        navigate("/HomeAdmin");
      }, 1000);
    } catch (error) {
      erro();
    }
  };

  const handleChangeTipo = (value) => {
    setTipoSelecionado(value);
    setHasChanged(true);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    setHasChanged(true);
  };

  const getTiposDeVaga = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const response = await axios.get("http://localhost:3000/tipo-vaga/", {
        headers,
      });

      setTiposDeVaga(response.data);
    } catch (error) {
      erroTipoVaga();
    }
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;
  
    if (value.length > 9) {
      setErrors({ salario: "O salário não pode ter mais de 9 caracteres" });
      return;
    }
  
    if (!isNaN(value) && Number(value) >= 0) {
      setSalario(value);
      setErrors({ salario: null });
    } else if (Number(value) < 0) {
      setErrors({ salario: "O salário não pode ser negativo" });
    } else {
      setErrors({ salario: "O salário deve ser um número válido" });
    }
  };
  
  
  useEffect(() => {
    getTiposDeVaga();
  }, [logintoken]);

  useEffect(() => {
    if (vagasData.nome) setNome(vagasData.nome);
    if (vagasData.local) setLocal(vagasData.local);
    if (vagasData.salario) setSalario(vagasData.salario);
    if (vagasData.descricao) setDescricao(vagasData.descricao);
    if (vagasData.tipo_de_vaga) setTipoSelecionado(vagasData.tipo_de_vaga.id);
  }, [vagasData]);

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
            defaultSelectedKeys={["5"]}
            items={[
              {
                key: "1",

                label: (
                  <Link style={{ color: "white" }} to="/HomeAdmin">
                    Vagas
                  </Link>
                ),
              },
              {
                key: "2",

                label: (
                  <Link style={{ color: "white" }} to="/Candidatos">
                    Candidatados
                  </Link>
                ),
              },
              {
                key: "3",

                label: (
                  <Link style={{ color: "white" }} to="/Perfil-adm">
                    Perfil
                  </Link>
                ),
              },
              {
                key: "4",
                label: (
                  <Link style={{ color: "white" }} to="/">
                    Sair
                  </Link>
                ),
              }
            
            ]}

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
                <p>Editar dados da Vaga: {nome}</p>
              </div>
              <Form layout="vertical">
                <Form.Item
                  label="Nome"
                  validateStatus={errors.nome ? "error" : ""}
                  help={errors.nome}
                >
                  <Input
                    showCount
                    maxLength={45}
                    type="text"
                    style={{ border: "1px solid black" }}
                    placeholder="Nome"
                    value={nome}
                    onChange={handleChange(setNome)}
                  />
                </Form.Item>

                <Form.Item
                  label="Tipo da vaga"
                  validateStatus={errors.tipo ? "error" : ""}
                  help={errors.tipo}
                >
                  <Select
                    placeholder="Escolha uma opção"
                    onChange={handleChangeTipo}
                    style={{
                      width: 200,
                      border: "1px solid black",
                      borderRadius: 5,
                      color: "black",
                    }}
                    value={tipoSelecionado}
                  >
                    {tiposDeVaga.map((tipo) => (
                      <Option key={tipo.id} value={tipo.id}>
                        {tipo.tipo}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Local"
                  validateStatus={errors.local ? "error" : ""}
                  help={errors.local}
                >
                  <Input
                    type="text"
                    placeholder="Local"
                    showCount
                    maxLength={45}
                    style={{ border: "1px solid black" }}
                    value={local}
                    onChange={handleChange(setLocal)}
                  />
                </Form.Item>

                <Form.Item
                  label="Salário"
                  validateStatus={errors.salario ? "error" : ""}
                  help={errors.salario}
                >
                  <Input
                    type="number"
                    placeholder="Salário"
                    style={{ border: "1px solid black" }}
                    value={salario}
                    onChange={handleSalaryChange}
                  />
                </Form.Item>

                <Form.Item
                  label="Descrição da vaga"
                  validateStatus={errors.descricao ? "error" : ""}
                  help={errors.descricao}
                >
                  <TextArea
                    value={descricao}
                    onChange={handleChange(setDescricao)}
                    showCount
                    rows={4}
                    placeholder="Descrição da vaga"
                    maxLength={500}
                    style={{ border: "1px solid black" }}
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
                    backgroundColor: "#00B2FF",
                    color: "black",
                  }}
                  onClick={() => navigate("/HomeAdmin")}
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  style={{
                    border: "1px solid black",
                    marginLeft: "10px",
                    backgroundColor: hasChanged ? "#00B2FF" : "white",
                    color: hasChanged ? "black" : "gray",
                  }}
                  onClick={createVaga}
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

export default EditarVagas;
