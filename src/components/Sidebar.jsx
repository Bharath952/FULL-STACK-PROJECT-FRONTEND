import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaBuilding, FaLightbulb, FaUserShield, FaPlus, FaBookmark, FaStar } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isAdmin }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <NavLink to={isAdmin ? "/admin" : "/dashboard"} end className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        
        {!isAdmin && (
          <>
            <NavLink to="/dashboard/add-property" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <FaPlus />
              <span>Add Property</span>
            </NavLink>
            <NavLink to="/saved-properties" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <FaBookmark />
              <span>Saved Properties</span>
            </NavLink>
            <NavLink to="/reviews" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <FaStar />
              <span>Reviews</span>
            </NavLink>
            <NavLink to="/recommendations" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <FaLightbulb />
              <span>Recommendations</span>
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink to="/admin/properties" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <FaBuilding />
              <span>All Properties</span>
            </NavLink>
            <NavLink to="/admin/recommendations" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <FaLightbulb />
              <span>Manage RoI Ideas</span>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
