import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BouncingSkeleton } from "../styles/StyledComponents";

const LayoutLoader = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000); // Show message after 5 seconds

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <Box position="relative" height="calc(100vh - 4rem)">
      {/* Main Layout */}
      <Grid container height="100%" spacing={"1rem"}>
        <Grid
          item
          sm={4}
          md={3}
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          height="100%"
        >
          <Skeleton variant="rectangular" height={"100vh"} />
        </Grid>
        <Grid item xs={12} sm={8} md={5} lg={6} height="100%">
          <Stack spacing={"1rem"}>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={"5rem"} />
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          md={4}
          lg={3}
          height="100%"
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <Skeleton variant="rectangular" height={"100vh"} />
        </Grid>
      </Grid>

      {/* Overlay Loading Message */}
      {showMessage && (
        <Box
        position="absolute"
        top="50%"
        left="35%"
        transform="translate(-50%, -50%)"
        bgcolor="rgba(0, 0, 0, 0.7)"
        color="white"
        px={4}
        py={2}
        borderRadius={2}
        boxShadow={3}
        textAlign="center"
        width="80%" // Optional: Adjust width for smaller screens
        maxWidth="400px" // Optional: Limit max width for better appearance
      >
        <Typography variant="h6" fontWeight="bold">
          Please wait, the server is hosted on a free service and may take some time
          to start. Thank you for your patience!
        </Typography>
      </Box>
      
      )}
    </Box>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.5rem"}
      direction={"row"}
      padding={"0.5rem"}
      justifyContent={"center"}
    >
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.2s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.4s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.6s",
        }}
      />
    </Stack>
  );
};

export { TypingLoader, LayoutLoader };
