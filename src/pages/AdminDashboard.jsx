import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { mockRecommendations } from '../data/mockData';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './Dashboard.css';

const AdminDashboard = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar isAdmin={true} />
        <main className="dashboard-content fade-in">
          <div className="dashboard-header bg-white shadow-sm p-4 rounded-md">
            <h2>Admin Control Panel</h2>
            <p className="text-secondary">Manage platform data, properties, and global RoI recommendations</p>
          </div>

          <div className="admin-section">
            <h3 className="mb-1">Platform Recommendations Library</h3>
            {/* Kept some inline styles here as an example of dynamic variables usage if needed, though they match root css vars */}
            <div className="table-responsive shadow-card p-2" style={{ backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-md)' }}>
              <table className="admin-table">
                <thead>
                  <tr className="admin-table-row">
                    <th>Title</th>
                    <th>Category</th>
                    <th>Est. Cost</th>
                    <th>Value Boost</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecommendations.map(rec => (
                    <tr key={rec.id} className="admin-table-row">
                      <td className="fw-500">{rec.title}</td>
                      <td>{rec.category}</td>
                      <td>{rec.costEstimate}</td>
                      <td className="text-primary">+{rec.valueIncreasePct}%</td>
                      <td>
                        {/* Example of dynamic inline styling mixed with classes */}
                        <span 
                          className={`badge badge-${rec.priority === 'High' ? 'danger' : 'primary'}`}
                          style={{ fontWeight: rec.priority === 'High' ? 700 : 500 }}
                        >
                          {rec.priority}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button className="action-btn btn-edit"><FaEdit /></button>
                          <button className="action-btn btn-delete"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
