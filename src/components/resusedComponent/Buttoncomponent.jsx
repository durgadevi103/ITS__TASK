import React from 'react'

const Buttoncomponent = ({ variant, icon: Icon, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg transition active:scale-95 text-sm self-start md:self-auto ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{variant}</span>
    </button>
  )
}

export default Buttoncomponent