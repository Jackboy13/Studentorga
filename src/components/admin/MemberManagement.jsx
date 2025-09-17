import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Users, Edit, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../common/Modal';
import ConfirmationModal from '../common/ConfirmationModal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MemberManagement = () => {
  const { members, updateMember, deleteMember } = useData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member =>
    (member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const openEditModal = (member) => {
    setCurrentMember(member);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentMember(null);
  };

  const openConfirmModal = (member) => {
    setMemberToDelete(member);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setMemberToDelete(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const memberData = {
      name: formData.get('name'),
      studentId: formData.get('studentId'),
      email: formData.get('email'),
      course: formData.get('course'),
      year: formData.get('year'),
      membershipPaid: formData.get('membershipPaid') === 'on'
    };
    
    const promise = updateMember(currentMember.id, memberData);

    toast.promise(promise, {
      loading: 'Updating member...',
      success: 'Member updated successfully!',
      error: 'Failed to update member.',
    });
    
    closeEditModal();
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    
    const promise = deleteMember(memberToDelete.id);
    toast.promise(promise, {
      loading: 'Deleting member profile...',
      success: 'Member profile deleted successfully!',
      error: 'Failed to delete member profile.',
    });
    
    closeConfirmModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Student ID</th>
              <th scope="col" className="px-6 py-3">Course</th>
              <th scope="col" className="px-6 py-3">Membership</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border-b hover:bg-gray-50"
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {member.name}
                  <p className="text-xs text-gray-500">{member.email}</p>
                </th>
                <td className="px-6 py-4">{member.studentId}</td>
                <td className="px-6 py-4">{member.course}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    member.membershipPaid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.membershipPaid ? <CheckCircle className="w-3 h-3 mr-1"/> : <XCircle className="w-3 h-3 mr-1"/>}
                    {member.membershipPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(member)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"><Edit className="h-4 w-4"/></button>
                  <button onClick={() => openConfirmModal(member)} className="p-2 text-red-600 hover:bg-red-100 rounded-md"><Trash2 className="h-4 w-4"/></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal title={'Edit Member'} isOpen={isEditModalOpen} onClose={closeEditModal}>
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name" defaultValue={currentMember?.name} required className="w-full p-2 border rounded"/>
            <input type="text" name="studentId" placeholder="Student ID" defaultValue={currentMember?.studentId} required className="w-full p-2 border rounded"/>
          </div>
          <input type="email" name="email" placeholder="Email" defaultValue={currentMember?.email} required className="w-full p-2 border rounded" readOnly/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="course" placeholder="Course" defaultValue={currentMember?.course} required className="w-full p-2 border rounded"/>
            <input type="text" name="year" placeholder="Year Level" defaultValue={currentMember?.year} required className="w-full p-2 border rounded"/>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="membershipPaid" id="membershipPaid" defaultChecked={currentMember?.membershipPaid} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            <label htmlFor="membershipPaid" className="ml-2 block text-sm text-gray-900">Membership Paid</label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Update</button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Member Profile"
        message={`Are you sure you want to delete ${memberToDelete?.name}? This action only removes their profile data and is irreversible. Their login account will not be deleted.`}
        confirmText="Yes, delete profile"
      />
    </div>
  );
};

export default MemberManagement;
