import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import API_URL from "../config/config";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { City, Country, State } from "country-state-city";
import { useDispatch } from "react-redux";
import { fetchUser,setUser } from "../state";

import {
  Box,
  Button,
  Typography,
  useTheme,
  Link,
  Grid,
  TextField,
} from "@mui/material";

import { themeSettings } from "../theme";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //states for country, state and city
  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState();
  const [cities, setCities] = useState();

  //states for selectedCountry, selectedState and selectedCity
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();

  // States for registration
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");

  // States for checking the errors
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handling the name change
  const handleName = (e) => {
    setName(e.target.value);
  };

  // Handling the email change
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // Handling the password change
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // Handling the Confirm password change
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Handling the occupation change
  const handleOccupation = (e) => {
    setOccupation(e.target.value);
  };

  // Handling the occupation change
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleCountryChange = (e) => {
    setStates(State.getStatesOfCountry(e.target.value))
    setSelectedCountry(e.target.value)
  };

  const handleStateChange = (e) => {
    setCities(City.getCitiesOfState(selectedCountry, e.target.value))
    setSelectedState(e.target.value)
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value)
  };

  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (email === "" || password === "" || confirmPassword == "" || name == "" || occupation == "" || phone == "" || 
            selectedCity == "" || selectedState == "" || selectedCountry == "" ) {
      setError(true);
      setErrorMessage("Please fill all the fields");
      return;
    } else if(password !== confirmPassword){
        setError(true);
        setErrorMessage("Password and confirmPassword do not match");
        return;
    } else {
      console.log("DONE");
      const user = {
        name,
        email,
        password,
        confirmPassword,
        phone,
        occupation,
        country: selectedCountry,
        state: selectedState,
        city: selectedCity
      };
      const response = await fetch(`${API_URL}/general/signup`, {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log(data);
      if (data.error) {
        setError(true);
        setErrorMessage(data.error);
      } else {
        setError(false);
        console.log("loggedIn");
        dispatch(setUser(data));
        navigate("/dashboard");
     }
    }
  };

  const DisplayErrorMessage = () => {
    return error ? (
      <Alert
        severity="error"
        sx={{ background: "white", color: "black", fontWeight: "bold" }}
      >
        {errorMessage}
      </Alert>
    ) : (
      ""
    );
  };

  const theme = useTheme();

  return (
    <Box
      m="1.5rem 2rem"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        gap: "3rem",
      }}
    >
      <DisplayErrorMessage />
      <Box
        pt="2rem"
        sx={{
          backgroundColor: theme.palette.background.alt,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0.2rem",
        }}
      >
        <Header title="SIGN UP" subtitle="" />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "theme.palette.secondary" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box
            m="1rem"
            component="form"
            noValidate
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  inputProps={{
                    autoComplete: "name",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                   onChange={handleName}
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputProps={{
                    autoComplete: "new-email",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                  onChange={handleEmail}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Country
                </InputLabel>
                <NativeSelect
                  required
                  fullWidth
                  onChange={handleCountryChange}
                  defaultValue={30}
                  inputProps={{
                    name: "age",
                    id: "uncontrolled-native",
                  }}
                  sx={{ bg: theme.palette.background.alt }}
                >
                  <option disabled value="">
                    ----Select Country----
                  </option>
                  {countries.map((country) => {
                    return (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    );
                  })}
                </NativeSelect>
              </Grid>
              { states && <Grid item xs={12}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  State
                </InputLabel>
                <NativeSelect
                  required
                  fullWidth
                  onChange={handleStateChange}
                  inputProps={{
                    name: "state",
                    id: "uncontrolled-native",
                  }}
                  sx={{ bg: theme.palette.background.alt }}
                >
                  <option disabled value="">
                    ----Select State----
                  </option>
                  {states.map((state) => {
                    return (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    );
                  })}
                </NativeSelect>
              </Grid>}
              { cities && <Grid item xs={12}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  City
                </InputLabel>
                <NativeSelect
                  required
                  fullWidth
                  onChange={handleCityChange}
                  inputProps={{
                    name: "city",
                    id: "uncontrolled-native",
                  }}
                  sx={{ bg: theme.palette.background.alt }}
                >
                  <option disabled value="">
                    ----Select State----
                  </option>
                  {cities.map((city) => {
                    return (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    );
                  })}
                </NativeSelect>
              </Grid>}
              <Grid item xs={12}>
                <TextField
                  inputProps={{
                    autoComplete: "new-email",
                    form: {
                      autoComplete: "off",
                    },
                  }}
                  onChange={handleOccupation}
                  required
                  fullWidth
                  id="occupation"
                  label="Occupation"
                  name="occupation"
                  autoFocus
                />
                <Grid mt="1rem" item xs={12}>
                  <TextField
                    inputProps={{
                      autoComplete: "new-email",
                      form: {
                        autoComplete: "off",
                      },
                    }}
                    onChange={handlePhone}
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Phone"
                    name="phone"
                    type="number"
                    autoFocus
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handlePassword}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                 onChange={handleConfirmPassword}
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                />
              </Grid>
            </Grid>
            <Button
              onClick={handleSubmit}
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                p: "0.5rem 0",
                background: theme.palette.primary[400],
                "&:hover": { backgroundColor: theme.palette.primary[300] },
              }}
            >
              Sign Up
            </Button>
          </Box>
          <Grid item sx={{ mb: "1rem" }}>
            <Link
              href="/"
              sx={{ fontSize: "1rem", color: theme.palette.secondary[100] }}
              variant="body2"
            >
              {"Already a member? Sign In"}
            </Link>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
