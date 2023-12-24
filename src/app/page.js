import React from "react";
import Image from "next/image";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Button, ButtonGroup } from "@nextui-org/react";
import { GithubIcon, ControllerIcon } from "./components/svgs"

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function Page() {
  if (isMobile()) {
    return (
      <div>
        Sorry, this site is not available on mobile.
      </div>
    );
  }

  return (
    <div>
      <Navbar isBordered>
        <NavbarBrand>
          <Link className="gap-4" color="foreground" href="https://github.com/nanospearing/tetris">
            <Image src="/tetris/logo.png" width="48" height="32" alt="A T block Tetris Logo" className="h-8" />
            <p className="font-bold text-inherit ">Tetris (but in NodeJS)</p>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="end">
          <NavbarItem isActive>
            <Link color="foreground" href="/tetris/">
              Info
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/tetris/play" color="foreground">
              Play
            </Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex flex-col items-center justify-center mt-8 space-y-4">
        <h1 className="text-6xl">Welcome to Tetris but in Node.Js</h1>
        <p1 className="mx-40 text-xl">This is just a fun little project that I wanted to start to help me pass time. I do not intend for this to be the best thing you have seen, but for it to be atleast functional. If you have any issues or bugs, feel free to report them on the github page. Happy Gaming!</p1>
        <div className="flex flex-col items-center justify-center space-y-6">
          <Link className="mt-5" href="/tetris/play"><Button color="success" size="lg" endContent={<ControllerIcon />}>Start Playing!</Button></Link>
          <Link href="https://github.com/nanospearing/tetris"><Button color="secondary" size="lg" endContent={<GithubIcon />}>Get the source code!</Button></Link>
        </div>
      </div>
    </div>
  );
}