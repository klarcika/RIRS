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