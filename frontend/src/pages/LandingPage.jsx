import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import CarpenterIcon from "@mui/icons-material/Carpenter";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ParkIcon from "@mui/icons-material/Park";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";

const SERVICES = [
  { name: "Electrical Services", icon: ElectricalServicesIcon, rate: "₹450/visit", desc: "Wiring, switchboard repair, appliance installation & safety audit" },
  { name: "Plumbing & Sanitation", icon: PlumbingIcon, rate: "₹400/visit", desc: "Pipe repair, tap leakage, bath fittings & drainage clearing" },
  { name: "Carpentry & Woodwork", icon: CarpenterIcon, rate: "₹500/visit", desc: "Custom furniture repair, door lock replacement & wood fitting" },
  { name: "Interior Painting", icon: FormatPaintIcon, rate: "₹600/visit", desc: "Wall touch-ups, full home painting & waterproofing treatment" },
  { name: "Elderly Caregiving", icon: MedicalServicesIcon, rate: "₹350/visit", desc: "Dedicated patient assistance, elderly care & nursing support" },
  { name: "Lawn & Gardening", icon: ParkIcon, rate: "₹300/visit", desc: "Lawn trimming, terrace garden maintenance & plant care" },
  { name: "Deep Housekeeping", icon: CleaningServicesIcon, rate: "₹300/visit", desc: "Full home deep cleaning, kitchen sanitation & housekeeping" },
  { name: "Personal Driver", icon: DirectionsCarIcon, rate: "₹450/visit", desc: "Background-checked driver for outstation & city transit" }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #1E3A8A 100%)",
          color: "#FFFFFF",
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                icon={<ShieldCheckIcon style={{ color: "#10B981" }} />}
                label="Certified Labour Cooperative Federation Network"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: "#38BDF8",
                  fontWeight: 700,
                  mb: 3,
                  px: 1,
                  backdropFilter: "blur(8px)"
                }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-1.5px",
                  lineHeight: 1.15,
                  mb: 2.5,
                  fontSize: { xs: "2.25rem", sm: "3.25rem", md: "3.75rem" }
                }}
              >
                Fair Gig Work. <br />
                <span style={{ background: "linear-gradient(90deg, #38BDF8, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Direct Payouts.
                </span> <br />
                Verified Local Services.
              </Typography>

              <Typography variant="h6" sx={{ color: "#94A3B8", fontWeight: 400, mb: 4, lineHeight: 1.6, maxW: 600 }}>
                CoopServe connects households directly with certified trade workers under Labour Cooperative Federations. Enjoy transparent 90% direct worker payouts and 10% co-op welfare reserve funds.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 5 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
                    px: 4,
                    py: 1.6,
                    fontSize: 16,
                    fontWeight: 800,
                    borderRadius: 3,
                    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)"
                  }}
                >
                  Book Service Now
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "#FFFFFF",
                    px: 3.5,
                    py: 1.6,
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 3,
                    "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.05)" }
                  }}
                >
                  Join as Co-op Worker
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: "rgba(30, 41, 59, 0.8)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: 4,
                  color: "#FFFFFF"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Avatar sx={{ background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)", width: 48, height: 48 }}>
                    <HandshakeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={800}>CoopServe Impact</Typography>
                    <Typography variant="caption" sx={{ color: "#94A3B8" }}>Gujarat Cooperative Federation</Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.05)", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={800} color="#38BDF8">10,000+</Typography>
                      <Typography variant="caption" color="#94A3B8">Verified Co-op Workers</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.05)", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={800} color="#60A5FA">₹1.2 Cr+</Typography>
                      <Typography variant="caption" color="#94A3B8">Direct Worker Disbursal</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.05)", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={800} color="#10B981">90%</Typography>
                      <Typography variant="caption" color="#94A3B8">Direct Worker Payout</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, bgcolor: "rgba(255, 255, 255, 0.05)", borderRadius: 2 }}>
                      <Typography variant="h4" fontWeight={800} color="#A855F7">10%</Typography>
                      <Typography variant="caption" color="#94A3B8">Co-op Welfare Fund</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* TRADE SERVICES DIRECTORY SECTION */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="overline" sx={{ color: "#2563EB", fontWeight: 800, letterSpacing: 1.5 }}>
            ON-DEMAND TRADE SERVICES
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", mt: 1 }}>
            Explore Verified Cooperative Trade Services
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxW: 650, mx: "auto", mt: 1.5 }}>
            Background-checked professionals matched by Haversine proximity algorithm.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {SERVICES.map((item) => {
            const IconComp = item.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={item.name}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3.5,
                    border: "1px solid #E2E8F0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#2563EB",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Avatar sx={{ bgcolor: "#EFF6FF", color: "#1E3A8A", width: 50, height: 50 }}>
                        <IconComp fontSize="medium" />
                      </Avatar>
                      <Chip label={item.rate} color="primary" size="small" sx={{ fontWeight: 800 }} />
                    </Box>

                    <Typography variant="h6" fontWeight={800} gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => navigate("/login")}
                      sx={{ borderRadius: 2.5, fontWeight: 700 }}
                    >
                      Book Service
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* WHY COOPSERVE — COOPERATIVE ADVANTAGE VS TRADITIONAL */}
      <Box sx={{ bgcolor: "#FFFFFF", py: { xs: 8, md: 12 }, borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="overline" sx={{ color: "#1E3A8A", fontWeight: 800, letterSpacing: 1.5 }}>
              THE COOPERATIVE MODEL
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", mt: 1 }}>
              Why CoopServe Outperforms Corporate Aggregators
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, bg: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 4, height: "100%" }}>
                <Typography variant="h5" fontWeight={800} color="#DC2626" sx={{ mb: 2 }}>
                  ❌ Traditional Corporate Aggregators
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span style={{ color: "#DC2626", fontWeight: 800 }}>•</span> 30% to 40% corporate commission deducted from workers
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span style={{ color: "#DC2626", fontWeight: 800 }}>•</span> Zero healthcare or accident protection for gig workers
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span style={{ color: "#DC2626", fontWeight: 800 }}>•</span> Algorithmic surge pricing with hidden customer fees
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span style={{ color: "#DC2626", fontWeight: 800 }}>•</span> High worker churn and unverified subcontracting
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, bg: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 4, height: "100%" }}>
                <Typography variant="h5" fontWeight={800} color="#166534" sx={{ mb: 2 }}>
                  ✅ CoopServe Labour Federation Network
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body2" color="#166534" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
                    <CheckCircleIcon color="success" fontSize="small" /> 90% Direct Worker Payout directly into worker bank accounts
                  </Typography>
                  <Typography variant="body2" color="#166534" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
                    <CheckCircleIcon color="success" fontSize="small" /> 10% Dedicated Cooperative Reserve for health & accident insurance
                  </Typography>
                  <Typography variant="body2" color="#166534" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
                    <CheckCircleIcon color="success" fontSize="small" /> Transparent, standard upfront pricing with zero hidden charges
                  </Typography>
                  <Typography variant="body2" color="#166534" sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
                    <CheckCircleIcon color="success" fontSize="small" /> 100% Aadhaar & police verified skilled co-op members
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* HOW IT WORKS SECTION */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="overline" sx={{ color: "#2563EB", fontWeight: 800, letterSpacing: 1.5 }}>
            STREAMLINED WORKFLOW
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", mt: 1 }}>
            How CoopServe Works in 3 Simple Steps
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, border: "1px solid #E2E8F0", borderRadius: 4, textAlign: "center", height: "100%" }}>
              <Avatar sx={{ bgcolor: "#1E3A8A", width: 56, height: 56, mx: "auto", mb: 2, fontWeight: 800, fontSize: 24 }}>
                1
              </Avatar>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Select Skill & Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose electrical, plumbing, carpentry, painting, or caregiving and set your precise service location.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, border: "1px solid #E2E8F0", borderRadius: 4, textAlign: "center", height: "100%" }}>
              <Avatar sx={{ bgcolor: "#0284C7", width: 56, height: 56, mx: "auto", mb: 2, fontWeight: 800, fontSize: 24 }}>
                2
              </Avatar>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Haversine Proximity Match
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our smart matching engine connects you instantly with the nearest available verified cooperative worker.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, border: "1px solid #E2E8F0", borderRadius: 4, textAlign: "center", height: "100%" }}>
              <Avatar sx={{ bgcolor: "#10B981", width: 56, height: 56, mx: "auto", mb: 2, fontWeight: 800, fontSize: 24 }}>
                3
              </Avatar>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                Service & 90/10 Settlement
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track status live, complete work safely, and pay with automatic 90% worker payout & 10% co-op fund split.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* COOPERATIVE WELFARE SPOTLIGHT */}
      <Box sx={{ bgcolor: "#0F172A", color: "#F8FAFC", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ color: "#38BDF8", fontWeight: 800, letterSpacing: 1.5 }}>
                COOPERATIVE WELFARE RESERVE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#FFFFFF", letterSpacing: "-1px", my: 2 }}>
                Empowering Gig Workers with Social Security & Health Funds
              </Typography>
              <Typography variant="body1" sx={{ color: "#94A3B8", lineHeight: 1.6, mb: 4 }}>
                10% of every booking on CoopServe flows directly into the Gujarat Labour Cooperative Federation Welfare Fund, providing comprehensive health cover, skill training, and emergency relief to workers.
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <LocalHospitalIcon sx={{ color: "#38BDF8", mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="#FFFFFF">Health & Accident Cover</Typography>
                      <Typography variant="caption" color="#94A3B8">Emergency medical insurance for workers & families</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <SchoolIcon sx={{ color: "#60A5FA", mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="#FFFFFF">Skill Education Grants</Typography>
                      <Typography variant="caption" color="#94A3B8">Scholarships for worker children & trade training</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, bgcolor: "#1E293B", border: "1px solid #334155", borderRadius: 4 }}>
                <Typography variant="h6" fontWeight={800} color="#FFFFFF" sx={{ mb: 2 }}>
                  Member Success Testimonials
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: "#CBD5E1", fontStyle: "italic", mb: 1 }}>
                    "Switching from private aggregators to CoopServe increased my monthly earnings by 35%. The 10% co-op fund also provided health insurance for my family."
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700} color="#38BDF8">
                    — Rajesh Parmar, Verified Electrician (Navrangpura Co-op)
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#334155", my: 2 }} />

                <Box>
                  <Typography variant="body2" sx={{ color: "#CBD5E1", fontStyle: "italic", mb: 1 }}>
                    "Super quick service! The electrician arrived within 15 minutes, knew his work, and I love knowing 90% goes directly to him."
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700} color="#60A5FA">
                    — Priya Sharma, Customer (CG Road, Ahmedabad)
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="overline" sx={{ color: "#1E3A8A", fontWeight: 800, letterSpacing: 1.5 }}>
            FREQUENTLY ASKED QUESTIONS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", mt: 1 }}>
            Got Questions? We Have Answers.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 4 }}>
          <Accordion elevation={0} sx={{ border: "1px solid #E2E8F0", mb: 1.5, "&:before": { display: "none" }, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={700}>What makes CoopServe different from private gig apps?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                CoopServe is owned by Labour Cooperative Federations. Instead of charging high 30-40% corporate commissions, CoopServe disburses 90% directly to workers and 10% into a worker welfare reserve fund.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={0} sx={{ border: "1px solid #E2E8F0", mb: 1.5, "&:before": { display: "none" }, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={700}>How are workers assigned to service requests?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                When you place a booking, our Haversine proximity algorithm searches for active, background-checked workers within a 20km radius and auto-assigns the closest available trade professional.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion elevation={0} sx={{ border: "1px solid #E2E8F0", mb: 1.5, "&:before": { display: "none" }, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight={700}>How can I register as a skilled gig worker?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                Click "Register Account" on the Sign In page, select "Worker", enter your skill category and service cluster, and submit your trade credentials for Federation approval.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            mt: 8,
            background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
            color: "#FFFFFF",
            borderRadius: 5,
            textAlign: "center"
          }}
        >
          <Typography variant="h3" fontWeight={800} sx={{ mb: 2, letterSpacing: "-1px" }}>
            Ready to Experience Fair Cooperative Services?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, maxW: 600, mx: "auto", mb: 4 }}>
            Join thousands of satisfied Gujarat households supporting skilled labour cooperatives.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              bgcolor: "#FFFFFF",
              color: "#1E3A8A",
              fontWeight: 800,
              fontSize: 16,
              px: 5,
              py: 1.6,
              borderRadius: 3,
              "&:hover": { bgcolor: "#EFF6FF" }
            }}
          >
            Get Started Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
