import React, { useState, useEffect, useRef } from 'react';
import { 
  FiX, 
  FiClock, 
  FiUserPlus, 
  FiCheckCircle, 
  FiCalendar, 
  FiShield, 
  FiPackage, 
  FiUser, 
  FiDollarSign, 
  FiCreditCard, 
  FiChevronDown, 
  FiRefreshCw 
} from 'react-icons/fi';
import type { Member } from '../types/member.types';
import { staffApi } from '../../staff/api/staff.api';
import { gymPackageService, type GymPackageDto } from '../../gymPackages/services/gymPackage.service';
import type { StaffMember } from '../../staff/types/staff.types';

interface MemberDetailModalProps {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  onUpdateMember?: (updatedMember: Member) => void;
}

type TabType = 'ATTENDANCE' | 'PAYMENT' | 'RENEWAL';

interface PTContract {
  trainerId: string;
  trainerName: string;
  totalSessions: number;
  remainingSessions: number;
  pricePerSession: number;
  discount: number;
  discountPercent?: number;
  paymentMethod: string;
  price: number;
  assignedDate: string;
}

interface PaymentHistoryItem {
  id?: string;
  packageName: string;
  startDate: string;
  amount: number;
  paymentMethod: string;
  status: string;
  type: 'PACKAGE' | 'PT';
  staffName?: string;
}

interface DropdownOption {
  value: string | number;
  label: string;
}

