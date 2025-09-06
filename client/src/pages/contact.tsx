import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, MessageSquare, Send, Twitter, Linkedin } from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", form);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-contact-title">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-contact-subtitle">
              Have questions about FIRE, want to share your own journey, or just want to connect? 
              I'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center" data-testid="text-form-title">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      required
                      data-testid="input-contact-subject"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleInputChange}
                      placeholder="Your message..."
                      rows={6}
                      required
                      data-testid="textarea-contact-message"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full"
                    data-testid="button-contact-submit"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information & Social */}
            <div className="space-y-8">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center" data-testid="text-contact-info-title">
                    <Mail className="w-5 h-5 mr-2 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground" data-testid="text-contact-info-description">
                    I try to respond to all messages within 24-48 hours. Whether you have questions about 
                    specific FIRE strategies, want to share your own journey, or are looking for accountability 
                    partners, don't hesitate to reach out.
                  </p>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-3" data-testid="text-response-time-title">
                      Typical Response Time
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid="text-response-time">
                      📧 Email: 24-48 hours<br />
                      💬 General inquiries: 1-2 business days<br />
                      📊 Data questions: 2-3 business days
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-social-title">Connect Elsewhere</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm" data-testid="text-social-description">
                      Follow along on social media for quick updates and FIRE community discussions.
                    </p>
                    
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm" asChild data-testid="button-social-twitter">
                        <a href="#" className="inline-flex items-center">
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild data-testid="button-social-linkedin">
                        <a href="#" className="inline-flex items-center">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-faq-title">Common Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground" data-testid="text-faq-anonymous-title">
                        Why stay anonymous?
                      </h4>
                      <p className="text-muted-foreground" data-testid="text-faq-anonymous-answer">
                        Privacy and security are important when sharing financial information publicly.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground" data-testid="text-faq-collaboration-title">
                        Open to collaborations?
                      </h4>
                      <p className="text-muted-foreground" data-testid="text-faq-collaboration-answer">
                        Absolutely! Especially guest posts, data sharing, or joint FIRE content projects.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground" data-testid="text-faq-advice-title">
                        Do you give financial advice?
                      </h4>
                      <p className="text-muted-foreground" data-testid="text-faq-advice-answer">
                        I share my personal journey and strategies, but this isn't professional financial advice.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
