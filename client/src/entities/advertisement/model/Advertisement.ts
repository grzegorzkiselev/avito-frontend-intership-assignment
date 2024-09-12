import { z } from "zod";
import { imageUrlRegexp } from "../../../shared";

export interface Advertisement {
  id: string,
  name: string,
  description?: string,
  price: number,
  createdAt: string,
  views: number,
  likes: number,
  imageUrl?: string
}

export const advertisementValidationSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  createdAt: z.string().datetime(),
  likes: z.number().gte(0),
  views: z.number().gte(0),
  imageUrl: z.string().or(z.string().regex(imageUrlRegexp)),
});

export const validateNewAdvertisement = advertisementValidationSchema.parse;
