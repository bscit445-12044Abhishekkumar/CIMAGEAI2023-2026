import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="container py-16">
      <h1 className="font-heading text-4xl font-bold text-center mb-4">Get in Touch</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
        Have a question? We'd love to hear from you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Subject</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Message</label>
            <textarea
              rows={5}
              required
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            
          </div>
          <Button type="submit" className="w-full gradient-gold text-primary-foreground border-0 rounded-full font-body font-semibold">
            Send Message
          </Button>
        </form>

        <div className="space-y-8">
          {[
          { icon: Mail, label: "Email", value: "hello@bazzarly.com" },
          { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
          { icon: MapPin, label: "Address", value: "123 Fashion Ave, New York, NY 10001" }].
          map(({ icon: Icon, label, value }) =>
          <div key={label} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{value}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};

export default Contact;