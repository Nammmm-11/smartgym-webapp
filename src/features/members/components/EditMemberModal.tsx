import React, { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiUser, FiPhone, FiMail, FiCalendar, FiPackage, FiShield, FiCreditCard, FiMapPin, FiPercent } from 'react-icons/fi';
import { gymPackageService, type GymPackageDto } from '../../gymPackages/services/gymPackage.service';
import { staffApi } from '../../staff/api/staff.api';
import type { StaffMember } from '../../staff/types/staff.types';
import type { Member } from '../types/member.types';

interface EditMemberModalProps {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  onSubmit: (updatedMember: Member) => void;
}

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
  const [status, setStatus] = useState<'ACTIVE' | 'EXPIRED' | 'SUSPENDED'>('ACTIVE');
  
  // Dữ liệu thật từ SQL Server
  const [packages, setPackages] = useState<GymPackageDto[]>([]);
  const [receptionists, setReceptionists] = useState<StaffMember[]>([]);
  
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CASH'>('BANK_TRANSFER');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    if (isOpen && member) {
      loadRealSqlDependencies(member);
    }
  }, [isOpen, member]);

  const loadRealSqlDependencies = async (currentMember: Member) => {
    try {
      // 1. Tải danh sách Gói tập thật từ SQL
      const pkgResponse = await gymPackageService.getAll();
      const pkgData = pkgResponse.data?.items || [];
      const activePkgs = pkgData.filter((p: GymPackageDto) => p.isActive);
      setPackages(activePkgs);

      // 2. Tải danh sách Nhân viên quầy thật từ SQL
      const staffData = await staffApi.getStaffs();
      const receptionistList = staffData.filter((s: StaffMember) => !s.isDeleted && s.role === 'RECEPTIONIST');
      setReceptionists(receptionistList);

      // 3. Khởi tạo dữ liệu từ member hiện tại
      const nameParts = (currentMember.fullName || '').trim().split(' ');
      if (currentMember.lastName || currentMember.firstName) {
        setLastName(currentMember.lastName || '');
        setFirstName(currentMember.firstName || '');
      } else if (nameParts.length > 1) {
        setFirstName(nameParts[nameParts.length - 1]);
        setLastName(nameParts.slice(0, nameParts.length - 1).join(' '));
      } else {
        setLastName('');
        setFirstName(currentMember.fullName || '');
      }

      setPhoneNumber(currentMember.phoneNumber || '');
      setEmail(currentMember.email || '');
      setDob(currentMember.dateOfBirth || '');
      if (currentMember.startDate) setStartDate(currentMember.startDate);
      setAddress((currentMember as any).address || '');
      setStatus(currentMember.status || 'ACTIVE');

      if (currentMember.gender === 'NAM') setGender('MALE');
      else if (currentMember.gender === 'NỮ') setGender('FEMALE');
      else setGender('OTHER');

      // Khớp gói tập thật từ SQL
      const matchedPkg = activePkgs.find((p: GymPackageDto) => (p.name || '').toLowerCase() === (currentMember.packageName || '').toLowerCase());
      if (matchedPkg) {
        setSelectedPackageId(matchedPkg.id || '');
      } else if (activePkgs.length > 0) {
        setSelectedPackageId(activePkgs[0].id || '');
      }

      // Khớp nhân viên thật từ SQL
      if (currentMember.assignedStaffId) {
        const matched = receptionistList.find(s => 
          s.id.toLowerCase() === currentMember.assignedStaffId?.toLowerCase() ||
          (s.userId && s.userId.toLowerCase() === currentMember.assignedStaffId?.toLowerCase())
        );
        if (matched) {
          setSelectedStaffId(matched.id);
        } else {
          setSelectedStaffId(currentMember.assignedStaffId);
        }
      } else {
        const matchedStaff = receptionistList.find((s: StaffMember) => 
          currentMember.assignedStaff && 
          currentMember.assignedStaff !== 'Chưa phân công' &&
          s.fullName.toLowerCase().trim() === currentMember.assignedStaff.toLowerCase().trim()
        );
        if (matchedStaff) {
          setSelectedStaffId(matchedStaff.id);
        } else if (receptionistList.length > 0) {
          setSelectedStaffId(receptionistList[0].id);
        }
      }

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thật từ SQL:", error);
    }
  };

  const selectedPkg = packages.find(p => p.id === selectedPackageId);
  const selectedStaff = receptionists.find(s => s.id === selectedStaffId);

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
      phoneNumber,
      email,
      dateOfBirth: dob,
      gender: gender === 'MALE' ? 'NAM' : gender === 'FEMALE' ? 'NỮ' : 'KHÁC',
      packageName: selectedPkg?.name || member.packageName,
      assignedStaff: selectedStaff?.fullName || (selectedStaffId ? member.assignedStaff : 'Chưa phân công'),
      assignedStaffId: selectedStaffId || undefined,
      expiryDate,
      status,
      ...(address ? { address } : {})
    } as any);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0b0b0e] border border-[#1f1f26] rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-y-auto">
        
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
                MÃ HỘI VIÊN: {member.memberCode}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Tách Họ và tên lót & Tên */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* SĐT & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Giới tính & Ngày sinh */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiUser size={12} className="text-gym-neon" /> Giới tính
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
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

          {/* Địa chỉ */}
          <div className="flex flex-col gap-1.5">
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

          {/* Chọn gói tập thật từ SQL & Nhân viên quầy thật từ SQL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiPackage size={12} className="text-gym-neon" /> Chọn gói tập (Dữ liệu thật SQL)
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.durationInMonths} tháng) - {pkg.price.toLocaleString('vi-VN')} đ
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiShield size={12} className="text-gym-neon" /> Nhân viên quầy phụ trách (Dữ liệu thật SQL)
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
              >
                <option value="">-- Không phân công --</option>
                {receptionists.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.fullName} ({staff.staffCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Trạng thái & Phương thức thanh toán */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiCalendar size={12} className="text-gym-neon" /> Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
              >
                <option value="ACTIVE">HOẠT ĐỘNG</option>
                <option value="EXPIRED">HẾT HẠN</option>
                <option value="SUSPENDED">TẠM DỪNG</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiCalendar size={12} className="text-gym-neon" /> Hạn sử dụng
              </label>
              <input
                type="date"
                disabled
                value={expiryDate}
                className="bg-[#040405]/50 border border-[#1f1f24] rounded-xl px-4 py-2.5 text-xs text-gray-400 font-mono outline-none cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiCreditCard size={12} className="text-gym-neon" /> Thanh toán
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
              >
                <option value="BANK_TRANSFER">Chuyển khoản</option>
                <option value="CASH">Tiền mặt</option>
              </select>
            </div>
          </div>

          {/* Mức giảm giá */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <FiPercent size={12} className="text-gym-neon" /> Mức giảm giá
            </label>
            <select
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
            >
              <option value={0}>0% (Không giảm)</option>
              <option value={3}>3%</option>
              <option value={5}>5%</option>
              <option value={10}>10%</option>
            </select>
          </div>

          {/* Bảng tổng quan thông tin hóa đơn (SUMMARY BOX) */}
          <div className="mt-2 bg-[#0c0c0f] border border-[#1e1e26] rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-[#181820] pb-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">THÔNG TIN HOÁ ĐƠN ĐĂNG KÝ</span>
              <span className="text-[10px] font-mono text-gym-neon font-black tracking-widest">SUMMARY</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-gray-300">
              <span className="text-gray-400">GÓI TẬP ĐĂNG KÝ:</span>
              <span className="font-black italic uppercase text-white">
                {selectedPkg ? `${selectedPkg.name} (${selectedPkg.durationInMonths} THÁNG)` : 'CHƯA CHỌN GÓI'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-gray-300">
              <span className="text-gray-400">GIÁ NIÊM YẾT:</span>
              <span className="font-mono text-white">{originalPrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex items-center justify-between text-xs font-mono text-red-400">
                <span>GIẢM GIÁ ({discountPercent}%):</span>
                <span>-{discountAmount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            )}

            <div className="border-t border-dashed border-[#262633] pt-2 flex items-center justify-between mt-1">
              <span className="text-xs font-black italic uppercase text-white tracking-wider">TỔNG TIỀN THANH TOÁN:</span>
              <span className="text-base font-black text-gym-neon font-mono">
                {finalAmount.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#18181f]">
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
