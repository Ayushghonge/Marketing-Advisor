import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const PLATFORM_DATA = {
  googleSearchAds: {
    name: 'Google Search Ads',
    color: '#4285F4',
    tips: [
      'Focus on high-intent transactional search terms to capture buyers actively looking for your service.',
      'Implement responsive search ads with multiple headlines and descriptions to let Google\'s AI optimize performance.',
      'Set up precise conversion tracking, including offline conversions, to feed clean data back into Smart Bidding.',
      'Regularly update negative keyword lists to prevent wasted budget on irrelevant search queries.'
    ],
    campaigns: [
      'Brand Protection Search (Targeting own brand name)',
      'High-Intent Generic Search (Targeting core service keywords)',
      'Competitor Conquesting Campaign (Targeting competitor names)'
    ]
  },
  googleShoppingAds: {
    name: 'Google Shopping Ads',
    color: '#0F9D58',
    tips: [
      'Optimize your Google Merchant Center product feed with clear, descriptive titles and high-quality images.',
      'Use Performance Max (PMax) campaigns to auto-distribute budgets across Shopping, Search, YouTube, and Display.',
      'Segment products by margin or sales volume to allocate higher budget to top-performing items.',
      'Incorporate customer ratings and reviews directly into your merchant feed to improve CTR.'
    ],
    campaigns: [
      'Performance Max - Top Sellers (Focus budget on best-selling products)',
      'Standard Shopping - Long-tail Keywords (Control bids on specific product groups)',
      'Dynamic Remarketing Ads (Target users who viewed specific products)'
    ]
  },
  metaAds: {
    name: 'Meta Ads (Facebook & Instagram)',
    color: '#E1306C',
    tips: [
      'Create engaging, vertical-first video creatives (Reels) that feel organic and native to the platform.',
      'Leverage Advantage+ Shopping Campaigns for automated targeting and creative optimization.',
      'Test multiple hooks in the first 3 seconds of your videos to capture user attention instantly.',
      'Define broad targeting profiles and let Meta\'s pixel and AI self-correct targeting based on conversions.'
    ],
    campaigns: [
      'Reels & Stories Direct Response (Video ads driving store visits/purchases)',
      'Advantage+ Shopping Catalog Sales (Dynamic product ads to past visitors)',
      'Lead Generation Form Ads (Collect emails directly within Facebook/Instagram)'
    ]
  },
  youtubeAds: {
    name: 'YouTube Video Ads',
    color: '#FF0000',
    tips: [
      'Hook viewers within the first 5 seconds before the \'Skip\' button appears.',
      'Use the TrueView for Action format to add clear, clickable CTA overlays to your video player.',
      'Produce content tailored to specific audience intents (e.g., tutorials, unboxing, product comparison).',
      'Set frequency capping to avoid fatiguing users with the same ad repeatedly.'
    ],
    campaigns: [
      'In-Stream Skippable Action Campaign (Direct conversion-focused video ads)',
      'Bumper Ads (6-second unskippable ads for high-frequency brand awareness)',
      'In-Feed Video Discovery (Promote tutorials/reviews on search pages)'
    ]
  },
  linkedinAds: {
    name: 'LinkedIn Marketing',
    color: '#0077B5',
    tips: [
      'Produce high-value, thought-leadership text posts and document sliders (PDFs) that educate your industry.',
      'Run target account-based marketing (ABM) campaigns by uploading list of decision-maker company domains.',
      'Keep lead gen forms simple—use auto-filled fields from LinkedIn profiles to maximize completion rates.',
      'Engage actively with industry comments to build brand trust and drive organic page growth.'
    ],
    campaigns: [
      'Lead Gen Form Ads targeting C-Suite decision-makers',
      'Thought Leadership Sponsored Posts (Promoting executive-written articles)',
      'InMail/Sponsored Messaging Conversational Flow'
    ]
  },
  seo: {
    name: 'SEO & Content Strategy',
    color: '#10B981',
    tips: [
      'Perform thorough keyword research targeting long-tail, low-difficulty questions relevant to your customers.',
      'Structure posts using proper heading hierarchy (H1, H2, H3) and write detailed, comprehensive answers.',
      'Improve page speed and mobile responsiveness to satisfy Google\'s Core Web Vitals requirements.',
      'Build high-quality backlinks through guest blogging, industry partnerships, and resource page placements.'
    ],
    campaigns: [
      'Pillar-Cluster Keyword Strategy (Write core pages and related sub-articles)',
      'On-page Optimization Sprint (Optimize metadata, headings, and internal links)',
      'Technical SEO Audit & Speed Boost'
    ]
  },
  emailMarketing: {
    name: 'Email Marketing & Automation',
    color: '#F59E0B',
    tips: [
      'Set up automated flows for key milestones (welcome series, abandoned cart, post-purchase feedback).',
      'Segment your subscribers by behavior (e.g. active openers, cold leads, high spenders) for personalized content.',
      'A/B test email subject lines and send times to optimize open rates and click-through rates.',
      'Ensure mobile-friendly email templates with large, easily-tappable buttons.'
    ],
    campaigns: [
      'Automated Welcome Series (3-part nurture sequence for new subscribers)',
      'Abandoned Cart & Checkout Recovery Automation',
      'Weekly Educational Newsletter (Sharing industry tips and product updates)'
    ]
  },
  influencerMarketing: {
    name: 'Influencer Marketing',
    color: '#8B5CF6',
    tips: [
      'Prioritize engagement rate and audience demographics over simple follower count.',
      'Provide influencers with a clear creative brief but allow them to use their own voice and format.',
      'Assign unique discount codes and UTM links to track the performance of each creator.',
      'Build long-term relationships with top-performing creators instead of one-off sponsorships.'
    ],
    campaigns: [
      'Micro-Influencer Product Seeding (Send free products in exchange for honest video reviews)',
      'Sponsored YouTube Video Integrations (30-60 second ad read by creators)',
      'Co-branded Social Media Giveaway Campaign'
    ]
  },
  localSEO: {
    name: 'Local SEO & Google Maps',
    color: '#EC4899',
    tips: [
      'Claim and fully optimize your Google Business Profile with correct hours, address, and photos.',
      'Implement a systematic review collection process to encourage happy customers to leave 5-star ratings.',
      'Ensure NAP consistency (Name, Address, Phone) across all local directories and business citations.',
      'Publish regular updates, promotions, and product offers directly to your Google Business feed.'
    ],
    campaigns: [
      'Local Review Acquisition Drive (Email & SMS campaigns to past clients)',
      'Local Citations Building (Listing on Yelp, YellowPages, TripAdvisor, etc.)',
      'Hyper-local Community Target Campaign'
    ]
  },
  communityMarketing: {
    name: 'Community & Local Marketing',
    color: '#06B6D4',
    tips: [
      'Sponsor local events, sports teams, or charity drives that align with your brand values and audience.',
      'Participate in local business associations and networking groups to build referral relationships.',
      'Create co-marketing bundles with non-competing local businesses to share client bases.',
      'Use physical signage, banners, and branded merchandise to establish visual authority in the area.'
    ],
    campaigns: [
      'Local Event Sponsorship Activation (Booths, banners, and flyers)',
      'Cross-Promotion Partnership (Shared discount flyers or joint loyalty packages)',
      'Neighborhood Discount Coupon Distribution'
    ]
  },
  referralMarketing: {
    name: 'Customer Referral Program',
    color: '#10B981',
    tips: [
      'Offer compelling incentives to both the referrer and the referee (e.g. \'Give $10, Get $10\').',
      'Make it extremely easy to share referral links via text, email, and social media apps.',
      'Promote your referral program at high-satisfaction touchpoints (e.g., right after a positive review or purchase).',
      'Gamify the system with milestones (e.g., refer 5 friends, get a free product/bonus).'
    ],
    campaigns: [
      'Two-sided Reward Launch (Incentivize both parties)',
      'Customer Advocacy Campaign (Targeting your top 10% most active customers)',
      'Milestone Referral Rewards Sprint'
    ]
  },
  socialMediaMarketing: {
    name: 'Social Media Marketing',
    color: '#3B82F6',
    tips: [
      'Consistency is key: maintain a regular posting schedule across selected channels.',
      'Prioritize native video formats (Reels, TikToks, Shorts) to take advantage of algorithmic distribution.',
      'Actively respond to comments, direct messages, and brand mentions to build community trust.',
      'Repurpose top-performing content into different formats (e.g., turning a blog post into a thread or graphic).'
    ],
    campaigns: [
      'Weekly Educational Content Calendar (Creating value-first tips and guides)',
      'Interactive Audience Polls & Q&As (Using Story stickers and live video)',
      'Behind-the-Scenes & Team Spotlight series'
    ]
  }
};

