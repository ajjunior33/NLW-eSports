import { useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios'
import { useKeenSlider } from 'keen-slider/react'

import logoImg from "./assets/logo.svg";
import "keen-slider/keen-slider.min.css"
import "./styles/main.css"

import { GameBanner } from "./components/GameBanner";

import { CreateAdBanner } from "./components/CreateAdBanner";
import { CreateAdModal } from "./components/CreateAdModal";

interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number
  }
}


function App() {

  const [games, setGames] = useState<Game[]>([]);

  const [sliderRef] = useKeenSlider({
    mode:"free-snap",
    slides: {
      perView: 5,
      spacing: 15,
      origin:"center",
    },
    breakpoints:{
      '(max-width: 640px)':{
        slides:{
          perView: 2,
          spacing: 10,
          origin:"center"
        }
      }
    }
  })

  useEffect(() => {
    axios('http://localhost:3333/games').then((response: any) => {
      setGames(response.data)
    })
  }, []);


  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} alt="Logo" />
      <h1 className="text-6xl sm:text-4xl text-white font-black mt-20">
        Seu <span className="bg-nlw-gradient bg-clip-text text-transparent">duo</span> está aqui
      </h1>
      <div ref={sliderRef} className="keen-slider grid grid-cols-6 gap-6 mt-16 w-full">
        {games.map(game => (
          <GameBanner
            _id={game.id}
            adsCount={game._count.ads}
            bannerUrl={game.bannerUrl}
            title={game.title}
            key={game.id} />
        ))}
      </div>
      <Dialog.Root>
        <CreateAdBanner />
        <CreateAdModal />
      </Dialog.Root>
    </div>
  )
}

export default App
