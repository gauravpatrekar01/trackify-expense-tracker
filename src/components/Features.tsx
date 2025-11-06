import { Card } from "@/components/ui/card";
import { Sparkles, PieChart, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Smart Categorization",
    description: "AI-powered automatic categorization of your expenses based on transaction descriptions. No manual tagging required.",
  },
  {
    icon: PieChart,
    title: "Visual Analytics",
    description: "Beautiful charts and graphs that help you understand your spending patterns at a glance.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Bank-level encryption keeps your financial data safe. Your privacy is our top priority.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Add transactions in seconds. Get instant insights. Spend less time tracking, more time living.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="text-primary">Track Smarter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make expense tracking effortless and insightful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-[var(--shadow-glow)] transition-all duration-300 border-border/50 bg-card backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
