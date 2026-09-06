import { create } from 'zustand'

export const useCategoryStore = create((set) => ({
  categories: [
    { id: 1, name: 'App', slug: 'app', description: 'Mobile app tasks' },
    { id: 2, name: 'Instagram', slug: 'instagram', description: 'Instagram engagement' },
    { id: 3, name: 'Telegram', slug: 'telegram', description: 'Telegram group/channel tasks' },
    { id: 4, name: 'TikTok', slug: 'tiktok', description: 'TikTok engagement' },
    { id: 5, name: 'Twitter/X', slug: 'twitter', description: 'Twitter/X tasks' },
    { id: 6, name: 'YouTube', slug: 'youtube', description: 'YouTube subscription & views' },
    { id: 7, name: 'Website', slug: 'website', description: 'Website signup and engagement' },
    { id: 8, name: 'WhatsApp', slug: 'whatsapp', description: 'WhatsApp group tasks' },
    { id: 9, name: 'Google & Reviews', slug: 'google-reviews', description: 'Google Maps & App Store reviews' },
    { id: 10, name: 'Surveys & Feedback', slug: 'surveys', description: 'Market research & feedback' },
    { id: 11, name: 'Your Choice (1-4)', slug: 'custom-choice', description: 'Custom multi-task jobs' },
  ],
  
  subcategories: {
    app: [
      { id: 1, name: 'App Download and Simple Sign Up', basePrice: 500 },
      { id: 2, name: 'App Download and 5-Star Review', basePrice: 750 },
      { id: 3, name: 'App Registration with Verification (KYC)', basePrice: 1000 },
    ],
    instagram: [
      { id: 4, name: 'Follow Instagram Page', basePrice: 150 },
      { id: 5, name: 'Like and Comment on Post', basePrice: 200 },
      { id: 6, name: 'Reel Engagement / Share', basePrice: 250 },
    ],
    telegram: [
      { id: 7, name: 'Join Telegram Group', basePrice: 100 },
      { id: 8, name: 'Join Telegram Channel', basePrice: 150 },
    ],
    tiktok: [
      { id: 9, name: 'Follow TikTok Account', basePrice: 200 },
      { id: 10, name: 'Like Video', basePrice: 150 },
      { id: 11, name: 'Comment and Share Video', basePrice: 250 },
    ],
    twitter: [
      { id: 12, name: 'Follow Twitter Account', basePrice: 100 },
      { id: 13, name: 'Retweet and Like Post', basePrice: 150 },
    ],
    youtube: [
      { id: 14, name: 'Subscribe to YouTube Channel', basePrice: 200 },
      { id: 15, name: 'Watch Video (Specific Time)', basePrice: 300 },
    ],
    website: [
      { id: 16, name: 'Website Simple Signup', basePrice: 300 },
      { id: 17, name: 'Website Complex Signup', basePrice: 500 },
      { id: 18, name: 'Website Visit and Click Engagement', basePrice: 250 },
    ],
    whatsapp: [
      { id: 19, name: 'Join WhatsApp Group', basePrice: 100 },
    ],
    'google-reviews': [
      { id: 20, name: 'Google Maps / Business Review', basePrice: 400 },
      { id: 21, name: 'App Store / Play Store Review', basePrice: 350 },
    ],
    surveys: [
      { id: 22, name: 'Paid Market Research Polls', basePrice: 200 },
      { id: 23, name: 'Product and Website Feedback', basePrice: 250 },
      { id: 24, name: 'Short Questionnaire Answers', basePrice: 150 },
    ],
    'custom-choice': [
      { id: 25, name: 'Put 1 Task of Your Choice', basePrice: 500 },
      { id: 26, name: 'Put 2 Tasks of Your Choice', basePrice: 800 },
      { id: 27, name: 'Put 3 Tasks of Your Choice', basePrice: 1100 },
      { id: 28, name: 'Put 4 Tasks of Your Choice', basePrice: 1400 },
    ],
  },

  appDataSizeTiers: [
    { size: 'Less than 50 MB', surcharge: 0 },
    { size: '50 MB', surcharge: 50 },
    { size: '60 MB', surcharge: 100 },
    { size: '70 MB', surcharge: 150 },
    { size: '100 MB', surcharge: 250 },
    { size: '200 MB Above', surcharge: 500 },
  ],

  getSubcategories: (categorySlug) => {
    const state = useCategoryStore.getState()
    return state.subcategories[categorySlug] || []
  },

  getCategory: (slug) => {
    const state = useCategoryStore.getState()
    return state.categories.find(c => c.slug === slug)
  },
}))