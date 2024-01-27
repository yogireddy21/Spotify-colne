import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { useStateProvider } from "../utils/stateProvider";
import Body from "./Body";
import { reducerCases } from "../utils/Constants";
import CurrentTrack from "./CurrentTrack";

export default function Spotify() {
  const [{ token }, dispatch] = useStateProvider();
  const [navBackground, setNavBackground] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const bodyRef = useRef();

  const bodyScrolled = () => {
    const scrollTop = bodyRef.current.scrollTop;
    setNavBackground(scrollTop >= 30);
    setHeaderBackground(scrollTop >= 268);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });

        const userInfo = {
          userId: data.id,
          userUrl: data.external_urls.spotify,
          userName: data.display_name,
        };

        dispatch({ type: reducerCases.SET_USER, userInfo });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
  }, [dispatch, token]);

  useEffect(() => {
    const getPlaybackState = async () => {
      try {
        const { data } = await axios.get("https://api.spotify.com/v1/me/player", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });

        dispatch({
          type: reducerCases.SET_PLAYER_STATE,
          playerState: data.is_playing,
        });
      } catch (error) {
        console.error("Error fetching playback state:", error);
      }
    };

    getPlaybackState();
  }, [dispatch, token]);

  return (
    <Container>
      <div className="spotify__body">
        <Sidebar />
        <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
          <Navbar navBackground={navBackground} />
          <div className="body__contents">
            {/* Pass headerBackground as a prop to Body component */}
            <Body headerBackground={headerBackground} />
          </div>
        </div>
      </div>
      <div className="spotify__footer">
        <Footer />
      </div>
    </Container>
  );
}



const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 85vh 15vh;
  .spotify__body {
    display: grid;
    grid-template-columns: 15vw 85vw;
    height: 100%;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(32, 87, 100);
    .body {
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
        max-height: 2rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
`;