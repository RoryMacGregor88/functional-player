import { List } from "@mui/material";
import { getAllSeries } from "@/src/pages/api/series";
import { PageWrapper, SpacedTitle, SeriesDisplay } from "@/src/components";

export const getStaticProps = async (ctx) => ({
  props: { series: await getAllSeries() },
});

export default function Series({ series }) {
  return (
    <PageWrapper>
      <SpacedTitle title="All series (level 1)" />
      <List>
        {series?.map((series) => (
          <SeriesDisplay key={series._id} series={series} />
        ))}
      </List>
    </PageWrapper>
  );
}
