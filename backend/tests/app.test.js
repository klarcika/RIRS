const request = require('supertest');
const app = require('../app'); // Ensure this exports the Express app
const expenseController = require('../controllers/expenseController');
const userController = require('../controllers/userController');
const test = require("node:test");

// Mock Data
const mockExpense = {
    id: 1,
    name: "Nakup živil",
    amount: 50,
    person: "Janez",
};
const mockUser = {
    id: 1,
    name: "Janez Novak",
    email: "janez@example.com",
};

// Mock Controller Functions
jest.mock('../controllers/expenseController', () => ({
    dodajStrosek: jest.fn((req, res) => res.status(201).json({ message: 'Expense added successfully!' })),
    vsiStroski: jest.fn((req, res) => res.status(200).json([mockExpense])),
    stroskiPoOsebi: jest.fn((req, res) => res.status(200).json({ person: "Janez", expenses: [mockExpense] })),
    vsotaStroskovPoOsebi: jest.fn((req, res) => res.status(200).json({ person: "Janez", total: 50 })),
    najdiStrosek: jest.fn((req, res) => res.status(200).json(mockExpense)),
    spremeniStrosek: jest.fn((req, res) => res.status(200).json({ message: 'Expense updated successfully!' })),
    izbrisiStrosek: jest.fn((req, res) => res.status(200).json({ message: 'Expense deleted successfully!' })),
}));

jest.mock('../controllers/userController', () => ({
    dodajUporabnika: jest.fn((req, res) => res.status(201).json({ message: 'User added successfully!' })),
    vsiUporabniki: jest.fn((req, res) => res.status(200).json([mockUser])),
    najdiUporabnika: jest.fn((req, res) => res.status(200).json(mockUser)),
    spremeniUporabnika: jest.fn((req, res) => res.status(200).json({ message: 'User updated successfully!' })),
    izbrisiUporabnika: jest.fn((req, res) => res.status(200).json({ message: 'User deleted successfully!' })),
}));

describe('Expense Routes Tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('POST /expense/dodaj - should add an expense', async () => {
        const newExpense = { name: "Kosilo", amount: 20, person: "Ana" };
        const response = await request(app).post('/expense/dodaj').send(newExpense);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Expense added successfully!');
        expect(expenseController.dodajStrosek).toHaveBeenCalledWith(expect.anything(), expect.anything());
    });

    test('GET /expense/vsi - should fetch all expenses', async () => {
        const response = await request(app).get('/expense/vsi');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockExpense]);
        expect(expenseController.vsiStroski).toHaveBeenCalled();
    });

    test('GET /expense/oseba - should fetch expenses by person', async () => {
        const response = await request(app).get('/expense/oseba').query({ person: "Janez" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ person: "Janez", expenses: [mockExpense] });
        expect(expenseController.stroskiPoOsebi).toHaveBeenCalled();
    });

    test('GET /expense/vsota - should fetch total expenses by person', async () => {
        const response = await request(app).get('/expense/vsota').query({ person: "Janez" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ person: "Janez", total: 50 });
        expect(expenseController.vsotaStroskovPoOsebi).toHaveBeenCalled();
    });

    test('GET /expense/:id - should fetch an expense by ID', async () => {
        const response = await request(app).get('/expense/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockExpense);
        expect(expenseController.najdiStrosek).toHaveBeenCalledWith(expect.anything(), expect.anything());
    });

    test('PUT /expense/:id - should update an expense by ID', async () => {
        const updatedExpense = { name: "Kosilo", amount: 25 };
        const response = await request(app).put('/expense/1').send(updatedExpense);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Expense updated successfully!');
        expect(expenseController.spremeniStrosek).toHaveBeenCalled();
    });

    test('DELETE /expense/:id - should delete an expense by ID', async () => {
        const response = await request(app).delete('/expense/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Expense deleted successfully!');
        expect(expenseController.izbrisiStrosek).toHaveBeenCalled();
    });
});

describe('User Routes Tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('POST /user/dodaj - should add a new user', async () => {
        const newUser = { name: "Ana Novak", email: "ana@example.com" };
        const response = await request(app).post('/user/dodaj').send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User added successfully!');
        expect(userController.dodajUporabnika).toHaveBeenCalledWith(expect.anything(), expect.anything());
    });

    test('GET /user/vsi - should fetch all users', async () => {
        const response = await request(app).get('/user/vsi');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockUser]);
        expect(userController.vsiUporabniki).toHaveBeenCalled();
    });

    test('GET /user/:email - should fetch a user by email', async () => {
        const response = await request(app).get('/user/janez@example.com');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
        expect(userController.najdiUporabnika).toHaveBeenCalledWith(expect.anything(), expect.anything());
    });
});
