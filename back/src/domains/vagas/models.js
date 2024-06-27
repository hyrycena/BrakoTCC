import { Model } from "objection"
import TipoVaga from "../tipoVaga/model";
import Users from "../users/models"

class Vagas extends Model {
  static get tableName() {
    return "vagas";
  }

  static get idColumn() {
    return "id";
  }

  static relationMappings = {

    users: {
      relation: Model.HasOneRelation,
      modelClass: Users,
      join: {
        from: 'usuario.id',
        to: 'vagas.creator_id'
      },
    },


    tipo_de_vaga: {
      relation: Model.HasOneRelation,
      modelClass: TipoVaga,
      join: {
        from: 'tipo_de_vaga.id',
        to: 'vagas.tipo_de_vaga_id'
      },
    },



    

  };



}

export default Vagas;
