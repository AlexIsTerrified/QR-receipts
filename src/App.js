import {useState} from 'react'
import {QRCodeSVG} from 'qrcode.react';
import {Select,TextField, InputAdornment,IconButton,Button,Stack} from '@mui/material';
import {RemoveCircle,AddCircle} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import logo from './logo.svg';
import './main.css';

function App() {
  const [name,setName] = useState("My Company")
  const [address,setAddress] = useState("#22 somewhere")
  const [vat,setVat] = useState("123456")
  const [date,setDate] = useState(new Date())
  const [total,setTotal] = useState(5)
  const [length,setLength] = useState(0)
  const [data, setData] = useState("")
  const [items,setItems] = useState([{quantity:1,name:"item",vat:0,price:5}])

  const handleItems = (e,i,key) => {
    const n_items = items
    if(key === "quantity")n_items[i].quantity = Number(e.target.value) || 0
    else if(key === "name")n_items[i].name = e.target.value || "item"
    else if(key === "vat")n_items[i].vat = Number(e.target.value) || 0
    else if(key === "price")n_items[i].price = Number(e.target.value) || 0
    setItems(n_items)
    getTotal()
  }

  const handleRemove = (i) => {
    const n_items = items
    n_items.splice(i,1)
    setItems(n_items)
    setLength(n_items.length)
    getTotal()
  }

  const handleAdd = () => {
    const n_items = items
    n_items.push({quantity:1,name:"item",vat:"0",price:"5"})
    setItems(n_items)
    setLength(n_items.length)
    getTotal()
  }

  const getTotal = ()=>{
    console.log(items)
    let t = 0
    items.forEach((item)=>{
      t = t + (item.quantity * (item.vat + item.price))
    })
    setTotal(t)
  }

  const handleDateAndTime = (v) => {
		setDate(v.$d);
	  };

  const generate = () => {
    const d = date.getUTCDate()+""+("0" + (date.getUTCMonth()+1)).slice(-2)+""+date.getUTCFullYear()+""+("0" + date.getUTCHours()).slice(-2)+""+("0" + date.getUTCMinutes()).slice(-2)
    let text = name+"\n"+address+"\n"+vat+"\n"+d+"\n"+total
    items.forEach((item)=>{
      text = text+"\n"+item.name+"\n"+item.quantity+" "+item.price+(item.vat > 0 ? " "+item.vat : "")
    })

    setData(text)
  }

  return (
    <>
      <h1>Receipt generator</h1>
      <div className="main">
        <div className="form">
          <TextField label="Company Name" defaultValue="My Company" variant="filled" sx={{ m: 1, width: '270px' }} onChange={(e)=>setName(e.target.value)} />
          <TextField label="Company Address" defaultValue="#22 somewhere" variant="filled" sx={{ m: 1, width: '270px' }} onChange={(e)=>setAddress(e.target.value)} />
          <TextField label="Vat #" defaultValue="123456" size="small" variant="filled" sx={{ m: 1, width: '270px' }} type="number" onChange={(e)=>setVat(e.target.value)}/>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
						<Stack spacing={2}>
							<MobileDatePicker
							  label="Date"
							  inputFormat="DD/MM/YYYY"
							  value={date}
							  onChange={handleDateAndTime}
							  renderInput={(params) => <TextField {...params} />}
							/>
							<TimePicker
							  label="Time"
							  value={date}
							  onChange={handleDateAndTime}
							  renderInput={(params) => <TextField {...params} />}
							  views={['hours','minutes','seconds']}
							  inputFormat="hh:mm:ss A"
							/>
						</Stack>
					</LocalizationProvider>
          <h3>Total {total}</h3>
          <div className="items">
            {items.map((item,i)=>{
              return (
                <div className="item">
                    <TextField label="#" defaultValue={item.quantity} size="small" sx={{ m: 1, width: '60px' }} type="number" onChange={(e)=>handleItems(e,i,"quantity")} />
                    <TextField label="item name" defaultValue={item.name} size="small" sx={{ m: 1, width: '180px' }} onChange={(e)=>handleItems(e,i,"name")} />
                    <TextField label="vat" defaultValue={item.vat} size="small" sx={{ m: 1, width: '100px' }} type="number" 
                    onChange={(e)=>handleItems(e,i,"vat")}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}  />
                    <TextField label="unit price" defaultValue={item.price} size="small" sx={{ m: 1, width: '100px' }} type="number" 
                    onChange={(e)=>handleItems(e,i,"price")}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}  />
                    <IconButton size="small" variant="contained" color="error" onClick={()=>handleRemove(i)}><RemoveCircle/></IconButton>
                </div>
              )
            })}
            <Button variant="contained" startIcon={<AddCircle/> } onClick={()=>handleAdd()}>Add Item</Button>
          </div>
          <Button variant="contained" onClick={generate} margin="dense">Generate QR</Button>
        </div>
        <div className="result">
          {data ? <QRCodeSVG value={data} size={256} /> : ""}
          {data ? <div className="data">{data}</div> : ""}
        </div>
      </div>
    </>
  );
}

export default App;
