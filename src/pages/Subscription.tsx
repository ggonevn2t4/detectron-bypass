
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SubscriptionCheckout from "@/components/payments/SubscriptionCheckout";

const Subscription = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get("plan") || undefined;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Subscription</h1>
            <SubscriptionCheckout planId={planId} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Subscription;
