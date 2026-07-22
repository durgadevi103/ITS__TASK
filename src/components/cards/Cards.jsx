import React from 'react'
import { motion } from 'framer-motion'

const Cards = ({
  title,
  value,
  trendText,
  trendIcon: TrendIcon,
  trendColor = 'text-emerald-600',
  icon: Icon,
  iconBg,
  iconColor,
  valueColor = 'text-gray-900'
}) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</h3>
        <span className={`text-xs font-medium inline-flex items-center gap-1 mt-1 ${trendColor}`}>
          {TrendIcon && <TrendIcon className="w-3.5 h-3.5" />}
          <span>{trendText}</span>
        </span>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </motion.div>
  )
}

export default Cards