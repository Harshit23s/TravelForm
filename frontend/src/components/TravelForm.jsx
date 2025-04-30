
// -----------------------------------------------------------------
import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const TravelForm = () => {
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [departmentMap, setDepartmentMap] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDateForDetails, setSelectedDateForDetails] = useState(null);
  const [savedData, setSavedData] = useState([]);
  const [dateDetails, setDateDetails] = useState({
    country: "",
    state: "",
    city: "",
    client: "",
    purpose: "",
    remarks: "",
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/get-employee-data")
      .then((res) => {
        const employees = res.data.map((emp) => ({
          label: emp.name,
          value: emp.name,
        }));
        setEmployeeOptions(employees);
      })
      .catch((err) => console.error("Error fetching employee data:", err));

    axios
      .get("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => {
        const countryList = res.data.data.map((country) => ({
          label: country.name,
          value: country.name,
        }));
        setCountries(countryList);
      })
      .catch((err) => console.error("Error fetching countries:", err));

    // Fetch department options (you can customize this list if needed)
    const departments = ["HR", "Sales", "IT", "Marketing", "Finance"];
    const departmentList = departments.map((dept) => ({
      label: dept,
      value: dept,
    }));
    setDepartmentOptions(departmentList);
  }, []);

  const handleEmployeeChange = (selected) => {
    setSelectedEmployees(selected || []);
    // Initialize departments for each employee
    const newDepartmentMap = {};
    selected.forEach((emp) => {
      newDepartmentMap[emp.value] = "";
    });
    setDepartmentMap(newDepartmentMap);
  };

  const handleDepartmentChange = (employeeName, selectedDepartment) => {
    setDepartmentMap((prev) => ({
      ...prev,
      [employeeName]: selectedDepartment ? selectedDepartment.value : "",
    }));
  };

  const handleDateClick = (date) => {
    const exists = selectedDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
    if (exists) {
      setSelectedDates((prev) =>
        prev.filter((d) => d.toDateString() !== date.toDateString())
      );
    } else {
      setSelectedDates((prev) => [...prev, date].sort((a, b) => a - b));
    }
  };

  const openDetailModal = (date) => {
    setSelectedDateForDetails(date);
    setIsDetailModalOpen(true);
  };

  const handleDetailSave = (e) => {
    e.preventDefault();
    const travelData = {
      employee: selectedEmployees.map((emp) => emp.value),
      type: selectedEmployees.length > 1 ? "Group" : "Individual",
      departments: selectedEmployees.map((emp) => departmentMap[emp.value]),
      dates: selectedDates.map((date) => date.toISOString()),
      details: dateDetails,
    };
    axios
      .post("http://localhost:5000/api/save-travel-data", travelData)
      .then(() => {
        setSavedData((prev) => [...prev, travelData]);
        setDateDetails({
          country: "",
          state: "",
          city: "",
          client: "",
          purpose: "",
          remarks: "",
        });
        setStates([]);
        setCities([]);
        setIsDetailModalOpen(false);
      })
      .catch((err) => console.error("Error saving travel data:", err));
  };

  const handleCountryChange = (selected) => {
    setDateDetails((prev) => ({
      ...prev,
      country: selected.value,
      state: "",
      city: "",
    }));
    axios
      .post("https://countriesnow.space/api/v0.1/countries/states", {
        country: selected.value,
      })
      .then((res) =>
        setStates(
          res.data.data.states.map((s) => ({ label: s.name, value: s.name }))
        )
      )
      .catch((err) => console.error("Error fetching states:", err));
    setCities([]);
  };

  const handleStateChange = (selected) => {
    setDateDetails((prev) => ({ ...prev, state: selected.value, city: "" }));
    axios
      .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
        country: dateDetails.country,
        state: selected.value,
      })
      .then((res) =>
        setCities(res.data.data.map((c) => ({ label: c, value: c })))
      )
      .catch((err) => console.error("Error fetching cities:", err));
  };

  const handleCityChange = (selected) => {
    setDateDetails((prev) => ({ ...prev, city: selected.value }));
  };

  const handleClearDates = () => {
    setSelectedDates([]);
  };

  return (
    <nav>
      {/* Navbar */}
      <nav className="bg-white text-gray-800 px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-wide font-serif text-black-600">
            Nessco
          </span>
        </div>
        <div className="flex space-x-8 text-sm font-semibold">
          <a href="#" className="hover:text-blue-500 transition">
            Home
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            About
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            Contact Us
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            Help
          </a>
        </div>
      </nav>

      {/* Form Section */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Employee Name */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Employee Name
            </label>
            <Select
              isMulti
              options={employeeOptions}
              value={selectedEmployees}
              onChange={handleEmployeeChange}
              className="text-sm"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block mb-2 text-sm font-semibold">Type</label>
            <input
              type="text"
              value={
                selectedEmployees.length > 1
                  ? "Group"
                  : selectedEmployees.length === 1
                  ? "Individual"
                  : ""
              }
              readOnly
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>

          {/* Department */}
          {/* Department */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Department
            </label>
            <div className="space-y-4">
              {selectedEmployees.length > 0 ? (
                selectedEmployees.map((emp) => (
                  <div
                    key={emp.value}
                    className="flex items-center gap-4 border p-3 rounded-md shadow-md bg-gray-50"
                  >
                    <span className="text-sm font-medium">{emp.label}</span>
                    <Select
                      options={departmentOptions}
                      value={departmentOptions.find(
                        (dept) => dept.value === departmentMap[emp.value]
                      )}
                      onChange={(selectedDepartment) =>
                        handleDepartmentChange(emp.value, selectedDepartment)
                      }
                      className="text-sm w-48"
                      placeholder="Select Department"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No employees selected</p>
              )}
            </div>
          </div>

          {/* Select Dates */}
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Select Dates
            </label>
            <div className="flex items-center gap-2">
              <DatePicker
                selected={null}
                onChange={handleDateClick}
                minDate={new Date()}
                customInput={
                  <input
                    className="w-full p-2 border rounded-md text-sm cursor-pointer"
                    placeholder="Select Dates"
                    readOnly
                  />
                }
              />
              <button
                onClick={() => setIsDateModalOpen(true)}
                className="bg-black hover:bg-gray-800 text-white p-2 rounded-full"
              >
                <FaPlus size={18} />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {selectedDates.length > 0
                ? selectedDates.map((d) => d.toLocaleDateString()).join(", ")
                : "No dates selected"}
            </div>
          </div>
        </div>

        {/* Table to display saved travel data */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Saved Travel Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Employee",
                    "Department",
                    "Dates",
                    "Country",
                    "State",
                    "City",
                    "Client",
                    "Purpose",
                    "Remarks",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border px-4 py-2 text-sm font-semibold text-left"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {savedData.map((data, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-sm">
                      {data.employee.join(", ")}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      {data.departments.join(", ")}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      {data.dates
                        .map((d) => new Date(d).toLocaleDateString())
                        .join(", ")}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      {data.details.country}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      {data.details.state}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      {data.details.city}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      {data.details.client}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      {data.details.purpose}
                    </td>
                    <td className="border px-4 py-2 text-sm">
                      {data.details.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan for X days Modal */}
        <Dialog
          open={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
        >
          <DialogTitle>
            Plan for {selectedDates.length}{" "}
            {selectedDates.length === 1 ? "day" : "days"}
          </DialogTitle>
          <DialogContent>
            <div className="space-y-4 mb-6">
              {selectedDates.length === 0 ? (
                <p className="text-center text-gray-400">No dates selected</p>
              ) : (
                selectedDates.map((date, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-full"
                  >
                    <span className="text-sm font-medium">
                      Day {index + 1} {date.toLocaleDateString("en-GB")}
                    </span>
                    <button
                      onClick={() => openDetailModal(date)}
                      className="text-black hover:text-gray-700"
                    >
                      <FaPlus size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDateModalOpen(false)} color="primary">
              Save
            </Button>
            <Button onClick={handleClearDates} color="secondary">
              Clear
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enter Travel Details Modal */}
        {/* <Dialog
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        >
          <DialogTitle>Enter Travel Details</DialogTitle>
          <DialogContent>
            <form onSubmit={handleDetailSave} className="space-y-4">
              <Select
                options={countries}
                value={countries.find((c) => c.value === dateDetails.country)}
                onChange={handleCountryChange}
                placeholder="Select Country"
              />
              <Select
                options={states}
                value={states.find((s) => s.value === dateDetails.state)}
                onChange={handleStateChange}
                placeholder="Select State"
              />
              <Select
                options={cities}
                value={cities.find((c) => c.value === dateDetails.city)}
                onChange={handleCityChange}
                placeholder="Select City"
              />
              <input
                type="text"
                name="client"
                value={dateDetails.client}
                onChange={(e) =>
                  setDateDetails((prev) => ({
                    ...prev,
                    client: e.target.value,
                  }))
                }
                placeholder="Client"
                className="w-full p-2 border rounded-md text-sm"
              />
              <input
                type="text"
                name="purpose"
                value={dateDetails.purpose}
                onChange={(e) =>
                  setDateDetails((prev) => ({
                    ...prev,
                    purpose: e.target.value,
                  }))
                }
                placeholder="Purpose"
                className="w-full p-2 border rounded-md text-sm"
              />
              <textarea
                name="remarks"
                value={dateDetails.remarks}
                onChange={(e) =>
                  setDateDetails((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
                placeholder="Remarks"
                className="w-full p-2 border rounded-md text-sm"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDetailModalOpen(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog> */}
        {/* Enter Travel Details Modal */}
        {/* Enter Travel Details Modal */}
        <Dialog
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        >
          <DialogTitle>Enter Travel Details</DialogTitle>
          <DialogContent>
            <form onSubmit={handleDetailSave} className="space-y-4">
              <Select
                options={countries}
                value={countries.find((c) => c.value === dateDetails.country)}
                onChange={handleCountryChange}
                placeholder="Select Country"
              />
              <Select
                options={states}
                value={states.find((s) => s.value === dateDetails.state)}
                onChange={handleStateChange}
                placeholder="Select State"
              />
              <Select
                options={cities}
                value={cities.find((c) => c.value === dateDetails.city)}
                onChange={handleCityChange}
                placeholder="Select City"
              />
              <input
                type="text"
                name="client"
                value={dateDetails.client}
                onChange={(e) =>
                  setDateDetails((prev) => ({
                    ...prev,
                    client: e.target.value,
                  }))
                }
                placeholder="Client"
                className="w-full p-2 border rounded-md text-sm"
              />
              <input
                type="text"
                name="purpose"
                value={dateDetails.purpose}
                onChange={(e) =>
                  setDateDetails((prev) => ({
                    ...prev,
                    purpose: e.target.value,
                  }))
                }
                placeholder="Purpose"
                className="w-full p-2 border rounded-md text-sm"
              />
              <textarea
                name="remarks"
                value={dateDetails.remarks}
                onChange={(e) =>
                  setDateDetails((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
                placeholder="Remarks"
                className="w-full p-2 border rounded-md text-sm"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDetailModalOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDetailSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </nav>
  );
};

export default TravelForm;
