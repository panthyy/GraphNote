import { createRouter } from "../context";
import { z } from "zod";
import * as trpc from "@trpc/server";

import { createProtectedRouter } from "../protected-router";

export const node = createRouter().merge(
  createProtectedRouter()
    .query("get", {
      input: z.object({
        id: z.string().nullish(),
      }),
      async resolve({ ctx, input }) {
        const node = await ctx.prisma.node.findMany({
          where: {
            user_id: ctx.session.user.id,
            id: input.id || undefined,
          },
          select: {
            id: true,
            title: true,
            created_at: true,
            updated_at: true,
            data: true,
            root_id: true,
            user_id: true,
          },
        });
        return node;
      },
    })
    .query("post", {
      input: z.object({
        user_id: z.string(),
        title: z.string().nullish(),
        data: z.string().nullish(),
        root_id: z.string().nullish(),
      }),
      async resolve({ ctx, input }) {
        const node = await ctx.prisma.node.create({
          data: {
            title: input.title,
            data: input.data,
            root_id: input.root_id,
            user_id: input.user_id,
          },
          select: {
            id: true,
            title: true,
            created_at: true,
            updated_at: true,
            data: true,
            root_id: true,
            user_id: true,
          },
        });
        return node;
      },
    })
    .query("delete", {
      input: z.object({
        id: z.string().nullish(),
      }),
      async resolve({ ctx, input }) {
        const node = await ctx.prisma.node.deleteMany({
          where: {
            user_id: ctx.session.user.id,
            id: input.id || undefined,
          },
        });
        return node.count;
      },
    })
);
