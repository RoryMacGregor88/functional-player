import { List } from "@mui/material";
import { getAllSeries } from "lib/series";
import { PageWrapper, SpacedTitle, SeriesDisplay } from "@/src/components";

export const getStaticProps = async (ctx) => ({
  props: { series: await getAllSeries() },
});

export default function Series({ series }) {
  return (
    <PageWrapper>
      <SpacedTitle>All series (level 1)</SpacedTitle>
      <List>
        {series?.map((series) => (
          <SeriesDisplay key={series._id} series={series} />
        ))}
      </List>
    </PageWrapper>
  );
}
