import React, { useState, useEffect, useRef } from 'react';
import { 
  FiX, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiPackage, 
  FiShield, 
  FiCreditCard, 
  FiCalendar, 
  FiMapPin, 
  FiPercent, 
  FiChevronDown, 
  FiCheckCircle,
  FiUserPlus
} from 'react-icons/fi';
import { gymPackageService, type GymPackageDto } from '../../gymPackages/services/gymPackage.service';
import { staffApi } from '../../staff/api/staff.api';
import type { StaffMember } from '../../staff/types/staff.types';

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: any) => void;
}

interface DropdownOption {
  value: string | number;
  label: string;
}

// Component CustomDropdown mượt mà
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
        className={`w-full bg-[#040405] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-white font-mono outline-none transition-all duration-200 cursor-pointer shadow-sm text-left uppercase ${
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
        {options.length === 0 ? (
          <div className="px-3.5 py-2.5 text-xs text-gray-500 font-mono text-center">
            Không có dữ liệu
          </div>
        ) : (
          options.map((opt) => {
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
          })
        )}
      </div>
    </div>
  );
};

export const CreateMemberModal: React.FC<CreateMemberModalProps> = ({
  isOpen,
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
  
  const [packages, setPackages] = useState<GymPackageDto[]>([]);
  const [receptionists, setReceptionists] = useState<StaffMember[]>([]);
  
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CASH'>('BANK_TRANSFER');
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      loadDependencies();
      setLastName('');
      setFirstName('');
      setPhoneNumber('');
      setEmail('');
      setGender('MALE');
      setDob('');
      setAddress('');
      setSelectedPackageId('');
      setSelectedStaffId('');
      setPaymentMethod('BANK_TRANSFER');
      setStartDate(new Date().toISOString().split('T')[0]);
      setDiscountPercent(0);
    }
  }, [isOpen]);

  const loadDependencies = async () => {
    try {
      const response = await gymPackageService.getAll();
      const pkgData = response.data?.items || [];
      const activePkgs = pkgData.filter((p: GymPackageDto) => p.isActive);
      setPackages(activePkgs);
      if (activePkgs.length > 0) {
        setSelectedPackageId(activePkgs[0].id || '');
      }

      const staffData = await staffApi.getStaffs();
      const receptionistList = staffData.filter((s: StaffMember) => !s.isDeleted && s.role === 'RECEPTIONIST');
      setReceptionists(receptionistList);
      if (receptionistList.length > 0) {
        setSelectedStaffId(receptionistList[0].id);
      }
    } catch (error) {
      console.error("Failed to load dependency data", error);
    }
  };

  const selectedPkg = packages.find(p => p.id === selectedPackageId);
  const originalPrice = selectedPkg?.price || 0;
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalAmount = Math.max(0, originalPrice - discountAmount);

  const calculateExpiryDate = (start: string, months: number) => {
    if (!start) return '';
    const date = new Date(start);
    date.setMonth(date.getMonth() + (months || 1));
    return date.toISOString().split('T')[0];
  };

  const expiryDate = calculateExpiryDate(startDate, selectedPkg?.durationInMonths || 1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalLastName = lastName.trim() || 'Hội viên';
    const finalFirstName = firstName.trim() || 'Mới';
    const finalPhoneNumber = phoneNumber.trim() || '0900000000';
    const finalFullName = `${finalLastName} ${finalFirstName}`.trim();

    onSubmit({
      lastName: finalLastName,
      firstName: finalFirstName,
      fullName: finalFullName,
      phoneNumber: finalPhoneNumber,
      email,
      dateOfBirth: dob,
      gender: gender === 'MALE' ? 'NAM' : gender === 'FEMALE' ? 'NỮ' : 'KHÁC',
      packageId: selectedPackageId,
      assignedStaffId: selectedStaffId || undefined,
      paymentMethod,
      startDate,
      expiryDate,
      discountPercent,
      ...(address ? { address } : {})
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#09090c] border border-[#1f1f26] rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col my-auto no-scrollbar animate-in fade-in zoom-in-95 duration-150 text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#18181f] flex items-center justify-between bg-[#08080a] rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gym-neon/10 text-gym-neon border border-gym-neon/20 shadow-[0_0_15px_rgba(204,255,0,0.15)]">
              <FiUserPlus size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white m-0">
                THÊM HỘI VIÊN MỚI
              </h3>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest m-0 mt-0.5">
                ĐĂNG KÝ HỘI VIÊN VÀO HỆ THỐNG SMARTGYM
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#14141a] border border-[#22222d] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer hover:border-gray-500"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Form Body - Grid 2 Cột Rộng Rãi Vừa Khít Toàn Màn Hình */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 flex flex-col gap-5">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CỘT TRÁI: THÔNG TIN HỒ SƠ HỘI VIÊN */}
            <div className="bg-[#0e0e13] border border-[#1d1d26] rounded-2xl p-5 flex flex-col gap-3.5">
              <div className="flex items-center gap-2 pb-1 border-b border-[#1a1a24]">
                <span className="w-2 h-2 rounded-full bg-gym-neon"></span>
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase">
                  1. THÔNG TIN HỘI VIÊN
                </span>
              </div>

              {/* Họ & Tên */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-40">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiUser size={11} className="text-gym-neon" /> Họ & tên lót *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: NGUYỄN VĂN"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-[#040405] border border-[#22222d] focus:border-gym-neon rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiUser size={11} className="text-gym-neon" /> Tên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: AN"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-[#040405] border border-[#22222d] focus:border-gym-neon rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              {/* SĐT & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-30">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiPhone size={11} className="text-gym-neon" /> Số điện thoại *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0901234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-[#040405] border border-[#22222d] focus:border-gym-neon rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiMail size={11} className="text-gym-neon" /> Email
                  </label>
                  <input
                    type="email"
                    placeholder="VD: email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#040405] border border-[#22222d] focus:border-gym-neon rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Giới tính & Ngày sinh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-20">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiUser size={11} className="text-gym-neon" /> Giới tính
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

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiCalendar size={11} className="text-gym-neon" /> Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-[#040405] border border-[#22222d] focus:border-gym-neon rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="flex flex-col gap-1 relative z-10">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <FiMapPin size={11} className="text-gym-neon" /> Địa chỉ liên hệ
                </label>
                <input
                  type="text"
                  placeholder="VD: 123 Nguyễn Huệ, TP.HCM"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-[#040405] border border-[#22222d] focus:border-gym-neon rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none transition-colors"
                />
              </div>

            </div>

            {/* CỘT PHẢI: GÓI TẬP, TÀI CHÍNH & TỔNG QUAN HÓA ĐƠN */}
            <div className="bg-[#0e0e13] border border-[#1d1d26] rounded-2xl p-5 flex flex-col gap-3.5">
              <div className="flex items-center gap-2 pb-1 border-b border-[#1a1a24]">
                <span className="w-2 h-2 rounded-full bg-gym-neon"></span>
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase">
                  2. GÓI TẬP & THANH TOÁN
                </span>
              </div>

              {/* Gói tập & Nhân viên quầy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-40">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiPackage size={11} className="text-gym-neon" /> Chọn gói tập (SQL)
                  </label>
                  <CustomDropdown
                    value={selectedPackageId}
                    options={packages.map((pkg) => ({
                      value: pkg.id || '',
                      label: `${pkg.name} (${pkg.price.toLocaleString('vi-VN')}Đ)`
                    }))}
                    onChange={(val) => setSelectedPackageId(val)}
                    placeholder="-- CHỌN GÓI TẬP --"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiShield size={11} className="text-gym-neon" /> NV Quầy phụ trách (SQL)
                  </label>
                  <CustomDropdown
                    value={selectedStaffId}
                    options={[
                      { value: '', label: '-- Không phân công --' },
                      ...receptionists.map((staff) => ({
                        value: staff.id,
                        label: `${staff.fullName} (${staff.staffCode})`
                      }))
                    ]}
                    onChange={(val) => setSelectedStaffId(val)}
                    placeholder="-- CHỌN NHÂN VIÊN --"
                  />
                </div>
              </div>

              {/* Ngày đóng tiền & Hạn sử dụng (Tự động) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-30">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiCalendar size={11} className="text-gym-neon" /> Ngày đóng tiền
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-[#040405] border border-[#22222d] focus:border-gym-neon rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiCalendar size={11} className="text-gym-neon" /> Hạn dùng (Auto)
                  </label>
                  <div className="bg-[#040405] border border-[#22222d] rounded-xl px-3.5 py-2 text-xs text-gym-neon font-mono font-bold">
                    {expiryDate || '--'}
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán & Giảm giá */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-20">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiCreditCard size={11} className="text-gym-neon" /> Thanh toán
                  </label>
                  <CustomDropdown
                    value={paymentMethod}
                    options={[
                      { value: 'BANK_TRANSFER', label: '🏦 Chuyển khoản (QR)' },
                      { value: 'CASH', label: '💵 Tiền mặt' }
                    ]}
                    onChange={(val) => setPaymentMethod(val)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <FiPercent size={11} className="text-gym-neon" /> Giảm giá
                  </label>
                  <CustomDropdown
                    value={discountPercent}
                    options={[
                      { value: 0, label: '0% (Không giảm)' },
                      { value: 5, label: 'Giảm 5%' },
                      { value: 10, label: 'Giảm 10%' },
                      { value: 15, label: 'Giảm 15%' }
                    ]}
                    onChange={(val) => setDiscountPercent(Number(val))}
                  />
                </div>
              </div>

              {/* Bảng tổng quan thông tin hóa đơn (SUMMARY BOX) */}
              <div className="bg-[#060608] border border-[#1f1f2a] rounded-xl p-3 flex flex-col gap-1.5 font-mono text-xs mt-1">
                <div className="flex items-center justify-between text-gray-400 text-[11px]">
                  <span>GIÁ NIÊM YẾT:</span>
                  <span className="text-white font-bold">{originalPrice.toLocaleString('vi-VN')} đ</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-red-400 text-[11px]">
                    <span>GIẢM GIÁ ({discountPercent}%):</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}

                <div className="border-t border-[#1a1a24] pt-1.5 flex items-center justify-between">
                  <span className="font-black italic uppercase text-gym-neon text-xs">TỔNG PHẢI THU:</span>
                  <span className="text-lg font-black text-gym-neon">
                    {finalAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#18181f]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#14141a] border border-[#22222d] text-gray-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer hover:border-gray-500"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-gym-neon text-black hover:bg-[#b3e600] text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)]"
            >
              TẠO HỘI VIÊN MỚI
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};