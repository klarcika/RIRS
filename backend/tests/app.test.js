const Expense = require("../models/expense"); // Model za delo s stroški
const User = require("../models/user");       // Model za delo z uporabniki
const db = require("../db");                 // Modul za dostop do baze podatkov

it("should return 400 if required fields are missing", async () => {
    const req = { body: { naziv: "Strošek" } }; // Manjkajoča polja
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    await dodajStrosek(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, { error: "Vsa polja morajo biti izpolnjena" });
});
it("should return 404 if user does not exist", async () => {
    const req = { body: { naziv: "Strošek", oseba: "neobstojec@email.com", ... } };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    sinon.stub(User, "getByEmail").resolves(null); // Simuliraj, da uporabnik ne obstaja

    await dodajStrosek(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, { error: "Uporabnik s tem emailom ne obstaja" });

    User.getByEmail.restore();
});
it("should return a list of expenses with pagination", async () => {
    const req = { query: { page: 1, limit: 10 } };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    const fakeExpenses = [{ id: 1, naziv: "Test" }, { id: 2, naziv: "Test2" }];
    sinon.stub(Expense, "getAll").resolves(fakeExpenses);
    sinon.stub(db.collection("Potni_stroski"), "get").returns({ size: 20 });

    await vsiStroski(req, res);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 20,
        totalPages: 2,
        data: fakeExpenses,
    });

    Expense.getAll.restore();
    db.collection("Potni_stroski").get.restore();
});
it("should return 404 if expense is not found", async () => {
    const req = { params: { id: "email@gmail.com_2024-11-05T08:25:20.033Z" } };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    sinon.stub(Expense, "getById").resolves(null);

    await najdiStrosek(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, { error: "Strosek ne obstaja." });

    Expense.getById.restore();
});
it("should successfully update an expense", async () => {
    const req = { params: { id: "email@gmail.com" }, body: { naziv: "Posodobljen strošek" } };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    const updatedExpense = { id: "email@gmail.com_2024-11-05T08:25:20.033Z", naziv: "Posodobljen strošek" };
    sinon.stub(Expense, "put").resolves(updatedExpense);

    await spremeniStrosek(req, res);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, { message: "Strosek uspešno posodobljen", data: updatedExpense });

    Expense.put.restore();
});
it("should return 404 if expense does not exist", async () => {
    const req = { params: { id: "email@gmail.com_2024-11-05T08:25:20.033Z" } };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    sinon.stub(Expense, "delete").resolves(null);

    await izbrisiStrosek(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, { error: "Strosek ne obstaja." });

    Expense.delete.restore();
});
it("should correctly calculate the sum of expenses for a user", async () => {
    const req = { query: { email: "email@gmail.com_2024-11-05T08:25:20.033Z" } };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    const expenses = [{ cena: "100.50" }, { cena: "50.75" }];
    sinon.stub(Expense, "getByUserEmail").resolves(expenses);

    await vsotaStroskovPoOsebi(req, res);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, { vsotaStroskov: 151.25 });

    Expense.getByUserEmail.restore();
});
it("should return 400 if user with the given email already exists", async () => {
    const req = { body: { ime: "Luka", priimek: "Horvat", email: "ime.priimek@gmail.com", geslo: "geslo123", tip: "uporabnik" } };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    sinon.stub(User, "getByEmail").resolves({ email: "email@gmail.com_2024-11-05T08:25:20.033Z" }); // Simuliraj obstoječega uporabnika

    await dodajUporabnika(req, res);

    sinon.assert.calledWith(res.status, 400);
    sinon.assert.calledWith(res.json, { error: "Uporabnik s tem emailom že obstaja." });

    User.getByEmail.restore();
});
it("should return 404 if user is not found", async () => {
    const req = { params: { email: "neobstojec@example.com" } };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    sinon.stub(User, "getByEmail").resolves(null); // Simuliraj, da uporabnik ne obstaja

    await najdiUporabnika(req, res);

    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledWith(res.json, { error: "Uporabnik ne obstaja." });

    User.getByEmail.restore();
});
it("should successfully delete a user", async () => {
    const req = { params: { email: "email@gmail.com_2024-11-05T08:25:20.033Z" } };
    const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
    };

    sinon.stub(User, "getByEmail").resolves({ email: "email@gmail.com_2024-11-05T08:25:20.033Z" }); // Simuliraj, da uporabnik obstaja
    sinon.stub(User, "delete").resolves(); // Simuliraj uspešno brisanje

    await izbrisiUporabnika(req, res);

    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, { message: "Uporabnik uspešno izbrisan." });

    User.getByEmail.restore();
    User.delete.restore();
});
