import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaPaperPlane, FaCheckCircle, FaHeadset } from 'react-icons/fa';
import { submitContactMessage } from '@/services/contactService';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    issueType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {      // Submit to backend
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        issueType: formData.issueType,
        subject: formData.subject,
        message: formData.message,
      });

      // Success
      setIsSubmitted(true);
      toast({
        title: 'Message Sent! 🎉',
        description: 'Your message has been sent to the admin team. We\'ll respond within 24 hours.',
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ 
          name: user?.name || '', 
          email: user?.email || '', 
          subject: '', 
          issueType: '',
          message: '' 
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FaHeadset className="text-4xl text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Contact Support
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Having an issue? Send us a message and our admin team will get back to you within 24 hours.
              </p>
            </div>

            {/* Contact Form */}
            <Card className="glass-card p-8 rounded-2xl">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <FaCheckCircle className="text-4xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. Our admin team has received your message and will respond within 24 hours.
                  </p>
                  <div className="animate-pulse text-sm text-muted-foreground">
                    Returning to form...
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter your name"
                        className="bg-background/50 border-border"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className="bg-background/50 border-border"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Issue Type */}
                  <div className="space-y-2">
                    <Label htmlFor="issueType">Issue Type *</Label>
                    <Select
                      value={formData.issueType}
                      onValueChange={(value) => handleChange('issueType', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="bg-background/50 border-border">
                        <SelectValue placeholder="Select the type of issue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event-registration">Event Registration Issue</SelectItem>
                        <SelectItem value="account-access">Account Access Problem</SelectItem>
                        <SelectItem value="event-cancellation">Event Cancellation Request</SelectItem>
                        <SelectItem value="technical-issue">Technical Issue</SelectItem>
                        <SelectItem value="event-inquiry">Event Inquiry</SelectItem>
                        <SelectItem value="feedback">Feedback or Suggestion</SelectItem>
                        <SelectItem value="other">Other Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="Brief summary of your issue"
                      className="bg-background/50 border-border"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Describe Your Issue *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Please provide details about your issue so we can help you better..."
                      rows={8}
                      className="bg-background/50 border-border resize-none"
                      required
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      Include any relevant event names, dates, or error messages
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent text-white font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Sending to Admin...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Send to Admin
                      </>
                    )}
                  </Button>

                  {/* Help Text */}
                  <p className="text-center text-sm text-muted-foreground">
                    Your message will be sent directly to the admin team. We typically respond within 24 hours.
                  </p>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
