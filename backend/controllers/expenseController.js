const Expense = require("../models/expense");
const User = require("../models/user");
const db = require("../db");

async function dodajStrosek(req, res) {
  const {
    naziv,
    datum_odhoda,
    datum_prihoda,
    kilometrina,
    lokacija,
    opis,
    oseba,
  } = req.body;

  if (
    !naziv ||
    !datum_odhoda ||
    !datum_prihoda ||
    !kilometrina ||
    !lokacija ||
    !opis ||
    !oseba
  ) {
    return res.status(400).json({ error: "Vsa polja morajo biti izpolnjena" });
  }

  try {
    const uporabnik = await User.getByEmail(oseba);
    if (!uporabnik) {
      return res
        .status(404)
        .json({ error: "Uporabnik s tem emailom ne obstaja" });
    }
    const novStrosek = await Expense.add(
      naziv,
      datum_odhoda,
      datum_prihoda,
      kilometrina,
      lokacija,
      opis,
      oseba
    );

    res.status(200).json({ strosek: novStrosek });
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function vsiStroski(req, res) {
  const { page, limit, monthFilter } = req.query;
  // month je v obliki 2024-11
  const limitValue = parseInt(limit) || 10;
  const offsetValue = (parseInt(page) - 1) * limitValue || 0;

  try {
    let stroski;
    if (monthFilter) {
      const [year, month] = monthFilter.split("-");
      if (!year || !month) {
        return res
          .status(400)
          .json({ error: "Parameter 'monthFilter' mora biti v formatu 'YYYY-MM'." });
      }
      stroski = await Expense.getByMonth(year, month, limitValue, offsetValue);
    } else {
      stroski = await Expense.getAll(limitValue, offsetValue);
    }

    //Zakomentirano za vsak slucaj ce se bo se uporabljalo
    /*const stroskiZOsebami = await Promise.all(
      stroski.map(async (strosek) => {
        const { ime, priimek } = await User.getByEmail(strosek.oseba);
        strosekZOsebo = {
          ...strosek,
          oseba: ime + " " + priimek,
        };
        return strosekZOsebo;
      })
    );*/

    const totalItems = (await db.collection("Potni_stroski").get()).size;

    res.status(200).json({
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limitValue),
      //Enako kot zgoraj - zakomentirano za vsak slucaj + dodano data: stroski
      //data: stroskiZOsebami,
      data: stroski,
    });
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function najdiStrosek(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ error: "Potreben je id." });
  }

  try {
    const strosek = await Expense.getById(id);
    if (!strosek) {
      return res.status(404).json({ error: "Strosek ne obstaja" });
    }
    res.status(200).json(strosek);
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function spremeniStrosek(req, res) {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) {
    return res.status(400).send({ error: "Potreben je id." });
  }

  try {
    const response = await Expense.put(id, updatedData);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function izbrisiStrosek(req, res) {
  const { id } = req.params;
  try {
    const strosek = await Expense.delete(id);
    if (!strosek) {
      return res.status(404).json({ error: "Strosek ne obstaja" });
    }
    res.status(200).json({ message: "Strosek uspešno izbrisan" });
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function stroskiPoOsebi(req, res) {
  const { imePriimek, page = 1, limit = 10 } = req.query;

  if (!imePriimek || imePriimek.trim().split(" ").length < 2) {
    return res
      .status(400)
      .json({ error: "Parameter 'imePriimek' mora vsebovati ime in priimek." });
  }

  const [ime, priimek] = imePriimek.trim().split(" ");
  const limitValue = parseInt(limit);
  const pageValue = parseInt(page);

  try {
    const uporabniki = await User.getByFullName(ime, priimek);
    if (uporabniki.length === 0) {
      return res
        .status(404)
        .json({ error: "Uporabnik s tem imenom in priimkom ni najden." });
    }

    const emails = uporabniki.map((uporabnik) => uporabnik.email);

    const { stroski, totalItems } = await Expense.getByEmails(
      emails,
      limitValue,
      pageValue
    );
    if (stroski.length === 0) {
      return res
        .status(404)
        .json({ error: "Delavec še nima prijavljenih potnih stroškov." });
    }

    res.status(200).json({
      currentPage: pageValue,
      itemsPerPage: limitValue,
      totalItems,
      totalPages: Math.ceil(totalItems / limitValue),
      data: stroski,
    });
  } catch (error) {
    res.status(500).json({ details: error.message });
  }
}

async function vsotaStroskovPoOsebi(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Parameter 'email' je obvezen." });
  }

  try {
    const stroski = await Expense.getByUserEmail(email);
    const vsota_stroskov = stroski.reduce((vsota, strosek) => {
      return vsota + (parseFloat(strosek.cena) || 0);
    }, 0);
    res.status(200).json({ vsota_stroskov });
  } catch (error) {
    res.status(500).json({ details: error.message });
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
