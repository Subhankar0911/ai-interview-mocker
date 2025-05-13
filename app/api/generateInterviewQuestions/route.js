import { NextResponse } from 'next/server';
import { generateInterviewQuestions } from '../../../utils/GeminiAIModel';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    const responseText = await generateInterviewQuestions(prompt);
    return NextResponse.json({ responseText });
  } catch (error) {
    console.error('Error in generateInterviewQuestions API:', error);
    return NextResponse.json({ error: 'Failed to generate interview questions' }, { status: 500 });
  }
}
