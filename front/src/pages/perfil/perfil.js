/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Layout, Menu, theme, Image, Button, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import image from "../../components/Screenshot_50.png";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const Perfil = ({ logintoken }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({});
  const [status, setStutus] = useState("");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const erro = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao buscar dados",
    });
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
      erro();
    }
  };

  useEffect(() => {
    Perfildados();
  }, []);

  useEffect(() => {
    if (perfil.curriculo) {
      setStutus("Adicionado");
    } else {
      setStutus("Nao adicionado");
    }
  }, [perfil]);

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
                  <Link style={{ color: "white" }} to="/Home">
                    Vagas Disponiveis
                  </Link>
                ),
              },
              {
                key: "2",

                label: (
                  <Link style={{ color: "white" }} to="/Vagas-Candidatas">
                    Vagas Candidatadas
                  </Link>
                ),
              },
              {
                key: "3",

                label: (
                  <Link style={{ color: "white" }} to="/Perfil">
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
              },
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
              fontSize: 15,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={() => navigate("/home")} type="primary">
                <ArrowLeftOutlined />
              </Button>
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 20,
                  marginBottom: 23,

                }}
              >
                <p>
                  
                Dados Pessoais:
                </p>
              </div>
            </div>

            <div
              style={{
                padding: 24,
                fontWeight: "bold",
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
              ></div>

              <p>Nome: {perfil.nome}</p>
              <p>CPF: {perfil.CPF}</p>
              <p>Data de nascimento: {perfil.dt_nascimento}</p>
              <p>Gênero: {perfil.sexo}</p>
              <p>Celular: {perfil.celular}</p>
              <p>Estado civil: {perfil.estado_civil}</p>
              <p>Endereço: {perfil.endereco}</p>
              <p>Currículo: {status}</p>
            </div>

            <Button
              type="primary"
              style={{
                border: "1px solid black",
                backgroundColor: "#00B2FF",
                color: "black",
              }}
              onClick={() => navigate("/Editarperfil")}
            >
              Editar perfil
            </Button>
            <Button
              type="primary"
              style={{
                border: "1px solid black",
                backgroundColor: "#00B2FF",
                color: "black",
                marginLeft: "10px",
              }}
              onClick={() => navigate("/MudarSenha")}
            >
              Mudar Senha
            </Button>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Perfil;
