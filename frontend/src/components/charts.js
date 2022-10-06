
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    registerables
  } from 'chart.js';

import { useEffect, useState } from 'react';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  
export default function Charts(props){

    const [data, setData] = useState([])

    useEffect(() => { 
      setData(props.compareData)
    })

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales:{
        x: {
          title: {
            display: true,
            text: 'False positive rate'
          },
          type: 'linear'
        },
      },
      
    };
    
    const roc_data = {
        labels: props.compareData['roc'][0],
        datasets: [
          {
            label: 'ROC curve',
            data: props.compareData['roc'][1],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
    };
    console.log(props.compareData)

    return (
        <div>
          <div className='m-auto max-w-2xl pt-12' id="scores">
            <p className='text-center text-lg'>Visualizing prediction scores</p>
            <div className='grid grid-cols-2 w-2xl bg-gray-100 p-2 rounded'>
              <p className='text-sm'>Predictions from <p className='font-bold'>{props.compareData['pred_table']}</p></p>
              <p className='text-sm text-right'>True values from <p className='font-bold'>{props.compareData['true_table']}</p></p>
            </div>


            <div className="overflow-hidden bg-white shadow sm:rounded-lg my-4">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Applicant Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Accuracy score</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{props.compareData['acc']}</dd>
                    <div className='text-center'>
                        <a href="" className="mt-1 text-sm sm:col-span-1 sm:mt-0 text-blue-500">about</a>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Mean squared error</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{props.compareData['mse']}</dd>
                    <div className='text-center'>
                        <a href="" className="mt-1 text-sm sm:col-span-1 sm:mt-0 text-blue-500">about</a>
                    </div>
                  </div>
                  
              
                  <div className="bg-gray-50 px-4 py-5 sm:px-6 sm:grid sm:grid-cols-3 sm:gap-4 overflow-x-scroll">
                      <pre className='text-[12px] sm:col-span-2 text-center '>{props.compareData['classf']}</pre>
                      <div className='text-center'>
                          <a href="" className="mt-1 text-sm sm:col-span-1 sm:mt-0 text-blue-500">about</a>
                      </div>
                      
                  </div>
                
                </dl>
              </div>
            </div>
            
            {data && (
                <Line options={options} data={roc_data} />
            )}
          </div>
          
            
        </div>
    )
}