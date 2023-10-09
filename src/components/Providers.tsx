'use client'

import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

interface ProvidersProps {
  children: ReactNode
}

const Providers: FC<ProvidersProps> = ({children}) => {
  return (
  <>
    <Toaster 
      toastOptions={{
        className: '',
        style: {
          fontSize: '0.6rem',
          borderRadius: '10px',
          background: '#l1l1l1',
        },
      }}
       position='top-center' reverseOrder={false} />
      {children}
  </>
  )
}

export default Providers