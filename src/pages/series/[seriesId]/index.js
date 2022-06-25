import { Grid } from "@mui/material";
import { PageWrapper, SpacedTitle, CourseDisplay } from "@/src/components";
import { getAllSeries, getSeriesById } from "@/src/pages/api/series";

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
      <SpacedTitle title={`${series.title} Series (level 2)`} />
      <Grid container wrap="wrap">
        {series?.courses?.map(
          ({ _id, title, description, seriesPath, coursePath }) => (
            <CourseDisplay
              key={_id}
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
