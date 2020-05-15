import React, { useRef, useEffect } from 'react';
import { Form } from '@unform/web';
import { Scope } from '@unform/core';
import * as Yup from 'yup';
import './App.css';

import Input from './components/Form/Input';


function App() {
  
  const formRef = useRef(null);

  async function handleSubmit(data, { reset }) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        email: Yup.string()
          .email('Digite um email válido')
          .required('O e-mail é obrigatório'),
        address: Yup.object().shape({
          street: Yup.string()
            .min(3, 'No minimo 3 caracteres')
            .required('A rua é obrigatória'),        
        })  
      });

      await schema.validate(data, {
        abortEarly: false,
      });
      
      console.log(data);

      formRef.current.setErrors({});
      
      reset();      

    } catch (err) { 
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach( error => {
          errorMessages[error.path] = error.message;
        })

        formRef.current.setErrors(errorMessages);
      }

    }
    
  }

  useEffect(() => {
    setTimeout(() => {
      formRef.current.setData({
        name: 'Walter Souza',
        email: 'wsksouza@gmail.com', 
        address: {
          street: 'Rua Manuel de Freitas',
        }       
      })
    }, 2000);
  }, []);
  

  return (
    <div className="App">
      <h1>Hello Unform Web</h1>

      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input placeholder="nome" name="name" />
        <Input placeholder="email" type="email" name="email" />

        <Scope path="address">
          <Input placeholder="street" name="street" />
          <Input placeholder="number" name="number" />
        </Scope>

        <button type="submit">Enviar</button>
      </Form>
    </div>
  );
}

export default App;


