import axios from 'axios'
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

export default function Predict(){

    const [upload, setUpload] = useState(null)
    const [encode, setEncode] = useState('latin-1')

    const onChange = (e) => {
        setUpload(e.target.files[0])
    };

    const uploadFile = (file) => {
        let url = "http://localhost:8000/api/upload";

        let formData = new FormData();
        formData.append("file", upload);
        formData.append("encoding", encode);
        axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }).then((response) => {
                fnSuccess(response);
          }).catch((error) => {
                fnFail(error);
          });
    };

    const fnSuccess = (response) => {
        toast.success(response.data)
    };
    
    const fnFail = (error) => {
        console.log(error.response)
        toast.error(error.response.data)
    };


    return (
        <>
            <input type="text" placeholder='encoding' value={encode} onChange={(e) => setEncode(e.target.value)}></input>

            <input type="file" onChange={onChange} accept =".csv"/>
            <button className='p-10' onClick={() => uploadFile()} >but</button>
        </>
    )
}