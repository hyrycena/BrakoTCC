import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../pages/login/App";
import Home from "../pages/home/home";
import MaisInfo from "../pages/maisInfo/maisInfo";
import CriarConta from "../pages/criarConta/criarConta";
import VagasCandidatadas from "../pages/vagasCandidatadas/vagasCandidatadas";
import Perfil from "../pages/perfil/perfil";
import EditarPerfil from "../pages/editarperfil/editarPerfil";
import HomeAdm from "../pages/visaoAdm/home/homeAdm.js";
import MaisInfoAdm from "../pages/visaoAdm/maisInfo/maisInfoAdm.js";
import CriarVaga from "../pages/visaoAdm/criarVaga/criarVaga.js";
import PerfilAdmin from "../pages/visaoAdm/perfil/perfil.js";
import EditarPerfilAdmin from "../pages/visaoAdm/editarperfil/editarPerfil";
import EditarVagas from "../pages/visaoAdm/editarVagas/editarVagas.js";
import Candidatos from "../pages/visaoAdm/candidatos/candidatos.js";
import MaisInfoCandodato from "../pages/visaoAdm/masiInfoCandidato/masiInfoCandidato.js";
import MudarSenha from "../pages/mudarsenha/mudarSenha.js";
import NotFound from "../pages/naoEncontrada/naoencontrado.js";

export const Router = () => {
  const [vagasData, setVagasData] = useState();
  const [usersData, setUsersData] = useState();
  const [logintoken, setLoginToken] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App setLoginToken={setLoginToken} />} />
        <Route
          path="/Criar-conta"
          element={<CriarConta setLoginToken={setLoginToken} />}
        />
        ;
        <Route
          path="/Home"
          element={<Home logintoken={logintoken} setVagasData={setVagasData} />}
        />
        ;
        <Route
          path="/Mais-Informações"
          element={<MaisInfo logintoken={logintoken} vagasData={vagasData} />}
        />
        <Route
          path="/Vagas-Candidatas"
          element={
            <VagasCandidatadas
              logintoken={logintoken}
              setVagasData={setVagasData}
            />
          }
        />
        ;
        <Route
          path="/Vagas-Candidatas"
          element={
            <VagasCandidatadas
              logintoken={logintoken}
              setVagasData={setVagasData}
            />
          }
        />
        ;
        <Route path="/Perfil" element={<Perfil logintoken={logintoken} />} />;
        <Route
          path="/Editarperfil"
          element={<EditarPerfil logintoken={logintoken} />}
        />
        ;
        <Route
          path="/HomeAdmin"
          element={
            <HomeAdm logintoken={logintoken} setVagasData={setVagasData} />
          }
        />
        ;
        <Route
          path="/Mais-InformaçõesAdmim"
          element={
            <MaisInfoAdm logintoken={logintoken} vagasData={vagasData} />
          }
        />
        <Route
          path="/criarVaga"
          element={<CriarVaga logintoken={logintoken} vagasData={vagasData} />}
        />
        <Route
          path="/Perfil-adm"
          element={<PerfilAdmin logintoken={logintoken} />}
        />
        ;
        <Route
          path="/Editarperfil-adm"
          element={<EditarPerfilAdmin logintoken={logintoken} />}
        />
        ;
        <Route
          path="/editarVagas"
          element={
            <EditarVagas logintoken={logintoken} vagasData={vagasData} />
          }
        />
        <Route
          path="/Candidatos"
          element={
            <Candidatos logintoken={logintoken} setUsersData={setUsersData} />
          }
        />
        <Route
          path="/Infos-candidatos"
          element={
            <MaisInfoCandodato logintoken={logintoken} usersData={usersData} />
          }
        />
        <Route
          path="/MudarSenha"
          element={<MudarSenha logintoken={logintoken} usersData={usersData} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
