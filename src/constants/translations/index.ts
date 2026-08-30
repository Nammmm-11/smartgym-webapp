import { authVi } from './vi/auth';
import { authEn } from './en/auth';
import { authZh } from './zh/auth';
import { commonVi } from './vi/common';
import { commonEn } from './en/common';
import { commonZh } from './zh/common';
import { navVi } from './vi/nav';
import { navEn } from './en/nav';
import { navZh } from './zh/nav';
import { membersVi } from './vi/members';
import { membersEn } from './en/members';
import { membersZh } from './zh/members';
import { dashboardVi } from './vi/dashboard';
import { dashboardEn } from './en/dashboard';
import { dashboardZh } from './zh/dashboard';
import { footerVi } from './vi/footer';
import { footerEn } from './en/footer';
import { footerZh } from './zh/footer';

export const translations = {
  VI: {
    auth: authVi,
    common: commonVi,
    nav: navVi,
    members: membersVi,
    dashboard: dashboardVi,
    footer: footerVi,
  },
  EN: {
    auth: authEn,
    common: commonEn,
    nav: navEn,
    members: membersEn,
    dashboard: dashboardEn,
    footer: footerEn,
  },
  ZH: {
    auth: authZh,
    common: commonZh,
    nav: navZh,
    members: membersZh,
    dashboard: dashboardZh,
    footer: footerZh,
  },
};

export type Language = 'VI' | 'EN' | 'ZH';
export type TranslationSchema = typeof translations['VI'];