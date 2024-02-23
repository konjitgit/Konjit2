import React from 'react'
import AdminHeader from '../components/Admin/Layout/AdminHeader';
import AdminSideBar from '../components/Admin/Layout/AdminSideBar';
import AllProducts from '../components/Admin/AllProducts';
import AllComments from '../components/Admin/AllComments.jsx';

function AdminDashboardComments() {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={7} />
          </div>
          <AllComments />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardComments
