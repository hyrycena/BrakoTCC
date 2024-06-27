import Users from "./model";
import fs from "fs";

async function post(req, res, next) {
    try {
      const {  body } = req;
      const { curriculo } = body;
      const [file_buffer] = fs.readFileSync(curriculo);

      const contents_in_base64 = file_buffer.toString("base64");

      const newCurriculo = await Users.transaction( async transacting =>{

        return Users.query(transacting).insertAndFetch( {
          curriculo: contents_in_base64
        });


      })
   
   

      res.json(newCurriculo);
    } catch (err) {
      next(err);
    }
  }
  
  export {  post };
