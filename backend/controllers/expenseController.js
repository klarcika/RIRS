const Expense = require("../models/expense");
const User = require("../models/user");
const db = require("../db");

async function dodajStrosek(req, res) {
  const { naziv, datum_odhoda, datum_prihoda, kilometrina, lokacija, opis, oseba } = req.body;

  if (!naziv || !datum_odhoda || !datum_prihoda || !kilometrina || !lokacija || !opis || !oseba) {
    return res.status(400).json({ error: "Vsa polja morajo biti izpolnjena" });
  }

  try {
    const uporabnik = await User.getByEmail(oseba);
    if (!uporabnik) {
      return res.status(404).json({ error: "Uporabnik s tem emailom ne obstaja" });
    }

    const novStrosek = await Expense.add({
      naziv,
      datum_odhoda,
      datum_prihoda,
      kilometrina,
      lokacija,
      opis,
      oseba,
    });

    res.status(201).json({ strosek: novStrosek });
  } catch (error) {
    res.status(500).json({ error: "Napaka pri dodajanju stroška", details: error.message });
  }
}

async function vsiStroski(req, res) {
  const { page = 1, limit = 10, monthFilter } = req.query;
  const limitValue = parseInt(limit, 10);
  const offsetValue = (parseInt(page, 10) - 1) * limitValue;

  try {
    let stroski;
    if (monthFilter) {
      const [year, month] = monthFilter.split("-");
      if (!year || !month) {
        return res.status(400).json({ error: "Parameter 'monthFilter' mora biti v formatu 'YYYY-MM'." });
      }
      stroski = await Expense.getByMonth(year, month, limitValue, offsetValue);
    } else {
      stroski = await Expense.getAll(limitValue, offsetValue);
    }

    const totalItems = (await db.collection("Potni_stroski").get()).size;

    res.status(200).json({
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limitValue),
      data: stroski,
    });
  } catch (error) {
    res.status(500).json({ error: "Napaka pri pridobivanju stroškov", details: error.message });
  }
}

async function najdiStrosek(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Potreben je ID." });
  }

  try {
    const strosek = await Expense.getById(id);
    if (!strosek) {
      return res.status(404).json({ error: "Strosek ne obstaja." });
    }

    res.status(200).json(strosek);
  } catch (error) {
    res.status(500).json({ error: "Napaka pri iskanju stroška", details: error.message });
  }
}

async function spremeniStrosek(req, res) {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    return res.status(400).json({ error: "Potreben je ID." });
  }

  try {
    const response = await Expense.put(id, updatedData);
    res.status(200).json({ message: "Strosek uspešno posodobljen", data: response });
  } catch (error) {
    res.status(500).json({ error: "Napaka pri posodabljanju stroška", details: error.message });
  }
}

async function izbrisiStrosek(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Potreben je ID." });
  }

  try {
    const strosek = await Expense.delete(id);
    if (!strosek) {
      return res.status(404).json({ error: "Strosek ne obstaja." });
    }

    res.status(200).json({ message: "Strosek uspešno izbrisan." });
  } catch (error) {
    res.status(500).json({ error: "Napaka pri brisanju stroška", details: error.message });
  }
}

async function stroskiPoOsebi(req, res) {
  const { imePriimek, page = 1, limit = 10 } = req.query;

  if (!imePriimek || imePriimek.trim().split(" ").length < 2) {
    return res.status(400).json({ error: "Parameter 'imePriimek' mora vsebovati ime in priimek." });
  }

  const [ime, priimek] = imePriimek.trim().split(" ");
  const limitValue = parseInt(limit, 10);
  const pageValue = parseInt(page, 10);

  try {
    const uporabniki = await User.getByFullName(ime, priimek);
    if (uporabniki.length === 0) {
      return res.status(404).json({ error: "Uporabnik s tem imenom in priimkom ni najden." });
    }

    const emails = uporabniki.map((uporabnik) => uporabnik.email);

    const { stroski, totalItems } = await Expense.getByEmails(emails, limitValue, pageValue);

    res.status(200).json({
      currentPage: pageValue,
      itemsPerPage: limitValue,
      totalItems,
      totalPages: Math.ceil(totalItems / limitValue),
      data: stroski,
    });
  } catch (error) {
    res.status(500).json({ error: "Napaka pri pridobivanju stroškov po osebi", details: error.message });
  }
}

async function vsotaStroskovPoOsebi(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Parameter 'email' je obvezen." });
  }

  try {
    const stroski = await Expense.getByUserEmail(email);
    const vsotaStroskov = stroski.reduce((vsota, strosek) => vsota + (parseFloat(strosek.cena) || 0), 0);

    res.status(200).json({ vsotaStroskov });
  } catch (error) {
    res.status(500).json({ error: "Napaka pri izračunu vsote stroškov", details: error.message });
  }
}

module.exports = {
  dodajStrosek,
  vsiStroski,
  najdiStrosek,
  spremeniStrosek,
  izbrisiStrosek,
  stroskiPoOsebi,
  vsotaStroskovPoOsebi,
};
