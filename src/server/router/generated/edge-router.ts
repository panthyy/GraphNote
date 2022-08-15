
import { createRouter } from '../context'
import { z } from 'zod'
import * as trpc from '@trpc/server'

import { createProtectedRouter } from '../protected-router'

export const edge = createRouter()
.merge(
  createProtectedRouter()
  .query('get', {


    input: z.object({
        id: z.string().nullish(),

    }),
      async resolve({ ctx, input }) {
        const edge =  await ctx.prisma.edge.findMany({
          where: {
            user_id: ctx.session.user.id,
              id: input.id || undefined ,
          },
          select: {
              id: true,
              from_node_id: true,
              to_node_id: true,
              user_id: true,
          }
        })
        return edge



      },
    })
  .query('post', {


    input: z.object({

        from_node_id: z.string(),
        to_node_id: z.string(),
        user_id: z.string(),
      
    }),
      async resolve({ ctx, input }) {

       const edge =  await ctx.prisma.edge.create({
          data: {
              from_node_id: input.from_node_id ,
              to_node_id: input.to_node_id ,
              user_id: input.user_id ,

          },
          select: {
              id: true,
              from_node_id: true,
              to_node_id: true,
              user_id: true,
          }
        })
        return edge


      },
    })
  .query('delete', {


    input: z.object({
        id: z.string().nullish(),

    }),
      async resolve({ ctx, input }) {


      const edge = await ctx.prisma.edge.deleteMany({
          where: {
            user_id: ctx.session.user.id,
              id: input.id || undefined ,
          }

        })
      return edge.count

      },
    })
)
