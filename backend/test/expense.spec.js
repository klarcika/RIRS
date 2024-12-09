const Expense = require("../models/expense");

jest.mock("../models/expense", () => ({
  add: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  getByEmails: jest.fn(),
  getByUserEmail: jest.fn(),
  getByMonth: jest.fn(),
}));

describe("Expense", () => {
  it("should add a new expense", async () => {
    const mockExpense = {
      id: "user_2024-10-27T00:00:00.000Z",
      naziv: "Obisk Ljubljane",
      datum_odhoda: "2024-10-27",
      datum_prihoda: "2024-10-28",
      kilometrina: 100,
      lokacija: "Ljubljana",
      opis: "Sli smo v Lj.",
      oseba: "janez@gmail.com",
      cena: 43.0,
    };

    Expense.add.mockResolvedValue({
      message: "Uspešno dodan potni strošek",
      strosek: mockExpense,
    });

    const result = await Expense.add(
      "Obisk Ljubljane",
      "2024-10-27",
      "2024-10-28",
      100,
      "Ljubljana",
      "Sli smo v Lj.",
      "janez@gmail.com"
    );
    expect(result.message).toBe("Uspešno dodan potni strošek");
    expect(result.strosek).toEqual(mockExpense);
  });

  it("should return all expenses", async () => {
    const mockExpenses = [
      {
        naziv: "Obisk Ljubljane",
        datum_odhoda: "2024-10-27",
        datum_prihoda: "2024-10-28",
      },
      {
        naziv: "Konferenca v Kopru",
        datum_odhoda: "2024-11-10",
        datum_prihoda: "2024-11-11",
      },
    ];

    Expense.getAll.mockResolvedValue(mockExpenses);

    const result = await Expense.getAll(10, 0);
    expect(result).toEqual(mockExpenses);
  });

  it("should return a specific expense", async () => {
    const mockExpense = {
      naziv: "Obisk Ljubljane",
      datum_odhoda: "2024-10-27",
      datum_prihoda: "2024-10-28",
    };
    const id = "user_2024-10-27T00:00:00.000Z";

    Expense.getById.mockResolvedValue(mockExpense);

    const result = await Expense.getById(id);
    expect(result).toEqual(mockExpense);
  });

  it("should update an expense", async () => {
    const id = "user_2024-10-27T00:00:00.000Z";
    const updatedData = { naziv: "Updated Obisk Ljubljane" };

    Expense.put.mockResolvedValue({
      message: "Potni strošek je uspešno posodobljen",
    });

    const result = await Expense.put(id, updatedData);
    expect(result.message).toBe("Potni strošek je uspešno posodobljen");
  });

  it("should delete an expense", async () => {
    const id = "user_2024-10-27T00:00:00.000Z";

    Expense.delete.mockResolvedValue({ message: "Strosek je bil izbrisan" });

    const result = await Expense.delete(id);
    expect(result.message).toBe("Strosek je bil izbrisan");
  });

  it("should return expenses by emails", async () => {
    const mockExpenses = [
      { id: "user_2024-10-27T00:00:00.000Z", naziv: "Obisk Ljubljane" },
    ];
    const emails = ["user@example.com"];

    Expense.getByEmails.mockResolvedValue({
      stroski: mockExpenses,
      totalItems: 1,
    });

    const result = await Expense.getByEmails(emails, 10, 1);
    expect(result.stroski).toEqual(mockExpenses);
    expect(result.totalItems).toBe(1);
  });

  it("should return expenses by user email", async () => {
    const mockExpenses = [
      { id: "user_2024-10-27T00:00:00.000Z", naziv: "Obisk Ljubljane" },
    ];
    const email = "user@example.com";

    Expense.getByUserEmail.mockResolvedValue(mockExpenses);

    const result = await Expense.getByUserEmail(email);
    expect(result).toEqual(mockExpenses);
  });

  it("should return expenses by month", async () => {
    const mockExpenses = [
      { id: "user_2024-10-27T00:00:00.000Z", naziv: "Obisk Ljubljane" },
    ];
    const year = 2024;
    const month = 10;

    Expense.getByMonth.mockResolvedValue(mockExpenses);

    const result = await Expense.getByMonth(year, month, 10, 0);
    expect(result).toEqual(mockExpenses);
  });
});
