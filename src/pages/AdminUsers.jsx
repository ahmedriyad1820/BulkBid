import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Eye, UserCheck, UserX, ChevronLeft, ChevronRight, Users, Building2, User, Trash2 } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import { getAllUsers, updateUserStatus, deleteUser } from '../services/api.js'
import api from '../services/api.js'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showPendingOnly, setShowPendingOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, roleFilter, searchTerm, showPendingOnly])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const params = {
        page: currentPage,
        limit: 10,
        role: roleFilter,
        search: searchTerm,
        ...(showPendingOnly ? { pendingSeller: true } : {})
      }
      
      const response = await getAllUsers(params)
      setUsers(response.users)
      setPagination(response.pagination)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const handleRoleFilter = (role) => {
    setRoleFilter(role)
    setCurrentPage(1)
  }

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus
      await updateUserStatus(userId, newStatus)
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isActive: newStatus }
          : user
      ))
    } catch (err) {
      console.error('Error updating user status:', err)
      setError('Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      setDeleting(true)
      await deleteUser(userId)
      
      // Remove user from local state
      setUsers(users.filter(user => user._id !== userId))
      setDeleteConfirm(null)
      
      // Show success message
      setError('')
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err.message || 'Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  const viewUserProfile = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'seller':
        return <Building2 className="w-4 h-4" />
      case 'buyer':
        return <User className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'seller':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'buyer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage buyers, sellers, and user accounts
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </form>

            {/* Role Filter */}
            <div className="flex gap-2 items-center">
              <Button
                variant={roleFilter === 'all' ? 'default' : 'outline'}
                onClick={() => handleRoleFilter('all')}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                All Users
              </Button>
              <Button
                variant={roleFilter === 'buyer' ? 'default' : 'outline'}
                onClick={() => handleRoleFilter('buyer')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Buyers
              </Button>
              <Button
                variant={roleFilter === 'seller' ? 'default' : 'outline'}
                onClick={() => handleRoleFilter('seller')}
                className="flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Sellers
              </Button>
              <label className="ml-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input type="checkbox" checked={showPendingOnly} onChange={(e)=>{setShowPendingOnly(e.target.checked); setCurrentPage(1)}} />
                Pending seller requests
              </label>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Users List */}
        <Card className="p-6">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No users found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No users have registered yet'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Seller Request</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Joined</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                              {user.profile?.avatar ? (
                                <img 
                                  src={user.profile.avatar} 
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {user.pendingSeller ? (
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 flex items-center gap-1 w-fit">Pending</Badge>
                          ) : (
                            <Badge 
                              className={`${getRoleColor(user.role)} flex items-center gap-1 w-fit`}
                            >
                              {getRoleIcon(user.role)}
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {user.pendingSeller ? <span className="text-amber-600">Pending</span> : <span className="text-gray-500">—</span>}
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            className={user.isActive !== false 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }
                          >
                            {user.isActive !== false ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewUserProfile(user)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
                              variant={user.isActive !== false ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleStatusToggle(user._id, user.isActive)}
                              className={`flex items-center gap-1 ${
                                user.isActive !== false 
                                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900' 
                                  : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900'
                              }`}
                            >
                              {user.isActive !== false ? (
                                <>
                                  <UserX className="w-4 h-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4" />
                                  Activate
                                </>
                              )}
                            </Button>
                            {user.pendingSeller && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={async()=>{ await api.approveSeller(user._id); fetchUsers() }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async()=>{ const reason = prompt('Reason (optional)'); await api.rejectSeller(user._id, reason); fetchUsers() }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirm(user)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* User Profile Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowUserModal(false)}
                  >
                    Close
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {selectedUser.profile?.avatar ? (
                        <img 
                          src={selectedUser.profile.avatar} 
                          alt={selectedUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                      {selectedUser.pendingSeller ? (
                        <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                          Pending
                        </span>
                      ) : (
                        <Badge className={`${getRoleColor(selectedUser.role)} flex items-center gap-1 w-fit mt-2`}>
                          {getRoleIcon(selectedUser.role)}
                          {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                        </Badge>
                      )}
                      {/* Removed external view links per requirements */}
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                          <p className="text-gray-900 dark:text-white">{selectedUser.profile?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                          <p className="text-gray-900 dark:text-white">{selectedUser.email}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Address</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Street:</span>
                          <p className="text-gray-900 dark:text-white">{selectedUser.profile?.address?.street || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">City:</span>
                          <p className="text-gray-900 dark:text-white">{selectedUser.profile?.address?.city || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Country:</span>
                          <p className="text-gray-900 dark:text-white">{selectedUser.profile?.address?.country || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seller-specific / Pending-seller Information */}
                  {(selectedUser.role === 'seller' || selectedUser.pendingSeller) && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Business Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Company Name:</span>
                          <p className="text-gray-900 dark:text-white">{selectedUser.profile?.companyName || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Trade License:</span>
                          <p className="text-gray-900 dark:text-white">{selectedUser.profile?.tradeLicense || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">NID Number:</span>
                          <p className="text-gray-900 dark:text-white">{selectedUser.profile?.nidNumber || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">NID Document:</span>
                          <p className="text-gray-900 dark:text-white">{selectedUser.profile?.nidDocument ? 'Uploaded' : 'Not uploaded'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Company Address:</span>
                          <div className="text-gray-900 dark:text-white">
                            {selectedUser.profile?.companyAddress ? (
                              <div>
                                <div>{selectedUser.profile.companyAddress.street}</div>
                                <div>{selectedUser.profile.companyAddress.city}, {selectedUser.profile.companyAddress.state}</div>
                                <div>{selectedUser.profile.companyAddress.zipCode}, {selectedUser.profile.companyAddress.country}</div>
                              </div>
                            ) : (
                              'Not provided'
                            )}
                          </div>
                        </div>
                        {selectedUser.profile?.nidDocument && (
                          <div className="md:col-span-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">NID Image:</span>
                            <div className="mt-2 rounded-lg overflow-hidden border dark:border-gray-700 w-full max-w-md">
                              <img src={selectedUser.profile.nidDocument} alt="NID Document" className="w-full h-auto object-contain bg-gray-50 dark:bg-gray-900" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Buyer-specific Information */}
                  {selectedUser.role === 'buyer' && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Personal Information</h4>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">NID Number:</span>
                        <p className="text-gray-900 dark:text-white">{selectedUser.profile?.nidNumber || 'Not provided'}</p>
                      </div>
                    </div>
                  )}

                  {/* Account Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Account Status</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedUser.isActive !== false ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <Button
                      variant={selectedUser.isActive !== false ? "outline" : "default"}
                      onClick={() => {
                        handleStatusToggle(selectedUser._id, selectedUser.isActive)
                        setSelectedUser({...selectedUser, isActive: !selectedUser.isActive})
                      }}
                      className={selectedUser.isActive !== false 
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900' 
                        : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900'
                      }
                    >
                      {selectedUser.isActive !== false ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete User</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
                  This will permanently remove their account and all associated data.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleDeleteUser(deleteConfirm._id)}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? 'Deleting...' : 'Delete User'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
