import { z } from 'zod';
import { Seiue } from '@/lib/seiue';

const userSchema = z.object({
  schoolId: z.string().min(1).max(20),
  password: z.string().min(1).max(200), // who will have a 200-character password?
});

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => userSchema.safeParse(body));
  if (!result.success)
    throw result.error.issues;
  const { schoolId, password } = result.data;
  const seiue = await Seiue.init({ schoolId, password });
  if (!seiue)
    return { success: false as const, message: '登录失败，请检查输入的信息' };
  return { success: true as const, message: '登录成功', ...seiue.user() };
});
