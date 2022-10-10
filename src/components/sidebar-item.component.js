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
        fontSize: "1.25rem",
      }}
    >
      <Icon sx={{ height: "1.5rem", width: "1.5rem", marginRight: "1rem" }} />
      {label}
    </IconButton>
  </Link>
);

export default SidebarItem;