function getPlatformInfo(name) {
  if (!name) return {
    name: 'Marketing Strategy',
    color: 'var(--accent-primary)',
    tips: ['Optimize conversion funnels.', 'Test messaging & copywriting.', 'Establish clear marketing goals.'],
    campaigns: ['Core Awareness Campaign', 'Conversion Nurturing Run']
  };

  const normalized = name.toLowerCase();
  
  if (normalized.includes('google search') || normalized.includes('google ads') || normalized.includes('google advertising') || normalized.includes('search network') || normalized.includes('ppc')) {
    return PLATFORM_DATA.googleSearchAds;
  }
  if (normalized.includes('shopping ads') || normalized.includes('google shopping') || normalized.includes('e-commerce ads')) {
    return PLATFORM_DATA.googleShoppingAds;
  }
  if (normalized.includes('instagram') || normalized.includes('meta ads') || normalized.includes('facebook') || normalized.includes('social ads')) {
    return PLATFORM_DATA.metaAds;
  }
  if (normalized.includes('youtube') || normalized.includes('video ads') || normalized.includes('video marketing')) {
    return PLATFORM_DATA.youtubeAds;
  }
  if (normalized.includes('linkedin')) {
    return PLATFORM_DATA.linkedinAds;
  }
  if (normalized.includes('influencer') || normalized.includes('sponsored dedicated')) {
    return PLATFORM_DATA.influencerMarketing;
  }
  if (normalized.includes('local seo') || normalized.includes('google maps') || normalized.includes('google business') || normalized.includes('local search')) {
    return PLATFORM_DATA.localSEO;
  }
  if (normalized.includes('seo') || normalized.includes('search engine optimization') || normalized.includes('blog') || normalized.includes('organic search')) {
    return PLATFORM_DATA.seo;
  }
  if (normalized.includes('email') || normalized.includes('newsletter') || normalized.includes('nurturing') || normalized.includes('flow') || normalized.includes('drip')) {
    return PLATFORM_DATA.emailMarketing;
  }
  if (normalized.includes('referral') || normalized.includes('customer referral') || normalized.includes('advocacy')) {
    return PLATFORM_DATA.referralMarketing;
  }
  if (normalized.includes('sponsorship') || normalized.includes('community') || normalized.includes('event')) {
    return PLATFORM_DATA.communityMarketing;
  }
  if (normalized.includes('social media marketing') || normalized.includes('social media content') || normalized.includes('social media posting')) {
    return PLATFORM_DATA.socialMediaMarketing;
  }

  // High quality dynamic fallback for any other custom platform/channel name
  const displayName = name
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    name: displayName,
    color: '#8b5cf6', // default accent color
    tips: [
      `Define clear, measurable KPIs and tracking parameters for your ${displayName} initiatives.`,
      `Tailor your messaging and value proposition to the specific audience demographics of this channel.`,
      `Continuously run A/B split tests on your ad copy, creative layouts, and landing page elements.`,
      `Monitor user conversion paths and reallocate budget to the highest-performing ad sets or targeting segments.`
    ],
    campaigns: [
      `Brand Awareness Campaign (Introduce your brand message to new audiences)`,
      `Lead Generation Sequence (Offer valuable lead magnets or direct consultations)`,
      `Customer Nurture Campaign (Re-engage site visitors and build brand loyalty)`
    ]
  };
}

export default function PlatformPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('latest_strategy');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!data) return null;

  const platformInfo = getPlatformInfo(name);

  const budgetAllocation = data.strategy.budget_breakdown.find(
    b => b.name.toLowerCase().includes(name.toLowerCase()) || 
         (name === 'influencers' && b.name.toLowerCase().includes('influencer'))
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <button 
        onClick={() => navigate('/dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '1rem' }}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0, color: platformInfo.color }}>
            {platformInfo.name} Strategy
          </h1>
          {budgetAllocation && (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: '8px', border: `1px solid ${platformInfo.color}40` }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Allocated Budget</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: platformInfo.color }}>
                ₹{budgetAllocation.value.toLocaleString('en-IN')}
              </div>
            </div>
          )}
        </div>

        <div className="grid-2">
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Best Practices</h2>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {platformInfo.tips.map((tip, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <CheckCircle2 color={platformInfo.color} size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '1.1rem', lineHeight: 1.5 }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Example Campaigns</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {platformInfo.campaigns.map((camp, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '16px', borderLeft: `4px solid ${platformInfo.color}` }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{camp}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
