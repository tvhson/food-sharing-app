import CssBaseline from "@mui/material/CssBaseline";

import "./index.css";
import AppTheme from "./utils/shared-theme/AppTheme";
import { AppProvider } from "@toolpad/core/react-router-dom";
import { Outlet } from "react-router-dom";
import { SignInPage, type Navigation } from "@toolpad/core";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const NAVIGATION: Navigation = [
  {
    title: "Thống kê",
    icon: <DashboardIcon />,
  },
  {
    segment: "manage-account",
    title: "Quản lý tài khoản",
    icon: <ManageAccountsIcon />,
  },
];

const BRANDING = {
  logo: <img src="./assets/images/MealLogo.png" alt="logo" />,
  title: "Happy Food",
};

function App() {
  return (
    <>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <AppProvider navigation={NAVIGATION} branding={BRANDING}>
          <Outlet />
        </AppProvider>
      </AppTheme>
    </>
  );
}

export default App;
