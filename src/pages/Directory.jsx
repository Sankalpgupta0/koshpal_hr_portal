import { useState, useMemo, useEffect } from 'react';
import { VscStarEmpty, VscStarFull  } from "react-icons/vsc";
import { RiFileCopyLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { FiSearch, FiRotateCw, FiChevronLeft, FiChevronRight, FiTrendingUp } from 'react-icons/fi';
import { AiOutlineStar } from 'react-icons/ai';
import { getEmployees, getDepartments } from '../api/hr';
// import { showToast } from '../components/Toast';

function Directory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [selectedEngagement, setSelectedEngagement] = useState('Engagement');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedEmployees, setSavedEmployees] = useState(new Set());
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allEmployees, setAllEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const itemsPerPage = 20;

  // Fetch employees from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeesData, departmentsData] = await Promise.all([
          getEmployees(),
          getDepartments(),
        ]);
        setAllEmployees(employeesData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDepartment === 'All Departments' || emp.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'Status' || emp.status === selectedStatus;
      const matchesEngagement = selectedEngagement === 'Engagement' || emp.engagement === selectedEngagement;
      const matchesSaved = !showSavedOnly || savedEmployees.has(emp.id);
      
      return matchesSearch && matchesDept && matchesStatus && matchesEngagement && matchesSaved;
    });
  }, [allEmployees, searchTerm, selectedDepartment, selectedStatus, selectedEngagement, showSavedOnly, savedEmployees]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    const colors = {
      'Onboarded': 'text-[#38BC5C]',
      'Invited': 'text-[#2323E6]',
    };
    return colors[status] || 'text-gray-700';
  };

  const getEngagementColor = (engagement) => {
    const colors = {
      'Active': 'text-[#38BC5C]',
      'Inactive': 'text-[#F31616]',
    };
    return colors[engagement] || 'text-gray-600';
  };

  const toggleSaved = (id) => {
    const newSaved = new Set(savedEmployees);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedEmployees(newSaved);
  };

  return (
    <div className="space-y-3">
      {/* Header and Filters - All in One Card */}
      <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Title and Metrics Row */}
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:justify-between lg:items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
            <p className="mt-1 text-sm text-gray-600">Manage and monitor all employees</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="rounded-lg p-4 border border-[#E5E7EB] sm:w-[320px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4F46E51A] rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Improvement</p>
                  <p className="text-2xl font-bold">+19pts</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4 border border-[#E5E7EB] sm:w-[320px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F59E0B1A] rounded-lg flex items-center justify-center">
                  <AiOutlineStar className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Satisfaction</p>
                  <p className="text-2xl font-bold">4.5</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col items-stretch gap-3 mb-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <FiSearch className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute text-gray-400 right-3 top-3 hover:text-gray-600"
              >
                <RxCross2 />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-3 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg sm:flex-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg sm:flex-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Status</option>
              <option>Invited</option>
              <option>Onboarded</option>
            </select>

            <select
              value={selectedEngagement}
              onChange={(e) => {
                setSelectedEngagement(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg sm:flex-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Engagement</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

      
      </div>

       <div>
         {/* Action Buttons Row */}
        {/* <div className="flex flex-wrap items-center gap-3 p-2">
          <span className="text-sm text-gray-600">{filteredEmployees.length} Results</span>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors border border-blue-300 rounded-lg hover:bg-blue-50">
            <FiRotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">Update</span>
          </button>
          <button 
            onClick={() => {
              setShowSavedOnly(!showSavedOnly);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${
              showSavedOnly 
                ? 'border-blue-300 bg-blue-50 text-blue-600' 
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <VscStarEmpty className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
          </button>
        </div> */}

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="px-6 py-1 text-left border-r border-gray-200">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-200 w-[202px]">Employee Name</th>
                <th className="px-6 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-200 w-[298px]">Department</th>
                {/* <th className="px-6 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-200 w-[298px]">Role</th> */}
                <th className="px-5 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-200 w-[176px]">Status</th>
                <th className="px-6 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-200 w-[176px]">Engagement</th>
                <th className="px-6 py-1 text-left text-xs font-semibold text-gray-700 border-r border-gray-200 w-[155px]">Last Activity</th>
                <th className="px-6 py-1 text-left text-xs font-semibold text-gray-700 w-[155px]">Sessions Attended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <FiRotateCw className="w-5 h-5 animate-spin" />
                      <span>Loading employees...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((employee, index) => (
                <tr key={employee.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}>
                  <td className="px-6 py-4 border-r border-gray-200">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <button
                        onClick={() => toggleSaved(employee.id)}
                        className={`transition-colors text-lg font-bold ${
                          savedEmployees.has(employee.id) 
                            ? 'text-blue-600 hover:text-blue-700' 
                            : 'text-gray-400 hover:text-blue-600'
                        }`}
                      >
                        {savedEmployees.has(employee.id) ? <VscStarFull /> : <VscStarEmpty />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r border-gray-200">{employee.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">
                      <div className="flex items-center justify-between">
                      {employee.department}
                      <button className="text-gray-400 hover:text-gray-600">
                        <RiFileCopyLine className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">
                    <div className="flex items-center justify-between">
                      {employee.role}
                      <button className="text-gray-400 hover:text-gray-600">
                        <RiFileCopyLine className="w-4 h-4" />
                      </button>
                    </div>
                  </td> */}
                  <td className="w-[48px] px-5 py-4 text-sm border-r border-gray-200 ">
                    <span className={`px-3 py-1 text-xs border border-[#F2F4F7] bg-white font-medium ${getStatusColor(employee.status)}`}>
                       ● {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm border-r border-gray-200">
                    <span className={`px-3 py-1 text-xs border border-[#F2F4F7] bg-white font-medium ${getEngagementColor(employee.engagement)}`}>
                      ● {employee.engagement}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-200">{employee.lastActivity}</td>
                  <td className="px-5 py-3 text-sm">
                    <span className="text-[#117A8A] bg-[#17A2B820] rounded-[8px] py-1 px-2 font-medium">{employee.sessionsAttended} sessions</span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-3 px-3 py-4 border-t border-gray-200 bg-gray-50 sm:px-6 sm:flex-row">
          <span className="text-xs text-gray-600 sm:text-sm">
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} Results
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-wrap justify-center gap-1">
              {(() => {
                const pageNumbers = [];
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                // Adjust start if we're near the end
                if (endPage - startPage < maxVisiblePages - 1) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                
                // Add first page and ellipsis if needed
                if (startPage > 1) {
                  pageNumbers.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="px-2.5 py-1.5 rounded text-sm font-medium transition-colors text-gray-600 hover:bg-gray-200"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pageNumbers.push(
                      <span key="ellipsis-start" className="px-2 text-gray-400">...</span>
                    );
                  }
                }
                
                // Add visible page numbers
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-2.5 py-1.5 rounded text-sm font-medium transition-colors ${
                        currentPage === i
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                
                // Add ellipsis and last page if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pageNumbers.push(
                      <span key="ellipsis-end" className="px-2 text-gray-400">...</span>
                    );
                  }
                  pageNumbers.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-2.5 py-1.5 rounded text-sm font-medium transition-colors text-gray-600 hover:bg-gray-200"
                    >
                      {totalPages}
                    </button>
                  );
                }
                
                return pageNumbers;
              })()}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
       </div>
    </div>
  );
}

export default Directory;

