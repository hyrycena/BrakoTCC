import { Model } from "objection";
import bcrypt from 'bcryptjs';

class Users extends Model {
  static get tableName() {
    return "usuario";
  }

  static get idColumn() {
    return "id";
  }  


}


export default Users;
