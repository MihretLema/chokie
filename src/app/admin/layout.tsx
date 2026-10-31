import type {Metadata} from 'next';
import './admin.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:{default:'Administrator sign in',template:'%s | CHOKIE Administration'},robots:{index:false,follow:false},description:'Secure CHOKIE administration.'};
export default function AdminRootLayout({children}:{children:React.ReactNode}){return children;}