// Component Dropdown Tùy chỉnh Cao cấp với Hiệu ứng Mở mượt mà (Smooth Scale & Fade)
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
        className={`w-full bg-[#121218] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-white font-mono font-bold transition-all duration-200 cursor-pointer shadow-sm text-left uppercase ${
          isOpen ? 'border-gym-neon shadow-[0_0_12px_rgba(204,255,0,0.15)] bg-[#161622]' : 'border-[#262635] hover:border-gym-neon/60'
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

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  isOpen,
  member,
  onClose,
  onUpdateMember
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('ATTENDANCE');
  const [trainers, setTrainers] = useState<StaffMember[]>([]);
  const [receptionists, setReceptionists] = useState<StaffMember[]>([]);
  const [packages, setPackages] = useState<GymPackageDto[]>([]);
  
  // Quản lý Modal Gán PT
  const [isAssignPTOpen, setIsAssignPTOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');
  const [sessionCount, setSessionCount] = useState<number>(12);
  const [pricePerSession, setPricePerSession] = useState<number>(350000);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Tiền mặt');
  const [assignedDate, setAssignedDate] = useState<string>('');

  // Hợp đồng PT hiện tại của hội viên
  const [ptContract, setPtContract] = useState<PTContract | null>(null);

  // Quản lý Tab Gia hạn
  const [renewalPackageId, setRenewalPackageId] = useState<string>('');
  const [renewalPaymentMethod, setRenewalPaymentMethod] = useState<string>('Tiền mặt');
  const [renewalStartDate, setRenewalStartDate] = useState<string>('');
  const [renewalDiscountPercent, setRenewalDiscountPercent] = useState<number>(0);
  const [renewalDiscount, setRenewalDiscount] = useState<number>(0);
  const [renewalStaffId, setRenewalStaffId] = useState<string>('');
  const [isRenewSuccess, setIsRenewSuccess] = useState(false);

  // Danh sách lịch sử thanh toán bổ sung
  const [customPayments, setCustomPayments] = useState<PaymentHistoryItem[]>([]);

  // Tính toán hợp đồng PT
  const ptSubTotal = sessionCount * pricePerSession;
  const ptCalculatedTotal = Math.max(0, ptSubTotal - discountAmount);

  const handleSelectDiscountPercent = (percent: number) => {
    setDiscountPercent(percent);
    const amount = Math.round(ptSubTotal * (percent / 100));
    setDiscountAmount(amount);
  };

  // Tính toán gói gia hạn
  const matchedRenewalPkg = packages.find(p => p.id === renewalPackageId) || (packages.length > 0 ? packages[0] : null);
  const renewalOriginalPrice = matchedRenewalPkg?.price || 0;
  const renewalFinalTotal = Math.max(0, renewalOriginalPrice - renewalDiscount);

  // Tự động tính ngày hết hạn mới (AUTO)
  const calculateAutoExpiryDate = () => {
    if (!matchedRenewalPkg) return '--';
    const duration = matchedRenewalPkg.durationInMonths || 1;
    
    let baseDate: Date;
    if (member?.expiryDate) {
      const exp = new Date(member.expiryDate);
      baseDate = exp > new Date() ? exp : new Date(renewalStartDate || new Date());
    } else {
      baseDate = new Date(renewalStartDate || new Date());
    }

    if (isNaN(baseDate.getTime())) {
      baseDate = new Date();
    }

    const calculated = new Date(baseDate);
    calculated.setMonth(calculated.getMonth() + duration);
    return calculated.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isOpen && member) {
      const todayFormatted = new Date().toLocaleDateString('vi-VN');
      const todayIso = new Date().toISOString().split('T')[0];
      setAssignedDate(todayFormatted);
      setRenewalStartDate(todayIso);

      // Tải danh sách Nhân sự thật từ SQL Server
      staffApi.getStaffs().then((staffList) => {
        const activeStaffs = staffList.filter(s => !s.isDeleted);
        const ptList = activeStaffs.filter(s => s.role === 'TRAINER');
        const recList = activeStaffs.filter(s => s.role === 'RECEPTIONIST');
        
        setTrainers(ptList);
        setReceptionists(recList);

        if (ptList.length > 0) {
          setSelectedTrainerId(ptList[0].id);
        }
        if (member.assignedStaffId) {
          setRenewalStaffId(member.assignedStaffId);
        } else if (recList.length > 0) {
          setRenewalStaffId(recList[0].id);
        }
      }).catch(err => console.error("Lỗi khi tải danh sách nhân sự:", err));

      // Tải danh sách Gói tập thật từ SQL Server
      gymPackageService.getAll().then((res) => {
        if (res?.data?.items) {
          const activePkgs = res.data.items.filter((p: GymPackageDto) => p.isActive);
          setPackages(activePkgs);
          if (activePkgs.length > 0) {
            setRenewalPackageId(activePkgs[0].id || '');
          }
        }
      }).catch(err => console.error("Lỗi khi tải danh sách gói tập:", err));

      // Đọc hợp đồng PT đã gán
      try {
        const savedContract = localStorage.getItem(`smartgym_member_pt_contract_${member.id}`);
        if (savedContract) {
          setPtContract(JSON.parse(savedContract));
        } else {
          const savedPTName = localStorage.getItem(`smartgym_member_pt_${member.id}`);
          if (savedPTName) {
            setPtContract({
              trainerId: '',
              trainerName: savedPTName,
              totalSessions: 12,
              remainingSessions: 12,
              pricePerSession: 350000,
              discount: 0,
              discountPercent: 0,
              paymentMethod: 'Tiền mặt',
              price: 4200000,
              assignedDate: todayFormatted
            });
          } else {
            setPtContract(null);
          }
        }
      } catch (e) {
        setPtContract(null);
      }

      setIsAssignPTOpen(false);
      setIsRenewSuccess(false);
      setActiveTab('ATTENDANCE');
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  // Họ tên chuẩn
  const fullName = (member.lastName && member.firstName)
    ? `${member.lastName} ${member.firstName}`.trim()
    : (member.fullName || 'HỘI VIÊN');

  const initial = fullName.trim().charAt(0).toUpperCase() || 'M';
  const isExpired = member.status === 'EXPIRED';

  const todayStr = new Date().toISOString().split('T')[0];

  // Đọc lịch sử quét thẻ thực tế từ hệ thống
  let checkInLogs: any[] = [];
  try {
    const storedLogs = localStorage.getItem(`smartgym_checkin_logs_${todayStr}`);
    if (storedLogs) {
      const allLogs = JSON.parse(storedLogs);
      checkInLogs = allLogs.filter((l: any) => l.memberId === member.id);
    }
  } catch (e) {
    checkInLogs = [];
  }

  if (checkInLogs.length === 0 && member.isCheckedToday) {
    checkInLogs = [{
      time: new Date().toLocaleTimeString('vi-VN'),
      dateTime: `${new Date().toLocaleTimeString('vi-VN')} ${new Date().toLocaleDateString('vi-VN')}`
    }];
  }

  // Xử lý xác nhận hợp đồng gán PT
  const handleConfirmAssignPT = () => {
    const matchedPT = trainers.find(t => t.id === selectedTrainerId);
    if (matchedPT) {
      const newContract: PTContract = {
        trainerId: matchedPT.id,
        trainerName: matchedPT.fullName,
        totalSessions: sessionCount,
        remainingSessions: sessionCount,
        pricePerSession: pricePerSession,
        discount: discountAmount,
        discountPercent: discountPercent,
        paymentMethod: paymentMethod,
        price: ptCalculatedTotal,
        assignedDate: assignedDate || new Date().toLocaleDateString('vi-VN')
      };

      setPtContract(newContract);
      try {
        localStorage.setItem(`smartgym_member_pt_contract_${member.id}`, JSON.stringify(newContract));
        localStorage.setItem(`smartgym_member_pt_${member.id}`, matchedPT.fullName);
      } catch (e) {
        console.error(e);
      }
      setIsAssignPTOpen(false);
    }
  };

  // Xử lý ghi nhận buổi tập PT
  const handleRecordPTSession = () => {
    if (!ptContract) return;
    if (ptContract.remainingSessions <= 0) {
      alert("Hội viên đã sử dụng hết số buổi trong hợp đồng huấn luyện!");
      return;
    }
    const updatedContract = {
      ...ptContract,
      remainingSessions: ptContract.remainingSessions - 1
    };
    setPtContract(updatedContract);
    try {
      localStorage.setItem(`smartgym_member_pt_contract_${member.id}`, JSON.stringify(updatedContract));
    } catch (e) {
      console.error(e);
    }
    alert(`ĐÃ GHI NHẬN 1 BUỔI TẬP VỚI HUẤN LUYỆN VIÊN ${ptContract.trainerName.toUpperCase()}! (CÒN LẠI ${updatedContract.remainingSessions} BUỔI)`);
  };

  // Xử lý kích hoạt gia hạn gói tập
  const handleSubmitExtension = () => {
    if (!matchedRenewalPkg) return;

    const newExpiryDate = calculateAutoExpiryDate();
    const matchedStaff = receptionists.find(s => s.id === renewalStaffId);
    const assignedStaffName = matchedStaff ? matchedStaff.fullName : (member.assignedStaff || 'Chưa phân công');

    const updatedMember: Member = {
      ...member,
      packageName: matchedRenewalPkg.name || '',
      startDate: renewalStartDate || new Date().toISOString().split('T')[0],
      expiryDate: newExpiryDate,
      assignedStaffId: renewalStaffId || member.assignedStaffId,
      assignedStaff: assignedStaffName,
      status: 'ACTIVE'
    };

    if (onUpdateMember) {
      onUpdateMember(updatedMember);
    }

    // Thêm vào lịch sử thanh toán
    const newPayment: PaymentHistoryItem = {
      id: Date.now().toString(),
      packageName: `Gia hạn: ${matchedRenewalPkg.name}`,
      startDate: renewalStartDate || new Date().toISOString().split('T')[0],
      amount: renewalFinalTotal,
      paymentMethod: renewalPaymentMethod,
      status: 'ĐÃ THANH TOÁN',
      type: 'PACKAGE',
      staffName: assignedStaffName
    };
    setCustomPayments(prev => [newPayment, ...prev]);

    setIsRenewSuccess(true);
    setTimeout(() => setIsRenewSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl bg-[#09090c] border border-[#1f1f26] rounded-3xl p-6 sm:p-8 shadow-2xl relative my-6 text-white flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {/* 1. PHẦN ĐẦU (HEADER POPUP) */}
        <div className="flex justify-between items-start pb-5 border-b border-[#1c1c24]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#141418] border border-[#262630] flex items-center justify-center font-black italic text-gym-neon text-2xl flex-shrink-0 shadow-[0_0_15px_rgba(204,255,0,0.1)]">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-bold text-gray-400 bg-[#16161b] px-2 py-0.5 rounded border border-[#262630]">
                  ID: {member.memberCode || `#${member.id.slice(0, 5)}`}
                </span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded tracking-wider uppercase border ${
                  isExpired 
                    ? 'bg-red-950/40 text-red-400 border-red-900/50' 
                    : 'bg-green-950/40 text-[#22c55e] border-green-900/50'
                }`}>
                  {isExpired ? 'HẾT HẠN' : 'HOẠT ĐỘNG'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-wide text-white uppercase m-0 mt-1">
                {fullName}
              </h2>
              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase m-0 mt-1">
                {member.phoneNumber} &nbsp;&nbsp;//&nbsp;&nbsp; {member.packageName || 'GÓI TẬP'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#14141a] border border-[#22222d] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer hover:border-gray-500"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* 2. THÂN POPUP (GRID 2 CỘT) */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          
          {/* CỘT BÊN TRÁI: THÔNG TIN ĐĂNG KÝ & GẮN PT */}
          <div className="flex flex-col gap-5">
            
            {/* Khối Chi tiết đăng ký (Dữ liệu thật từ SQL Server) */}
            <div className="bg-[#0f0f14] border border-[#1f1f26] rounded-2xl p-5 flex flex-col gap-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase block font-bold border-b border-[#1c1c24] pb-2">
                CHI TIẾT ĐĂNG KÝ
              </span>

              <div className="flex flex-col gap-3 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 uppercase">CHỌN GÓI:</span>
                  <span className="font-black text-gym-neon uppercase">{member.packageName || 'Gói tập'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 uppercase">NGÀY ĐÓNG TIỀN:</span>
                  <span className="text-gray-200 font-bold">{member.startDate ? member.startDate.split('T')[0] : '2026-08-31'}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 uppercase">HẠN DÙNG:</span>
                  <span className={`font-bold ${isExpired ? 'text-red-400' : 'text-green-400'}`}>
                    {member.expiryDate ? member.expiryDate.split('T')[0] : '--'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 uppercase">NV PHỤ TRÁCH:</span>
                  <span className="font-bold text-white uppercase">{member.assignedStaff || 'Chưa phân công'}</span>
                </div>
              </div>
            </div>

            {/* Khối Thao tác nhanh: GẮN PT CHO HỘI VIÊN */}
            <div className="bg-[#0f0f14] border border-[#1f1f26] rounded-2xl p-5 flex flex-col gap-3">
              <span className="text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase block font-bold">
                THAO TÁC NHANH
              </span>

              <button
                type="button"
                onClick={() => {
                  handleSelectDiscountPercent(0);
                  setIsAssignPTOpen(true);
                }}
                className="w-full bg-[#14141c] border border-[#2a2a38] hover:border-gym-neon/60 hover:bg-gym-neon/10 text-gym-neon rounded-xl p-3.5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <FiUserPlus size={16} />
                <span>GẮN PT CHO HỘI VIÊN</span>
              </button>
            </div>

            {/* Khối HỢP ĐỒNG PT (ACTIVE) - Xuất hiện khi đã gán PT */}
            {ptContract && (
              <div className="bg-[#0f0f14] border border-gym-neon/30 rounded-2xl p-5 flex flex-col gap-3 shadow-[0_0_15px_rgba(204,255,0,0.05)]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-widest text-gym-neon uppercase font-bold flex items-center gap-1.5">
                    <FiShield size={12} /> HỢP ĐỒNG PT
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-green-950/40 border border-green-900/50 text-[#22c55e] px-2 py-0.5 rounded uppercase">
                    ACTIVE
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-black italic text-white uppercase m-0">
                    {ptContract.trainerName}
                  </h4>
                  <p className="text-[10px] font-mono text-gray-400 m-0">
                    {ptContract.remainingSessions} / {ptContract.totalSessions} BUỔI CÒN LẠI
                  </p>
                  <p className="text-[9px] font-mono text-gray-500 m-0">
                    {ptContract.pricePerSession?.toLocaleString('vi-VN')} đ/buổi • TT: {ptContract.paymentMethod}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRecordPTSession}
                  className="w-full bg-gym-neon hover:bg-[#b3e600] text-black font-black uppercase text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md tracking-wider flex items-center justify-center gap-2"
                >
                  <FiCheckCircle size={14} /> GHI NHẬN BUỔI TẬP
                </button>
              </div>
            )}

          </div>

          {/* CỘT BÊN PHẢI: 3 TAB CHỨC NĂNG */}
          <div className="bg-[#0f0f14] border border-[#1f1f26] rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
            
            {/* Thanh Tab Navigation */}
            <div className="flex items-center gap-6 border-b border-[#1c1c24] pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('ATTENDANCE')}
                className={`text-xs font-black italic tracking-widest uppercase transition-all pb-2 -mb-3 border-b-2 cursor-pointer ${
                  activeTab === 'ATTENDANCE'
                    ? 'text-gym-neon border-gym-neon'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                LỊCH SỬ TẬP LUYỆN
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PAYMENT')}
                className={`text-xs font-black italic tracking-widest uppercase transition-all pb-2 -mb-3 border-b-2 cursor-pointer ${
                  activeTab === 'PAYMENT'
                    ? 'text-gym-neon border-gym-neon'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                LỊCH SỬ THANH TOÁN
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('RENEWAL')}
                className={`text-xs font-black italic tracking-widest uppercase transition-all pb-2 -mb-3 border-b-2 cursor-pointer ${
                  activeTab === 'RENEWAL'
                    ? 'text-gym-neon border-gym-neon'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                GIA HẠN
              </button>
            </div>

            {/* NỘI DUNG TAB 1: LỊCH SỬ TẬP LUYỆN */}
            {activeTab === 'ATTENDANCE' && (
              <div className="flex flex-col gap-3 flex-grow overflow-y-auto max-h-[360px] pr-1">
                {checkInLogs.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs font-mono flex flex-col items-center justify-center gap-2">
                    <FiClock size={28} className="opacity-40" />
                    <span>CHƯA CÓ LƯỢT CHECK-IN NÀO ĐƯỢC GHI NHẬN HÔM NAY</span>
                  </div>
                ) : (
                  checkInLogs.map((log: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-[#08080b] border border-[#1b1b24] hover:border-gym-neon/30 rounded-xl p-4 flex items-center justify-between transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                          XÁC THỰC LÚC:
                        </span>
                        <span className="text-xs font-mono font-bold text-white tracking-wide">
                          {log.dateTime || `${log.time} 31/8/2026`}
                        </span>
                      </div>

                      {/* NÚT ĐÃ XÁC NHẬN */}
                      <div className="bg-green-950/40 border border-green-800/60 text-[#22c55e] text-[10px] font-black px-4 py-1.5 rounded-lg flex items-center gap-1.5 tracking-wider uppercase shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                        <FiCheckCircle size={13} className="text-[#22c55e]" />
                        <span>ĐÃ XÁC NHẬN</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* NỘI DUNG TAB 2: LỊCH SỬ THANH TOÁN */}
            {activeTab === 'PAYMENT' && (
              <div className="flex flex-col gap-3 flex-grow overflow-y-auto max-h-[360px] pr-1">
                {/* Lịch sử gia hạn mới */}
                {customPayments.map((p, pIdx) => (
                  <div key={pIdx} className="bg-[#08080b] border border-gym-neon/30 rounded-xl p-4 flex items-center justify-between text-xs font-mono">
                    <div>
                      <p className="font-bold text-gym-neon uppercase m-0 flex items-center gap-2">
                        <FiPackage className="text-gym-neon" /> {p.packageName}
                      </p>
                      <p className="text-[10px] text-gray-500 m-0 mt-1 flex items-center gap-2">
                        <span className="flex items-center gap-1"><FiCalendar size={11} /> {p.startDate}</span>
                        <span>• TT: {p.paymentMethod}</span>
                        {p.staffName && <span>• NV: {p.staffName}</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gym-neon font-black m-0">+{p.amount.toLocaleString('vi-VN')} đ</p>
                      <span className="text-[9px] font-bold text-[#22c55e] uppercase">ĐÃ THANH TOÁN</span>
                    </div>
                  </div>
                ))}

                {/* Gói ban đầu */}
                <div className="bg-[#08080b] border border-[#1b1b24] rounded-xl p-4 flex items-center justify-between text-xs font-mono">
                  <div>
                    <p className="font-bold text-white uppercase m-0 flex items-center gap-2">
                      <FiPackage className="text-gym-neon" /> {member.packageName || 'Gói tập'}
                    </p>
                    <p className="text-[10px] text-gray-500 m-0 mt-1 flex items-center gap-1">
                      <FiCalendar size={11} /> {member.startDate ? member.startDate.split('T')[0] : '2026-08-31'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gym-neon font-black m-0">{member.packageDiscount || '300.000 đ'}</p>
                    <span className="text-[9px] font-bold text-[#22c55e] uppercase">ĐÃ THANH TOÁN</span>
                  </div>
                </div>

                {/* Hợp đồng PT */}
                {ptContract && (
                  <div className="bg-[#08080b] border border-gym-neon/20 rounded-xl p-4 flex items-center justify-between text-xs font-mono">
                    <div>
                      <p className="font-bold text-gym-neon uppercase m-0 flex items-center gap-2">
                        <FiShield className="text-gym-neon" /> HỢP ĐỒNG PT ({ptContract.totalSessions} BUỔI)
                      </p>
                      <p className="text-[10px] text-gray-500 m-0 mt-1 flex items-center gap-1">
                        <FiUser size={11} /> PT: {ptContract.trainerName} &nbsp;•&nbsp; {ptContract.assignedDate} &nbsp;•&nbsp; {ptContract.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gym-neon font-black m-0">{ptContract.price.toLocaleString('vi-VN')} đ</p>
                      <span className="text-[9px] font-bold text-[#22c55e] uppercase">ĐÃ THANH TOÁN</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NỘI DUNG TAB 3: GIA HẠN (THIẾT KẾ CHUẨN XÁC THEO ẢNH VỚI DROPDOWN MƯỢT MÀ) */}
            {activeTab === 'RENEWAL' && (
              <div className="flex flex-col gap-4">
                
                {/* Khung Chi tiết gói gia hạn mới */}
                <div className="bg-[#0a0a0e] border border-[#1b1b24] rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#181822]">
                    <span className="w-2 h-2 rounded-full bg-gym-neon"></span>
                    <h4 className="text-xs font-black italic tracking-widest text-white uppercase m-0">
                      CHI TIẾT GÓI GIA HẠN MỚI
                    </h4>
                  </div>

                  {/* Hàng 1: CHỌN GÓI TẬP (SQL) & PHƯƠNG THỨC THANH TOÁN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-30">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                        CHỌN GÓI TẬP:
                      </label>
                      <CustomDropdown
                        value={renewalPackageId}
                        options={packages.map((pkg) => ({
                          value: pkg.id || pkg.name || '',
                          label: `${pkg.name} (${pkg.price.toLocaleString('vi-VN')}Đ)`
                        }))}
                        onChange={(newPkgId) => {
                          setRenewalPackageId(newPkgId);
                          const found = packages.find(p => p.id === newPkgId);
                          if (found && renewalDiscountPercent > 0) {
                            setRenewalDiscount(Math.round(found.price * (renewalDiscountPercent / 100)));
                          }
                        }}
                        placeholder="-- CHỌN GÓI TẬP --"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                        PHƯƠNG THỨC THANH TOÁN:
                      </label>
                      <CustomDropdown
                        value={renewalPaymentMethod}
                        options={[
                          { value: 'Tiền mặt', label: '💵 TIỀN MẶT (CASH)' },
                          { value: 'Chuyển khoản', label: '🏦 CHUYỂN KHOẢN (BANK / QR)' },
                          { value: 'Quẹt thẻ POS', label: '💳 QUẸT THẺ POS (CARD)' }
                        ]}
                        onChange={(val) => setRenewalPaymentMethod(val)}
                      />
                    </div>
                  </div>

                  {/* Hàng 2: NGÀY ĐÓNG TIỀN & NGÀY HẾT HẠN (TỰ ĐỘNG - AUTO) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-20">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                        NGÀY ĐÓNG TIỀN (NGÀY BẮT ĐẦU):
                      </label>
                      <div className="bg-[#121218] border border-[#262635] rounded-xl px-3.5 py-2 flex items-center justify-between text-xs font-mono text-white">
                        <input
                          type="date"
                          value={renewalStartDate}
                          onChange={(e) => setRenewalStartDate(e.target.value)}
                          className="bg-transparent text-white font-mono outline-none text-xs w-full cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                        NGÀY HẾT HẠN (TỰ ĐỘNG - AUTO):
                      </label>
                      <div className="bg-[#121218] border border-[#262635] rounded-xl px-3.5 py-2.5 text-xs font-mono font-black text-gym-neon">
                        {calculateAutoExpiryDate()}
                      </div>
                    </div>
                  </div>

                  {/* Hàng 3: SỐ TIỀN GIẢM GIÁ (DROPDOWN) & NHÂN VIÊN PHỤ TRÁCH (SQL) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                        SỐ TIỀN GIẢM GIÁ:
                      </label>
                      <CustomDropdown
                        value={renewalDiscountPercent}
                        options={[
                          { value: 0, label: '0% (0Đ)' },
                          { value: 5, label: `GIẢM 5% (-${Math.round(renewalOriginalPrice * 0.05).toLocaleString('vi-VN')}Đ)` },
                          { value: 10, label: `GIẢM 10% (-${Math.round(renewalOriginalPrice * 0.10).toLocaleString('vi-VN')}Đ)` },
                          { value: 15, label: `GIẢM 15% (-${Math.round(renewalOriginalPrice * 0.15).toLocaleString('vi-VN')}Đ)` }
                        ]}
                        onChange={(pct) => {
                          const numPct = Number(pct);
                          setRenewalDiscountPercent(numPct);
                          setRenewalDiscount(Math.round(renewalOriginalPrice * (numPct / 100)));
                        }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                        NHÂN VIÊN PHỤ TRÁCH:
                      </label>
                      <CustomDropdown
                        value={renewalStaffId}
                        options={receptionists.map((st) => ({
                          value: st.id,
                          label: `${st.fullName} (${st.staffCode})`
                        }))}
                        onChange={(val) => setRenewalStaffId(val)}
                        placeholder="-- CHỌN NHÂN VIÊN --"
                      />
                    </div>
                  </div>

                </div>

                {/* Khối HÓA ĐƠN ĐĂNG KÝ GIA HẠN */}
                <div className="bg-[#0a0a0e] border border-[#1b1b24] rounded-2xl p-5 flex flex-col gap-3 font-mono">
                  <span className="text-[10px] font-black italic tracking-widest text-gym-neon uppercase border-b border-[#181822] pb-2">
                    HÓA ĐƠN ĐĂNG KÝ GIA HẠN
                  </span>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase">GÓI GIA HẠN:</span>
                    <span className="font-bold text-white uppercase">{matchedRenewalPkg?.name || 'Gói tập'}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase">PHÍ DỊCH VỤ GỐC:</span>
                    <span className="font-bold text-gray-200">{renewalOriginalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 uppercase">GIẢM GIÁ TRỰC TIẾP:</span>
                    <span className="font-bold text-red-400">-{renewalDiscount.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#181822]">
                    <span className="text-xs font-black uppercase text-gym-neon">TỔNG TIỀN PHẢI THU:</span>
                    <span className="text-xl font-black italic text-gym-neon">
                      {renewalFinalTotal.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* NÚT KÍCH HOẠT GIA HẠN NGAY */}
                <button
                  type="button"
                  onClick={handleSubmitExtension}
                  className="w-full py-3.5 rounded-2xl bg-gym-neon text-black font-black uppercase text-xs tracking-wider hover:bg-[#b3e600] transition-all cursor-pointer shadow-[0_0_20px_rgba(204,255,0,0.25)] flex items-center justify-center gap-2"
                >
                  <FiRefreshCw size={15} /> KÍCH HOẠT GIA HẠN NGAY (SUBMIT EXTENSION)
                </button>

                {isRenewSuccess && (
                  <div className="p-3 bg-green-950/40 border border-green-800/60 rounded-xl text-center text-xs text-[#22c55e] font-mono font-bold animate-pulse">
                    ✓ ĐÃ KÍCH HOẠT GIA HẠN GÓI TẬP THÀNH CÔNG CHO HỘI VIÊN!
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* 3. PHẦN CHÂN TRANG (FOOTER) */}
        <div className="flex justify-between items-center pt-4 border-t border-[#1c1c24] text-[10px] font-mono">
          <span className="text-gray-500 tracking-widest uppercase">
            DATABASE_REF: <strong className="text-gray-400">SMARTGYM_SQL</strong> // SESSION: <strong className="text-gym-neon">ACTIVE</strong>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-gym-neon text-black font-black uppercase text-xs tracking-wider hover:bg-[#b3e600] transition-all cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)]"
          >
            HOÀN TẤT
          </button>
        </div>

        {/* 4. MODAL GÁN PT - HỢP ĐỒNG HUẤN LUYỆN MỚI (POPUP NỔI VỚI DROPDOWN MƯỢT MÀ) */}
        {isAssignPTOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-100">
            <div className="w-full max-w-xl bg-[#0a0a0e] border border-[#22222d] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white flex flex-col gap-4 animate-in zoom-in-95 duration-150 my-auto max-h-[95vh] overflow-y-auto no-scrollbar">
              
              {/* Tiêu đề */}
              <div className="text-center pb-2 border-b border-[#1c1c24]">
                <h3 className="text-2xl font-black italic tracking-wider uppercase text-gym-neon m-0">
                  GÁN PT
                </h3>
                <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mt-1">
                  HỢP ĐỒNG HUẤN LUYỆN MỚI
                </p>
              </div>

              {/* Grid 2 cột: CHỌN HỘI VIÊN & CHỌN HUẤN LUYỆN VIÊN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-30">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    CHỌN HỘI VIÊN
                  </label>
                  <div className="bg-[#121218] border border-[#262635] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold truncate">
                    {fullName} - {member.memberCode}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    CHỌN HUẤN LUYỆN VIÊN
                  </label>
                  <CustomDropdown
                    value={selectedTrainerId}
                    options={trainers.map((pt) => ({
                      value: pt.id,
                      label: `${pt.fullName} (${pt.staffCode})`
                    }))}
                    onChange={(val) => setSelectedTrainerId(val)}
                    placeholder="-- CHỌN PT --"
                  />
                </div>
              </div>

              {/* Grid 2 cột: GIÁ 1 BUỔI DẠY & TỔNG SỐ BUỔI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-20">
                {/* Giá 1 buổi dạy */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
                    <FiDollarSign size={11} className="text-gym-neon" /> GIÁ 1 BUỔI DẠY (VNĐ)
                  </label>
                  <div className="bg-[#121218] border border-[#262635] rounded-xl p-2.5 flex items-center justify-center">
                    <input
                      type="text"
                      value={pricePerSession.toLocaleString('vi-VN')}
                      onChange={(e) => {
                        const raw = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
                        setPricePerSession(raw);
                        if (discountPercent > 0) {
                          setDiscountAmount(Math.round((sessionCount * raw) * (discountPercent / 100)));
                        }
                      }}
                      className="bg-transparent text-xl font-black text-gym-neon font-mono text-center outline-none w-full"
                    />
                  </div>
                  {/* Badges chọn nhanh giá buổi */}
                  <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    {[300000, 350000, 400000, 500000].map((pVal) => (
                      <button
                        key={pVal}
                        type="button"
                        onClick={() => {
                          setPricePerSession(pVal);
                          if (discountPercent > 0) {
                            setDiscountAmount(Math.round((sessionCount * pVal) * (discountPercent / 100)));
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono transition-colors cursor-pointer border ${
                          pricePerSession === pVal
                            ? 'bg-gym-neon text-black border-gym-neon font-bold'
                            : 'bg-[#14141c] text-gray-400 border-[#222230] hover:text-white'
                        }`}
                      >
                        {pVal / 1000}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tổng số buổi (Tùy chỉnh) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider text-center">
                    TỔNG SỐ BUỔI (TÙY CHỈNH)
                  </label>
                  <div className="bg-[#121218] border border-[#262635] rounded-xl p-2.5 flex items-center justify-center">
                    <input
                      type="number"
                      min={1}
                      value={sessionCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 1;
                        setSessionCount(val);
                        if (discountPercent > 0) {
                          setDiscountAmount(Math.round((val * pricePerSession) * (discountPercent / 100)));
                        }
                      }}
                      className="bg-transparent text-xl font-black text-white font-mono text-center outline-none w-full"
                    />
                  </div>
                  {/* Badges chọn nhanh số buổi */}
                  <div className="flex flex-wrap items-center justify-center gap-1 mt-0.5">
                    {[10, 12, 24, 30, 48].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          setSessionCount(count);
                          if (discountPercent > 0) {
                            setDiscountAmount(Math.round((count * pricePerSession) * (discountPercent / 100)));
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono transition-colors cursor-pointer border ${
                          sessionCount === count
                            ? 'bg-gym-neon text-black border-gym-neon font-bold'
                            : 'bg-[#14141c] text-gray-400 border-[#222230] hover:text-white'
                        }`}
                      >
                        {count}b
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid 2 cột: NGÀY GÁN & GIẢM GIÁ (Có mức 5%, 10%, 15%) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {/* NGÀY GÁN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    NGÀY GÁN
                  </label>
                  <div className="bg-[#121218] border border-[#262635] rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-mono text-white">
                    <span>{assignedDate || '31/08/2026'}</span>
                    <FiCalendar size={14} className="text-gray-500" />
                  </div>
                </div>

                {/* GIẢM GIÁ (5%, 10%, 15% & Tùy chỉnh VNĐ) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      GIẢM GIÁ
                    </label>
                    <span className="text-[10px] font-mono text-red-400 font-bold">
                      -{discountAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[0, 5, 10, 15].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleSelectDiscountPercent(pct)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                          discountPercent === pct && discountAmount === Math.round(ptSubTotal * (pct / 100))
                            ? 'bg-red-950/60 text-red-400 border-red-700 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                            : 'bg-[#121218] text-gray-400 border-[#262635] hover:text-white'
                        }`}
                      >
                        {pct === 0 ? '0%' : `-${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHƯƠNG THỨC THANH TOÁN (DROPDOWN MƯỢT MÀ) */}
              <div className="flex flex-col gap-1.5 relative z-10">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiCreditCard size={12} className="text-gym-neon" /> PHƯƠNG THỨC THANH TOÁN
                </label>
                <CustomDropdown
                  value={paymentMethod}
                  options={[
                    { value: 'Tiền mặt', label: '💵 TIỀN MẶT (CASH)' },
                    { value: 'Chuyển khoản', label: '🏦 CHUYỂN KHOẢN (BANK / QR)' },
                    { value: 'Quẹt thẻ POS', label: '💳 QUẸT THẺ POS (CARD)' }
                  ]}
                  onChange={(val) => setPaymentMethod(val)}
                />
              </div>

              {/* KHỐI TỔNG TIỀN TÍNH TOÁN */}
              <div className="bg-[#0f0f14] border border-[#22222e] rounded-2xl p-4 flex items-center justify-between font-mono">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">TỔNG TIỀN THANH TOÁN</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">
                    {sessionCount} buổi x {pricePerSession.toLocaleString('vi-VN')} đ {discountAmount > 0 ? ` (Đã giảm ${discountPercent}%: -${discountAmount.toLocaleString('vi-VN')} đ)` : ''}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black italic text-gym-neon font-mono">
                    {ptCalculatedTotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Nút XÁC NHẬN HỢP ĐỒNG */}
              <button
                type="button"
                onClick={handleConfirmAssignPT}
                disabled={!selectedTrainerId}
                className="w-full py-3.5 rounded-xl bg-gym-neon text-black font-black uppercase text-xs tracking-wider hover:bg-[#b3e600] disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)] mt-1"
              >
                XÁC NHẬN HỢP ĐỒNG ({ptCalculatedTotal.toLocaleString('vi-VN')} đ)
              </button>

              {/* Nút QUAY LẠI */}
              <button
                type="button"
                onClick={() => setIsAssignPTOpen(false)}
                className="text-xs font-mono uppercase text-gray-500 hover:text-gray-300 transition-colors text-center tracking-widest cursor-pointer py-1"
              >
                QUAY LẠI
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
