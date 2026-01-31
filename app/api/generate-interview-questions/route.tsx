import { NextRequest, NextResponse } from "next/server";
import ImageKit, { toFile } from '@imagekit/nodejs';
import axios from "axios";

const client = new ImageKit({
  // publicKey: process.env['IMAGEKIT_URL_PUBLIC_KEY'] || '',
  privateKey: process.env['IMAGEKIT_URL_PRIVATE_KEY'] || '',
  // urlEndpoint: process.env['IMAGEKIT_URL_ENDPOINT'] || ''
});

// Finally, if none of the above are convenient, you can use our `toFile` helper:
// await client.files.upload({
//   file: await toFile(Buffer.from('my bytes'), 'file'),
//   fileName: 'fileName',
// });
// await client.files.upload({
//   file: await toFile(new Uint8Array([0, 1, 2]), 'file'),
//   fileName: 'fileName',
// });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file found' }, { status: 400 });
    }
    console.log("file", formData)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await client.files.upload({
      file: await toFile(buffer, file.name), // NOT required
      fileName: `upload-${Date.now()}.pdf`,
      isPrivateFile: false, // optional
      useUniqueFileName: true,
    });

    // Call n8n Webhook

    const result = await axios.post('https://n8n.srv1306944.hstgr.cloud/webhook/generate-interview-question', {
      resumeUrl: uploadResponse?.url
    });
    console.log(result.data)

    return NextResponse.json({
      questions: result.data?.message?.content?.questions,
      resumeUrl: uploadResponse?.url
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}