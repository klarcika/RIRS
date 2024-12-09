const User = require("../models/user");

jest.mock("../models/user", () => ({
  add: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  getByEmail: jest.fn(),
  getByFullName: jest.fn(),
}));

describe("User", () => {
  it("should add a new user", async () => {
    const mockUser = {
      ime: "Janez",
      priimek: "Novak",
      email: "janez.novak@gmail.com",
      geslo: "geslo123",
      tip: "delavec",
    };

    User.add.mockResolvedValue(mockUser);

    const result = await User.add(mockUser);
    expect(result).toEqual(mockUser);
  });

  it("should return all users", async () => {
    const mockUsers = [
      { ime: "Janez", priimek: "Novak", email: "janez.novak@gmail.com" },
      { ime: "Miha", priimek: "Horvat", email: "miha.horvat@gmail.com" },
    ];

    User.getAll.mockResolvedValue(mockUsers);

    const result = await User.getAll();
    expect(result).toEqual(mockUsers);
  });

  it("should return a specific user", async () => {
    const mockUser = {
      ime: "Janez",
      priimek: "Novak",
      email: "janez.novak@gmail.com",
    };
    const email = "janez.novak@gmail.com";

    User.getById.mockResolvedValue(mockUser);

    const result = await User.getById(email);
    expect(result).toEqual(mockUser);
  });

  it("should delete a user", async () => {
    const email = "janez.novak@gmail.com";

    User.delete.mockResolvedValue({
      message: "Uporabnik je bil izbrisan",
    });

    const result = await User.delete(email);
    expect(result.message).toBe("Uporabnik je bil izbrisan");
  });

  it("should return user by email", async () => {
    const mockUser = { ime: "Janez", priimek: "Novak" };
    const email = "janez.novak@gmail.com";

    User.getByEmail.mockResolvedValue(mockUser);

    const result = await User.getByEmail(email);
    expect(result).toEqual(mockUser);
  });

  it("should return null if no user matches email", async () => {
    const email = "tia.zvajker@gmail.com";

    User.getByEmail.mockResolvedValue(null);

    const result = await User.getByEmail(email);
    expect(result).toBeNull();
  });

  it("should return users matching full name", async () => {
    const mockUsers = [
      { ime: "Janez", priimek: "Novak", email: "janez.novak@gmail.com" },
    ];
    const ime = "Janez";
    const priimek = "Novak";

    User.getByFullName.mockResolvedValue(mockUsers);

    const result = await User.getByFullName(ime, priimek);
    expect(result).toEqual(mockUsers);
  });

  it("should return an empty array if no users match full name", async () => {
    const ime = "Luka";
    const priimek = "Horvat";

    User.getByFullName.mockResolvedValue([]);

    const result = await User.getByFullName(ime, priimek);
    expect(result).toEqual([]);
  });
});
