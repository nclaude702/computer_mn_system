const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;


//  MySQL connection (fully corrected)
const db = mysql.createConnection({
  host: "localhost",        //  Correct host
  user: "root",             //  Default XAMPP MySQL user
  password: "",             //  Default password is blank
  database: "computerlab",  //  Ensure this DB exists in phpMyAdmin
  port: 3306,               //  Correct MySQL port
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error(" MySQL connection error:", err);
  } else {
    console.log(" Connected to MySQL (XAMPP)");
  }
});


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error(" Error during login query:", err);
      return res.status(500).send("Server error");
    }

    if (results.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    //  Login successful
    res.redirect("/home.html"); // must be a relative path inside public/
  });
});

// Route to get all users
app.get("/api/users", (req, res) => {
  const sql = "SELECT username, password FROM users";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results); // Send user data as JSON
  });
});

// DELETE user by username
app.delete("/api/users/:username", (req, res) => {
  const { username } = req.params;
  const sql = "DELETE FROM users WHERE username = ?";
  
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error(" Error deleting user:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.sendStatus(200);
  });
});

//  UPDATE user's password
app.put("/api/users/:username", (req, res) => {
  const { username } = req.params;
  const { password } = req.body;

  const sql = "UPDATE users SET password = ? WHERE username = ?";
  db.query(sql, [password, username], (err, result) => {
    if (err) {
      console.error(" Error updating user:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.sendStatus(200);
  });
});

// Route: Register User
app.post("/register-user", (req, res) => {
  const { username, password } = req.body;

  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error registering user:", err);
      return res.status(500).json({ message: "User registration failed" });
    }
    res.json({ message: "User registered successfully" });
  });
});

// Route: Register Computer
app.post("/register-computer", (req, res) => {
  const { computer_code, description, serial_number } = req.body;

  const sql = `
    INSERT INTO computer (computer_code, description, serial_number)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [computer_code, description, serial_number], (err, result) => {
    if (err) {
      console.error(" Error registering computer:", err);
      return res.status(500).json({ message: "Computer registration failed" });
    }
    res.json({ message: "Computer registered successfully" });
  });
});
// Get all computers
app.get("/api/computers", (req, res) => {
  const sql = "SELECT * FROM computer";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(" Error fetching computers:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Delete a computer by ID
app.delete("/api/computers/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM computer WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(" Error deleting computer:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Computer deleted successfully" });
  });
});

// Update a computer by ID
app.get("/api/computers/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM computer WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(" Error fetching computer:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Computer not found" });
    }
    res.json(results[0]);
  });
});
app.put("/api/computers/:id", (req, res) => {
  const { id } = req.params;
  const { computer_code, description, serial_number } = req.body;

  const sql = `
    UPDATE computer 
    SET computer_code = ?, description = ?, serial_number = ? 
    WHERE id = ?
  `;
  db.query(sql, [computer_code, description, serial_number, id], (err, result) => {
    if (err) {
      console.error(" Error updating computer:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: " Computer updated successfully" });
  });
});




//  Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
