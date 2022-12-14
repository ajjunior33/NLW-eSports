import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Select from '@radix-ui/react-select'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Check, GameController, CaretDown, CaretUp } from 'phosphor-react'
import { Input } from './Form/Input'
import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';

interface Game {
  id: string;
  title: string;
}

export function CreateAdModal() {

  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false);

  useEffect(() => {
    axios('http://localhost:3333/games')
      .then(response => {
        setGames(response.data);
      })
  }, []);

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const data = Object.fromEntries(formData);

    if (!data.name) {
      return;
    }
    try {
      axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoiceChannel
      });
      toast('Anúncio criado com sucesso.', {
        duration: 4000,
        position: 'top-center',

        // Styling
        style: {},
        className: '',

        // Custom Icon
        icon: '✅',

        // Change colors of success/error/loading icon
        iconTheme: {
          primary: '#000',
          secondary: '#fff',
        },

        // Aria
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });

    } catch (err) {
      toast.error('Ops... Não foi possível cadastrar seu anúncio.', {
        duration: 4000,
        position: 'top-center',

        // Styling
        style: {},
        className: '',

        // Custom Icon
        icon: '✅',

        // Change colors of success/error/loading icon
        iconTheme: {
          primary: '#000',
          secondary: '#fff',
        },

        // Aria
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      });
    }

  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed">
        <Dialog.Content className="fixed bg-[#2a2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25 h-[80%] sm:w-[90%] sm:flex sm:flex-col overflow-x-scroll sm:h-[90%]">
          <Dialog.Title className="text-3xl text-white font-black">Publique um anúncio</Dialog.Title>
          <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-2 h-16">

              <label htmlFor="game" className="font-semibold">Qual o Game</label>
              <Select.Root name="game">
                <Select.Trigger asChild aria-label="game">
                  <button className='flex items-center flex-row justify-between sm:flex-col sm:m-8'>
                    <Select.Value placeholder="Selecione o game que deseja jogar" />
                    <Select.Icon className="ml-2">
                      <CaretDown />
                    </Select.Icon>
                  </button>
                </Select.Trigger>


                <Select.Content className='flex flex-col mb-10'>
                  <Select.Viewport className="bg-zinc-600 p-2 rounded-lg shadow-lg absolute">
                    <Select.Group>
                      {games.map(game => (
                        <Select.Item
                          key={game.id}
                          value={game.id}
                          className={
                            "relative flex items-center px-8 py-2 rounded-md text-sm text-white-700 dark:zinc-gray-300 font-medium focus:bg-zinc-800 radix-disabled:opacity-50 focus:outline-none select-none"
                          }
                          id="game"
                        >
                          <Select.ItemText>{game.title}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>


            </div>
            <div className="flex flex-col gap-2 mt-14">
              <label htmlFor="name">Seu nome(ou nickname)</label>
              <Input type="text" name="name" id="name" placeholder="Como te chamam dentro do game?" />
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-1">
              <div className="flex flex-col gap-2">
                <label htmlFor="yearsPlaying">Joga a quantos anos ?</label>
                <Input type="number" name="yearsPlaying" id="yearsPlaying" placeholder="Tudo bem ser ZERO" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="discord">Qual seu discord?</label>
                <Input type="text" name="discord" id="discord" placeholder="Usuario#0000" />
              </div>
            </div>

            <div className="flex gap-6 sm:flex-col">
              <div className="flex flex-col gap-2">
                <label htmlFor="weekDays">Quando costuma jogar?</label>

                <ToggleGroup.Root
                  type='multiple'
                  className="grid grid-cols-4 gap-2"
                  onValueChange={setWeekDays}
                  value={weekDays}
                >
                  <ToggleGroup.Item
                    value={"0"}
                    className={`w-8 h-8 rounded ${weekDays.includes("0") ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    title="Domingo">
                    D
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value={"1"}
                    className={`w-8 h-8 rounded ${weekDays.includes("1") ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    title="Segunda">
                    S
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value={"2"}
                    className={`w-8 h-8 rounded ${weekDays.includes("2") ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    title="Terça">
                    T
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value={"3"}
                    className={`w-8 h-8 rounded ${weekDays.includes("3") ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    title="Quarta">
                    Q
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value={"4"}
                    className={`w-8 h-8 rounded ${weekDays.includes("4") ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    title="Quinta">
                    Q
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value={"5"}
                    className={`w-8 h-8 rounded ${weekDays.includes("5") ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    title="Sexta">
                    S
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    value={"6"}
                    className={`w-8 h-8 rounded ${weekDays.includes("6") ? 'bg-violet-500' : 'bg-zinc-900'}`}
                    title="Sabado">
                    S
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              </div>
              <div className="flex flex-col gap-2 flex-1 sm:grid-cols-1">
                <label htmlFor="hourStart">Qual horário do dia ?</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                  <Input type="time" name="hourStart" id="hourStart" placeholder="De" />
                  <Input type="time" name="hourEnd" id="hourEnd" placeholder="Até" />
                </div>
              </div>
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm sm:grid-cols-1">
              <Checkbox.Root
                onCheckedChange={(checked) => {
                  checked === true ? setUseVoiceChannel(true) : setUseVoiceChannel(false)
                }}
                checked={useVoiceChannel}
                className='w-6 h-6 p-1 rounded bg-zinc-900'
              >
                <Checkbox.Indicator>
                  <Check className='w-4 h-4 text-emerald-400' />
                </Checkbox.Indicator>
              </Checkbox.Root>
              Costumo me conectar ao chat de voz
            </label>

            <footer className="mt-4 flex justify-end gap-4 sm:flex-col">
              <Dialog.Close className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600">Cancelar</Dialog.Close>
              <button
                type="submit"
                className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center justify-center gap-3 hover:bg-violet-600"
              >
                <GameController size={24} />
                Encontrar duo
              </button>

            </footer>
          </form>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  )
}
