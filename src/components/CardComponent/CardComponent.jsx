import React, { useEffect, useRef, useState } from 'react'
import Card from 'react-bootstrap/Card';
import s from '../CardComponent/CardComponent.module.css'
import axios from 'axios';
import FormByPost from '../FormByPost/FormByPost';

function CardComponent({label,title,id, locale,getFloors,setIsEdits,ID_MUSEUM}) {
  //hooks
  const [isEdit, setIsEdit]=useState(false) // para renderizar el form de edicición  
 
  //funciones conexión API
  const deleteFloor=async()=>{ // elimina un floor
    try {
      const {data}=await axios.delete(`https://api.mm.dev.heriobbdev.es/api/floor/${id}?locale=${locale}`)      
    } catch (error) {
      console.log('error');
    }
  }

  //Handlers
  const handlerDelete=()=>{
    async function fetch(){ // para q espere el post y luego cargue de nuevo los floors con la funcion que llega de props
      await deleteFloor()
      getFloors()        
    }
    fetch()
  }  

  const handlerEdit=()=>{  
    setIsEdit(true)   
    setIsEdits(true) // esto manda al padre SelectComponent el cambio de form   
  }

  return (
    <div className='p-2'>
        <Card
        bg={'dark'}
        key={'dark'}
        text={'light'}
        style={{ width: '18rem',height:'179px' }}
        className={`${s.card} mb-2`}
        >
          <Card.Header>{label}</Card.Header>
          <Card.Body>
          <Card.Title>{title} </Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          </Card.Body>
          <button onClick={()=>handlerEdit(title)} className={`${s.btnEdit} btn btn-light`}><i className="bi bi-pen-fill"></i></button>
          <button onClick={()=>handlerDelete()} className={`${s.btnDelete} btn btn-light`}><i className="bi bi-trash3-fill"></i></button>
        </Card>      
        <div className={`${s.containerEdit} col-6`}>
          {
            isEdit && <FormByPost locale={locale} idMuseum={ID_MUSEUM} getFloors={getFloors} idFloor={id} isEdit={isEdit} setIsEdit={setIsEdit} title={title}/>
          }
        </div>
    </div>
    
  )
}

export default CardComponent
