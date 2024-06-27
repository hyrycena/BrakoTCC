import { Model } from "objection";
import Users from "../users/models.js";
import Vagas from "../vagas/models.js";
import TipoVaga from "../tipoVaga/model.js";

class VagasCandidatadas extends Model {
  static get tableName() {
    return "vagas_candidatadas";
  }

  static get idColumn() {
    return "id";
  }

  static relationMappings  = {
    users: {
      relation: Model.HasOneRelation,
      modelClass: Users,
      join: {
        from: 'usuario.id',
        to: 'vagas_candidatadas.usuario_id'
      },
    },
    vagas: {
      relation: Model.HasOneRelation,
      modelClass: Vagas,
      join: {
        from: 'vagas.id',
        to: 'vagas_candidatadas.vagas_id'
      },
    },
  };
}

export default VagasCandidatadas;
