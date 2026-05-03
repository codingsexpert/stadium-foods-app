import { streamText } from 'ai'
import { foodItems, trendingItems, recentReviews } from '@/lib/data'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const systemPrompt = `You are StadiumBite AI, a friendly food assistant for stadium visitors during live matches.

CURRENT MENU DATA:
${foodItems.map(item => `- ${item.name} (${item.stallName}): Rs.${item.price}, Rating: ${item.rating}/5, Tags: ${item.tags.join(', ')}`).join('\n')}

TRENDING NOW:
${trendingItems.map(t => `- ${t.item.name}: ${t.sentiment === 'hot' ? 'HOT!' : 'Rising'} (${t.recentRatings} ratings in last hour)`).join('\n')}

RECENT REVIEWS:
${recentReviews.slice(0, 3).map(r => `- ${r.userName} rated ${r.itemName} ${r.rating}/5: "${r.comment}"`).join('\n')}

GUIDELINES:
- Be enthusiastic and match the stadium energy
- Give quick, helpful recommendations
- Mention prices in Rs.
- Keep responses brief (2-3 sentences max for recommendations)
- Use rating data to back up suggestions
- If asked about non-food topics, politely redirect to food
- Mention stall locations when recommending
- Consider dietary preferences (veg/non-veg) when asked`

  const result = streamText({
    model: 'google/gemini-2.0-flash-001',
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}
