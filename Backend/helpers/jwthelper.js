const JWT = require("jsonwebtoken");
const createError = require("http-errors"); //for error handling

module.exports = {
  //To craete Access token
  signAccessToken: (userID) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1hr",
        issuer: "localhost",
        audience: userID,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  //To verify the Access token
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return next(createError.Unauthorized());
        } else {
          return next(createError.Unauthorized(err.message));
        }
      }
      req.payload = payload;
      next();
    });
  },
  // signRefreshToken: (userID) => {
  //   return new Promise((resolve, reject) => {
  //     const payload = {};
  //     const secret = process.env.REFRESH_TOKEN_SECRET;
  //     const options = {
  //       expiresIn: "1y",
  //       issuer: "localhost",
  //       audience: userID,
  //     };
  //     JWT.sign(payload, secret, options, (err, token) => {
  //       if (err) {
  //         reject(createError.InternalServerError());
  //       }
  //       resolve(token);
  //     });
  //   });
  // },
  // verifyRefreshToken: (refreshToken) => {
  //   return new Promise((resolve, reject) => {
  //     JWT.verify(
  //       refreshToken,
  //       process.env.REFRESH_TOKEN_SECRET,
  //       (err, payload) => {
  //         if (err) return reject(createError.Unauthorized());
  //         const userId = payload.aud;
  //         resolve(userId);
  //       }
  //     );
  //   });
  // },
};
