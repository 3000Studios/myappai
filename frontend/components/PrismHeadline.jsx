import React from 'react'

export default function PrismHeadline({
  as: Tag = 'h1',
  text = '',
  className = '',
}) {
  return (
    <Tag className={['prism-headline', className].filter(Boolean).join(' ')}>
      <span className="prism-headline__text">{text}</span>
    </Tag>
  )
}
