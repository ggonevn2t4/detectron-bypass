
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';

const Testimonials = () => {
  const testimonialsList = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Content Manager",
      company: "MediaTech Solutions",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "HumanizeAI has completely transformed our content strategy. What used to take hours of manual rewriting now happens in seconds, and the quality is remarkable. None of our content has ever been flagged as AI-generated since we started using this tool."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Academic Researcher",
      company: "Stanford University",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "As a researcher, I use AI tools for initial drafts but was concerned about my papers being flagged by university detection systems. HumanizeAI has solved this problem completely. The text maintains all my key points while reading naturally."
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Marketing Director",
      company: "Global Brands Inc.",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "We've tested HumanizeAI against every major AI detector on the market, and it passes with flying colors every time. This has given our team the confidence to scale our content production without sacrificing quality or authenticity."
    },
    {
      id: 4,
      name: "David Rodriguez",
      role: "SEO Specialist",
      company: "Digital Growth Partners",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=150&h=150",
      rating: 4,
      content: "The content HumanizeAI produces not only bypasses detection but also performs exceptionally well in search rankings. We've seen a 35% increase in organic traffic since implementing this tool in our content workflow."
    },
    {
      id: 5,
      name: "Jessica Wong",
      role: "Freelance Writer",
      company: "Self-employed",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "As a freelancer, HumanizeAI has doubled my productivity without compromising my reputation. My clients are thrilled with the quality, and I can take on more projects than ever before. The monthly subscription pays for itself many times over."
    },
    {
      id: 6,
      name: "Thomas Müller",
      role: "Chief Content Officer",
      company: "European Media Group",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "We've implemented HumanizeAI across our entire content team of 50+ writers. The consistency in quality and the time savings have been remarkable. Our publication maintains its reputation for quality while significantly increasing output."
    },
    {
      id: 7,
      name: "Olivia Martinez",
      role: "Student",
      company: "Berkeley University",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150",
      rating: 4,
      content: "HumanizeAI has been a lifesaver for my research papers. It helps me refine AI-assisted drafts into polished academic writing that maintains my voice and passes all university checks. Highly recommended for fellow students."
    },
    {
      id: 8,
      name: "Robert Kim",
      role: "E-commerce Owner",
      company: "StyleMart Online",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "We use HumanizeAI for all our product descriptions and blog content. The quality is consistently excellent, and we've seen a 28% increase in conversion rates since implementing more human-like content across our site."
    }
  ];

  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <StarIcon 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 px-6">
          <Container className="max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">What Our <span className="text-primary">Clients</span> Say</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover how HumanizeAI has transformed content creation for professionals, students, and businesses worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {testimonialsList.map((testimonial) => (
                <Card key={testimonial.id} className="border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="h-12 w-12 border border-border">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                        <RatingStars rating={testimonial.rating} />
                      </div>
                    </div>
                    <p className="text-muted-foreground">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-semibold mb-4">Ready to experience the HumanizeAI difference?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied users who have transformed their content strategy with HumanizeAI.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/#humanizer-tool" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors">
                  Try HumanizeAI Now
                </a>
                <a href="/#pricing" className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-6 py-3 rounded-md font-medium transition-colors">
                  View Pricing Plans
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;
