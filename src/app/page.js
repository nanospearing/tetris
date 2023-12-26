'use client'

import React from "react";
import { BrowserView, MobileView } from 'react-device-detect';
import Image from "next/image";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Accordion, AccordionItem } from "@nextui-org/react";
import { GithubIcon, ControllerIcon } from "./components/svgs"


export default function Page() {
  return (
    <div>
      <BrowserView>
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
          <div className="w-10/12">
            <Accordion variant="shadow">
              <AccordionItem key="1" title="How to Play and Controls">
                <p className="font-bold text-medium">How to Play: </p>
                <div class>
                  <p>You can check out a official guide</p>
                  <Link href="https://tetris.com/article/33/tetris-tips-for-beginners">here</Link>
                </div>
                <p className="font-bold text-medium">Controls: </p>
                <p>- Use the up arrow to turn your block</p>
                <p>- Use the down arrow to make the block fall quicker</p>
                <p>- Use the left and right arrow to move the block left and right</p>
                <p>- Use the spacebar to hard drop the block (Drops it all the way to the bottom)</p>
                <p>- Use the p key to pause and unpause the game</p>
              </AccordionItem>
              <AccordionItem key="2" title="References">
                <p>-  https://tetris.wiki/Scoring (Scoring based off of Original BPS)</p>
                <p>-  https://tetris.wiki/Tetris_Guideline (Blocks and rules)</p>
                <p>-  Official Tetris logo for logo design</p>
              </AccordionItem>
              <AccordionItem key="3" title="Licensing">
                <p>- Korobeiniki.ogg (This file has been identified as being free of known restrictions under copyright law, including all related and neighboring rights.)</p>
                <Link href="https://commons.wikimedia.org/wiki/File:Korobeiniki.ogg">Source</Link>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <p className="text-4xl">Sorry, but this site is not optimized for mobile. Please use a desktop or laptop to view this site.</p>
      </MobileView>
    </div>
  );
}