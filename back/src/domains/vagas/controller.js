import Vagas from "./models.js";
import vagasErrors from "./errors.js";

async function get(req, res, next) {
  try {
    const vagas = await Vagas.query()
    .withGraphFetched('[tipo_de_vaga, users]')
    .where('ativo', true)

    if (!vagas) {
      return preconditionFailedError(vagasErrors.userNotFound, res);
    }

    res.json(vagas);
  } catch (err) {
    next(err);
  }
}

async function getbyid(req, res, next) {
  try {
    const { params } = req;
    const vagaId = params.id;

    const vagabyid = await Vagas.query().findById(vagaId)
    .withGraphFetched('[tipo_de_vaga, users]')
    .where('ativo', true);

    if (!vagabyid) {
      return preconditionFailedError(vagasErrors.userNotFound, res);
    }

    res.json(vagabyid);
  } catch (err) {
    next(err);
  }
}

async function post(req, res, next) {
  try {
    const {
      user: { userSelect },
    } = req;

    const newVaga = await Vagas.query().insertAndFetch({
      ...req.body,
      creator_id: userSelect.id,
    });

    if (!newVaga) {
      return preconditionFailedError(vagasErrors.createFail, res);
    }

    res.json(newVaga);
  } catch (err) {
    next(err);
  }
}


async function getVagasCriadas(req, res, next) {
  try {
    const {
      user: { userSelect },
    } = req;

    const vagas = await Vagas.query()
    .withGraphFetched('[tipo_de_vaga]')
    .where('creator_id', userSelect.id)
    .where('ativo', true);

    if (!vagas) {
      return preconditionFailedError(vagasErrors.userNotFound, res);
    }

    res.json(vagas);
  } catch (err) {
    next(err);
  }
}





async function put(req, res, next) {
  try {
    const { params, body } = req;
    const vagaId = params.id;

    const newVaga = await Vagas.query().updateAndFetchById(vagaId, body);

    if (!newVaga) {
      return preconditionFailedError(vagasErrors.putError, res);
    }

    res.json(newVaga);
  } catch (err) {
    next(err);
  }
}

async function delet(req, res, next) {
  try {
    const { params , body} = req;
    const vagaId = params.id;

    const vagabyid = await Vagas.query().updateAndFetchById(vagaId, {
     ativo:false
    });
    if (!vagabyid) {
      return preconditionFailedError(vagasErrors.deletErro, res);
    }
    res.json(vagabyid);
  } catch (err) {
    next(err);
  }
}

export { get, post, getbyid, delet, put, getVagasCriadas };
