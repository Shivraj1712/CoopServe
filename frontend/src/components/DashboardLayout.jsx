import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Badge,
  Tooltip,
  Fade,
  Button,
  Menu,
  MenuItem,
  ListItemAvatar,
  Paper,
  Link,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import HandshakeIcon from "@mui/icons-material/Handshake";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ShieldCheckIcon from "@mui/icons-material/VerifiedUser";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import MyProfileView from "./MyProfileView";
import AccountSecurityView from "./AccountSecurityView";
import Footer from "./Footer";

const DRAWER_WIDTH = 260;

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: "Booking Confirmed",
    detail: "Your job order for Electrical Repair was accepted by Gujarat Co-op Federation.",
    time: "10 mins ago",
    read: false,
    icon: CheckCircleOutlineIcon,
    color: "#10B981"
  },
  {
    id: 2,
    title: "Welfare Reserve Deposited",
    detail: "₹40 (10% co-op reserve) credited to Healthcare & Accident Fund.",
    time: "1 hour ago",
    read: false,
    icon: AccountBalanceWalletIcon,
    color: "#3B82F6"
  },
  {
    id: 3,
    title: "Identity Verified",
    detail: "Federation Labour ID & GSTIN verification confirmed active.",
    time: "2 hours ago",
    read: false,
    icon: ShieldCheckIcon,
    color: "#6366F1"
  }
];

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Notifications Menu Popover State with localStorage persistence
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("coopserve_notifications");
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    try {
      localStorage.setItem("coopserve_notifications", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkSingleRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    try {
      localStorage.setItem("coopserve_notifications", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getNavItems = () => {
    let baseItems = [];
    if (user?.role === "FEDERATION_ADMIN") {
      baseItems = [
        { label: "Executive Dashboard", icon: DashboardIcon, tabIndex: 0 },
        { label: "Worker Queue & Verification", icon: EngineeringIcon, tabIndex: 1 },
        { label: "Bookings & Payout Ledger", icon: ReceiptLongIcon, tabIndex: 2 },
        { label: "AI Demand Forecast", icon: TrendingUpIcon, tabIndex: 3 }
      ];
    } else if (user?.role === "WORKER") {
      baseItems = [
        { label: "Duty Command Portal", icon: EngineeringIcon, tabIndex: 0 },
        { label: "Active Job Orders", icon: ShoppingCartIcon, tabIndex: 1 },
        { label: "Earnings & Welfare Ledger", icon: ReceiptLongIcon, tabIndex: 2 }
      ];
    } else {
      baseItems = [
        { label: "Services Directory", icon: DashboardIcon, tabIndex: 0 },
        { label: "My Active Bookings", icon: ShoppingCartIcon, tabIndex: 1 },
        { label: "Billing & Receipts", icon: ReceiptLongIcon, tabIndex: 2 }
      ];
    }

    return [
      ...baseItems,
      { label: "My Profile", icon: PersonIcon, tabIndex: "profile" },
      { label: "Account & Security", icon: SecurityIcon, tabIndex: "account" }
    ];
  };

  const navItems = getNavItems();

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#0F172A", color: "#F8FAFC" }}>
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", borderBottom: "1px solid #1E293B" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)", width: 38, height: 38 }}>
            <HandshakeIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.5px" }}>
              CoopServe
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600, display: "block" }}>
              Cooperative Network
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Navigation Links */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        <Typography variant="caption" sx={{ px: 2, pb: 1, display: "block", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Main Navigation
        </Typography>

        {navItems.map((item) => {
          const IconComp = item.icon;
          const isSelected = activeTab === item.tabIndex;
          return (
            <ListItem disablePadding key={item.label} sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => {
                  onTabChange && onTabChange(item.tabIndex);
                  if (isMobile) setSidebarOpen(false);
                }}
                sx={{
                  borderRadius: 1.5,
                  py: 1.2,
                  px: 2,
                  transition: "all 0.15s ease-in-out",
                  "&.Mui-selected": {
                    bgcolor: "#1E293B",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    "& .MuiListItemIcon-root": { color: "#3B82F6" }
                  },
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    color: "#FFFFFF"
                  }
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? "#3B82F6" : "#94A3B8", minWidth: 38 }}>
                  <IconComp fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: isSelected ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "#1E293B" }} />

      {/* Clean User Profile Card Footer */}
      {user && (
        <Box sx={{ p: 2, bgcolor: "#0B132B", borderTop: "1px solid #1E293B" }}>
          {/* Clickable Profile Card */}
          <Paper
            elevation={0}
            onClick={() => {
              onTabChange && onTabChange("profile");
              if (isMobile) setSidebarOpen(false);
            }}
            sx={{
              p: 1.5,
              mb: 1.5,
              bgcolor: activeTab === "profile" ? "rgba(37, 99, 235, 0.2)" : "rgba(255, 255, 255, 0.04)",
              border: "1px solid",
              borderColor: activeTab === "profile" ? "#2563EB" : "#1E293B",
              borderRadius: 2,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justify: "space-between",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.08)",
                borderColor: "#334155"
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, overflow: "hidden" }}>
              <Avatar sx={{ bgcolor: "#1E3A8A", width: 38, height: 38, fontWeight: 700, fontSize: 16 }}>
                {user.name?.[0]}
              </Avatar>
              <Box sx={{ overflow: "hidden" }}>
                <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ color: "#FFFFFF", fontSize: 13 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94A3B8", display: "block" }} noWrap fontSize={11}>
                  {user.role === "FEDERATION_ADMIN" ? "Federation Admin" : user.role === "WORKER" ? "Verified Worker" : "Customer Account"}
                </Typography>
              </Box>
            </Box>
            <ChevronRightIcon sx={{ color: "#64748B", fontSize: 18 }} />
          </Paper>

          {/* Sign Out Button */}
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon fontSize="small" />}
            onClick={logout}
            sx={{
              borderRadius: 2,
              borderColor: "#334155",
              color: "#94A3B8",
              fontSize: 13,
              fontWeight: 600,
              py: 0.8,
              "&:hover": {
                borderColor: "#EF4444",
                bgcolor: "rgba(239, 68, 68, 0.1)",
                color: "#EF4444"
              }
            }}
          >
            Sign Out
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC", maxWidth: "100vw", overflowX: "hidden" }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: sidebarOpen && !isMobile ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
          ml: sidebarOpen && !isMobile ? `${DRAWER_WIDTH}px` : 0,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          })
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1.5, sm: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <Tooltip title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ color: "#0F172A" }}>
                <MenuIcon />
              </IconButton>
            </Tooltip>

            <Box sx={{ minWidth: 0, overflow: "hidden" }}>
              <Typography
                variant="h6"
                fontWeight={800}
                noWrap
                sx={{
                  color: "#0F172A",
                  letterSpacing: "-0.5px",
                  fontSize: { xs: "0.9rem", sm: "1.2rem" },
                  maxWidth: { xs: 170, sm: "none" },
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {activeTab === "profile"
                  ? "My Profile"
                  : activeTab === "account"
                  ? "Account & Security"
                  : user?.role === "FEDERATION_ADMIN"
                  ? "Federation Command Center"
                  : user?.role === "WORKER"
                  ? "Worker Duty Portal"
                  : "CoopServe Service Portal"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, display: { xs: "none", sm: "block" } }}>
                Cooperative Gig Services Network • Live Synchronization
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.8, sm: 2 }, flexShrink: 0 }}>
            {/* System Notifications Icon Button */}
            <Badge badgeContent={unreadCount} color="error">
              <Tooltip title="System Notifications">
                <IconButton onClick={handleNotifOpen} sx={{ color: "#475569", p: { xs: 0.8, sm: 1 } }}>
                  <NotificationsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Badge>

            {/* Notifications Menu Popover */}
            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={handleNotifClose}
              PaperProps={{
                elevation: 4,
                sx: {
                  width: 340,
                  maxWidth: "92vw",
                  mt: 1.5,
                  borderRadius: 3,
                  border: "1px solid #E2E8F0"
                }
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9" }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0F172A">
                  Notifications ({unreadCount} new)
                </Typography>
                {unreadCount > 0 && (
                  <Button size="small" onClick={handleMarkAllRead} sx={{ fontSize: 11, fontWeight: 700 }}>
                    Mark all as read
                  </Button>
                )}
              </Box>

              <List sx={{ py: 0, maxHeight: 300, overflowY: "auto" }}>
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <React.Fragment key={n.id}>
                      <MenuItem
                        onClick={() => {
                          handleMarkSingleRead(n.id);
                          handleNotifClose();
                        }}
                        sx={{
                          py: 1.5,
                          px: 2,
                          bgcolor: n.read ? "transparent" : "#F8FAFC",
                          borderLeft: n.read ? "none" : `3px solid ${n.color}`,
                          whiteSpace: "normal"
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar sx={{ bgcolor: `${n.color}15`, color: n.color, width: 32, height: 32 }}>
                            <Icon fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontSize={13} fontWeight={n.read ? 600 : 700} color="#0F172A">
                              {n.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" fontSize={12} color="text.secondary" sx={{ display: "block", mt: 0.2 }}>
                                {n.detail}
                              </Typography>
                              <Typography variant="caption" color="#94A3B8" fontSize={10} sx={{ mt: 0.5, display: "block" }}>
                                {n.time}
                              </Typography>
                            </>
                          }
                        />
                      </MenuItem>
                      <Divider sx={{ borderColor: "#F1F5F9" }} />
                    </React.Fragment>
                  );
                })}
              </List>

              <Box sx={{ p: 1, textAlign: "center", bgcolor: "#F8FAFC", borderTop: "1px solid #F1F5F9" }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  CoopServe Realtime System Feed
                </Typography>
              </Box>
            </Menu>

            <Chip
              icon={<ShieldCheckIcon style={{ color: "#10B981" }} />}
              label={user?.role === "FEDERATION_ADMIN" ? "Fed Admin" : user?.role === "WORKER" ? "Verified Worker" : "Customer"}
              color={user?.role === "FEDERATION_ADMIN" ? "secondary" : user?.role === "WORKER" ? "warning" : "primary"}
              size="small"
              sx={{ fontWeight: 700, display: { xs: "none", md: "inline-flex" } }}
            />

            <Tooltip title="View Profile Page">
              <IconButton
                onClick={() => {
                  onTabChange && onTabChange("profile");
                  if (isMobile) setSidebarOpen(false);
                }}
                sx={{ p: 0.5 }}
              >
                <Avatar sx={{ bgcolor: "#1E3A8A", width: 34, height: 34, fontWeight: 700 }}>
                  {user?.name?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: sidebarOpen ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          }),
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
            borderRight: "1px solid #1E293B"
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
          pt: { xs: 9, sm: 10 },
          mt: 0,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          })
        }}
      >
        {/* Main Content Area */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 2.5 }, width: "100%", boxSizing: "border-box" }}>
          <Fade in timeout={400}>
            <Box sx={{ width: "100%", overflowX: "hidden" }}>
              {activeTab === "profile" ? (
                <MyProfileView onNavigateToAccount={() => onTabChange && onTabChange("account")} />
              ) : activeTab === "account" ? (
                <AccountSecurityView />
              ) : (
                children
              )}
            </Box>
          </Fade>
        </Box>

        {/* Integrated Dashboard Footer */}
        <Footer embedded />
      </Box>
    </Box>
  );
}




