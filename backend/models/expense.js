const db = require("../db");

class Expense {
  static async add(
    naziv,
    datum_odhoda, // "2024-10-27"
    datum_prihoda, // "2024-10-28"
    kilometrina,
    lokacija,
    opis,
    oseba
  ) {
    try {
      const date = new Date().toJSON();
      const id = oseba + "_" + date;
      const cena = kilometrina * 0.43;
      const novStrosek = {
        id: id,
        naziv: naziv,
        datum_odhoda: datum_odhoda,
        datum_prihoda: datum_prihoda,
        kilometrina: parseFloat(kilometrina),
        lokacija: lokacija,
        opis: opis,
        oseba: oseba, // email referenca na userja
        cena: parseFloat(cena.toFixed(2)),
      };

      db.collection("Potni_stroski").doc(id).set(novStrosek);
      return { message: "Uspešno dodan potni strošek", strosek: novStrosek };
    } catch (error) {
      throw new Error(
        "Napaka pri dodajanju potnega stroška v bazo: " + error.message
      );
    }
  }

  static async getAll(limit, offset) {
    try {
      const stroskiRef = db
        .collection("Potni_stroski")
        .limit(limit)
        .offset(offset);
      const response = await stroskiRef.get();
      const stroski = [];
      response.forEach((doc) => {
        stroski.push(doc.data());
      });

      return stroski;
    } catch (error) {
      throw new Error(
        "Napaka pri pridobivanju stroskov iz baze: " + error.message
      );
    }
  }

  static async getById(id) {
    try {
      const strosekRef = db.collection("Potni_stroski").doc(id);
      const response = await strosekRef.get();
      const strosek = response.data();

      return strosek;
    } catch (error) {
      throw new Error(
        "Napaka pri pridobivanju stroska iz baze: " + error.message
      );
    }
  }

  static async put(id, updatedData) {
    try {
      const strosekRef = db.collection("Potni_stroski").doc(id);
      const response = await strosekRef.get();
      const strosek = response.data();
      if (strosek == undefined) {
        throw new Error("Potni strošek ne obstaja");
      }

      if (updatedData.geslo) {
        updatedData.geslo = await hashPassword(updatedData.geslo);
      }

      const novStrosek = {
        ...strosek,
        ...updatedData,
      };

      await db.collection("Potni_stroski").doc(id).set(novStrosek);

      return { message: "Potni strošek je uspešno posodobljen" };
    } catch (error) {
      throw new Error(
        "Napaka pri posodabljanju potnega stroška v bazi: " + error.message
      );
    }
  }

  static async delete(id) {
    try {
      const strosekRef = db.collection("Potni_stroski").doc(id);
      const response = await strosekRef.get();
      const strosek = response.data();
      if (strosek == undefined) {
        throw new Error("Strosek ne obstaja");
      }
      await db.collection("Potni_stroski").doc(id).delete();

      return { message: "Strosek je bil izbrisan" };
    } catch (error) {
      throw new Error("Napaka pri brisanju stroska iz baze: " + error.message);
    }
  }

  static async getByEmails(emails, limit, page) {
    try {
      let query = db.collection("Potni_stroski").where("oseba", "in", emails);

      const totalSnapshot = await query.get();
      const totalItems = totalSnapshot.size;

      query = query.limit(limit);

      if (page > 1) {
        const previousPageSnapshot = await query
          .limit((page - 1) * limit)
          .get();
        const lastDoc =
          previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
        if (lastDoc) {
          query = query.startAfter(lastDoc);
        }
      }

      const paginatedSnapshot = await query.get();
      const stroski = paginatedSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { stroski, totalItems };
    } catch (error) {
      throw new Error(
        "Error retrieving expenses by emails with pagination: " + error.message
      );
    }
  }

  static async getByUserEmail(email) {
    try {
      const stroskiRef = await db
        .collection("Potni_stroski")
        .where("oseba", "==", email)
        .get();
      const stroski = [];
      stroskiRef.forEach((doc) => {
        stroski.push(doc.data());
      });

      return stroski;
    } catch (error) {
      throw new Error(`Error retrieving expenses by email: ${error.message}`);
    }
  }

  static async getByMonth(year, month, limit, offset) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const snapshot = await db
      .collection("Potni_stroski")
      .limit(limit)
      .offset(offset)
      .get();
    const expenses = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((expense) => {
        const departureDate = new Date(expense.datum_odhoda);
        return departureDate >= startOfMonth && departureDate <= endOfMonth;
      });

    return expenses;
  }
}

module.exports = Expense;
