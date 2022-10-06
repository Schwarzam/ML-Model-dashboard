import {GrClose} from 'react-icons/gr'

export default function Table(props){

    return(
        <div className="absolute top-0 w-full bg-gray-600/75 h-full" onClick={() => props.setVisu(null)}> 
            <GrClose size={20} className="cursor-pointer float-center mt-24 mx-auto mb-4" onClick={() => props.setVisu(null)} />
            <div className="m-auto max-w-5xl max-h-[600px] overflow-scroll overflow-x-scroll" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col">
                    <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                {Object.keys(props.table[0]).map(name => (
                                    <th key={name} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    {name}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {props.table.map((row, index) => (
                                <tr key={'tab' + index.toString()}>
                                {Object.keys(row).map((column, idx) => (
                                        
                                        <td key={index.toString() + idx.toString() + row[column]} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {row[column]}
                                        </td>
                                        
                                    )
                                )}
                                </tr>
                            ))
                            }

                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
    )
}