import  { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo, useEffect } from "react";
import { connect,useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { themeSettings } from "./theme";
import  Dashboard  from "./scenes/dashboard";
import  LogIn  from "./logIn";
import  SignUp  from "./signup";
import  Layout  from "./scenes/layout";
import  Products  from "./scenes/Products";
import  Customers  from "./scenes/Customers";
import  Transactions  from "./scenes/Transactions";
import  Geography  from "./scenes/Geography";
import  Overview from "./scenes/overview";
import  Daily from "./scenes/daily";
import  Monthly from "./scenes/monthly";
import  Breakdown from "./scenes/breakdown";
import  Admin from "./scenes/admin";
import  Performance from "./scenes/performance";
import  ShoppingAds from "./scenes/shoppingAds";
import RequireAuth from "./middleware/RequireAuth";
import RedirectIfAuthenticated from "./middleware/RedirectIfAuthenticated";
import { useGetAuthUserQuery } from "./state/api";
import { fetchUser, setUser } from "./state";

function App ()  {
  const mode = useSelector((state) => state.global.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  
  return <div className="app">
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes >
          <Route path="/" element={<RedirectIfAuthenticated  Component={LogIn} />} />
          <Route path="/signup" element={<RedirectIfAuthenticated Component={SignUp} />} />
          <Route element={<RequireAuth Component={Layout} />}>
            <Route path="/dashboard" element={< Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/geography" element={<Geography />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/daily" element={<Daily />} />
            <Route path="/monthly" element={<Monthly />} />
            <Route path="/breakdown" element={<Breakdown />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/shoppingAds" element={<ShoppingAds />} />
          </Route>    
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
    
  </div>
}


export default App;