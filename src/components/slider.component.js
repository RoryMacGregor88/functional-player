import NextImage from "next/image";
import { useState, useContext } from "react";
import { Grid, Box, Typography } from "@mui/material";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  IconButton,
} from "@/src/components";
import { Context } from "@/src/utils";

const ITEM_WIDTH_REM = 52.5;

/** @param {{ course: object }} props */
const Overlay = ({ course }) => {
  const { title, description } = course;
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{
        position: "absolute",
        zIndex: "1",
        height: "100%",
        width: "100%",
      }}
    >
      <Typography variant="h3">{title}</Typography>
      <Typography variant="h5">{description}</Typography>
    </Grid>
  );
};

/**
 * @param {{
 *  onClick: function,
 *  orientation: string,
 *  children: React.ReactChildren
 * }} props
 */
const ChevronWrapper = ({ onClick, orientation = "left", children }) => (
  <Grid
    item
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    onClick={onClick}
    sx={{
      position: "absolute",
      top: 0,
      [orientation]: 0,
      zIndex: "2",
      width: "5rem",
      height: "100%",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgb(8, 8, 8, 0.5)",
      },
    }}
  >
    <IconButton>{children}</IconButton>
  </Grid>
);

/**
 * @param {{
 *  title: string,
 *  courses: object[]
 * }} props
 */
const Slider = ({ title, courses }) => {
  const { updateCtx } = useContext(Context);
  const [position, setPosition] = useState(0);

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
    <>
      <Typography variant="h4" sx={{ paddingLeft: "0.5rem" }}>
        {title}
      </Typography>
      <Grid
        container
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "calc(100vw - 4rem)",
          marginBottom: "2rem",
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
        <Grid
          item
          container
          wrap="nowrap"
          gap={2}
          sx={{
            transform:
              position === 0
                ? "none"
                : `translateX(-${(ITEM_WIDTH_REM + 1) * position}rem)`,
            transitionDuration: "0.25s",
          }}
        >
          {courses.map((course) => (
            <Box
              key={course._id}
              onClick={() => handleClick(course)}
              sx={{
                position: "relative",
                minWidth: `${ITEM_WIDTH_REM}rem`,
                height: "35rem",
                border: "8px solid transparent",
                borderRadius: "0.5rem",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover": {
                  border: "8px solid #fff",
                },
              }}
            >
              <Overlay course={course} />
              <NextImage
                src="/stratocaster-medium.jpg"
                alt="stratocaster"
                layout="fill"
                objectFit="cover"
              />
            </Box>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default Slider;
