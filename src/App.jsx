import './App.css';
import React, { useState } from "react";

import { generateQuote } from './scripts/generatePdf';
import { useForm } from 'react-hook-form';

function App() {
  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors }
  } = useForm({
    defaultValues: {
      example: "",
      exampleRequired: ""
    }
  });

  const [phone, setPhone] = useState('');
  const [measurements, setMeasurements] = useState({});


  const updateFt = (key, value) => {
    const updateMeasurements = {...measurements, [key]: {...measurements[key], ft: value}};
    setMeasurements(updateMeasurements);
  }

  const updateInch = (key, value) => {
    const updateMeasurements = {...measurements, [key]: {...measurements[key], inch: value}};
    setMeasurements(updateMeasurements);
  }

  const phoneNumberAutoFormat = (phoneNumber)  => {
    const number = phoneNumber.trim().replace(/[^0-9]/g, "");
  
    if (number.length < 4) return number;
    if (number.length < 7) return number.replace(/(\d{3})(\d{1})/, "($1) $2");
    if (number.length < 11) return number.replace(/(\d{3})(\d{3})(\d{1})/, "($1) $2-$3");
    return number.replace(/(\d{3})(\d{4})(\d{4})/, "($1) $2-$3");
  };

  const onPhoneChange = (e) => {
    const targetValue = phoneNumberAutoFormat(e.target.value);
    setPhone(targetValue);
  };

  // console.log(watch("example")); // you can watch individual input by pass the name of the input

  const generateMeasure = (measurement) => {
    const width = ['A', 'B'];
    const height = ['C', 'D', 'E'];
    const measureArr = measurement === 'width' ? width : height;
    return measureArr.map( (string) => {
      return <>
        {string + ':'}
       <label htmlFor={"measurementFt" + string}>Ft:</label>
       <input onChange={(e) => updateFt(string, e.target.value)} autoComplete="none" type="number" id={"measurementFt" + string} required/>
       <label htmlFor={"measurementIn" + string}>In:</label>
       <input onChange={(e) => updateInch(string, e.target.value)} autoComplete="none" type="number" id={"measurementIn" + string} required/>
      </>
     })
  }

  const generateColorPickers = () => {
    const colors = ['White', 'Black', 'Dark Brown', 'Anthricite', 'Grey'];
    const parts = ['slat', 'endslat', 'box', 'guiderail'];
    return parts.map( part => {
      return( 
        <>
          <label htmlFor={part}>{part}: </label>
            <select key={part} {...register(part + 'Color')} id={part}>
            {
              colors.map( color => {
                return <option key={part+color} value={color}>{color}</option>
              })
            }
          </select>
        </>)
    })
  }

  return (
    <form
      onSubmit={handleSubmit((data) => {
        generateQuote(data, measurements)
      })}
    >
      <h1>Generate Quote</h1>
      <fieldset>
        <legend>Customer Info:</legend>
        
        <label htmlFor="customerName">Customer Name:</label>
        <input autoComplete="none" {...register("customerName")} id="customerName" required/>
        
        <label htmlFor="customerPhone">Customer Phone:</label>
        <input type="tel" value={phone} autoComplete="none" {...register("customerPhone", {onChange: (e) => onPhoneChange(e)})} id="customerPhone" maxLength={15} required/>
        
        <label htmlFor="customerEmail">Customer Email:</label>
        <input autoComplete="none" type="email" {...register("customerEmail")} id="customerEmail" required/>
      </fieldset>
      
      <fieldset>
        <legend>Width</legend>
          {generateMeasure('width')}
      </fieldset>
      <fieldset>
        <legend>Height</legend>
          {generateMeasure('height')}
      </fieldset>
      <fieldset>
        <legend>Manual Override:</legend>
        <input {...register("manualOverride")} id="overrideFront" value="overrideFront" name="manualOverride" type="radio" defaultChecked />
        <label htmlFor="overrideFront">Front</label>
        <input {...register("manualOverride")} id="overrideBack" value="overrideBack" name="manualOverride" type="radio" />
        <label htmlFor="overrideBack">Back</label>
      </fieldset>
      <fieldset>
        <legend>Control Unit Side:</legend>
        <input {...register("controlUnitSide")} id="left" value="left" name="controlUnitSide" type="radio" defaultChecked />
        <label htmlFor="left">Left</label>
        <input {...register("controlUnitSide")} id="right" value="right" name="controlUnitSide" type="radio" />
        <label htmlFor="right">Right</label>
      </fieldset>
      <fieldset>
        <legend>Slat Profile:</legend>
        <input {...register("slatProfile")} value="55" id="slat55" name="slatProfile" type="radio" defaultChecked />
        <label htmlFor="slat55">55</label>
        <input {...register("slatProfile")} value="77" id="slat77" name="slatProfile" type="radio" />
        <label htmlFor="slat77">77</label>
      </fieldset>
      <fieldset>
        <legend>Endslat:</legend>
        <input {...register("endslat")} value="ldg-s" id="ldg-s" name="endslat" type="radio" defaultChecked />
        <label htmlFor="slat55">LDG-S</label>
        <input {...register("endslat")} value="ldg-d" id="ldg-d" name="endslat" type="radio" />
        <label htmlFor="slat77">LDG-D</label>
      </fieldset>
      <fieldset>
        
      </fieldset>
      <fieldset>
        <legend>Guiderail:</legend>
        <input {...register("guiderail")} value="pp_75" id="pp_75" name="guiderail" type="radio" defaultChecked />
        <label htmlFor="pp_75">PP75</label>
        <input {...register("guiderail")} value="pp_89" id="pp_89" name="guiderail" type="radio" />
        <label htmlFor="pp_89">PP89</label>
        <input {...register("guiderail")} value="pp_110" id="pp_110" name="guiderail" type="radio" />
        <label htmlFor="pp_110">PP110</label>
      </fieldset>
      <fieldset>
        <legend>Box Size:</legend>
        <input {...register("boxSize")} id="box_250" value="250" name="boxSize" type="radio" defaultChecked />
        <label htmlFor="box_250">250</label>
        <input {...register("boxSize")} id="box_300" value="300" name="boxSize" type="radio" />
        <label htmlFor="box_300">300</label>
      </fieldset>
      <fieldset>
        <legend>Exit Strap/Wire:</legend>
        <input {...register("exitPosition")} id="exit_1" value="exit_1" name="exitPosition" type="radio" defaultChecked />
        <label htmlFor="exit_1">1</label>
        <input {...register("exitPosition")} id="exit_8" value="exit_8" name="exitPosition" type="radio" />
        <label htmlFor="exit_8">8</label>
      </fieldset>
      <fieldset>
        {generateColorPickers()}
      </fieldset>
      <fieldset>
        <legend>Guid Rail Drilling:</legend>
        <label htmlFor="drillLeft">Left:</label>
        <select {...register("drillLeft")} id="drillLeft">
          <option value="side">Side</option>
          <option value="top">Top</option>
        </select>
        <label htmlFor="drillLeft">Right:</label>
        <select {...register("drillRight")} id="drillRight">
          <option value="side">Side</option>
          <option value="top">Top</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Extras(separate by comas):</legend>
        <textarea{...register("extras")}></textarea>
      </fieldset>
      <fieldset>
        <legend>Price:</legend>
        <label htmlFor="price">Price:</label>
        <input type="number" {...register("price")} id="price" />
        <label htmlFor="Quantity">Quantity:</label>
        <input type="number" {...register("quantity")} id="quantity" />
      </fieldset>
      <input type="submit" />
    </form>
  );
}

export default App;
