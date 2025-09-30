import { useEffect } from 'react'


export default function useInViewPlay(ref, options = {}){
useEffect(() => {
if(!ref.current) return
const el = ref.current
const io = new IntersectionObserver((entries) => {
entries.forEach(e=>{
if(e.isIntersecting){
el.play && el.play().catch(()=>{})
} else {
el.pause && el.pause()
}
})
}, { threshold: 0.6, ...options })


io.observe(el)
return ()=> io.disconnect()
}, [ref, JSON.stringify(options)])
}