import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Layout, Menu, theme, Modal, message, Button, Image } from "antd";
import { Link, useNavigate } from "react-router-dom";
import image from "../../components/Screenshot_50.png";
import { ExclamationCircleOutlined } from "@ant-design/icons"

const { Header, Content, Footer, Sider } = Layout;

const Home = ({ setVagasData, logintoken }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [vagas, setVagas] = useState([]);
  const [vagasCand, setVagasCand] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVagaId, setSelectedVagaId] = useState(null);

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

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const pegaVaga = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const response = await axios.get("http://localhost:3000/vagas/", {
        headers,
      });

      setVagas(response.data);
    } catch (error) {}
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
      setVagasCand(response.data);
    } catch (error) {}
  };

  const masiinfovaga = (vagadata) => {
    setVagasData(vagadata);
    navigate("/Mais-Informações");
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

      setIsModalOpen(false);
      success();
      pegaVaga();
      pegaVagaCans();
    } catch (error) {
      warning();
    }
  };

  useEffect(() => {
    pegaVaga();
    pegaVagaCans();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        backgroundColor: "red",
      }}
    >
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
                textAlign: "center",
              }}
            >
              <span style={{ flex: 1, textAlign: "center", fontSize: 20, marginBottom:23 }}>
                Vagas Abertas:
              </span>
            </div>

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
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                }}
              >
                {vagas.length === 0 ||
                vagas.every((vaga) =>
                  vagasCand.some((v) => v.vagas_id === vaga.id)
                ) ? (
                  <div
                    style={{
                      gridColumn: "span 2",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                      marginLeft: "5vh",
                    }}
                  >
                    <p>
                    <ExclamationCircleOutlined />    Não há vagas disponíveis para se candidatar no momento. 
                    </p>
                  </div>
                ) : (
                  vagas.map((vaga, key) => {
                    const isVagaCandidatada = vagasCand.some(
                      (v) => v.vagas_id === vaga.id
                    );

                    if (!isVagaCandidatada) {
                      return (
                        <Card
                          title={vaga.nome}
                          bordered={false}
                          style={{
                            border: "1px solid black",
                            marginBottom: "10px",
                          }}
                          key={key}
                        >
                          <p style={{ fontWeight: "bold" }}>
                            {vaga.tipo_de_vaga.tipo} - {vaga.local}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button
                              type="primary"
                              style={{
                                backgroundColor: "white",
                                color: "#00B2FF",
                              }}
                              onClick={() => masiinfovaga(vaga)}
                            >
                              Mais detalhes
                            </Button>
                            <Button
                              type="primary"
                              style={{
                                backgroundColor: "black",
                                color: "white",
                              }}
                              onClick={() => {
                                setSelectedVagaId(vaga.id);
                                showModal();
                              }}
                            >
                              Candidatar-se
                            </Button>
                          </div>
                          <Modal
                            title="Candidatar-se"
                            visible={isModalOpen}
                            onOk={() => handleCandidatarClick(selectedVagaId)}
                            onCancel={handleCancel}
                          >
                            {selectedVagaId && (
                              <>
                                {vagas.map((vaga) => {
                                  if (vaga.id === selectedVagaId) {
                                    return (
                                      <div key={vaga.id}>
                                        <p>
                                          Você está prestes a se candidatar para
                                          a vaga: {vaga.nome}
                                        </p>
                                        <p>Deseja continuar?</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </>
                            )}
                          </Modal>
                        </Card>
                      );
                    } else {
                      return null;
                    }
                  })
                )}
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
    </div>
  );
};
export default Home;
