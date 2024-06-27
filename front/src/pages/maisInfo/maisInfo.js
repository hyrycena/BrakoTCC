/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Layout, Menu, theme, Image, Button, Modal } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import image from "../../components/Screenshot_50.png";
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

const MaisInfo = ({ vagasData, logintoken }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vagas, setVagas] = useState([]);
  const [vagasInfo, setVagasInfo] = useState([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Candidatado com sucesso",
    });
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "Você já se candidatou a essa vaga",
    });
  };

  const handleCandidatarClick = async (vagaId) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const requestBody = {
        vagas_id: vagaId,
      };

      const response = await axios.post(
        "http://localhost:3000/vagas-canditadas/criar-canditada",
        requestBody,
        { headers }
      );
      success();
      setTimeout(() => {
        navigate("/Home");
      }, 1000);
    } catch (error) {
      warning();
    }
  };

  const pegaVagaCans = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const response = await axios.get(
        "http://localhost:3000/vagas-canditadas/",
        {
          headers,
        }
      );
      setVagas(response.data);
    } catch (error) { }
  };

  const vagaInfo = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const response = await axios.get(
        `http://localhost:3000/vagas/${vagasData.id}`,
        {
          headers,
        }
      );
      if (response) {

        setVagasInfo(response.data);
      }
    } catch (error) { }
  };


  const isVagaCandidatada = vagas.some(
    (vaga) => vaga.vagas_id === vagasData.id
  );

  useEffect(() => {
    pegaVagaCans();
    vagaInfo()
  }, []);

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
              }
            ]}
          />
        </Sider>
        <Layout
          style={{
            marginLeft: 200,
            fontSize:20
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
            <Button onClick={() => navigate(-1)} type="primary">
              <ArrowLeftOutlined />
            </Button>
            <div
              style={{
                padding: 24,
                textAlign: "left",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <>
                <div style={{ textAlign: "center", padding: "25px" }}>
                  <p style={{ fontWeight: "bold" }}>
                    Informações da vaga: {vagasInfo.nome}
                  </p>
                </div>
                <div tyle={{ textAlign: "center", marginLeft: "250px" }}>

                  {vagasInfo.users && (
                    <p style={{ fontWeight: "bold" }}>Empresa: {vagasInfo.users.nome}</p>
                  )}

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

                {!isVagaCandidatada && (
                  <Button
                    type="primary"
                    style={{ backgroundColor: "#00B2FF", color: "black" }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Candidatar-se
                  </Button>
                )}
              </>
            </div>
            <Modal
              title="Candidatar-se"
              visible={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={[
                <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>,
                <Button
                  key="candidatar"
                  type="primary"
                  onClick={() => handleCandidatarClick(vagasData.id)}
                >
                  Continuar
                </Button>,
              ]}
            >
              <p>
                Você está prestes a se candidatar para a vaga: {vagasData.nome}
              </p>
              <p>Deseja continuar?</p>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default MaisInfo;
