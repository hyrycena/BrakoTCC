import TipoVaga from "./model.js";
import typeVagaErrors from './errors.js'

async function get(req, res, next) {
  try {
    const typeVagas = await TipoVaga.query();
    
    if (!typeVagas) {
      return preconditionFailedError(typeVagaErrors.userNotFound, res);
    }

    res.json(typeVagas);
  } catch (err) {
    next(err);
  }
}

async function getbyid(req, res, next) {
  try {
    const { params } = req;
    const typeVagasId = params.id;

    const typeVagasbyid = await TipoVaga.query().findById(typeVagasId);

    if (!typeVagasbyid) {
      return preconditionFailedError(typeVagaErrors.userNotFound, res);
    }

    res.json(typeVagasbyid);
  } catch (err) {
    next(err);
  }
}

async function post(req, res, next) {
  try {
    const newTypeVaga = await TipoVaga.query().insertAndFetch(req.body);
    if (!newTypeVaga) {
      return preconditionFailedError(typeVagaErrors.createFail, res);
    }


    res.json(newTypeVaga);
  } catch (err) {
    next(err);
  }
}

async function put(req, res, next) {
  try {
    const { params, body } = req;
    const typeVagasId = params.id;

    const newTypeVaga = await TipoVaga.query().updateAndFetchById(
      typeVagasId,
      body
    );


    if (!newTypeVaga) {
      return preconditionFailedError(typeVagaErrors.putError, res);
    }

    res.json(newTypeVaga);
  } catch (err) {
    next(err);
  }
}

async function delet(req, res, next) {
  try {
    const { params } = req;
    const typeVagasId = params.id;

    const TypeVagabyid = await TipoVaga.query().deleteById(typeVagasId);

    if (!TypeVagabyid) {
      return preconditionFailedError(typeVagaErrors.deletErro, res);
    }

    res.json(TypeVagabyid);
  } catch (err) {
    next(err);
  }
}

export { get, post, getbyid, delet, put };
