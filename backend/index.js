require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all origins (or specify an origin for production)

const sheetId = process.env.GOOGLE_SHEET_ID; // Use the environment variable for sheet ID
const employeeSheetId = process.env.EMPLOYEE_SHEET_ID; // Use the environment variable for employee sheet ID
const keys = JSON.parse(process.env.GOOGLE_CREDENTIALS); // Parse credentials from .env

// New GET request to fetch employee data from EmployeeDATA sheet
app.get("/api/get-employee-data", async (req, res) => {
  try {
    // Authenticate with Google Sheets API using service account
    const auth = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"], // Access scope
      null
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Get employee data from the EmployeeDATA sheet (assuming employee names and departments are in columns A and B)
    const range = "Sheet1!A2:B"; // Fetch data starting from A2 to avoid the header row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: employeeSheetId,
      range,
    });

    const rows = response.data.values;

    if (rows && rows.length > 0) {
      // Map the rows into an array of employee objects
      const employees = rows.map((row) => ({
        name: row[0], // Employee Name
        department: row[1], // Department
      }));
      res.status(200).json(employees);
    } else {
      res.status(404).json({ message: "No employee data found." });
    }
  } catch (error) {
    console.error("Error fetching employee data from Google Sheets:", error);
    res
      .status(500)
      .json({ error: `Failed to fetch employee data: ${error.message}` });
  }
});

app.post("/api/save-travel-data", async (req, res) => {
  const { employee, type, department, dates, details } = req.body; // Destructure incoming data

  console.log({ employee, type, department, dates, details }); // Log for debugging

  try {
    // Authenticate with Google Sheets API using service account
    const auth = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"], // Access scope
      null
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Prepare data for appending
    const values = [
      [
        employee.join(", "), // Join employee names as a comma-separated string
        type, // Add type
        department, // Add department
        dates.join(", "), // Join dates as a comma-separated string
        details.country, // Country
        details.state, // State
        details.city, // City
        details.client, // Client
        details.purpose, // Purpose
        details.remarks, // Remarks
        new Date().toLocaleString(), // Timestamp
      ],
    ];

    const resource = {
      values,
    };

    // Check if headers are already present in the sheet
    const range = "Sheet1!A1:K1"; // Check the first row (A1 to K1) for headers
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    // If headers are missing, add them
    if (headerResponse.data.values && headerResponse.data.values.length === 0) {
      const headers = [
        "Employee",
        "Type",
        "Department",
        "Dates",
        "Country",
        "State",
        "City",
        "Client",
        "Purpose",
        "Remarks",
        "Timestamp",
      ];

      // Add headers to the first row
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: "Sheet1!A1", // Starting at A1
        valueInputOption: "RAW",
        resource: {
          values: [headers],
        },
      });
    }

    // Append data to the Google Sheet starting from row 2 to avoid overwriting headers
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A2", // Start appending data from row 2
      valueInputOption: "RAW",
      resource,
    });

    // Send success response
    res.status(200).json({ message: "Data added successfully!" });
  } catch (error) {
    console.error("Error adding data to Google Sheets:", error);
    res
      .status(500)
      .json({ error: `Failed to add data to Google Sheets: ${error.message}` });
  }
});

// New GET request to fetch saved travel data from the TravelData sheet
app.get("/api/get-travel-data", async (req, res) => {
  try {
    // Authenticate with Google Sheets API using service account
    const auth = new google.auth.JWT(
      keys.client_email,
      null,
      keys.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"], // Access scope
      null
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Get saved travel data from the TravelData sheet (assuming it's in columns A to K)
    const range = "Sheet1!A2:K"; // Fetch data starting from A2 to avoid the header row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId, // This should be the sheet where you save travel data
      range,
    });

    const rows = response.data.values;

    if (rows && rows.length > 0) {
      // Map the rows into an array of travel data objects
      const travelData = rows.map((row) => ({
        employee: row[0], // Employee
        type: row[1], // Type
        department: row[2], // Department
        dates: row[3], // Dates
        country: row[4], // Country
        state: row[5], // State
        city: row[6], // City
        client: row[7], // Client
        purpose: row[8], // Purpose
        remarks: row[9], // Remarks
        timestamp: row[10], // Timestamp
      }));
      res.status(200).json(travelData);
    } else {
      res.status(404).json({ message: "No travel data found." });
    }
  } catch (error) {
    console.error("Error fetching travel data from Google Sheets:", error);
    res
      .status(500)
      .json({ error: `Failed to fetch travel data: ${error.message}` });
  }
});

// Set up the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
