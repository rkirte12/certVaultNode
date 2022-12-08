import config from "config";
import jwt from "jsonwebtoken";
import superUser from "../model/superAdmin.model";
import admin from "../model/admin.model";
import user from "../model/student.model";
import apiError from '../helper/apiError';
import responseMessage from '../../assets/responseMessage';
import axios from 'axios';

module.exports = {
  async verifyTokenAdmin(req, res, next) {
    try {
      if (req.headers.token) {
        let result = await jwt.verify(req.headers.token, config.get('jwtsecret'));
        // console.log(result,result._id, 13)
        let userResult = await admin.findOne({ _id: result.id });
        // console.log(userResult, 17)
        if (!userResult) {
          return res.status(404).json({
            responseCode: 404,
            responseMessage: "USER NOT FOUND"
          })
        }
        else {
          if (userResult.status == "BLOCK") {
            return res.status(403).json({
              responseCode: 403,
              responseMessage: "You have been blocked by admin."
            })
          }
          else if (userResult.status == "DELETE") {
            return res.status(401).json({
              responseCode: 401,
              responseMessage: "Your account has been deleted by admin."
            })
          }
          else {
            req.userId = result.id;
            req.userDetails = result
            next();
          }
        }
      } else {
        throw apiError.badRequest(responseMessage.NO_TOKEN);
      }
    } catch (error) {
      return next(error)
    }
  },
  async verifyTokenSuperUser(req, res, next) {
    try {
      if (req.headers.token) {
        let result = await jwt.verify(req.headers.token, config.get('jwtsecret'));
        // console.log(result, 13)
        let userResult = await superUser.findOne({ _id: result.id });
        // console.log(userResult, 55)
        if (!userResult) {
          return res.status(404).json({
            responseCode: 404,
            responseMessage: "USER NOT FOUND"
          })
        }
        else {
          if (userResult.status == "BLOCK") {
            return res.status(403).json({
              responseCode: 403,
              responseMessage: "You have been blocked by superUser."
            })
          }
          else if (userResult.status == "DELETE") {
            return res.status(401).json({
              responseCode: 401,
              responseMessage: "Your account has been deleted by superUser."
            })
          }
          else {
            req.userId = result.id;
            req.userDetails = result
            next();
          }
        }
      } else {
        throw apiError.badRequest(responseMessage.NO_TOKEN);
      }
    } catch (error) {
      return next(error)
    }
  },
  async verifyTokenUser(req, res, next) {
    try {
      if (req.headers.token) {
        let result = await jwt.verify(req.headers.token, config.get('jwtsecret'));
        // console.log(result, 13)
        let userResult = await user.findOne({ _id: result.id });
        if (!userResult) {
          return res.status(404).json({
            responseCode: 404,
            responseMessage: "USER NOT FOUND"
          })
        }
        else {
          if (userResult.status == "BLOCK") {
            return res.status(403).json({
              responseCode: 403,
              responseMessage: "You have been blocked by user."
            })
          }
          else if (userResult.status == "DELETE") {
            return res.status(401).json({
              responseCode: 401,
              responseMessage: "Your account has been deleted by user."
            })
          }
          else {
            req.userId = result.id;
            req.userDetails = result
            next();
          }
        }
      } else {
        throw apiError.badRequest(responseMessage.NO_TOKEN);
      }
    } catch (error) {
      return next(error)
    }
  },

  verifyTokenBySocket: (token) => {
    return new Promise((resolve, reject) => {
      try {
        if (token) {
          jwt.verify(token, config.get('jwtsecret'), (err, result) => {
            if (err) {
              reject(apiError.unauthorized());
            }
            else {
              userModel.findOne({ _id: result.id }, (error, result2) => {
                if (error)
                  reject(apiError.internal(responseMessage.INTERNAL_ERROR));
                else if (!result2) {
                  reject(apiError.notFound(responseMessage.USER_NOT_FOUND));
                }
                else {
                  if (result2.status == "BLOCK") {
                    reject(apiError.forbidden(responseMessage.BLOCK_BY_ADMIN));
                  }
                  else if (result2.status == "DELETE") {
                    reject(apiError.unauthorized(responseMessage.DELETE_BY_ADMIN));
                  }
                  else {
                    resolve(result2._id);
                  }
                }
              })
            }
          })
        } else {
          reject(apiError.badRequest(responseMessage.NO_TOKEN));
        }
      }
      catch (e) {
        reject(e);
      }
    })


  },

  verifyJavaToken: async (req, res, next) => {
    try {
      if (req.headers.token) {
        userModel.findOne({ javaUID: req.headers.token }, (error, result2) => {
          if (error) {
            return next(error)
          }
          else if (!result2) {
            return res.status(404).json({
              responseCode: 404,
              responseMessage: "USER NOT FOUND"
            })
          }
          else {
            if (result2.status == "BLOCKED") {
              return res.status(403).json({
                responseCode: 403,
                responseMessage: "You have been blocked by admin ."
              })
            }
            else if (result2.status == "DELETE") {
              return res.status(401).json({
                responseCode: 401,
                responseMessage: "Your account has been deleted by admin ."
              })
            }
            else {
              req.userId = result2._id;
              req.userDetails = result2;
              next();
            }
          }
        })
        // }
      } else {
        throw apiError.badRequest(responseMessage.NO_TOKEN);
      }
    } catch (error) {
      return next(error);
    }
  },

  verifyTokenBySocket: (token) => {
    return new Promise((resolve, reject) => {
      try {
        if (token) {
          userModel.findOne({ javaUID: token }, (error, result) => {
            if (error)
              reject(apiError.internal(responseMessage.INTERNAL_ERROR));
            else if (!result) {
              reject(apiError.notFound(responseMessage.USER_NOT_FOUND));
            }
            else {
              if (result.status == "BLOCK") {
                reject(apiError.forbidden(responseMessage.BLOCK_BY_ADMIN));
              }
              else if (result.status == "DELETE") {
                reject(apiError.unauthorized(responseMessage.DELETE_BY_ADMIN));
              }
              else {
                resolve(result.id);
              }
            }
          })
        } else {
          reject(apiError.badRequest(responseMessage.NO_TOKEN));
        }
      }
      catch (e) {
        reject(e);
      }
    })
  },
}