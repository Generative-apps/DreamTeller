import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import TopStrip from "../top-strip";
import { DetailsForm } from "./details-form";
import {
  Stepper,
  StepLabel,
  Step,
  Divider,
  Typography,
  Button,
  Box,
  LinearProgress,
  CircularProgress,
  Alert,
} from "@mui/material";
import form from "../assets/images/form.png";
import form2 from "../assets/images/form2.png";
import { log } from "console";
import {
  useAsyncFetch,
  sendDreamDescription,
  fetchinterpretation,
} from "../api";
import { question, useIsMobile } from "../common";
import { LoadingBarAnimation } from "./loading";
import { useUserContext } from "../user_store";
const PHASES = [
  "Describe Your Dream",
  "Answer Questions",
  "Your Personal interpretation",
];

const dreamPlaceholder =
  "I had a dream where I was sitting in a tent with some other people, all of them strangers, And the focus point was on this man who was just like a genie and he was telling stories. I found out from the people around me, that this man was called The Sandman.";

function safeLoading(loading: boolean, styles: Record<string, CSSProperties>) {
  if (loading)
    return (
      <div style={styles.mainFields}>
        <LoadingBarAnimation />
      </div>
    );
}

export function FormScreen() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [dream, setDream] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [interpretation, setinterpretation] = useState("");
  const [questions, setQuestions] = useState<question[]>([]);
  const { state: user, dispatch } = useUserContext();
  const isMobile = useIsMobile();
  const styles = stylesFactory(isMobile);
  const {
    fetch: fetchDream,
    res: questionRes,
    loading: loadingQuestions,
    error: errorQuestions,
    setError,
    clear: clearQuestions,
  } = useAsyncFetch(sendDreamDescription);

  const {
    fetch: fetchInt,
    res: answersRes,
    loading: loadingAnswers,
    error: errorAnswers,
    clear: clearAnswers,
  } = useAsyncFetch(fetchinterpretation);

  const [loading, error, clear] = useMemo(() => {
    if (phaseIndex === 0) {
      return [loadingQuestions, errorQuestions, clearQuestions];
    }
    return [loadingAnswers, errorAnswers, clearAnswers];
  }, [
    phaseIndex,
    loadingQuestions,
    errorQuestions,
    clearQuestions,
    loadingAnswers,
    errorAnswers,
    clearAnswers,
  ]);

  useEffect(() => {
    if (questionRes?.questions) {
      console.log("got data", questionRes);
      setQuestions(
        (questionRes?.questions as string[]).map((q: string) => ({
          title: "Answer Questions",
          description: q,
        })) as unknown as question[]
      );
      dispatch({ type: "SET_USER_ID", payload: questionRes?.user_id });
    }
    console.log("got data out", questionRes);
  }, [questionRes, dispatch, setQuestions]);

  useEffect(() => {
    if (questions.length > 0) setPhaseIndex(1);
    else if (answers.length > 0) setPhaseIndex(2);
    else setPhaseIndex(0);
  }, [questions, setPhaseIndex, answers]);

  const sendDream = useCallback(
    (dream: string) => {
      setDream(dream);
      // fetchDream(dream);
      if (user.userID) fetchDream(dream, user.userID);
      else fetchDream(dream);
    },
    [fetchDream, user.userID] //[setDream, fetchDream, setData]
  );

  const sendAnswers = useCallback(
    (answers: string[]) => {
      setAnswers(answers);
      fetchInt(answers, user.userID);
    },
    [fetchInt, user.userID]
  );

  useEffect(() => {
    if (answersRes?.interpretation) {
      setinterpretation(answersRes?.interpretation);
    }
  }, [answersRes]);

  const clearForm = useCallback(() => {
    setAnswers([]);
    setinterpretation("");
    setQuestions([]);
    clear();
  }, [clear, setAnswers, setinterpretation, setQuestions]);

  return (
    <div style={styles.container}>
      <Stepper
        sx={{ flex: 1, width: "90%", margin: 5 }}
        activeStep={phaseIndex}
        alternativeLabel
      >
        {PHASES.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {safeLoading(loading, styles)}

      {!loading && error && (
        <div style={styles.mainFields}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={() => setError(undefined)}>Try again</Button>
        </div>
      )}

      {!loading && !error && phaseIndex === 0 ? (
        <DetailsForm
          answers={dream.length > 0 ? [dream] : []}
          style={styles.mainFields}
          questions={[
            {
              title: "Describe your dream",
              description:
                "Try to be specific and focus on how you felt in each situation",
            },
          ]}
          textbox={true}
          onFinish={(qIndex: number, dream: string[]) => {
            sendDream(dream[0]);
          }}
          placeholder={dreamPlaceholder}
        ></DetailsForm>
      ) : null}

      {!loading && !error && phaseIndex === 1 && (
        <DetailsForm
          style={styles.mainFields}
          answers={[]}
          questions={questions?.length > 0 ? questions : []}
          textbox={false}
          onFinish={(qIndex, answers) => {
            clearForm();
            sendAnswers(answers);
          }}
          onBack={(questionIndex: number) => {
            if (questionIndex === 0) {
              clearForm();
            }
          }}
        ></DetailsForm>
      )}

      {!loading && !error && phaseIndex === 2 && (
        <div style={styles.mainFields}>
          <Typography variant="h5" gutterBottom>
            Dream interpretation:
          </Typography>
          <Typography sx={{ ...styles.finalText }} variant="h5" gutterBottom>
            {interpretation}
          </Typography>
          <Button
            sx={{ margin: 5, alignSelf: "center" }}
            variant="contained"
            onClick={() => clearForm()}
          >
            Try Another Dream
          </Button>
        </div>
      )}

      <Typography sx={styles.disclamir} variant="subtitle1" gutterBottom>
        *This app is intended for entertainment purposes only and is not based
        on psychological reaserch. It works by instructing an LLM model (similar
        to chatGPT) to generate a dream interpertation according to Calvin
        Springer Hall's dream interpretation theory.
      </Typography>
    </div>
  );
}

const stylesFactory = (isMobile: boolean): Record<string, CSSProperties> => ({
  container: {
    // flexGrow: 4,
    background: "#20242A",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    color: "white",
  },
  disclamir: {
    marginBottom: 5,
    marginTop: 5,
    width: isMobile ? "90%" : "70%",
  },

  mainFields: {
    flexGrow: 3,
    width: isMobile ? "90%" : "65%",
    display: "flex",
    flexDirection: "column",
  },
  finalText: {
    borderRadius: 10,
    padding: 2,
    // border: "1px solid gray",
  },
});
