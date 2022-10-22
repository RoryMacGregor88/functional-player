import { Grid } from "@mui/material";
import { PageWrapper, SpacedTitle, CourseDisplay } from "@/src/components";
import { getAllSeries, getSeriesById } from "lib";

export const getStaticPaths = async () => {
  const series = await getAllSeries();

  const paths = series.map(({ seriesPath }) => ({
    params: { seriesId: seriesPath },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => ({
  props: { series: await getSeriesById(params.seriesId) },
});

export default function Series({ series }) {
  return (
    <PageWrapper>
      <SpacedTitle>{`${series.title} Series (level 2)`}</SpacedTitle>
      <Grid container wrap="nowrap" gap={1}>
        {series?.courses?.map((course) => (
          <CourseDisplay
            key={course._id}
            course={{ ...course, src: "/stratocaster-small.jpg" }}
          />
        ))}
      </Grid>
    </PageWrapper>
  );
}
