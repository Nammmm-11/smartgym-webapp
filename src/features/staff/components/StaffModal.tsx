import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiEye, FiEyeOff, FiChevronDown, FiCheck } from 'react-icons/fi';
import type { StaffMember, StaffRole } from '../types/staff.types';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (staffData: any) => void;
  staffToEdit?: StaffMember | null;
  defaultRole?: StaffRole;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  staffToEdit,
  defaultRole = 'RECEPTIONIST'
}) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [shift, setShift] = useState('CA SÁNG (06:00 - 14:00)');
  const [role, setRole] = useState<StaffRole>(defaultRole);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [baseSalary, setBaseSalary] = useState('5000000');
  const [hourlySalary, setHourlySalary] = useState('');

  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isSalaryOpen, setIsSalaryOpen] = useState(false);

  const shiftRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const salaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shiftRef.current && !shiftRef.current.contains(event.target as Node)) setIsShiftOpen(false);
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) setIsRoleOpen(false);
      if (salaryRef.current && !salaryRef.current.contains(event.target as Node)) setIsSalaryOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [ptRevenue, setPtRevenue] = useState('0');
  const [commission, setCommission] = useState('0');
  const [activeMembersCount, setActiveMembersCount] = useState('0');

  useEffect(() => {
    if (staffToEdit) {
      setLastName(staffToEdit.lastName || '');
      setFirstName(staffToEdit.firstName || '');
      setPhoneNumber(staffToEdit.phoneNumber || '');
      setEmail(staffToEdit.email || '');
      setRole(staffToEdit.role || defaultRole);
      setBaseSalary(staffToEdit.salary ? String(staffToEdit.salary) : '5000000');
      setPtRevenue(staffToEdit.ptRevenue ? String(staffToEdit.ptRevenue) : '0');
      setCommission(staffToEdit.commission ? String(staffToEdit.commission) : '0');
      setActiveMembersCount(staffToEdit.activeMembersCount ? String(staffToEdit.activeMembersCount) : '0');
      setPassword('');
    } else {
      setLastName('');
      setFirstName('');
      setPhoneNumber('');
      setEmail('');
      setRole(defaultRole);
      setBaseSalary('5000000');
      setHourlySalary('');
      setPtRevenue('0');
      setCommission('0');
      setActiveMembersCount('0');
      setPassword('');
    }
  }, [staffToEdit, isOpen, defaultRole]);

  if (!isOpen) return null;

  const usernameAuto = email ? email.split('@')[0] : 'Tự động theo email';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName || !firstName || !phoneNumber) {
      alert('Vui lòng nhập đầy đủ Họ lót, Tên và Số điện thoại!');
      return;
    }

    const payload = {
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      fullName: `${lastName.trim()} ${firstName.trim()}`,
      shift,
      role,
      phoneNumber,
      email: email || `${phoneNumber}@fit.com`,
      username: usernameAuto,
      password: password || undefined,
      salary: Number(baseSalary) || 0,
      hourlySalary: Number(hourlySalary) || 0,
      ptRevenue: Number(ptRevenue) || 0,
      commission: Number(commission) || 0,
      activeMembersCount: Number(activeMembersCount) || 0,
      status: 'ACTIVE',
      completedShifts: staffToEdit ? staffToEdit.completedShifts : 0,
      isCheckedInToday: staffToEdit ? staffToEdit.isCheckedInToday : false,
    };

    onSubmit(payload);
  };

  const isEditing = !!staffToEdit;

  const shiftOptions = [
    'CA SÁNG (06:00 - 14:00)',
    'CA CHIỀU (14:00 - 22:00)',
    'CA FULLTIME'
  ];

  const roleOptions = [
    { label: 'NHÂN VIÊN QUẦY', value: 'RECEPTIONIST' as StaffRole },
    { label: 'HUẤN LUYỆN VIÊN (PT)', value: 'TRAINER' as StaffRole }
  ];

  const salaryOptions = [
    { label: '5.000.000đ', value: '5000000' },
    { label: '7.000.000đ', value: '7000000' },
    { label: '8.000.000đ', value: '8000000' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#08080a] border border-[#1f1f24] rounded-3xl p-8 shadow-2xl relative my-8">
        
        {/* Nút đóng X */}
        <button 
          type="button"
          onClick={onClose} 
          className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <FiX size={20} />
        </button>

        {/* TIÊU ĐỀ MODAL (Phóng to chữ, màu vàng neon) */}
        <div className="mb-6">
          <h2 className="text-2xl font-black italic tracking-wide uppercase text-gym-neon m-0 mt-0.5">
            {isEditing ? 'CẬP NHẬT NHÂN SỰ' : 'THÊM NHÂN VIÊN QUẦY '}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* HÀNG 1: HỌ LÓT & TÊN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">HỌ VÀ TÊN LÓT</label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">TÊN</label>
              <input
                type="text"
                required
                placeholder="VD: An"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono transition-all duration-200"
              />
            </div>
          </div>

          {/* HÀNG 2: VỊ TRÍ / CA LÀM & VAI TRÒ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vị trí / Ca làm */}
            <div className="flex flex-col gap-1.5 relative" ref={shiftRef}>
              <label className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">VỊ TRÍ / CA LÀM</label>
              <div
                onClick={() => { setIsShiftOpen(!isShiftOpen); setIsRoleOpen(false); setIsSalaryOpen(false); }}
                className="w-full bg-[#040405] border border-[#1f1f24] hover:border-[#333] rounded-xl px-4 py-3.5 text-xs text-white font-mono flex items-center justify-between cursor-pointer transition-all duration-200 select-none"
              >
                <span>{shift}</span>
                <FiChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isShiftOpen ? 'rotate-180 text-gym-neon' : ''}`} />
              </div>

              <div className={`absolute top-full left-0 right-0 mt-2 bg-[#0c0c0f] border border-[#22222a] rounded-xl overflow-hidden shadow-2xl z-50 transition-all duration-300 origin-top ${isShiftOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                {shiftOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => { setShift(opt); setIsShiftOpen(false); }}
                    className="px-4 py-3 text-xs text-gray-300 hover:text-black hover:bg-gym-neon font-mono cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    {shift === opt && <FiCheck size={14} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Vai trò */}
            <div className="flex flex-col gap-1.5 relative" ref={roleRef}>
              <label className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">VAI TRÒ</label>
              <div
                onClick={() => { setIsRoleOpen(!isRoleOpen); setIsShiftOpen(false); setIsSalaryOpen(false); }}
                className="w-full bg-[#040405] border border-[#1f1f24] hover:border-[#333] rounded-xl px-4 py-3.5 text-xs text-white font-mono flex items-center justify-between cursor-pointer transition-all duration-200 select-none"
              >
                <span>{roleOptions.find(r => r.value === role)?.label}</span>
                <FiChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isRoleOpen ? 'rotate-180 text-gym-neon' : ''}`} />
              </div>

              <div className={`absolute top-full left-0 right-0 mt-2 bg-[#0c0c0f] border border-[#22222a] rounded-xl overflow-hidden shadow-2xl z-50 transition-all duration-300 origin-top ${isRoleOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                {roleOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => { setRole(opt.value); setIsRoleOpen(false); }}
                    className="px-4 py-3 text-xs text-gray-300 hover:text-black hover:bg-gym-neon font-mono cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <span>{opt.label}</span>
                    {role === opt.value && <FiCheck size={14} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HÀNG 3: SỐ ĐIỆN THOẠI & EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">SỐ ĐIỆN THOẠI</label>
              <input
                type="text"
                required
                placeholder="Nhập số điện thoại..."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gym-neon font-mono tracking-[0.2em] uppercase font-bold">
                EMAIL (PHẢI DÙNG ĐUÔI @FIT.COM)
              </label>
              <input
                type="email"
                required
                placeholder="example@fit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3.5 text-xs text-gym-neon placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono transition-all duration-200"
              />
            </div>
          </div>

          {/* HÀNG 4: TÊN ĐĂNG NHẬP & MẬT KHẨU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">TÊN ĐĂNG NHẬP (LẤY THEO EMAIL)</label>
              <input
                type="text"
                disabled
                value={usernameAuto}
                className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3.5 text-xs text-gray-500 font-mono cursor-not-allowed select-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">MẬT KHẨU</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={isEditing ? "(Để trống nếu không đổi)" : "Nhập mật khẩu..."}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono pr-12 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* HÀNG 5: LƯƠNG CƠ BẢN & LƯƠNG/GIỜ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 relative" ref={salaryRef}>
              <label className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">LƯƠNG CƠ BẢN</label>
              <div
                onClick={() => { setIsSalaryOpen(!isSalaryOpen); setIsShiftOpen(false); setIsRoleOpen(false); }}
                className="w-full bg-[#040405] border border-gym-neon rounded-xl px-4 py-3.5 text-xs text-gym-neon font-mono flex items-center justify-between cursor-pointer shadow-[0_0_10px_rgba(204,255,0,0.15)] select-none"
              >
                <span>{salaryOptions.find(s => s.value === baseSalary)?.label || baseSalary + 'đ'}</span>
                <FiChevronDown size={16} className={`text-gym-neon transition-transform duration-300 ${isSalaryOpen ? 'rotate-180' : ''}`} />
              </div>

              <div className={`absolute top-full left-0 right-0 mt-2 bg-[#0c0c0f] border border-[#22222a] rounded-xl overflow-hidden shadow-2xl z-50 transition-all duration-300 origin-top ${isSalaryOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                {salaryOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => { setBaseSalary(opt.value); setIsSalaryOpen(false); }}
                    className="px-4 py-3 text-xs text-gray-300 hover:text-black hover:bg-gym-neon font-mono cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <span>{opt.label}</span>
                    {baseSalary === opt.value && <FiCheck size={14} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase">LƯƠNG/GIỜ</label>
              <input
                type="number"
                placeholder="0"
                value={hourlySalary}
                onChange={(e) => setHourlySalary(e.target.value)}
                className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono transition-all duration-200"
              />
            </div>
          </div>

          {/* HÀNG 6: NÚT HỦY & THÊM MỚI */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#040405] border border-[#1f1f24] text-gray-300 font-black italic tracking-widest uppercase rounded-xl py-4 hover:border-gray-500 transition-all duration-200 text-xs cursor-pointer"
            >
              HỦY
            </button>
            <button
              type="submit"
              className="w-full bg-gym-neon text-black font-black italic tracking-widest uppercase rounded-xl py-4 hover:bg-[#b3e600] transition-all duration-200 text-xs cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.25)] hover:shadow-[0_0_20px_rgba(204,255,0,0.4)]"
            >
              {isEditing ? 'CẬP NHẬT' : 'THÊM MỚI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};