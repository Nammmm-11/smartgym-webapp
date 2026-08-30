import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiPhone, FiMail, FiPackage, FiShield, FiCreditCard, FiCalendar, FiMapPin, FiPercent } from 'react-icons/fi';
import { gymPackageService, type GymPackageDto } from '../../gymPackages/services/gymPackage.service';
import { staffApi } from '../../staff/api/staff.api';
import type { StaffMember } from '../../staff/types/staff.types';

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (memberData: any) => void;
}

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
      const receptionistList = staffData.filter((s: StaffMember) => !s.isDeleted);
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

    const fullName = `${lastName.trim()} ${firstName.trim()}`.trim();

    // Tự động tích lũy doanh thu cho nhân viên quầy phụ trách
    if (selectedStaffId) {
      try {
        const salesKey = `smartgym_staff_sales_${selectedStaffId}`;
        const existingSales = JSON.parse(localStorage.getItem(salesKey) || '[]');
        const newSale = {
          id: String(Date.now()),
          memberFullName: fullName,
          memberPhone: phoneNumber,
          packageName: selectedPkg?.name || 'Gói tập',
          amount: finalAmount,
          date: new Date().toLocaleDateString('vi-VN')
        };
        existingSales.unshift(newSale);
        localStorage.setItem(salesKey, JSON.stringify(existingSales));

        staffApi.getStaffs().then((staffs) => {
          const targetStaff = staffs.find(s => s.id === selectedStaffId);
          if (targetStaff) {
            const currentRevenue = targetStaff.ptRevenue || 0;
            staffApi.updateStaff(selectedStaffId, {
              ...targetStaff,
              ptRevenue: currentRevenue + finalAmount
            });
          }
        });
      } catch (err) {
        console.error("Lỗi tích lũy doanh thu cho nhân viên:", err);
      }
    }

    const finalLastName = lastName.trim() || 'Hội viên';
    const finalFirstName = firstName.trim() || 'Mới';
    const finalPhoneNumber = phoneNumber.trim() || '0900000000';
    const finalFullName = `${finalLastName} ${finalFirstName}`.trim();

    onSubmit({
      lastName: finalLastName,
      firstName: finalFirstName,
      fullName: finalFullName,
      phoneNumber: finalPhoneNumber,
      email: email.trim(),
      gender,
      dob,
      address,
      packageId: selectedPackageId,
      packageName: selectedPkg?.name || 'Gói tập',
      staffId: selectedStaffId,
      paymentMethod,
      startDate,
      expiryDate,
      originalPrice,
      discountPercent,
      discountAmount,
      totalAmount: finalAmount,
      status: 'ACTIVE'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0b0b0e] border border-[#1f1f26] rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col my-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#18181f] flex items-center justify-between bg-[#08080a] rounded-t-3xl flex-shrink-0">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white m-0">
              THÊM HỘI VIÊN MỚI
            </h3>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest m-0 mt-0.5">
              ĐĂNG KÝ HỘI VIÊN VÀ LẬP HÓA ĐƠN HỆ THỐNG
            </p>
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
          {/* Họ và tên lót & Tên */}
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

          {/* Gói tập & Nhân viên quầy phụ trách */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiPackage size={12} className="text-gym-neon" /> Chọn gói tập
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.durationInMonths} tháng)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiShield size={12} className="text-gym-neon" /> Nhân viên quầy phụ trách
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

          {/* Ngày đóng tiền, Hạn sử dụng & Thanh toán */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiCalendar size={12} className="text-gym-neon" /> Ngày đóng tiền
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#040405] border border-[#1f1f24] focus:border-gym-neon rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none transition-colors cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <FiCalendar size={12} className="text-gym-neon" /> Ngày hết hạn
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

          {/* Giảm giá */}
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

          {/* Summary Box */}
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
              <span className="font-mono text-white">{originalPrice.toLocaleString('en-US')} VNĐ</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex items-center justify-between text-xs font-mono text-red-400">
                <span>GIẢM GIÁ ({discountPercent}%):</span>
                <span>-{discountAmount.toLocaleString('en-US')} VNĐ</span>
              </div>
            )}

            <div className="border-t border-dashed border-[#262633] pt-2 flex items-center justify-between mt-1">
              <span className="text-xs font-black italic uppercase text-white tracking-wider">TỔNG TIỀN THANH TOÁN:</span>
              <span className="text-base font-black text-gym-neon font-mono">
                {finalAmount.toLocaleString('en-US')} VNĐ
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
              HỦY
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-gym-neon text-black hover:bg-[#b3e600] text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)]"
            >
              XÁC NHẬN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};