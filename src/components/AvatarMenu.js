"use client";

import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import useAuthStore from "@/store/AuthStore";
import { useRouter } from "next/navigation";

function AvatarMenu() {

  const { removeAuth } = useAuthStore((state) => ({
    removeAuth: state.removeAuth,
  }))

  const router = useRouter();

  const handleLogout = () => {
    removeAuth();
    router.push("/");
  };

  return (
      <Flex>
        <Menu>
          <MenuButton>
            <Avatar name="Dan Abrahmov" />
          </MenuButton>
          <MenuList color="white">
            <MenuItem onClick={()=>{router.push("/")}}>Home</MenuItem>
            <MenuItem onClick={()=>{router.push("/profile")}}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
  );
}

export default AvatarMenu;
