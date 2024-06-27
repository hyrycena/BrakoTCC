/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Layout, Menu, theme, Image, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import image from "../../../components/Screenshot_50.png";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const MaisInfoCandidato = ({ usersData }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [status, setStatus] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

  const base64 = usersData.users.curriculo;
  const fileName = `Currículo ${usersData.users.nome}.pdf`;

  const base64ToFile = (base64, fileName) => {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: "application/octet-stream" });
    const file = new File([blob], fileName);

    return file;
  };

  const file = base64ToFile(base64, fileName);

  const downloadFile = (file) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (usersData.users.curriculo) {
      setStatus("Adicionado");
      setIsDisabled(false);
    } else {
      setStatus("Não adicionado");
      setIsDisabled(true);
    }
  }, [usersData.users]);

  return (
    <>
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
            <Button onClick={() => navigate("/Candidatos")} type="primary">
              <ArrowLeftOutlined />
            </Button>

            <div
              style={{
                display: "flex",
                flexDirection: "column",

                justifyContent: "center",
                marginTop: "10px",
                fontSize: 20,
              }}
            >
              <span style={{ textAlign: "center", marginBottom: "5px" }}>
                Dados do candidato: {usersData.users.nome}{" "}
              </span>
              <span style={{ textAlign: "center" }}>
                Vaga: {usersData.vagas.nome}
              </span>

              <div>
                <p>Nome: {usersData.users.nome}</p>
                <p>CPF: {usersData.users.CPF}</p>
                <p>Data de nascimento: {usersData.users.dt_nascimento}</p>
                <p>Gênero: {usersData.users.sexo}</p>
                <p>Email: {usersData.users.email}</p>
                <p>Celular: {usersData.users.celular}</p>
                <p>Estado civil: {usersData.users.estado_civil}</p>
                <p>Endereço: {usersData.users.endereco}</p>
                <p>Currículo: {status}</p>
                <Button
                  disabled={isDisabled}
                  type="primary"
                  style={{
                    border: "1px solid black",
                    backgroundColor: "#00B2FF",
                    color: "black",
                  }}
                  onClick={() => downloadFile(file)}
                >
                  Baixar currículo
                </Button>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default MaisInfoCandidato;
