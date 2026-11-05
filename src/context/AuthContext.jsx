import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/cloud.js'
const AuthContext = createContext(null)
export function AuthProvider({children}) {
 const [session,setSession] = useState(null)
 const [loading,setLoading] = useState(Boolean(supabase))
 const [recovery,setRecovery] = useState(false)
 useEffect(()=>{
  if (!supabase) return
  let alive=true
  supabase.auth.getSession().then(({data})=>{if(alive){setSession(data.session);setLoading(false)}}).catch(()=>{if(alive)setLoading(false)})
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,value)=>{setSession(value);setLoading(false);if(event==='PASSWORD_RECOVERY')setRecovery(true)})
  return ()=>{alive=false;subscription.unsubscribe()}
 },[])
 return <AuthContext.Provider value={{session,user:session?.user,loading,recovery,setRecovery}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext)
