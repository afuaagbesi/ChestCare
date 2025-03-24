import React from "react";
import { motion } from "framer-motion"; // For animations
import { Card, CardContent, Typography, Grid } from "@mui/material"; // For Material UI Cards

function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.h1
        className="text-3xl mb-6 text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Admin Dashboard
      </motion.h1>

      {/* Doctor Metrics */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }} // Hover effect with animation
          >
            <Card>
              <CardContent>
                <Typography variant="h5" className="text-center text-primary">
                  Doctor Performance
                </Typography>
                <Typography variant="body1" className="text-center text-gray-600 mt-4">
                  Total Doctors: 10
                </Typography>
                <Typography variant="body1" className="text-center text-gray-600 mt-2">
                  Average Patient Rating: 4.8/5
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h5" className="text-center text-primary">
                  Patient Analytics
                </Typography>
                <Typography variant="body1" className="text-center text-gray-600 mt-4">
                  Total Patients Seen: 100
                </Typography>
                <Typography variant="body1" className="text-center text-gray-600 mt-2">
                  Total Successful Diagnoses: 95%
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Add more stats or metrics here */}
    </div>
  );
}

export default AdminDashboardPage;
