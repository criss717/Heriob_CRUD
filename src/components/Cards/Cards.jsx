import React from 'react'
import CardComponent from '../CardComponent/CardComponent'

function Cards({label,floors,getFloors,setIsEdits}) {
  return (
    <div className='d-flex flex-wrap'>
        {
            floors.length>0  && floors.map((floor)=>< CardComponent // mandamos por props las propiedades que necesitamos del array floors
                title={floor.TITLE}
                locale={floor.locale}
                key={floor.ID_PLAN}       
                label={label}
                id={floor.ID_PLAN}
                getFloors={getFloors} 
                setIsEdits={setIsEdits}   
                ID_MUSEUM={floor.ID_MUSEUM} 
            />)
        }
        
    </div>
  )
}

export default Cards
