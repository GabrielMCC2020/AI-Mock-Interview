import { NextRequest, NextResponse } from "next/server";
import ImageKit, { toFile } from '@imagekit/nodejs';
import axios from "axios";
import { aj } from "@/utils/arcjet";
import { auth, currentUser } from "@clerk/nextjs/server";

const client = new ImageKit({
  // publicKey: process.env['IMAGEKIT_URL_PUBLIC_KEY'] || '',
  privateKey: process.env['IMAGEKIT_URL_PRIVATE_KEY'] || '',
  // urlEndpoint: process.env['IMAGEKIT_URL_ENDPOINT'] || ''
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const jobTitle = formData.get('jobTitle')?.toString() ?? null;
    const jobDescription = formData.get('jobDescription')?.toString() ?? null;
    const { has } = await auth();
    const decision = await aj.protect(req, { userId: user?.primaryEmailAddress?.emailAddress ?? '', requested: 5 });
    console.log("Arcjet decision", decision);
    const isSubscribedUser = has({ plan: 'pro' })
    // @ts-ignore
    if (decision?.reason?.remaining == 0 && !isSubscribedUser) {
      return NextResponse.json({
        status: 429,
        result: 'No free credits remaining, Try again after 24 hours.'
      },
      );
    }

    const extractQuestions = (data: any) => {
      let questions = data?.message?.content?.questions;
      const contentArray = data?.output?.[0]?.content;
      const textContent = Array.isArray(contentArray)
        ? contentArray.map((item: any) => item?.text ?? '').join('')
        : '';

      if (!questions && textContent) {
        const sanitized = textContent
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        try {
          const parsed = JSON.parse(sanitized);
          questions = parsed?.questions ?? parsed;
        } catch (parseError) {
          const jsonMatch = sanitized.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              questions = parsed?.questions ?? parsed;
            } catch (nestedError) {
              console.error('Failed to parse questions JSON:', nestedError);
            }
          } else {
            console.error('Failed to parse questions JSON:', parseError);
          }
        }
      }

      if (!questions && textContent) {
        const lines = textContent
          .split(/\r?\n/)
          .map((line) => line.replace(/^\s*\d+[\).\-]\s*/, '').trim())
          .filter(Boolean);
        if (lines.length > 0) {
          questions = lines;
        }
      }

      return questions;
    };

    if (file) {

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
        resumeUrl: uploadResponse?.url,
        jobTitle,
        jobDescription,
      });
      console.log(result.data)

      const questions = extractQuestions(result.data);

      if (!questions) {
        return NextResponse.json({
          error: 'No questions returned from workflow.',
          status: 502,
        }, { status: 502 });
      }

      return NextResponse.json({
        questions,
        resumeUrl: uploadResponse?.url,
        status: 200
      });
    } else {
      const result = await axios.post('https://n8n.srv1306944.hstgr.cloud/webhook/generate-interview-question', {
        resumeUrl: null,
        jobTitle,
        jobDescription
      });
      console.log(result.data)

      const questions = extractQuestions(result.data);

      if (!questions) {
        return NextResponse.json({
          error: 'No questions returned from workflow.',
          status: 502,
        }, { status: 502 });
      }

      return NextResponse.json({
        questions,
        resumeUrl: null
      });
    }

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
