import { Model } from "objection";

class TipoVaga extends Model {
  static get tableName() {
    return "tipo_de_vaga";
  }

  static get idColumn() {
    return "id";
  }
}

export default TipoVaga;
