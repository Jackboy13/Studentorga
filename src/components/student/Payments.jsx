import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { CreditCard, Calendar, CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Payments = () => {
  const { user } = useAuth();
  const { payments, updatePayment } = useData();

  const userPayments = payments.filter(payment => payment.userId === user?.id);

  const handlePayNow = (paymentId) => {
    const promise = updatePayment(paymentId, { 
      status: 'Paid', 
      transactionId: `TXN${Date.now()}`
    });

    toast.promise(promise, {
      loading: 'Processing payment...',
      success: 'Payment successful!',
      error: 'Payment failed.',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Overdue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const pendingAmount = userPayments
    .filter(p => p.status === 'Pending')
    .reduce((total, p) => total + (p.amount || 0), 0);

  const totalPaid = userPayments
    .filter(p => p.status === 'Paid')
    .reduce((total, p) => total + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Dues</h1>
          <p className="text-gray-600 mt-1">Manage your membership payments and dues</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <CreditCard className="h-5 w-5" />
          <span className="text-sm">{userPayments.length} transactions</span>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">₱{pendingAmount.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">₱{totalPaid.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Membership Status</p>
              <p className={`text-lg font-semibold ${user?.membershipPaid ? 'text-green-600' : 'text-red-600'}`}>
                {user?.membershipPaid ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              user?.membershipPaid ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {user?.membershipPaid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Membership Status Alert */}
      {!user?.membershipPaid && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3" />
            <div className="flex-1">
              <h3 className="text-yellow-800 font-medium">Membership Payment Required</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Your membership is currently inactive. Please pay your dues to maintain access to all organization benefits.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {userPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{payment.paymentType}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-600">
                        Transaction ID: {payment.transactionId || 'N/A'}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(payment.date, 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₱{(payment.amount || 0).toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  
                  {payment.status === 'Pending' && (
                    <button
                      onClick={() => handlePayNow(payment.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {userPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
            <p className="text-gray-500">Your payment transactions will appear here.</p>
          </div>
        )}
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 cursor-pointer transition-colors">
            <div className="h-8 w-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>
            <p className="font-medium text-gray-900">GCash</p>
            <p className="text-sm text-gray-500">Digital wallet</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 cursor-pointer transition-colors">
            <div className="h-8 w-8 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            <p className="font-medium text-gray-900">PayMaya</p>
            <p className="text-sm text-gray-500">Digital wallet</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 cursor-pointer transition-colors">
            <div className="h-8 w-8 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-purple-600" />
            </div>
            <p className="font-medium text-gray-900">Bank Transfer</p>
            <p className="text-sm text-gray-500">Online banking</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Payments;
