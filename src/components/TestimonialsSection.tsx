
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarIcon, ArrowRight } from 'lucide-react';

const TestimonialsSection = () => {
  // Featured testimonials for the homepage (subset of all testimonials)
  const featuredTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Content Manager",
      company: "MediaTech Solutions",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "HumanizeAI has completely transformed our content strategy. What used to take hours of manual rewriting now happens in seconds, and the quality is remarkable."
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Marketing Director",
      company: "Global Brands Inc.",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "We've tested HumanizeAI against every major AI detector on the market, and it passes with flying colors every time."
    },
    {
      id: 7,
      name: "Olivia Martinez",
      role: "Student",
      company: "Berkeley University",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150",
      rating: 4,
      content: "HumanizeAI has been a lifesaver for my research papers. It helps me refine AI-assisted drafts into polished academic writing."
    },
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
    <section id="testimonials" className="py-16 bg-gradient-to-b from-background to-background/80">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their content strategy with HumanizeAI.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {featuredTestimonials.map((testimonial) => (
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
        
        <div className="flex justify-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link to="/testimonials" className="flex items-center">
              View All Testimonials <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
