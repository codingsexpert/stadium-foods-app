import { generateText } from 'ai'

export async function POST(req: Request) {
  const { review, itemName } = await req.json()

  const result = await generateText({
    model: 'google/gemini-2.0-flash-001',
    prompt: `Analyze this food review for "${itemName}" and respond with ONLY a JSON object (no markdown):
    
Review: "${review}"

Return JSON with:
- sentiment: "positive", "negative", or "neutral"
- summary: A 10-word max summary of the review
- highlights: Array of 1-2 key points mentioned

Example response:
{"sentiment":"positive","summary":"Great taste but long wait time","highlights":["excellent flavor","slow service"]}`
  })

  try {
    const cleaned = result.text.replace(/```json\n?|\n?```/g, '').trim()
    const analysis = JSON.parse(cleaned)
    return Response.json(analysis)
  } catch {
    return Response.json({
      sentiment: 'neutral',
      summary: 'Review received',
      highlights: []
    })
  }
}
