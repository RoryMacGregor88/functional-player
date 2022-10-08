import NextImage from "next/image";
import { useState, useRef, useContext } from "react";
import { Grid, Box, Typography } from "@mui/material";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  IconButton,
} from "@/src/components";
import { Context } from "@/src/utils";

const ITEM_WIDTH = 30;

const Overlay = ({ course }) => {
  const { title, description } = course;
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      style={{
        position: "absolute",
        padding: "1rem",
        zIndex: "100",
      }}
    >
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
    </Grid>
  );
};

const ChevronWrapper = ({ children, onClick, orientation = "left" }) => (
  <Grid
    item
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    sx={{
      position: "absolute",
      top: 0,
      [orientation]: 0,
      zIndex: "100",
      width: "10rem",
      height: "100%",
      "&:hover": {
        backgroundColor: "rgb(8, 8, 8, 0.5)",
      },
    }}
  >
    <IconButton onClick={onClick}>{children}</IconButton>
  </Grid>
);

const Slider = ({ title, courses }) => {
  const { updateCtx } = useContext(Context);
  const [position, setPosition] = useState(0);
  const containerRef = useRef();

  if (!courses?.length) {
    return null;
  }

  const handleClick = (course) => {
    updateCtx({ selectedVideo: course });
  };

  const handleChevronClick = (direction) => {
    if (direction === "right" && position !== courses.length - 1) {
      setPosition((prev) => prev + 1);
    } else if (direction === "left" && position !== 0) {
      setPosition((prev) => prev - 1);
    }
  };

  return (
    <Grid
      container
      ref={containerRef}
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100vw",
        margin: "2rem 0",
      }}
    >
      {courses.length > 1 ? (
        <>
          <ChevronWrapper onClick={() => handleChevronClick("left")}>
            <ChevronLeftIcon sx={{ width: "5rem", height: "5rem" }} />
          </ChevronWrapper>
          <ChevronWrapper
            onClick={() => handleChevronClick("right")}
            orientation="right"
          >
            <ChevronRightIcon sx={{ width: "5rem", height: "5rem" }} />
          </ChevronWrapper>
        </>
      ) : null}
      <Typography variant="h4">{title}</Typography>
      <Grid
        item
        container
        wrap="nowrap"
        gap={2}
        sx={{
          transform:
            position === 0
              ? "none"
              : `translateX(-${(ITEM_WIDTH + 1) * position}rem)`,
          transitionDuration: "1s",
        }}
      >
        {courses.map((course) => (
          <Box
            key={course._id}
            onClick={() => handleClick(course)}
            sx={{
              position: "relative",
              minWidth: `${ITEM_WIDTH}rem`,
              height: "20rem",
              border: "4px solid transparent",
              cursor: "pointer",
              "&:hover": {
                border: "4px solid #fff",
              },
            }}
          >
            <Overlay course={course} />
            <NextImage
              src="/stratocaster-small.jpg"
              alt="stratocaster"
              layout="fill"
              objectFit="cover"
            />
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};

export default Slider;
