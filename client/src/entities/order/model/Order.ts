import { z } from "zod";
import { Advertisement, advertisementValidationSchema } from "../../advertisement";

export const OrderStatus = {
  Created: 0,
  Paid: 1,
  Transport: 2,
  DeliveredToThePoint: 3,
  Received: 4,
  Archived: 5,
  Refund: 6,
} as const;

type OrderItem = Advertisement & { count: number; };

export type Order = {
  id: string;
  status: typeof OrderStatus[keyof typeof OrderStatus];
  createdAt: string;
  finishedAt?: string;
  items: Array<OrderItem>;
  deliveryWay: string;
  total: number;
};

const orderItemValidationSchema = advertisementValidationSchema.merge(z.object({ count: z.number().gt(1) }));

export const validateOrder = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(OrderStatus),
  createdAt: z.string().date(),
  finishedAt: z.string().or(z.string().date()),
  items: orderItemValidationSchema,
  deliveryWay: z.string(),
  total: z.number(),
}).parse;
