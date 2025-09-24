import React, { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollTop(){
  const [visible, setVisible] = useState(false)
  useEffect(()=>{
    const onScroll = ()=> setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  if(!visible) return null

  return (
    <button className="scroll-top" onClick={()=> window.scrollTo({top:0,behavior:'smooth'})} aria-label="Scroll to top">
      <ArrowUp size={18} />
    </button>
  )
}
