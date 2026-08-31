import React, { useState, useEffect, useRef } from 'react';
import { 
  FiX, 
  FiEdit2, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiCalendar, 
  FiMapPin, 
  FiChevronDown, 
  FiCheckCircle 
} from 'react-icons/fi';
import type { Member } from '../types/member.types';

interface EditMemberModalProps {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  onSubmit: (updatedMember: Member) => void;
}

interface DropdownOption {
  value: string | number;
  label: string;
}

// Component Dropdown Tùy chỉnh với Hiệu ứng Mở mượt mà
const CustomDropdown: React.FC<{
  value: string | number;
  options: DropdownOption[];
  onChange: (val: any) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, options, onChange, placeholder = '-- Chọn --', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative w-full ${isOpen ? 'z-[90]' : 'z-10'} ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#040405] border rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-white font-mono outline-none transition-all duration-200 cursor-pointer shadow-sm text-left uppercase ${
          isOpen ? 'border-gym-neon shadow-[0_0_12px_rgba(204,255,0,0.15)] bg-[#0d0d12]' : 'border-[#1f1f24] hover:border-gym-neon/60'
        }`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <FiChevronDown
          size={14}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ease-out ${
            isOpen ? 'rotate-180 text-gym-neon' : ''
          }`}
        />
      </button>

      <div
        className={`absolute top-[calc(100%+6px)] left-0 right-0 z-[100] bg-[#0c0c14] border border-[#2c2c3e] rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-all duration-200 ease-out origin-top max-h-60 overflow-y-auto ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        {options.map((opt) => {
          const isSelected = String(opt.value) === String(value);
          return (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3.5 py-2.5 text-xs font-mono font-bold transition-all duration-150 cursor-pointer flex items-center justify-between uppercase ${
                isSelected
                  ? 'bg-gym-neon text-black font-black'
                  : 'text-gray-300 hover:bg-[#181826] hover:text-gym-neon hover:pl-4.5'
              }`}
            >
              <span className="truncate">{opt.label}</span>
              {isSelected && <FiCheckCircle size={13} className="text-black ml-2 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  member,
  onClose,
  onSubmit,
}) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (isOpen && member) {
      // Tách Họ và tên lót & Tên
      const nameParts = (member.fullName || '').trim().split(' ');
      if (member.lastName || member.firstName) {
        setLastName(member.lastName || '');
        setFirstName(member.firstName || '');
      } else if (nameParts.length > 1) {
        setFirstName(nameParts[nameParts.length - 1]);
        setLastName(nameParts.slice(0, nameParts.length - 1).join(' '));
      } else {
        setLastName('');
        setFirstName(member.fullName || '');
      }

      setPhoneNumber(member.phoneNumber || '');
      setEmail(member.email || '');
      setDob(member.dateOfBirth ? member.dateOfBirth.split('T')[0] : '');
      setAddress((member as any).address || '');

      if (member.gender === 'NAM') setGender('MALE');
      else if (member.gender === 'NỮ') setGender('FEMALE');
      else setGender('OTHER');
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !phoneNumber) {
      alert('Vui lòng nhập Tên và Số điện thoại!');
      return;
    }

    const updatedFullName = `${lastName.trim()} ${firstName.trim()}`.trim();

    onSubmit({
      ...member,
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      fullName: updatedFullName,
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      dateOfBirth: dob,
      gender: gender === 'MALE' ? 'NAM' : gender === 'FEMALE' ? 'NỮ' : 'KHÁC',
      ...(address ? { address: address.trim() } : {})
    } as any);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0b0b0e] border border-[#1f1f26] rounded-3xl w-full max-w-xl shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#18181f] flex items-center justify-between bg-[#08080a] rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gym-neon/10 text-gym-neon border border-gym-neon/20">
              <FiEdit2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-white m-0">
                CHỈNH SỬA HỘI VIÊN
              </h3>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest m-0 mt-0.5">
                MÃ HỘI VIÊN: {member.memberCode || `#${member.id.slice(0, 5)}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#14141a] border border-[#22222d] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Form Body - Đúng 7 trường thông tin */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          {/* Hàng 1: Họ và tên lót * & Tên hội viên * */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-40">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiUser size={12} className="text-gym-neon" /> Họ và tên lót *
              </label>
              <input
                type="text"
                required
                placeholder="VD: NGUYỄN VĂN"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiUser size={12} className="text-gym-neon" /> Tên hội viên *
              </label>
              <input
                type="text"
                required
                placeholder="VD: AN"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors"
              />
            </div>
          </div>

          {/* Hàng 2: Số điện thoại * & Địa chỉ Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-30">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiPhone size={12} className="text-gym-neon" /> Số điện thoại *
              </label>
              <input
                type="text"
                required
                placeholder="VD: 0901234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiMail size={12} className="text-gym-neon" /> Địa chỉ Email
              </label>
              <input
                type="email"
                placeholder="VD: email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors"
              />
            </div>
          </div>

          {/* Hàng 3: Giới tính & Ngày sinh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-20">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiUser size={12} className="text-gym-neon" /> Giới tính
              </label>
              <CustomDropdown
                value={gender}
                options={[
                  { value: 'MALE', label: 'NAM' },
                  { value: 'FEMALE', label: 'NỮ' },
                  { value: 'OTHER', label: 'KHÁC' }
                ]}
                onChange={(val) => setGender(val)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiCalendar size={12} className="text-gym-neon" /> Ngày sinh
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
              />
            </div>
          </div>

          {/* Hàng 4: Địa chỉ */}
          <div className="flex flex-col gap-1.5 relative z-10">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <FiMapPin size={12} className="text-gym-neon" /> Địa chỉ
            </label>
            <input
              type="text"
              placeholder="VD: 123 Nguyễn Huệ, TP.HCM"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#18181f] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#14141a] border border-[#22222d] text-gray-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-gym-neon text-black hover:bg-[#b3e600] text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)]"
            >
              CẬP NHẬT
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
