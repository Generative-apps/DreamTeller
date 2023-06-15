import React, { useEffect, useMemo, useState, CSSProperties } from "react";
import main from "./assets/images/main.png";
import { Fab, Typography } from "@mui/material";
import { BalconyRounded } from "@mui/icons-material";

const PHASES = [
  "Describe your dream",
  "answer questions",
  "your personal interpretation",
];

export function MainScreen() {
  return (
    <div style={{ backgroundColor: "black" }}>
      <img src={main} style={styles.pic} alt="main pic" />
      <div style={styles.container}>
        {/* <Button style={styles.button} size="large" variant="contained">
        start
      </Button> */}
        <div>
          <Fab
            sx={styles.button}
            // style={styles.button}
            variant="extended"
            color="primary"
            aria-label="go"
            size="large"
            href="/app"
          >
            <BalconyRounded sx={{ mr: 1 }} />
            Start
          </Fab>
        </div>
        <div style={styles.textContainer}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textDecoration: "underline" }}
          >
            Important Disclamir
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            This app is intended for entertainment purposes only and is not
            based on psychological reaserch. It works by instructing an LLM
            model (similar to chatGPT) to generate a dream interpertation
            according to Calvin Springer Hall's dream interpretation theory.
          </Typography>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  pic: {
    width: "100%",
    height: "50vh",
  },
  container: {
    display: "flex",
    height: "50vh",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
  },
  button: {
    flex: 1,
    width: 300,
    height: 100,
    fontSize: 30,
    marginBottom: 10,
  },
  textContainer: {
    flex: 4,
    color: "white",
    width: "50%",
  },
};
