import jwt from "jsonwebtoken";
import "dotenv/config";
import usersErrors from "./errors.js";

const {
  SECRET_KEY: secretKey
} = process.env;

const secretJwt = secretKey


export async function authorizationMiddleware(req, res, next) {
    try {
      const { authorization } = req.headers;
  
      if (!authorization) {
        return preconditionFailedError(usersErrors.notAuthorized, res);
      }
  
      const token = authorization.split(' ')[1]
  
      const user = jwt.verify(token, secretJwt);
  
      if (!user) {
        return preconditionFailedError(usersErrors.notAuthorized, res);
      }

      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  }