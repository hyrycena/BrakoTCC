import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Card, Layout, Menu, theme, Modal, Button, message, Image } from "antd";
import image from "../../components/Screenshot_50.png";
import { ArrowLeftOutlined ,ExclamationCircleOutlined} from "@ant-design/icons";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;
const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const VagasCandidatadas = ({ setVagasData, logintoken }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedVagaId, setSelectedVagaId] = useState(null);
  const [vagas, setVagas] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sortedVagas = [...vagas].sort((a, b) => b.vagas.ativo - a.vagas.ativo);
  const [messageApi, contextHolder] = message.useMessage();

  const erro = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao buscar vagas",
    });
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Candidatura cancelada com sucesso",
    });
  };

  const erroDescandidatar = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao cancelar candidatura vaga",
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    DeletarVaga();
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

      const response = await axios.get(
        "http://localhost:3000/vagas-canditadas/",
        { headers }
      );

      setVagas(response.data);
    } catch (error) {
      erro();
    }
  };

  const masiinfovaga = (vagadata) => {
    setVagasData(vagadata);
    navigate("/Mais-Informações");
  };

  const DeletarVaga = async (vagaId) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const response = await axios.delete(
        `http://localhost:3000/vagas-canditadas/${vagaId}`,
        { headers }
      );

      setIsModalOpen(false);
      success();
      pegaVaga();
    } catch (error) {
      erroDescandidatar();
    }
  };

  useEffect(() => {
    pegaVaga();
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
              }}
            >
              <Button onClick={() => navigate("/home")} type="primary">
                <ArrowLeftOutlined />
              </Button>
              <span style={{ flex: 1, textAlign: "center", fontSize:20 , marginBottom:23 }}>
                Vagas Candidatadas:
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
                  overflowY: "auto",
                  padding: "0 10px",
                }}
              >
                {sortedVagas.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                      marginLeft: "5vh",
                      fontSize:15 
                    }}
                  >
                    <p><ExclamationCircleOutlined />  Você não tem vagas candidatadas.</p>
                  </div>
                ) : (
                  sortedVagas.map((vaga, key) => (
                    <Card
                      title={vaga.vagas.ativo ? vaga.vagas.nome : ""}
                      bordered={false}
                      style={{
                        border: `1px solid ${
                          vaga.vagas.ativo ? "black" : "grey"
                        }`,
                        marginBottom: "20px",
                        color: vaga.vagas.ativo ? "black" : "grey",
                      }}
                      key={key}
                    >
                      <p style={{ fontWeight: "bold" }}>
                        {vaga.vagas.ativo
                          ? `${vaga.vagas.tipo_de_vaga.tipo} - ${vaga.vagas.local}`
                          : `${vaga.vagas.nome}: Vaga cancelada`}
                      </p>

                      <div style={{ display: "flex", justifyContent: "right" }}>
                        {vaga.vagas.ativo ? (
                          <>
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
                                onClick={() => masiinfovaga(vaga.vagas)}
                              >
                                Mais detalhes
                              </Button>

                              <Button
                                type="primary"
                                style={{
                                  border: "1px solid black",
                                  backgroundColor: "red",
                                  color: "white",
                                }}
                                onClick={() => {
                                  setSelectedVagaId(vaga.id);
                                  showModal();
                                }}
                              >
                                Cancelar candidatura
                              </Button>
                            </div>

                            <Modal
                              title="Cancelar candidatura"
                              visible={isModalOpen}
                              onOk={() => DeletarVaga(selectedVagaId)}
                              onCancel={handleCancel}
                            >
                              {selectedVagaId && (
                                <>
                                  {vagas.map((vaga) => {
                                    if (vaga.id === selectedVagaId) {
                                      return (
                                        <div key={vaga.id}>
                                          <p>
                                            Você está prestes a cancelar a
                                            candidatura à vaga:{" "}
                                            {vaga.vagas.nome}
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
                          </>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button
                              type="primary"
                              style={{
                                border: "1px solid black",
                                backgroundColor: "grey",
                                color: "white",
                              }}
                              onClick={() => {
                                DeletarVaga(vaga.id);
                              }}
                            >
                              Remover vaga
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
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
    </>
  );
};
export default VagasCandidatadas;
