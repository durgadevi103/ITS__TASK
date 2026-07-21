import React from 'react'
import { motion } from "framer-motion";

const Hi = () => {
  return (
    <div>
      {/* <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Hello
</motion.div> */}

<motion.div
//   initial={{
//     opacity: 0,
//     y: 100,
//   }}
//   animate={{
//     opacity: 1,
//     y: 0,
//   }}

initial={{opacity:0}}
animate={{opacity:1}}
transition={{duration:1}}
>

  Signup
</motion.div>
    </div>



  )
}

export default Hi
