import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select';
import axios from 'axios'
import Cards from '../Cards/Cards';
import FormByPost from '../FormByPost/FormByPost';
import s from '../SelectComponent/SelectComponent.module.css'

function SelectComponent() {
  const [museums,setMuseums]=useState([]) // almacenar data de la Api
  const [selectedMuseum,setSelectedMuseum]=useState(false) // cambiar de placeHolder
  const [inputSelect,setInputSelect]=useState([]) // almacenar inputs seleccionadas
  const [languages,setLanguages]=useState([]) // almacenar languages de la Api
  const [museumsOptions,setMuseumsOptions]=useState([  //mostrar opciones
    // { value: 'chocolate', label: 'Chocolate' },
  ])
  const [languagesOptions,setLanguagesOptions]=useState([
    // { value: 'chocolate', label: 'Chocolate' },
  ])
  const [floors,setFloors]=useState([]) // mostrar las tarjetas
  const [isEdits, setIsEdits]=useState(false) // para renderizar el form de edición, // esto lo activa un componente hijo en cardComponent, por ello lo mando como props
  const [showForm,setShowForm]=useState(false)
  const comodin=useRef(false) // para no lanzar mas de una vez getLanguages
 
  //funciones conexion API
  const getMuseums=async()=>{
    try {
        if(museums.length===0){
          const {data}=await axios.get('https://api.mm.dev.heriobbdev.es/api/museums')          
          setMuseums(data['hydra:member']);   
        }
        const newMuseumOptions = museums.map((museum) => ({
          value: museum.label,
          label: museum.label,
          id: museum.id,
        }));
  
        setMuseumsOptions(newMuseumOptions);
        comodin.current=false // para activar la opcion de getLanguages
    } catch (error) {
      console.log(error);
    }
  }

  const getLanguages = async()=>{    
    const id=inputSelect[0].id //sacamos el id del museo seleccionado   
    try {       
      const {data}=await axios.get(`https://api.mm.dev.heriobbdev.es/api/languages/${id}`)      
      setLanguages(data['hydra:member']);        
      const newLanguageOptions = languages.map((language) => ({
        value: language.label,
        label: language.label,
        id: language.id,
        code:language.code
      }));
      
      setMuseumsOptions(newLanguageOptions); 
      if(languages.length>0) comodin.current=true   // para q no se vuelva a lanzar la funcion getLanguages  
    } catch (error) {
      console.log(error);
    }    
  }

  const getFloors = async()=>{ // se activa cuando ya han elejido los dos select
    try {
      if(inputSelect[1]){       
        const {data}=await axios.get(`https://api.mm.dev.heriobbdev.es/api/floors/${inputSelect[0].id}`)       
        const resultFiltered=data["hydra:member"].filter((floor)=>floor.locale===inputSelect[1].code) // filtramos con el lenguaje seleccionado 
        setFloors(resultFiltered)
      }      
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(()=>{      
    inputSelect.length >0 && inputSelect[0].code && setInputSelect([]) //limpio cuando el user da a la X del museo sin borrar el idioma primero
    
    if(inputSelect.length===0) {      
      getMuseums()
    }
    if(inputSelect.length>1) getFloors()
    return ()=>{      
      setFloors([]) // limpio cada que desmonto para q no se vean los anteriores cuando se monta de nuevo
    }
  },[museums,inputSelect])

  useEffect(()=>{
    if(!comodin.current && inputSelect.length>0) getLanguages()
  },[inputSelect,languages])

  //Handlers
  const handlerChangeSelect=(e)=>{
    setInputSelect(e)   
  }
  const handlerCreateFloor = ()=>{
    setShowForm(true)
    //setIsEdits(false)
  }

  return (
    <div className='w-100'>
      <div className={`${s.select} w-100`}>
        <Select
            //defaultValue={[colourOptions[2], colourOptions[3]]}            
            isMulti
            name="crud"
            options={museumsOptions?museumsOptions:null}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder='Select a museum'            
            value={inputSelect}
            onChange={(e) => {
              if (e.length <= 2) { // para limitart a 2 las opciones del user
                handlerChangeSelect(e);
              }
            }}            
        />  
      </div>

      <div className={`${s.containerFloors}`}>
        <div className={`${s.scrollfloors} col-12 mt-4`}>
          {
            inputSelect.length===0 && <h2 className={`${s.titleH2} fw-bold`}>you should select a museum and language</h2>
          }
           {
            inputSelect.length===1 && <h2 className={`${s.titleH2} fw-bold`}>Now select a language</h2>
          }
          {
            inputSelect.length>1 && (floors.length>0? <Cards label={inputSelect[0].label} floors={floors} getFloors={getFloors} setIsEdits={setIsEdits}/>
            : <h2 className={`${s.titleH2} fw-bold`}>There are no floors, please create a new one</h2>)
          }
        </div>

        <div className='mt-2'>
          {
            !showForm && inputSelect.length>1 && <button onClick={()=>handlerCreateFloor()} className='btn btn-dark'>Create New Floor</button>
          }  
          
          {
            inputSelect.length>1 && showForm && <FormByPost locale={inputSelect[1].code} idMuseum={inputSelect[0].id} getFloors={getFloors} showForm={showForm} setShowForm={setShowForm}/>
          }           

        </div>
      </div>
    </div>
  )
}

export default SelectComponent
