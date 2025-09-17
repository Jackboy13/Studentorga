import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { DollarSign, Search, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PaymentManagement = () => {
  const { payments, updatePayment } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (payment.studentName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (payment.transactionId?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && payment.status.toLowerCase() === filterStatus;
  });

  const handleStatusChange = async (paymentId, newStatus) => {
    const promise = updatePayment(paymentId, { status: newStatus });
    toast.promise(promise, {
      loading: 'Updating payment status...',
      success: 'Payment status updated!',
      error: 'Failed to update status.',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or transaction ID..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Student</th>
              <th scope="col" className="px-6 py-3">Transaction ID</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <motion.tr
                key={payment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{payment.studentName}</td>
                <td className="px-6 py-4">{payment.transactionId}</td>
                <td className="px-6 py-4">₱{(payment.amount || 0).toLocaleString()}</td>
                <td className="px-6 py-4">{format(payment.date, 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status === 'Paid' ? <CheckCircle className="w-3 h-3 mr-1"/> : <Clock className="w-3 h-3 mr-1"/>}
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {payment.status === 'Pending' && (
                    <button 
                      onClick={() => handleStatusChange(payment.id, 'Paid')}
                      className="text-sm font-medium text-green-600 hover:text-green-800"
                    >
                      Mark as Paid
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManagement;
