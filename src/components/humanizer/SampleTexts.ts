
export interface SampleText {
  id: string;
  title: string;
  category: 'academic' | 'business' | 'creative' | 'technical' | 'news' | 'social' | 'personal';
  content: string;
  length: 'short' | 'medium' | 'long';
}

export const sampleTexts: SampleText[] = [
  // Academic category
  {
    id: 'academic-1',
    title: 'Artificial Intelligence Overview',
    category: 'academic',
    content: `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.`,
    length: 'short'
  },
  {
    id: 'academic-2',
    title: 'Climate Change Research',
    category: 'academic',
    content: `The global climate crisis represents one of the most significant challenges facing humanity today. Rising temperatures, extreme weather events, and sea level rise are all consequences of human-induced climate change. Immediate action is required to mitigate these effects and transition to a sustainable future.`,
    length: 'short'
  },
  {
    id: 'academic-3',
    title: 'Quantum Computing Advances',
    category: 'academic',
    content: `Recent advances in quantum computing have revolutionized the field of computational science. Quantum computers leverage quantum mechanical phenomena to perform calculations at speeds unattainable by classical computers. This technology holds promise for solving complex problems in cryptography, material science, and drug discovery.`,
    length: 'short'
  },
  {
    id: 'academic-4',
    title: 'Neuroplasticity Research',
    category: 'academic',
    content: `Neuroplasticity, the brain's ability to reorganize itself by forming new neural connections, continues to fascinate neuroscientists worldwide. This remarkable capability allows the brain to compensate for injury and disease and to adjust activities in response to new situations or changes in the environment. Recent research has demonstrated that the brain possesses far greater neuroplasticity than previously believed, even into adulthood and old age. This finding challenges long-held assumptions about the fixed nature of the adult brain and opens exciting possibilities for rehabilitation approaches and therapeutic interventions for neurological conditions.`,
    length: 'medium'
  },
  
  // Business category
  {
    id: 'business-1',
    title: 'Digital Marketing Strategy',
    category: 'business',
    content: `Digital marketing has become a cornerstone of modern business strategy. By leveraging digital channels such as social media, content marketing, and search engine optimization, businesses can reach their target audience cost-effectively. Successful campaigns combine data analytics with compelling storytelling to create valuable content and drive customer engagement.`,
    length: 'short'
  },
  {
    id: 'business-2',
    title: 'Remote Work Transformation',
    category: 'business',
    content: `The rapid transition to remote work has fundamentally transformed how businesses operate. Organizations that successfully navigate this shift implement clear communication protocols, leverage collaborative technologies, and adapt their management approaches to foster productivity and employee wellbeing in distributed teams. This evolution represents not merely a temporary adjustment but a permanent redefinition of workplace dynamics.`,
    length: 'medium'
  },
  {
    id: 'business-3',
    title: 'Supply Chain Resilience',
    category: 'business',
    content: `Building resilient supply chains has become a strategic imperative for businesses worldwide. Recent global disruptions have exposed vulnerabilities in just-in-time manufacturing and single-source supplier models. Forward-thinking companies are now implementing diversified supplier networks, strategic inventory buffers, and advanced predictive analytics to anticipate and mitigate potential disruptions before they impact operations and customer satisfaction.`,
    length: 'medium'
  },
  
  // Creative category
  {
    id: 'creative-1',
    title: 'Short Story Opening',
    category: 'creative',
    content: `The old clock on the mantle struck midnight as Sarah finally closed her laptop. The house was quiet—too quiet. A floorboard creaked upstairs, though she knew she was alone. Or at least, she was supposed to be. The familiar weight of uncertainty settled in her stomach as she reached for her phone.`,
    length: 'short'
  },
  {
    id: 'creative-2',
    title: 'Poetic Description',
    category: 'creative',
    content: `Autumn leaves dance in the crisp morning air,
A symphony of red and gold against the pale blue sky.
Time stands still in this perfect moment,
As nature performs its annual farewell.`,
    length: 'short'
  },
  {
    id: 'creative-3',
    title: 'Character Sketch',
    category: 'creative',
    content: `Mrs. Eleanor Jenkins moved through the world as if it owed her something, chin tilted slightly upward, spine rigid as a fence post. Her silver hair remained perfectly coiffed regardless of weather, and her pearl earrings clinked softly when she delivered her particularly cutting observations about the neighbors. But behind her fortress of propriety, behind those sharp eyes that missed nothing, there lived a woman who once danced barefoot in summer rainstorms and who still, at seventy-eight, kept a secret box of chocolate truffles in her nightstand drawer.`,
    length: 'medium'
  },
  
  // Technical category
  {
    id: 'technical-1',
    title: 'API Documentation',
    category: 'technical',
    content: `The RESTful API accepts GET, POST, PUT, and DELETE requests to manipulate resources. Authentication is handled via OAuth 2.0 with JWT tokens passed in the Authorization header. All responses are delivered in JSON format with appropriate HTTP status codes indicating the result of operations. Rate limiting is implemented with a default of 100 requests per minute per API key.`,
    length: 'short'
  },
  {
    id: 'technical-2',
    title: 'System Architecture Overview',
    category: 'technical',
    content: `The distributed system architecture implements a microservices approach with containerized applications orchestrated through Kubernetes. Service-to-service communication occurs through a combination of synchronous REST APIs and asynchronous messaging via Kafka. Data persistence is handled through a polyglot approach, with transactional data in PostgreSQL and time-series metrics in InfluxDB. The entire infrastructure is provisioned through Infrastructure as Code using Terraform with automated CI/CD pipelines for continuous deployment.`,
    length: 'medium'
  },
  {
    id: 'technical-3',
    title: 'Algorithm Explanation',
    category: 'technical',
    content: `The improved sorting algorithm achieves O(n log n) time complexity by implementing a hybrid approach that combines quicksort for large partitions and insertion sort for partitions below a certain threshold. This optimization leverages insertion sort's efficiency for nearly-sorted small arrays while maintaining quicksort's overall performance characteristics for larger datasets. Additionally, the median-of-three pivot selection strategy mitigates the worst-case scenario of already-sorted input arrays, ensuring consistent performance across various data distributions.`,
    length: 'medium'
  },
  
  // News category
  {
    id: 'news-1',
    title: 'Technology Breakthrough',
    category: 'news',
    content: `Scientists at the National Research Laboratory have announced a breakthrough in battery technology that could potentially triple the capacity of lithium-ion batteries while reducing charging time by 80%. This development, published yesterday in the journal Nature Energy, represents a significant step toward addressing one of the major limitations in electric vehicle adoption and renewable energy storage.`,
    length: 'short'
  },
  {
    id: 'news-2',
    title: 'Market Report',
    category: 'news',
    content: `Global markets rallied today following the central bank's unexpected decision to maintain current interest rates. The S&P 500 climbed 1.7%, while European indices saw gains averaging 2.1%. Analysts suggest this positive reaction reflects investor relief that monetary tightening may be reaching its peak, though concerns about persistent inflation remain. Tech stocks led the surge, with semiconductor companies posting particularly strong performances amid continued optimism about AI-related demand.`,
    length: 'medium'
  },
  {
    id: 'news-3',
    title: 'Environmental Initiative',
    category: 'news',
    content: `The city council unanimously approved an ambitious climate action plan yesterday that aims to reduce carbon emissions by 50% by 2030 and achieve carbon neutrality by 2045. The comprehensive strategy includes transitioning the municipal vehicle fleet to electric vehicles, implementing strict energy efficiency standards for new buildings, expanding public transportation, and increasing urban green spaces. The initiative was developed through extensive public consultation and represents a significant acceleration of previous environmental commitments.`,
    length: 'medium'
  },
  
  // Social media category
  {
    id: 'social-1',
    title: 'Travel Experience Post',
    category: 'social',
    content: `Just spent the most amazing weekend exploring the hidden beaches of Costa Rica! 🌴 The locals showed us this secluded spot where we saw sea turtles hatching—absolutely magical moment I'll never forget! Has anyone else visited the Nicoya Peninsula? Would love recommendations for my next trip! #TravelGoals #CostaRicaAdventures #BucketList`,
    length: 'short'
  },
  {
    id: 'social-2',
    title: 'Product Review',
    category: 'social',
    content: `Finally tried that new noise-canceling headphones everyone's been raving about, and wow—believe the hype! Crystal clear audio, the noise cancellation is next-level (completely blocked out the construction next door), and I got through a 6-hour flight with battery to spare. Bit pricey but totally worth the investment if you work in noisy environments or travel frequently. Comfortable enough to wear all day too! ⭐⭐⭐⭐⭐`,
    length: 'short'
  },
  {
    id: 'social-3',
    title: 'Recipe Share',
    category: 'social',
    content: `Made grandma's secret lasagna recipe for the family gathering yesterday and it was a HUGE hit! The key is definitely in letting the sauce simmer for at least 3 hours and using three different kinds of cheese. Pro tip: add a tiny bit of nutmeg to the béchamel for that extra special something. Even my picky nephew asked for seconds! DM me if you want the recipe—it's too good not to share! 🍝 #HomeCooking #FamilyRecipes #ItalianFood`,
    length: 'medium'
  },
  
  // Personal writing category
  {
    id: 'personal-1',
    title: 'Journal Entry',
    category: 'personal',
    content: `Today marks six months since I started meditation, and I'm finally beginning to notice subtle changes. The constant mental chatter hasn't disappeared, but there's a new space between my thoughts—a moment of choice before reacting. Yesterday, when the project deadline changed unexpectedly, I observed my familiar surge of anxiety without being consumed by it. Small victory, but significant progress from where I started.`,
    length: 'short'
  },
  {
    id: 'personal-2',
    title: 'Reflection on Change',
    category: 'personal',
    content: `Moving to a new city has been both more challenging and more rewarding than I anticipated. The initial loneliness was overwhelming—eating dinner alone, navigating unfamiliar streets, missing the comfortable predictability of my old routines. But gradually, this unfamiliar place is becoming home. The barista at the corner café now knows my order, I've found a favorite reading spot in the park, and last weekend, someone I now call a friend invited me to dinner. Perhaps there's a certain freedom in reinvention, in being temporarily unknown.`,
    length: 'medium'
  },
  {
    id: 'personal-3',
    title: 'Goal Setting',
    category: 'personal',
    content: `As I plan for the coming year, I'm approaching goals differently. Rather than focusing solely on outcomes—run a half marathon, get the promotion, save X amount—I'm defining the daily practices that align with the person I want to become. Consistently making time for movement, regardless of distance or intensity. Developing skills that contribute value to my team. Making conscious spending decisions that reflect my priorities. The measurable achievements matter less than the gradual evolution of habits and identity.`,
    length: 'medium'
  }
];
