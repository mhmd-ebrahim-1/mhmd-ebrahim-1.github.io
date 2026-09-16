import { useEffect, useRef, useState } from 'react'

export function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}

export function useTyping(words, speed = 100) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const word = words[wordIdx % words.length]
    if (typing) {
      if (text.length < word.length) {
        const t = setTimeout(() => setText(word.slice(0, text.length + 1)), speed)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1500)
        return () => clearTimeout(t)
      }
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), speed / 2)
        return () => clearTimeout(t)
      } else {
        setWordIdx(i => i + 1)
        setTyping(true)
      }
    }
  }, [text, typing, wordIdx, words, speed])

  return text
}
