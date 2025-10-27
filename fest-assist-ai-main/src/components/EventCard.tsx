import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { Event } from '@/services/eventService';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
  index?: number;
}

const EventCard = ({ event, index = 0 }: EventCardProps) => {
  const categoryColors = {
    technical: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cultural: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    sports: 'bg-green-500/10 text-green-400 border-green-500/20',
    workshop: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full"
    >
      <Link to={`/events/${event._id}`}>
        <div className="glass-card rounded-xl overflow-hidden group cursor-pointer h-full glitter-hover relative hover:shadow-[0_0_40px_hsl(280_100%_70%/0.4),0_0_80px_hsl(320_100%_70%/0.2)] transition-all duration-500">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge
              className={`absolute top-4 right-4 ${categoryColors[event.category]}`}
            >
              {event.category}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FaCalendar className="text-primary" />
                <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                <span className="line-clamp-1">{event.venue}, {event.college}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-primary" />
                <span>{event.registrationCount} registered</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-primary via-accent to-secondary text-white font-semibold shadow-[0_0_20px_hsl(280_100%_70%/0.3)] hover:shadow-[0_0_40px_hsl(280_100%_70%/0.6),0_0_60px_hsl(320_100%_70%/0.4)] transition-all duration-300"
              >
                View Details
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
