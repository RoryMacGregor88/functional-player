import { IconButton, Link } from "@/src/components";

const SidebarItem = ({ href = "", label, Icon, onClick, isSelected }) => (
  <Link href={href} passHref>
    <IconButton
      onClick={onClick}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        color: isSelected ? "primary.main" : "common.white",
      }}
    >
      <Icon sx={{ height: "2rem", width: "2rem", marginRight: "1rem" }} />
      {label}
    </IconButton>
  </Link>
);

export default SidebarItem;
