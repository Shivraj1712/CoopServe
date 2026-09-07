import React from "react";
import { Stepper, Step, StepLabel, Box, Paper, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EngineeringIcon from "@mui/icons-material/Engineering";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PaymentIcon from "@mui/icons-material/Payment";

const STEPS = [
  { key: "REQUESTED", label: "Requested", icon: AccessTimeIcon },
  { key: "ACCEPTED", label: "Worker Matched", icon: CheckCircleOutlineIcon },
  { key: "IN_PROGRESS", label: "Work In Progress", icon: EngineeringIcon },
  { key: "COMPLETED", label: "Service Completed", icon: TaskAltIcon },
  { key: "PAID", label: "Payment Processed", icon: PaymentIcon }
];

export default function StatusStepper({ status, hasRating }) {
  const getActiveStep = () => {
    switch (status) {
      case "REQUESTED":
        return 0;
      case "ACCEPTED":
        return 1;
      case "IN_PROGRESS":
        return 2;
      case "COMPLETED":
        return 3;
      case "PAID":
        return hasRating ? 5 : 4;
      default:
        return 0;
    }
  };

  const activeStep = getActiveStep();

  return (
    <Paper elevation={0} sx={{ p: 3, background: "#F1F5F9", border: "1px solid #E2E8F0" }}>
      <Typography variant="subtitle2" sx={{ color: "#64748B", fontWeight: 700, mb: 2, textTransform: "uppercase" }}>
        Live Booking Status Machine
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((step, index) => {
          const IconComponent = step.icon;
          const isCompleted = activeStep > index;
          const isActive = activeStep === index;

          return (
            <Step key={step.key} completed={isCompleted}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isCompleted
                        ? "#2E7D32"
                        : isActive
                        ? "#1E3A8A"
                        : "#CBD5E1",
                      color: "#FFFFFF",
                      boxShadow: isActive ? "0 0 0 4px rgba(30, 58, 138, 0.2)" : "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <IconComponent fontSize="small" />
                  </Box>
                )}
              >
                <Typography variant="caption" sx={{ fontWeight: isActive ? 700 : 500, color: isActive ? "#1E3A8A" : "#475569" }}>
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Paper>
  );
}
