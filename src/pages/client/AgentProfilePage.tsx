import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Building2, Users, Calendar, Trophy } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { PropertyCard } from '../../components/properties/PropertyCard';
import { BookingModal } from '../../components/booking/BookingModal';
import { useProperties } from '../../hooks/useProperties';
import { usePropertyShowings } from '../../hooks/usePropertyShowings';
import { useFollowing } from '../../hooks/useFollowing';
import { useAuthStore } from '../../store/authStore';
import { useAgent } from '../../hooks/useAgent';

export function AgentProfilePage() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { agent, loading, error } = useAgent(agentId);
  const { isFollowing, followAgent, unfollowAgent, getFollowerCount } = useFollowing(user?.id || '');
  const { properties } = useProperties(agentId);
  const { showings } = usePropertyShowings(agentId || '');
  
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const following = agentId ? isFollowing(agentId) : false;
  const followerCount = agentId ? getFollowerCount(agentId) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Agent not found'}
        </h2>
        <Button onClick={() => navigate('/client')}>
          Return to Search
        </Button>
      </div>
    );
  }

  const selectedPropertyData = properties.find(p => p.id === selectedProperty);
  const selectedPropertyShowings = selectedProperty ? showings.find(s => s.propertyId === selectedProperty) : null;

  return (
    <div className="space-y-8">
      {/* Agent Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            {agent.photo ? (
              <img
                src={agent.photo}
                alt={agent.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
                <p className="text-gray-600">@{agent.username}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{agent.rating}</span>
                    <span className="text-gray-600">({agent.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Serves: {agent.areas.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${agent.phone}`} className="hover:text-blue-600">
                      {agent.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${agent.email}`} className="hover:text-blue-600">
                      {agent.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{followerCount} followers</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  variant={following ? 'outline' : 'primary'}
                  onClick={() => following ? unfollowAgent(agent.id) : followAgent(agent.id)}
                  className="w-full md:w-auto"
                >
                  {following ? 'Unfollow' : 'Follow'}
                </Button>
              </div>
            </div>

            {agent.bio && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">About Me</h2>
                <p className="text-gray-600">{agent.bio}</p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {agent.languages && agent.languages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {agent.languages.map(lang => (
                      <li key={lang}>{lang}</li>
                    ))}
                  </ul>
                </div>
              )}

              {agent.certifications && agent.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Certifications</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {agent.certifications.map(cert => (
                      <li key={cert}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Available Properties
          </h2>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No properties available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={() => setSelectedProperty(property.id)}
                showBooking={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedPropertyData && selectedPropertyShowings && (
        <BookingModal
          property={selectedPropertyData}
          timeSlot={selectedPropertyShowings.timeSlots[0]}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </div>
  );
}