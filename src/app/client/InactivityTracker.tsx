// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/router'
// import { startInactivityTimeout, resetInactivityTimeout } from '@/lib/inactivityTimeout'
// import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs'

// const InactivityTracker: React.FC = () => {
//   const router = useRouter()
//   const { user } = useKindeAuth()

//   useEffect(() => {
//     if (!user) return

//     const handleInactivityTimeout = () => {
//       alert('Session expired due to inactivity. Please log in again.')
//       logout() // Use Kinde's logout function
//       router.push('/')
//     }

//     startInactivityTimeout(handleInactivityTimeout)

//     const resetTimeout = () => resetInactivityTimeout(handleInactivityTimeout)

//     window.addEventListener('mousemove', resetTimeout)
//     window.addEventListener('keypress', resetTimeout)

//     return () => {
//       window.removeEventListener('mousemove', resetTimeout)
//       window.removeEventListener('keypress', resetTimeout)
//     }
//   }, [router, user])

//   return null
// }

// export default InactivityTracker
