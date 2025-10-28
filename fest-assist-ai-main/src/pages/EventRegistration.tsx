import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaUniversity } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchEventById, registerForEvent, Event } from '@/services/eventService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    yearOfStudy: '',
    department: '',
    specialRequirements: '',
  });

  // Load event data
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (error) {
        console.error('Failed to load event:', error);
        toast({
          title: 'Error',
          description: 'Failed to load event details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, toast]);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.college || !formData.yearOfStudy) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!id) return;

    try {
      setIsSubmitting(true);
      
      // Complete registration via backend API with detailed information
      await registerForEvent(id, {
        phone: formData.phone,
        college: formData.college,
        yearOfStudy: formData.yearOfStudy,
        department: formData.department,
        specialRequirements: formData.specialRequirements,
      });

      toast({
        title: 'Registration Successful! 🎉',
        description: `You've been registered for ${event?.title}`,
      });

      setTimeout(() => {
        navigate('/student-dashboard');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Failed to register for event',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to={`/events/${id}`}>
            <Button variant="ghost" className="mb-6">
              <FaArrowLeft className="mr-2" />
              Back to Event Details
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Event Info Card */}
            <Card className="glass-card p-6">
              <div className="flex gap-6">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                  <p className="text-muted-foreground mb-2">{event.college}</p>
                  <div className="flex gap-4 text-sm">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>⏰ {event.time}</span>
                    <span>📍 {event.venue}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Registration Form */}
            <Card className="glass-card p-8">
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Event Registration
                </span>
              </h1>
              <p className="text-muted-foreground mb-8">
                Please fill in your details to complete registration
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaUser className="text-primary" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative mt-2">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative mt-2">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="department">Department</Label>
                      <div className="relative mt-2">
                        <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => handleChange('department', e.target.value)}
                          placeholder="e.g., Computer Science"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaUniversity className="text-accent" />
                    Academic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="college">College/University *</Label>
                      <Input
                        id="college"
                        value={formData.college}
                        onChange={(e) => handleChange('college', e.target.value)}
                        placeholder="Enter your college name"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="yearOfStudy">Year of Study *</Label>
                      <Select
                        value={formData.yearOfStudy}
                        onValueChange={(value) => handleChange('yearOfStudy', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="graduate">Graduate</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">
                    Special Requirements / Dietary Restrictions (Optional)
                  </Label>
                  <Textarea
                    id="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={(e) => handleChange('specialRequirements', e.target.value)}
                    placeholder="Any special requirements or dietary restrictions..."
                    className="min-h-[100px] mt-2"
                  />
                </div>

                {/* Terms */}
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    By registering, you agree to attend the event and follow all guidelines
                    set by the organizers. You'll receive a confirmation email shortly.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/events/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Complete Registration'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventRegistration;
