import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface JobSearchRequest {
  platforms: string[];
  keywords?: string;
  location?: string;
  industry?: string;
  companySize?: string;
}

interface JobListing {
  id: string;
  companyName: string;
  title: string;
  location: string;
  platform: string;
  url: string;
  postedDate: string;
  description: string;
  requirements?: string;
  salaryRange?: string;
  employmentType?: string;
  companyInfo?: {
    industry?: string;
    size?: string;
    website?: string;
    description?: string;
  };
  contacts?: {
    name?: string;
    title?: string;
    linkedin?: string;
    email?: string;
  }[];
}

interface ScrapingResult {
  success: boolean;
  jobs: JobListing[];
  totalFound: number;
  platform: string;
  error?: string;
}

// Mock data for demonstration - in production, this would scrape real platforms
const generateMockJobs = (platform: string, keywords: string = "", location: string = ""): JobListing[] => {
  const companies = [
    {
      name: "TechCorp Solutions",
      industry: "Technology",
      size: "51-200 employees",
      website: "https://techcorp.com",
      description: "Leading software development company"
    },
    {
      name: "FinanceFlow Inc",
      industry: "Finance", 
      size: "201-1000 employees",
      website: "https://financeflow.com",
      description: "Innovative fintech company"
    },
    {
      name: "HealthTech Innovations",
      industry: "Healthcare",
      size: "11-50 employees", 
      website: "https://healthtech.com",
      description: "Medical technology solutions"
    },
    {
      name: "RetailMax Group",
      industry: "Retail",
      size: "1001-5000 employees",
      website: "https://retailmax.com", 
      description: "E-commerce and retail solutions"
    },
    {
      name: "EduLearn Platform",
      industry: "Education",
      size: "51-200 employees",
      website: "https://edulearn.com",
      description: "Online education platform"
    }
  ];

  const jobTitles = [
    "Software Engineer",
    "Product Manager", 
    "Data Analyst",
    "Marketing Manager",
    "Sales Representative",
    "DevOps Engineer",
    "UX Designer",
    "Business Analyst",
    "Project Manager",
    "Customer Success Manager"
  ];

  const locations = location ? [location] : [
    "Buenos Aires, Argentina",
    "São Paulo, Brazil", 
    "Mexico City, Mexico",
    "Bogotá, Colombia",
    "Lima, Peru",
    "Santiago, Chile",
    "Montevideo, Uruguay",
    "Remote"
  ];

  const jobs: JobListing[] = [];
  const jobCount = Math.floor(Math.random() * 8) + 3; // 3-10 jobs per platform

  for (let i = 0; i < jobCount; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const jobLocation = locations[Math.floor(Math.random() * locations.length)];
    
    const job: JobListing = {
      id: `${platform}_${Date.now()}_${i}`,
      companyName: company.name,
      title: title,
      location: jobLocation,
      platform: platform,
      url: `https://${platform}.com/jobs/${Math.random().toString(36).substr(2, 9)}`,
      postedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: `We are looking for a talented ${title} to join our ${company.industry.toLowerCase()} team. This is an excellent opportunity to work with cutting-edge technology and make a real impact.`,
      requirements: `• Bachelor's degree in relevant field\n• 3+ years of experience\n• Strong communication skills\n• Experience with modern tools and technologies`,
      salaryRange: `$${Math.floor(Math.random() * 50 + 50)}k - $${Math.floor(Math.random() * 50 + 100)}k USD`,
      employmentType: Math.random() > 0.3 ? "Full-time" : "Contract",
      companyInfo: company,
      contacts: [
        {
          name: `${["Ana", "Carlos", "Maria", "Diego", "Sofia"][Math.floor(Math.random() * 5)]} ${["Rodriguez", "Silva", "Garcia", "Martinez", "Lopez"][Math.floor(Math.random() * 5)]}`,
          title: ["HR Manager", "Talent Acquisition", "Hiring Manager", "Team Lead"][Math.floor(Math.random() * 4)],
          linkedin: `https://linkedin.com/in/${Math.random().toString(36).substr(2, 9)}`,
          email: `hiring@${company.name.toLowerCase().replace(/\s+/g, '')}.com`
        }
      ]
    };

    jobs.push(job);
  }

  return jobs;
};

const scrapeLinkedIn = async (request: JobSearchRequest): Promise<ScrapingResult> => {
  try {
    // In production, this would use LinkedIn's API or web scraping
    // For now, we'll return mock data that simulates real LinkedIn results
    const jobs = generateMockJobs("linkedin", request.keywords, request.location);
    
    return {
      success: true,
      jobs: jobs,
      totalFound: jobs.length,
      platform: "linkedin"
    };
  } catch (error) {
    return {
      success: false,
      jobs: [],
      totalFound: 0,
      platform: "linkedin",
      error: error.message
    };
  }
};

const scrapeComputrabajo = async (request: JobSearchRequest): Promise<ScrapingResult> => {
  try {
    // In production, this would scrape Computrabajo
    const jobs = generateMockJobs("computrabajo", request.keywords, request.location);
    
    return {
      success: true,
      jobs: jobs,
      totalFound: jobs.length,
      platform: "computrabajo"
    };
  } catch (error) {
    return {
      success: false,
      jobs: [],
      totalFound: 0,
      platform: "computrabajo", 
      error: error.message
    };
  }
};

const scrapeBumeran = async (request: JobSearchRequest): Promise<ScrapingResult> => {
  try {
    // In production, this would scrape Bumeran
    const jobs = generateMockJobs("bumeran", request.keywords, request.location);
    
    return {
      success: true,
      jobs: jobs,
      totalFound: jobs.length,
      platform: "bumeran"
    };
  } catch (error) {
    return {
      success: false,
      jobs: [],
      totalFound: 0,
      platform: "bumeran",
      error: error.message
    };
  }
};

const scrapeZonaJobs = async (request: JobSearchRequest): Promise<ScrapingResult> => {
  try {
    // In production, this would scrape ZonaJobs
    const jobs = generateMockJobs("zonajobs", request.keywords, request.location);
    
    return {
      success: true,
      jobs: jobs,
      totalFound: jobs.length,
      platform: "zonajobs"
    };
  } catch (error) {
    return {
      success: false,
      jobs: [],
      totalFound: 0,
      platform: "zonajobs",
      error: error.message
    };
  }
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const body = await req.json() as JobSearchRequest;
    
    if (!body.platforms || body.platforms.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'At least one platform must be specified' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const results: ScrapingResult[] = [];
    
    // Scrape each requested platform
    for (const platform of body.platforms) {
      let result: ScrapingResult;
      
      switch (platform.toLowerCase()) {
        case 'linkedin':
          result = await scrapeLinkedIn(body);
          break;
        case 'computrabajo':
          result = await scrapeComputrabajo(body);
          break;
        case 'bumeran':
          result = await scrapeBumeran(body);
          break;
        case 'zonajobs':
          result = await scrapeZonaJobs(body);
          break;
        default:
          result = {
            success: false,
            jobs: [],
            totalFound: 0,
            platform: platform,
            error: `Platform ${platform} not supported`
          };
      }
      
      results.push(result);
    }

    // Combine all results
    const allJobs = results.flatMap(r => r.jobs);
    const totalFound = results.reduce((sum, r) => sum + r.totalFound, 0);
    const errors = results.filter(r => !r.success).map(r => r.error);

    return new Response(JSON.stringify({
      success: errors.length === 0,
      totalJobs: allJobs.length,
      totalFound: totalFound,
      jobs: allJobs,
      results: results,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Job scraping error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});