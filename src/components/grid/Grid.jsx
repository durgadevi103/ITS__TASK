import React from 'react'

const Grid = () => {
  return (
    <div>
      <p>this is a grid page</p>
      <div className='grid grid-cols-3 gap-5'>
        <div className='bg-amber-800 p-10 text-white text-center'>1</div>
        <div className='bg-amber-950 p-10 text-white text-center'>2</div>
        

            <div className="bg-amber-300 p-10 text-center row-span-2">
  3
</div>
        
<div className='col-span-2 '>
        <div className='bg-amber-800 p-10 text-white text-center'>4</div>
        </div>
        {/* <div className='bg-amber-300 p-10 text-center'>5</div> */}

        <div className='bg-amber-800 p-10 text-white text-center'>6</div>
        <div className='col-span-2'>
            <div className='bg-amber-950 p-10 text-white text-center'>7</div>
        </div>
        <div className='col-span-3'>
        <div className='bg-amber-300 p-10 text-center'>8</div>






      </div>

      </div>
    </div>
    
  )
}

export default Grid
