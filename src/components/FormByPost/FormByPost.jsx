import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import axios from 'axios';
import s from '../FormByPost/Form.module.css'

//este form sirve para postear y editar
function FormByPost({idMuseum, locale, getFloors,idFloor,isEdit,setIsEdit,setShowForm,title}) {
    //Hooks
    const [dataForm,setDataForm]=useState({        
        idMuseum: idMuseum.toString(),
        planURLL: "string",
        imageURL: "string",
        title: null,        
        text:null
    })
    const [valueTitle,setValueTitle]=useState('')
    const [validated, setValidated] = useState(false);

    useEffect(()=>{
        title && setValueTitle(title)
        async function fetch(){ // para q espere el post y luego cargue de nuevo los floors con la funcion que llega de props
            if(dataForm.title){                
                !isEdit? await postFloor() : await editeFloor()
                getFloors()
                setIsEdit && setIsEdit(false) // para cerrar el edit form en caso que este abierto
                setShowForm && setShowForm(false) // para cerrar el create form
            }
        }
        fetch()
    },[dataForm])

    //funciones conexión API
    const postFloor=async()=>{ //postear un nuevo floor
        try {
            const {data}= await axios.post(`https://api.mm.dev.heriobbdev.es/api/floor?locale=${locale}`, 
                dataForm,
                {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                })
        } catch (error) {
            console.log(error);
        }
    }
    const editeFloor=async()=>{ // edita un floor
        try {
          const {data}=await axios.put(`https://api.mm.dev.heriobbdev.es/api/floor/${idFloor}?locale=${locale}`, 
          dataForm,
          {
              headers: {
                'Content-Type': 'application/json',
              },
          })          
        } catch (error) {
          console.log('error');
        }
    }

    //Handlers
    const handleSubmit = (event) => {
        event.preventDefault();        
        const form = event.currentTarget; // capturamos los campos digitados por el usuario en HTML
        if (form.checkValidity() === true) { // esto valida el required            
            const title= form.elements.floatingTitle.value // el valor del input title
            const text= form.elements.floatingText.value // el valor del input textarea                  
            setDataForm({
                ...dataForm,                
                title:title,
                text:text,
            })
            setValidated(false)                        
        } else setValidated(true) // activar validación  
        
    }; 
    const handlerCancel=()=>{
        setShowForm && setShowForm(false)
        setIsEdit && setIsEdit(false) // para cerrar el edit form en caso que este abierto
    }
    const handlerChangeTitle=(e)=>{
        const {value}=e.target        
        setValueTitle(value)
    }
  
    return (
      <Form className={`${s.formContainer}`}noValidate validated={validated} onSubmit={(event)=>handleSubmit(event)}>
        <FloatingLabel style={{fontWeight:'bolder', color:'white'}} controlId="floatingTitle" label="Title Floor" className="mb-3">
            <Form.Control 
                type='text'                               
                required
                value={valueTitle}
                onChange={(e)=>handlerChangeTitle(e)}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
                Please choose a title.
            </Form.Control.Feedback>
        </FloatingLabel>
        <FloatingLabel controlId="floatingText" label="Description">
            <Form.Control 
                as='textarea'                 
                style={{ height: '100px' }}
                required
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
                Please choose a descriptión.
            </Form.Control.Feedback>
        </FloatingLabel>        
        <Button className='btn btn-secondary mt-2' type="submit">{isEdit?'Edit Floor':'Create Floor'}</Button>
        <button onClick={()=>handlerCancel()} className={`btn btn-light ${s.btnX}`}>X</button>
      </Form>
    );
}
  
export default FormByPost
