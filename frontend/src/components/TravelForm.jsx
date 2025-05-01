// -----------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import DatePicker from "react-datepicker";

// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
// } from "@mui/material";
// import { FaPlus } from "react-icons/fa";
// import axios from "axios";
// import "react-datepicker/dist/react-datepicker.css";

// const TravelForm = () => {
//   const [employeeOptions, setEmployeeOptions] = useState([]);
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [departmentOptions, setDepartmentOptions] = useState([]);
//   const [departmentMap, setDepartmentMap] = useState({});
//   const [selectedDates, setSelectedDates] = useState([]);
//   const [isDateModalOpen, setIsDateModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [selectedDateForDetails, setSelectedDateForDetails] = useState(null);
//   const [savedData, setSavedData] = useState([]);
//   const [dateDetails, setDateDetails] = useState({
//     country: "",
//     state: "",
//     city: "",
//     client: "",
//     purpose: "",
//     remarks: "",
//   });
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/get-employee-data")
//       .then((res) => {
//         const employees = res.data.map((emp) => ({
//           label: emp.name,
//           value: emp.name,
//         }));
//         setEmployeeOptions(employees);
//       })
//       .catch((err) => console.error("Error fetching employee data:", err));

//     axios
//       .get("https://countriesnow.space/api/v0.1/countries/positions")
//       .then((res) => {
//         const countryList = res.data.data.map((country) => ({
//           label: country.name,
//           value: country.name,
//         }));
//         setCountries(countryList);
//       })
//       .catch((err) => console.error("Error fetching countries:", err));

//     // Fetch department options (you can customize this list if needed)
//     const departments = ["HR", "Sales", "IT", "Marketing", "Finance"];
//     const departmentList = departments.map((dept) => ({
//       label: dept,
//       value: dept,
//     }));
//     setDepartmentOptions(departmentList);
//   }, []);

//   const handleEmployeeChange = (selected) => {
//     setSelectedEmployees(selected || []);
//     // Initialize departments for each employee
//     const newDepartmentMap = {};
//     selected.forEach((emp) => {
//       newDepartmentMap[emp.value] = "";
//     });
//     setDepartmentMap(newDepartmentMap);
//   };

//   const handleDepartmentChange = (employeeName, selectedDepartment) => {
//     setDepartmentMap((prev) => ({
//       ...prev,
//       [employeeName]: selectedDepartment ? selectedDepartment.value : "",
//     }));
//   };

//   const handleDateClick = (date) => {
//     const exists = selectedDates.some(
//       (d) => d.toDateString() === date.toDateString()
//     );
//     if (exists) {
//       setSelectedDates((prev) =>
//         prev.filter((d) => d.toDateString() !== date.toDateString())
//       );
//     } else {
//       setSelectedDates((prev) => [...prev, date].sort((a, b) => a - b));
//     }
//   };

//   const openDetailModal = (date) => {
//     setSelectedDateForDetails(date);
//     setIsDetailModalOpen(true);
//   };

//   const handleDetailSave = (e) => {
//     e.preventDefault();
//     const travelData = {
//       employee: selectedEmployees.map((emp) => emp.value),
//       type: selectedEmployees.length > 1 ? "Group" : "Individual",
//       departments: selectedEmployees.map((emp) => departmentMap[emp.value]),
//       dates: selectedDates.map((date) => date.toISOString()),
//       details: dateDetails,
//     };
//     axios
//       .post("http://localhost:5000/api/save-travel-data", travelData)
//       .then(() => {
//         setSavedData((prev) => [...prev, travelData]);
//         setDateDetails({
//           country: "",
//           state: "",
//           city: "",
//           client: "",
//           purpose: "",
//           remarks: "",
//         });
//         setStates([]);
//         setCities([]);
//         setIsDetailModalOpen(false);
//       })
//       .catch((err) => console.error("Error saving travel data:", err));
//   };

//   const handleCountryChange = (selected) => {
//     setDateDetails((prev) => ({
//       ...prev,
//       country: selected.value,
//       state: "",
//       city: "",
//     }));
//     axios
//       .post("https://countriesnow.space/api/v0.1/countries/states", {
//         country: selected.value,
//       })
//       .then((res) =>
//         setStates(
//           res.data.data.states.map((s) => ({ label: s.name, value: s.name }))
//         )
//       )
//       .catch((err) => console.error("Error fetching states:", err));
//     setCities([]);
//   };

//   const handleStateChange = (selected) => {
//     setDateDetails((prev) => ({ ...prev, state: selected.value, city: "" }));
//     axios
//       .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
//         country: dateDetails.country,
//         state: selected.value,
//       })
//       .then((res) =>
//         setCities(res.data.data.map((c) => ({ label: c, value: c })))
//       )
//       .catch((err) => console.error("Error fetching cities:", err));
//   };

