import { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_a4j0vxr";
const EMAILJS_TEMPLATE_NOTIFY = "template_notify_admin";  // Email TO Anand with the message
const EMAILJS_TEMPLATE_AUTOREPLY = "template_autoreply";  // Confirmation email TO the sender
const EMAILJS_PUBLIC_KEY = "s3SCR6nQ-h7gSw7nn";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Email 1: Send the message TO Anand (notification with full message)
      const notifyResult = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_NOTIFY,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "anandjmehta6@gmail.com",
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log("Notification email sent to Anand:", notifyResult);

      // Email 2: Send auto-reply confirmation TO the person who submitted
      const autoReplyResult = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_AUTOREPLY,
        {
          to_name: formData.name,
          to_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log("Auto-reply sent to sender:", autoReplyResult);

      toast.success("Message sent! Check your email for confirmation.");
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    } catch (error: any) {
      console.error("Failed to send email:", error);
      
      // Fallback: Open mailto link if EmailJS fails
      const mailtoLink = `mailto:anandjmehta6@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      )}`;
      
      toast.info("Opening your email client...", {
        description: "EmailJS not configured. Click to send via your email app.",
        action: {
          label: "Open Email",
          onClick: () => window.open(mailtoLink, "_blank")
        }
      });
      
      // Auto-open mailto as fallback
      window.location.href = mailtoLink;
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "anandjmehta6@gmail.com",
      link: "mailto:anandjmehta6@gmail.com"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "(678) 373-9626",
      link: "tel:6783739626"
    },
    {
      icon: MapPin,
      title: "Main Office",
      content: "925 Powder Springs St, Smyrna, GA 30080",
      link: "https://maps.google.com/?q=925+Powder+Springs+St,+Smyrna,+GA+30080"
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM",
      link: null
    }
  ];

  const shelters = [
    {
      name: "Furkids Animal Rescue & Shelters",
      description: "Multiple locations throughout Georgia",
      website: "https://furkids.org"
    }
  ];

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 to-orange-50 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn direction="down">
              <h1 className="text-5xl display-font text-primary mb-6">Get in Touch</h1>
              <p className="text-xl body-font text-gray-700">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="bg-white px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info) => {
                const IconComponent = info.icon;
                return (
                  <StaggerItem key={info.title}>
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="heading-font font-semibold text-primary mb-2">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a href={info.link} className="body-font text-gray-600 hover:text-primary transition-colors">
                            {info.content}
                          </a>
                        ) : (
                          <p className="body-font text-gray-600">{info.content}</p>
                        )}
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            {/* Contact Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ScaleIn delay={0.2}>
                <div>
                  <h2 className="text-3xl display-font text-primary mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={6}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isSubmitting || isSubmitted}
                    >
                      {isSubmitting ? "Sending..." : isSubmitted ? "Message Sent!" : "Send Message"}
                    </Button>
                  </form>
                </div>
              </ScaleIn>

              <FadeIn delay={0.3} direction="left">
                <div>
                  <h2 className="text-3xl display-font text-primary mb-6">Our Shelters</h2>
                  <div className="space-y-6">
                    {shelters.map((shelter) => (
                      <Card key={shelter.name} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <h3 className="heading-font text-xl font-semibold text-primary mb-3">
                            {shelter.name}
                          </h3>
                          <div className="space-y-2 text-sm body-font text-gray-600">
                            {shelter.description && (
                              <p className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {shelter.description}
                              </p>
                            )}
                            {shelter.website && (
                              <p className="flex items-center gap-2">
                                <a href={shelter.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary text-primary underline">
                                  Visit Website →
                                </a>
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Contact;
