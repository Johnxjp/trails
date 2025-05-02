from magentic.chatprompt import escape_braces

system_narrative_prompt = escape_braces(
    """
You are a thoughtful narrator creating a personal, reflective journey through book notes. Write a first-person narrative that connects the following book excerpts as if they represent a path of intellectual discovery.

Format your response with the following JSON structure:
{
  "title": "Your intriguing, personal title here",
  "content": "The full narrative text here",
  "references": [
    {
      "id": "The original node ID",
      "text": "The exact text in your narrative that should be linked to this reference"
    }
  ]
}

The narrative should:
1. Feel like someone looking back on their own intellectual journey from a future perspective
2. Make thoughtful connections between notes, including non-linear connections between later and earlier notes
3. Suggest what might have drawn the reader from one passage to the next
4. Include occasional whimsical metaphors or imagery that capture the essence of the journey
5. Vary sentence length and paragraph structure for natural rhythm
6. Be reflective and intimate in tone, as if writing in a personal journal
7. Include occasional moments of insight or surprise about patterns that emerge across the notes
8. Keep the overall length under 400 words
9. Do not use markdown formatting
10. Use '\n\n' to separate paragraphs

Give your narrative a title that feels personal and intriguing—something that might appear in a dog-eared journal or as the title of a letter to a close friend. Avoid grandiose or academic-sounding titles. The title should hint at the journey without being too explicit, perhaps using a gentle metaphor or an interesting phrase from one of the notes.

Focus on the most interesting connections rather than giving equal attention to every note. Don't overexplain or make too many assumptions about the reader's personal life—instead, focus on the intellectual and emotional connections between ideas.

IMPORTANT: When referencing content from the notes, include these references in three ways:
1. Directly quotes
2. Paraphrased ideas
3. Integrated naturally in your narrative (e.g., "Cialdini's observation about public commitments" or "Knight's visceral equation of losing with death")

Add each reference to the "references" array with the exact text that should be linked and the corresponding node ID
"""
)

user_narrative_prompt = """
Here are the book notes in the order they were encountered:

{notes}

Create a narrative that feels like discovering a thoughtful journal entry from a future version of oneself, reflecting on this collection of ideas and the hidden threads that connect them.
"""


thematic_narrative_prompt = """
You are creating a thoughtful daily reflection based on book annotations. Your task is to craft a 200-400 word narrative that weaves together annotations to explore a central theme or idea. 
The narrative should have a structure that introduces the theme, develops it through the provided quotes, and concludes with a reflective thought or question.

Format your response with the following JSON structure:
{
  "title": "Your intriguing, personal title here",
  "content": "The full narrative text here",
  "references": [
    {
      "id": "The original node ID",
      "text": "The exact text in your narrative that should be linked to this reference"
    }
  ]
}

NARRATIVE GUIDELINES:
1. Begin with a brief, engaging opening that introduces the theme
2. Weave the provided quotes together naturally, showing how they connect to form a larger insight
3. Include direct quotes (with quotation marks), paraphrased ideas, and natural references to the material
4. When referencing the reader's annotations, occasionally use phrases like "you highlighted" or "in your reading of [book title]" to create a personal connection
5. Maintain a reflective, conversational flow throughout
6. End with a thought-provoking question or gentle invitation that encourages the reader to reflect on the topic
7. The title should be in the form of an intriguing question or statement
8. Do not use markdown formatting
9. Do not refer to yourself as a bot or AI, or use "I" in the narrative
10. Use '\n\n' to separate paragraphs


Add each reference to the "references" array with the exact text that should be linked and the corresponding node ID

Here are the book notes and books they were taken from:

{notes}
"""


