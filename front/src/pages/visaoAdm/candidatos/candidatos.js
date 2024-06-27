import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Card, Layout, Menu, theme, Button, message, Image } from "antd";
import image from "../../../components/Screenshot_50.png";
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


const Candidatos = ({ logintoken, setUsersData }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [candidatos, setCandidatos] = useState([]);
  const navigate = useNavigate();
  const pegaVaga = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logintoken}`,
      };

      const response = await axios.get(
        "http://localhost:3000/vagas-canditadas/pega-candidatos",
        { headers }
      );

      setCandidatos(response.data);
    } catch (error) {

    }
  };

  const masiinfovaga = (userdata) => {
    setUsersData(userdata);
    navigate("/Infos-candidatos");
  };

  useEffect(() => {
    pegaVaga();
  }, []);

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
              <Button onClick={() => navigate("/HomeAdmin")} type="primary">
                <ArrowLeftOutlined />
              </Button>
              <span style={{ flex: 1, textAlign: "center" , fontSize: 20, marginBottom:23}}>Candidatos:</span>
            </div>

            <div
              style={{
                padding: 24,
                textAlign: "left",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {candidatos.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                    marginLeft:"5vh"
                  }}
                >
                  <p><ExclamationCircleOutlined /> Nenhum candidato encontrado.</p>
                </div>
              ) : (
                candidatos.map((cantidatosData, key) => (
                  <Card
                    title=""
                    bordered={false}
                    style={{ border: "1px solid black", marginBottom: "20px" }}
                    key={key}
                  >
                    <p style={{ fontWeight: "bold" }}>
                      Candidato: {cantidatosData.users.nome}
                    </p>
                    <p style={{ fontWeight: "bold" }}>
                      Inscrito para a vaga: {cantidatosData.vagas.nome}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    ></div>

                    <Button
                      type="primary"
                      style={{ backgroundColor: "white", color: "#00B2FF" }}
                      onClick={() => masiinfovaga(cantidatosData)}
                    >
                   Mais detalhes
                    </Button>
                  </Card>
                ))
              )}
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
export default Candidatos;
