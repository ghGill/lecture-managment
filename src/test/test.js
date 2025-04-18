const chai = require('chai');
const auth = require('../middleware/auth')
const expect = chai.expect;
// const {db} = require("../services/database");
const dotenv = require('dotenv');
dotenv.config();

describe('JWT Toen', () => {
    const user = {
      name: "test",
      email:"test@test.com",
      role:"student",
      password:"1234"
    }

    const token = auth.authGenerateAccessToken(user);

    it('JWT token', () => {
      const decodedToken = auth.authVerifyAccessToken(token);
      const tokenUser = decodedToken.user;

      // expect(tokenUser).to.deep.equal(user);
      expect(tokenUser).to.include(user);
    })

    it('Using secret key from environment', () => {
      const secretKey = auth.authSecretKey();

      expect(secretKey).to.equal(process.env.JWT_SECRET_KEY);
    })

    it('Using secret key default', () => {
      delete process.env.JWT_SECRET_KEY;
      const secretKey = auth.authSecretKey();

      expect(secretKey).to.equal('app-secret-key');
    })
});
