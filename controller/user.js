import bcrypt from "bcrypt";
const saltRounds = 10;
import { v4 as uuidv4 } from "uuid";
import db from "../database/db.js";

export const login = (req, res) => {
  const { gmail, password } = req.body;

  if (!gmail || !password) {
    return res.status(400).json({ msg: "gmail dan password harus diisi" });
  }

  try {
    const searchGmail = "SELECT * FROM users WHERE gmail = ?";
    const valueGmail = [gmail];

    db.query(searchGmail, valueGmail, (err, results) => {
      if (err) throw err;

      if (results.length === 0) {
        return res.status(404).json({ msg: "Akun tidak ditemukan" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err)
          return res.status(500).json({ msg: "Gagal memproses password" });

        if (!isMatch) {
          return res.status(401).json({ msg: "Password salah" });
        }

        req.session.dataUser = { uuid: user.uuid, gmail: user.gmail };

        req.session.save((err) => {
          if (err) return res.status(500).json({ msg: "Gagal menyimpan sesi" });
          console.log("Session setelah login:", req.session); // Debug session di terminal
          res.send({ login: true, useremail: gmail });
        });
      });
    });
  } catch (err) {
    return res.status(500).json({ msg: "Gagal login" });
  }
};

export const register = async (req, res) => {
  const { name, gmail, password } = req.body;
  const uuid = uuidv4();

  // Validasi input
  if (!name || !gmail || !password) {
    return res.status(400).json({ msg: "Data harus lengkap" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const sql =
      "INSERT INTO users(uuid, name, gmail, password) VALUES(?, ?, ?, ?)";
    const values = [uuid, name, gmail, hashedPassword];
    db.query(sql, values, (err, results) => {
      if (err) throw err;

      console.log("The solution is: ", results);

      return res.status(201).json({ msg: "berhasil registrasi" });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Gagal registrasi" });
  }
};

export const logout = (req, res) => {
  if (!req.session) {
    return res.status(401).json({ msg: "Tidak ada sesi aktif" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Error saat logout:", err);
      return res.status(500).json({ msg: "Gagal logout" });
    }
    res.clearCookie("connect.sid"); // Hapus cookie session di client (opsional)
    return res.status(200).json({ msg: "Berhasil logout" });
  });
};
