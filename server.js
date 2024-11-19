const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: "127.0.0.1", 
    port: 3307,        
    user: "root",
    password: "", 
    database: "student_records",
  });
  
  

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

app.get("/", (req, res) => {
    res.send("Welcome to the Student Records API!");
  });
  

// Add a record
app.post("/students", (req, res) => {
  const { surname, firstname, birthdate, gender, address } = req.body;
  const query = "INSERT INTO students (Surname, Firstname, Birthdate, Gender, Address) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [surname, firstname, birthdate, gender, address], (err) => {
    if (err) {
      console.error("Error adding record:", err);
      res.status(500).send("Error adding record");
    } else {
      res.send("Record added successfully!");
    }
  });
});

// Edit a record
app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { surname, firstname, birthdate, gender, address } = req.body;
  const query = `
    UPDATE students 
    SET Surname = ?, Firstname = ?, Birthdate = ?, Gender = ?, Address = ?
    WHERE StudentID = ?
  `;
  db.query(query, [surname, firstname, birthdate, gender, address, id], (err) => {
    if (err) {
      console.error("Error updating record:", err);
      res.status(500).send("Error updating record");
    } else {
      res.send("Record updated successfully!");
    }
  });
});

// Delete a record
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM students WHERE StudentID = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting record:", err);
      res.status(500).send("Error deleting record");
    } else {
      res.send("Record deleted successfully!");
    }
  });
});

// View all records
app.get("/students", (req, res) => {
  const query = "SELECT * FROM students";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching records:", err);
      res.status(500).send("Error fetching records");
    } else {
      res.json(results);
    }
  });
});

// Get a single student by ID
app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM students WHERE StudentID = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching student:", err);
      res.status(500).send("Error fetching student");
    } else if (results.length === 0) {
      res.status(404).send("Student not found");
    } else {
      res.json(results[0]);
    }
  });
});

// Sort records by a field
app.get("/students/sort/:field", (req, res) => {
  const { field } = req.params;
  const validFields = ["Surname", "Firstname", "Birthdate", "Gender", "Address"];
  if (!validFields.includes(field)) {
    return res.status(400).send("Invalid sort field");
  }

  const query = `SELECT * FROM students ORDER BY ${field}`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error sorting records:", err);
      res.status(500).send("Error sorting records");
    } else {
      res.json(results);
    }
  });
});


// Add mock data
app.post("/students/mock", (req, res) => {
  const mockData = [
    { surname: "Smith", firstname: "John", birthdate: "2000-01-01", gender: "Male", address: "123 Main St" },
    { surname: "Doe", firstname: "Jane", birthdate: "1999-05-15", gender: "Female", address: "456 Elm St" },
    { surname: "Brown", firstname: "Charlie", birthdate: "2001-07-22", gender: "Male", address: "789 Oak St" },
    { surname: "Johnson", firstname: "Emily", birthdate: "2002-11-30", gender: "Female", address: "101 Pine St" }
  ];

  const query = "INSERT INTO students (Surname, Firstname, Birthdate, Gender, Address) VALUES ?";
  const values = mockData.map(student => [student.surname, student.firstname, student.birthdate, student.gender, student.address]);

  db.query(query, [values], (err) => {
    if (err) {
      console.error("Error adding mock data:", err);
      res.status(500).send("Error adding mock data");
    } else {
      res.send("Mock data added successfully!");
    }
  });
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });

