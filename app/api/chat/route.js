import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// const systemPrompt = `
// You are a coffee AI agent, your role is to give good coffee receipes and suggestions for coffee dates in a good JSON format`;
const systemPrompt ='You are an AI agent';

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENAI_API_KEY, // Use the API key from your environment
        
    });
    const data = await req.json();

    const completion = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [
            {
                role: 'system',
                content: systemPrompt, //completion
            },
            ...data,
        ],
       // model: 'gpt-4o-mini',
        stream: true,
    });
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content; //stream it
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            }
            catch (err) {
                controller.error(err);
            }
            finally {
                controller.close();
            }
        },
    });

    return new NextResponse(stream); //return the stream
}