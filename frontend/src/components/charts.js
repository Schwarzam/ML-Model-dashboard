
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

function goto($hashtag){
    window.scrollTo(0, 0)
      const a = document.getElementById($hashtag)
    console.log(a.getBoundingClientRect(), $hashtag, a.getClientRects())
      const rect = a.getBoundingClientRect()
    
      window.scrollTo(0, rect.top - 20)
}

  
export default function Charts(props){

    useEffect(() => { 
      goto("scores")
    }, [])

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
        y: {
          title: {
            display: true,
            text: 'True positive rate'
          },
          type: 'linear',
          ticks: {
            // forces step size to be 50 units
            stepSize: 0.2
          }
        },
      },
      fill: true,
      
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
            <p className='text-center text-lg py-4'>Visualizing prediction scores</p>
            <div className='grid grid-cols-2 w-2xl bg-gray-100 p-2 rounded'>
              <p className='text-sm'>Predictions from <p className='font-bold'>{props.compareData['pred_table']}</p></p>
              <p className='text-sm text-right'>True values from <p className='font-bold'>{props.compareData['true_table']}</p></p>
            </div>


            <div className="overflow-hidden bg-white shadow sm:rounded-lg my-4">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Model prediction information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Metrics made on model prediction comparing to true table.</p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Accuracy score</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{props.compareData['acc'].toFixed(4)}</dd>
                    <div className='text-center'>
                        <p className='text-[12px] text-left'>Accuracy classification score.</p>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Mean squared error</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{props.compareData['mse'].toFixed(4)}</dd>
                    <div className='text-center'>
                        <p className='text-[12px] text-left'>A risk metric corresponding to the expected value of the squared (quadratic) error or loss.</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">F1 score</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{props.compareData['f1'].toFixed(4)}</dd>
                    <div className='text-center'>
                        <p className='text-[12px] text-left'>Harmonic mean between precision and recall.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white px-4 py-5 grid grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Confusion matrix</dt>
                    <div className='text-center w-[160px]'>    
                        <div className='grid grid-cols-2'>
                            <div className='bg-blue-0 w-[80px] text-sm'>
                              {props.compareData['tpr'].toFixed(4)}
                            </div>
                            <div className='bg-blue-200 w-[80px] text-sm'>
                              {props.compareData['fpr'].toFixed(4)}
                            </div>
                        </div>
                        <div className='grid grid-cols-2'>
                            <div className='bg-blue-200 w-[80px] text-sm'>
                              {props.compareData['fnr'].toFixed(4)}
                            </div>
                            <div className='bg-blue-0 w-[80px] text-sm'>
                               {props.compareData['tnr'].toFixed(4)}
                            </div>
                        </div>
                      </div>
                      <div className='text-center'>
                          <p className='text-[12px] text-left'>Confusion matrix is used to evaluate the accuracy of a classification.. More about at <a className='text-blue-500' href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html">scikit docs</a></p>
                      </div>
                  </div>
              
                  <div className="bg-gray-50 px-4 py-5 sm:px-6 sm:grid sm:grid-cols-3 sm:gap-4 overflow-x-scroll">
                      <pre className='text-[12px] sm:col-span-2 text-center '>{props.compareData['classf']}</pre>
                      <div className='text-center'>
                          <p className='text-[12px] text-left'>Main classification metrics. More about at <a className='text-blue-500' href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html">scikit docs</a></p>
                      </div>
                  </div>
                
                </dl>
              </div>
            </div>
            
            {props.compareData && (
                <Line options={options} data={roc_data} />
            )}
          </div>
          
            
        </div>
    )
}