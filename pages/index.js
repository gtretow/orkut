/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { MainGrid, Box } from "../src/components/MainGrid";
import nookies from "nookies";

import jwt from "jsonwebtoken";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/alurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar({ githubUser }) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <a className="boxLink" href={`https://github.com/${githubUser}`}>
        @{githubUser}
      </a>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export default function Home(props) {
  const [comunidades, setComunidades] = React.useState([]);

  const usuarioAleatorio = props.githubUser;
  const pessoasFavoritas = [
    "deus",
    "capeta",
    "richard",
    "noah",
    "david",
    "cow",
  ];
  //0- pegar o array de dados do github

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function () {
    fetch("https://api.github.com/users/gtretow/followers")
      .then(function (res) {
        return res.json();
      })
      .then(function (resp) {
        setSeguidores(resp);
      });

    //api graphQL
    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: "d206db72ff996e29661d209bd415b9",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
        allCommunities {
          id 
          title
          imageUrl
          creatorSlug
        }
      }`,
      }),
    })
      .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        console.log(comunidadesVindasDoDato);
        setComunidades(comunidadesVindasDoDato);
      });
    // .then(function (response) {
    //   return response.json()
    // })
  }, []);

  //1- criiar um box que vai ter um map baseado nos itens do array que pegamos do gh

  function handleCreateCom(event) {
    event.preventDefault();

    const dadosDoForm = new FormData(event.target);

    const comunidade = {
      titulo: dadosDoForm.get("title"),
      image: dadosDoForm.get("image"),
      creatorSlug: usuarioAleatorio,
    };

    fetch("/api/comunidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comunidade),
    }).then(async (res) => {
      const dados = res.json();
      console.log(dados);
      const comunidadesAtualizadas = [...comunidades, dados.registroCriado];
      setComunidades(comunidadesAtualizadas);
    });
  }

  function ComBox({ placeholder, name, arialLabel, type }) {
    return (
      <>
        <div>
          <input
            placeholder={placeholder}
            name={name}
            aria-label={arialLabel}
            type={type}
          />
        </div>
      </>
    );
  }

  function ProfileRelationsBox(props) {
    return (
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {props.title} ({props.items.length})
        </h2>

        {/*  <ul>
          {seguidores.map((itemAtual) => {
            return (
              <li key={itemAtual}>
                <a href={`https://github.com/${itemAtual.title}/png`}>
                  <img src={itemAtual.image} />
                  <span>{itemAtual.title}</span>
                </a>
              </li>
            );
          })}
        </ul> */}
      </ProfileRelationsBoxWrapper>
    );
  }

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a), {usuarioAleatorio}</h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleCreateCom}>
              <ComBox
                placeholder="Qual vai ser o nome da sua comunidade?"
                name="title"
                arialLabel="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
              <ComBox
                placeholder="Coloque uma URL para usarmos de capa"
                name="image"
                arialLabel="Coloque uma URL para usarmos de capa"
              />

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox items={seguidores} title="Seguidores" />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Amigos ({pessoasFavoritas.length})</h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const { isAuthhenticated } = await fetch(
    "https://alurakut.vercel.app/api/auth",
    { headers: { Authorization: token } }
  ).then((resposta) => resposta.json());

  if (!isAuthhenticated) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const { githubUser } = jwt.decode(token);
  console.log("token decodificadoo", jwt.decode(token));
  return {
    props: { githubUser },
  };
}
