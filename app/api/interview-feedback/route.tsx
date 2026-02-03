import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Parse messages if it's a string
    let parsedMessages = messages;
    if (typeof messages === 'string') {
      try {
        parsedMessages = JSON.parse(messages);
      } catch (e) {
        parsedMessages = messages;
      }
    }

    // Generate feedback based on conversation analysis
    const feedback = generateInterviewFeedback(parsedMessages);

    console.log('Generated feedback:', feedback);
    return NextResponse.json({
      content: feedback,
      status: 'success'
    });

  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json({
      error: 'Failed to generate feedback',
      status: 'error'
    }, { status: 500 });
  }
}

function generateInterviewFeedback(messages: any) {
  try {
    // Count user and bot messages
    const userMessages = messages.filter((msg: any) => msg.from === 'user');
    const botMessages = messages.filter((msg: any) => msg.from === 'bot');

    // Analyze response quality
    const totalResponses = userMessages.length;
    const averageResponseLength = userMessages.reduce((acc: number, msg: any) =>
      acc + msg.text.length, 0) / totalResponses || 0;

    // Generate feedback based on analysis
    let feedback = `## Interview Feedback\n\n`;

    feedback += `**Overall Performance:** ${getOverallRating(totalResponses, averageResponseLength)}\n\n`;

    feedback += `**Key Metrics:**\n`;
    feedback += `- Total Questions Answered: ${totalResponses}\n`;
    feedback += `- Average Response Length: ${Math.round(averageResponseLength)} characters\n\n`;

    feedback += `**Strengths:**\n`;
    if (totalResponses > 0) {
      feedback += `✅ Completed ${totalResponses} interview questions\n`;
    }
    if (averageResponseLength > 50) {
      feedback += `✅ Provided detailed responses\n`;
    }

    feedback += `\n**Areas for Improvement:**\n`;
    if (averageResponseLength < 30) {
      feedback += `📝 Consider providing more detailed answers\n`;
    }
    if (totalResponses < 3) {
      feedback += `📝 Try to answer more questions completely\n`;
    }

    feedback += `\n**Recommendations:**\n`;
    feedback += `• Practice explaining technical concepts clearly\n`;
    feedback += `• Prepare specific examples from your experience\n`;
    feedback += `• Focus on demonstrating problem-solving skills\n`;

    return feedback;

  } catch (error) {
    console.error('Error in feedback generation:', error);
    return `## Interview Feedback

**Overall Performance:** Good effort!

**Summary:**
Thank you for completing the interview. Your responses show engagement with the questions asked.

**Recommendations:**
• Continue practicing interview skills
• Focus on clear communication
• Prepare specific examples from your experience`;
  }
}

function getOverallRating(responses: number, avgLength: number): string {
  if (responses >= 5 && avgLength >= 50) return "Excellent";
  if (responses >= 3 && avgLength >= 30) return "Good";
  if (responses >= 1) return "Satisfactory";
  return "Needs Improvement";
}