//   const handleCityChange = (selected) => {
//     setDateDetails((prev) => ({ ...prev, city: selected.value }));
//   };

//   const handleClearDates = () => {
//     setSelectedDates([]);
//   };

//   return (
//     <nav>
//       {/* Navbar */}
//       <nav className="bg-white text-gray-800 px-8 py-4 flex justify-between items-center shadow-md">
//         <div className="flex items-center space-x-2">
//           <span className="text-2xl font-bold tracking-wide font-serif text-black-600">
//             Nessco
//           </span>
//         </div>
//         <div className="flex space-x-8 text-sm font-semibold">
//           <a href="#" className="hover:text-blue-500 transition">
//             Home
//           </a>
//           <a href="#" className="hover:text-blue-500 transition">
//             About
//           </a>
//           <a href="#" className="hover:text-blue-500 transition">
//             Contact Us
//           </a>
//           <a href="#" className="hover:text-blue-500 transition">
//             Help
//           </a>
//         </div>
//       </nav>

//       {/* Form Section */}
//       <div className="p-8 max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
//           {/* Employee Name */}
//           <div>
//             <label className="block mb-2 text-sm font-semibold">
//               Employee Name
//             </label>
//             <Select
//               isMulti
//               options={employeeOptions}
//               value={selectedEmployees}
//               onChange={handleEmployeeChange}
//               className="text-sm"
//             />
//           </div>

//           {/* Type */}
//           <div>
//             <label className="block mb-2 text-sm font-semibold">Type</label>
//             <input
//               type="text"
//               value={
//                 selectedEmployees.length > 1
//                   ? "Group"
//                   : selectedEmployees.length === 1
//                   ? "Individual"
//                   : ""
//               }
//               readOnly
//               className="w-full p-2 border rounded-md text-sm"
//             />
//           </div>

//           {/* Department */}
//           {/* Department */}
//           <div>
//             <label className="block mb-2 text-sm font-semibold">
//               Department
//             </label>
//             <div className="space-y-4">
//               {selectedEmployees.length > 0 ? (
//                 selectedEmployees.map((emp) => (
//                   <div
//                     key={emp.value}
//                     className="flex items-center gap-4 border p-3 rounded-md shadow-md bg-gray-50"
//                   >
//                     <span className="text-sm font-medium">{emp.label}</span>
//                     <Select
//                       options={departmentOptions}
//                       value={departmentOptions.find(
//                         (dept) => dept.value === departmentMap[emp.value]
//                       )}
//                       onChange={(selectedDepartment) =>
//                         handleDepartmentChange(emp.value, selectedDepartment)
//                       }
//                       className="text-sm w-48"
//                       placeholder="Select Department"
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-sm">No employees selected</p>
//               )}
//             </div>
//           </div>

//           {/* Select Dates */}
//           <div>
//             <label className="block mb-2 text-sm font-semibold">
//               Select Dates
//             </label>
//             <div className="flex items-center gap-2">
//               <DatePicker
//                 selected={null}
//                 onChange={handleDateClick}
//                 minDate={new Date()}
//                 customInput={
//                   <input
//                     className="w-full p-2 border rounded-md text-sm cursor-pointer"
//                     placeholder="Select Dates"
//                     readOnly
//                   />
//                 }
//               />
//               <button
//                 onClick={() => setIsDateModalOpen(true)}
//                 className="bg-black hover:bg-gray-800 text-white p-2 rounded-full"
//               >
//                 <FaPlus size={18} />
//               </button>
//             </div>
//             <div className="mt-2 text-xs text-gray-600">
//               {selectedDates.length > 0
//                 ? selectedDates.map((d) => d.toLocaleDateString()).join(", ")
//                 : "No dates selected"}
//             </div>
//           </div>
//         </div>

