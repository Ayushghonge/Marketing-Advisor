import os
import json
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the Groq client (it will automatically look for GROQ_API_KEY in the environment)
def generate_mock_strategy(business_name: str, industry: str, budget: int, goals: list, reason: str = "API Key not configured"):
    """
    Generates a highly realistic and structured marketing strategy locally.
    This acts as a fallback when the Groq API is unavailable or the API key is expired.
    """
    ind = industry.lower()
    
    # 1. Define channels and content ideas based on industry
    goal_str = ", ".join(goals) if goals else "business growth"
    if any(keyword in ind for keyword in ["saas", "software", "tech", "app", "digital"]):
        channels = ["Google Search Ads", "LinkedIn Content Marketing", "SEO & Blog Strategy", "Email Lead Nurturing"]
        ideas = [
            {"title": "Interactive Product Demo Launch", "description": "Build and promote a 14-day free trial on LinkedIn and Google Search to capture high-intent buyers."},
            {"title": "Industry Deep-Dive Ebook", "description": "Write a comprehensive guide addressing key operational bottlenecks to capture decision-maker emails."},
            {"title": "Video Case Studies", "description": "Showcase 2-minute video testimonials of active customers showing measurable ROI to boost trust."}
        ]
        core_message = f"Streamline your operations and scale efficiently with {business_name} — the next-generation {industry} platform built to accelerate your target goals: {goal_str}."
    elif any(keyword in ind for keyword in ["e-commerce", "retail", "shop", "product", "clothing", "fashion"]):
        channels = ["Meta Ads (Instagram/Facebook)", "Google Shopping Ads", "Micro-Influencer Marketing", "Automated Email Flows"]
        ideas = [
            {"title": "User-Generated Content Campaigns", "description": "Partner with micro-influencers for authentic unboxing videos and Instagram reels demonstrating the product."},
            {"title": "Abandoned Cart Recovery Flow", "description": "Set up a highly targeted 3-part automated email recovery flow offering a 10% discount code."},
            {"title": "VIP Flash Sales", "description": "Launch exclusive monthly product drops or early access sales targeted at existing email subscribers."}
        ]
        core_message = f"Experience quality and convenience with {business_name} — premium {industry} products curated to elevate your daily routine and support: {goal_str}."
    elif any(keyword in ind for keyword in ["local", "restaurant", "food", "salon", "clinic", "dental", "gym"]):
        channels = ["Local SEO & Google Maps", "Geo-targeted Meta Ads", "Community Sponsorships", "Customer Referral Program"]
        ideas = [
            {"title": "Google Maps & Local Search SEO Boost", "description": "Optimize Google Business Profile and local citations while running a review collection drive."},
            {"title": "Hyper-local Offer Ads", "description": "Run localized Instagram carousel ads showcasing customer reviews and a special neighborhood discount."},
            {"title": "Cross-Promotions", "description": "Partner with non-competing neighboring businesses to co-promote each other's offerings."}
        ]
        core_message = f"Your dedicated local partner: {business_name} delivers exceptional, personalized {industry} services designed for community trust and achieving: {goal_str}."
    else:
        channels = ["Social Media Marketing", "Content SEO Strategy", "Search Engine Optimization", "Newsletter Marketing"]
        ideas = [
            {"title": "Educational Article Series", "description": "Publish weekly guides solving common customer problems to build organic search authority."},
            {"title": "Weekly Industry Insights Newsletter", "description": "Send curated industry trends, tips, and company updates to establish thought leadership."},
            {"title": "Live Community Q&A Sessions", "description": "Host live video sessions on social channels answering user questions to build direct connections."}
        ]
        core_message = f"Unlock new potential with {business_name} — leading the way with expert {industry} solutions designed to drive success and achieve: {goal_str}."

    # 2. Distribute budget proportionally (ensuring sum equals budget exactly)
    n_channels = len(channels)
    if n_channels == 0:
        channels = ["General Marketing"]
        n_channels = 1
        
    base_share = budget // n_channels
    remainder = budget % n_channels
    
    budget_breakdown = []
    for i, ch in enumerate(channels):
        val = base_share
        if i == 0:
            val += remainder
        budget_breakdown.append({"name": ch, "value": val})

    return {
        "core_message": core_message,
        "marketing_channels": channels,
        "budget_breakdown": budget_breakdown,
        "content_ideas": ideas
    }

def generate_strategy_content(business_name: str, industry: str, budget: int, goals: list):
    """
    Calls the Groq API (Llama 3) to generate a structured marketing strategy.
    Falls back to a locally generated mock strategy on failure or invalid API keys.
    """
    # Reload env variables dynamically to pick up any manual edits to the .env file
    load_dotenv(override=True)
    
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key or api_key == "YOUR_API_KEY_HERE" or api_key.startswith("your_"):
        return generate_mock_strategy(business_name, industry, budget, goals, "API Key not configured")

    prompt = f"""
    You are an expert marketing advisor. Create a marketing strategy for the following business:
    Business Name: {business_name}
    Industry: {industry}
    Budget: ${budget}
    Goals: {', '.join(goals)}

    You MUST respond with ONLY valid JSON, with exactly this schema:
    {{
        "core_message": "A compelling 1-2 sentence core marketing message",
        "marketing_channels": ["list", "of", "recommended", "channels"],
        "budget_breakdown": [
            {{"name": "Channel Name", "value": integer_amount}}
        ],
        "content_ideas": [
            {{"title": "Idea Title", "description": "Brief description of the content idea"}}
        ]
    }}
    
    Ensure the total of the budget_breakdown values equals exactly {budget}.
    Do NOT wrap the JSON in markdown code blocks, just output the JSON object.
    """
    
    try:
        client = Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
        )
        
        response_text = chat_completion.choices[0].message.content
        strategy_data = json.loads(response_text)
        return strategy_data
    except Exception as e:
        print(f"Error generating strategy with Groq API: {e}")
        # Return fallback mock structure with detail
        reason = "Expired/Invalid API Key"
        if "rate limit" in str(e).lower():
            reason = "API Rate Limit Exceeded"
        return generate_mock_strategy(business_name, industry, budget, goals, reason)

