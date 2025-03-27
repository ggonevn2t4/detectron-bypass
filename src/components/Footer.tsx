
import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container max-w-6xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <span className="relative w-8 h-8 bg-primary rounded-lg overflow-hidden flex items-center justify-center">
                <div className="absolute w-full h-full bg-primary"></div>
                <span className="relative text-white font-bold text-lg">H</span>
              </span>
              <span className="font-medium text-xl">Humanize<span className="text-primary">AI</span></span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Transform AI-generated content into 100% human content. Bypass AI detectors with confidence.
            </p>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} HumanizeAI. All rights reserved.
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Testimonials', 'API Documentation'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'Contact Us', 'Knowledge Base', 'Status'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <span className="text-muted-foreground text-sm">Zalo/Phone: 0708684608</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span className="text-muted-foreground text-sm">Address: Landmark 81, Binh Thanh District, Ho Chi Minh City</span>
              </li>
            </ul>
            
            <h4 className="font-medium mb-4 mt-6">Legal</h4>
            <ul className="space-y-3">
              {['Terms of Service', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