//         {/* Table to display saved travel data */}
//         <div className="mt-10">
//           <h2 className="text-2xl font-semibold mb-6">Saved Travel Data</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-300">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {[
//                     "Employee",
//                     "Department",
//                     "Dates",
//                     "Country",
//                     "State",
//                     "City",
//                     "Client",
//                     "Purpose",
//                     "Remarks",
//                   ].map((head) => (
//                     <th
//                       key={head}
//                       className="border px-4 py-2 text-sm font-semibold text-left"
//                     >
//                       {head}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {savedData.map((data, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="border px-4 py-2 text-sm">
//                       {data.employee.join(", ")}
//                     </td>
//                     <td className="border px-4 py-2 text-sm">
//                       {data.departments.join(", ")}
//                     </td>
//                     <td className="border px-4 py-2 text-sm">
//                       {data.dates
//                         .map((d) => new Date(d).toLocaleDateString())
//                         .join(", ")}
//                     </td>
//                     <td className="border px-4 py-2 text-sm">
//                       {data.details.country}
//                     </td>
//                     <td className="border px-4 py-2 text-sm">
//                       {data.details.state}
//                     </td>
//                     <td className="border px-4 py-2 text-sm">
//                       {data.details.city}
//                     </td>
//                     <td className="border px-4 py-2 text-sm">
//                       {data.details.client}
//                     </td>
//                     <td className="border px-4 py-2 text-sm">
//                       {data.details.purpose}
//                     </td>
//                     <td className="border px-4 py-2 text-sm">
//                       {data.details.remarks}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Plan for X days Modal */}
//         <Dialog
//           open={isDateModalOpen}
//           onClose={() => setIsDateModalOpen(false)}
//         >
//           <DialogTitle>
//             Plan for {selectedDates.length}{" "}
//             {selectedDates.length === 1 ? "day" : "days"}
//           </DialogTitle>
//           <DialogContent>
//             <div className="space-y-4 mb-6">
//               {selectedDates.length === 0 ? (
//                 <p className="text-center text-gray-400">No dates selected</p>
//               ) : (
//                 selectedDates.map((date, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-full"
//                   >
//                     <span className="text-sm font-medium">
//                       Day {index + 1} {date.toLocaleDateString("en-GB")}
//                     </span>
//                     <button
//                       onClick={() => openDetailModal(date)}
//                       className="text-black hover:text-gray-700"
//                     >
//                       <FaPlus size={18} />
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setIsDateModalOpen(false)} color="primary">
//               Save
//             </Button>
//             <Button onClick={handleClearDates} color="secondary">
//               Clear
//             </Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog
//           open={isDetailModalOpen}
//           onClose={() => setIsDetailModalOpen(false)}
//         >
//           <DialogTitle>Enter Travel Details</DialogTitle>
//           <DialogContent>
//             <form onSubmit={handleDetailSave} className="space-y-4">
//               <Select
//                 options={countries}
//                 value={countries.find((c) => c.value === dateDetails.country)}
//                 onChange={handleCountryChange}
//                 placeholder="Select Country"
//               />
//               <Select
//                 options={states}
//                 value={states.find((s) => s.value === dateDetails.state)}
//                 onChange={handleStateChange}
//                 placeholder="Select State"
//               />
//               <Select
//                 options={cities}
//                 value={cities.find((c) => c.value === dateDetails.city)}
//                 onChange={handleCityChange}
//                 placeholder="Select City"
//               />
//               <input
//                 type="text"
//                 name="client"
//                 value={dateDetails.client}
//                 onChange={(e) =>
//                   setDateDetails((prev) => ({
//                     ...prev,
//                     client: e.target.value,
//                   }))
//                 }
//                 placeholder="Client"
//                 className="w-full p-2 border rounded-md text-sm"
//               />
//               <input
//                 type="text"
//                 name="purpose"
//                 value={dateDetails.purpose}
//                 onChange={(e) =>
//                   setDateDetails((prev) => ({
//                     ...prev,
//                     purpose: e.target.value,
//                   }))
//                 }
//                 placeholder="Purpose"
//                 className="w-full p-2 border rounded-md text-sm"
//               />
//               <textarea
//                 name="remarks"
//                 value={dateDetails.remarks}
//                 onChange={(e) =>
//                   setDateDetails((prev) => ({
//                     ...prev,
//                     remarks: e.target.value,
//                   }))
//                 }
//                 placeholder="Remarks"
//                 className="w-full p-2 border rounded-md text-sm"
//               />
//             </form>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setIsDetailModalOpen(false)} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleDetailSave} color="primary">
//               Save
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     </nav>
//   );
// };

// export default TravelForm;

