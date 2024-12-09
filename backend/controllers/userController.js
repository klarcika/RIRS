const bcrypt = require("bcrypt");
const User = require("../models/user");

async function dodajUporabnika(req, res) {
  const { ime, priimek, email, geslo, tip } = req.body;

  if (!ime || !priimek || !email || !geslo || !tip) {
    return res.status(400).json({ error: "Vsa polja morajo biti izpolnjena" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(geslo, saltRounds);

    const novUporabnik = await User.add(
      ime,
      priimek,
      email,
      hashedPassword,
      tip
    );

    res.status(200).json({ uporabnik: novUporabnik });
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function vsiUporabniki(req, res) {
  try {
    const uporabniki = await User.getAll();
    res.status(200).json(uporabniki);
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function najdiUporabnika(req, res) {
  const { email } = req.params;
  if (!email) {
    return res.status(400).send({ error: "Potreben je id (email)." });
  }

  try {
    const uporabnik = await User.getById(email);
    if (!uporabnik) {
      return res.status(404).json({ error: "Uporabnik ne obstaja" });
    }
    res.status(200).json(uporabnik);
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function spremeniUporabnika(req, res) {
  const { email } = req.params;
  const updatedData = req.body;

  if (!email) {
    return res.status(400).send({ error: "Potreben je id (email)." });
  }

  try {
    const response = await User.put(email, updatedData);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function izbrisiUporabnika(req, res) {
  const { email } = req.params;
  try {
    const uporabnik = await User.delete(email);
    if (!uporabnik) {
      return res.status(404).json({ error: "Uporabnik ne obstaja" });
    }
    res.status(200).json({ message: "Uporabnik uspešno izbrisan" });
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

module.exports = {
  dodajUporabnika,
  vsiUporabniki,
  najdiUporabnika,
  spremeniUporabnika,
  izbrisiUporabnika,
};
