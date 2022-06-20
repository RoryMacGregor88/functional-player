import { Grid } from "@mui/material";
import { PageWrapper, SpacedTitle, CourseDisplay } from "@/src/components";
import { getAllSeries, getSeriesById } from "@/src/pages/api/series";

export const getStaticPaths = async () => {
  const series = await getAllSeries();
  const paths = series.map((series) => {
    return {
      params: { seriesId: series.seriesPath },
    };
  });

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
      <SpacedTitle title={`${series.title} Series (level 2)`} />
      <Grid container wrap="wrap">
        {series?.courses?.map((course) => (
          <CourseDisplay
            key={course._id}
            title={course.title}
            src="/stratocaster-small.jpg"
            alt="stratocaster"
            seriesPath={series.seriesPath}
            coursePath={course.coursePath}
          />
        ))}
      </Grid>
    </PageWrapper>
  );
}
