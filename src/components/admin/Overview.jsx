import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Users, Megaphone, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isWithinInterval, addDays } from 'date-fns';

const Overview = () => {
  const { members, announcements, events, payments } = useData();

  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const expiringMembers = members.filter(member => 
    member.membershipExpiry && isWithinInterval(member.membershipExpiry, {
      start: new Date(),
      end: addDays(new Date(), 30)
    })
  );

  const stats = [
    { title: 'Total Members', value: members.length, icon: Users, color: 'blue' },
    { title: 'Total Revenue', value: `₱${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'green' },
    { title: 'Total Events', value: events.length, icon: Calendar, color: 'purple' },
    { title: 'Announcements', value: announcements.length, icon: Megaphone, color: 'indigo' },
  ];

  const statColors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600', iconBg: 'bg-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', iconBg: 'bg-purple-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', iconBg: 'bg-indigo-600' },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = statColors[stat.color];
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${colors.bg} rounded-xl p-6 border border-gray-100`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className={`text-2xl font-bold ${colors.text} mt-1`}>{stat.value}</p>
                </div>
                <div className={`${colors.iconBg} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Expiring Memberships</h2>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {expiringMembers.length > 0 ? expiringMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
                <p className="text-sm text-yellow-600 font-medium">
                  Expires: {format(member.membershipExpiry, 'MMM dd, yyyy')}
                </p>
              </div>
            )) : (
              <p className="text-gray-500 text-sm text-center py-4">No memberships expiring within 30 days.</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {payments.slice(0, 5).map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{payment.studentName}</p>
                  <p className="text-xs text-gray-500">{format(payment.date, 'MMM dd, yyyy')}</p>
                </div>
                <p className={`text-sm font-medium ${payment.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  ₱{(payment.amount || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
