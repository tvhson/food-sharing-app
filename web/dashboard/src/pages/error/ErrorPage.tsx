import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

const ErrorPageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row", // Default: text left, image right
  alignItems: "center",
  justifyContent: "space-around",
  minHeight: "100vh",
  backgroundColor: "#93B4F6",
  padding: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column", // Image on top, text below for mobile
    textAlign: "center",
    padding: theme.spacing(2),
  },
}));

const ErrorImage = styled("img")(({ theme }) => ({
  maxWidth: "500px",
  width: "100%",
  order: 2, // Push image to the right in desktop view
  [theme.breakpoints.down("md")]: {
    order: 1, // Image appears first in mobile view
    maxWidth: "80%", // Make image responsive
  },
}));

// Add this for the text content
const ErrorContent = styled(Box)(({ theme }) => ({
  order: 1, // Keep text on the left in desktop view
  maxWidth: "600px",
  [theme.breakpoints.down("md")]: {
    order: 2, // Text appears second in mobile view
    marginTop: theme.spacing(3),
  },
}));

const ErrorButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#3F51B5",
  color: "#fff",
  padding: "0.5rem 2rem",
  "&:hover": {
    backgroundColor: "#303F9F",
  },
  borderRadius: "50px",
}));

export default function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string };
  console.error(error);

  return (
    <ErrorPageContainer>
      <ErrorContent>
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "3.5rem",
              md: "5rem",
            },
            mb: 2,
            color: "#fff",
            fontWeight: "600",
          }}
        >
          {`Có vẻ như`}
          <br />
          {`bạn đã lạc ngoài`}
          <br />
          {`vũ trụ`}
        </Typography>
        <ErrorButton
          sx={{
            fontSize: {
              xs: "0.5rem",
              sm: "0.7rem",
              md: "0.9rem",
            },
          }}
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Trở về trái đất
        </ErrorButton>
      </ErrorContent>
      <ErrorImage src="/assets/images/error.png" alt="Error Image" />
    </ErrorPageContainer>
  );
}
