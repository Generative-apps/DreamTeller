import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  const [transStyle, setTransStyle] = React.useState({} as React.CSSProperties);

  return (
    <Box
      sx={{
        alignItems: "center",
        color: "white",
        display: "flex",
        flexDirection: "column",
        ...props.style,
      }}
    >
      <Box sx={{ width: "100%", mr: 1 }}>
        {props?.value < 100 ? (
          <LinearProgress
            variant="determinate"
            value={props.value}
            sx={transStyle}
            style={transStyle}
          />
        ) : (
          <Divider />
        )}
      </Box>
      <Box sx={{ marginTop: 1 }}>
        <Typography variant="body2">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export function LoadingBarAnimation({
  style,
}: {
  style?: React.CSSProperties;
}) {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 99) {
        setProgress((prevProgress) => prevProgress + 10);
      } else {
        setProgress(99);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [progress]);

  return (
    <div style={{ width: "100%" }}>
      <LinearProgressWithLabel style={style} value={progress} />
    </div>
  );
}
