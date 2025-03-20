
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqItems = [
    {
      question: "What is HumanizeAI?",
      answer: "HumanizeAI is a platform that transforms AI-generated content into human-like text that bypasses AI detectors. Our technology preserves the original meaning while making the content appear as if it was written by a human."
    },
    {
      question: "How accurate is HumanizeAI at bypassing AI detection?",
      answer: "HumanizeAI has a 99.8% success rate in bypassing AI detection across all major platforms including GPTZero, TurnItIn, and others. Our advanced algorithms ensure your content remains undetectable while maintaining its original meaning."
    },
    {
      question: "Is there a limit to how much text I can humanize?",
      answer: "The amount of text you can humanize depends on your subscription plan. Free users have a monthly character limit, while premium subscribers enjoy higher limits. Check our pricing page for detailed information on each plan's limitations."
    },
    {
      question: "Does HumanizeAI change the meaning of my text?",
      answer: "No, HumanizeAI is designed to preserve the core meaning and intent of your original text. Unlike simple paraphrasers, our technology makes targeted changes that make the text appear human-written without altering its message."
    },
    {
      question: "How long does the humanizing process take?",
      answer: "HumanizeAI processes text in seconds, not minutes. The exact processing time may vary depending on the length of your text, but our platform is optimized for speed without compromising on quality."
    },
    {
      question: "Can I use HumanizeAI for academic papers?",
      answer: "Yes, many students and academics use HumanizeAI to polish AI-assisted research and writing. However, we encourage responsible use and adherence to your institution's academic integrity policies."
    },
    {
      question: "Is my data secure when using HumanizeAI?",
      answer: "Absolutely. We prioritize data security and privacy. Your text submissions are encrypted, processed securely, and are not stored long-term unless you explicitly save them to your account. We never share your content with third parties."
    },
    {
      question: "Do you offer refunds if the text is detected as AI-generated?",
      answer: "Yes, we stand behind our product. If your humanized text is flagged by any major AI detection tool within 30 days of processing, we offer a full refund for that particular usage. Contact our support team with evidence for assistance."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and select cryptocurrency payments. All payments are processed securely through industry-standard payment processors."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time from your account settings page. Your access will continue until the end of the current billing period."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 px-6">
          <Container className="max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked <span className="text-primary">Questions</span></h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Find answers to common questions about HumanizeAI and how it can help you create authentic human content.
              </p>
            </div>
            
            <div className="mb-12">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium text-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="text-center mt-12">
              <h2 className="text-2xl font-semibold mb-6">Still have questions?</h2>
              <p className="text-muted-foreground mb-8">
                Our support team is ready to assist you with any other questions you might have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <Link to="/#humanizer-tool">
                    Try HumanizeAI Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <a href="mailto:support@humanizeai.com">Contact Support</a>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
