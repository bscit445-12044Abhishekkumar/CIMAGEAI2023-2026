import { Heart, Users, Award, Sparkles } from "lucide-react";

const values = [
{ icon: Heart, title: "Quality First", desc: "Every product is hand-selected for exceptional quality and craftsmanship." },
{ icon: Users, title: "Customer Obsessed", desc: "Your satisfaction drives every decision we make." },
{ icon: Award, title: "Authentic Only", desc: "100% authentic products from trusted artisans and brands worldwide." },
{ icon: Sparkles, title: "Sustainable Style", desc: "Committed to ethical sourcing and eco-conscious fashion." }];


const About = () =>
<div className="container py-16 max-w-3xl mx-auto">
    <h1 className="font-heading text-4xl font-bold text-center mb-4">Our Story</h1>
    <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
      Bazzarly was born from a love of beautiful, well-made things — a modern bazaar where quality meets curation.
    </p>

    <div className="prose prose-lg max-w-none text-muted-foreground space-y-6 mb-16">
      <p>
        Founded in 2024, Bazzarly bridges the gap between premium fashion and accessible luxury.
        We partner with artisans and emerging designers around the globe to bring you a carefully curated
        collection that reflects timeless style.
      </p>
      <p>
        Our mission is simple: make premium, ethically-sourced fashion available to everyone — without
        compromising on quality, sustainability, or the shopping experience.
      </p>
    </div>

    <h2 className="font-heading text-2xl font-bold text-center mb-8">What We Stand For</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {values.map(({ icon: Icon, title, desc }) =>
    <div key={title} className="p-6 rounded-xl border bg-card shadow-card">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-body font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
    )}
    </div>
  </div>;


export default About;