// ------------------------------------------------------
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
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDateForDetails, setSelectedDateForDetails] = useState(null);
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
  const [savedTravelData, setSavedTravelData] = useState([]); // State to store travel data

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

    // Fetch department options
    const departments = ["HR", "Sales", "IT", "Marketing", "Finance"];
    const departmentList = departments.map((dept) => ({
      label: dept,
      value: dept,
    }));
    setDepartmentOptions(departmentList);
  }, []);

  const handleEmployeeChange = (selected) => {
    setSelectedEmployees(selected || []);
  };

  const handleDepartmentChange = (selectedDepartment) => {
    setSelectedDepartment(selectedDepartment ? selectedDepartment.value : "");
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
      department: selectedDepartment, // Shared department for all employees in a group
      dates: selectedDates.map((date) => date.toISOString()),
      details: dateDetails,
    };

    // Send data to backend API
    axios
      .post("http://localhost:5000/api/save-travel-data", travelData)
      .then(() => {
        // Save the travel data in the savedTravelData state only after successful POST
        setSavedTravelData((prevData) => [...prevData, travelData]);

        // Reset form fields
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
      .catch((err) => {
        console.error("Error saving travel data:", err);
      });
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
    <div>
      <nav className="bg-white text-gray-800 px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-wide font-serif text-black-600">
            Nessco
          </span>
        </div>
        {/* <div className="flex space-x-8 text-sm font-semibold">
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
        </div> */}
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
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
            {selectedEmployees.length > 0 && (
              <p className="text-sm mt-2 font-medium text-gray-700">
                Selected Employees:{" "}
                {selectedEmployees.map((emp) => emp.label).join(", ")}
              </p>
            )}
          </div>

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

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Department
            </label>
            {selectedEmployees.length > 1 ? (
              <Select
                options={departmentOptions}
                value={departmentOptions.find(
                  (dept) => dept.value === selectedDepartment
                )}
                onChange={handleDepartmentChange}
                className="text-sm"
                placeholder="Select Department for Group"
              />
            ) : (
              <div className="mb-4">
                <Select
                  options={departmentOptions}
                  value={departmentOptions.find(
                    (dept) => dept.value === selectedDepartment
                  )}
                  onChange={handleDepartmentChange}
                  className="text-sm"
                  placeholder="Select Department"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Select Dates
            </label>
            <div className="relative">
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
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <button
                  onClick={() => setIsDateModalOpen(true)}
                  className="bg-black hover:bg-gray-800 text-white p-2 rounded-full"
                >
                  <FaPlus size={18} />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-semibold">Selected Dates:</p>
              <p className="text-sm text-gray-700">
                {selectedDates.map((date) => date.toDateString()).join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Table to display saved travel data */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Saved Travel Data</h2>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Employees</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Dates</th>
                <th className="border px-4 py-2">Country</th>
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">City</th>
                <th className="border px-4 py-2">Client</th>
                <th className="border px-4 py-2">Purpose</th>
                <th className="border px-4 py-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {savedTravelData.map((data, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {data.employee.join(", ")}
                  </td>
                  <td className="border px-4 py-2">{data.type}</td>
                  <td className="border px-4 py-2">{data.department}</td>
                  <td className="border px-4 py-2">
                    {data.dates.map((date, i) => (
                      <p key={i}>{new Date(date).toDateString()}</p>
                    ))}
                  </td>
                  <td className="border px-4 py-2">{data.details.country}</td>
                  <td className="border px-4 py-2">{data.details.state}</td>
                  <td className="border px-4 py-2">{data.details.city}</td>
                  <td className="border px-4 py-2">{data.details.client}</td>
                  <td className="border px-4 py-2">{data.details.purpose}</td>
                  <td className="border px-4 py-2">{data.details.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Date Modal with List of Selected Dates */}
        <Dialog
          open={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
        >
          <DialogTitle>Selected Dates</DialogTitle>
          <DialogContent>
            {selectedDates.length > 0 ? (
              selectedDates.map((date, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4"
                >
                  <span>{date.toDateString()}</span>
                  <button
                    className="text-blue-600"
                    onClick={() => openDetailModal(date)}
                  >
                    + Add Details
                  </button>
                </div>
              ))
            ) : (
              <p>No dates selected</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClearDates}>Clear Dates</Button>
            <Button onClick={() => setIsDateModalOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Detail Modal */}
        <Dialog
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        >
          <DialogTitle>
            Enter Travel Details for {selectedDateForDetails?.toDateString()}
          </DialogTitle>
          <DialogContent>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Country
              </label>
              <Select
                options={countries}
                value={countries.find(
                  (country) => country.value === dateDetails.country
                )}
                onChange={handleCountryChange}
                className="text-sm"
                placeholder="Select Country"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">State</label>
              <Select
                options={states}
                value={states.find(
                  (state) => state.value === dateDetails.state
                )}
                onChange={handleStateChange}
                className="text-sm"
                placeholder="Select State"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">City</label>
              <Select
                options={cities}
                value={cities.find((city) => city.value === dateDetails.city)}
                onChange={handleCityChange}
                className="text-sm"
                placeholder="Select City"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Client</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md text-sm"
                value={dateDetails.client}
                onChange={(e) =>
                  setDateDetails({ ...dateDetails, client: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Purpose
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md text-sm"
                value={dateDetails.purpose}
                onChange={(e) =>
                  setDateDetails({ ...dateDetails, purpose: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Remarks
              </label>
              <textarea
                className="w-full p-2 border rounded-md text-sm"
                value={dateDetails.remarks}
                onChange={(e) =>
                  setDateDetails({ ...dateDetails, remarks: e.target.value })
                }
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDetailSave} color="primary">
              Save Details
            </Button>
            <Button onClick={() => setIsDetailModalOpen(false)} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default TravelForm;
