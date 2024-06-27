import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Layout, Menu, theme, Modal, Button, message, Image } from "antd";
import { Link, useNavigate } from "react-router-dom";
import image from "../../../components/Screenshot_50.png";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const HomeAdm = ({ setVagasData, logintoken }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const [vagas, setVagas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVagaId, setSelectedVagaId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const erro = () => {
    messageApi.open({
      type: "error",
      content: "Erro ao excluir vaga",
    });
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Vaga excluida com sucesso",
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

      const response = await axios.get("http://localhost:3000/vagas/cridas", {
        headers,
      });
      setVagas(response.data);
    } catch (error) {}
  };

  const masiinfovaga = (vagadata) => {
    setVagasData(vagadata);
    navigate("/Mais-InformaçõesAdmim");
  };

  const DeletarVaga = async (vagaId) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const response = await axios.delete(
        `http://localhost:3000/vagas/${vagaId}`,
        { headers }
      );

      setIsModalOpen(false);
      success();
      pegaVaga();
    } catch (error) {
      erro();
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
              fontSize: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
              <div style={{ display: "flex", marginRight: "100px" }}>
                <div style={{ marginLeft: "10px", marginBottom: "10px" }}>
                  <Button
                    type="primary"
                    style={{ backgroundColor: "black", color: "white" }}
                    onClick={() => navigate("/criarVaga")}
                  >
                    Criar nova Vaga +
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                }}
              >
                {vagas.length === 0 ? (
                  <div
                    style={{
                      gridColumn: "span 2",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                    }}
                  >
                    <p> <ExclamationCircleOutlined /> Nenhuma vaga criada.</p>
                  </div>
                ) : (
                  vagas.map((vaga, key) => (
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
                          style={{ backgroundColor: "white", color: "#00B2FF" }}
                          onClick={() => masiinfovaga(vaga)}
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
                          Excluir vaga
                        </Button>
                      </div>
                      <Modal
                        title="Excluir vaga"
                        visible={isModalOpen}
                        onOk={() => DeletarVaga(selectedVagaId)}
                        onCancel={handleCancel}
                      >
                        {selectedVagaId && (
                          <>
                            {vagas.map((vaga) => {
                              if (vaga.id === selectedVagaId) {
                                return (
                                  <>
                                    <p>
                                      Você está prestes a excluir a vaga:{" "}
                                      {vaga.nome}
                                    </p>
                                    <p>Deseja continuar?</p>
                                  </>
                                );
                              }
                              return null;
                            })}
                          </>
                        )}
                      </Modal>
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
export default HomeAdm;
