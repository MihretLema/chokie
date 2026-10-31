'use client';
import {useState} from 'react';
export async function signOut(){const response=await fetch('/api/auth/sign-out',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!response.ok)throw new Error('Sign out failed. Please try again.');location.assign('/admin/login');}
export function SignOutButton(){const[error,setError]=useState('');return <><button className="ad-btn secondary" onClick={()=>void signOut().catch(e=>setError(e.message))}>Sign out</button>{error&&<p role="alert">{error}</p>}</>}
