import express, { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors';
import { AnyZodObject, z } from 'zod'
import { convertHoursStringToMinutes } from './utils/conver-hour-string-to-minutes';
import { convertMinutesToHoursString } from './utils/convert-minutes-to-hours-string';
import Exception from './shared/erros';


const app = express();
const prisma = new PrismaClient({
  log: ['query']
});

app.use(express.json());

app.use(cors());

const GameSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name é obrigatório.",
      invalid_type_error: "yearsPlaying é do tipo númerico."
    }),
    yearsPlaying: z.number({
      required_error: "yearsPlaying é obrigatório.",
      invalid_type_error: "yearsPlaying é do tipo númerico."
    }),
    discord: z.string({
      required_error: "discord é obrigatório.",
      invalid_type_error: "discord é do tipo string."
    }),
    weekDays: z.array(
      z.number({
        required_error: "weekDays é obrigatório.",
        invalid_type_error: "weekDays é um array númerico. Ex: [5,6,1]."
      })
    ),
    hourStart: z.string({
      required_error: "hourStart é obrigatório.",
      invalid_type_error: "hourStart é do tipo string. Ex: 00:00."
    }),
    hourEnd: z.string({
      required_error: "hourEnd é obrigatório.",
      invalid_type_error: "hourEnd é do tipo string. Ex: 01:00."
    }),
    useVoiceChannel: z.boolean({
      required_error: "useVoiceChannel é obrigatório.",
      invalid_type_error: "useVoiceChannel is type boolean."
    }),
  })
});

const validate = (schema: AnyZodObject) =>
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: request.body,
        query: request.query,
        params: request.params
      })
      return next()
    } catch (error) {
      return response.status(400).json(error);
    }
  }


app.get("/games", async (request: Request, response: Response, next: NextFunction) => {
  try{
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: {
            ads: true
          }
        }
      }
    });

    if(games.length === 0){
      throw new Exception("Não existe nem um game cadastrado para ser listado.", 400);
    }
    return response.status(200).json(games);
  }catch(err){
    next(err);
  }
});

app.post("/games/:id/ads", validate(GameSchema), async (request: Request, response: Response, next: NextFunction) => {
  try {
    const gameId = request.params.id;


    const {
      name,
      yearsPlaying,
      discord,
      weekDays,
      hourStart,
      hourEnd,
      useVoiceChannel,
    } = request.body;


    const ad = await prisma.ad.create({
      data: {
        gameId,
        name,
        yearsPlaying,
        discord,
        weekDays: weekDays.join(','),
        hourStart: convertHoursStringToMinutes(hourStart),
        hourEnd: convertHoursStringToMinutes(hourEnd),
        useVoiceChannel,
      }
    });

    if(!ad){
      throw new Exception("Houve um erro inesperado. Não foi possível criar seu anúncio.", 400);
    }
    

    return response.status(201).json(ad);
  } catch (err) {
    next(err);
  }
})

app.get("/games/:id/ads", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const gameId = request.params.id;
    const ads = await prisma.ad.findMany({
      where: {
        gameId
      },
      select: {
        id: true,
        name: true,
        weekDays: true,
        useVoiceChannel: true,
        yearsPlaying: true,
        hourStart: true,
        hourEnd: true
      },
      orderBy: {
        createAt: 'desc'
      }
    });

    if(!ads || ads.length === 0){
      throw new Exception("Os anúncios do game informado não foram encontrados.", 400);
    } 

    return response.status(200).json(ads.map(ad => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(','),
        hourStart: convertMinutesToHoursString(ad.hourStart),
        hourEnd: convertMinutesToHoursString(ad.hourEnd)
      }
    }))
  } catch (err) {
    next(err)
  }
});

app.get("/ads/:id/discord", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const adId = request.params.id;
    const ad = await prisma.ad.findUnique({
      select: {
        discord: true
      },
      where: {
        id: adId
      }
    });

    if(!ad){
      throw new Exception("O discord do anúncio informado não foi encontrado.", 400)
    }

    return response.status(200).json({
      discord: ad.discord
    });
  } catch (err) {
    next(err);
  }
})


app.use((
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction) => {
  if (error instanceof Exception) {
      return response.status(error.statusCode).json({
          status: 'error',
          message: error.message,
          statusCode: error.statusCode
      })
  }

  console.log(error);

  return response.status(500).json({
      status: 'error',
      message: ' Internal server error',
  })
});

app.listen(3333);
