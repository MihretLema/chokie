import {AuthForm} from '@/components/auth/auth-form';
import {requireStaffPage} from '@/server/auth/page-guard';
export const dynamic='force-dynamic';
export const metadata={title:'Change password'};
export default async function ChangePassword(){await requireStaffPage('dashboard.read',true);return <AuthForm mode="change"/>}
