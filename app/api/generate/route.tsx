import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { product, goal, budget } = body;

    const productText = `Title: ${product.title}
Description: ${product.description}
Category: ${product.category}
Price: ${product.price}`;

    const agent1 = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a marketing strategist. Analyze the product and define a target audience, key value propositions, and recommended tone of voice.'
        },
        {
          role: 'user',
          content: `Analyze this product and return a short audience profile, value propositions, and tone recommendations.\n\n${productText}`
        }
      ]
    });

    const agent1Text = agent1.choices[0].message.content;

    let strategyPrompt;
    if (goal === 'brand_awareness') {
      strategyPrompt = 'Create a campaign strategy focused on reach, impressions, and follower growth.';
    } else {
      strategyPrompt = 'Create a campaign strategy focused on clicks and purchases, with strong urgency and offers.';
    }

    const agent2 = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You design channel and campaign strategies for small e-commerce brands.'
        },
        {
          role: 'user',
          content: `${strategyPrompt}\nUse the following product and audience analysis:\n\n${agent1Text}`
        }
      ]
    });

    const agent2Text = agent2.choices[0].message.content;

    const agent3 = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You write short, punchy ad copy for social and paid ads.'
        },
        {
          role: 'user',
          content: `Based on this analysis and strategy, generate 3 to 5 ad variations with a headline, primary text, and call to action for each.\n\nAnalysis:\n${agent1Text}\n\nStrategy:\n${agent2Text}`
        }
      ]
    });

    const agent3Text = agent3.choices[0].message.content;

    let budgetPrompt;
    if (budget === 'low') {
      budgetPrompt = 'Assume a low budget and focus on mostly organic posts and maybe one or two low-spend paid campaigns.';
    } else {
      budgetPrompt = 'Assume a medium to high budget and plan a mix of organic posts and consistent paid campaigns.';
    }

    const agent4 = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You create campaign schedules and define simple KPIs.'
        },
        {
          role: 'user',
          content: `Using this analysis, strategy, and ad copy, create a 7 day schedule with channels, post ideas, and basic KPIs to monitor.\n\nAnalysis:\n${agent1Text}\n\nStrategy:\n${agent2Text}\n\nAd copy:\n${agent3Text}\n\nBudget: ${budgetPrompt}`
        }
      ]
    });

    const agent4Text = agent4.choices[0].message.content;

    return new Response(
      JSON.stringify({
        productAnalysis: agent1Text,
        strategy: agent2Text,
        creatives: agent3Text,
        schedule: agent4Text
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
