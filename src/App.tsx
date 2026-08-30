import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/i18n/LanguageContext';
import { LoginPage } from './pages/auth/LoginPage';
import { MembersPage } from './features/members/pages/MembersPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { MembersAccountsPage } from './features/member-accounts/pages/MemberAccountsPage';
import { ProductsPage } from './features/products/pages/ProductsPage';
import { GymPackageManagerPage } from './features/gymPackages/pages/GymPackageManagerPage';
import { StaffManagerPage } from './features/staff/pages/StaffManagerPage';
import { MainLayout, type NavTab } from './layouts/MainLayout';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'members-list' && <MembersPage />}
      {activeTab === 'members-accounts' && <MembersAccountsPage />}
      {activeTab === 'products' && <ProductsPage />}
      {activeTab === 'packages' && <GymPackageManagerPage />}
      
      {/* Phân định trang Quản lý nhân sự theo từng tab con */}
      {activeTab === 'staff-receptionist' && <StaffManagerPage initialRole="RECEPTIONIST" />}
      {activeTab === 'staff-trainer' && <StaffManagerPage initialRole="TRAINER" />}
      
      {activeTab !== 'dashboard' && 
       activeTab !== 'members-list' && 
       activeTab !== 'members-accounts' && 
       activeTab !== 'products' && 
       activeTab !== 'packages' && 
       activeTab !== 'staff-receptionist' && 
       activeTab !== 'staff-trainer' && (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="p-4 rounded-2xl bg-[#0e0e0e] border border-[#1f1f1f] text-gym-neon mb-3 font-mono text-xl font-bold uppercase">
            {activeTab}
          </div>
          <p className="text-sm text-gray-500 font-mono tracking-widest uppercase">
            CH ĐANG ĐƯỢC PHÁT TRIỂN // SYSTEM_V4
          </p>
        </div>
      )}
    </MainLayout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}