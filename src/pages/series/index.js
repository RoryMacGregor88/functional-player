import { Grid } from "@mui/material";
import { getAllSeries } from "lib/series";
import { PageWrapper, SpacedTitle, SeriesDisplay } from "@/src/components";

export const getStaticProps = async (ctx) => ({
  props: { series: await getAllSeries() },
});

// TODO: styling of this doesn't match ones on landing. Should these even be different?

export default function Series({ series }) {
  return (
    <PageWrapper>
      <SpacedTitle>All series (level 1)</SpacedTitle>
      <Grid container gap={1}>
        {series?.map((series) => (
          <SeriesDisplay key={series._id} series={series} />
        ))}
      </Grid>
    </PageWrapper>
  );
}
