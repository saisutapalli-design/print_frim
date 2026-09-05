import React, { useState } from 'react';
import { 
  Users, 
  Printer, 
  Palette, 
  Layers, 
  Truck, 
  Phone, 
  Award, 
  CheckCircle, 
  Plus, 
  Calendar,
  IndianRupee,
  MessageSquare,
  X,
  UserPlus,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Language, StaffMember } from '../types';
import { translations, formatINR } from '../utils/translations';

interface TeamManagementProps {
  staffList: StaffMember[];
  language: Language;
  onAddStaff?: (newStaff: StaffMember) => void;
}

type TeamSortField = 'name' | 'role' | 'todaySqFt' | 'totalSqFtMonth' | 'wageAmount';
type SortDirection = 'asc' | 'desc';

export const TeamManagement: React.FC<TeamManagementProps> = ({
  staffList,
  language,
  onAddStaff,
}) => {
  const t = translations[language];

  // View mode and filters
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<TeamSortField>('totalSqFtMonth');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Modal state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<StaffMember['role']>('Designer');
  const [newWageType, setNewWageType] = useState<'Daily' | 'Monthly'>('Monthly');
  const [newWageAmount, setNewWageAmount] = useState<number>(15000);

  // Aggregates
  const totalEmployees = staffList.length;
  const totalMonthlyPayroll = staffList.reduce((sum, s) => {
    return sum + (s.wageType === 'Monthly' ? s.wageAmount : s.wageAmount * 26);
  }, 0);
  const totalMonthSqFt = staffList.reduce((sum, s) => sum + s.totalSqFtMonth, 0);
  const totalTodaySqFt = staffList.reduce((sum, s) => sum + s.todaySqFt, 0);

  const getRoleIcon = (role: StaffMember['role']) => {
    switch (role) {
      case 'Designer':
        return <Palette className="w-4 h-4 text-purple-600" />;
      case 'Printer Operator':
        return <Printer className="w-4 h-4 text-blue-600" />;
      case 'Finishing & Pasting':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'Delivery & Helper':
        return <Truck className="w-4 h-4 text-emerald-600" />;
    }
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    if (onAddStaff) {
      onAddStaff({
        id: `st-${Date.now()}`,
        name: newName.trim(),
        role: newRole,
        phone: newPhone.trim(),
        wageType: newWageType,
        wageAmount: Number(newWageAmount) || 0,
        status: 'Active',
        todaySqFt: 0,
        todayJobs: 0,
        totalSqFtMonth: 0,
        totalJobsMonth: 0,
      });
    }

    setNewName('');
    setNewPhone('');
    setNewWageAmount(15000);
    setIsAddStaffOpen(false);
  };

  // Filter and sort team
  const filteredStaff = staffList.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    let valA: any = a[sortField];
    let valB: any = b[sortField];

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: TeamSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'name' || field === 'role' ? 'asc' : 'desc');
    }
  };

  const renderSortIndicator = (field: TeamSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 inline-block ml-1" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-amber-600 inline-block ml-1" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-amber-600 inline-block ml-1" />
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'te' ? 'సిబ్బంది నిర్వహణ & పనితీరు రికార్డు' : 'Team Productivity & Payroll Hub'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200">
            <Users className="w-4 h-4 text-amber-600" />
            <span>{totalEmployees} {language === 'te' ? 'ఉద్యోగులు' : 'Team Members'}</span>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer"
            title="Print Team Sheet"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{language === 'te' ? 'ప్రింట్' : 'Print'}</span>
          </button>

          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>{language === 'te' ? 'సిబ్బందిని చేర్చండి' : 'Add Staff'}</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'te' ? 'ఈ రోజు ప్రింటింగ్ అవుట్ పుట్' : "Today's Work Output"}
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
            {totalTodaySqFt} <span className="text-xs font-medium text-slate-500">Sq.Ft</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            {staffList.reduce((sum, s) => sum + s.todayJobs, 0)} {language === 'te' ? 'పనులు పూర్తయ్యాయి' : 'jobs processed today'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'te' ? 'నెలవారీ మొత్తం అవుట్ పుట్' : 'Monthly Work Output'}
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
            {totalMonthSqFt} <span className="text-xs font-medium text-slate-500">Sq.Ft</span>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
            {staffList.reduce((sum, s) => sum + s.totalJobsMonth, 0)} {language === 'te' ? 'జాబ్స్ డెలివరీ అయ్యాయి' : 'total month jobs'}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'te' ? 'అంచనా వేసిన నెలవారీ జీతాలు' : 'Estimated Monthly Payroll'}
          </span>
          <div className="text-2xl font-black text-rose-700 mt-1">
            {formatINR(totalMonthlyPayroll)}
          </div>
          <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
            {language === 'te' ? 'నెలకు వేతనాలు & రోజువారీ కూలీలు' : 'Salaried + daily wages combined'}
          </span>
        </div>
      </div>

      {/* Filter and Mode Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'te' ? 'సిబ్బంది పేరు లేదా ఫోన్ నంబర్ తో వెతకండి...' : 'Search team members by name or phone...'}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Table / Grid Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={language === 'te' ? 'టేబుల్ వ్యూ' : 'Table View'}
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden xs:inline">{language === 'te' ? 'టేబుల్' : 'Table'}</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={language === 'te' ? 'గ్రిడ్ వ్యూ' : 'Grid View'}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden xs:inline">{language === 'te' ? 'గ్రిడ్' : 'Grid'}</span>
            </button>
          </div>

          {/* Role selector */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
            >
              <option value="All">{language === 'te' ? 'అన్ని విభాగాలు' : 'All Roles'}</option>
              <option value="Designer">Designer</option>
              <option value="Printer Operator">Printer Operator</option>
              <option value="Finishing & Pasting">Finishing & Pasting</option>
              <option value="Delivery & Helper">Delivery & Helper</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [f, d] = e.target.value.split('-') as [TeamSortField, SortDirection];
                setSortField(f);
                setSortDirection(d);
              }}
              className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden text-slate-700 cursor-pointer"
            >
              <option value="totalSqFtMonth-desc">{language === 'te' ? 'నెలవారీ ఉత్పత్తి (ఎక్కువ ముందు)' : 'Month Output: High to Low'}</option>
              <option value="todaySqFt-desc">{language === 'te' ? 'ఈ రోజు ఉత్పత్తి (ఎక్కువ ముందు)' : "Today's Output: High to Low"}</option>
              <option value="wageAmount-desc">{language === 'te' ? 'జీతం (ఎక్కువ ముందు)' : 'Wage: High to Low'}</option>
              <option value="name-asc">{language === 'te' ? 'పేరు (A-Z)' : 'Name: A-Z'}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Conditional: Table View vs Grid View */}
      {viewMode === 'table' ? (
        /* TEAM TABLE VIEW WITH STICKY RIGHT-ALIGNED ACTION COLUMN */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto relative min-w-full">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center">{language === 'te' ? 'సిబ్బంది పేరు' : 'Staff Member'} {renderSortIndicator('name')}</span>
                  </th>
                  <th
                    onClick={() => handleSort('role')}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center">{language === 'te' ? 'రోల్' : 'Role'} {renderSortIndicator('role')}</span>
                  </th>
                  <th className="py-3 px-4 whitespace-nowrap">{language === 'te' ? 'ఫోన్' : 'Phone'}</th>
                  <th
                    onClick={() => handleSort('todaySqFt')}
                    className="py-3 px-4 text-center cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center justify-center">{language === 'te' ? 'ఈ రోజు పని' : "Today's Work"} {renderSortIndicator('todaySqFt')}</span>
                  </th>
                  <th
                    onClick={() => handleSort('totalSqFtMonth')}
                    className="py-3 px-4 text-center cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center justify-center">{language === 'te' ? 'నెల ఉత్పత్తి' : 'Month Output'} {renderSortIndicator('totalSqFtMonth')}</span>
                  </th>
                  <th
                    onClick={() => handleSort('wageAmount')}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-slate-200/70 transition select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center justify-end">{language === 'te' ? 'వేతనం' : 'Wage'} {renderSortIndicator('wageAmount')}</span>
                  </th>
                  <th className="py-3 px-4 text-center whitespace-nowrap">{language === 'te' ? 'స్థితి' : 'Status'}</th>

                  {/* STICKY RIGHT-ALIGNED ACTION COLUMN */}
                  <th className="py-3 px-4 text-right sticky right-0 z-20 bg-slate-100 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] whitespace-nowrap min-w-[170px]">
                    {language === 'te' ? 'చర్య' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedStaff.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400">
                      {language === 'te' ? 'సిబ్బంది ఎవరూ లేరు' : 'No staff members found.'}
                    </td>
                  </tr>
                ) : (
                  sortedStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50 transition bg-white">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                            {member.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {getRoleIcon(member.role)}
                          <span>{member.role}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600 text-xs">
                        {member.phone}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="font-black text-slate-900">{member.todaySqFt} Sq.Ft</div>
                        <div className="text-[10px] text-slate-400">({member.todayJobs} jobs)</div>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="font-black text-slate-900">{member.totalSqFtMonth} Sq.Ft</div>
                        <div className="text-[10px] text-slate-400">({member.totalJobsMonth} jobs)</div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-800">
                        {formatINR(member.wageAmount)}{' '}
                        <span className="text-slate-400 text-xs font-normal">
                          /{member.wageType === 'Monthly' ? 'mo' : 'day'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {member.status}
                        </span>
                      </td>

                      {/* STICKY RIGHT-ALIGNED ACTION CELL */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap sticky right-0 z-10 bg-white shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:${member.phone.replace(/\s+/g, '')}`}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold transition cursor-pointer"
                            title="Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={`https://wa.me/91${member.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold transition cursor-pointer border border-emerald-200"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TEAM CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedStaff.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-2xl">
              {language === 'te' ? 'సిబ్బంది ఎవరూ లేరు' : 'No staff members found.'}
            </div>
          ) : (
            sortedStaff.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-700 text-lg">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900">{member.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {getRoleIcon(member.role)}
                            <span>{member.role}</span>
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {member.status}
                    </span>
                  </div>

                  {/* Output Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">
                        {language === 'te' ? 'ఈ రోజు ఉత్పత్తి' : "Today's Work"}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {member.todaySqFt} Sq.Ft
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({member.todayJobs} {language === 'te' ? 'జాబ్స్' : 'jobs'})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[11px] block">
                        {language === 'te' ? 'ఈ నెల మొత్తం అవుట్ పుట్' : 'Monthly Output'}
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        {member.totalSqFtMonth} Sq.Ft
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({member.totalJobsMonth} {language === 'te' ? 'జాబ్స్' : 'jobs'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wage & Pay info + RIGHT ALIGNED ACTIONS */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">
                      {language === 'te' ? 'వేతన విధానం' : 'Wage Structure'}
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatINR(member.wageAmount)}{' '}
                      <span className="text-slate-500 font-normal">
                        /{member.wageType === 'Monthly' ? (language === 'te' ? 'నెలకు' : 'month') : (language === 'te' ? 'రోజుకు' : 'day')}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-1.5">
                    <a
                      href={`tel:${member.phone.replace(/\s+/g, '')}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold flex items-center gap-1 text-xs transition cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'కాల్' : 'Call'}</span>
                    </a>

                    <a
                      href={`https://wa.me/91${member.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold flex items-center gap-1 text-xs transition cursor-pointer border border-emerald-200"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{language === 'te' ? 'వాట్సాప్' : 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Staff Popover Drawer */}
      {isAddStaffOpen && (
        <div 
          id="add-team-member-modal"
          className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0" 
            onClick={() => setIsAddStaffOpen(false)} 
            aria-hidden="true" 
          />

          {/* Right-side Popover Drawer Container */}
          <div 
            id="add-team-member-popover-container"
            className="relative z-10 bg-white w-full max-w-md md:max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-hidden"
          >
            {/* Popover Header */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {language === 'te' ? 'కొత్త సిబ్బందిని చేర్చండి' : 'Add Team Member'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'te' ? 'సిబ్బంది వివరాలు, రోల్ మరియు వేతన విధానం' : 'Staff details, role assignment & wages'}
                  </p>
                </div>
              </div>
              <button
                id="close-add-staff-drawer-btn"
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateStaff} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    {language === 'te' ? 'పూర్తి పేరు' : 'Full Name'} *
                  </label>
                  <input
                    id="new-staff-name-input"
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., K. Suresh Kumar"
                    className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    {language === 'te' ? 'మొబైల్ నంబర్' : 'Phone Number'} *
                  </label>
                  <input
                    id="new-staff-phone-input"
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g., 98480 12345"
                    className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    {language === 'te' ? 'బాధ్యత / రోల్' : 'Job Role'}
                  </label>
                  <div className="relative">
                    <select
                      id="new-staff-role-select"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-slate-800 cursor-pointer transition"
                    >
                      <option value="Designer">Graphic Designer (CorelDRAW / Photoshop)</option>
                      <option value="Printer Operator">Printer Machine Operator (Konica / Star)</option>
                      <option value="Finishing & Pasting">Finishing & Pasting Technician</option>
                      <option value="Delivery & Helper">Delivery Boy & Shop Assistant</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      {language === 'te' ? 'వేతన రకం' : 'Wage Type'}
                    </label>
                    <div className="relative">
                      <select
                        id="new-staff-wage-type-select"
                        value={newWageType}
                        onChange={(e) => setNewWageType(e.target.value as any)}
                        className="w-full appearance-none pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-slate-800 cursor-pointer transition"
                      >
                        <option value="Monthly">Monthly Fixed</option>
                        <option value="Daily">Daily Wage</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      {language === 'te' ? 'మొత్తం (₹)' : 'Amount (₹)'} *
                    </label>
                    <input
                      id="new-staff-wage-amount-input"
                      type="number"
                      required
                      min={0}
                      value={newWageAmount}
                      onChange={(e) => setNewWageAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-bold text-slate-900 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  id="cancel-add-staff-btn"
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  {t.cancel}
                </button>
                <button
                  id="submit-add-staff-btn"
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs transition inline-flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>{language === 'te' ? 'సిబ్బందిని చేర్చండి' : 'Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
