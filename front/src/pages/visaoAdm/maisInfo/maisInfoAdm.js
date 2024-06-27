/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Layout, Menu, theme, Image, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import image from "../../../components/Screenshot_50.png";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

function quebrarString(str) {
  const limite = 100;
  if (str.length <= limite) {
    return str;
  } else {
    const partes = [];
    let inicio = 0;
    while (inicio < str.length) {
      partes.push(str.slice(inicio, inicio + limite));
      inicio += limite;
    }
    return partes.join("\n");
  }
}

const MaisInfoAdm = ({ vagasData, logintoken }) => {
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [vagas, setVagas] = useState([]);

  const editarVagas = (vagadata) => {
    setVagas(vagadata);
    navigate("/editarVagas");
  };

  return (
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
          <Button onClick={() => navigate("/HomeAdmin")} type="primary">
            <ArrowLeftOutlined />
          </Button>
          <div
            style={{
              padding: 24,
              textAlign: "left",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              fontSize: 20,
            }}
          >
            <>
              <div style={{ textAlign: "center", padding: "25px" }}>
                <p style={{ fontWeight: "bold" }}>
                  Informações da vaga: {vagasData.nome}
                </p>
              </div>
              <div tyle={{ textAlign: "center", marginLeft: "250px" }}>
                <p style={{ fontWeight: "bold" }}>
                  Salario: R${vagasData.salario}
                </p>
                <p style={{ fontWeight: "bold" }}>Local: {vagasData.local}</p>
                <p style={{ fontWeight: "bold" }}>
                  Tipo de vaga: {vagasData.tipo_de_vaga.tipo}
                </p>
                <p style={{ fontWeight: "bold" }}>
                  Descrição da vaga: <br />
                  {quebrarString(vagasData.descricao)}
                </p>
              </div>

              <Button
                type="primary"
                style={{
                  border: "1px solid black",
                  backgroundColor: "#00B2FF",
                  color: "black",
                }}
                onClick={editarVagas}
              >
                Editar vaga
              </Button>
            </>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MaisInfoAdm;
