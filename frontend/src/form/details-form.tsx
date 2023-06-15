import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Button,
  TextareaAutosize,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { question, useIsMobile } from "../common";
import { useSpring, animated, a } from "@react-spring/web";
import { cursorTo } from "readline";
import { CurrencyBitcoin } from "@mui/icons-material";

const counter = (index: number, length: number) => {
  return length > 1 ? `  (${index + 1} / ${length})` : "";
};

export function DetailsForm({
  style,
  questions,
  answers = [],
  onFinish,
  onNext,
  onBack,
  textbox = true,
  placeholder,
}: {
  style: CSSProperties;
  questions: question[];
  answers?: string[];
  textbox: boolean;
  onFinish?: (qIndex: number, answers: string[]) => void;
  onNext?: (qIndex: number, answer: string) => void;
  onBack?: (qIndex: number, answers: string) => void;
  placeholder?: string;
}) {
  const [finished, setFinished] = useState(false);
  // console.log(`questions in details: ${JSON.stringify(questions)}`);
  const theme = useTheme();
  const [valid, setValid] = useState(true);
  const styles = useMemo(() => stylesFactory(theme), [theme]);
  const animationDetails = {
    from: { opacity: 0, x: 50, y: -10 },
    to: { opacity: 1, x: 0, y: 0 },
    config: { tension: 100, friction: 10, mass: 1 },
  };
  const [springStyle, spinrgApi] = useSpring(() => animationDetails);
  const [answersState, setAnswersState] = useState<string[]>(
    answers.length ? answers : Array(questions.length).fill("")
  );
  const [question, setQuestion] = useState(questions[0]);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const updateTextField = useCallback(() => {
    let currentAnswer: string = "";
    if (textRef.current) {
      currentAnswer = textRef.current.value;

      if (answersState[questionIndex]) {
        textRef.current.value = answersState[questionIndex];
      } else {
        textRef.current.value = "";
      }
    }
    return currentAnswer;
  }, [textRef, answersState, questionIndex]);

  const nextQuestion = useCallback(() => {
    let currentAnswer: string = updateTextField();
    if (currentAnswer.length === 0) {
      setValid(false);
      return;
    }
    let currentArray = [...answersState];
    currentArray[questionIndex] = currentAnswer;
    setAnswersState(currentArray);

    if (questionIndex < questions.length - 1) {
      setQuestion(questions[questionIndex + 1]);
      setQuestionIndex(questionIndex + 1);
      if (onNext) onNext(questionIndex, currentAnswer);
    } else {
      setFinished(true);
    }
  }, [questions, questionIndex, onNext, onFinish, answersState]);

  const previousQuestion = useCallback(() => {
    let currentAnswer: string = updateTextField();

    if (questionIndex > 0) {
      setQuestion(questions[questionIndex - 1]);
      setQuestionIndex(questionIndex - 1);
    }
    if (onBack) onBack(questionIndex, currentAnswer);
  }, [questions, questionIndex, onBack]);

  useEffect(() => {
    if (valid) spinrgApi.start(animationDetails);
  }, [question, spinrgApi, animationDetails, valid]);

  useEffect(() => {
    if (finished && onFinish) {
      onFinish(questionIndex, answersState);
    }
  }, [finished, onFinish, questionIndex, answersState]);

  useEffect(() => {
    if (valid) updateTextField();
  }, [updateTextField, valid]);

  return (
    <animated.div style={{ ...style, ...styles.container, ...springStyle }}>
      {!valid && (
        <Alert
          sx={{ position: "fixed", top: 120, width: "50%" }}
          onClick={(e) => setValid(true)}
          severity="warning"
        >
          please fill in the field
        </Alert>
      )}
      <div>
        <div style={styles.form}>
          <div style={styles.question}>
            <Typography fontSize={25}>
              {question?.title + counter(questionIndex, questions.length)}{" "}
            </Typography>
            <Typography>{question?.description}</Typography>
          </div>
        </div>
        <TextareaAutosize
          ref={textRef}
          placeholder={placeholder}
          color={"primary"}
          style={styles.text}
          minRows={textbox ? 6 : 2}
          maxRows={textbox ? 15 : 2}
        />
        <div style={styles.buttonDiv}>
          <Button
            onClick={() => previousQuestion()}
            variant="outlined"
            size="medium"
          >
            back
          </Button>
          <Button
            onClick={() => nextQuestion()}
            variant="contained"
            size="medium"
          >
            next
          </Button>
        </div>
      </div>
    </animated.div>
  );
}

const stylesFactory = (theme: Theme): Record<string, CSSProperties> => ({
  container: {
    display: "flex",
    flex: 5,
    justifyContent: "flex-start",
    flexDirection: "column",
    verticalAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
  },
  question: { display: "flex", flexDirection: "column" },
  text: {
    width: "100%",
    marginTop: 15,
    backgroundColor: theme.palette.background.paper,
  },
  buttonDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
});
