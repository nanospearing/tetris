import React from "react";
import Image from "next/image";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";
import { TetrisDiv } from "../game/tetris"


export default function Page() {
  return (
    <div>
      <Navbar isBordered>
        <NavbarBrand>
          <Link className="gap-4" color="foreground" href="https://github.com/nanospearing/tetris">
            <Image src="/logo.png" width="48" height="32" alt="A T block Tetris Logo" className="h-8" />
            <p className="font-bold text-inherit ">Tetris (but in NodeJS)</p>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="end">
          <NavbarItem>
            <Link color="foreground" href="/">
              Info
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="play" color="foreground">
              Play
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex justify-center">
        <TetrisDiv />
      </div>
    </div>
  );
}
