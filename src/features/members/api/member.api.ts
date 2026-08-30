import { apiClient } from '../../../api/client';
import type { Member } from '../types/member.types';

export interface MemberMetrics {
  total: number;
  active: number;
  expired: number;
  expiring: number;
  newInvoices: number;
  checkInToday: number;
}

export const memberApi = {
  // 1. LẤY DANH SÁCH (Gọi GET API kèm theo tenantId và phân trang nếu cần)
  getMembers: async (): Promise<Member[]> => {
    try {
      const response = await apiClient.get('/web-app/v1/multi-tenants/members/get-list');
      if (response.data && response.data.isSuccess && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return response.data?.data?.items || response.data?.data || (Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hội viên:", error);
      return [];
    }
  },

  // 2. TẠO MỚI (Gọi POST API)
  createMember: async (memberData: any): Promise<any> => {
    const tenantId = localStorage.getItem('tenantId') || undefined;
    
    const fullName = (memberData.fullName || memberData.name || '').trim();
    const nameParts = fullName.split(' ').filter(Boolean);
    
    let firstName = (memberData.firstName || '').trim();
    let lastName = (memberData.lastName || '').trim();

    if (!firstName && !lastName) {
      if (nameParts.length === 1) {
        firstName = nameParts[0];
        lastName = nameParts[0];
      } else if (nameParts.length > 1) {
        lastName = nameParts.slice(0, nameParts.length - 1).join(' ');
        firstName = nameParts[nameParts.length - 1];
      } else {
        firstName = 'Mới';
        lastName = 'Hội viên';
      }
    } else if (!lastName) {
      lastName = 'Hội viên';
    } else if (!firstName) {
      firstName = 'Mới';
    }

    firstName = firstName.slice(0, 50);
    lastName = lastName.slice(0, 50);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const memberCode = (memberData.memberCode || `MEM${randomNum}`).slice(0, 20);
    const phoneNumber = (memberData.phoneNumber || memberData.phone || '0900000000').slice(0, 15);

    const isGuid = (val: any): boolean => typeof val === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val.trim());

    let rawStaffId = memberData.staffId || memberData.assignedStaffId || memberData.AssignedStaffId;
    let assignedStaffId: string | null = isGuid(rawStaffId) ? rawStaffId.trim() : null;

    let dobValue: string | null = null;
    if (memberData.dob || memberData.dateOfBirth) {
      const parsedDate = new Date(memberData.dob || memberData.dateOfBirth);
      if (!isNaN(parsedDate.getTime())) {
        dobValue = parsedDate.toISOString();
      }
    }

    let genderVal = 0;
    const gUpper = String(memberData.gender || '').toUpperCase();
    if (gUpper === 'MALE' || gUpper === 'NAM' || memberData.gender === 1) genderVal = 1;
    else if (gUpper === 'FEMALE' || gUpper === 'NỮ' || memberData.gender === 2) genderVal = 2;

    let emailVal: string | null = null;
    if (memberData.email && memberData.email.trim() !== '' && memberData.email.includes('@')) {
      emailVal = memberData.email.trim().slice(0, 100);
    }

    let packageIdVal: string | null = isGuid(memberData.packageId) ? memberData.packageId.trim() : null;
    let packageNameVal: string | null = memberData.packageName || null;
    let startDateVal: string | null = memberData.startDate ? new Date(memberData.startDate).toISOString() : new Date().toISOString();
    let expiryDateVal: string | null = memberData.expiryDate ? new Date(memberData.expiryDate).toISOString() : null;

    // Gửi cấu trúc phẳng chuẩn C# Backend
    const payload = {
      TenantId: tenantId,
      FirstName: firstName,
      LastName: lastName,
      MemberCode: memberCode,
      PhoneNumber: phoneNumber,
      Email: emailVal,
      DateOfBirth: dobValue,
      Gender: genderVal,
      AssignedStaffId: assignedStaffId,
      PackageId: packageIdVal,
      PackageName: packageNameVal,
      StartDate: startDateVal,
      ExpiryDate: expiryDateVal
    };

    const response = await apiClient.post('/web-app/v1/multi-tenants/members/create', payload);
    return response.data;
  },

  // 3. CẬP NHẬT (Gọi PUT API)
  updateMember: async (id: string, memberData: any): Promise<any> => {
    const fullName = (memberData.fullName || '').trim();
    const nameParts = fullName.split(' ').filter(Boolean);
    
    let firstName = (memberData.firstName || '').trim();
    let lastName = (memberData.lastName || '').trim();

    if (!firstName && !lastName && nameParts.length > 0) {
      if (nameParts.length === 1) {
        firstName = nameParts[0];
        lastName = nameParts[0];
      } else {
        lastName = nameParts.slice(0, nameParts.length - 1).join(' ');
        firstName = nameParts[nameParts.length - 1];
      }
    } else if (!lastName) {
      lastName = 'Hội viên';
    } else if (!firstName) {
      firstName = 'Mới';
    }

    firstName = firstName.slice(0, 50);
    lastName = lastName.slice(0, 50);
    const phoneNumber = (memberData.phoneNumber || '0900000000').slice(0, 15);

    let rawStaffId = memberData.assignedStaffId || memberData.staffId || memberData.AssignedStaffId;
    let assignedStaffId: string | null = (typeof rawStaffId === 'string' && rawStaffId.trim() !== '') ? rawStaffId.trim() : null;

    let dobValue: string | null = null;
    if (memberData.dateOfBirth || memberData.dob) {
      const parsedDate = new Date(memberData.dateOfBirth || memberData.dob);
      if (!isNaN(parsedDate.getTime())) {
        dobValue = parsedDate.toISOString();
      }
    }

    let genderVal = 0;
    const gUpper = String(memberData.gender || '').toUpperCase();
    if (gUpper === 'MALE' || gUpper === 'NAM' || memberData.gender === 1) genderVal = 1;
    else if (gUpper === 'FEMALE' || gUpper === 'NỮ' || memberData.gender === 2) genderVal = 2;

    let emailVal: string | null = null;
    if (memberData.email && memberData.email.trim() !== '' && memberData.email.includes('@')) {
      emailVal = memberData.email.trim().slice(0, 100);
    }

    const payload = {
      Id: id,
      FirstName: firstName,
      LastName: lastName,
      PhoneNumber: phoneNumber,
      Email: emailVal,
      DateOfBirth: dobValue,
      Gender: genderVal,
      AssignedStaffId: assignedStaffId
    };

    const response = await apiClient.put(`/web-app/v1/multi-tenants/members/update/${id}`, payload);
    return response.data;
  },

  // 4. XÓA (Gọi DELETE API)
  deleteMember: async (id: string): Promise<any> => {
    const response = await apiClient.delete('/web-app/v1/multi-tenants/members/delete', {
      data: { ids: [id] } 
    });
    return response.data;
  },

  // 5. KHÔI PHỤC (Gọi POST restore API)
  restoreMember: async (id: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/web-app/v1/multi-tenants/members/restore', {
        ids: [id]
      });
      return response.data?.isSuccess || response.status === 200;
    } catch (error) {
      console.error("Lỗi khi khôi phục hội viên:", error);
      return false;
    }
  },

  // 6. TÍNH TOÁN METRICS (Logic tính toán thông số)
  calculateMetrics: (members: Member[]): MemberMetrics => {
    const activeMembers = members.filter((m) => !m.isDeleted && m.status === 'ACTIVE');
    const today = new Date(); 

    let expiredCount = 0;
    let expiringCount = 0;
    let newCount = 0;

    members.forEach((m) => {
      if (m.isDeleted) return;

      if (m.status === 'EXPIRED') {
        expiredCount++;
        return;
      }

      const parts = m.expiryDate && m.expiryDate.includes('/') ? m.expiryDate.split('/') : [];
      let expiryDate: Date;
      if (parts.length === 3) {
        expiryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else {
        expiryDate = new Date(m.expiryDate);
      }

      if (!isNaN(expiryDate.getTime())) {
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          expiredCount++;
        } else if (diffDays >= 0 && diffDays <= 7) {
          expiringCount++;
        }
      }

      if (m.packageName && (m.packageName.toLowerCase().includes('tháng') || m.memberCode === '#4')) {
        newCount++;
      }
    });

    const checkInTodayCount = members.filter((m) => m.isCheckedToday && !m.isDeleted).length;

    return {
      total: members.filter((m) => !m.isDeleted).length,
      active: activeMembers.length,
      expired: expiredCount,
      expiring: expiringCount,
      newInvoices: newCount,
      checkInToday: checkInTodayCount
    };
  }
};