import { Grid } from "@mui/material";
import { PageWrapper, SpacedTitle, CourseDisplay } from "@/src/components";
import { getAllSeries, getSeriesById } from "lib/series";

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
      <Grid container wrap="wrap">
        {series?.courses?.map(
          ({ _id, title, description, seriesPath, coursePath }) => (
            <CourseDisplay
              key={_id}
              _id={_id}
              title={title}
              description={description}
              src="/stratocaster-small.jpg"
              alt={title}
              seriesPath={seriesPath}
              coursePath={coursePath}
            />
          )
        )}
      </Grid>
    </PageWrapper>
  );
}
