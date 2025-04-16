// import React, { useEffect, useState } from 'react'
// import { RadioGroup, RadioGroupItem } from './ui/radio-group'
// import { Label } from './ui/label'
// import { useDispatch } from 'react-redux'
// import { setSearchedQuery } from '@/redux/jobSlice'

// const fitlerData = [
//     {
//         fitlerType: "Location",
//         array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
//     },
//     {
//         fitlerType: "Industry",
//         array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
//     },
//     {
//         fitlerType: "Salary",
//         array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
//     },
// ]

// const FilterCard = () => {
//     const [selectedValue, setSelectedValue] = useState('');
//     const dispatch = useDispatch();
//     const changeHandler = (value) => {
//         setSelectedValue(value);
//     }
//     useEffect(()=>{
//         dispatch(setSearchedQuery(selectedValue));
//     },[selectedValue]);
//     return (
//         <div className='w-full bg-white p-3 rounded-md'>
//             <h1 className='font-bold text-lg'>Filter Jobs</h1>
//             <hr className='mt-3' />
//             <RadioGroup value={selectedValue} onValueChange={changeHandler}>
//                 {
//                     fitlerData.map((data, index) => (
//                         <div>
//                             <h1 className='font-bold text-lg'>{data.fitlerType}</h1>
//                             {
//                                 data.array.map((item, idx) => {
//                                     const itemId = `id${index}-${idx}`
//                                     return (
//                                         <div className='flex items-center space-x-2 my-2'>
//                                             <RadioGroupItem value={item} id={itemId} />
//                                             <Label htmlFor={itemId}>{item}</Label>
//                                         </div>
//                                     )
//                                 })
//                             }
//                         </div>
//                     ))
//                 }
//             </RadioGroup>
//         </div>
//     )
// }

// export default FilterCard


import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Patna", "Bangalore", "Mumbai", "Ahmedabad", "Rajkot","Pune"]
    },
    {
        fitlerType: "Industry",
        array: ["DevOps Engineer", "Database Administrator", "Cloud Engineer", "Machine Learning Engineer", "Blockchain Developer"]
    },
    // {
    //     fitlerType: "Salary",
    //     array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    // },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [isFilterVisible, setFilterVisible] = useState(false); // State to control filter visibility
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    // Update the searched query in the store whenever selectedValue changes
    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);

    // Handlers for the Add button to toggle the filter visibility
    const handleAddButtonClick = () => {
        setFilterVisible(!isFilterVisible);
    }

    // Clear filter handler
    const handleClearFilter = () => {
        setSelectedValue(''); 
        dispatch(setSearchedQuery('')); 
    }

    return (
        <div>
            <button
                onClick={handleAddButtonClick}
                className='bg-blue-600 text-white px-4 py-2 rounded'
            >
                Apply Filter
            </button>

            {isFilterVisible && (
                <div className='w-auto bg-white p-3 rounded-md'>
                    <h1 className='font-bold text-lg'>Filter Jobs</h1>
                    <hr className='mt-3' />

                    {/* Flexbox or Grid Container for Filter Types */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {
                            fitlerData.map((data, index) => (
                                <div key={index} className="filter-column">
                                    <h1 className='font-bold text-lg'>{data.fitlerType}</h1>

                                    {/* Wrap the RadioGroup for each filter type */}
                                    <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                                        {
                                            data.array.map((item, idx) => {
                                                const itemId = `id${index}-${idx}`;
                                                return (
                                                    <div className='flex items-center space-x-2 ' key={itemId}>
                                                        <RadioGroupItem value={item} id={itemId} />
                                                        <Label htmlFor={itemId}>{item}</Label>
                                                    </div>
                                                );
                                            })
                                        }
                                    </RadioGroup>
                                </div>
                            ))
                        }
                    </div>

                    {/* Clear Filter Button inside the pop-up */}
                    <div className="mt-4 text-center">
                        <button
                            className="clear-button"
                            onClick={handleClearFilter}
                        >
                            Clear Filter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterCard;
