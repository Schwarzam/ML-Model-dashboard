import axios from 'axios'
import { useEffect, useState } from 'react';

import { GoTrashcan } from 'react-icons/go'
import { BiShow } from 'react-icons/bi'
import { toast } from 'react-toastify';

import Table from './table'

import Compare from './compareTo'

import Charts from './charts'

const baseurl = process.env.REACT_APP_SERVER

export default function Predict(){

    const [upload, setUpload] = useState(null)
    const [encode, setEncode] = useState('latin-1')

    const [tables, setTables] = useState([])

    const [visu, setVisu] = useState(null)

    const [comparing, setComparing] = useState(null)

    const [compareData, setCompareData] = useState(null)

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

    const deleteTable = (name) => {
        axios.post(baseurl + '/api/delete_df', {file: name})
            .then(res => {
                toast.success(res.data)
                loadFiles()
            })
    }

    const predictTable = (name) => {
        axios.post(baseurl + '/api/predict', {file: name})
            .then(res => {
                toast.success('Predicted with sucess!')
                loadFiles()
            })
            .catch(err => {
                toast.error(err.response.data)
            })
    }

    const compareTable = (name, to) => {
        
        axios.post(baseurl + '/api/compare_to', {file_pred: name, file_true: to})
            .then(res => {
                setComparing(null)
                toast.success('Compared!')
                setCompareData(res.data)
            })
            .catch(err => {
                toast.error(err.response.data)
            })
    }

    


    const uploadFile = (file) => {
        if (!upload){
            return
        }

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
            <div className='grid max-w-2xl m-auto py-8 border rounded my-4'>
                <p className='text-center font-bold text-xl py-2'>upload tables</p>
                <div className='w-[200px] flex-1 m-auto'>
                    <label>Decoding: </label>
                    <input className='rounded-lg w-[100px]' type="text" placeholder='encoding' value={encode} onChange={(e) => setEncode(e.target.value)}></input>
                    
                </div>
                <div className='m-auto'>
                    <input className='m-auto py-4 w-[100px]' type="file" onChange={onChange} accept =".csv"/>
                    <button className={`px-2 py-1 w-[200px] m-auto hover:bg-slate-100 bg-gray-300 ${upload && 'bg-green-300 hover:bg-green-400'} rounded-lg`} onClick={() => uploadFile()} >upload</button>
                </div>
                <p className='text-center'>{upload && upload.name}</p>
            </div>

            <div className='m-auto max-w-lg'>
                <p>Tables uploaded: </p>
                <ul role="list" className="divide-y divide-gray-200">
                    {tables.map((table, index) => (
                    <li key={index} className="py-4">
                        <div className="flex space-x-3">
                        <GoTrashcan size={20} onClick={() => deleteTable(table)} className="cursor-pointer text-sm text-red-500" />
                        <div className="flex-1 space-y-1">
                            <p className={`text-sm text-gray-500 ${table.includes('predicted') && 'text-green-500'}`}>
                                {table}
                            </p>
                        </div>
                            {!table.includes('predicted') && <p className='cursor-pointer' onClick={() => predictTable(table)}>predict</p>}
                            {table.includes('predicted') && <p className='cursor-pointer text-sm' onClick={() => setComparing(table)}>compare</p>}
                            <BiShow size={20} className='m-auto cursor-pointer' onClick={() => getTable(table)} />
                        </div>
                    </li>
                    ))}
                </ul>
            </div>

            {visu && 
                <Table setVisu={setVisu} table={visu} />
            }

            {(comparing && !visu) && 
                <Compare setComparing={setComparing} comparing={comparing} compareTable={compareTable} tables={tables} />
            }


            {(compareData && !comparing && !visu) && 
                <Charts compareData={compareData} setCompareData={setCompareData} />
            }

            
        </div>
    )
}