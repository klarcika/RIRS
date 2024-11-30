const bcrypt = require("bcrypt");
const User = require("../models/user");

async function dodajUporabnika(req, res) {
  const { ime, priimek, email, geslo, tip } = req.body;

  // Validate required fields
  if (!ime || !priimek || !email || !geslo || !tip) {
    return res.status(400).json({ error: "Vsa polja morajo biti izpolnjena" });
  }

  try {
    // Check if user with the given email already exists
    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Uporabnik s tem emailom že obstaja." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(geslo, saltRounds);

    // Add new user
    const novUporabnik = await User.add({
      ime,
      priimek,
      email,
      geslo: hashedPassword,
      tip,
    });

    res.status(201).json({ uporabnik: novUporabnik });
  } catch (error) {
    res.status(500).json({ error: "Napaka pri dodajanju uporabnika", details: error.message });
  }
}

async function vsiUporabniki(req, res) {
  try {
    const uporabniki = await User.getAll();
    res.status(200).json(uporabniki);
  } catch (error) {
    res.status(500).json({ error: "Napaka pri pridobivanju uporabnikov", details: error.message });
  }
}

async function najdiUporabnika(req, res) {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Potreben je ID (email)." });
  }

  try {
    const uporabnik = await User.getByEmail(email);
    if (!uporabnik) {
      return res.status(404).json({ error: "Uporabnik ne obstaja." });
    }

    res.status(200).json(uporabnik);
  } catch (error) {
    res.status(500).json({ error: "Napaka pri iskanju uporabnika", details: error.message });
  }
}

async function spremeniUporabnika(req, res) {
  const { email } = req.params;
  const updatedData = req.body;

  if (!email) {
    return res.status(400).json({ error: "Potreben je ID (email)." });
  }

  try {
    const uporabnik = await User.getByEmail(email);
    if (!uporabnik) {
      return res.status(404).json({ error: "Uporabnik ne obstaja." });
    }

    const response = await User.update(email, updatedData);
    res.status(200).json({ message: "Uporabnik uspešno posodobljen", data: response });
  } catch (error) {
    res.status(500).json({ error: "Napaka pri posodabljanju uporabnika", details: error.message });
  }
}

async function izbrisiUporabnika(req, res) {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Potreben je ID (email)." });
  }

  try {
    const uporabnik = await User.getByEmail(email);
    if (!uporabnik) {
      return res.status(404).json({ error: "Uporabnik ne obstaja." });
    }

    await User.delete(email);
    res.status(200).json({ message: "Uporabnik uspešno izbrisan." });
  } catch (error) {
    res.status(500).json({ error: "Napaka pri brisanju uporabnika", details: error.message });
  }
}

module.exports = {
  dodajUporabnika,
  vsiUporabniki,
  najdiUporabnika,
  spremeniUporabnika,
  izbrisiUporabnika,
};
