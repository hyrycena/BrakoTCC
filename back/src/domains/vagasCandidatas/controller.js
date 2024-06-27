import Vagas from "../vagas/models";
import VagasCandidatadas from "./model";

async function vaiUsarMaisPraFrente(req, res, next) {
  try {
    const {
      user: { userSelect },
    } = req;

    const vagasminhas = await Vagas.query().where("creator_id", userSelect.id);

    const candidatos = vagasminhas.map(async (vaga) => {
      return VagasCandidatadas.query().whereIn(
        "vagas_id",
        vaga.id
      );
    });


    res.json(candidatos);
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const {
      user: { userSelect },
    } = req;

    const candidaturas = await VagasCandidatadas.query()
      .where("usuario_id", userSelect.id)
      .withGraphFetched("[vagas, vagas.tipo_de_vaga]")
      .join("vagas", "vagas_candidatadas.vagas_id", "vagas.id");

    res.json(candidaturas);
  } catch (err) {
    next(err);
  }
}


async function getTudo(req, res, next) {
  try {
    const {
      user: { userSelect },
    } = req;

    const candidaturas = await VagasCandidatadas.query()
      .where("vagas.creator_id", userSelect.id)
      .withGraphFetched("[users, vagas, vagas.tipo_de_vaga]")
      .join("vagas", "vagas_candidatadas.vagas_id", "vagas.id")
      .where('vagas.ativo', true);

    res.json(candidaturas);
  } catch (err) {
    next(err);
  }
}






async function post(req, res, next) {
  try {
    const {
      user: { userSelect },
    } = req;

    const existingCandidatura = await VagasCandidatadas.query()
      .where({
        usuario_id: userSelect.id,
        vagas_id: req.body.vagas_id,
      })
      .first();

    if (existingCandidatura) {
      return res
        .status(400)
        .json({ message: "Você já está inscrito nesta vaga." });
    }

    const newVaga = await VagasCandidatadas.query().insertAndFetch({
      ...req.body,
      usuario_id: userSelect.id,
    });

    res.json(newVaga);
  } catch (err) {
    next(err);
    console.log(err);
  }
}

async function delet(req, res, next) {
  try {
    const { params , body} = req;
    const vagaId = params.id;

    const vagabyid = await VagasCandidatadas.query().deleteById(vagaId);
    if (!vagabyid) {
      return preconditionFailedError(vagasErrors.deletErro, res);
    }
    res.json(vagabyid);
  } catch (err) {
    next(err);
  }
}


export { get, post, vaiUsarMaisPraFrente, getTudo, delet };
