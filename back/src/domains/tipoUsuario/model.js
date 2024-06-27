import { Model } from "objection";

class TipoUsuario extends Model {
  static get tableName() {
    return "tipo_de_usuario";
  }

  static get idColumn() {
    return "id";
  }
}

export default TipoUsuario;
