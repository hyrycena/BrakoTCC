import TipoUsuario from "./model.js";
import typeUsersErrors from "./errors.js";

async function get(req, res, next) {
  try {
    const typeUsers = await TipoUsuario.query();

    if (!typeUsers) {
      return preconditionFailedError(typeUsersErrors.userNotFound, res);
    }

    res.json(typeUsers);
  } catch (err) {
    next(err);
  }
}

async function getbyid(req, res, next) {
  try {
    const { params } = req;
    const typeUsersId = params.id;

    const typeUsersbyid = await TipoUsuario.query().findById(typeUsersId);

    if (!typeUsersbyid) {
      return preconditionFailedError(typeUsersErrors.userNotFound, res);
    }

    res.json(typeUsersbyid);
  } catch (err) {
    next(err);
  }
}

async function post(req, res, next) {
  try {
    const newTypeUser = await TipoUsuario.query().insertAndFetch(req.body);



    if (!newTypeUser) {
      return preconditionFailedError(usersErrors.createFail, res);
    }


    res.json(newTypeUser);
  } catch (err) {
    next(err);
  }
}

async function put(req, res, next) {
  try {
    const { params, body } = req;
    const typeUsersId = params.id;

    const newTypeUser = await TipoUsuario.query().updateAndFetchById(
      typeUsersId,
      body
    );

    if (!newTypeUser) {
      return preconditionFailedError(typeUsersErrors.putError, res);
    }


    res.json(newTypeUser);
  } catch (err) {
    next(err);
  }
}

async function delet(req, res, next) {
  try {
    const { params } = req;
    const typeUsersId = params.id;

    const TypeUserbyid = await TipoUsuario.query().deleteById(typeUsersId);

    if (!TypeUserbyid) {
      return preconditionFailedError(typeUsersErrors.deletErro, res);
    }

    res.json(TypeUserbyid);
  } catch (err) {
    next(err);
  }
}

export { get, post, getbyid, delet, put };
