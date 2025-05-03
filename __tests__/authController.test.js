const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const { signUp, logIn } = require("../controllers/authController");
const User = require("../models/User");
const creatToken = require("../utils/creatToken");
const appError = require("../utils/appError");
const db = require("../utils/db");

jest.mock("bcrypt");
jest.mock("../models/User");
jest.mock("../utils/creatToken");
jest.mock("../utils/appError", () => {
  return jest.fn((name, httpStatusCode, description) => {
    const error = new Error(name);
    error.statusCode = httpStatusCode;
    error.details = description;
    return error;
  });
});

jest.spyOn(db, "transaction");
const saltRounds = 12;

describe("Auth Controller", () => {
  let req, res;
  beforeEach(() => {
    req = {
      body: {
        email: "mmah@gamil.com",
        password: "mah1234"
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe("SignUp", () => {
    beforeEach(() => {
      mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue()
      };

      db.transaction.mockImplementation(async (callback) => {
        let val;
        try {
          val = await callback(mockTransaction);
          await mockTransaction.commit();
        } catch (err) {
          await mockTransaction.rollback();
          throw err;
        }
        return val;
      });
    });

    it("should successfully create a user and return a token", async () => {
      let mockUser = {
        email: "mmah@gamil.com",
        password: "mps"
      };

      bcrypt.hash.mockResolvedValue("mps");
      User.create.mockResolvedValue(mockUser);
      creatToken.mockReturnValue("token");

      await signUp(req, res);

      expect(db.transaction).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, saltRounds);
      expect(User.create).toHaveBeenCalledWith(mockUser, {
        transaction: mockTransaction
      });
      expect(creatToken).toHaveBeenCalledWith(mockUser);
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });

    it("shold rollback when hash funtion throw error", async () => {
      bcrypt.hash.mockRejectedValue(new Error());

      await expect(signUp(req, res)).rejects.toThrow();

      expect(db.transaction).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, saltRounds);
      expect(User.create).not.toHaveBeenCalled();
      expect(creatToken).not.toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("shold rollback when User.create funtion throw error", async () => {
      bcrypt.hash.mockResolvedValue("mps");
      User.create.mockRejectedValue(new Error());

      await expect(signUp(req, res)).rejects.toThrow();

      expect(db.transaction).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, saltRounds);
      expect(User.create).toHaveBeenCalled();
      expect(creatToken).not.toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("shold rollback when creatToken funtion throw error", async () => {
      let mockUser = {
        email: "mmah@gamil.com",
        password: "mps"
      };

      bcrypt.hash.mockResolvedValue("mps");
      User.create.mockResolvedValue(mockUser);
      creatToken.mockImplementation(() => {
        throw new Error();
      });

      await expect(signUp(req, res)).rejects.toThrow();

      expect(db.transaction).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, saltRounds);
      expect(User.create).toHaveBeenCalledWith(mockUser, {
        transaction: mockTransaction
      });
      expect(creatToken).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("Login", () => {
    it("should successfully logIn and return a token", async () => {
      let mockUser = {
        email: "mmah@gamil.com",
        password: "mah1234"
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      creatToken.mockReturnValue("token");

      await logIn(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        mockUser.password
      );
      expect(creatToken).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });

    it("should throw appError when password is not correct", async () => {
      let mockUser = {
        email: "mmah@gamil.com",
        password: "ma"
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(logIn(req, res)).rejects.toThrow();
      expect(appError).toHaveBeenCalledWith(
        "Login failed",
        StatusCodes.UNAUTHORIZED,
        "email or password is not correct."
      );
      expect(User.findOne).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(creatToken).not.toHaveBeenCalled();
    });

    it("should throw appError when user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(logIn(req, res)).rejects.toThrow();
      expect(appError).toHaveBeenCalledWith(
        "Login failed",
        StatusCodes.UNAUTHORIZED,
        "email or password is not correct."
      );
      expect(User.findOne).toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(creatToken).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      User.findOne.mockRejectedValue(dbError);

      await expect(logIn(req, res)).rejects.toThrow(dbError);

      expect(User.findOne).toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(creatToken).not.toHaveBeenCalled();
    });

    it("should handle bcrypt errors", async () => {
      let mockUser = {
        email: "mmah@gamil.com",
        password: "ma"
      };
      User.findOne.mockResolvedValue(mockUser);
      const bcryptError = new Error("bcryptError");
      bcrypt.compare.mockRejectedValue(bcryptError);

      await expect(logIn(req, res)).rejects.toThrow(bcryptError);

      expect(User.findOne).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(creatToken).not.toHaveBeenCalled();
    });

    it("should handle token generation failure", async () => {
      let mockUser = {
        email: "mmah@gamil.com",
        password: "mah1234"
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockReturnValue(true);
      const tokenError = new Error("Token creation failed");
      creatToken.mockImplementation(() => {
        throw tokenError;
      });

      await expect(logIn(req, res)).rejects.toThrow(tokenError);

      expect(User.findOne).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(creatToken).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
