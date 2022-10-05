import axios from 'axios'
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import Table from './table'

const baseurl = "http://localhost:8000"

export default function Predict(){

    const [upload, setUpload] = useState(null)
    const [encode, setEncode] = useState('latin-1')

    const [tables, setTables] = useState([])

    const [visu, setVisu] = useState(null)

    const onChange = (e) => {
        setUpload(e.target.files[0])
    };

    const loadFiles = () => {
        axios.get(baseurl + '/api/get_files_available')
            .then(res => {
                setTables(res.data)
            })
    }

    const getTable = (name) => {
        axios.post(baseurl + '/api/visualize_df', {file: name})
            .then(res => {
                setVisu(res.data)
            })
    }

    const uploadFile = (file) => {
        let url = baseurl + "/api/upload";

        let formData = new FormData();
        formData.append("file", upload);
        formData.append("encoding", encode);
        axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }).then((response) => {
                fnSuccess(response);
                loadFiles();
          }).catch((error) => {
                fnFail(error);
          });
    };

    const fnSuccess = (response) => {
        toast.success(response.data)
        setUpload(null)
    };
    
    const fnFail = (error) => {
        console.log(error.response)
        toast.error(error.response.data)
    };

    useEffect(() => {
        loadFiles()
    }, [])


    return (
        <div>
            <div className='grid max-w-2xl m-auto py-16'>
                <div className='w-[200px] m-auto'>
                    <label>Decoding: </label>
                    <input className='rounded-lg w-[100px]' type="text" placeholder='encoding' value={encode} onChange={(e) => setEncode(e.target.value)}></input>
                    <p className='text-center'>{upload && upload.name}</p>
                </div>
                
                <input className='m-auto py-4 w-[100px]' type="file" onChange={onChange} accept =".csv"/>
                <button className='px-4 py-2 w-[200px] m-auto hover:bg-slate-100 bg-gray-300 rounded-lg' onClick={() => uploadFile()} >upload</button>
            </div>
            

            <div className='m-auto max-w-lg'>
                <p>Tables uploaded: </p>
                <ul role="list" className="divide-y divide-gray-200">
                    {tables.map((table, index) => (
                    <li key={index} className="py-4">
                        <div className="flex space-x-3">
                        <p className="text-sm text-red-500">delete</p>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm text-gray-500">
                                {table}
                            </p>
                        </div>
                            <p className='cursor-pointer' onClick={() => getTable(table)}>Visualize</p>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>

            {visu && 
                <Table setVisu={setVisu} table={visu} />
            }
        </div>
    )
}