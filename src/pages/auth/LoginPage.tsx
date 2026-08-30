import React, { useState } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useAuth } from '../../contexts/AuthContext';
import { FiEye, FiEyeOff, FiShield, FiUser } from 'react-icons/fi';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[440px]">
        {/* HEADER PHÍA TRÊN: Đã gỡ bỏ dropdown đa ngôn ngữ */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black italic tracking-tight m-0">
              FITMASTER <span className="text-gym-neon">GYM</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-mono mt-1 tracking-[0.2em] uppercase m-0">
              SYSTEM AUTHENTICATION // v0.4.2
            </p>
          </div>
        </div>

        {/* FORM BOX */}
        <div className="w-full bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-3xl shadow-2xl">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-400 text-xs font-mono tracking-wide">
                {errorMessage}
            </div>
          )}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="email"
              placeholder="TÀI KHOẢN (EMAIL)"
              className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-5 py-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon transition-colors font-mono tracking-widest"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="MẬT KHẨU"
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-5 py-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon transition-colors font-mono tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-gym-neon text-[10px] font-bold hover:underline tracking-widest uppercase">QUÊN MẬT KHẨU?</a>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gym-neon text-black font-black italic tracking-widest uppercase rounded-xl py-4 flex justify-center items-center gap-2 hover:bg-[#b3e600] transition-colors mt-1 text-xs shadow-[0_0_15px_rgba(204,255,0,0.2)] cursor-pointer disabled:opacity-50"
            >
              {loading ? '...' : 'TRUY CẬP >_'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="h-[1px] bg-[#1a1a1a] flex-grow"></div>
            <span className="text-[9px] text-gray-500 font-mono tracking-[0.2em] uppercase">
              Đăng nhập nhanh hệ thống
            </span>
            <div className="h-[1px] bg-[#1a1a1a] flex-grow"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setEmail('superadmin@gmail.com');
                setPassword('Admin@123');
              }}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#1a1a1a] bg-[#050505] hover:border-[#2a2a2a] transition-all group cursor-pointer"
            >
              <FiShield size={20} className="text-gym-neon group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="text-[10px] font-black tracking-wider text-white group-hover:text-gym-neon transition-colors m-0">QUẢN TRỊ VIÊN</p>
                <p className="text-[9px] text-gray-600 mt-0.5 font-mono m-0 truncate max-w-[130px]">superadmin@gmail.com</p>
              </div>
            </button>

            <button 
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setEmail('tenantadmin@greenpearkids.edu.vn');
                setPassword('TenantAdmin@123');
              }}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#1a1a1a] bg-[#050505] hover:border-[#1e3a5f] transition-all group cursor-pointer"
            >
              <FiUser size={20} className="text-[#38bdf8] group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="text-[10px] font-black tracking-wider text-white group-hover:text-[#38bdf8] transition-colors m-0">LỄ TÂN</p>
                <p className="text-[9px] text-gray-600 mt-0.5 font-mono m-0 truncate max-w-[130px]">tenantadmin@greenpearkids.edu.vn</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};