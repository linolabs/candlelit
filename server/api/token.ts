import { z } from 'zod';
import { Seiue } from '~/lib/seiue';

const tokenSchema = z.object({
  cookies: z.record(z.string()),
});

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => tokenSchema.safeParse(body));
  if (!result.success)
    throw result.error.issues;
  try {
    const res = await Seiue.retrieveToken(result.data.cookies);
    return { success: true as const, accessToken: res.access_token };
  } catch {
    return { success: false as const };
  }
});
