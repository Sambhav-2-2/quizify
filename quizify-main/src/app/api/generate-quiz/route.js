import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      topic, 
      difficulty, 
      numQuestions, 
      questionTypes, 
      instructions 
    } = body;
    
    // Validate required fields
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }
    
    // Format the selected question types for the prompt
    const selectedTypes = Object.entries(questionTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => {
        // Convert camelCase to readable format
        switch(type) {
          case 'multipleChoice': return 'multiple-choice';
          case 'trueFalse': return 'true-false';
          case 'shortAnswer': return 'short-answer';
          case 'fillBlanks': return 'fill-in-the-blanks';
          default: return type;
        }
      })
      .join(', ');
    
    // Create the prompt for Gemini
    const prompt = `Generate a quiz with the following specifications:
    
Topic: ${topic}
Difficulty: ${difficulty}
Number of questions: ${numQuestions}
Question types: ${selectedTypes || 'multiple-choice'}
${instructions ? `Additional instructions: ${instructions}` : ''}

Please provide the quiz in the following JSON format:
{
  "title": "Quiz title based on the topic",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}

For multiple-choice, include options and correctAnswer.
For true-false, set type to "true-false", and correctAnswer to either "True" or "False".
For short-answer, set type to "short-answer" and include a model answer in correctAnswer.
For fill-in-the-blanks, set type to "fill-in-the-blanks" and include the full text with blanks indicated by ___ in the question field, and the words that go in the blanks in the correctAnswer field.

Very important: Respond ONLY with valid JSON. No other text or explanation. Make sure all questions are factually correct and appropriate for the ${difficulty} difficulty level.`;

    // Call Gemini API with the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Changed from "gemini-1.0-pro" to "gemini-pro"
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    // Parse the response
    let quiz;
    
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || 
                       content.match(/```\n([\s\S]*)\n```/) ||
                       content.match(/{[\s\S]*}/);
                        
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      
      // Clean up the string before parsing
      const cleanJsonStr = jsonStr.replace(/\/\/.*$/gm, '').trim();
      quiz = JSON.parse(cleanJsonStr);
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      console.log('Response content:', content);
      
      // Fallback: Return a simple formatted response if parsing fails
      return NextResponse.json({
        title: `Quiz on ${topic}`,
        questions: [
          {
            id: 1,
            type: "multiple-choice",
            question: "There was an error generating your quiz. Please try again.",
            options: ["Try again", "Use different settings", "Contact support"],
            correctAnswer: "Try again",
            explanation: "The AI had trouble formatting the response correctly."
          }
        ],
        error: 'Failed to parse quiz content properly'
      }, { status: 200 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the quiz', message: error.message },
      { status: 500 }
    );
  }
}