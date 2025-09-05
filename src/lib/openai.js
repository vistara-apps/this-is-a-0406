import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('OpenAI API key not found. AI features will be disabled.')
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
}) : null

export const ai = {
  async generateScript(scenario, state, language = 'en') {
    if (!openai) {
      throw new Error('OpenAI not configured')
    }

    const prompt = `Generate a concise, practical script for someone interacting with law enforcement in ${state}. 
    
Scenario: ${scenario}
Language: ${language}
State: ${state}

Please provide:
1. What to say (exact phrases)
2. What NOT to say
3. Key rights to remember
4. De-escalation tips

Keep it brief, actionable, and legally sound for ${state} law. Format as JSON with sections: "whatToSay", "whatNotToSay", "keyRights", "deEscalationTips".`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal assistant specializing in civil rights and police interactions. Provide accurate, state-specific legal guidance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.3
      })

      const response = completion.choices[0].message.content
      return JSON.parse(response)
    } catch (error) {
      console.error('Error generating script:', error)
      throw error
    }
  },

  async summarizeLegalText(text, language = 'en') {
    if (!openai) {
      throw new Error('OpenAI not configured')
    }

    const prompt = `Summarize this legal text in simple, understandable language for the average person. 
    
Text: ${text}
Language: ${language}

Make it:
- Easy to understand
- Actionable
- Focused on key rights and responsibilities
- Maximum 200 words`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal translator who makes complex legal language accessible to everyone."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.2
      })

      return completion.choices[0].message.content
    } catch (error) {
      console.error('Error summarizing legal text:', error)
      throw error
    }
  },

  async translateContent(content, targetLanguage) {
    if (!openai) {
      throw new Error('OpenAI not configured')
    }

    const prompt = `Translate the following legal content to ${targetLanguage}. Maintain legal accuracy and cultural appropriateness.

Content: ${JSON.stringify(content)}

Return the translated content in the same JSON structure.`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional legal translator with expertise in civil rights terminology."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      })

      const response = completion.choices[0].message.content
      return JSON.parse(response)
    } catch (error) {
      console.error('Error translating content:', error)
      throw error
    }
  }
}
