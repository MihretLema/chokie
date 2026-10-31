import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {principal,permit} from './principal';
import {ApiError} from '../utils/errors';
export async function requireStaffPage(permission='dashboard.read',allowPasswordChange=false){let actor;try{actor=await principal(await headers(),true)}catch(error){if(error instanceof ApiError&&[401,403].includes(error.status))redirect('/admin/login');throw error}if(actor.passwordChangeRequired&&!allowPasswordChange)redirect('/admin/change-password');permit(actor,permission);return actor;}
