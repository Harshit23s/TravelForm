import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";

const TravelDataTable = () => {
  const [travelData, setTravelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(5); // Show first 5 rows initially

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/get-travel-data")
      .then((res) => {
        setTravelData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching travel data:", err);
        setLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleRows((prev) => prev + 5); // Show 5 more rows each time
  };

  if (loading) return <CircularProgress />;

  const visibleData = travelData.slice(0, visibleRows);

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Saved Travel Entries
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Dates</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>State</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Purpose</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.employee}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>{new Date(row.dates).toLocaleDateString()}</TableCell>
              <TableCell>{row.country}</TableCell>
              <TableCell>{row.state}</TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>{row.client}</TableCell>
              <TableCell>{row.purpose}</TableCell>
              <TableCell>{row.remarks}</TableCell>
              <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {visibleRows < travelData.length && (
        <Box textAlign="center" sx={{ p: 2 }}>
          <Button variant="contained" onClick={handleLoadMore}>
            Load More
          </Button>
        </Box>
      )}
    </TableContainer>
  );
};

export default TravelDataTable;
