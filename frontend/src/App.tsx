import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import TopStrip from "./top-strip";
import { DetailsForm } from "./form/details-form";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "./theme";
import { FormScreen } from "./form/form-screen";
import { MainScreen } from "./main-screen";
import { ThemeProvider } from "@mui/material";
import { UserProvider } from "./user_store";

const PHASES = [
  "Describe your dream",
  "answer questions",
  "your personal interpretation",
];

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <BrowserRouter basename="/dream">
          <Routes>
            <Route path="/" element={<MainScreen />} />
            <Route path="/app" element={<FormScreen />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}
