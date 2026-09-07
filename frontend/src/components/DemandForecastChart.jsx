import React, { useState } from "react";
import { Paper, Typography, Box, Grid, Chip, Tabs, Tab } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

export default function DemandForecastChart({ forecastData, highDemandZones, insights }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  if (!forecastData || forecastData.length === 0) return null;

  const categories = ["Electrical", "Plumbing", "Carpentry", "Caregiving"];
  const categoryColors = {
    Electrical: "#1E3A8A",
    Plumbing: "#0284C7",
    Carpentry: "#10B981",
    Caregiving: "#8B5CF6"
  };

  const filteredCategories = selectedCategory === "ALL" ? categories : [selectedCategory];

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid #E2E8F0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUpIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            AI Demand Forecast & Peak Hour Analytics
          </Typography>
        </Box>
        <Chip icon={<ElectricBoltIcon />} label="Smart Automation ML Engine" color="primary" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {insights || "Historical booking volume pattern analysis across Gujarat Cooperative Clusters."}
      </Typography>

      {/* Category Filter Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(e, val) => setSelectedCategory(val)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
        >
          <Tab label="All Service Categories" value="ALL" sx={{ fontWeight: 700 }} />
          {categories.map((cat) => (
            <Tab key={cat} label={cat} value={cat} sx={{ fontWeight: 700 }} />
          ))}
        </Tabs>
      </Box>

      {/* Visual Bar Chart */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", height: 200, pt: 2, pb: 1, px: 1, borderBottom: "2px solid #E2E8F0" }}>
        {forecastData.map((item, idx) => (
          <Box key={idx} sx={{ flex: 1, textAlign: "center" }}>
            <Box sx={{ display: "flex", gap: 0.8, alignItems: "flex-end", justifyContent: "center", height: 150 }}>
              {filteredCategories.map((cat) => {
                const val = item[cat] || 15;
                const heightPct = Math.min(100, Math.max(15, val * 2.2));
                return (
                  <Box
                    key={cat}
                    title={`${cat}: ${val} predicted requests`}
                    sx={{
                      width: selectedCategory === "ALL" ? 14 : 32,
                      height: `${heightPct}%`,
                      bgcolor: categoryColors[cat],
                      borderRadius: "6px 6px 0 0",
                      transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                    }}
                  />
                );
              })}
            </Box>
            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700, color: "#64748B", mt: 1, display: "block" }}>
              {item.time}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Category Color Legend */}
      <Box sx={{ display: "flex", gap: 3, justifyContent: "center", mt: 2.5, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <Box key={cat} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: categoryColors[cat] }} />
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              {cat}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* High Demand Cluster Alert Cards */}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 4, mb: 2, color: "#0F172A" }}>
        🔥 Predicted High-Demand Surge Cluster Zones
      </Typography>
      <Grid container spacing={2}>
        {highDemandZones?.map((zone, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Paper elevation={0} sx={{ p: 2.5, background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LocationOnIcon sx={{ color: "#E65100" }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="#0F172A">
                      {zone.zone}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Top Demand: {zone.topSkills}
                    </Typography>
                  </Box>
                </Box>
                <Chip label={zone.predictedIncrease} color="error" size="small" sx={{ fontWeight: 800 }} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
