import NextLink from "next/link";
import { Button } from "@/src/components";

const SidebarItem = ({ href = "", label, Icon, onClick }) => (
  <NextLink href={href} passHref>
    <Button
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Icon sx={{ height: "2rem", width: "2rem", margin: "0 1rem" }} />
      {label}
    </Button>
  </NextLink>
);

export default SidebarItem;
