import React from 'react'
import Button from "./Button.jsx";

import { useNavigate } from 'react-router-dom';

const BackButton = () => {

    const navigate = useNavigate();

  return (
     <Button onClick={()=> navigate(-1)} type="back" >&larr; Back</Button>
  )
}

export default BackButton