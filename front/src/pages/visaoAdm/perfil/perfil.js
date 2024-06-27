/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Layout, Menu, theme, Image, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import image from "../../../components/Screenshot_50.png";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const PerfilAdmin = ({ logintoken }) => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const erro = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao buscar dados",
    });
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  return (
    <>
      {contextHolder}

      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
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
          <div className="logo">
            <Image width={100} src={image} preview={false} />
          </div>
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
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              <Button
                onClick={() => navigate("/HomeAdmin")}
                type="primary"
                style={{ marginBottom: "16px" }}
              >
                <ArrowLeftOutlined />
              </Button>
              <span
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 20,
                  marginBottom: 23,
                }}
              >
                Dados da empresa: {perfil.nome}
              </span>
            </div>
            <div
              style={{
                padding: 24,
                fontSize:15,
                textAlign: "left",
                fontWeight: "bold",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <p>Nome: {perfil.nome}</p>
              <p>CNPJ: {perfil.CPF}</p>
              <p>Email: {perfil.email}</p>
              <p>Celular: {perfil.celular}</p>
              <p>Endereço: {perfil.endereco}</p>
            </div>
            <Button
              type="primary"
              style={{
                border: "1px solid black",
                backgroundColor: "#00B2FF",
                color: "black",
              }}
              onClick={() => navigate("/Editarperfil-adm")}
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
        <style jsx>{`
          @media (max-width: 768px) {
            .ant-layout-sider {
              display: none;
            }
            .ant-layout {
              margin-left: 0 !important;
            }
          }
        `}</style>
      </Layout>
    </>
  );
};

export default PerfilAdmin;
