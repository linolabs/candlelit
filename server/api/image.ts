import { satori } from 'v-satori';
import { z } from 'zod';
import { Resvg } from '@resvg/resvg-js';
import ImageExport from '@/components/ImageExport.vue';
// @ts-expect-error font file
import Uncut from '~/assets/fonts/uncut-sans-regular.woff';
// @ts-expect-error font file
import Noto from '~/assets/fonts/NotoSansSC-Regular.woff';
import { transformExportInput } from '~/utils/shared';

const inputSchema = z.object({
  orders: z.array(z.object({
    startTime: z.string(),
    endTime: z.string(),
    venueName: z.string(),
    description: z.string(),
    capacity: z.number(),
  })),
  createdAt: z.string(),
});

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, input => inputSchema.safeParse(input));
  if (!body.success)
    throw new Error('Invalid input');
  const transformedBody = transformExportInput(body.data);
  const svg = await satori(ImageExport, {
    props: transformedBody,
    width: 1200,
    fonts: [{
      name: 'Uncut',
      data: Uncut,
      weight: 400,
      style: 'normal',
    }, {
      name: 'Noto',
      data: Noto,
      weight: 400,
      style: 'normal',
    }],
  });

  const resvg = new Resvg(svg, {
    background: 'rgba(255, 255, 255, 1)',
    fitTo: { mode: 'width', value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  setHeader(event, 'Content-Type', 'image/png');
  setHeader(event, 'Content-Disposition', `attachment; filename="order-export-${Date.now()}.png"`);

  // transform into blob
  const blob = new Blob([pngBuffer], { type: 'image/png' });
  return blob;
});
