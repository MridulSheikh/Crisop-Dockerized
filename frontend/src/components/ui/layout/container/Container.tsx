import React, { ReactNode } from 'react'

type TProps = {
    children: ReactNode
}

const Container = ({children}: TProps) => {
  return (
    <div className=' max-w-screen-xl mx-auto px-5'>{children}</div>
  )
}

export default Container