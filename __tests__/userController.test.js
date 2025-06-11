const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

const {
  usersList,
  getUser,
  createAdmin,
  deleteUser,
  getProfile
} = require("../controllers/userController");
const User = require("../models/User");
const appError = require("../utils/appError");

jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("../utils/appError", () => {
  return jest.fn((name, httpStatusCode, description) => {
    const error = new Error(name);
    error.statusCode = httpStatusCode;
    error.details = description;
    return error;
  });
});

const saltRounds = 12;

let req, res;
res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

describe("usersList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a paginated list of users", async () => {
    req = {
      query: {
        limit: 10,
        offset: 10
      }
    };
    const mockData = {
      count: 2,
      rows: ["row1", "row2"]
    };
    User.findAndCountAll.mockResolvedValue(mockData);

    await usersList(req, res);

    expect(User.findAndCountAll).toHaveBeenCalledWith({
      attributes: ["userId", "email", "firstName", "lastName", "role"],
      offset: 10,
      limit: 10,
      order: [["createdAt", "DESC"]]
    });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      totalUsers: 2,
      length: 2,
      data: ["row1", "row2"]
    });
  });

  it("should return a paginated list of users when limit and offest is not provided", async () => {
    req = {};
    const mockData = {
      count: 2,
      rows: ["row1", "row2"]
    };
    User.findAndCountAll.mockResolvedValue(mockData);

    await usersList(req, res);

    expect(User.findAndCountAll).toHaveBeenCalledWith({
      attributes: ["userId", "email", "firstName", "lastName", "role"],
      offset: 0,
      limit: 25,
      order: [["createdAt", "DESC"]]
    });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      totalUsers: 2,
      length: 2,
      data: ["row1", "row2"]
    });
  });

  it("should handle database errors", async () => {
    req = {};
    User.findAndCountAll.mockRejectedValue(new Error());

    await expect(usersList(req, res)).rejects.toThrow();

    expect(User.findAndCountAll).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("getUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve user successfully", async () => {
    req = {
      params: {
        id: 1
      }
    };
    const mockUser = {
      userId: 1,
      email: "test@gmail.com",
      firstName: "John",
      lastName: "Doe",
      role: "customer"
    };
    User.findOne.mockResolvedValue(mockUser);

    await getUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: {
        userId: 1
      },
      attributes: ["userId", "email", "firstName", "lastName", "role"]
    });
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({ data: mockUser });
  });

  it("should throw 404 for non-existent user", async () => {
    req = {
      params: {
        id: 1
      }
    };
    User.findOne.mockResolvedValue(null);

    await expect(getUser(req, res)).rejects.toThrow();

    expect(User.findOne).toHaveBeenCalledWith({
      where: {
        userId: 1
      },
      attributes: ["userId", "email", "firstName", "lastName", "role"]
    });
    expect(appError).toHaveBeenCalledWith(
      "User not found",
      StatusCodes.NOT_FOUND,
      `No user found with ID ${1}.`
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should handle database errors", async () => {
    const dbError = new Error("Database connection failed");
    User.findOne.mockRejectedValue(dbError);

    await expect(getUser(req, res)).rejects.toThrow(dbError);

    expect(User.findOne).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe("createAdmin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully create admin", async () => {
    req = {
      body: {
        email: "test@gmail.com",
        password: "test1234"
      }
    };
    const mockUser = {
      email: "test@gmail.com",
      password: "hashedpassword",
      role: "admin"
    };
    bcrypt.hash.mockResolvedValue("hashedpassword");
    User.create.mockResolvedValue(mockUser);

    await createAdmin(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, saltRounds);
    expect(User.create).toHaveBeenCalledWith(mockUser);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith({ message: "Admin created." });
  });

  it("should handle bcrypt errors", async () => {
    const bcryptError = new Error("Bcrypt error");
    bcrypt.hash.mockRejectedValue(bcryptError);

    await expect(createAdmin(req, res)).rejects.toThrow(bcryptError);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(User.create).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should handle database errors", async () => {
    bcrypt.hash.mockResolvedValue("hased");
    const dbError = new Error("dbError error");
    User.create.mockRejectedValue(dbError);

    await expect(createAdmin(req, res)).rejects.toThrow(dbError);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
