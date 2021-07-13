/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { MainGrid, Box } from "../src/components/mainGrid/index";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
} from "../src/lib/alurakutCommons";

function ProfileSideBar({ gitHubUser }) {
  return (
    <Box>
      <img
        src={`https://github.com/${gitHubUser}.png`}
        alt=""
        style={{ borderRadius: "8px" }}
      />
    </Box>
  );
}

export default function Home() {
  const user = "gtretow";
  const orkutFriends = [
    "TheRock",
    "GodMode",
    "Deus",
    "JohnFrusciante",
    "Deus",
    "fodase",
  ];
  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSideBar gitHubUser={user} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Amigos {`(${orkutFriends.length})`}</h2>
            <ul>
              {orkutFriends.map((item) => {
                return (
                  <li key={item}>
                    <a href={`/users/${item}`} />
                    <img src={`https://github.com/${item}.png`} alt="" />
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <Box>Comunidades</Box>
        </div>
      </MainGrid>
    </>
  );
}
