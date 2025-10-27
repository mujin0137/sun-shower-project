import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Home,
  CalendarMonth,
  WbSunny,
  DirectionsBus,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "../CSS/aside.css";

const Aside = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "로고", icon: <Home />, path: "/" },
    { text: "캘린더", icon: <CalendarMonth />, path: "/calendar" },
    { text: "날씨", icon: <WbSunny />, path: "/weather" },
    { text: "교통", icon: <DirectionsBus />, path: "/transportation" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Aside;
