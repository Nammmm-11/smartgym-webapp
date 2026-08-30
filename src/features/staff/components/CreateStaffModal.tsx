import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import type { StaffRole, StaffMember } from '../types/staff.types';

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<StaffMember, 'id' | 'staffCode' | 'isDeleted'>) => void;
  defaultRole: StaffRole;
}

export const CreateStaffModal: React.FC<CreateStaffModalProps> = ({ isOpen, onClose, onSubmit, defaultRole }) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [role, setRole] = useState<StaffRole>(defaultRole);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName || !firstName || !phoneNumber) {
      alert('Vui lòng nhập đầy đủ Họ lót, Tên và số điện thoại!');
      return;
    }

    const trimmedLastName = lastName.trim();
    const trimmedFirstName = firstName.trim();

    onSubmit({
      lastName: trimmedLastName,
      firstName: trimmedFirstName,
      fullName: `${trimmedLastName} ${trimmedFirstName}`, // Gộp lại để hiển thị nếu cần
      phoneNumber,
      email: email || `${phoneNumber}@fitgym.vn`,
      role,
      status: 'ACTIVE',
      salary: Number(salary) || 5000000,
      completedShifts: 0,
      isCheckedInToday: false,
      activeMembersCount: role === 'TRAINER' ? 0 : undefined,
      ptRevenue: role === 'TRAINER' ? 0 : undefined,
      commission: role === 'TRAINER' ? 0 : undefined,
    });

    setLastName('');
    setFirstName('');
    setPhoneNumber('');
    setEmail('');
    setSalary('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#09090b] border border-[#222228] rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[10px] text-gym-neon font-mono tracking-widest uppercase">HỆ THỐNG QUẢN LÝ</span>
            <h3 className="text-xl font-black italic tracking-wide text-white m-0 mt-0.5 uppercase">THÊM NHÂN SỰ MỚI</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white cursor-pointer">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mb-1">VAI TRÒ</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as StaffRole)}
              className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gym-neon font-mono cursor-pointer"
            >
              <option value="RECEPTIONIST">NHÂN VIÊN QUẦY</option>
              <option value="TRAINER">HUẤN LUYỆN VIÊN (PT)</option>
            </select>
          </div>

          {/* Tách riêng Họ và Tên lót & Tên chính */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mb-1">HỌ VÀ TÊN LÓT</label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Văn"
                className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mb-1">TÊN</label>
              <input
                type="text"
                required
                placeholder="VD: An"
                className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mb-1">SỐ ĐIỆN THOẠI</label>
            <input
              type="text"
              required
              placeholder="VD: 0901234567"
              className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mb-1">EMAIL ĐĂNG NHẬP</label>
            <input
              type="email"
              placeholder="VD: staff@fitgym.vn"
              className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mb-1">LƯƠNG CƠ BẢN (VNĐ)</label>
            <input
              type="number"
              placeholder="VD: 7000000"
              className="w-full bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon font-mono"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gym-neon text-black font-black italic tracking-widest uppercase rounded-xl py-3.5 mt-2 hover:bg-[#b3e600] transition-colors text-xs cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)]"
          >
            XÁC NHẬN THÊM &gt;_
          </button>
        </form>
      </div>
    </div>
  );
};