import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaMapMarkerAlt, FaClock, FaImage } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createEvent } from '@/services/eventService';

const AddEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    college: '',
    organizer: '',
    image: '',
    capacity: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.date || !formData.time || !formData.venue) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format time if needed (ensure HH:MM AM/PM format)
      const formattedTime = formData.time || '10:00 AM';
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category as 'technical' | 'cultural' | 'sports' | 'workshop',
        date: formData.date,
        time: formattedTime,
        venue: formData.venue,
        college: formData.college || 'Unknown College',
        organizer: formData.organizer || 'Event Organizer',
        capacity: formData.capacity ? parseInt(formData.capacity) : 100,
        image: formData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      };

      const createdEvent = await createEvent(eventData);

      toast({
        title: 'Event Created! 🎉',
        description: `${formData.title} has been created successfully`,
      });

      // Redirect to the newly created event details page
      setTimeout(() => {
        navigate(`/events/${createdEvent._id}`);
      }, 1500);
    } catch (error) {
      console.error('Create event error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create event',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-6">
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card p-8">
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Create New Event
                </span>
              </h1>
              <p className="text-muted-foreground mb-8">
                Fill in the details to create an amazing event
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter event title"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Event Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe your event in detail..."
                      className="min-h-[120px] mt-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleChange('category', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="capacity">Max Participants</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => handleChange('capacity', e.target.value)}
                        placeholder="e.g., 100"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaCalendar className="text-primary" />
                    Date & Time
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Event Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="mt-2"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Event Time *</Label>
                      <div className="relative mt-2">
                        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleChange('time', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaMapMarkerAlt className="text-accent" />
                    Location
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="venue">Venue *</Label>
                      <Input
                        id="venue"
                        value={formData.venue}
                        onChange={(e) => handleChange('venue', e.target.value)}
                        placeholder="e.g., Main Auditorium"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="college">College/Institution *</Label>
                      <Input
                        id="college"
                        value={formData.college}
                        onChange={(e) => handleChange('college', e.target.value)}
                        placeholder="e.g., MIT College"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Organizer Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organizer">Organizer Name *</Label>
                      <Input
                        id="organizer"
                        value={formData.organizer}
                        onChange={(e) => handleChange('organizer', e.target.value)}
                        placeholder="e.g., Tech Club"
                        className="mt-2"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Event Image URL</Label>
                      <div className="relative mt-2">
                        <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => handleChange('image', e.target.value)}
                          placeholder="https://..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {formData.image && (
                  <div className="space-y-2">
                    <Label>Image Preview</Label>
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/event-panel')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Event'}
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

export default AddEvent;
