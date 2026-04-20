
import { Scenario, ScenarioType, MarketingVideo, Branch, ComparisonLink } from './types';

// Estimated average furnishing cost per unit (Average of Studio ~30k and 3BR ~70k)
export const FURNISHING_COST_PER_UNIT = 50000;

export const SCENARIOS: Scenario[] = [
  {
    id: 'study_m55',
    type: ScenarioType.SHORT_TERM,
    name: 'Marsam - M55',
    color: '#4A2C5A', // Purple theme
    description: 'Portfolio of 3 premium units (M55-1, M55-2, M55-3) within the Marsam Al Madinah complex operating on Short Term Rental model.',
    
    financials: {
        worst: {
            revenue: 282888, 
            mabaatShare: 56578, // 20%
            netIncome: 226310, 
            roi: 0
        },
        base: {
            revenue: 282888, 
            mabaatShare: 56578, 
            netIncome: 226310, 
            roi: 0
        },
        best: {
            revenue: 282888, 
            mabaatShare: 56578, 
            netIncome: 226310, 
            roi: 0
        }
    },

    propertyValue: 0, 
    
    unitCount: 3,
    unitLabel: 'Units',
    occupancyDurationLabel: '365 Available Nights',
    
    unitMix: [
        { 
            name: 'M55-1: 2BR', 
            count: 1, 
            avgPrice: 97230,
            priceRange: { 
                min: 97230,
                avg: 97230,
                max: 97230
            }, 
        },
        { 
            name: 'M55-2: 3BR', 
            count: 1, 
            avgPrice: 115750,
            priceRange: { 
                min: 115750,
                avg: 115750,
                max: 115750
            }, 
        },
        { 
            name: 'M55-3: Studio', 
            count: 1, 
            avgPrice: 69450,
            priceRange: { 
                min: 69450,
                avg: 69450,
                max: 69450
            }, 
        }
    ],
  }
];

export const MARKETING_VIDEOS: MarketingVideo[] = [
    {
        id: 'v1',
        title: 'M55 Project Overview',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://drive.google.com/file/d/1u6i_7MN74iogQP0qwdS9o2GYOHtWTZA4/view?usp=sharing',
    },
    {
        id: 'v2',
        title: 'M55 Unit Interiors',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://drive.google.com/file/d/1dO3W-8IX8JultVN768H1hyxVVmxC4F2I/view?usp=sharing',
    }
];

export const COMPARISON_LINKS: Record<string, ComparisonLink[]> = {
  study_m55: []
};

export const MABAAT_SHARE_PERCENTAGE = 0.20;
export const OTA_FEE_PERCENTAGE = 0.155;
export const VAT_PERCENTAGE = 0.15;
export const BRANCHES: Branch[] = [];
