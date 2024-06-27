import express from 'express';
import cors from 'cors';
import { Model } from 'objection';
import Knex from 'knex';
import curriculo from './domains/curriculo/routes.js';
import knexfile from '../db/knexfile.js';
import users from './domains/users/routes.js';
import vagas from './domains/vagas/routes.js';
import tipoVaga from './domains/tipoVaga/routes.js';
import tipoUser from './domains/tipoUsuario/routes.js';
import vagasCandidatadas from './domains/vagasCandidatas/routes.js';
import { login, post } from './domains/users/controller.js';
import { authorizationMiddleware } from './middlewares/authorization.js';

Model.knex(Knex(knexfile));

const app = express();
app.use(cors());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use("/login", login);
app.use('/criar', post);
app.use('/tipo-usuario', tipoUser);

app.use(authorizationMiddleware);

app.use('/curriculo', curriculo);
app.use('/users', users);
app.use('/vagas', vagas);
app.use('/tipo-vaga', tipoVaga);
app.use('/vagas-canditadas', vagasCandidatadas);

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    res.status(413).json({
      message: 'Payload Too Large',
      error: err.message
    });
  } else {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message
    });
  }
});

export default app;
