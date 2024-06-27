import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "./models.js";
import { preconditionFailedError } from "../../errors/http/preconditionalFailedError.js";
import TipoUsuario from "../tipoUsuario/model.js";
import usersErrors from "./errors.js";
import fs from "fs";
import "dotenv/config";

const { SECRET_KEY: secretKey } = process.env;

const secretJwt = secretKey;

async function get(req, res, next) {
  try {
    const users = await Users.query();

    if (!users) {
      return preconditionFailedError(usersErrors.userNotFound, res);
    }

    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getbyid(req, res, next) {
  try {
    const { params } = req;
    const userId = params.id;

    const usersbyid = await Users.query().findById(userId);
    if (!usersbyid) {
      return preconditionFailedError(usersErrors.userNotFound, res);
    }

    res.json(usersbyid);
  } catch (err) {
    next(err);
  }
}

async function getDadoLogin(req, res, next) {
  try {
    const {
      user: { userSelect },
    } = req;

    const usersbyid = await Users.query().findById(userSelect.id);
    if (!usersbyid) {
      return preconditionFailedError(usersErrors.userNotFound, res);
    }

    res.json(usersbyid);
  } catch (err) {
    next(err);
  }
}

async function post(req, res, next) {
  try {
    const { body } = req;
    const { email, senha, tipo_id: tipoId } = body;


    const existingUser = await Users.query().findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const hasType = await TipoUsuario.query()
      .findById(tipoId || 0)
      .resultSize();

    if (!hasType) {
      return preconditionFailedError(usersErrors.typeNotFound, res);
    }

    const newUser = await Users.query().insertAndFetch({
      ...req.body,
      senha: hashedPassword,
    });

    if (!newUser) {
      return preconditionFailedError(usersErrors.createFail, res);
    }

    return res.json(newUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
}


async function put(req, res, next) {
  try {
    const { body } = req;
    const { senha } = body;

    let hashedPassword;
    if (senha) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      hashedPassword = await bcrypt.hash(senha, salt);
    }

    const {
      user: { userSelect },
    } = req;

    const newUser = await Users.query().updateAndFetchById(userSelect.id, {
      ...req.body,
      senha: hashedPassword,
    });

    if (!newUser) {
      return preconditionFailedError(usersErrors.userNotFound, res);
    }

    res.json(newUser);
  } catch (err) {
    next(err);
  }
}

async function deletar(req, res, next) {
  try {
    const { params } = req;
    const userId = params.id;

    const usersbyid = await Users.query().deleteById(userId);

    if (!usersbyid) {
      return preconditionFailedError(usersErrors.deletErro, res);
    }

    res.json(usersbyid);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { body } = req;

    const userSelect = await Users.query()
      .select(["id", "senha", "tipo"])
      .findOne({
        email: body.email,
      });

    if (!userSelect) {
      return preconditionFailedError(usersErrors.credencialinv, res, 401);
    }
    const isPasswordCorrect = bcrypt.compareSync(body.senha, userSelect.senha);

    function generateAccessToken(userSelect) {
      const expiresIn = "1d";

      const token = jwt.sign({ userSelect }, secretJwt, { expiresIn });
      return token;
    }

    const token = generateAccessToken(userSelect);

    if (!isPasswordCorrect) {
      return preconditionFailedError(usersErrors.credencialinv, res, 401);
    }

    res.json({ user: userSelect, token });
  } catch (err) {
    next(err);
  }
}

export { get, post, getbyid, deletar, put, login, getDadoLogin };