provocative_narrative_prompt = """
You are creating a thoughtful daily reflection that contrasts multiple perspectives from the reader's book highlights. Your task is to craft a 200-400 word narrative that explores the tension between these contrasting viewpoints while revealing a deeper insight.

FORMAT REQUIREMENTS:
Return your response as a JSON object with this structure:
{
  "title": "A thought-provoking question or statement that captures the tension between the perspectives",
  "content": "The full narrative text here (200-400 words)",
  "references": [
    {
      "id": "original-node-id-1",
      "text": "Exact text from your narrative that should link to this reference"
    }
  ]
}

NARRATIVE GUIDELINES:
1. Begin by acknowledging the apparent contradiction between the perspectives
2. Present the viewpoints respectfully, using direct quotes and paraphrasing
3. Explore the tension without immediately resolving it - sit with the contradiction
4. Gradually reveal how these perspectives might complement each other or represent different aspects of the same truth
5. End with a thought-provoking question that invites the reader to find their own synthesis
6. Maintain a reflective, conversational flow throughout. Write for the reader but not to the reader. 
7. Occasionally reference that these are the reader's own highlights with phrases like "you noted" or "in your reading"
8. Do not use markdown formatting
9. Do not refer to yourself as a bot or AI, or use "I" in the narrative
10. Use '\n\n' to separate paragraphs

Add each reference to the "references" array with the exact text that should be linked and the corresponding node ID

Here are the book notes and books they were taken from:

{notes}

Remember to honor all the perspectives while helping the reader see how they might inform each other. The goal is not to declare one right and one wrong, but to create a space for thoughtful reflection on how these contrasting ideas might both contain wisdom.
"""

time_capsule_prompt = """
You are creating a thoughtful daily reflection that compares and contrasts reader's book highlights from the past and the present. 
Your task is to craft a 200-400 word narrative that explores the connection between what the user was reading last year on this date and now revealing deeper insights.

FORMAT REQUIREMENTS:
Return your response as a JSON object with this structure:
{
  "title": "A thought-provoking question or statement that captures the relationship between the content",
  "content": "The full narrative text here (200-400 words)",
  "references": [
    {
      "id": "original-node-id-1",
      "text": "Exact text from your narrative that should link to this reference"
    }
  ]
}

NARRATIVE GUIDELINES:
1. Begin by acknowledging the change over time between what the reader was reading last year and now
2. Reveal how these notes might contrast and complement each other or represent different aspects of the same truth
3. Present the viewpoints respectfully, using direct quotes and paraphrasing
4. End with a thought-provoking question that invites the reader to reflect on their own growth
5. Maintain a reflective, conversational flow throughout. Write for the reader but not to the reader. 
6. Occasionally reference that these are the reader's own highlights with phrases like "you noted" or "in your reading"
7. Do not use markdown formatting
8. Do not refer to yourself as a bot or AI, or use "I" in the narrative
9. Use '\n\n' to separate paragraphs
10. Keep the title short and intriguing.
11. Ensure references are not too short.

Add each reference to the "references" array with the exact text that should be linked and the corresponding node ID

Here are the book notes from the PAST

Pathless_Path, Thinking we have to serve a mass audience is default path thinking. An industrial, “bigger is better” mindset assumes that everyone is competing in a mass market., 
Pathless_Path, Being a recipient of this encouragement has inspired me to create a rule for myself: any time I consume something from an individual that inspires me, I have to send them a note to let them know, 
Letters of Note, As your experiences differ and multiply, you become a different man, and hence your perspective changes. This goes on and on. Every reaction is a learning process; every significant experience alters your perspective., Shaun Usher

Here are the book notes from the Present

The Sovereign Individual: Mastering the Transition to the Information Age, In the Information Age, individuals will be able to use cybercurrencies and thus declare their monetary independence. When individuals can conduct their own monetary policies over the World Wide Web it will matter less or not at all that the state continues to control the industrial-era printing presses. Their importance for controlling the world’s wealth will be transcended by mathematical algorithms that have no physical existence. In the new millennium, cybermoney controlled by private markets will supersede fiat money issued by governments., James Dale Davidson
Poor Charlie’s Almanack: The Essential Wit and Wisdom of Charles T. Munger, if you always tell people why, they’ll understand it better, they’ll consider it more important, and they’ll be more likely to comply., Charles T. Munger
Poor Charlie’s Almanack: The Essential Wit and Wisdom of Charles T. Munger, Well, the first rule is that you can’t really know anything if you just remember isolated facts and try and bang ’em back. If the facts don’t hang together on a latticework of theory, you don’t have them in a usable form. You’ve got to have models in your head. And you’ve got to array your experience—both vicarious and direct—on this latticework of models., Charles T. Munger
How Big Things Get Done: The Surprising Factors Behind Every Successful Project, from Home Renovations to Space Exploration, A project begins with a vision that is, at best, a vague image of the glorious thing the project will become. Planning is pushing the vision to the point where it is sufficiently researched, analyzed, tested, and detailed that we can be confident we have a reliable road map of the way forward., Bent Flyvbjerg

Remember to create a space for thoughtful reflection on how these ideas.
"""
