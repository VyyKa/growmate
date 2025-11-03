interface ContactCardProps {
  imgSrc: string
  altText: string
  title: string
  content: string
  animation?: string
}

const ContactCard = ({
  imgSrc,
  altText,
  title,
  content,
  animation,
}: ContactCardProps) => {
  return (
    <div className="flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div className={`shrink-0 rounded-lg bg-green-50 p-3 hover:${animation}`}>
        <img src={imgSrc} alt={altText} className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-500 font-medium">{title}</div>
        <div className="mt-1 text-base font-semibold text-gray-900 leading-6">{content}</div>
      </div>
    </div>
  )
}

export default ContactCard
