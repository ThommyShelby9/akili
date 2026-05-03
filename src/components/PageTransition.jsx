import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }) {
  const location = useLocation()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState('enter')

  useEffect(() => {
    if (children !== displayChildren) {
      setTransitionStage('exit')
    }
  }, [children, displayChildren])

  function handleTransitionEnd() {
    if (transitionStage === 'exit') {
      setDisplayChildren(children)
      setTransitionStage('enter')
      window.scrollTo(0, 0)
    }
  }

  return (
    <div
      className={`page-transition page-${transitionStage}`}
      onAnimationEnd={handleTransitionEnd}
    >
      {displayChildren}
    </div>
  )
}
