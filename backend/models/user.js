const db = require("../db");
const { hashPassword } = require("../utils/hash_password");

const UserType = {
  DELAVEC: "delavec", // prijavlja stroske
  UPORABNIK: "uporabnik", // gleda statistiko
};

class User {
  static async add(ime, priimek, email, geslo, tip) {
    try {
      if (!Object.values(UserType).includes(tip)) {
        throw new Error("Neveljaven tip uporabnika");
      }

      const hashedPassword = await hashPassword(geslo);

      const id = email;
      const novUporabnik = {
        ime: ime,
        priimek: priimek,
        email: email,
        geslo: hashedPassword,
        tip: tip,
      };

      db.collection("Uporabniki").doc(id).set(novUporabnik);
      return { message: "Uspešna registracija", uporabnik: novUporabnik };
    } catch (error) {
      throw new Error(
        "Napaka pri dodajanju uporabnika v bazo: " + error.message
      );
    }
  }

  static async getAll() {
    try {
      const uporabnikiRef = db.collection("Uporabniki");
      const response = await uporabnikiRef.get();
      const uporabniki = [];
      response.forEach((doc) => {
        const uporabnik = {};
        uporabniki.push(doc.data());
      });

      return uporabniki;
    } catch (error) {
      throw new Error(
        "Napaka pri pridobivanju uporabnikov iz baze: " + error.message
      );
    }
  }

  static async getById(id) {
    try {
      const uporabnikRef = db.collection("Uporabniki").doc(id);
      const response = await uporabnikRef.get();
      const uporabnik = response.data();

      return uporabnik;
    } catch (error) {
      throw new Error(
        "Napaka pri pridobivanju uporabnika iz baze: " + error.message
      );
    }
  }

  static async put(id, updatedData) {
    try {
      const uporabnikRef = db.collection("Uporabniki").doc(id);
      const response = await uporabnikRef.get();
      const uporabnik = response.data();
      if (uporabnik == undefined) {
        throw new Error("Uporabnik ne obstaja");
      }

      if (updatedData.geslo) {
        updatedData.geslo = await hashPassword(updatedData.geslo);
      }

      const novUporabnik = {
        ...uporabnik,
        ...updatedData,
      };

      await db.collection("Uporabniki").doc(id).set(novUporabnik);

      return { message: "Uporabnik je uspešno posodobljen" };
    } catch (error) {
      throw new Error(
        "Napaka pri posodabljanju uporabnika v bazi: " + error.message
      );
    }
  }

  static async delete(id) {
    try {
      const uporabnikRef = db.collection("Uporabniki").doc(id);
      const response = await uporabnikRef.get();
      const uporabnik = response.data();
      if (uporabnik == undefined) {
        throw new Error("Uporabnik ne obstaja");
      }
      await db.collection("Uporabniki").doc(id).delete();

      return { message: "Uporabnik je bil izbrisan" };
    } catch (error) {
      throw new Error(
        "Napaka pri brisanju uporabnika iz baze: " + error.message
      );
    }
  }

  static async getByFullName(ime, priimek) {
    try {
      const uporabnikiRef = db.collection("Uporabniki");
      const query = uporabnikiRef
        .where("ime", "==", ime)
        .where("priimek", "==", priimek);

      const response = await query.get();
      const uporabniki = [];
      response.forEach((doc) => {
        uporabniki.push(doc.data());
      });

      return uporabniki;
    } catch (error) {
      throw new Error("Napaka pri pridobivanju oseb iz baze: " + error.message);
    }
  }

  static async getByEmail(email) {
    try {
      const querySnapshot = await db
        .collection("Uporabniki")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      return {
        ime: userData.ime,
        priimek: userData.priimek,
      };
    } catch (error) {
      throw new Error("Napaka pri pridobivanju imen in priimkov iz baze: " + error.message);
    }
  }
}

module.exports = User;
