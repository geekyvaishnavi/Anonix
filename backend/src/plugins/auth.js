import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const authPlugin = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET,
        })
    )
    
    .derive(async ({ jwt, cookie }) => {
        const authToken = cookie.auth_token?.value;

        if (!authToken) {
            return { user: null };
        }

        const user = await jwt.verify(authToken);
        return { user };
    });
