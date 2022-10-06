import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


export default function Compare(props) {
  const [selected, setSelected] = useState('')
  const [query, setQuery] = useState('')

  const [tables, setTables] = useState([])

  useEffect(() => {
        if (props.tables){
            const tabls = []
            props.tables.map((tabs, index) => {
                if (!tabs.includes('predicted')){
                    tabls.push({'id': index, 'name': tabs})
                }
            })
            setTables(tabls)
        }
  }, [])
  
  const filteredTab =
    query === ''
      ? tables
      : tables.filter((obj) =>
          obj.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div className="absolute top-0 w-full bg-gray-900/75 h-full" onClick={() => props.setComparing(null)}>
        <div className="m-auto mt-32 max-w-2xl bg-gray-300 rounded" onClick={(e) => e.stopPropagation()}>
            <p className='m-auto text-center pt-4 font-bold text-lg'>Select the table that contains the true values. </p>
            <Combobox className="w-96 m-auto pt-8" autocomplete="new-password" value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <Combobox.Input
                    autocomplete="new-password"
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(tab) => tab.name}
                    onChange={(event) => setQuery(event.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <Combobox.Options className="absolute mt-1 max-h-60 w-96 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredTab.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                        </div>
                    ) : (
                        filteredTab.map((tab) => (
                        <Combobox.Option
                            key={tab.id}
                            className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? 'bg-teal-600 text-white' : 'text-gray-900'
                            }`
                            }
                            value={tab}
                        >
                            {({ selected, active }) => (
                            <>
                                <span
                                className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                }`}
                                >
                                {tab.name}
                                </span>
                                {selected ? (
                                <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? 'text-white' : 'text-teal-600'
                                    }`}
                                >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                ) : null}
                            </>
                            )}
                        </Combobox.Option>
                        ))
                    )}
                    </Combobox.Options>
                </Transition>
                </div>
            </Combobox>

            <p onClick={() => props.compareTable(props.comparing, selected.name)} className='py-2 px-2 w-24 m-auto center text-center cursor-pointer my-8 bg-white rounded'>compare</p>
            <div className='py-2'></div>
            
        </div>
    </div>
  )
}