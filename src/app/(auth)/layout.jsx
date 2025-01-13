import { Toaster } from 'react-hot-toast';

export default function AuthLayout({children}) {
    return (
      <div>
        <Toaster position="top-center" />
        {children}
      </div>
    )
  }
  