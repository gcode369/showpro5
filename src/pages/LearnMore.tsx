import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, Users, DoorOpen, ListChecks, BarChart } from 'lucide-react';
import { Button } from '../components/common/Button';

export function LearnMorePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Revolutionize Your Real Estate Business
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              ShowPro provides a comprehensive platform for real estate professionals to manage showings, track properties, and grow their client base.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Calendar className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">
                Effortlessly manage property showings with our intelligent scheduling system. Set availability, handle bookings, and sync with your calendar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Building2 className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Property Management</h3>
              <p className="text-gray-600">
                Keep track of all your listings in one place. Upload photos, set pricing, and manage property details with ease.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Client Portal</h3>
              <p className="text-gray-600">
                Provide clients with a dedicated portal to browse properties, schedule viewings, and communicate with agents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Agent Rankings</h2>
            <p className="mt-4 text-xl text-gray-600">
              Our unique ranking system helps clients find the most active and successful agents in their area.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <BarChart className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Client-Based Rankings</h3>
              <p className="text-gray-600">
                Agents are ranked based on their total number of active clients, providing a clear measure of their market presence and success. This transparent system reflects real client relationships and market activity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ListChecks className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Area-Specific Performance</h3>
              <p className="text-gray-600">
                Rankings are broken down by area, helping clients find agents who are most active in their desired locations. See total client counts and agent rankings specific to each neighborhood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Smart Lead Capture</h2>
            <p className="mt-4 text-xl text-gray-600">
              Turn open houses into lasting client relationships with our integrated lead capture system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DoorOpen className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Open House Publishing</h3>
              <p className="text-gray-600">
                Easily publish open house events that are instantly visible to all clients in your area. Set dates, times, and maximum attendee limits to ensure quality showings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visitor Registration</h3>
              <p className="text-gray-600">
                Capture detailed visitor information including contact details, property preferences, and pre-qualification status. Automatically create client profiles for future follow-up.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <ListChecks className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lead Management</h3>
              <p className="text-gray-600">
                Track and manage leads with our built-in CRM. Set follow-up reminders, track interest levels, and convert open house visitors into long-term clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Transform Your Real Estate Business?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of successful agents using ShowPro to grow their business.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              onClick={() => navigate('/register/agent')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}