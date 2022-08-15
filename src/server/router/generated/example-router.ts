
import { createRouter } from '../context'
import { z } from 'zod'
import * as trpc from '@trpc/server'

import { createProtectedRouter } from '../protected-router'

export const example = createRouter()
.query('get', {

    input: z.object({
      
          id: z.string().nullish(),
          email: z.string().nullish(),

    }),

    async resolve({ ctx, input }) {

      const example =  await ctx.prisma.example.findMany({
        where: {
            id: input.id || undefined ,
            email: input.email || undefined ,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            user_id: true,
        }
      })
      return example




    },
  })
.merge(
  createProtectedRouter()
  .query('post', {


    input: z.object({

        email: z.string(),
        user_id: z.string(),
        name: z.string().nullish(),
      
    }),
      async resolve({ ctx, input }) {

       const example =  await ctx.prisma.example.create({
          data: {
              email: input.email ,
              name: input.name ,
              user_id: input.user_id ,

          },
          select: {
              id: true,
              email: true,
              name: true,
              createdAt: true,
              user_id: true,
          }
        })
        return example


      },
    })
  .query('delete', {


    input: z.object({
        id: z.string().nullish(),
        email: z.string().nullish(),

    }),
      async resolve({ ctx, input }) {


      const example = await ctx.prisma.example.deleteMany({
          where: {
            user_id: ctx.session.user.id,
              id: input.id || undefined ,
              email: input.email || undefined ,
          }

        })
      return example.count

      },
    })
)
